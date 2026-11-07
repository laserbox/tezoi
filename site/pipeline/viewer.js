import * as THREE from './vendor/three.module.js';
import {OrbitControls} from './vendor/OrbitControls.js';

const DATA = new URL('./data/', import.meta.url);
async function json(path){const r=await fetch(new URL(path.replace(/^data\//,''),DATA));if(!r.ok)throw Error(`数据载入失败：${path}`);return r.json()}
async function binary(meta){const r=await fetch(new URL(meta.file, DATA));if(!r.ok)throw Error(meta.file);const b=await r.arrayBuffer(),a={};for(const [k,v] of Object.entries(meta.arrays)){const T=v.dtype==='<u4'?Uint32Array:Float32Array;a[k]=new T(b,v.offset,v.bytes/4)}return a}
function geometry(v,f){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(v.slice(),3));g.setIndex(new THREE.BufferAttribute(f,1));g.computeVertexNormals();return g}
function material(color,extra={}){return new THREE.MeshStandardMaterial({color,roughness:.47,metalness:.08,...extra})}

export class Inspector {
 constructor(el){
  this.el=el;this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});this.renderer.setPixelRatio(Math.min(Math.max(devicePixelRatio,1.5),2));this.renderer.setClearColor(0xe9eee6);this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.1;el.append(this.renderer.domElement);
  this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(37,1,.002,30);this.camera.up.set(0,0,1);this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.minDistance=.08;this.controls.maxDistance=3;this.controls.addEventListener('change',()=>this.render());this.worldLighting=new THREE.Group();this.scene.add(this.worldLighting);this.worldLighting.add(new THREE.HemisphereLight(0xffffff,0x89948a,1.35));
  this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFShadowMap;
  for(const [pos,power,color] of [[[1,-1,2],1.8,0xfff4e5],[[-1,1,1],.9,0xd7e7ff],[[0,2,.5],.6,0xffffff]]){const l=new THREE.DirectionalLight(color,power);l.position.set(...pos);if(power>1.5){l.castShadow=true;l.shadow.mapSize.set(4096,4096);Object.assign(l.shadow.camera,{left:-1.5,right:1.5,top:1.5,bottom:-1.5,near:.1,far:6});l.shadow.bias=-.00005;l.shadow.normalBias=.0003;l.shadow.radius=4;}this.worldLighting.add(l)}
  this.robot=new THREE.Group();this.human=new THREE.Group();this.scene.add(this.robot,this.human);this.human.visible=false;this.parts=[];this.skins=[];this.markers=[];this.frame=-1;this.mode='scene';this.humanMode='contact';
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(3,3),material(0xc8d1c4,{metalness:0,roughness:1}));plane.position.z=-.192;plane.receiveShadow=true;this.plane=plane;this.robot.add(plane);
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(el);
 }
 async loadRobot(){
  if(this.s)return;if(this.pending)return this.pending;
  this.pending=(async()=>{this.meta=await json('data/robot.json');[this.g,this.s]=await Promise.all([binary(this.meta.geometry),binary(this.meta.states)]);
   for(const p of this.meta.parts){let mat=p.kind==='arm'?material(0xcbd0cc,{roughness:.65,metalness:0}):material(p.body===58?0xc3dce2:0xa2c3c5,{transparent:true,opacity:p.body===58?.52:.38,roughness:.18,metalness:.1,side:THREE.DoubleSide,depthWrite:false});const m=new THREE.Mesh(geometry(this.g['v'+p.body],this.g['f'+p.body]),mat);m.matrixAutoUpdate=false;this.robot.add(m);this.parts.push({mesh:m,...p})}
   for(let i=0;i<2;i++){const n=this.g[`skin${i}_idx`].length/5;const m=new THREE.Mesh(geometry(new Float32Array(n*3),this.g[`skin${i}_face`]),material(0x343c3d,{roughness:.8,metalness:0}));this.robot.add(m);this.skins.push({mesh:m,idx:this.g[`skin${i}_idx`],w:this.g[`skin${i}_w`],loc:this.g[`skin${i}_loc`],n})}
   this.bulb=new THREE.Mesh(geometry(new Float32Array(3971*3),this.g.soft_faces),material(0x2c80b6,{roughness:.37,metalness:.02}));this.robot.add(this.bulb);
   for(const color of [0xe0a064,0x86b7c7,0x91b48b]){const m=new THREE.Mesh(new THREE.SphereGeometry(.0015,16,12),new THREE.MeshBasicMaterial({color,depthTest:true}));this.robot.add(m);this.markers.push(m)}
   this.robot.traverse(o=>{if(o.isMesh&&o!==this.plane&&!o.material.transparent){o.castShadow=true;o.receiveShadow=true;}});
  })();return this.pending;
 }
 async loadHuman(){
  if(this.hand)return;if(this.humanPending)return this.humanPending;this.humanPending=(async()=>{this.hm=await json('data/human.json');this.humanCameraMeta=await json('data/human-ego-camera.json');this.contactMeta=await json('data/contact-surface.json');[this.h,this.diagnostic]=await Promise.all([binary(this.hm.data),binary(this.contactMeta.data)]);this.hm.vertices=this.hm.data.arrays.vertices.shape[1];this.human.matrixAutoUpdate=false;
  this.detailCamera=new THREE.PerspectiveCamera(34,1,.001,3);this.detailCamera.up.set(0,1,0);
  this.humanLighting=new THREE.Group();this.scene.add(this.humanLighting);
  this.humanLighting.add(new THREE.HemisphereLight(0xe3f1f5,0x34434c,.6));
  this.humanLights=[];
  for(const [offset,power,color] of [[[-.3,-.28,-.55],3.0,0xfff4e5],[[.4,.1,-.35],.8,0xc2deee],[[.12,-.15,.3],1.6,0xe7f3f5]]){
   const l=new THREE.DirectionalLight(color,power);if(power===3){l.castShadow=true;l.shadow.mapSize.set(2048,2048);Object.assign(l.shadow.camera,{left:-.18,right:.18,top:.18,bottom:-.18,near:.03,far:2});l.shadow.bias=-.0001;l.shadow.normalBias=.00045;l.shadow.radius=2;}
   this.humanLighting.add(l,l.target);this.humanLights.push({light:l,offset:new THREE.Vector3(...offset)});
  }
  const geo=geometry(this.h.vertices.slice(0,778*3),this.h.faces);geo.setAttribute('color',new THREE.BufferAttribute(new Float32Array(778*3),3));this.hand=new THREE.Mesh(geo,material(0xffffff,{vertexColors:true,roughness:.63,metalness:0,side:THREE.DoubleSide}));this.hand.castShadow=true;this.hand.receiveShadow=true;this.human.add(this.hand);this.hObjects=[];
  for(const i of [2,3]){const m=new THREE.Mesh(geometry(this.h['object'+i+'_v'],this.h['object'+i+'_f']),material(i===3?0x297ba5:0xa8cbd2,{transparent:i===2,opacity:i===2?.45:1,depthWrite:i!==2,roughness:i===3?.68:.24,metalness:0,side:THREE.DoubleSide}));m.matrixAutoUpdate=false;m.castShadow=i===3;m.receiveShadow=i===3;this.hObjects.push(m);this.human.add(m)}
  const points=[];for(let f=0;f<5;f++){let last=0;for(let j=1+f*4;j<=4+f*4;j++){points.push(last,j);last=j}}
  const contourGeo=new THREE.BufferGeometry();contourGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(this.h.faces.length*2),3));this.humanContour=new THREE.LineSegments(contourGeo,new THREE.LineBasicMaterial({color:0xffe2ad,transparent:true,opacity:.85,depthTest:true}));this.human.add(this.humanContour);
  this.bones=points;const linegeo=new THREE.BufferGeometry();linegeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(points.length*3),3));this.skeleton=new THREE.LineSegments(linegeo,new THREE.LineBasicMaterial({color:0xd29561,depthTest:true,transparent:true,opacity:.9}));this.human.add(this.skeleton);
  const jointsGeo=new THREE.BufferGeometry();jointsGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(63),3));this.jointPoints=new THREE.Points(jointsGeo,new THREE.PointsMaterial({color:0xf0bd79,size:.003,sizeAttenuation:true,depthTest:true}));this.human.add(this.jointPoints);
  })();return this.humanPending;
 }
 async useHumanSeries(temporal){
  const request=this.humanSeriesRequest=(this.humanSeriesRequest||0)+1;await this.loadHuman();this.humanSeries??={raw:{hm:this.hm,h:this.h,camera:this.humanCameraMeta,diagnostic:this.diagnostic,contact:this.contactMeta}};
  const name=temporal?'temporal':'raw';
  if(!this.humanSeries[name]){const [hm,camera,contact]=await Promise.all([json('data/human-temporal.json'),json('data/human-temporal-camera.json'),json('data/contact-temporal-surface.json')]);const [h,diagnostic]=await Promise.all([binary(hm.data),binary(contact.data)]);this.humanSeries[name]={hm,h,camera,contact,diagnostic};}
  if(request!==this.humanSeriesRequest)return this.hm;const a=this.humanSeries[name];this.hm=a.hm;this.h=a.h;this.humanCameraMeta=a.camera;this.contactMeta=a.contact;this.diagnostic=a.diagnostic;this.humanFrame=-1;this.el.dataset.humanSeries=name;return this.hm;
 }
 async setMode(mode){if(mode==='human'){this.mode=mode;this.robot.visible=false;this.human.visible=true;await this.loadHuman();this.resize();return;}await this.loadRobot();this.mode=mode;this.robot.visible=mode!=='human';this.human.visible=mode==='human';if(mode==='human')await this.loadHuman();this.plane.visible=mode==='scene'||mode==='ego';for(const p of this.parts)p.mesh.visible=mode==='scene'||mode==='ego'||p.body>=55;this.skins[0].mesh.visible=mode!=='contact';this.frame=-1;this.resize()}
 state(t,rec){
  this.contactRecord=rec;
  if(!this.s||this.mode.startsWith('human'))return;const ts=this.s.time_s;let i=Math.min(ts.length-1,Math.max(0,Math.round(t*this.meta.display_sample_hz)));if(Math.abs(ts[i]-t)>.02){let best=0;for(let k=1;k<ts.length;k++)if(Math.abs(ts[k]-t)<Math.abs(ts[best]-t))best=k;i=best}
  if(i===this.frame)return ts[i];
  if(i!==this.frame){this.frame=i;const pp=i*59*3,rr=i*59*9;
   for(const p of this.parts){const b=p.body,r=rr+b*9,k=pp+b*3,R=this.s.rigid_rot,P=this.s.rigid_pos;p.mesh.matrix.set(R[r],R[r+1],R[r+2],P[k],R[r+3],R[r+4],R[r+5],P[k+1],R[r+6],R[r+7],R[r+8],P[k+2],0,0,0,1);p.mesh.matrixWorldNeedsUpdate=true}
   for(const sk of this.skins){const out=sk.mesh.geometry.attributes.position.array,R=this.s.rigid_rot,P=this.s.rigid_pos;out.fill(0);for(let v=0;v<sk.n;v++)for(let j=0;j<5;j++){const l=v*5+j,w=sk.w[l];if(w<1e-8)continue;const b=sk.idx[l],r=rr+b*9,p=pp+b*3,k=l*3,x=sk.loc[k],y=sk.loc[k+1],z=sk.loc[k+2];out[v*3]+=w*(P[p]+R[r]*x+R[r+1]*y+R[r+2]*z);out[v*3+1]+=w*(P[p+1]+R[r+3]*x+R[r+4]*y+R[r+5]*z);out[v*3+2]+=w*(P[p+2]+R[r+6]*x+R[r+7]*y+R[r+8]*z)}sk.mesh.geometry.attributes.position.needsUpdate=true;sk.mesh.geometry.computeVertexNormals();sk.mesh.geometry.computeBoundingSphere()}
   this.bulb.geometry.attributes.position.array.set(this.s.soft_nodes.subarray(i*3971*3,(i+1)*3971*3));this.bulb.geometry.attributes.position.needsUpdate=true;this.bulb.geometry.computeVertexNormals();this.bulb.geometry.computeBoundingSphere();
  }
  this.markers.forEach((m,k)=>{const p=rec?.cop_m?.[k];m.visible=this.mode==='contact'&&Array.isArray(p)&&p.length===3&&rec.force_N[k]>.005;if(m.visible)m.position.set(...p)});this.render();return ts[i];
 }
 humanState(frame,style='proximity'){
  if(!this.h)return;const i=Math.floor(Math.max(0,Math.min(this.hm.frames.length-1,frame)));if(this.humanFrame===i&&this.humanMode===style)return this.hm.frames[i].time_s;this.humanFrame=i;this.humanMode=style;this.hand.material.transparent=style==='pose';this.hand.material.opacity=style==='pose'?.22:1;this.hand.material.depthWrite=style!=='pose';this.hand.material.needsUpdate=true;const out=this.hand.geometry.attributes.position.array,v=this.h.vertices.subarray(i*778*3,(i+1)*778*3);out.set(v);const colors=this.hand.geometry.attributes.color.array;
  this.displayContactConfidence??=new Float32Array(778);const low=new THREE.Color(0xb9c6cd),mid=new THREE.Color(0xe6b96c),high=new THREE.Color(0xe7653e),near=new THREE.Color(0x54b6aa),inside=new THREE.Color(0xd278b0),c=new THREE.Color();for(let j=0;j<778;j++){
   const p=this.h.haco_probability[i*778+j],d=this.diagnostic.distance_mm[i*778+j],signed=this.diagnostic.normal_offset_mm[i*778+j];c.copy(low);
   if(style==='contact'){const confidence=this.h.contact_confidence?.[i*778+j]??p*Math.max(0,1-(d/3)**2)**2;this.displayContactConfidence[j]=signed>=-.2?confidence:0;if(signed>=-.2)c.lerp(high,Math.min(1,confidence));else if(d<=2)c.lerp(inside,.65);}
   if(style==='prior')c.copy(p<.5?low:mid).lerp(p<.5?mid:high,p<.5?p/.5:(p-.5)/.5);
   if(style==='proximity'&&d<=2)c.copy(signed<-.2?inside:near);
   colors.set([c.r,c.g,c.b],j*3);
  }
  this.hand.geometry.attributes.position.needsUpdate=true;this.hand.geometry.attributes.color.needsUpdate=true;this.hand.geometry.computeVertexNormals();this.hand.geometry.computeBoundingSphere();this.updateHumanContour(i,style);
  const r=i*9,k=i*3,R=this.h.rotation,P=this.h.translation;for(const o of this.hObjects){o.matrix.set(R[r],R[r+1],R[r+2],P[k],R[r+3],R[r+4],R[r+5],P[k+1],R[r+6],R[r+7],R[r+8],P[k+2],0,0,0,1);o.matrixWorldNeedsUpdate=true}
  const A=this.diagnostic.anchor_rotation,T=this.diagnostic.anchor;
  if(this.mode==='human-ego')this.human.matrix.identity();else this.human.matrix.set(A[r],A[r+1],A[r+2],-A[r]*T[k]-A[r+1]*T[k+1]-A[r+2]*T[k+2],A[r+3],A[r+4],A[r+5],-A[r+3]*T[k]-A[r+4]*T[k+1]-A[r+5]*T[k+2],A[r+6],A[r+7],A[r+8],-A[r+6]*T[k]-A[r+7]*T[k+1]-A[r+8]*T[k+2],0,0,0,1);this.human.matrixWorldNeedsUpdate=true;
  const bp=this.skeleton.geometry.attributes.position.array;this.bones.forEach((j,k)=>bp.set(this.h.joints.subarray(i*63+j*3,i*63+j*3+3),k*3));this.skeleton.geometry.attributes.position.needsUpdate=true;this.skeleton.geometry.computeBoundingSphere();this.skeleton.visible=style==='pose';this.jointPoints.geometry.attributes.position.array.set(this.h.joints.subarray(i*63,(i+1)*63));this.jointPoints.geometry.attributes.position.needsUpdate=true;this.jointPoints.geometry.computeBoundingSphere();this.jointPoints.visible=style==='pose';
  if(this.mode==='human-ego'){const center=new THREE.Vector3(...this.h.translation.subarray(k,k+3));for(const {light,offset} of this.humanLights){light.position.copy(center).add(offset);light.target.position.copy(center);}this.configureHumanEgoCamera();}
  this.render();return this.hm.frames[i].time_s;
 }
 updateHumanContour(frame,style){
  this.humanContour.visible=['contact','prior'].includes(style);if(!this.humanContour.visible)return;
  const verts=this.hand.geometry.attributes.position.array,normals=this.hand.geometry.attributes.normal.array,prob=style==='contact'?this.displayContactConfidence:this.h.haco_probability,offset=style==='contact'?0:frame*778,threshold=style==='contact'?.5:.75,faces=this.h.faces,out=this.humanContour.geometry.attributes.position.array;let count=0;
  for(let f=0;f<faces.length;f+=3){const crossing=[];for(let e=0;e<3;e++){const a=faces[f+e],b=faces[f+(e+1)%3],pa=prob[offset+a],pb=prob[offset+b];if((pa<threshold)===(pb<threshold))continue;const t=(threshold-pa)/(pb-pa),point=[];for(let k=0;k<3;k++)point.push(verts[a*3+k]*(1-t)+verts[b*3+k]*t+.0001*(normals[a*3+k]*(1-t)+normals[b*3+k]*t));crossing.push(point);}if(crossing.length===2){out.set(crossing[0],count);out.set(crossing[1],count+3);count+=6;}}
  this.humanContour.geometry.setDrawRange(0,count/3);this.humanContour.geometry.attributes.position.needsUpdate=true;this.humanContour.geometry.computeBoundingSphere();
 }
 reset(focus='all'){
  this.camera.clearViewOffset();
  if(this.mode==='human-ego'){this.configureHumanEgoCamera();this.render();return;}
  let target,position;if(this.mode==='human'){
   target=new THREE.Vector3(0,.075,0);position=target.clone().add(new THREE.Vector3(.04,-.035,.32));this.camera.up.set(0,1,0);
   this.hObjects[1].geometry.computeBoundingBox();this.human.updateMatrixWorld(true);const center=this.hObjects[1].geometry.boundingBox.getCenter(new THREE.Vector3()).applyMatrix4(this.hObjects[1].matrixWorld);
   this.detailCamera.up.set(0,0,1);this.detailCamera.position.copy(center).add(new THREE.Vector3(.045,.14,.075));this.detailCamera.lookAt(center);this.detailCamera.updateProjectionMatrix();
  }
  else{this.camera.up.set(0,0,1);const i=Math.max(0,this.frame),P=this.s.rigid_pos;
   if(this.mode.startsWith('ego')){target=new THREE.Vector3(0,.17,-.06);position=new THREE.Vector3(-.56,.17,.37)}
   else if(this.mode==='contact'||focus==='bulb'){this.bulb.geometry.computeBoundingBox();target=this.bulb.geometry.boundingBox.getCenter(new THREE.Vector3());target.z-=.025;position=target.clone().add(new THREE.Vector3(.30,.11,.17))}
   else if(focus==='vessels'){target=new THREE.Vector3(0,.12,-.10);position=target.clone().add(new THREE.Vector3(.40,.18,.26))}
   else{target=new THREE.Vector3(-.13,.09,.07);position=target.clone().add(new THREE.Vector3(1.20,-.03,.58))}
  }
  this.camera.fov=this.mode.startsWith('ego')?48:37;this.camera.updateProjectionMatrix();this.camera.position.copy(position);this.controls.target.copy(target);this.camera.lookAt(target);this.controls.update();this.configureContactCrop();this.render();
 }
 configureHumanEgoCamera(){
  if(this.mode!=='human-ego'||!this.humanCameraMeta)return;
  const meta=this.humanCameraMeta,K=meta.K,size=this.renderer.getSize(new THREE.Vector2());
  const near=['contact','prior','proximity'].includes(this.humanMode),b=near?meta.contact_relative_bounds_px:meta.hand_relative_bounds_px,pad=near?meta.contact_padding_px:meta.hand_padding_px;
  const i=Math.max(0,this.humanFrame||0),anchor=meta.anchor_frames[i].anchor_px;
  const aspect=size.x/size.y,cx=anchor[0]+(b[0]+b[2])/2,cy=anchor[1]+(b[1]+b[3])/2;
  const height=Math.max(b[3]-b[1]+2*pad,(b[2]-b[0]+2*pad)/aspect),width=height*aspect,x=cx-width/2,y=cy-height/2;
  this.camera.clearViewOffset();this.camera.position.set(0,0,0);this.camera.up.set(0,-1,0);this.camera.lookAt(0,0,1);this.camera.updateMatrixWorld(true);
  const n=this.camera.near;
  this.camera.projectionMatrix.makePerspective((x-K[0][2])/K[0][0]*n,(x+width-K[0][2])/K[0][0]*n,-(y-K[1][2])/K[1][1]*n,-(y+height-K[1][2])/K[1][1]*n,n,this.camera.far);
  this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert();
  this.el.dataset.humanCrop=JSON.stringify({x,y,width,height});
  this.el.dataset.humanCamera='source_estimated_intrinsics_bulb_locked_crop';
  this.el.dataset.humanFocus=near?'contact':'whole';
 }
 setHumanXray(enabled){
  this.humanXray=Boolean(enabled);if(!this.hObjects)return;
  const bulb=this.hObjects[1];bulb.material.transparent=this.humanXray;bulb.material.opacity=this.humanXray?.24:1;bulb.material.depthWrite=!this.humanXray;bulb.castShadow=!this.humanXray;bulb.material.needsUpdate=true;
  this.el.dataset.humanXray=String(this.humanXray);this.render();
 }
 configureContactCrop(){
  if(this.mode!=='ego-close'||!this.s){delete this.el.dataset.opticalCrop;return;}
  this.camera.clearViewOffset();this.camera.updateMatrixWorld(true);
  const size=this.renderer.getSize(new THREE.Vector2());if(size.x<1||size.y<1)return;
  this.camera.aspect=size.x/size.y;this.camera.updateProjectionMatrix();
  const ts=this.s.time_s,nodes=this.s.soft_nodes,p=new THREE.Vector3();let x0=1,y0=1,x1=0,y1=0;
  // A fixed optical crop covers the whole recorded grasp/transport interval.
  // Camera position, orientation and every saved state remain unchanged.
  for(let i=0;i<ts.length;i+=30){if(ts[i]<11.85||ts[i]>39.4)continue;
   for(let j=0;j<3971;j+=80){const k=(i*3971+j)*3;p.set(nodes[k],nodes[k+1],nodes[k+2]).project(this.camera);const x=(p.x+1)/2,y=(1-p.y)/2;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
  }
  const scale=Math.min(1,Math.max(.43,x1-x0+.20,y1-y0+.20));
  const cx=Math.max(scale/2,Math.min(1-scale/2,(x0+x1)/2)),cy=Math.max(scale/2,Math.min(1-scale/2,(y0+y1)/2));
  this.camera.setViewOffset(size.x,size.y,(cx-scale/2)*size.x,(cy-scale/2)*size.y,size.x*scale,size.y*scale);
  this.el.dataset.opticalCrop=JSON.stringify({x:cx-scale/2,y:cy-scale/2,scale,bounds:[x0,y0,x1,y1]});
 }
 contactProjection(){
  if(!this.onContacts||!['ego-contact','ego-close'].includes(this.mode)||!this.contactRecord)return;
  const cameraPosition=this.camera.getWorldPosition(new THREE.Vector3());this.contactRay??=new THREE.Raycaster();
  const bodies=[...this.skins.map(s=>s.mesh),this.bulb];
  const data=[0,1,2].map(i=>{
   const position=this.contactRecord.cop_m?.[i],force=this.contactRecord.force_N[i];
   if(!Array.isArray(position)||position.length!==3||!position.every(Number.isFinite)||force<=.005)return {index:i,force,active:false};
   const point=new THREE.Vector3(...position),direction=point.clone().sub(cameraPosition),length=direction.length();
   this.contactRay.set(cameraPosition,direction.normalize());this.contactRay.far=Math.max(0,length-.001);
   const occluded=this.contactRay.intersectObjects(bodies,false).length>0;
   const screen=point.project(this.camera);return {index:i,force,active:true,occluded,x:(screen.x+1)/2,y:(1-screen.y)/2,inFrame:Math.abs(screen.x)<=1&&Math.abs(screen.y)<=1&&screen.z>=-1&&screen.z<=1,position};
  });
  this.onContacts(data);this.el.dataset.contactProjection=JSON.stringify(data);
 }
 resize(){const {width,height}=this.el.getBoundingClientRect();if(width<1||height<1)return;this.renderer.setSize(width,height,false);this.camera.aspect=width/height;this.camera.updateProjectionMatrix();this.configureContactCrop();this.configureHumanEgoCamera();this.render()}
 render(){
  if(this.el.hidden)return;
  const size=this.renderer.getSize(new THREE.Vector2()),w=size.x,h=size.y;
  const split=this.mode==='human'&&this.detailCamera;
  this.renderer.setScissorTest(false);this.renderer.setViewport(0,0,w,h);
  if(!split){this.renderer.render(this.scene,this.camera);this.el.dataset.cameraPose=JSON.stringify(this.camera.matrixWorld.elements);this.contactProjection();return;}
  const stacked=w<520,main=stacked?{x:0,y:h*.47,w,h:h*.53}:{x:0,y:0,w:w*.61,h},detail=stacked?{x:0,y:0,w,h:h*.47}:{x:w*.61,y:0,w:w*.39,h};
  this.renderer.clear();this.renderer.setScissorTest(true);
  for(const [camera,v] of [[this.camera,main],[this.detailCamera,detail]]){camera.aspect=v.w/v.h;camera.updateProjectionMatrix();this.renderer.setViewport(v.x,v.y,v.w,v.h);this.renderer.setScissor(v.x,v.y,v.w,v.h);this.renderer.render(this.scene,camera);}
  this.renderer.setScissorTest(false);this.renderer.setViewport(0,0,w,h);
 }
}
