import {mountFeedbackLoop} from './feedback-loop-r15.js';
// Visual review of saved artifacts. No browser-side solver or inference claims.
const media = name => new URL(`./media/r13/${name}`, import.meta.url).href;
const toolImage = name => new URL(`./media/r14/${name}`, import.meta.url).href;
const pick = (zh, en, lang) => lang === 'en' ? en : zh;

export function mountAgentConversion(root) {
  if (!root) return null;
  let language = document.documentElement.lang.startsWith('en') ? 'en' : 'zh';
  let active = false, stage = 0, variant = 'task', revision = 0, loaded = false, cloud, cloudPending;
  const clocks = new Map(); let handZoom=true, compare=true, split=52;
  const staticHand = () => stage === 2 && ['joints','mesh','prior','distance'].includes(variant);
  const t = (zh, en) => pick(zh, en, language);
  const stages = () => [t('任务理解', 'Task'), t('场景重建', 'Scene'), t('手部接触', 'Hand'), t('动作重定向', 'Robot')];
  const options = () => [
    [],
    [['sam', 'SAM'], ['depth', t('深度', 'Depth')], ['assets', t('场景资产', 'Scene assets')]],
    [['joints',t('手部姿态','Hand pose')],['mesh',t('手型重建','Hand mesh')],['prior',t('接触先验','Contact prior')],['pose',t('连续回放','Playback')]],
    [['ego', t('机器人 Ego', 'Robot Ego')], ['third', t('第三视角 · 接触', 'Overview · contact')]],
  ][stage];
  const asset = () => stage === 0 ? 'ego-continuous' : stage === 1 ? `scene-${variant}` : stage === 3 ? `robot-${variant}` : variant === 'pose' ? 'hand-prior' : `hand-${variant}`;
  root.className = 'pipeline-showcase tool-pipeline visual-focus';
  root.setAttribute('data-i18n-skip', '');
  root.removeAttribute('data-ego-compact');
  root.innerHTML = `<header class="ps-header"><strong><i></i>Ego2Sim</strong><span data-review-label></span></header>
    <nav class="ps-stages" role="tablist"></nav>
    <section id="ego-stage" role="tabpanel">
      <div class="feedback-loop"></div><div class="tp-output-heading"><span data-output-name></span><div class="vf-actions"><small data-output-clock></small><button type="button" data-vf-compare></button><button type="button" data-vf-focus></button></div></div>
      <div class="ps-screen"><video data-pipeline-video muted playsinline preload="metadata"></video>
        <img class="ps-scene-image" alt="" hidden><div class="ps-cloud" hidden></div><div class="vf-depth" hidden><img alt=""><span class="vf-divider">↔</span></div>

        <button class="ps-reset" type="button" hidden>↺</button>
        <div class="ps-error" role="status" hidden><span></span><button type="button"></button></div></div>
      <div class="ps-playback"><button type="button" data-ps-play></button><input type="range" data-ps-scrub min="0" max="9" step=".033333" value="0"><output data-ps-time></output><button type="button" data-ps-full>⛶</button></div>
      <div class="vf-split" hidden><span>SAM3</span><input type="range" min="0" max="100" value="52" data-vf-split><span>Depth Anything 3</span></div><div class="ps-views" role="group"></div><div class="vf-inspect"><button type="button" data-vf-inspect></button></div><div class="ps-bottom"><span class="ps-footnote"></span><div class="ps-legend" hidden><span>0</span><i></i><span>1</span></div></div>
      <details class="ps-details"><summary></summary><div></div></details>
    </section>`;
  const video = root.querySelector('video');
  const error = root.querySelector('.ps-error');
  const feedback = mountFeedbackLoop(root.querySelector('.feedback-loop'));
  const clip = (name,ext) => stage===0?new URL(`./media/ego-continuous.${ext}`,import.meta.url).href:media(`${name}.${ext}`);
  const pause = () => video.pause();
  const key = () => `${stage}:${asset()}`;

  function engine(id){return {frames:'FFmpeg',vlm:'VLM',segments:'Ego2Sim',sam:'SAM3',depth:'Depth Anything 3',cloud:'Ego2Sim',assets:'Blender / CAD',joints:'HaWoR',mesh:'MANO',prior:'HACO',distance:'Ego2Sim',pose:'HaWoR / HACO',ego:'ROKAE / WUJI',third:'MuJoCo + Newton'}[id];}
  function thumb(id){if(['joints','mesh','prior','distance'].includes(id))return toolImage(`hand-${id}.jpg`);if(['frames','vlm','segments'].includes(id))return toolImage({frames:'task-00013.jpg',vlm:'task-00091.jpg',segments:'task-00205.jpg'}[id]);if(id==='cloud')return toolImage('scene-cloud.jpg');if(['sam','depth','assets'].includes(id))return media(`scene-${id}.jpg`);return media(`${id==='pose'?'hand-prior':`robot-${id}`}.jpg`);}
  function visualControls(){
    root.dataset.visualStage=String(stage);
    const isCompare=stage===1&&variant==='sam'&&compare;
    const overlay=root.querySelector('.vf-depth');overlay.hidden=!isCompare;
    if(isCompare){const img=overlay.querySelector('img');img.src=media('scene-depth.jpg');img.alt=t('同帧相对深度','Same-frame relative depth');}
    root.querySelector('.vf-split').hidden=!isCompare;
    root.querySelector('[data-vf-split]').setAttribute('aria-label',t('分割与深度分界','Segmentation / depth divider'));
    root.style.setProperty('--depth-split',split+'%');
    const compareButton=root.querySelector('[data-vf-compare]');compareButton.hidden=stage!==1||variant!=='sam';compareButton.textContent=t('分割 / 深度','Mask / depth');compareButton.setAttribute('aria-pressed',String(compare));
    const zoomButton=root.querySelector('[data-vf-focus]');zoomButton.hidden=stage!==2;zoomButton.textContent=handZoom?t('查看全景','Context view'):t('接触特写','Contact close-up');zoomButton.setAttribute('aria-pressed',String(handZoom));
    root.classList.toggle('vf-hand-focus',stage===2&&handZoom);
    const inspector=root.querySelector('[data-vf-inspect]');inspector.parentElement.hidden=stage!==1&&stage!==2;inspector.textContent=stage===1?t('几何检查 · 点云 ↗','Geometry · point cloud ↗'):t('几何检查 · 表面距离 ↗','Geometry · surface distance ↗');
  }
  root.querySelector('[data-vf-compare]').onclick=()=>{compare=!compare;visualControls();};
  root.querySelector('[data-vf-focus]').onclick=()=>{handZoom=!handZoom;visualControls();};
  root.querySelector('[data-vf-split]').oninput=e=>{split=Number(e.target.value);root.style.setProperty('--depth-split',split+'%');};
  root.querySelector('[data-vf-inspect]').onclick=()=>choose(stage===1?'cloud':'distance');
  function metadata() {
    const notes = [
      t('关键帧 → 目标对象 → 动作阶段','Keyframes → objects → action stages'),
      variant==='assets'?t('已有 1030 场景资产', 'Existing scene 1030 assets'):variant==='cloud'?t('相对深度点云 · 拖动旋转', 'Relative-depth cloud · drag to orbit'):t('同一来源帧 · 17.0 s', 'Same source frame · 17.0 s'),
      variant==='distance'?t('绿：邻近表面 · 紫：局部内偏移','Green: near surface · purple: local inward offset'):variant==='prior'?t('HACO 接触概率 · 非受力','HACO contact probability · not force'):t('原手保留 · 同帧投影','Original hand retained · same-frame projection'),
      variant === 'ego' ? t('1030 场景 · 渲染相机 · 2×', 'Scene 1030 · rendered camera · 2×') : t('彩色 → 接触白模 → 彩色 · 连续轨迹', 'Color → contact surface → color · continuous trajectory'),
    ];
    root.querySelector('.ps-footnote').textContent = notes[stage];
    root.querySelector('.ps-legend').hidden = !(stage === 2 && variant === 'prior');

    const descriptions = [
      t('保留 VLM 视频理解流程：原片关键帧、既有动作阶段和本次 Codex 多模态关键帧复核。未额外调用远程 VLM API；视觉阶段不代表液体输送或物理验收。','Preserves VLM video understanding with original keyframes, existing phase annotations and a Codex multimodal keyframe review. No additional remote VLM API was called; visual phases do not establish fluid delivery or physics acceptance.'),
      t('SAM3、DA3 和点云均使用 IMG_6263 第 102 帧（17 秒）的已保存输出；点云从该帧相对深度反投影，排除 SAM 人手区域，未做公制尺度标定。资产页单独展示已有 1030 场景渲染，并非声称由这张图片恢复了全部资产。服务器支持 Open3D TSDF 模块；此点云不冒称多帧融合结果。', 'Masks, depth and point cloud use saved outputs from IMG_6263 frame 102 (17 s). Points are back-projected from relative depth with the SAM hand mask excluded; scale is not metric-calibrated. The separate asset view shows the existing 1030 scene, not assets newly recovered from this image. The server has an Open3D TSDF module; this point cloud is not a multi-frame fusion result.'),
      t('沿用原视频的估计内参和固定裁切，将手模投回原手。接触颜色来自最近的实际 HACO 采样；原始概率约 6 Hz，几何为已有 30 Hz 时序重建。物体深度用于遮挡，不透视显示背面接触；颜色不是压力、力或实测接触面积。表面检查使用已保存的手模到物体网格距离：2 mm 内着色，紫色表示局部法线内偏移；不是严格穿透深度或接触力。相机内参仍为估计值。', 'The mesh is projected onto the original hand with existing estimated intrinsics and a fixed crop. Color uses the nearest actual HACO sample (about 6 Hz); geometry uses the existing 30 Hz temporal reconstruction. Object depth occludes hidden contacts. Color is not pressure, force or measured contact area. The surface check colors saved hand-to-object distances within 2 mm; purple indicates local inward normal offset, not strict penetration depth or force. Intrinsics remain estimated.'),
      t('复用 1030 材质和保存的 MuJoCo＋Newton 状态，仅改变渲染机位与展示。Ego 对应仿真源时间 9–32 秒、已按 2 倍速编码。第三视角接续 32–65 秒，白模使用同一相机与连续状态。机器人来源 IMG_0756 与人手 IMG_6263 是不同记录；不宣称逐帧同源或新增物理验收。', 'Reuses the 1030 materials and saved MuJoCo + Newton state. Ego covers simulation 9–32 s at baked 2× speed; overview continues 32–65 s with a single camera through the material blend. Robot IMG_0756 and human IMG_6263 are separate records, not a frame-aligned source or a new physics validation.'),
    ];
    const detail = root.querySelector('.ps-details div');
    detail.replaceChildren();
    const paragraph = document.createElement('p'); paragraph.textContent = descriptions[stage]; detail.append(paragraph);
    const feedbackNote=document.createElement('p');feedbackNote.textContent=t('闭环来自服务器 verify、feedback、cache 与 optimize 模块。图中演示反馈路由，不启动任务；物理修复仍由 Coding Agent 依据证据修改配置后重跑。外观优化是单独的有界循环，并验证物理缓存保持。','The loop follows server verify, feedback, cache and optimize modules. It demonstrates routing without dispatching jobs. Physical repairs remain evidence-directed Coding Agent edits; appearance optimization is a separate bounded loop that verifies physics cache reuse.');detail.append(feedbackNote);
    const p = document.createElement('p');
    p.textContent = t('参考 EgoSmith 的同帧投影和有效帧检查。DPVO＋Any4D 的相机跟踪与尺度对齐属于后续接入项，本次未运行。', 'EgoSmith informs same-frame projection and valid-frame checks. DPVO + Any4D camera tracking and scale alignment are integration proposals, not executed in this release.');
    const a = document.createElement('a');a.href = 'https://github.com/egosteer/egosmith/blob/main/docs/dataset_pipeline.md';a.target = '_blank';a.rel = 'noopener';a.textContent = 'EgoSmith ↗';p.append(' ', a);detail.append(p);
    const receipt = document.createElement('a');receipt.href = new URL('./data/visual-focus-r15.json', import.meta.url);receipt.target = '_blank';receipt.rel = 'noopener';receipt.textContent = t('服务器工具映射与来源 ↗', 'Server tools & provenance ↗');detail.append(receipt);
    const refs=document.createElement('p');refs.className='tp-references';for(const [label,href] of [['EgoMatrix','https://spikew726.github.io/EgoMatrix/'],['DexAgent','https://dexagent1.github.io/'],['EgoCPT','https://ego-cpt.github.io/']]){const a=document.createElement('a');a.textContent=label+' ↗';a.href=href;a.target='_blank';a.rel='noopener';refs.append(a);}detail.append(refs);
  }
  function chrome() {
    root.querySelector('[data-review-label]').textContent=t('观察 · 重建 · 反馈','OBSERVE · RECONSTRUCT · REFINE');
    root.querySelector('.ps-stages').setAttribute('aria-label', t('处理阶段', 'Pipeline stages'));
    root.querySelector('.ps-stages').innerHTML = stages().map((label,i) => `<button type="button" role="tab" id="ego-tab-${i}" aria-controls="ego-stage" aria-selected="${stage === i}" tabindex="${stage === i ? 0 : -1}" data-ego-step="${i}"><span>0${i + 1}</span><b>${label}</b></button>`).join('');
    root.querySelectorAll('[data-ego-step]').forEach((button,i) => {
      button.onclick = () => select(i);
      button.onkeydown = event => {
        let next;
        if (event.key === 'ArrowRight') next = (i + 1) % 4;
        if (event.key === 'ArrowLeft') next = (i + 3) % 4;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = 3;
        if (next !== undefined) {event.preventDefault();select(next);root.querySelector(`[data-ego-step="${next}"]`).focus();}
      };
    });
    root.querySelector('#ego-stage').setAttribute('aria-labelledby', `ego-tab-${stage}`);
    const views = root.querySelector('.ps-views'); views.setAttribute('aria-label',t('工具输出', 'Tool outputs')); views.style.setProperty('--tools',options().length);
    views.hidden=stage===0;root.querySelector('.tp-output-heading').hidden=stage===0;root.querySelector('.ps-bottom').hidden=stage===0;root.querySelector('.ps-details').hidden=stage===0;root.querySelector('.feedback-loop').hidden=stage===0;feedback.setLanguage(language);feedback.setStage(stage);feedback.setActive(active&&stage!==0);
    root.querySelector('[data-output-name]').textContent=options().find(x=>x[0]===variant)?.[1]||(variant==='cloud'?t('几何检查','Geometry inspection'):variant==='distance'?t('表面距离','Surface distance'):'');
    root.querySelector('[data-output-clock]').textContent=stage===0?'IMG_6263 · 00–44 s':stage===1?(variant==='assets'?'1030':'17.0 s'):stage===2?'12.0 s':'1030 · 2×';
    views.innerHTML = options().map(([id,label],i) => `<button type="button" data-pipeline-view="${id}" aria-pressed="${variant === id}"><div class="tp-thumb"><img src="${thumb(id)}" alt="" loading="lazy"><span>0${i+1}</span></div><div class="tp-tool-label"><small>${engine(id)}</small><b>${label}</b></div></button>`).join('');
    views.querySelectorAll('button').forEach(button => button.onclick = () => choose(button.dataset.pipelineView));
    root.querySelector('.ps-details summary').textContent = t('来源与方法', 'Sources & methods');
    video.setAttribute('aria-label', stages()[stage]);
    root.querySelector('[data-ps-play]').textContent=video.paused?t('播放','Play'):t('暂停','Pause');
    root.querySelector('[data-ps-scrub]').setAttribute('aria-label',t('播放进度','Playback position'));
    root.querySelector('[data-ps-full]').setAttribute('aria-label',t('全屏播放','Fullscreen'));
    root.querySelector('.ps-reset').setAttribute('aria-label',t('重置点云视角','Reset point cloud view'));
    error.querySelector('span').textContent = t('输出暂未载入', 'Output could not load');
    error.querySelector('button').textContent = t('重新加载', 'Retry');
    visualControls();
    metadata();
  }
  function load(at) {
    const token = ++revision;
    const current = asset();
    loaded = true; error.hidden = true;
    const isScene=stage===1,isCloud=isScene&&variant==='cloud',isHandImage=staticHand();
    video.hidden=isScene||isHandImage;root.querySelector('.ps-playback').hidden=isScene||isHandImage;
    const sceneImage=root.querySelector('.ps-scene-image');sceneImage.hidden=(!isScene&&!isHandImage)||isCloud;
    root.querySelector('.ps-cloud').hidden=!isCloud;
    root.querySelector('.ps-reset').hidden=!isCloud;
    root.dataset.pipelineStage=String(stage);root.dataset.pipelineView=variant;
    if(isHandImage){root.dataset.pipelineReady='false';sceneImage.onload=()=>{if(token===revision){root.dataset.pipelineReady='true';if(!matchMedia('(prefers-reduced-motion: reduce)').matches)sceneImage.animate([{opacity:.55},{opacity:1}],{duration:180});}};sceneImage.onerror=()=>{if(token===revision)error.hidden=false;};sceneImage.src=thumb(variant);sceneImage.alt=variant==='distance'?t('表面距离','Surface distance'):options().find(x=>x[0]===variant)[1];return;}
    if(isScene){
      root.dataset.pipelineReady='false';
      if(isCloud){
        cloudPending??=import('./scene-r13.js').then(m=>m.createSceneCloud(root.querySelector('.ps-cloud')));
        cloudPending.then(instance=>{cloud=instance;if(token!==revision)return;cloud.resize();root.dataset.pipelineReady='true';
        }).catch(()=>{if(token===revision)error.hidden=false;});
      }else{
        sceneImage.onload=()=>{if(token===revision){root.dataset.pipelineReady='true';if(!matchMedia('(prefers-reduced-motion: reduce)').matches)sceneImage.animate([{opacity:.55},{opacity:1}],{duration:180});}};
        sceneImage.onerror=()=>{if(token===revision)error.hidden=false;};sceneImage.src=clip(current,'jpg');
        sceneImage.alt=variant==='assets'?t('已有 1030 仿真场景','Existing simulation scene 1030'):t('第 102 帧的感知输出','Perception output at frame 102');
      }
      return;
    }
    video.onloadedmetadata = () => {
      if (token !== revision) return;
      video.currentTime = Math.max(0, Math.min(at, video.duration - .04));
      root.dataset.pipelineReady = 'true';
    };
    video.poster = clip(current,'jpg');
    if (video.getAttribute('src') !== clip(current,'mp4')) {
      root.dataset.pipelineReady = 'false'; video.src = clip(current,'mp4'); video.load();
    } else if (video.readyState >= 1) {video.currentTime = Math.min(at, video.duration - .04);root.dataset.pipelineReady='true';} else video.load();
    root.dataset.pipelineStage = String(stage); root.dataset.pipelineView = variant;
  }
  function choose(next) {
    if(!video.hidden)clocks.set(key(), video.currentTime || 0); pause(); variant = next; chrome();
    const offset = stage === 1 ? 0 : (clocks.get(key()) ?? (stage===2?4:0));
    if (active) load(offset); else loaded = false;
  }
  function select(next) {
    if (next < 0 || next > 3) return;
    if(!video.hidden)clocks.set(key(), video.currentTime || 0); pause();stage = next;
    variant = ['task','sam','prior','ego'][stage]; chrome();
    if (active) load(clocks.get(key()) ?? (stage===2?4:0)); else loaded = false;
  }
  video.addEventListener('error', () => {if(!video.hidden){error.hidden = false;root.dataset.pipelineReady = 'false';}});
  video.addEventListener('play', () => {if (!active || document.hidden) pause();});
  error.querySelector('button').onclick = () => {error.hidden = true;if(stage===1&&variant==='cloud'){cloudPending=undefined;root.querySelector('.ps-cloud').replaceChildren();}load(stage===2?4:0);};
  function playback(){const duration=Number.isFinite(video.duration)?video.duration:0;root.querySelector('[data-ps-scrub]').max=duration||9;root.querySelector('[data-ps-scrub]').value=video.currentTime;root.querySelector('[data-ps-time]').textContent=`${video.currentTime.toFixed(1)} / ${duration.toFixed(1)} s`;if(stage===2&&!staticHand())root.querySelector('[data-output-clock]').textContent=(8+video.currentTime).toFixed(1)+' s';root.querySelector('[data-ps-play]').textContent=video.paused?t('播放','Play'):t('暂停','Pause');}
  for(const event of ['timeupdate','play','pause','loadedmetadata','ended'])video.addEventListener(event,playback);
  root.querySelector('[data-ps-play]').onclick=()=>{if(video.paused)video.play().catch(()=>{error.hidden=false;});else pause();};
  root.querySelector('[data-ps-scrub]').oninput=event=>{video.currentTime=Number(event.target.value);};
  root.querySelector('[data-ps-full]').onclick=()=>{if(video.webkitEnterFullscreen)video.webkitEnterFullscreen();else root.querySelector('#ego-stage').requestFullscreen?.();};
  root.querySelector('.ps-reset').onclick=()=>cloud?.reset();
  document.addEventListener('visibilitychange', () => {if(document.hidden)pause();});
  new IntersectionObserver(([entry]) => {if(!entry.isIntersecting){pause();feedback.stop();}},{threshold:.02}).observe(root);
  document.addEventListener('languagechange', event => {language = event.detail.language;chrome();});
  const requested = new URLSearchParams(location.search).get('stage');
  if(requested==='scene'){stage=1;variant='sam';}
  if(requested==='contact'){stage=2;variant='prior';}
  if (requested === 'robot') {stage = 3;variant = 'ego';}
  chrome();
  return {pause,selectStage:select,setActive(value) {active=value;feedback.setActive(active&&stage!==0);if(!active)pause();else if(!loaded)load(clocks.get(key())??(stage===2?4:0));},get source(){return stage===3?'IMG_0756':'IMG_6263';}};
}
