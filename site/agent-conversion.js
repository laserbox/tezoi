// Real, precomputed demo artifacts. No inference or physical simulation is run in the browser.
const MEDIA='assets/ego2sim/';
const compactDescriptions=[
 '识别捏取、转移、滴加与放回，把示范拆解为任务步骤。',
 '从分割与深度恢复桌面、物体和尺度，重建可编辑场景。',
 '恢复三维手部动作，定位手指与滴管、烧杯的接触关系。',
 'RealMan + Xense 夹起滴管，移到烧杯上方，再放回锥形瓶。两个视角来自同一次物理求解。',
 '修正初态、碰撞形状与夹持控制后，滴管抓取—搬运—放回通过基础物理检查。液体尚未求解。'
];
const CORRECTION_PENDING=false;
const stages=[
 {purpose:'VIDEO → OBJECT EVENTS → TASK GRAPH',title:'让任务分解连接实际观测。',description:'同一视频时间轴上展示操作意图、胶头与管尖观测状态，再用人手—物体接触候选确定机器人换物时机。字幕描述任务意图；液量和任务成功仍未测量。',layers:[['task','任务字幕与观测']],left:'source',leftLabel:'INPUT / 第一视角',rightLabel:'OUTPUT / 任务分解',evidence:'视频观察 + 接触事件',logs:[['保留原视频时间轴','43.89 s'],['识别两组任务资产','2 groups'],['接触事件连接机器人换物','source linked']],artifact:'任务图与源帧事件',note:'滴加意图不等于液体转移成功'},
 {purpose:'DEPTH → WORLD → DYNAMIC MESH POSE',title:'把静态重建补成动态资产轨迹。',description:'SAM3 分割与 DA3 深度经过桌面注册，进入统一观测世界。固定原滴管 CAD 尺寸，逐帧拟合胶头、可见管尖和烧杯位姿；遮挡管尖使用管长与容器几何先验，轴向转角仍不可观测。视频到机器人的刚体矩阵与额外布局适配分别保存。',layers:[['geometry','点云与统一坐标'],['alignment','动态滴管与 Mesh'],['mapping','视频到机器人坐标'],['segmentation','精细分割'],['segmentation-comparison','分割前后'],['depth','相对深度'],['clean','去手与遮挡'],['assets','原任务资产']],left:'source',leftLabel:'INPUT / 原始观测',rightLabel:'OUTPUT / 动态几何与配准',evidence:'实际点云 + 动态 CAD 拟合',logs:[['反投影与桌面注册','88 clouds'],['逐帧滴管和烧杯变换','263 poses'],['区分观测与遮挡先验','82 visible tips']],artifact:'动态位姿、坐标矩阵、点云和场景',note:'估计注册与布局适配；不是实测外参标定'},
 {purpose:'3D HAND → ARTICULATION → TRIANGLE CONTACT',title:'逐段修复捏合姿态，保留观测边界。',description:'固定动态滴管、相机和原始候选，逐段优化拇指与食指关节，保持骨段长度。相同的 12 mm／12 px 门槛下，接触候选由 81/192 提高到 185/192；更严格的逐指投影检查则从 60/192 提高到 160/192。未通过项保留时间、距离和原因，不能当作物理抓持成功。',layers:[['contact','三维接触与距离'],['contact-comparison','逐段修复前后'],['human','三维手到任务世界'],['hands','原始视频骨架']],left:'source',leftLabel:'INPUT / 人类示范',rightLabel:'OUTPUT / 三维手与接触候选',evidence:'保骨长关节优化 + 实际 Mesh 表面',logs:[['固定原始候选与门槛','192 pairs'],['三维接触几何门槛','185 pass'],['严格逐指投影检查','160 pass']],artifact:'逐段审计、三维手与三角面锚点',note:'几何候选不等于接触力、穿透认证或抓持成功'},
 {purpose:'SOURCE INTENT → REACHABLE MOTION → CONTACT ROLLOUT',title:'把滴管夹起、移动并放回。',description:'基于前面的视频动作与三维接触结果，重新规划可达的接近、闭合、抬升、转移和回瓶轨迹。保留 RealMan RM65-B、Xense、原相机与视觉资产；滴管由实际接触力带动。这里使用重新定时的 35 秒机器人操作，不是原视频逐帧复刻；分项中的坐标与人手视频保留原观测时钟。',layers:[['robot','机器人完整动作'],['robot-detail','滴管与夹爪近景'],['robot-external','原固定相机'],['mapping','坐标与布局适配'],['human','三维人手对照']],left:'robot',leftLabel:'同一求解 / 总览',rightLabel:'OUTPUT / RealMan RM65-B + Xense',evidence:'自由物体 + 有限驱动 + 接触',logs:[['连续物理步','175,000'],['夹起 · 搬运 · 放回','通过'],['液体求解','未执行']],artifact:'连续物理轨迹、三个观察视角',note:'名义接触模型下通过；不是液体转移或真机验证'},
 {purpose:'OBSERVE FAILURE → REPAIR → SOLVE → CHECK',title:'让求解结果成为修改依据。',description:'先消除滴管初始穿插和指尖单凸包假碰撞，再修正不可达姿态、软接触滑移及夹指行程越界。35 秒连续求解的每个 0.2 ms 原生步均检查接触、滑移、关节与驱动力限制。自由滴管没有焊接、位姿回放或中途重置，释放后留出稳定时间。旧版失败及几何修复记录仍然保留。',layers:[['physics','接触力与验收'],['robot-detail','实际抓持近景'],['feedback','早期几何修复记录'],['contact-comparison','手部接触修复前后'],['contact','手部接触几何']],left:'robot-detail',leftLabel:'同一求解 / 抓持近景',rightLabel:'OUTPUT / 实际求解与测量',evidence:'每个原生步核对',logs:[['初始穿插 / 禁止碰撞','无'],['双侧接触 / 放回释放','通过'],['液体 / 真机','未验证']],artifact:'物理回放、每步审计与验证报告',note:'CAD 分块与名义材料近似；不代表高保真材料认证'}
];
const physicalMedia=new Set(['robot','robot-detail','robot-external','physics']);
const physicalPhases=[{start:0,end:6,caption:'接近并对齐滴管胶头'},{start:6,end:8,caption:'闭合夹爪，建立双侧接触'},{start:8,end:12,caption:'夹起滴管，管尖越过瓶口'},{start:12,end:18,caption:'移到烧杯上方并保持 · 液体未求解'},{start:18,end:26,caption:'返回锥形瓶并缓慢下降'},{start:26,end:27,caption:'张开夹爪，释放滴管'},{start:27,end:35.04,caption:'夹爪退让，滴管在瓶内稳定'}];
const fallbackPhases=[{start:0,end:1.8,caption:'识别烧杯与锥形瓶—滴管组合'},{start:1.8,end:7,caption:'右手捏住滴管胶头，在锥形瓶内操作'},{start:7,end:11,caption:'提起滴管，移到烧杯上方'},{start:11,end:24,caption:'保持滴管朝下，向烧杯滴加'},{start:24,end:29.5,caption:'将滴管放回锥形瓶并松手'},{start:29.5,end:40.5,caption:'拿起烧杯，轻晃后放回桌面'},{start:40.5,end:43.8867,caption:'松开烧杯，手退出操作区'}];
export function mountAgentConversion(root){
 if(!root)return null;
 const $=n=>root.querySelector(`[data-ego-${n}]`),source=$('source'),output=$('output'),tabs=[...root.querySelectorAll('[data-ego-step]')];
 const compact=root.hasAttribute('data-ego-compact');
 let stage=0,layer='task',active=false,want=false,time=0,phases=fallbackPhases,sourcePhases=fallbackPhases,limit=43.8,manifest=null,frame=null;
 const native=()=>stage>=3&&physicalMedia.has(layer);
 const short=['识别','捏取','转移','滴加','放回','操作烧杯','退出'];
 const setText=(n,t)=>{const el=$(n);if(el)el.textContent=t};
 function media(video,name){if(CORRECTION_PENDING&&['robot','human','assets'].includes(name))name='configuration';if(video.dataset.media===name)return;video.pause();video.dataset.media=name;video.loop=name==='assets';if(name==='configuration'){video.poster=MEDIA+'configuration-overview.png';video.removeAttribute('src');video.load();return;}video.poster=MEDIA+name+'.jpg?v=physics7';video.src=MEDIA+name+'.mp4?v=physics7';video.load();}
 function seekVideo(video,t){const duration=video.duration;if(!Number.isFinite(duration))return;const target=video.dataset.media==='assets'?t%duration:Math.min(t,duration-.05);if(Math.abs(video.currentTime-target)>.15)video.currentTime=Math.max(0,target);}
 function update(){
  const i=Math.max(0,phases.findIndex(p=>time>=p.start&&time<p.end)),p=phases[i];
  setText('caption',p.caption);setText('phase-index',String(i+1).padStart(2,'0')+' / 07');setText('phase-window',`${p.start.toFixed(1)}–${p.end.toFixed(1)} s`);setText('time',`${time.toFixed(1).padStart(4,'0')} / ${native()?'35.0':'43.9'} s`);$('scrub').value=time;
  root.querySelectorAll('[data-phase]').forEach((b,j)=>b.setAttribute('aria-current',String(i===j)));
  if(stage===4&&!native()){setText('caption','早期几何修复记录 · 物理结果请切换「接触力与验收」');setText('phase-index','HISTORY');setText('phase-window','原观测时钟');}
  $('play').textContent=want?'暂停':'播放';$('play').setAttribute('aria-label',want?'暂停同步演示':'播放同步演示');
 }
 function play(){if(!active||document.hidden)return;seekVideo(source,time);seekVideo(output,time);source.play().catch(()=>{want=false;update()});output.play().catch(()=>{});}
 function pause(){source.pause();output.pause();want=false;update();}
 function jump(t){time=Math.min(limit,Math.max(0,t));seekVideo(source,time);seekVideo(output,time);update();}
 function layerLabel(){
  const label=stages[stage].layers.find(([id])=>id===layer)?.[1];
  setText('right-label',compact?label:'OUTPUT / '+label);
  if($('download'))$('download').href=MEDIA+layer+'.mp4';
  output.setAttribute('aria-label',label+'演示');
 }
 function layers(){
  if(!$('layers'))return;$('layers').replaceChildren();for(const [id,label] of stages[stage].layers){const b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('aria-pressed',String(id===layer));b.addEventListener('click',()=>{layer=id;media(output,id);configureTimeline();layers();layerLabel();if(want)play()});$('layers').append(b)}
 }
 function select(i,focus=false){
  const playing=want;source.pause();output.pause();stage=i;const s=stages[i];layer=compact&&i===3?'robot-detail':s.layers[0][0];media(source,s.left);source.setAttribute('aria-label',i===4?'机器人动作候选':'原始滴管视频');media(output,layer);layers();
  for(const key of ['purpose','title','description','leftLabel','rightLabel','evidence','artifact']){const name=key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase());setText(name,s[key])}setText('artifact-note',s.note);
  tabs.forEach((b,j)=>{b.setAttribute('aria-selected',String(i===j));b.tabIndex=i===j?0:-1});$('stage');root.querySelector('#ego-stage').setAttribute('aria-labelledby',tabs[i].id);
  if($('properties'))$('properties').hidden=i!==1;if($('phases'))$('phases').hidden=false;$('scrub').setAttribute('aria-label',i===4?'反馈演示时间':'原视频时间');if($('download'))$('download').href=MEDIA+['task','geometry','contact','robot','physics'][i]+'.mp4';root.querySelectorAll('[data-demo-stage]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.demoStage)===i))); if($('feedback'))$('feedback').hidden=i!==4;
  if($('agent-log'))$('agent-log').innerHTML=s.logs.map(([a,b],j)=>`<div class="ego-log-row"><i>${(i===4&&j===2)||b==='partial'?'○':'✓'}</i><span>${a}</span><em>${b}</em></div>`).join('');
  if(compact){setText('description',compactDescriptions[i]);setText('left-label',i===4?'机器人动作候选':'第一视角视频');setText('right-label',['任务理解','场景重建','三维接触','机器人重定向','基础物理与反馈'][i]);}
  configureTimeline();layerLabel();
  if(focus)tabs[i].focus();update();if(playing)play();
 }
 function configureTimeline(){
  setText('source-id',native()?'V7 · 175,000 steps':'IMG_6100');const oldLimit=limit;limit=native()?35:43.8;phases=native()?physicalPhases:sourcePhases;if(limit!==oldLimit)time=0;else time=Math.min(time,limit);$('scrub').max=limit;$('scrub').setAttribute('aria-label',native()?'机器人求解时间':'原视频时间');
  const left=native()?(stage===4?'robot-detail':layer==='robot'?'robot-external':'robot'):'source';media(source,left);source.setAttribute('aria-label',native()?'同一求解的另一观察视角':'原始第一视角视频');setText('left-label',native()?(left==='robot-detail'?'同一求解 · 抓持近景':left==='robot-external'?'同一求解 · 原固定相机':'同一求解 · 总览'):'第一视角视频');
  if($('phases')){$('phases').replaceChildren();for(const [i,p] of phases.entries()){const b=document.createElement('button');b.type='button';b.dataset.phase=i;b.textContent=`${String(i+1).padStart(2,'0')} ${native()?['接近','夹持','抬升','转移','放回','释放','稳定'][i]:short[i]}`;b.addEventListener('click',()=>jump(p.start));$('phases').append(b)}}
  update();
 }
 root.querySelectorAll('[data-demo-stage]').forEach(b=>b.addEventListener('click',()=>{select(Number(b.dataset.demoStage));jump(0);root.querySelector('#ego-stage').scrollIntoView({behavior:'smooth',block:'start'})}));
 tabs.forEach((b,i)=>{b.addEventListener('click',()=>select(i));b.addEventListener('keydown',e=>{let j;if(e.key==='ArrowRight')j=(i+1)%5;if(e.key==='ArrowLeft')j=(i+4)%5;if(e.key==='Home')j=0;if(e.key==='End')j=4;if(j!==undefined){e.preventDefault();select(j,true)}})});
 $('play').addEventListener('click',()=>{if(want)pause();else{if(time>limit-.2)jump(0);want=true;play();update()}});
 $('scrub').addEventListener('input',e=>{const target=Number(e.target.value);pause();jump(target)});
 $('fullscreen').addEventListener('click',()=>{const v=root.querySelector('.ego-viewer');if(v.requestFullscreen)v.requestFullscreen();else output.webkitEnterFullscreen?.()});
 for(const v of [source,output]){v.addEventListener('loadedmetadata',()=>{seekVideo(v,time);if(want&&active)v.play().catch(()=>{})});v.addEventListener('error',()=>{setText('method','媒体尚未加载，请检查本地文件或网络连接。')})}
 source.addEventListener('ended',()=>{time=limit;pause()});
 function tick(){if(want&&active&&!source.paused){time=Math.min(limit,source.currentTime);seekVideo(output,time);update();if(time>=limit)pause()}frame=requestAnimationFrame(tick)}tick();
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
 new IntersectionObserver(es=>{if(!es.some(e=>e.isIntersecting))pause()},{threshold:.05}).observe(root);
 const checks={geometry:'已经生成动态滴管／烧杯位姿、刚体配准矩阵与显式布局适配。保留单目、遮挡、轴向转角和透明物体的不确定性；不是实测外参。',ik:'正在读取本轮运动学检查。',review:'保留每轮失败，依次修正初始配准、指尖碰撞形状、可达姿态、接触滑移与夹指行程。最新滴管周期由真实自由物体求解产生；旧几何候选不自动升级为物理成功。',physics:'35 秒、175,000 个原生步：初态无穿插，未检测到禁止接触；双侧夹持、搬运、放回与释放通过本轮门槛。名义模型包含胶头扭转摩擦和 CAD 分块近似，没有物体焊接或位姿强制。液体及真机尚未验证。'};
 root.querySelectorAll('[data-ego-check]').forEach(b=>b.addEventListener('click',()=>{root.querySelectorAll('[data-ego-check]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));setText('check-detail',checks[b.dataset.egoCheck])}));
 fetch(MEDIA+'manifest.json').then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(m=>{manifest=m;sourcePhases=m.phases;phases=native()?physicalPhases:sourcePhases;if(!m.motion_v6)checks.ik=`${m.total_frames} 个运动学样本；关节位置限制${m.joint_bounds_pass?'通过':'未通过'}。最大 TCP 位置残差 ${(m.max_tcp_error_m*1000).toFixed(2)} mm，最大关节速度 ${m.max_joint_speed_rad_s.toFixed(2)} rad/s。碰撞与动力学未验证。`;update()}).catch(()=>{});
 fetch(MEDIA+'physics-v7/native-review.json').then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(r=>{checks.ik=`连续 30 Hz 实际求解回放；关节位置、控制和驱动力限制均通过。持握阶段最大相对滑移 ${(r.hold_max_slip_m*1000).toFixed(2)} mm，双侧接触覆盖 ${(r.bilateral_ratio*100).toFixed(0)}%。`}).catch(()=>{});
 select(0);
 return{setActive(v){active=v;if(!v)pause()},pause};
}
