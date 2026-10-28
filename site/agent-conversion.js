// Real, precomputed demo artifacts. No inference or physical simulation is run in the browser.
const MEDIA='assets/ego2sim/';
const CORRECTION_PENDING=false;
const stages=[
 {purpose:'VIDEO → OBJECT EVENTS → TASK GRAPH',title:'让任务分解连接实际观测。',description:'同一视频时间轴上展示操作意图、胶头与管尖观测状态，再用人手—物体接触候选确定机器人换物时机。字幕描述任务意图；液量和任务成功仍未测量。',layers:[['task','任务字幕与观测']],left:'source',leftLabel:'INPUT / 第一视角',rightLabel:'OUTPUT / 任务分解',evidence:'视频观察 + 接触事件',logs:[['保留原视频时间轴','43.89 s'],['识别两组任务资产','2 groups'],['接触事件连接机器人换物','source linked']],artifact:'任务图与源帧事件',note:'滴加意图不等于液体转移成功'},
 {purpose:'DEPTH → WORLD → DYNAMIC MESH POSE',title:'把静态重建补成动态资产轨迹。',description:'SAM3 分割与 DA3 深度经过桌面注册，进入统一观测世界。固定原滴管 CAD 尺寸，逐帧拟合胶头、可见管尖和烧杯位姿；遮挡管尖使用管长与容器几何先验，轴向转角仍不可观测。视频到机器人的刚体矩阵与额外布局适配分别保存。',layers:[['mapping','场景重建与坐标配准'],['segmentation-comparison','精细分割与对比'],['depth','相对深度'],['clean','去手与遮挡'],['assets','原任务资产']],left:'source',leftLabel:'INPUT / 原始观测',rightLabel:'OUTPUT / 动态几何与配准',evidence:'实际点云 + 动态 CAD 拟合',logs:[['反投影与桌面注册','88 clouds'],['逐帧滴管和烧杯变换','263 poses'],['区分观测与遮挡先验','82 visible tips']],artifact:'动态位姿、坐标矩阵、点云和场景',note:'估计注册与布局适配；不是实测外参标定'},
 {purpose:'3D HAND → ARTICULATION → TRIANGLE CONTACT',title:'逐段修复捏合姿态，保留观测边界。',description:'固定动态滴管、相机和原始候选，逐段优化拇指与食指关节，保持骨段长度。相同的 12 mm／12 px 门槛下，接触候选由 81/192 提高到 185/192；更严格的逐指投影检查则从 60/192 提高到 160/192。未通过项保留时间、距离和原因，不能当作物理抓持成功。',layers:[['contact','三维接触与距离'],['contact-comparison','逐段修复前后'],['human','三维手到任务世界'],['hands','原始视频骨架']],left:'source',leftLabel:'INPUT / 人类示范',rightLabel:'OUTPUT / 三维手与接触候选',evidence:'保骨长关节优化 + 实际 Mesh 表面',logs:[['固定原始候选与门槛','192 pairs'],['三维接触几何门槛','185 pass'],['严格逐指投影检查','160 pass']],artifact:'逐段审计、三维手与三角面锚点',note:'几何候选不等于接触力、穿透认证或抓持成功'},
 {purpose:'CONTACT → ASPIRATE → DISPENSE → RETURN',title:'同一构型完成抓取、滴加和放回。',description:'保留 RealMan RM65-B、Xense、原相机及视觉资产。机械臂从重新规划的安全预抓取位出发，消除开场大幅翻肘；沿倾斜管轴取放，以实际模拟位姿反馈修正对准。胶头压缩驱动简化气压与管内流动求解，液滴在重力下进入烧杯。35 秒为重新规划的执行时钟，原视频及上游分项保留观测时钟。',layers:[['robot','机器人完整动作'],['robot-detail','滴管与夹爪近景'],['liquid','吸液与滴加'],['robot-external','原固定相机'],['mapping','坐标与布局适配'],['human','三维人手对照']],left:'robot',leftLabel:'同一求解 / 总览',rightLabel:'OUTPUT / RealMan RM65-B + Xense',evidence:'自由物体接触 + 简化液体',logs:[['连续原生步','175,000'],['持握 · 滴加 · 自由放回','已检查'],['液体模型','简化气压与流动']],artifact:'同步机器人视频、接触与体积记录',note:'仿真状态反馈；不是完整 CFD 或真机验证'},
 {purpose:'OBSERVE → DIAGNOSE → REPAIR → VERIFY',title:'让接触和转移量成为修改依据。',description:'每个 0.2 ms 原生步检查接触、关节限制、自由释放和液体体积。区分胶头接触处的切向滑移与长管尖因柔性转动产生的偏移；管尖相对位移与接触滑移同时满足原门槛，保留每轮失败记录。瓶底和瓶颈真实支撑释放后的滴管。液体使用简化气压、黏性管流、弹道液滴和静液面，不包含完整 CFD、飞溅或化学反应。',layers:[['physics','接触力与验收'],['liquid','液体转移与守恒'],['robot-detail','实际抓持近景'],['feedback','早期几何修复记录'],['contact-comparison','手部接触修复前后'],['contact','手部接触几何']],left:'robot-detail',leftLabel:'同一求解 / 抓持近景',rightLabel:'OUTPUT / 实际求解与测量',evidence:'接触与液体逐步核对',logs:[['管尖相对位移 ≤5 mm','4.33 mm'],['液体转移与守恒','简化模型'],['完整 CFD / 真机','未验证']],artifact:'连续回放、原生审计与边界说明',note:'原始管尖门槛与接触、滴加共同复验；不代表真机验证'}
];
const physicalMedia=new Set(['robot','robot-detail','robot-external','physics','liquid']);
const physicalPhases=[{start:0,end:6,caption:'从安全预抓取位接近，保持同一肘部构型'},{start:6,end:8,caption:'压缩胶头，再保留持握预紧并吸液'},{start:8,end:13,caption:'沿管轴抽出，离开瓶口后调整姿态'},{start:13,end:18,caption:'移至烧杯上方，压缩胶头滴加'},{start:18,end:26,caption:'返回并沿倾斜管轴放入锥形瓶'},{start:26,end:27,caption:'松开夹爪，自由释放'},{start:27,end:35.04,caption:'重力与瓶底、瓶颈接触形成稳定斜靠'}];
const fallbackPhases=[{start:0,end:1.8,caption:'识别烧杯与锥形瓶—滴管组合'},{start:1.8,end:7,caption:'右手捏住滴管胶头，在锥形瓶内操作'},{start:7,end:11,caption:'提起滴管，移到烧杯上方'},{start:11,end:24,caption:'保持滴管朝下，向烧杯滴加'},{start:24,end:29.5,caption:'将滴管放回锥形瓶并松手'},{start:29.5,end:40.5,caption:'拿起烧杯，轻晃后放回桌面'},{start:40.5,end:43.8867,caption:'松开烧杯，手退出操作区'}];

// Homepage ownership is deliberately smaller than the detailed report's history.
const compactViews = [
 {main:['task','任务字幕与观测'], evidence:[], description:'识别操作意图，把捏取、转移、滴加与放回连接到实际观测。'},
 {main:null, title:'场景重建', evidence:[], description:'分割、相对深度、遮挡处理与三维场景，四段视频可独立播放和放大查看。'},
 {main:['contact','三维接触与距离'], evidence:[['human','三维手部回放'],['hands','原始视频骨架'],['contact-comparison','接触拟合前后对照']], description:'恢复手部姿态与接触距离，为机器人动作提供几何约束。'},
 {main:['robot','机器人完整动作'], evidence:[], description:'完整回放 RealMan + Xense 抓取滴管、吸液、滴加与自然放回。'},
 {main:['physics','接触力与验收'], evidence:[['liquid','液体转移与守恒'],['robot-detail','抓持近景']], description:'核对同一次仿真执行的接触、滑移、释放与液体守恒。'}
];
const compactClocks = {
 observation:{limit:43.83,label:'示教回放'},
 simulation:{limit:35,label:'仿真回放'}
};

export function mountAgentConversion(root) {
 if (!root) return null;
 return root.hasAttribute('data-ego-compact') ? mountCompactAgent(root) : mountDetailedAgent(root);
}

function mountCompactAgent(root) {
 const $ = name => root.querySelector(`[data-ego-${name}]`);
 const source = $('source'), output = $('output'), scrub = $('scrub');
 const tabs = [...root.querySelectorAll('[data-ego-step]')];
 const viewer = root.querySelector('.ego-viewer');
 const positions = {observation:0,simulation:0};
 const previews = [...root.querySelectorAll('[data-ego-preview]')];
 const failures = new Set();
 let stage = 0, layer = 'task', clock = 'observation', time = 0;
 let active = false, want = false, comparison = false, frame = null, revision = 0;
 const clockFor = () => stage < 3 ? 'observation' : 'simulation';
 const canCompare = () => Boolean(compactViews[stage].main) && stage < 3;
 const setText = (name, value) => { if ($(name)) $(name).textContent = value; };

 function seekVideo(video, value, force = false) {
  if (!video.hasAttribute('src') || !Number.isFinite(video.duration)) return;
  const target = Math.max(0, Math.min(value, video.duration - .02));
  if (force || Math.abs(video.currentTime - target) > .12) video.currentTime = target;
 }
 function remember() {
  if (want && output.readyState >= 2) time = Math.min(compactClocks[clock].limit, output.currentTime);
  positions[clock] = time;
 }
 function update() {
  const settings = compactClocks[clock];
  scrub.max = settings.limit;
  scrub.value = time;
  scrub.setAttribute('aria-label', `${settings.label}时间`);
  scrub.setAttribute('aria-valuetext', `${time.toFixed(1)} 秒，共 ${settings.limit.toFixed(1)} 秒`);
  setText('time', `${time.toFixed(1).padStart(4,'0')} / ${settings.limit.toFixed(1)} s`);
  setText('clock', settings.label);
  setText('caption', ((clock === 'simulation' ? physicalPhases : fallbackPhases).find(p => time >= p.start && time < p.end)
     || (clock === 'simulation' ? physicalPhases : fallbackPhases).at(-1)).caption);
  $('play').textContent = want ? '暂停' : '播放';
  $('play').setAttribute('aria-label', want ? '暂停演示' : '播放演示');
 }
 function pause(exceptPreview = null) {
  remember();
  want = false;
  revision++;
  source.pause();
  output.pause();
  previews.forEach(video => { if (video !== exceptPreview) video.pause(); });
  if (frame !== null) cancelAnimationFrame(frame);
  frame = null;
  update();
 }
 function showFailures() {
  $('method').hidden = failures.size === 0;
  $('retry').hidden = failures.size === 0;
  setText('method', failures.size ? '视频加载失败，请重试。' : '');
 }
 function startVideo(video, token) {
  const pending = video.play();
  pending?.catch(error => {
   // A later selection/pause owns the state; stale play rejections cannot change it.
   if (token !== revision || !want || error.name === 'AbortError') return;
   pause();
   failures.add(video);
   showFailures();
  });
 }
 function tick() {
  frame = null;
  if (!want || !active) return;
  if (!output.paused && !output.seeking) {
   time = Math.min(compactClocks[clock].limit, output.currentTime);
   positions[clock] = time;
   if (comparison) seekVideo(source, time);
   update();
   if (time >= compactClocks[clock].limit) { pause(); return; }
  }
  frame = requestAnimationFrame(tick);
 }
 function play() {
  if (!compactViews[stage].main || !active || document.hidden || failures.size) return;
  previews.forEach(video => video.pause());
  if (time >= compactClocks[clock].limit - .05) jump(0);
  want = true;
  const token = ++revision;
  seekVideo(output, time, true);
  startVideo(output, token);
  if (comparison) { seekVideo(source, time, true); startVideo(source, token); }
  if (frame === null) frame = requestAnimationFrame(tick);
  update();
 }
 function jump(value) {
  if (!compactViews[stage].main) return;
  time = Math.min(compactClocks[clock].limit, Math.max(0, value));
  positions[clock] = time;
  seekVideo(output, time, true);
  if (comparison) seekVideo(source, time, true);
  update();
 }
 function clearMedia(video) {
  video.pause();
  video.removeAttribute('src');
  video.removeAttribute('poster');
  delete video.dataset.media;
  video.load();
 }
 function load(video, name, force = false) {
  if (!force && video.dataset.media === name) return;
  video.pause();
  video.dataset.media = name;
  video.loop = name === 'assets';
  video.poster = `${MEDIA}${name}.jpg?v=physics10`;
  video.style.aspectRatio = ['assets','human','robot','robot-detail','liquid','physics'].includes(name) ? '4 / 3' : '16 / 9';
  video.src = `${MEDIA}${name}.mp4?v=physics10`;
  video.load();
 }
 function syncComparison() {
  comparison = comparison && canCompare();
  $('source-figure').hidden = !comparison;
  viewer.classList.toggle('is-comparing', comparison);
  $('compare').hidden = !canCompare();
  $('compare').setAttribute('aria-pressed', String(comparison));
  $('compare').textContent = comparison ? '收起原视频对照' : '对照原视频';
  if (comparison) load(source, 'source');
  else if (source.hasAttribute('src')) clearMedia(source);
 }
 function choose(id) {
  const view = compactViews[stage];
  if (!view.main) return;
  pause();
  layer = id;
  clock = clockFor();
  time = positions[clock];
  failures.delete(source);
  if (output.dataset.media !== id) failures.delete(output);
  showFailures();
  comparison = false;
  syncComparison();
  load(output, id);
  const label = [view.main, ...view.evidence].find(([name]) => name === id)[1];
  setText('result-title', label);
  setText('right-label', label);
  setText('artifact-note', stages[stage].note);
  output.setAttribute('aria-label', `${label}演示`);
  $('back').hidden = id === view.main[0];
  root.querySelectorAll('[data-ego-evidence]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.egoEvidence === id)));
  update();
 }
 function select(index, focus = false) {
  pause();
  stage = index;
  const view = compactViews[stage];
  tabs.forEach((button, i) => {
   button.setAttribute('aria-selected', String(i === stage));
   button.tabIndex = i === stage ? 0 : -1;
  });
  $('stage').setAttribute('aria-labelledby', tabs[stage].id);
  $('evidence-panel').open = false;
  $('evidence-panel').hidden = view.evidence.length === 0;
  $('reconstruction').hidden = stage !== 1;
  $('main-player').hidden = !view.main;
  $('clock').hidden = !view.main;
  if (stage === 1) for (const video of previews) {
   if (!video.hasAttribute('src')) {
    const name = video.dataset.egoPreview;
    video.poster = `${MEDIA}${name}.jpg?v=physics10`;
    video.src = `${MEDIA}${name}.mp4?v=physics10`;
   }
  }
  $('layers').replaceChildren();
  for (const [id, label] of view.evidence) {
   const button = document.createElement('button');
   button.type = 'button';
   button.dataset.egoEvidence = id;
   button.textContent = label;
   button.addEventListener('click', () => choose(id));
   $('layers').append(button);
  }
  setText('description', view.description);
  if (view.main) choose(view.main[0]);
  else {
   layer = null;
   clock = 'observation';
   time = positions[clock];
   comparison = false;
   syncComparison();
   clearMedia(output);
   failures.clear();
   showFailures();
   setText('result-title', view.title);
   update();
  }
  if (focus) {
   tabs[stage].focus({preventScroll:true});
   tabs[stage].scrollIntoView({block:'nearest',inline:'nearest'});
  }
 }
 tabs.forEach((button, index) => {
  button.addEventListener('click', () => select(index));
  button.addEventListener('keydown', event => {
   const next = {ArrowRight:(index+1)%5,ArrowLeft:(index+4)%5,Home:0,End:4}[event.key];
   if (next !== undefined) { event.preventDefault(); select(next, true); }
  });
 });
 $('play').addEventListener('click', () => want ? pause() : play());
 scrub.addEventListener('input', () => { const value = Number(scrub.value); pause(); jump(value); });
 $('back').addEventListener('click', () => {
  const main = compactViews[stage].main;
  if (main) { choose(main[0]); $('play').focus({preventScroll:true}); }
 });
 $('compare').addEventListener('click', () => {
  if (!canCompare()) return;
  pause(); comparison = !comparison; failures.delete(source); showFailures(); syncComparison(); seekVideo(source,time,true);
 });
 $('fullscreen').addEventListener('click', () => {
  if (!compactViews[stage].main) return;
  if (viewer.requestFullscreen) viewer.requestFullscreen()?.catch(() => {});
  else output.webkitEnterFullscreen?.();
 });
 $('retry').addEventListener('click', () => {
  for (const video of failures) load(video, video.dataset.media, true);
 });
 for (const video of [source, output]) {
  video.addEventListener('loadedmetadata', () => {
   if (video === source && !comparison) return;
   video.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
   seekVideo(video, time, true);
  });
  video.addEventListener('loadeddata', () => {
   if (video === source && !comparison) return;
   failures.delete(video); showFailures();
  });
  video.addEventListener('error', () => {
   if ((video === source && !comparison) || !video.hasAttribute('src')) return;
   pause(); failures.add(video); showFailures();
  });
 }
 output.addEventListener('ended', () => {
  if (compactViews[stage].main) { time = compactClocks[clock].limit; pause(); }
 });
 for (const video of previews) {
  const card = video.closest('figure');
  const error = card.querySelector('[data-ego-preview-error]');
  const retry = card.querySelector('[data-ego-preview-retry]');
  video.addEventListener('play', () => {
   if (!active || document.hidden || stage !== 1) video.pause();
   else pause(video);
  });
  video.addEventListener('error', () => { error.hidden = false; retry.hidden = false; });
  video.addEventListener('loadeddata', () => { error.hidden = true; retry.hidden = true; });
  retry.addEventListener('click', () => {
   video.load();
   video.play().catch(() => {});
   video.focus({preventScroll:true});
  });
 }
 document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
 new IntersectionObserver(entries => { if (!entries.some(entry => entry.isIntersecting)) pause(); }, {threshold:.05}).observe(root);
 select(0);
 return {setActive(value) { active = value; if (!value) pause(); }, pause};
}

function mountDetailedAgent(root){
 if(!root)return null;
 const $=n=>root.querySelector(`[data-ego-${n}]`),source=$('source'),output=$('output'),tabs=[...root.querySelectorAll('[data-ego-step]')];
 let stage=0,layer='task',active=false,want=false,time=0,phases=fallbackPhases,sourcePhases=fallbackPhases,limit=43.8,manifest=null,frame=null;
 const native=()=>stage>=3&&physicalMedia.has(layer);
 const short=['识别','捏取','转移','滴加','放回','操作烧杯','退出'];
 const setText=(n,t)=>{const el=$(n);if(el)el.textContent=t};
 function media(video,name){if(CORRECTION_PENDING&&['robot','human','assets'].includes(name))name='configuration';if(video.dataset.media===name)return;video.pause();video.dataset.media=name;video.loop=name==='assets';if(name==='configuration'){video.poster=MEDIA+'configuration-overview.png';video.removeAttribute('src');video.load();return;}video.poster=MEDIA+name+'.jpg?v=physics10';video.src=MEDIA+name+'.mp4?v=physics10';video.load();}
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
  setText('right-label','OUTPUT / '+label);
  if($('download'))$('download').href=MEDIA+layer+'.mp4';
  output.setAttribute('aria-label',label+'演示');
 }
 function layers(){
  if(!$('layers'))return;$('layers').replaceChildren();for(const [id,label] of stages[stage].layers){const b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('aria-pressed',String(id===layer));b.addEventListener('click',()=>{layer=id;media(output,id);configureTimeline();layers();layerLabel();if(want)play()});$('layers').append(b)}
 }
 function select(i,focus=false){
  const playing=want;source.pause();output.pause();stage=i;const s=stages[i];layer=s.layers[0][0];media(source,s.left);source.setAttribute('aria-label',i===4?'机器人动作候选':'原始滴管视频');media(output,layer);layers();
  for(const key of ['purpose','title','description','leftLabel','rightLabel','evidence','artifact']){const name=key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase());setText(name,s[key])}setText('artifact-note',s.note);
  tabs.forEach((b,j)=>{b.setAttribute('aria-selected',String(i===j));b.tabIndex=i===j?0:-1});$('stage');root.querySelector('#ego-stage').setAttribute('aria-labelledby',tabs[i].id);
  if($('properties'))$('properties').hidden=i!==1;if($('phases'))$('phases').hidden=false;$('scrub').setAttribute('aria-label',i===4?'反馈演示时间':'原视频时间');if($('download'))$('download').href=MEDIA+['task','mapping','contact','robot','physics'][i]+'.mp4';root.querySelectorAll('[data-demo-stage]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.demoStage)===i))); if($('feedback'))$('feedback').hidden=i!==4;
  if($('agent-log'))$('agent-log').innerHTML=s.logs.map(([a,b],j)=>`<div class="ego-log-row"><i>${(i===4&&j===2)||b==='partial'?'○':'✓'}</i><span>${a}</span><em>${b}</em></div>`).join('');
  configureTimeline();layerLabel();
  if(focus)tabs[i].focus();update();if(playing)play();
 }
 function configureTimeline(){
  setText('source-id',native()?'V10 · 175,000 steps':'IMG_6100');const oldLimit=limit;limit=native()?35:43.8;phases=native()?physicalPhases:sourcePhases;if(limit!==oldLimit)time=0;else time=Math.min(time,limit);$('scrub').max=limit;$('scrub').setAttribute('aria-label',native()?'机器人求解时间':'原视频时间');
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
 const checks={geometry:'已经生成动态滴管／烧杯位姿、刚体配准矩阵与显式布局适配。保留单目、遮挡、轴向转角和透明物体的不确定性；不是实测外参。',ik:'正在读取本轮运动学检查。',review:'保留每轮失败，依次修正初始配准、指尖碰撞形状、可达姿态、接触滑移与夹指行程。最新滴管周期由真实自由物体求解产生；旧几何候选不自动升级为物理成功。',physics:'35 秒连续求解：自由持握、瓶底与瓶颈支撑、释放和简化液体转移均有原生记录。原始 5 mm 管尖相对位移已通过，并同时检查真实接触滑移、胶头中心位移和柔性转动。不是完整 CFD 或真机验证。'};
 root.querySelectorAll('[data-ego-check]').forEach(b=>b.addEventListener('click',()=>{root.querySelectorAll('[data-ego-check]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));setText('check-detail',checks[b.dataset.egoCheck])}));
 fetch(MEDIA+'manifest.json').then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(m=>{manifest=m;sourcePhases=m.phases;phases=native()?physicalPhases:sourcePhases;if(!m.motion_v6)checks.ik=`${m.total_frames} 个运动学样本；关节位置限制${m.joint_bounds_pass?'通过':'未通过'}。最大 TCP 位置残差 ${(m.max_tcp_error_m*1000).toFixed(2)} mm，最大关节速度 ${m.max_joint_speed_rad_s.toFixed(2)} rad/s。碰撞与动力学未验证。`;update()}).catch(()=>{});
 fetch(MEDIA+'physics-v10/native-review.json').then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(r=>{checks.ik=`连续 30 Hz 实际求解回放；关节位置、控制和驱动力限制均通过。接触处累计切向滑移 ${(Math.max(...r.patch_slip_m)*1000).toFixed(2)} mm；胶头中心偏移 ${(r.grasp_center_max_drift_m*1000).toFixed(2)} mm，转动 ${r.grasp_rotation_max_deg.toFixed(2)}°。管尖相对位移 ${(r.hold_max_slip_m*1000).toFixed(2)} mm，原 5 mm 门槛通过。`}).catch(()=>{});
 select(0);
 return{setActive(v){active=v;if(!v)pause()},pause};
}
