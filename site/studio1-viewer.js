// The existing laboratory bundle contains Three.js and the glTF/orbit addons.
// Reuse the same runtime so this viewer does not need a second copy or a CDN.
import { WebGLRenderer, Scene, Color, PerspectiveCamera, OrbitControls, GLTFLoader, MeshBasicMaterial, SRGBColorSpace } from './laboratory-viewer.js?v=studio1-baked-20261029b';

export async function mountStudio1Viewer(root) {
  const viewport = root.querySelector('[data-scene-viewport]');
  const status = root.querySelector('[data-scene-status]');
  const zoomIn = root.querySelector('[data-scene-zoom-in]');
  const zoomOut = root.querySelector('[data-scene-zoom-out]');
  const reset = root.querySelector('[data-scene-reset]');
  const abort = new AbortController();
  let renderer, scene, camera, controls, model, observer, manifest;
  let disposed = false, visible = false, pendingFrame = 0, ready = false;

  function fail(error) {
    if (disposed) return;
    console.error(error);
    visible = false;
    root.dispatchEvent(new CustomEvent('scene-viewer-error'));
  }
  function schedule() {
    if (!disposed && visible && !root.hidden && !document.hidden && !pendingFrame)
      pendingFrame = requestAnimationFrame(draw);
  }
  function draw() {
    pendingFrame = 0;
    if (disposed || !visible || root.hidden || document.hidden) return;
    try {
      const moving = controls.update();
      renderer.render(scene, camera);
      if (!ready) {
        ready = true; status.hidden = true;
        viewport.dataset.state = 'ready'; viewport.setAttribute('aria-busy', 'false');
      }
      if (moving) schedule();
    } catch (error) { fail(error); }
  }
  function resize() {
    if (!renderer || !camera || !manifest) return;
    const width = viewport.clientWidth, height = viewport.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const ref = manifest.camera;
    // Retain the source camera's horizontal field of view for any viewport.
    const halfVertical = ref.verticalFovDegrees * Math.PI / 360;
    camera.fov = 2 * Math.atan(Math.tan(halfVertical) * ref.referenceAspect / camera.aspect) * 180 / Math.PI;
    camera.updateProjectionMatrix();
    schedule();
  }
  function resetCamera() {
    const source = manifest.camera;
    controls.enableDamping = false;
    controls.update(); // Clear any remaining rotation/zoom inertia first.
    camera.position.fromArray(source.position);
    controls.target.fromArray(source.target);
    controls.update(); controls.enableDamping = true;
    schedule();
  }
  function dispose() {
    if (disposed) return;
    disposed = true; visible = false;
    cancelAnimationFrame(pendingFrame); abort.abort(); observer?.disconnect(); controls?.dispose();
    const geometries = new Set(), materials = new Set(), textures = new Set();
    model?.traverse(obj => {
      if (obj.geometry) geometries.add(obj.geometry);
      for (const material of Array.isArray(obj.material) ? obj.material : [obj.material]) {
        if (!material) continue;
        materials.add(material);
        for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
      }
    });
    textures.forEach(x => x.dispose()); materials.forEach(x => x.dispose()); geometries.forEach(x => x.dispose());
    renderer?.dispose(); renderer?.forceContextLoss(); renderer?.domElement.remove();
    zoomIn.disabled = zoomOut.disabled = reset.disabled = true;
  }
  try {
    status.textContent = '正在加载烘焙后的三维场景…';
    viewport.setAttribute('aria-busy', 'true');
    const manifestURL = new URL(root.dataset.sceneManifest, document.baseURI);
    const response = await fetch(manifestURL, { signal: abort.signal });
    if (!response.ok) throw new Error(`场景配置加载失败：${response.status}`);
    manifest = await response.json();
    if (disposed) throw new DOMException('Viewer disposed', 'AbortError');

    renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = SRGBColorSpace;
    const canvas = renderer.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute('aria-label', '实验室三维场景。拖动旋转，滚轮缩放，右键平移。方向键平移，Shift 加方向键旋转。');
    canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); fail(new Error('WebGL 上下文已丢失')); }, { signal: abort.signal });
    viewport.prepend(canvas);
    scene = new Scene(); scene.background = new Color('#dce2e1');
    camera = new PerspectiveCamera(45, 1, manifest.camera.near, manifest.camera.far);
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true; controls.dampingFactor = .12;
    controls.rotateSpeed = .35; controls.minDistance = .12; controls.maxDistance = 32;
    controls.maxPolarAngle = Math.PI * .98; controls.listenToKeyEvents(canvas);
    controls.addEventListener('change', schedule);

    const gltf = await new GLTFLoader().loadAsync(new URL(manifest.model, manifestURL).href);
    model = gltf.scene;
    if (disposed) throw new DOMException('Viewer disposed', 'AbortError');
    // The texture already contains the source lighting and display transform.
    // MeshBasicMaterial displays it without applying a second set of lights.
    model.traverse(obj => {
      if (!obj.isMesh) return;
      const convert = original => {
        if (!original?.map) throw new Error(`网格缺少烘焙纹理：${obj.name}`);
        const baked = new MeshBasicMaterial({ map: original.map, side: original.side });
        original.dispose();
        return baked;
      };
      obj.material = Array.isArray(obj.material) ? obj.material.map(convert) : convert(obj.material);
    });
    scene.add(model);
    const zoom = factor => {
      camera.position.sub(controls.target).multiplyScalar(factor).add(controls.target);
      controls.update(); schedule();
    };
    zoomIn.addEventListener('click', () => zoom(.85), { signal: abort.signal });
    zoomOut.addEventListener('click', () => zoom(1 / .85), { signal: abort.signal });
    reset.addEventListener('click', resetCamera, { signal: abort.signal });
    canvas.addEventListener('keydown', event => {
      if (['+', '=', '-', 'Home'].includes(event.key)) {
        event.preventDefault();
        if (event.key === 'Home') resetCamera(); else zoom(event.key === '-' ? 1 / .85 : .85);
      }
    }, { signal: abort.signal });
    zoomIn.disabled = zoomOut.disabled = reset.disabled = false;
    observer = new ResizeObserver(() => { try { resize(); } catch (error) { fail(error); } });
    observer.observe(viewport);
    resize(); resetCamera();
    return {
      pause() { visible = false; cancelAnimationFrame(pendingFrame); pendingFrame = 0; },
      dispose,
      setVisible(value) { visible = Boolean(value) && !disposed; if (visible) { resize(); schedule(); } },
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
