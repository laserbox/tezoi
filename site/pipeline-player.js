import { icon } from './icons.js?v=mobile-polish-20261023';
import { paintPlaybackProgress } from './playback-progress.js?v=module-detail-20261102';

// One playback bar across the Pipeline section, the one the simulation pane
// already uses: square play button, thin timeline, time, restart.
//  - The first-person and real-robot clips lose the browser's own controls and
//    get that bar under the picture.
//  - The Ego2Sim pane builds its own player (pipeline/showcase-*.js); it is left
//    in place and only tagged, so the stylesheet can draw it the same way: the
//    play button gets a state and an icon, the timeline paints its progress.
const root = document.querySelector('#playground');

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
  if (play) {
    const playing = /暂停|pause/i.test(play.textContent);
    if (play.dataset.state !== (playing ? 'playing' : 'paused')) play.dataset.state = playing ? 'playing' : 'paused';
  }
  if (scrub) paintPlaybackProgress(scrub);
}

if (root) {
  root.querySelectorAll('[data-ego-video], [data-validation-video]').forEach(mountBar);
  const sweep = () => root.querySelectorAll('.ps-playback').forEach(tagShowcase);
  let queued = 0;
  const schedule = () => { if (!queued) queued = requestAnimationFrame(() => { queued = 0; sweep(); }); };
  // The showcase rewrites its player text and values as it plays.
  new MutationObserver(schedule).observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['value', 'max'] });
  root.addEventListener('timeupdate', schedule, true);
  root.addEventListener('input', schedule, true);
  sweep();
}
