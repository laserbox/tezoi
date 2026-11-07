import * as THREE from './vendor/three.module.js';
import {Inspector} from './viewer.js';

export class EgoInspector extends Inspector {
  constructor(el) {super(el);this.egoScene=new THREE.Group();this.scene.add(this.egoScene);this.egoScene.visible=false;}
  async loadEgoScene(){
    if(this.cloud)return;
    if(this.egoPending)return this.egoPending;
    this.egoPending=(async()=>{
    this.egoMeta=await fetch(new URL('./data/ego-scene.json',import.meta.url)).then(r=>r.json());
    const meta=this.egoMeta.data;
    const bin=await fetch(new URL('./data/'+meta.file,import.meta.url)).then(r=>r.arrayBuffer());
    const a={};for(const [k,v] of Object.entries(meta.arrays))a[k]=new (v.dtype==='<u4'?Uint32Array:Float32Array)(bin,v.offset,v.bytes/4);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(a.points,3));g.setAttribute('color',new THREE.BufferAttribute(a.colors,3));
    this.cloud=new THREE.Points(g,new THREE.PointsMaterial({size:.008,vertexColors:true,transparent:true,opacity:1}));this.egoScene.add(this.cloud);
    this.cad=new THREE.Group();this.egoScene.add(this.cad);
    for(const obj of this.egoMeta.assets){
      const i=obj.id,geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(a['v_'+i],3));geo.setIndex(new THREE.BufferAttribute(a['f_'+i],1));geo.computeVertexNormals();
      const glass=i<3;const color=[0xd5e3d9,0xc7d8d8,0xd4e5e7,0x2587b7,0x304e9c,0xc1b538][i];
      const mat=new THREE.MeshPhysicalMaterial({color,roughness:glass?.12:.39,metalness:0,transparent:glass,opacity:glass?.36:1,side:THREE.DoubleSide,depthWrite:!glass,clearcoat:.3});
      this.cad.add(new THREE.Mesh(geo,mat));
    }
    })();return this.egoPending;
  }
  async setMode(mode){
    const request=this.modeRequest=(this.modeRequest||0)+1;
    if(mode==='cloud'||mode==='assets')await this.loadEgoScene();
    else if(mode.startsWith('human'))await this.loadHuman();
    else await this.loadRobot();
    if(request!==this.modeRequest)return;
    this.renderer.setClearColor(mode==='cloud'?0x182a29:mode==='human-ego'?0x1e3038:0xe9eee6);
    this.controls.maxDistance=mode==='cloud'?20:3;
    this.egoScene.visible=mode==='cloud'||mode==='assets';
    this.mode=mode;this.controls.enabled=!(mode.startsWith('ego')||mode==='human-ego');this.robot.visible=!this.egoScene.visible&&!mode.startsWith('human');this.human.visible=mode.startsWith('human');if(this.human.visible)this.humanFrame=-1;if(this.humanLighting)this.humanLighting.visible=this.human.visible;this.worldLighting.visible=!this.human.visible;
    // The old 2 mm / 30 m range squandered depth precision at the wrists.
    // These are display frusta only; no saved body or camera pose is altered.
    this.camera.near=mode==='human-ego'?.08:mode.startsWith('ego')?.03:.002;
    this.camera.far=mode==='human-ego'||mode.startsWith('ego')?6:30;
    this.el.dataset.depthRange=JSON.stringify([this.camera.near,this.camera.far]);
    if(this.egoScene.visible){this.cloud.visible=mode==='cloud';this.cad.visible=mode==='assets';}
    if(this.robot.visible){
      const overview=mode==='scene'||mode.startsWith('ego');
      this.plane.visible=overview;
      for(const p of this.parts)p.mesh.visible=overview||p.body>=55;
      this.skins[0].mesh.visible=mode!=='contact';this.frame=-1;
    }
    this.resize();
  }
  reset(focus){
    if(this.mode.startsWith('human')){
      super.reset(focus);return;
    }
    if(this.mode==='cloud'||this.mode==='assets'){
      this.camera.clearViewOffset();
      this.camera.up.set(0,0,1);this.camera.fov=37;
      if(this.mode==='cloud'){
        this.cloud.geometry.computeBoundingSphere();const sphere=this.cloud.geometry.boundingSphere;
        this.controls.target.copy(sphere.center);this.camera.position.copy(sphere.center).add(new THREE.Vector3(1.6,.6,2.1).normalize().multiplyScalar(sphere.radius*3.5));
      }else{this.controls.target.set(.65,0,1.06);this.camera.position.set(1.17,.12,1.42);}
      this.camera.updateProjectionMatrix();this.controls.update();this.render();return;
    }
    super.reset(focus);
  }
}
