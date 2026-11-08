// Visual review of saved artifacts. No browser-side solver or inference claims.
const media = name => new URL(`./media/r13/${name}`, import.meta.url).href;
const pick = (zh, en, lang) => lang === 'en' ? en : zh;

export function mountAgentConversion(root) {
  if (!root) return null;
  let language = document.documentElement.lang.startsWith('en') ? 'en' : 'zh';
  let active = false, stage = 0, variant = 'pose', revision = 0, loaded = false, cloud, cloudPending;
  const clocks = new Map();
  const t = (zh, en) => pick(zh, en, language);
  const stages = () => [t('任务理解', 'Task'), t('场景重建', 'Scene'), t('手部接触', 'Hand'), t('动作重定向', 'Robot')];
  const options = () => [
    [['pose', t('关节与手型', 'Pose & mesh')]],
    [['sam', 'SAM'], ['depth', t('深度', 'Depth')], ['cloud', t('点云', 'Point cloud')], ['assets', t('场景资产', 'Scene assets')], ['code', 'Coding Agent']],
    [['pose', t('手型叠加', 'Hand overlay')], ['prior', t('接触先验', 'Contact prior')]],
    [['ego', t('机器人 Ego', 'Robot Ego')], ['third', t('第三视角 · 接触', 'Overview · contact')]],
  ][stage];
  const asset = () => stage === 1 ? `scene-${variant}` : stage === 3 ? `robot-${variant}` : variant === 'prior' ? 'hand-prior' : 'hand-pose';
  root.className = 'pipeline-showcase';
  root.setAttribute('data-i18n-skip', '');
  root.removeAttribute('data-ego-compact');
  root.innerHTML = `<header class="ps-header"><strong><i></i>Ego2Sim</strong><span>01 — 04</span></header>
    <nav class="ps-stages" role="tablist"></nav>
    <section id="ego-stage" role="tabpanel">
      <div class="ps-toolbar"><span class="ps-model"></span><div class="ps-views" role="group"></div></div>
      <div class="ps-screen"><video data-pipeline-video muted playsinline preload="metadata"></video>
        <img class="ps-scene-image" alt="" hidden><div class="ps-cloud" hidden></div>
        <div class="ps-code" hidden><header>scene.pipeline.ts</header><pre><code></code></pre></div>
        <button class="ps-reset" type="button" hidden>↺</button>
        <div class="ps-error" role="status" hidden><span></span><button type="button"></button></div></div>
      <div class="ps-playback"><button type="button" data-ps-play></button><input type="range" data-ps-scrub min="0" max="9" step=".033333" value="0"><output data-ps-time></output><button type="button" data-ps-full>⛶</button></div>
      <div class="ps-bottom"><span class="ps-footnote"></span><div class="ps-legend" hidden><span>0</span><i></i><span>1</span></div></div>
      <details class="ps-details"><summary></summary><div></div></details>
    </section>`;
  const video = root.querySelector('video');
  const error = root.querySelector('.ps-error');
  const pause = () => video.pause();
  const key = () => `${stage}:${asset()}`;
  function metadata() {
    const notes = [
      t('原始人手上叠加关节与 MANO 手模。', 'Joints and MANO mesh over the original human hand.'),
      variant==='assets'?t('已有 1030 场景资产', 'Existing scene 1030 assets'):variant==='cloud'||variant==='code'?t('相对深度点云 · 拖动旋转', 'Relative-depth cloud · drag to orbit'):t('同一来源帧 · 17.0 s', 'Same source frame · 17.0 s'),
      variant === 'prior' ? t('HACO 接触概率 · 非受力', 'HACO contact probability · not force') : t('原始人手 · 半透明重建', 'Original hand · translucent reconstruction'),
      variant === 'ego' ? t('1030 场景 · 渲染相机 · 2×', 'Scene 1030 · rendered camera · 2×') : t('彩色 → 接触白模 → 彩色 · 连续轨迹', 'Color → contact surface → color · continuous trajectory'),
    ];
    root.querySelector('.ps-footnote').textContent = notes[stage];
    root.querySelector('.ps-legend').hidden = !(stage === 2 && variant === 'prior');
    root.querySelector('.ps-model').textContent = ['HaWoR / MANO', 'SAM / Depth Anything', variant === 'prior' ? 'MANO / HACO' : 'HaWoR / MANO', 'ROKAE / WUJI'][stage];
    const descriptions = [
      t('与新版成片使用相同的 IMG_6263 片段（来源 8–17 秒）。保留人手与现场画面，叠加已有 HaWoR 初始化、后续细化的 MANO 和 21 关节点；不是新一轮姿态推理。', 'The same IMG_6263 segment as the latest edit (source 8–17 s). Original hands and scene remain visible beneath existing HaWoR-initialized, refined MANO and 21 joints; no new inference.'),
      t('分割、深度和点云均使用 IMG_6263 第 102 帧（17 秒）的已保存输出；点云从该帧相对深度反投影，排除 SAM 人手区域，未做公制尺度标定。资产页单独展示已有 1030 场景渲染，并非声称由这张图片恢复了全部资产。代码展示当前数据接口配置，不是实时智能体日志。', 'Masks, depth and point cloud use saved outputs from IMG_6263 frame 102 (17 s). Points are back-projected from relative depth with the SAM hand mask excluded; scale is not metric-calibrated. The separate asset view shows the existing 1030 scene, not assets newly recovered from this image. Code shows the current artifact contract, not live agent logs.'),
      t('沿用原视频的估计内参和固定裁切，将手模投回原手。接触颜色来自最近的实际 HACO 采样；原始概率约 6 Hz，几何为已有 30 Hz 时序重建。物体深度用于遮挡，不透视显示背面接触；颜色不是压力、力或实测接触面积。相机内参仍为估计值。', 'The mesh is projected onto the original hand with existing estimated intrinsics and a fixed crop. Color uses the nearest actual HACO sample (about 6 Hz); geometry uses the existing 30 Hz temporal reconstruction. Object depth occludes hidden contacts. Color is not pressure, force or measured contact area. Intrinsics remain estimated.'),
      t('复用 1030 材质和保存的 MuJoCo＋Newton 状态，仅改变渲染机位与展示。Ego 对应仿真源时间 9–32 秒、已按 2 倍速编码。第三视角接续 32–65 秒，白模使用同一相机与连续状态。机器人来源 IMG_0756 与人手 IMG_6263 是不同记录；不宣称逐帧同源或新增物理验收。', 'Reuses the 1030 materials and saved MuJoCo + Newton state. Ego covers simulation 9–32 s at baked 2× speed; overview continues 32–65 s with a single camera through the material blend. Robot IMG_0756 and human IMG_6263 are separate records, not a frame-aligned source or a new physics validation.'),
    ];
    const detail = root.querySelector('.ps-details div');
    detail.replaceChildren();
    const paragraph = document.createElement('p'); paragraph.textContent = descriptions[stage]; detail.append(paragraph);
    const p = document.createElement('p');
    p.textContent = t('参考 EgoSmith 的同帧投影和有效帧检查。DPVO＋Any4D 的相机跟踪与尺度对齐属于后续接入项，本次未运行。', 'EgoSmith informs same-frame projection and valid-frame checks. DPVO + Any4D camera tracking and scale alignment are integration proposals, not executed in this release.');
    const a = document.createElement('a');a.href = 'https://github.com/egosteer/egosmith/blob/main/docs/dataset_pipeline.md';a.target = '_blank';a.rel = 'noopener';a.textContent = 'EgoSmith ↗';p.append(' ', a);detail.append(p);
    const receipt = document.createElement('a');receipt.href = new URL('./data/showcase-r13.json', import.meta.url);receipt.target = '_blank';receipt.rel = 'noopener';receipt.textContent = t('素材与来源记录 ↗', 'Artifact provenance ↗');detail.append(receipt);
  }
  function chrome() {
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
    const views = root.querySelector('.ps-views'); views.setAttribute('aria-label',t('展示内容', 'View'));
    views.innerHTML = options().map(([id,label]) => `<button type="button" data-pipeline-view="${id}" aria-pressed="${variant === id}">${label}</button>`).join('');
    views.querySelectorAll('button').forEach(button => button.onclick = () => choose(button.dataset.pipelineView));
    root.querySelector('.ps-details summary').textContent = t('来源与方法', 'Sources & methods');
    video.setAttribute('aria-label', stages()[stage]);
    root.querySelector('[data-ps-play]').textContent=video.paused?t('播放','Play'):t('暂停','Pause');
    root.querySelector('[data-ps-scrub]').setAttribute('aria-label',t('播放进度','Playback position'));
    root.querySelector('[data-ps-full]').setAttribute('aria-label',t('全屏播放','Fullscreen'));
    root.querySelector('.ps-reset').setAttribute('aria-label',t('重置点云视角','Reset point cloud view'));
    error.querySelector('span').textContent = t('视频暂未载入', 'Video could not load');
    error.querySelector('button').textContent = t('重新加载', 'Retry');
    metadata();
  }
  function load(at) {
    const token = ++revision;
    const current = asset();
    loaded = true; error.hidden = true;
    const isScene=stage===1,isCloud=isScene&&['cloud','code'].includes(variant);
    video.hidden=isScene;root.querySelector('.ps-playback').hidden=isScene;
    const sceneImage=root.querySelector('.ps-scene-image');sceneImage.hidden=!isScene||isCloud;
    root.querySelector('.ps-cloud').hidden=!isCloud;
    root.querySelector('.ps-code').hidden=!(isScene&&variant==='code');
    root.querySelector('.ps-reset').hidden=!isCloud;
    root.dataset.pipelineStage=String(stage);root.dataset.pipelineView=variant;
    if(isScene){
      root.dataset.pipelineReady='false';
      if(isCloud){
        cloudPending??=import('./scene-r13.js').then(m=>m.createSceneCloud(root.querySelector('.ps-cloud')));
        cloudPending.then(instance=>{cloud=instance;if(token!==revision)return;cloud.resize();root.dataset.pipelineReady='true';
          root.querySelector('.ps-code code').textContent=`const scene = {\n  source: "IMG_6263",\n  frame: 102,\n  segmentation: "SAM",\n  depth: "DA3.relative",\n  points: ${cloud.meta.points},\n  handMask: "exclude",\n  metricScale: null,\n  assets: "1030.saved",\n  newSolve: false,\n} satisfies SceneInput;`;
        }).catch(()=>{if(token===revision)error.hidden=false;});
      }else{
        sceneImage.onload=()=>{if(token===revision)root.dataset.pipelineReady='true';};
        sceneImage.onerror=()=>{if(token===revision)error.hidden=false;};sceneImage.src=media(`${current}.jpg`);
        sceneImage.alt=variant==='assets'?t('已有 1030 仿真场景','Existing simulation scene 1030'):t('第 102 帧的感知输出','Perception output at frame 102');
      }
      return;
    }
    video.onloadedmetadata = () => {
      if (token !== revision) return;
      video.currentTime = Math.max(0, Math.min(at, video.duration - .04));
      root.dataset.pipelineReady = 'true';
    };
    video.poster = media(`${current}.jpg`);
    if (video.getAttribute('src') !== media(`${current}.mp4`)) {
      root.dataset.pipelineReady = 'false'; video.src = media(`${current}.mp4`); video.load();
    } else if (video.readyState >= 1) video.currentTime = Math.min(at, video.duration - .04);
    root.dataset.pipelineStage = String(stage); root.dataset.pipelineView = variant;
  }
  function choose(next) {
    clocks.set(key(), video.currentTime || 0); pause(); variant = next; chrome();
    const offset = stage === 1 ? 0 : (clocks.get(key()) ?? 0);
    if (active) load(offset); else loaded = false;
  }
  function select(next) {
    if (next < 0 || next > 3) return;
    clocks.set(key(), video.currentTime || 0); pause();stage = next;
    variant = ['pose','sam','pose','ego'][stage]; chrome();
    if (active) load(clocks.get(key()) ?? 0); else loaded = false;
  }
  video.addEventListener('error', () => {error.hidden = false;root.dataset.pipelineReady = 'false';});
  video.addEventListener('play', () => {if (!active || document.hidden) pause();});
  error.querySelector('button').onclick = () => {error.hidden = true;if(stage===1){cloudPending=undefined;root.querySelector('.ps-cloud').replaceChildren();load(0);}else video.load();};
  function playback(){const duration=Number.isFinite(video.duration)?video.duration:0;root.querySelector('[data-ps-scrub]').max=duration||9;root.querySelector('[data-ps-scrub]').value=video.currentTime;root.querySelector('[data-ps-time]').textContent=`${video.currentTime.toFixed(1)} / ${duration.toFixed(1)} s`;root.querySelector('[data-ps-play]').textContent=video.paused?t('播放','Play'):t('暂停','Pause');}
  for(const event of ['timeupdate','play','pause','loadedmetadata','ended'])video.addEventListener(event,playback);
  root.querySelector('[data-ps-play]').onclick=()=>{if(video.paused)video.play().catch(()=>{error.hidden=false;});else pause();};
  root.querySelector('[data-ps-scrub]').oninput=event=>{video.currentTime=Number(event.target.value);};
  root.querySelector('[data-ps-full]').onclick=()=>{if(video.webkitEnterFullscreen)video.webkitEnterFullscreen();else root.querySelector('#ego-stage').requestFullscreen?.();};
  root.querySelector('.ps-reset').onclick=()=>cloud?.reset();
  document.addEventListener('visibilitychange', () => {if(document.hidden)pause();});
  new IntersectionObserver(([entry]) => {if(!entry.isIntersecting)pause();},{threshold:.02}).observe(root);
  document.addEventListener('languagechange', event => {language = event.detail.language;chrome();});
  const requested = new URLSearchParams(location.search).get('stage');
  if (requested === 'contact') stage = 2;
  if (requested === 'robot') {stage = 3;variant = 'ego';}
  chrome();
  return {pause,selectStage:select,setActive(value) {active=value;if(!active)pause();else if(!loaded)load(clocks.get(key())??0);},get source(){return stage===3?'IMG_0756':'IMG_6263';}};
}
