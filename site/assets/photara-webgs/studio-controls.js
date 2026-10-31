// Port of apps/editor/sparse_view.cpp camera basis and navigation equations.
const add=(a,b,s=1)=>a.map((v,i)=>v+b[i]*s),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>{const n=Math.hypot(...a);return a.map(v=>v/n);};
const rotate=(v,a,t)=>add(add(v.map(x=>x*Math.cos(t)),cross(a,v),Math.sin(t)),a,dot(a,v)*(1-Math.cos(t)));
export class StudioControls {
  constructor(canvas,initial,invalidate){this.canvas=canvas;this.initial=initial;this.invalidate=invalidate;this.keys=new Set();this.mode='turntable';this.sceneRadius=1;this.speed=1;this.reset();
    canvas.oncontextmenu=e=>e.preventDefault();
    canvas.onpointerdown=e=>{canvas.focus();canvas.setPointerCapture(e.pointerId);this.drag={x:e.clientX,y:e.clientY,button:e.button};};
    canvas.onpointerup=canvas.onpointercancel=canvas.onlostpointercapture=()=>this.drag=null;
    canvas.onpointermove=e=>{if(!this.drag)return;const dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;this.drag.x=e.clientX;this.drag.y=e.clientY;const b=this.basis();
      if((this.drag.button===0&&!e.shiftKey)||this.drag.button===2){
        if(this.mode==='trackball'||this.mode==='fly'){
          const f=rotate(rotate(b.f,b.up,-dx*.008),rotate(b.r,b.up,-dx*.008),-dy*.008),r=rotate(b.r,b.up,-dx*.008);
          this.pitch=Math.asin(Math.max(-1,Math.min(1,f[1])));if(Math.hypot(f[0],f[2])>1e-6)this.yaw=Math.atan2(-f[0],-f[2]);
          const level=this.levelRight(f);this.roll=Math.atan2(dot(r,cross(level,f)),dot(r,level));
        }else{this.yaw-=dx*.008;this.pitch=Math.max(-Math.PI/2+.001,Math.min(Math.PI/2-.001,this.pitch+dy*.008));this.roll=0;}
        if(this.mode==='first_person'||this.mode==='fly')this.target=add(b.eye,this.basis().f,this.distance);
      }else{this.target=add(add(this.target,b.r,-dx*this.distance*.0018),b.up,dy*this.distance*.0018);}
      invalidate();};
    canvas.addEventListener('wheel',e=>{e.preventDefault();const wheel=-e.deltaY/(e.deltaMode===1?3:100);if(this.mode==='first_person'||this.mode==='fly')this.target=add(this.target,this.basis().f,wheel*Math.max(this.sceneRadius,.01)*.12*this.speed);else this.distance=Math.max(.001,Math.min(1e7,this.distance*Math.exp(-wheel*.16)));invalidate();},{passive:false});
    canvas.onkeydown=e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;if(['w','a','s','d','q','e','z','c','Shift'].includes(k)){e.preventDefault();this.keys.add(k);invalidate();}};
    canvas.onkeyup=e=>this.keys.delete(e.key.length===1?e.key.toLowerCase():e.key);this.onBlur=()=>{this.keys.clear();this.drag=null;};window.addEventListener('blur',this.onBlur);
  }
  dispose(){window.removeEventListener('blur',this.onBlur);this.keys.clear();this.drag=null;}
  reset(){const m=this.initial.worldToCamera,f=[m[2],m[6],m[10]];this.yaw=Math.atan2(-f[0],-f[2]);this.pitch=Math.asin(f[1]);this.roll=0;this.distance=1;this.target=add(this.initial.position,f,this.distance);this.keys.clear();}
  levelRight(f){const r=cross(f,[0,-1,0]);return dot(r,r)>1e-8?norm(r):[-Math.cos(this.yaw),0,Math.sin(this.yaw)];}
  basis(){const c=Math.cos(this.pitch),f=[-c*Math.sin(this.yaw),Math.sin(this.pitch),-c*Math.cos(this.yaw)],level=this.levelRight(f),r=add(level.map(v=>v*Math.cos(this.roll)),cross(level,f),Math.sin(this.roll));return{f,r,up:cross(r,f),eye:add(this.target,f,-this.distance)};}
  update(dt){if(this.drag?.button!==2)return false;const b=this.basis(),first=this.mode==='first_person',f=first?[-Math.sin(this.yaw),0,-Math.cos(this.yaw)]:b.f,r=first?this.levelRight(f):b.r,up=first?[0,-1,0]:b.up;let movement=[0,0,0];
    for(const[k,v,s]of[['w',f,1],['s',f,-1],['d',r,1],['a',r,-1],['e',up,1],['q',up,-1]])if(this.keys.has(k))movement=add(movement,v,s);
    let changed=false;if(dot(movement,movement)>1e-8){this.target=add(this.target,norm(movement),Math.max(this.sceneRadius,this.distance*.2)*this.speed*(this.keys.has('Shift')?4:1)*dt);changed=true;}
    if(this.mode==='fly'){const step=dt*(this.keys.has('Shift')?2:1);if(this.keys.has('z')){this.roll-=step;changed=true;}if(this.keys.has('c')){this.roll+=step;changed=true;}}return changed;
  }
  camera(width,height){const b=this.basis(),down=b.up.map(v=>-v),r=b.r,f=b.f,e=b.eye;return{worldToCamera:[r[0],down[0],f[0],0,r[1],down[1],f[1],0,r[2],down[2],f[2],0,-dot(r,e),-dot(down,e),-dot(f,e),1],width,height,fx:height*.5/Math.tan(25*Math.PI/180),fy:height*.5/Math.tan(25*Math.PI/180),cx:width/2,cy:height/2,near:1e-4,model:'pinhole'};}
}
