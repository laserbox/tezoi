import * as THREE from './vendor/three.module.js';
import {EgoInspector} from './ego-viewer.js';
import {HandDisplaySurface} from './hand-display-surface.js';

// Human-only presentation. The inherited robot playback and all stored geometry
// remain unchanged. Neither colour nor a closest neighbour is a force sensor.
export class ContactInspector extends EgoInspector {
  constructor(el){super(el);this.selectedHumanFinger=-1;}
  async loadHuman(){
    await super.loadHuman();
    if(this.inspection)return;
    this.inspectionPending??=fetch(new URL('./data/human-contact-inspection.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('手部接触记录未能载入');return r.json();});
    this.inspection=await this.inspectionPending;
    this.padColours=this.inspection.colors.map(c=>new THREE.Color(c));
    this.padRay=new THREE.Raycaster();
    // Separate, small geometry markers are depth-tested and cannot shine through
    // the bulb or another finger. Hidden counterparts are described in the UI.
    this.padMarkers=this.padColours.map(color=>{
      const m=new THREE.Mesh(new THREE.SphereGeometry(.00045,12,8),new THREE.MeshBasicMaterial({color,depthTest:true}));
      m.visible=false;this.human.add(m);return m;
    });
    this.hand.material.roughness=.76;
    this.hand.material.metalness=0;
    this.hand.material.side=THREE.FrontSide;
    this.hand.material.needsUpdate=true;
    const recipe=await fetch(new URL('./data/human-display-surface.json',import.meta.url)).then(r=>r.json());
    this.displaySurface=new HandDisplaySurface(recipe,this.hand,this.h);this.human.add(this.displaySurface.mesh);
    for(const {light} of this.humanLights)if(light.castShadow){light.shadow.mapSize.set(4096,4096);light.shadow.normalBias=.0003;light.shadow.bias=-.0001;light.shadow.radius=3;}
  }
  fingerPoint(frame,index){
    if(this.inspection.anchor_vertices){
      const p=new THREE.Vector3();
      for(let k=0;k<3;k++)p.addScaledVector(new THREE.Vector3().fromArray(this.h.vertices,(frame*778+this.inspection.anchor_vertices[index][k])*3),this.inspection.anchor_weights[index][k]);
      return p;
    }
    const series=this.el.dataset.humanSeries||'raw',record=this.inspection.series[series].frames[frame][index];
    return new THREE.Vector3().fromArray(this.h.vertices,(frame*778+record.vertex)*3);
  }
  selectHumanFinger(index){
    this.selectedHumanFinger=index;this.humanFrame=-1;
  }
  configureHumanEgoCamera(){
    super.configureHumanEgoCamera();
    if(this.mode!=='human-ego'||!this.humanCameraMeta||!this.inspection||this.humanFrame<0)return;
    if(!['contact','prior','proximity'].includes(this.humanMode))return;
    const meta=this.humanCameraMeta,K=meta.K,size=this.renderer.getSize(new THREE.Vector2());
    if(size.x<1||size.y<1)return;
    const anchor=meta.anchor_frames[this.humanFrame].anchor_px;
    const sel=this.selectedHumanFinger;
    // The source optical axis never rotates. Selection changes image crop only.
    // A constant crop scale avoids apparent size pumping between frames.
    let cx=anchor[0]+37,cy=anchor[1]+32,height=142;
    if(sel>=0){
      const series=this.el.dataset.humanSeries||'raw';
      const record=this.inspection.series[series].frames[this.humanFrame][sel];
      const p=this.fingerPoint(this.humanFrame,sel).toArray();
      cx=p[0]/p[2]*K[0][0]+K[0][2];cy=p[1]/p[2]*K[1][1]+K[1][2];height=75;
    }
    const aspect=size.x/size.y;if(aspect<1)height=Math.max(height,132/aspect);
    const width=height*aspect,x=cx-width/2,y=cy-height/2,n=this.camera.near;
    this.camera.projectionMatrix.makePerspective((x-K[0][2])/K[0][0]*n,(x+width-K[0][2])/K[0][0]*n,-(y-K[1][2])/K[1][1]*n,-(y+height-K[1][2])/K[1][1]*n,n,this.camera.far);
    this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert();
    this.el.dataset.humanCrop=JSON.stringify({x,y,width,height,selection:sel});
  }
  humanState(frame,style='contact'){
    const signature=[this.el.dataset.humanSeries,frame,style,this.selectedHumanFinger,this.humanXray,this.el.clientWidth,this.el.clientHeight].join(':');
    if(this.inspectedSignature===signature&&this.humanFrame>=0)return this.hm.frames[this.humanFrame].time_s;
    this.updatingHuman=true;
    const time=super.humanState(frame,style);
    this.updatingHuman=false;
    if(!this.inspection||!this.h||!this.displaySurface)return time;
    const i=this.humanFrame,colors=this.hand.geometry.attributes.color.array;
    const base=new THREE.Color(0xc7ced0),inward=new THREE.Color(0xbf62aa),c=new THREE.Color();
    if(style==='contact'){
      for(let j=0;j<778;j++){
        const finger=this.inspection.owner[j],distance=this.diagnostic.distance_mm[i*778+j],signed=this.diagnostic.normal_offset_mm[i*778+j];
        const valid=finger>=0&&signed>=-.2;
        const closeness=valid?Math.max(0,Math.min(1,(this.inspection.fade_mm-distance)/.75)):0;
        const weight=closeness*closeness*(3-2*closeness);
        c.copy(base);
        if(valid&&(this.selectedHumanFinger<0||finger===this.selectedHumanFinger))c.lerp(this.padColours[finger],weight*.95);
        if(distance<1.5&&signed<-.2)c.lerp(inward,.8);
        colors.set([c.r,c.g,c.b],j*3);
        this.displayContactConfidence[j]=valid?weight:0;
      }
      this.hand.geometry.attributes.color.needsUpdate=true;
      this.updateHumanContour(i,style);
      this.humanContour.material.color.set(0xf2ddb5);this.humanContour.material.opacity=.8;
    }
    const series=this.el.dataset.humanSeries||'raw';
    const row=this.inspection.series[series].frames[i];
    this.displaySurface.update(this.h,i,this.hand);
    this.el.dataset.handDisplayAudit=JSON.stringify(this.displaySurface.lastAudit);
    this.displaySurface.mesh.visible=style!=='pose';this.hand.visible=style==='pose';
    this.human.updateMatrixWorld(true);this.camera.updateMatrixWorld(true);
    const obstacles=[this.displaySurface.mesh,...this.hObjects];
    const records=row.map((r,f)=>{
      const p=this.fingerPoint(i,f);
      const world=p.clone().applyMatrix4(this.human.matrixWorld);
      const direction=world.clone().sub(this.camera.position),distance=direction.length();
      this.padRay.set(this.camera.position,direction.normalize());this.padRay.far=Math.max(0,distance-.00015);
      const hit=this.padRay.intersectObjects(obstacles,false).find(h=>h.object!==this.hObjects[1]||!this.humanXray);
      const screen=world.clone().project(this.camera);
      const marker=this.padMarkers[f];marker.position.copy(p);marker.visible=style==='contact'&&(r.landmark_gap_mm??r.gap_mm)<=1&&r.local_normal_offset_mm>=-.2&&(this.selectedHumanFinger<0||f===this.selectedHumanFinger);
      return {...r,index:f,x:(screen.x+1)/2,y:(1-screen.y)/2,occluded:!!hit,inFrame:Math.abs(screen.x)<1&&Math.abs(screen.y)<1,landmarkNear:(r.landmark_gap_mm??r.gap_mm)<=1,near:r.gap_mm<=1&&r.local_normal_offset_mm>=-.2};
    });
    this.el.dataset.humanContactRecords=JSON.stringify(records);
    this.onHumanContacts?.(records);
    this.inspectedSignature=signature;
    this.render();return time;
  }
  render(){if(!this.updatingHuman)super.render();}
  resize(){
    super.resize();
    if(this.mode==='human-ego'&&this.displaySurface&&this.humanFrame>=0){
      const frame=this.humanFrame,style=this.humanMode;this.inspectedSignature=null;this.humanState(frame,style);
    }
  }
}
