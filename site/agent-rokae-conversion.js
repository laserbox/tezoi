import { paintPlaybackProgress } from './playback-progress.js?v=module-detail-20261102';
import { mountPreviewControls } from './preview-controls.js?v=module-detail-20261102';
// IMG_6263 preprocessing and kinematic mapping. No simulation is invoked.
const MEDIA='assets/ego2sim/rokae6263/';
const compactViews = [
 {main:['task','任务理解'], evidence:[]},
 {main:null,title:'场景与资产重建',evidence:[]},
 {main:['contact-ego-v3','接触约束下的三维手部'],evidence:[]},
 {main:['robot-ego-v3','机器人第一视角 · Rokae／Wuji'],evidence:[]}
];
const compactClocks={observation:{limit:44,label:'示范处理'},simulation:{limit:14,label:'运动学求解片段'}};
export function mountAgentConversion(root){return root ? mountCompactAgent(root) : null;}
function mountCompactAgent(root) {
 const $ = name => root.querySelector(`[data-ego-${name}]`);
 const output = $('output'), scrub = $('scrub');
 const tabs = [...root.querySelectorAll('[data-ego-step]')];
 const positions = {observation:0,simulation:0};
 const previews = [...root.querySelectorAll('[data-ego-preview]')];
 let evidenceVideos = [];
 const allPreviews = () => [...previews, ...evidenceVideos];
 const previewVisibility = new WeakMap();
 const previewObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
   const video = entry.target.matches('video') ? entry.target : entry.target.querySelector('video');
   previewVisibility.set(video, entry.isIntersecting);
   if (!entry.isIntersecting) video.pause();
  }
 }, {threshold:.05});
 const failures = new Set();
 let stage = 0, layer = 'task', clock = 'observation', time = 0;
 let active = false, inView = true, want = false, frame = null, revision = 0;
 const clockFor = () => stage < 3 ? 'observation' : 'simulation';
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
  paintPlaybackProgress(scrub);
  scrub.setAttribute('aria-label', `${settings.label}时间`);
  scrub.setAttribute('aria-valuetext', `${time.toFixed(1)} 秒，共 ${settings.limit.toFixed(1)} 秒`);
  setText('time', `${time.toFixed(1).padStart(4,'0')} / ${settings.limit.toFixed(1)} s`);
  $('play').textContent = want ? '暂停' : '播放';
  $('play').setAttribute('aria-label', want ? '暂停演示' : '播放演示');
 }
 function pause(exceptPreview = null) {
  remember();
  want = false;
  revision++;
  output.pause();
  allPreviews().forEach(video => { if (video !== exceptPreview) video.pause(); });
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
   update();
   if (time >= compactClocks[clock].limit) { pause(); return; }
  }
  frame = requestAnimationFrame(tick);
 }
 function play() {
  if (!compactViews[stage].main || !active || !inView || document.hidden || document.querySelector('dialog[open]') || failures.size) return;
  allPreviews().forEach(video => video.pause());
  if (time >= compactClocks[clock].limit - .05) jump(0);
  want = true;
  const token = ++revision;
  seekVideo(output, time, true);
  startVideo(output, token);
  if (frame === null) frame = requestAnimationFrame(tick);
  update();
 }
 function jump(value) {
  if (!compactViews[stage].main) return;
  time = Math.min(compactClocks[clock].limit, Math.max(0, value));
  positions[clock] = time;
  seekVideo(output, time, true);
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
  video.poster = `${MEDIA}${name}.jpg?v=rokae6263-ego-v3`;
  video.style.aspectRatio = '16 / 9';
  video.src = `${MEDIA}${name}.mp4?v=rokae6263-ego-v3`;
  video.load();
 }
 function choose(id) {
  const view = compactViews[stage];
  if (!view.main) return;
  pause();
  layer = id;
  clock = clockFor();
  time = positions[clock];
  if (output.dataset.media !== id) failures.delete(output);
  showFailures();
  load(output, id);
  const label = [view.main, ...view.evidence].find(([name]) => name === id)[1];
  output.setAttribute('aria-label', `${label}演示`);
  update();
 }
 function previewAllowed(video, ownerStage, evidence) {
  return active && inView && !document.hidden && !document.querySelector('dialog[open]')
   && stage === ownerStage && root.contains(video) && previewVisibility.get(video) !== false
   && (!evidence || $('evidence-panel').open);
 }
 function bindPreview(video, ownerStage, evidence = false) {
  const card = video.closest('figure');
  const error = card.querySelector('[data-ego-preview-error]');
  const retry = card.querySelector('[data-ego-preview-retry]');
  const current = () => root.contains(video) && video.hasAttribute('src');
  video.addEventListener('play', () => {
   if (!previewAllowed(video, ownerStage, evidence)) video.pause();
   else if (!video.paused) pause(video);
  });
  video.addEventListener('playing', () => {
   if (!previewAllowed(video, ownerStage, evidence)) video.pause();
  });
  video.addEventListener('error', () => { if (current()) { error.hidden = false; retry.hidden = false; } });
  video.addEventListener('loadeddata', () => { if (current()) { error.hidden = true; retry.hidden = true; } });
  retry.addEventListener('click', () => {
   if (!previewAllowed(video, ownerStage, evidence)) return;
   if (evidence) load(video, video.dataset.egoEvidence, true);
   else video.load();
   video.play().catch(errorEvent => {
    if (errorEvent.name !== 'AbortError' && current() && previewAllowed(video, ownerStage, evidence)) {
     error.hidden = false; retry.hidden = false;
    }
   });
   (card.querySelector('[data-preview-play]') || video).focus({preventScroll:true});
  });
  mountPreviewControls(video, {
   canPlay: () => previewAllowed(video, ownerStage, evidence),
   onError: () => { if (current()) { error.hidden = false; retry.hidden = false; } },
  });
  previewObserver.observe(evidence ? video : card);
 }
 function loadEvidence() {
  if (!active || !inView || document.hidden || !$('evidence-panel').open) return;
  for (const video of evidenceVideos) load(video, video.dataset.egoEvidence);
 }
 function renderEvidence(view) {
  for (const video of evidenceVideos) { previewObserver.unobserve(video); clearMedia(video); }
  evidenceVideos = [];
  $('layers').replaceChildren();
  setText('evidence-count', `${view.evidence.length} 段视频`);
  for (const [id, label] of view.evidence) {
   const card = document.createElement('figure');
   card.className = 'ego-preview-card';
   card.innerHTML = '<video playsinline muted preload="none"></video><figcaption><h6></h6></figcaption><p class="ego-preview-error" data-ego-preview-error role="status" hidden>视频加载失败，请重试。</p><button type="button" data-ego-preview-retry hidden></button>';
   const video = card.querySelector('video');
   video.muted = true;
   video.dataset.egoEvidence = id;
   video.setAttribute('aria-label', `${label}过程视频`);
   card.querySelector('h6').textContent = label;
   card.querySelector('button').textContent = `重试${label}`;
   $('layers').append(card);
   evidenceVideos.push(video);
   bindPreview(video, stage, true);
  }
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
  if (stage === 1) for (const video of previews) {
   if (!video.hasAttribute('src')) {
    const name = video.dataset.egoPreview;
    video.preload = 'metadata';
    video.poster = `${MEDIA}${name}.jpg?v=rokae6263-ego-v3`;
    video.src = `${MEDIA}${name}.mp4?v=rokae6263-ego-v3`;
   }
  }
  renderEvidence(view);
  if (view.main) choose(view.main[0]);
  else {
   layer = null;
   clock = 'observation';
   time = positions[clock];
   clearMedia(output);
   failures.clear();
   showFailures();
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
   const next = {ArrowRight:(index+1)%tabs.length,ArrowLeft:(index+tabs.length-1)%tabs.length,Home:0,End:tabs.length-1}[event.key];
   if (next !== undefined) { event.preventDefault(); select(next, true); }
  });
 });
 $('play').addEventListener('click', () => want ? pause() : play());
 scrub.addEventListener('input', () => { const value = Number(scrub.value); pause(); jump(value); });
 $('evidence-panel').addEventListener('toggle', () => {
  if ($('evidence-panel').open) loadEvidence();
  else evidenceVideos.forEach(video => video.pause());
 });
 $('retry').addEventListener('click', () => {
  for (const video of failures) load(video, video.dataset.media, true);
 });
 for (const video of [output]) {
  video.addEventListener('loadedmetadata', () => {
   video.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
   seekVideo(video, time, true);
  });
  video.addEventListener('loadeddata', () => {
   failures.delete(video); showFailures();
  });
  video.addEventListener('error', () => {
   if (!video.hasAttribute('src')) return;
   pause(); failures.add(video); showFailures();
  });
 }
 output.addEventListener('ended', () => {
  if (compactViews[stage].main) { time = compactClocks[clock].limit; pause(); }
 });
 for (const video of previews) bindPreview(video, 1);
 document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); else loadEvidence(); });
 window.addEventListener('pagehide', () => pause());
 new IntersectionObserver(entries => {
  inView = entries.some(entry => entry.isIntersecting);
  if (!inView) pause(); else loadEvidence();
 }, {threshold:.05}).observe(root);
 select(0);
 return {setActive(value) { active = value; if (!value) pause(); else loadEvidence(); }, pause};
}

