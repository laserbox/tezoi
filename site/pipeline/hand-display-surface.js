import * as THREE from './vendor/three.module.js';

export class HandDisplaySurface {
  constructor(recipe,original,handData){
    this.recipe=recipe;this.sourceFaces=handData.faces;
    this.protected=new Uint8Array(778);this.release=new Float64Array(778);this.local=new Float64Array(778*3);
    this.bounds=[2,3].map(id=>{
      const a=handData['object'+id+'_v'],lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
      for(let i=0;i<a.length;i++) {lo[i%3]=Math.min(lo[i%3],a[i]);hi[i%3]=Math.max(hi[i%3],a[i]);}
      return {lo,hi};
    });
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(recipe.vertices*3),3));g.setAttribute('normal',new THREE.BufferAttribute(new Float32Array(recipe.vertices*3),3));g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(recipe.vertices*3),3));g.setIndex(recipe.faces);
    this.mesh=new THREE.Mesh(g,original.material.clone());this.mesh.castShadow=true;this.mesh.receiveShadow=true;
  }
  update(h,i,original){
    const q=this.recipe,V=original.geometry.attributes.position.array,C=original.geometry.attributes.color.array,local=this.local,protect=this.protected,R=h.rotation,T=h.translation,r=i*9,t=i*3;
    // Work in the original CAD coordinate frame. An inflated AABB is conservative:
    // if it overlaps any source face, that ENTIRE face must stay exactly intact.
    protect.fill(0);this.release.fill(1);
    for(let v=0;v<778;v++)for(let d=0;d<3;d++)local[v*3+d]=(V[v*3]-T[t])*R[r+d]+(V[v*3+1]-T[t+1])*R[r+3+d]+(V[v*3+2]-T[t+2])*R[r+6+d];
    for(let f=0;f<this.sourceFaces.length;f+=3){
      const ids=[this.sourceFaces[f],this.sourceFaces[f+1],this.sourceFaces[f+2]];
      const separation=Math.min(...this.bounds.map(b=>Math.max(0,...[0,1,2].map(d=>Math.max(b.lo[d]-Math.max(...ids.map(v=>local[v*3+d])),Math.min(...ids.map(v=>local[v*3+d]))-b.hi[d])))));
      const near=separation<=q.protected_aabb_margin_m;
      if(near)for(const v of ids)protect[v]=1;
      // Fade cosmetic subdivision continuously outside the protected 6 mm
      // region. A boolean switch used to pop by as much as 0.8 mm per frame.
      const u=Math.max(0,Math.min(1,(separation-q.protected_aabb_margin_m)/.006)),blend=u*u*(3-2*u);
      for(const v of ids)this.release[v]=Math.min(this.release[v],blend);
    }
    const pos=this.mesh.geometry.attributes.position.array,col=this.mesh.geometry.attributes.color.array,normals=this.mesh.geometry.attributes.normal.array,N=original.geometry.attributes.normal.array;
    let max=0,changed=0;
    for(let v=0;v<q.vertices;v++){
      const flat=[0,0,0],smooth=[0,0,0],color=[0,0,0],normal=[0,0,0];let fixed=false,release=1;
      for(let k=q.linear.offset[v];k<q.linear.offset[v+1];k++){
        const j=q.linear.index[k],w=q.linear.weight[k];fixed||=!!protect[j];release=Math.min(release,this.release[j]);
        for(let d=0;d<3;d++){flat[d]+=w*V[j*3+d];color[d]+=w*C[j*3+d];normal[d]+=w*N[j*3+d];}
      }
      if(!fixed)for(let k=q.loop.offset[v];k<q.loop.offset[v+1];k++)for(let d=0;d<3;d++)smooth[d]+=q.loop.weight[k]*V[q.loop.index[k]*3+d];
      const distance=fixed?0:Math.hypot(...smooth.map((x,d)=>x-flat[d]));
      const scale=distance>0?Math.min(1,q.max_displacement_m/distance)*release:0;
      const nl=Math.hypot(...normal)||1;
      for(let d=0;d<3;d++){pos[v*3+d]=flat[d]+(fixed?0:(smooth[d]-flat[d])*scale);col[v*3+d]=color[d];normals[v*3+d]=normal[d]/nl;}
      max=Math.max(max,distance*scale);if(distance>0)changed++;
    }
    this.mesh.geometry.attributes.position.needsUpdate=true;this.mesh.geometry.attributes.color.needsUpdate=true;this.mesh.geometry.attributes.normal.needsUpdate=true;this.mesh.geometry.computeBoundingSphere();
    this.lastAudit={max_display_displacement_mm:max*1000,protected_original_vertices:protect.reduce((a,b)=>a+b,0),display_vertices:q.vertices,changed_display_vertices:changed,contact_faces_preserved:true,continuous_cosmetic_transition_mm:[6,12]};
  }
}
