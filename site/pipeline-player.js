import { icon } from './icons.js?v=expand-20261108';
import { paintPlaybackProgress } from './playback-progress.js?v=module-detail-20261102';

// One playback bar across the Pipeline section, the one the simulation pane
// already uses: square play button, thin timeline, time, restart.
//  - The first-person and real-robot clips lose the browser's own controls and
//    get that bar under the picture.
//  - The Ego2Sim pane builds its own player (pipeline/showcase-*.js); it is left
//    in place and only tagged, so the stylesheet can draw it the same way: the
//    play button gets a state and an icon, the timeline paints its progress.
// Every bar also has an enlarge button that opens the Gallery's large player
// (app.js listens for 'tezoi:enlarge-video'); the simulation comparison moves
// into that dialog whole, with its split and its own bar.
const root = document.querySelector('#playground');

const enlarge = detail => document.dispatchEvent(new CustomEvent('tezoi:enlarge-video', { detail }));
function enlargeButton() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'pipeline-expand';
  button.setAttribute('aria-label', '放大播放');
  button.innerHTML = icon('expand');
  return button;
}

const clock = seconds => {
  const s = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

function mountBar(video) {
  if (video.dataset.pipelineBar) return;
  video.dataset.pipelineBar = 'true';
  video.controls = false;
  video.removeAttribute('controls');
  const bar = document.createElement('div');
  bar.className = 'playback-bar pipeline-bar';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', '视频播放控制');
  bar.innerHTML = `<button class="compare-play" type="button" aria-label="播放">${icon('play')}</button>`
    + '<input class="compare-timeline" type="range" min="0" max="0" step="0.033333" value="0" aria-label="播放进度" disabled>'
    + '<output class="compare-time" aria-live="off">00:00 / 00:00</output>'
    + `<button class="compare-restart" type="button" aria-label="从头播放" disabled>${icon('replay')}</button>`;
  video.after(bar);
  const [play, timeline, time, restart] = bar.children;
  const expand = enlargeButton();
  bar.append(expand);
  bar.classList.add('has-expand');
  expand.addEventListener('click', () => {
    video.pause();
    const heading = video.closest('.workflow-panel')?.querySelector('.workflow-pane-heading h4');
    enlarge({ src: video.currentSrc || video.querySelector('source')?.src, poster: video.poster, title: heading?.textContent.trim() || video.getAttribute('aria-label') || '', source: expand });
  });

  function render() {
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const ready = duration > 0;
    timeline.disabled = !ready;
    restart.disabled = !ready;
    timeline.max = String(duration);
    if (document.activeElement !== timeline) timeline.value = String(video.currentTime || 0);
    paintPlaybackProgress(timeline);
    time.textContent = `${clock(video.currentTime)} / ${clock(duration)}`;
    const playing = !video.paused && !video.ended;
    play.innerHTML = icon(playing ? 'pause' : 'play');
    play.setAttribute('aria-label', playing ? '暂停' : '播放');
  }
  const toggle = () => {
    if (video.paused || video.ended) video.play().catch(() => {});
    else video.pause();
  };
  play.addEventListener('click', toggle);
  video.addEventListener('click', toggle);
  video.style.cursor = 'pointer';
  timeline.addEventListener('input', () => {
    video.currentTime = Number(timeline.value);
    paintPlaybackProgress(timeline);
  });
  restart.addEventListener('click', () => {
    video.currentTime = 0;
    video.play().catch(() => {});
  });
  ['loadedmetadata', 'durationchange', 'timeupdate', 'play', 'pause', 'ended', 'seeked'].forEach(type => video.addEventListener(type, render));
  render();
}

// The Ego2Sim player: tag the play button with its state (its text stays as its
// accessible name) and keep the timeline's painted progress in step.
function tagShowcase(playback) {
  const play = playback.querySelector('[data-ps-play]');
  const scrub = playback.querySelector('[data-ps-scrub]');
  const full = playback.querySelector('[data-ps-full]');
  if (full && full.getAttribute('aria-label') !== '放大播放' && full.getAttribute('aria-label') !== 'Enlarge') full.setAttribute('aria-label', '放大播放');
  if (play) {
    const playing = /暂停|pause/i.test(play.textContent);
    if (play.dataset.state !== (playing ? 'playing' : 'paused')) play.dataset.state = playing ? 'playing' : 'paused';
  }
  if (scrub) paintPlaybackProgress(scrub);
}

// The simulation comparison: its bar gets the enlarge button; the whole surface
// (split stage and bar) is shown in the dialog and returns when it closes.
function mountComparison(comparison) {
  const surface = comparison?.querySelector('.playback-surface');
  const bar = surface?.querySelector('.compare-controls');
  if (!bar || bar.querySelector('.pipeline-expand')) return;
  const expand = enlargeButton();
  bar.append(expand);
  bar.classList.add('has-expand');
  const play = bar.querySelector('[data-compare-play]');
  expand.addEventListener('click', () => enlarge({
    title: document.getElementById(comparison.getAttribute('aria-labelledby'))?.textContent.trim() || '',
    node: surface,
    source: expand,
    // Opening pauses every page player, and the comparison pauses itself once its
    // (now empty) page slot looks hidden; after that settles, start it in the dialog.
    onShow: () => setTimeout(() => {
      const film = surface.querySelector('[data-compare-simulation]');
      if (film?.paused && play && !play.disabled && surface.closest('#video-dialog')) play.click();
    }, 350),
  }));
}

// The Ego2Sim player's own fullscreen button opens the same dialog with the
// stage's current video; stages that show an image or point cloud keep their
// own fullscreen.
function enlargeShowcase(event) {
  const full = event.target.closest?.('[data-ps-full]');
  if (!full) return;
  const video = full.closest('#workflow-panel-agent')?.querySelector('[data-pipeline-video]');
  if (!video || video.hidden || !video.getClientRects().length || !(video.currentSrc || video.src)) return;
  event.preventDefault();
  event.stopPropagation();
  video.pause();
  enlarge({ src: video.currentSrc || video.src, poster: video.poster, title: video.getAttribute('aria-label') || '', source: full });
}

if (root) {
  root.querySelectorAll('[data-ego-video], [data-validation-video]').forEach(mountBar);
  mountComparison(root.querySelector('[data-contact-comparison]'));
  root.addEventListener('click', enlargeShowcase, true);
  const sweep = () => root.querySelectorAll('.ps-playback').forEach(tagShowcase);
  let queued = 0;
  const schedule = () => { if (!queued) queued = requestAnimationFrame(() => { queued = 0; sweep(); }); };
  // The showcase rewrites its player text and values as it plays.
  new MutationObserver(schedule).observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['value', 'max'] });
  root.addEventListener('timeupdate', schedule, true);
  root.addEventListener('input', schedule, true);
  sweep();
}
