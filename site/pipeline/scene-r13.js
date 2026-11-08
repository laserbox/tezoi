import * as THREE from './vendor/three.module.js';
import {OrbitControls} from './vendor/OrbitControls.js';

export async function createSceneCloud(container) {
  const meta = await fetch(new URL('./data/scene-frame102-r13.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Point cloud unavailable');return r.json();});
  const buffer = await fetch(new URL('./data/'+meta.file,import.meta.url)).then(r=>{if(!r.ok)throw Error('Point cloud unavailable');return r.arrayBuffer();});
  const packed=new Float32Array(buffer),positions=new Float32Array(meta.points*3),colors=new Float32Array(meta.points*3);
  for(let i=0;i<meta.points;i++){positions.set(packed.subarray(i*6,i*6+3),i*3);colors.set(packed.subarray(i*6+3,i*6+6),i*3);}
  const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x0d1d22);container.append(renderer.domElement);
  const scene=new THREE.Scene(),geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
  const material=new THREE.PointsMaterial({size:.0038,vertexColors:true,sizeAttenuation:true});
  material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nif (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;');};
  const cloud=new THREE.Points(geometry,material);scene.add(cloud);
  const camera=new THREE.PerspectiveCamera(28,1,.01,10);camera.up.set(0,-1,0);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=false;controls.enableZoom=false;controls.enablePan=false;controls.rotateSpeed=.6;
  const draw=()=>renderer.render(scene,camera);
  const resize=()=>{const {width,height}=container.getBoundingClientRect();if(width<1||height<1)return;renderer.setSize(width,height);camera.aspect=width/height;camera.fov=THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(14))*Math.max(1,1.6/camera.aspect)));camera.updateProjectionMatrix();draw();};
  const reset=()=>{controls.target.set(...meta.center);camera.position.set(meta.center[0]-.14,meta.center[1]-.11,.12);camera.lookAt(controls.target);controls.update();draw();};
  controls.addEventListener('change',draw);new ResizeObserver(resize).observe(container);resize();reset();
  renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label','同一来源帧的相对深度点云，可拖动旋转');
  renderer.domElement.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home')reset();else{const offset=camera.position.clone().sub(controls.target);offset.applyAxisAngle(camera.up,(e.key==='ArrowLeft'?1:-1)*.1);camera.position.copy(controls.target).add(offset);controls.update();draw();}});
  return {reset,resize,meta};
}
