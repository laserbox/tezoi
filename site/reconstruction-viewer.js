import { GaussianRenderer } from './assets/photara-webgs/renderer.js';
import { PlyLoader } from './assets/photara-webgs/loader.js';
import { StudioControls } from './assets/photara-webgs/studio-controls.js';

/** Full Photara model, loaded only after the visitor chooses to enter. */
export async function mountReconstruction(root, { onStatus, onError, source }) {
  const host = root.querySelector('[data-school-canvas]');
  const navigation = root.querySelector('[data-school-navigation]');
  const panel = host.closest('[data-school-panel]');
  const canvas = document.createElement('canvas');
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', '三维重建场景：左键环绕，中键平移，按住右键和 WASD/QE 移动');
  host.replaceChildren(canvas);
  const abort = new AbortController(), loader = new PlyLoader();
  let renderer, controls, resize, frame = 0, last = 0, active = false, disposed = false;
  const stop = () => {
    active = false; cancelAnimationFrame(frame); frame = 0; last = 0;
    controls?.keys.clear(); if (controls) controls.drag = null;
  };
  const invalidate = () => {
    if (active && !disposed && !document.hidden && !frame) frame = requestAnimationFrame(draw);
  };
  function draw(time) {
    frame = 0;
    if (!active || document.hidden || disposed) return;
    const box = host.getBoundingClientRect();
    if (box.width < 1 || box.height < 1) return;
    const moving = controls.update(last ? Math.min(.05, (time - last) / 1000) : 1 / 60);
    last = time;
    // Cap output at 1440 CSS pixels wide; avoid multiplying GUT overdraw by DPR.
    const scale = Math.min(1, 1440 / box.width);
    try {
      renderer.render(controls.camera(Math.max(1, Math.round(box.width * scale)), Math.max(1, Math.round(box.height * scale))));
      if (moving) invalidate();
    } catch (error) { stop(); onError(error); }
  }
  function dispose() {
    if (disposed) return;
    disposed = true; stop(); abort.abort(); loader.dispose(); resize?.disconnect();
    controls?.dispose(); renderer?.dispose(); canvas.remove(); navigation.hidden = true;
  }
  try {
    const response = await fetch(new URL('./assets/reconstruction/scene.json', import.meta.url), { signal: abort.signal });
    if (!response.ok) throw new Error(`场景配置 HTTP ${response.status}`);
    const scene = await response.json();
    renderer = await GaussianRenderer.create(canvas, { onError: error => { stop(); onError(error); } });
    const required = source ? 0 : scene.count * 16 * 3 * 4;
    if (Math.min(renderer.device.limits.maxStorageBufferBindingSize, renderer.device.limits.maxBufferSize) < required) {
      throw new Error('此设备的 GPU 单缓冲区容量不足，完整场景需要至少 550 MiB');
    }
    controls = new StudioControls(canvas, scene.initialCamera, invalidate);
    controls.sceneRadius = scene.navigationRadius;
    let buffer, baseUrl;
    if (source) {
      if (source.size > 1024 ** 3) throw new Error('模型文件超过 1 GiB 大小限制');
      onStatus('正在读取模型文件…');
      buffer = await source.arrayBuffer();
    } else {
      onStatus(`正在下载完整场景：0%（约 ${(scene.bytes / 1e6).toFixed(1)} MB）`);
      const modelResponse = await fetch(new URL(scene.url, document.baseURI), { signal: abort.signal });
      if (!modelResponse.ok) throw new Error(`模型下载 HTTP ${modelResponse.status}`);
      // One allocation avoids retaining and concatenating hundreds of MB of chunks.
      const bytes = new Uint8Array(scene.bytes), reader = modelResponse.body.getReader();
      let offset = 0, progress = -1;
      try {
        while (true) {
          const { done, value } = await reader.read(); if (done) break;
          if (offset + value.length > bytes.length) throw new Error('模型大小与配置不一致');
          bytes.set(value, offset); offset += value.length;
          const percent = Math.floor(offset / bytes.length * 100);
          if (percent !== progress) { progress = percent; onStatus(`正在下载完整场景：${percent}%（约 ${(scene.bytes / 1e6).toFixed(1)} MB）`); }
        }
      } finally { await reader.cancel().catch(() => {}); }
      if (offset !== bytes.length) throw new Error('模型下载不完整');
      buffer = bytes.buffer; baseUrl = modelResponse.url;
    }
    onStatus('正在解析模型并上传 GPU，请稍候…');
    const model = await loader.parse(buffer, { name: source?.name || 'TEZOI · Scene Reconstruction', baseUrl });
    if (!source) {
      model.renderMethod = scene.renderMethod || model.renderMethod;
      model.filterMode = scene.filterMode || model.filterMode;
    }
    await renderer.setModel(model); loader.dispose();
    await renderer.device.queue.onSubmittedWorkDone();
    const listen = (target, event, fn) => target.addEventListener(event, fn, { signal: abort.signal });
    listen(root.querySelector('[data-school-navigation-mode]'), 'change', event => {
      controls.mode = event.target.value; controls.keys.clear(); invalidate();
    });
    controls.mode = root.querySelector('[data-school-navigation-mode]').value;
    listen(root.querySelector('[data-school-reset]'), 'click', () => { controls.reset(); invalidate(); canvas.focus({ preventScroll: true }); });
    listen(root.querySelector('[data-school-fullscreen]'), 'click', async () => {
      try {
        if (document.fullscreenElement === panel) await document.exitFullscreen();
        else await panel.requestFullscreen();
      } catch { onStatus('当前浏览器未允许全屏，可继续在页面内探索。'); }
    });
    listen(document, 'visibilitychange', () => { controls.keys.clear(); controls.drag = null; last = 0; invalidate(); });
    resize = new ResizeObserver(invalidate); resize.observe(host);
    navigation.hidden = false;
    const api = { start() { if (disposed) return; active = true; last = 0; invalidate(); }, stop, dispose };
    return api;
  } catch (error) { dispose(); throw error; }
}
