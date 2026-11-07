import {ContactInspector} from './human-contact-viewer.js';
const rootURL=new URL('./',import.meta.url);
const url=p=>new URL(p,rootURL).href;
const get=async p=>{const r=await fetch(url(p));if(!r.ok)throw Error(`未能载入 ${p}`);return r.json();};
const names=['任务理解','场景重建','三维接触','动作重定向'];
const views=[[],[['seg','目标分割'],['depth','深度'],['cloud','空间'],['assets','资产']],
  [['contact','指腹接触'],['prior','HACO 先验'],['surface','完整手型'],['pose','姿态骨架']],
  [['ego','机器人 Ego'],['contact-zoom','接触放大'],['solve','仿真全景']]];
const titles=['从示范中读出动作','把观测还原为空间','指腹与胶头，逐点看清','机器人 Ego 接触'];
const fingerNames=['拇指','食指','中指'],fingerColors=['#c78236','#2585a7','#38917a'];

export function mountAgentConversion(root){
  if(!root)return null;
  root.className='ep';root.removeAttribute('data-ego-compact');
  root.innerHTML=`
    <header class="ep-head"><strong class="ep-wordmark"><i></i>Ego2Sim <span style="font-weight:400;color:#839087">/ 智能体</span></strong><span class="ep-chip" data-ep-case>IMG_6263 · Ego 示范</span></header>
    <nav class="ep-tabs" role="tablist" aria-label="Ego2Sim 转换阶段">${names.map((n,i)=>`<button type="button" role="tab" id="ego-tab-${i}" aria-controls="ego-stage" aria-selected="${i===0}" data-ego-step="${i}" tabindex="${i===0?0:-1}"><span>0${i+1}</span>${n}</button>`).join('')}</nav>
    <section id="ego-stage" role="tabpanel" aria-labelledby="ego-tab-0">
      <div class="ep-heading"><h3 data-ep-title></h3><div class="ep-subviews" data-ep-views aria-label="本阶段输出"></div></div>
      <div class="ep-status" data-ep-error role="status" hidden></div>
      <div class="ep-visual" data-ep-visual>
        <figure class="ep-pane" data-ep-left><figcaption><span class="ep-label" data-ep-left-label></span></figcaption><div class="ep-frame"><video muted playsinline preload="metadata" class="ep-source-video" data-ep-source></video></div></figure>
        <figure class="ep-pane" data-ep-right><figcaption><span class="ep-label" data-ep-right-label></span><span class="ep-inspection-tools"><button type="button" class="ep-xray" data-ep-series hidden aria-pressed="true" title="切换时序重建与原始逐帧估计">接触约束</button><button type="button" class="ep-xray" data-ep-xray aria-pressed="false" hidden title="只改变胶头显示透明度，便于检查遮挡">胶头透视</button></span></figcaption><div class="ep-frame"><video muted playsinline preload="metadata" data-ep-output></video><div class="ep-view" data-ep-canvas hidden></div><svg class="ep-contact-overlay" data-ep-contact-overlay hidden aria-hidden="true"></svg></div></figure>
      </div>
      <div class="ep-meta"><span data-ep-caption></span><div class="ep-legend" data-ep-legend hidden></div><div class="ep-force" data-ep-force hidden></div><span data-ep-provider></span><button class="ep-reset" data-ep-reset type="button" hidden>重置视角 ↗</button></div>
      <div class="ep-fingers" data-ep-fingers hidden>${fingerNames.map((n,i)=>`<button type="button" data-ep-finger="${i}" style="--finger:${fingerColors[i]}" aria-pressed="false"><span class="ep-finger-id">${i+1}</span><span class="ep-finger-name">${n}<small data-finger-status>—</small></span><strong data-finger-force>— N</strong></button>`).join('')}</div>
      <div class="ep-human-inspection" data-ep-human-inspection hidden>
        <div class="ep-human-summary"><span>同色对应同一手指</span><button type="button" data-ep-human-all>查看完整接触</button></div>
        <div class="ep-human-pads">${fingerNames.map((n,i)=>`<button type="button" data-ep-human-finger="${i}" aria-pressed="false" style="--pad:${['#d58b42','#43aaa1','#8c95da'][i]}"><span class="ep-pad-dot"></span><span class="ep-pad-name">${n}<small data-human-status>读取接触几何</small></span><span class="ep-pad-measure"><b data-human-gap>—</b><small>估计间隙</small></span><span class="ep-pad-arrow">↗</span></button>`).join('')}</div>
      </div>
      <div class="ep-controls" data-ep-controls><button type="button" class="ep-play" data-ep-play disabled>播放</button><input data-ep-scrub type="range" min="0" max="44" step="0.01" value="0" aria-label="当前来源时间" disabled><output data-ep-time>载入中</output></div>
      <div class="ep-phases" data-ep-phases></div>
      <div class="ep-flow" data-ep-flow></div>
      <details class="ep-details"><summary>数据来源与处理说明</summary><div data-ep-details></div></details>
    </section>`;
  const $=s=>root.querySelector(`[data-ep-${s}]`);
  const tabs=[...root.querySelectorAll('[data-ego-step]')],source=$('source'),output=$('output');
  let bundle,hm,run,telemetry,viewer,ready=false,active=false,stage=0,view='',time=8,want=false,revision=0,raf=null,last=0,loading=false;
  let selectedHumanFinger=-1,initialStageLoaded=false;
  let selectedFinger=-1,contactItems=[],humanXray=false,humanTemporal=true;
  const clocks={observation:8,human:8,execution:9};
  const clock=()=>stage===3?'execution':stage===2?'human':'observation';
  const limits=()=>stage===3?[9,65.364]:stage===2?[hm.frames[0].observation_time_s,hm.frames.at(-1).observation_time_s]:[0,44];
  const staticView=()=>stage===1&&['cloud','assets'].includes(view);
  const is3D=()=>stage===2||stage===1&&['cloud','assets'].includes(view)||stage===3&&view!=='solve';
  const robotContact=()=>stage===3&&is3D();
  const setText=(id,text)=>$(id).textContent=text;
  const error=e=>{setText('error',e.message||String(e));$('error').hidden=false;pause();};
  function pause(){want=false;source.pause();output.pause();if(raf!==null)cancelAnimationFrame(raf);raf=null;if(ready)update();}
  function setMedia(v,name){const next=url('media/'+name+'.mp4')+(name==='solved'?'#t=9':'');if(v.getAttribute('src')===next)return;v.pause();const poster={solved:'solved-start9',observation:'source'}[name]||name;v.poster=url('media/'+poster+'.jpg');v.src=next;v.load();}
  function seek(v,t){if(!v.hidden&&Number.isFinite(v.duration)){const q=Math.min(t,Math.max(0,v.duration-.001));if(Math.abs(v.currentTime-q)>(v.paused?.001:.15))v.currentTime=q;}}
  function nearestHuman(){let best=0;for(let i=1;i<hm.frames.length;i++)if(Math.abs(hm.frames[i].observation_time_s-time)<Math.abs(hm.frames[best].observation_time_s-time))best=i;return best;}
  function forceAt(t){let best=0;for(let i=1;i<telemetry.length;i++)if(Math.abs(telemetry[i].t-t)<Math.abs(telemetry[best].t-t))best=i;return telemetry[best];}
  function showContacts(items){
    if(!robotContact())return;contactItems=items;
    const {width:w,height:h}=$('canvas').getBoundingClientRect();if(w<1||h<1)return;
    $('contact-overlay').setAttribute('viewBox',`0 0 ${w} ${h}`);
    const offsets=[[-32,-30],[34,-30],[34,31]];
    $('contact-overlay').innerHTML=items.filter(p=>p.active&&p.inFrame).map(p=>{
      const x=p.x*w,y=p.y*h,c=fingerColors[p.index],off=offsets[p.index],bx=Math.max(12,Math.min(w-12,x+off[0])),by=Math.max(12,Math.min(h-12,y+off[1])),dim=selectedFinger<0||selectedFinger===p.index?1:.22;
      return `<g opacity="${dim}"><path d="M${x},${y} L${bx},${by}" fill="none" stroke="${c}" stroke-width="1.5" ${p.occluded?'stroke-dasharray="3 3"':''}/><circle cx="${x}" cy="${y}" r="${selectedFinger===p.index?6:4}" fill="${p.occluded?'none':c}" stroke="${c}" stroke-width="1.7" ${p.occluded?'stroke-dasharray="2 2"':''}/><circle cx="${bx}" cy="${by}" r="9" fill="#f8faf5" stroke="${c}" stroke-width="1.5"/><text x="${bx}" y="${by+3.5}" text-anchor="middle" fill="${c}" font-size="10" font-weight="650">${p.index+1}</text></g>`;
    }).join('');
    for(const p of items){const card=root.querySelector(`[data-ep-finger="${p.index}"]`);card.setAttribute('aria-pressed',String(selectedFinger===p.index));card.querySelector('[data-finger-force]').textContent=`${p.force.toFixed(3)} N`;card.querySelector('[data-finger-status]').textContent=!p.active?(p.force>0?'微小载荷':'无载荷'):!p.inFrame?'中心在画外':p.occluded?'中心被遮挡':'中心可见';const sum=items.reduce((q,x)=>q+x.force,0);card.querySelector('[data-finger-status]').textContent+=(sum>.005?` · ${Math.round(p.force/sum*100)}% 力占比`:'');}
  }
  function showHumanContacts(items){
    if(stage!==2)return;
    if(view==='contact'){
      const {width:w,height:h}=$('canvas').getBoundingClientRect();
      $('contact-overlay').setAttribute('viewBox',`0 0 ${w} ${h}`);
      const colors=['#dca05c','#62c8be','#b1b7ef'],offsets=[[-90,24],[92,-25],[130,52]];
      $('contact-overlay').innerHTML=items.filter(p=>p.inFrame&&(selectedHumanFinger<0||selectedHumanFinger===p.index)).map(p=>{
        const x=p.x*w,y=p.y*h,ox=offsets[p.index][0],oy=offsets[p.index][1],bx=Math.max(45,Math.min(w-45,x+ox)),by=Math.max(24,Math.min(h-24,y+oy));
        const note=p.near?(p.occluded?' · 遮挡':''):' · 间隙';
        return `<g><path d="M${x},${y} L${bx},${by}" fill="none" stroke="${colors[p.index]}" stroke-width="1" ${p.occluded?'stroke-dasharray="3 4"':''}/><circle cx="${x}" cy="${y}" r="4" fill="${p.occluded||!p.landmarkNear?'none':colors[p.index]}" stroke="${colors[p.index]}" stroke-width="1.3"/><rect x="${bx-37}" y="${by-12}" width="74" height="24" rx="12" fill="#15272e" fill-opacity=".88"/><text x="${bx}" y="${by+3.5}" fill="${colors[p.index]}" font-size="10" text-anchor="middle">${fingerNames[p.index]}${note}</text></g>`;
      }).join('');
    }
    for(const p of items){
      const card=root.querySelector(`[data-ep-human-finger="${p.index}"]`);
      card.setAttribute('aria-pressed',String(selectedHumanFinger===p.index));
      card.querySelector('[data-human-gap]').textContent=p.gap_mm.toFixed(2)+' mm';
      card.querySelector('[data-human-status]').textContent=(p.near?'指腹邻近':'尚有间隙')+' · '+(p.occluded?'被遮挡':p.inFrame?'可见':'画外');
    }
  }
  function focusHuman(index){pause();selectedHumanFinger=index;viewer?.selectHumanFinger(index);update();}
  root.querySelectorAll('[data-ep-human-finger]').forEach(b=>b.onclick=()=>focusHuman(selectedHumanFinger===Number(b.dataset.epHumanFinger)?-1:Number(b.dataset.epHumanFinger)));
  $('human-all').onclick=()=>focusHuman(-1);
  root.querySelectorAll('[data-ep-finger]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.epFinger);selectedFinger=selectedFinger===i?-1:i;showContacts(contactItems);});
  $('series').onclick=()=>{humanTemporal=!humanTemporal;$('series').setAttribute('aria-pressed',String(humanTemporal));$('series').textContent=humanTemporal?'接触约束':'逐帧估计';choose(view).catch(error);};
  $('xray').onclick=()=>{humanXray=!humanXray;$('xray').setAttribute('aria-pressed',String(humanXray));$('xray').textContent=humanXray?'关闭透视':'胶头透视';viewer?.setHumanXray(humanXray);if(viewer)viewer.humanFrame=-1;update();};
  function update(){
    if(!ready)return;
    clocks[clock()]=time;const [a,b]=limits();$('scrub').min=a;$('scrub').max=b;$('scrub').value=time;
    $('scrub').setAttribute('aria-valuetext',`${time.toFixed(1)} 秒，共 ${b.toFixed(1)} 秒`);
    $('scrub').disabled=loading||staticView();$('play').disabled=loading||staticView();setText('play',want?'暂停':'播放');
    setText('time',`${time.toFixed(1).padStart(4,'0')} / ${b.toFixed(1)} s`);
    source.hidden=stage>=2;output.hidden=is3D()||stage===0;
    if(!loading){
      if(stage===2&&viewer){const i=nearestHuman(),meta=hm.frames[i];viewer.humanState(i,view);root.dataset.humanFrame=String(meta.frame);root.dataset.displayTime=String(meta.observation_time_s);root.dataset.humanSourceFrame=String(meta.source_frame??meta.frame);root.dataset.humanSeries=humanTemporal?'temporal':'raw';setText('caption',view==='contact'?'指腹邻近区域 · 非压力图':view==='prior'?'暖色表示更高接触先验':view==='proximity'?'手物间隙 · 几何估计':view==='pose'?'21 个关节 · 半透明手型':'MANO 手型与滴管');}
      else if(stage===3&&is3D()&&viewer){const rec=forceAt(time);root.dataset.displayTime=String(viewer.state(time,rec));}
      seek(source,staticView()?0:time);seek(output,time);
    }
    if(stage===0){const p=bundle.phases.find(p=>time>=p.start&&time<p.end)||bundle.phases.at(-1);setText('caption',p.name);}
    root.querySelectorAll('[data-ep-phase]').forEach(b=>b.setAttribute('aria-current',String(time>=Number(b.dataset.start)&&time<Number(b.dataset.end))));
  }
  function phaseButtons(){
    const phases=stage===0?bundle.phases:stage===3?run.phases.filter(p=>p.end>9).map(p=>({...p,start:Math.max(9,p.start)})):[];
    $('phases').hidden=!phases.length;$('phases').classList.toggle('is-execution',stage===3);
    $('phases').innerHTML=phases.map((p,i)=>`<button type="button" data-ep-phase="${i}" data-start="${p.start}" data-end="${p.end}">${p.name}<small>${p.start.toFixed(1)} s</small></button>`).join('');
    $('phases').querySelectorAll('button').forEach(b=>b.onclick=()=>{pause();time=Number(b.dataset.start)+.05;update();});
  }
  function details(){
    let text=[
      '原网站 Ego 示范 IMG_6263，使用原始连续视频约 30 帧/秒，替换此前 6 帧/秒抽帧回放。未做背景修补、光流补帧或动作平滑。开头按已有帧对应补约 0.098 秒静帧；阶段是对原片的任务整理。',
      '复用 Ego2Sim 的 SAM3 掩码与 DA3 相对深度，按来源帧重新制作可视化。掩码按颜色证据区分器皿，透明管体和遮挡区域不补造。深度采样间隔 0.5 秒；点云是第 0 帧的静态反投影。CAD 尺度来自已知资产与桌面先验，材质保留原模型设定。',
      'MANO 人手模型、HaWoR 初始化并经图像约束细化的姿态、HACO 原始接触概率，均来自 IMG_6263。当前默认是使用原图关键点、轮廓、胶头与细管外包络约束的时序 MANO/物体联合重建，约束手部三角面交叉与接触片滑动；保持估计 Ego 内参和方向。30 Hz 显示帧由拟合后的关节旋转与位移插值，并对中间帧作接触与避碰修正；来源观测仍约 6 Hz。可切换逐帧估计检查原始数据。接触区域由 5 帧中值接触先验与 CAD 距离共同估计；几何内侧偏差单独标紫，不作为正接触着色。HACO 先验页保留原始网络输出，边界线为 0.75 等值线；穿模复核使用独立闭合外包络，检查 601 个时刻的完整三角面，阈值 0.1 mm；这不是连续碰撞检测。原图关键点投影中位偏差约 5.3 像素，旧版约 3.4 像素；不是标定真值。胶头透视仅用于检查遮挡。原始 120 帧保留；连续重建是估计，不是新增观测。HACO 是接触先验，不是物理压力或实际接触面积；估计机位未经真实相机标定。',
      '接入 gentle_center_refined_release150534，对应独立 IMG_0756。仿真全景和机器人 Ego 均从源时间 9.0 秒播放至 65.364 秒；原视频和保存状态未裁改。机器人 Ego 回放保存的 30 Hz 状态；放大只改变固定画面裁切，相机和求解轨迹不变。数字 1/2/3 对应拇指/食指/中指，标记为记录的合力中心，虚线表示遮挡；0.005 N 仅为显示阈值。记录不提供完整压力面。该求解有独立交付标准、继承前段和预设有限液滴，不代表原 basic-VLA 全通过。'
    ][stage];
    if(stage===2)text='默认展示手物联合时序重建：在 MANO 关节空间同时优化人手与滴管，约束双指接触位置、相对滑动和姿态加速度；原始 HaWoR / HACO 输出仍可切换查看。120 个来源采样点经过重新拟合，601 个显示帧由旋转样条及位移三次插值生成，其中 134 个中间帧作局部接触修正。显示标记使用固定指腹材质坐标，数值仍是五个指腹采样点的最小 CAD 间隙。接触页按几何距离着色，HACO 页保留原始网络概率；两者都不是压力或力。全部 601 帧通过 0.1 mm 容差的三角面穿插采样检查，双指间隙不超过 0.5 mm；未进行连续碰撞或真实受力验收。显示网格仅在距物体包围盒 6 mm 之外柔化轮廓，上限 0.8 mm，接触附近的原始面保留。手部模板来自 IMG_6263，机器人已有求解来自 IMG_0756，仍不是同源对齐。';
    $('details').innerHTML=`<p>${text}</p><p><a href="${url('data/agent-pipeline.json')}" target="_blank" rel="noopener">阶段与来源</a> · <a href="${url(stage===2?'data/contact-temporal-receipt.json':stage===3?'data/pipeline.json':'data/perception-frames.json')}" target="_blank" rel="noopener">处理记录</a></p><p>方法参考：<a href="https://spikew726.github.io/EgoMatrix/" target="_blank" rel="noopener">EgoMatrix</a> · <a href="https://github.com/GaTech-RL2/EgoEngine-CoRL2026" target="_blank" rel="noopener">EgoEngine</a>。借鉴模块接口与展示组织，不代表两套上游系统已在本任务完整运行。</p>`;
  }
  async function choose(next){
    pause();view=next;const token=++revision;loading=true;$('error').hidden=true;
    $('views').innerHTML=views[stage].map(([id,n])=>`<button type="button" data-ep-view="${id}" aria-pressed="${id===view}">${n}</button>`).join('');
    $('views').querySelectorAll('button').forEach(b=>b.onclick=()=>choose(b.dataset.epView).catch(error));
    const single=stage!==1;$('visual').classList.toggle('is-single',single);$('visual').classList.toggle('is-robot-contact',robotContact());$('visual').classList.toggle('is-human-contact',stage===2);$('left').hidden=stage>=2;$('right').hidden=stage===0;
    $('canvas').hidden=!is3D();$('reset').hidden=!is3D()||stage>=2;$('xray').hidden=stage!==2;$('series').hidden=stage!==2;$('legend').hidden=!(robotContact()||stage===2&&['contact','prior','proximity'].includes(view));$('force').hidden=true;$('fingers').hidden=!robotContact();$('contact-overlay').toggleAttribute('hidden',!(robotContact()||stage===2&&view==='contact'));if(stage!==3)$('contact-overlay').innerHTML='';
    $('legend').innerHTML=stage===2?(view==='contact'?'<span>颜色随几何贴近增强</span>':view==='proximity'?'<i class="ep-near"></i><span>≤ 2 mm</span><i class="ep-inward"></i><span>内侧偏差</span>':'<span>低</span><i class="ep-gradient"></i><span>高</span>'):'<span class="ep-dashed-sample"></span><span>被遮挡的中心</span>';
    $('human-inspection').hidden=stage!==2||view!=='contact';
    $('controls').hidden=staticView();
    setText('case',stage===3?'IMG_0756 · 已有求解':stage===2?'人手模板 · IMG_6263':'IMG_6263 · Ego 示范');setText('title',titles[stage]);
    const flow=stage===0?['视频输入','动作阶段','任务对象']:stage===1?['目标分割','深度 / 相机','点云 / CAD']:stage===2?['MANO 手模','HaWoR 姿态','HACO 先验']:['动作重定向','Rokae / Wuji','机器人 Ego 接触'];
    $('flow').innerHTML=flow.map((s,i)=>`${i?'<em>→</em>':''}<b>${s}</b>`).join('');
    details();phaseButtons();
    setText('left-label',stage===2?'原始人手观测':stage===3?'原始记录 · IMG_0756':'Ego 输入 · IMG_6263');
    if(stage===0){setMedia(source,'ego-continuous');setText('provider','原始连续视频 · 30 fps');}
    if(stage===1){
      setMedia(source,'ego-continuous');
      const labels={seg:'目标分割 · SAM3',depth:'相对深度 · DA3',cloud:'背景点云 · 第 0 帧',assets:'任务资产 · 原 CAD'};setText('right-label',labels[view]);
      setText('caption',view==='assets'?'烧杯 · 锥形瓶 · 滴管':view==='cloud'?'深度反投影 · 拖动查看':view==='depth'?'单目估计 · 非标定深度':'可见目标与手部');setText('provider',view==='assets'?'已有资产 / 尺度先验':view==='cloud'?'原始观测坐标':'同一观测帧');
      if(['seg','depth'].includes(view))setMedia(output,view==='seg'?'segmentation':'depth');
    }
    if(stage===2){setText('right-label',view==='contact'?(humanTemporal?'手物接触 · 时序约束':'手物接触 · 逐帧估计'):view==='prior'?'HACO 先验 · 指腹近景':view==='proximity'?'几何贴近 · 指腹近景':view==='pose'?'MANO · 姿态骨架':'MANO · 完整手型');setText('provider','MANO · 人手 Ego');}
    if(stage===3){
      setMedia(output,'solved');
      const labels={solve:'新求解 · MuJoCo + Newton',ego:'机器人 Ego · 完整视野','contact-zoom':'机器人 Ego · 接触近景'};setText('right-label',labels[view]);
      setText('caption',robotContact()?'圆点为受力中心 · 数字对应下方三指':'MuJoCo + Newton · 已有求解');setText('provider','从 9.0 s 开始 · 源时间');
    }
    update();
    if(is3D()){
      viewer??=new ContactInspector($('canvas'));
      viewer.onHumanContacts=showHumanContacts;
      viewer.onContacts=showContacts;
      const mode=stage===2?'human-ego':stage===3?(view==='contact-zoom'?'ego-close':'ego-contact'):view;
      await viewer.setMode(mode);if(token!==revision)return;
      if(stage===2){viewer.selectedHumanFinger=selectedHumanFinger;const series=await viewer.useHumanSeries(humanTemporal);if(token!==revision)return;hm=series;viewer.humanState(nearestHuman(),view);viewer.setHumanXray(humanXray);}
      else if(stage===3)viewer.state(time,forceAt(time));
      viewer.reset();
    }
    if(token!==revision)return;loading=false;update();root.dataset.pipelineReady='true';root.dataset.pipelineStage=String(stage);root.dataset.pipelineView=view;
  }
  async function select(i,focus=false){
    pause();clocks[clock()]=time;stage=i;view=['','seg','contact','ego'][i];time=clocks[clock()];
    tabs.forEach((b,j)=>{b.setAttribute('aria-selected',String(i===j));b.tabIndex=i===j?0:-1;});root.querySelector('#ego-stage').setAttribute('aria-labelledby',tabs[i].id);if(focus)tabs[i].focus();await choose(view);
  }
  function tick(stamp){
    raf=null;if(!want||!active)return;
    const dt=Math.min((stamp-last)/1000,.1);last=stamp;
    const master=stage===0?source:output;
    if(is3D())time=Math.min(limits()[1],time+dt);
    else if(!master.paused&&!master.seeking)time=Math.min(limits()[1],master.currentTime);
    update();if(time>=limits()[1]-.04||(!is3D()&&master.ended)){pause();return;}raf=requestAnimationFrame(tick);
  }
  function play(){
    if(!ready||!active||loading||staticView()||document.hidden)return;
    if(time>=limits()[1]-.04)time=limits()[0];want=true;last=performance.now();
    for(const v of [source,output])if(!v.hidden&&!v.closest('[hidden]')&&v.getAttribute('src')){seek(v,time);v.play().catch(e=>{if(e.name!=='AbortError')error(e);});}
    raf=requestAnimationFrame(tick);update();
  }
  tabs.forEach((b,i)=>{b.onclick=()=>{if(ready)select(i).catch(error);};b.onkeydown=e=>{let j;if(e.key==='ArrowRight')j=(i+1)%4;if(e.key==='ArrowLeft')j=(i+3)%4;if(e.key==='Home')j=0;if(e.key==='End')j=3;if(j!==undefined){e.preventDefault();select(j,true).catch(error);}};});
  $('play').onclick=()=>want?pause():play();$('scrub').oninput=e=>{const requested=Math.max(limits()[0],Math.min(limits()[1],Number(e.target.value))); pause();time=requested;update();};$('reset').onclick=()=>viewer?.reset();
  for(const v of [source,output]){v.onloadedmetadata=()=>update();v.onerror=()=>{if(v.getAttribute('src'))error(Error('视频未能载入，请重新选择本阶段。'));};}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
  new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)pause();},{threshold:.02}).observe(root);
  function startInitialStage(){if(initialStageLoaded)return;initialStageLoaded=true;select(new URLSearchParams(location.search).get('stage')==='contact'?2:3).catch(error);}
  Promise.all([get('data/agent-pipeline.json'),get('data/pipeline.json'),get('data/telemetry.json'),get('data/human.json')]).then(([a,b,c,d])=>{bundle=a;run=b;telemetry=Array.isArray(c)?c:c.frames;hm=d;ready=true;if(active)startInitialStage();}).catch(error);
  return {setActive(v){active=v;if(!v)pause();else{if(ready)startInitialStage();viewer?.resize();}},pause,selectStage:i=>select(i),get source(){return stage===3?'IMG_0756':'IMG_6263';}};
}
