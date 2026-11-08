import { icon } from './icons.js?v=float-player-20261108';
import { paintPlaybackProgress } from './playback-progress.js?v=module-detail-20261102';

// One viewing surface for the homepage film, the Gallery and the Pipeline
// players. The picture floats over the dimmed page with no title bar; its
// controls float inside the picture and, with the close button, show while the
// pointer moves and fade after a moment of stillness during playback.
const IDLE_MS = 2200;

const clock = seconds => {
  const s = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

export function mountVideoDialog(dialog, { onOpen = () => {}, onClose = () => {}, win = globalThis.window } = {}) {
  const player = dialog.querySelector('#demo-player');
  const title = dialog.querySelector('#video-title');
  const loading = dialog.querySelector('[data-video-loading]');
  const error = dialog.querySelector('[data-video-error]');
  const retry = dialog.querySelector('[data-video-retry]');
  const stage = dialog.querySelector('.video-stage');
  let trigger, closing, generation = 0;
  // A page element shown in the dialog instead of the player (the simulation
  // comparison); it goes back to its place when the dialog closes.
  let moved = null;
  function restore() {
    if (!moved) return;
    moved.home.replaceWith(moved.node);
    moved = null;
    player.hidden = false;
    dialog.classList.remove('is-node');
  }

  // Floating controls: play, timeline, time, sound.
  player.controls = false;
  player.removeAttribute('controls');
  const bar = document.createElement('div');
  bar.className = 'playback-bar dialog-controls';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', '视频播放控制');
  bar.innerHTML = `<button class="compare-play" type="button" aria-label="播放">${icon('play')}</button>`
    + '<input class="compare-timeline" type="range" min="0" max="0" step="0.033333" value="0" aria-label="播放进度" disabled>'
    + '<output class="compare-time" aria-live="off">00:00 / 00:00</output>'
    + `<button class="dialog-sound" type="button" aria-label="静音">${icon('volume')}</button>`;
  player.after(bar);
  const [playButton, timeline, time, sound] = bar.children;
  function render() {
    const duration = Number.isFinite(player.duration) ? player.duration : 0;
    timeline.disabled = !(duration > 0);
    timeline.max = String(duration);
    if (document.activeElement !== timeline) timeline.value = String(player.currentTime || 0);
    paintPlaybackProgress(timeline);
    time.textContent = `${clock(player.currentTime)} / ${clock(duration)}`;
    const playing = !player.paused && !player.ended;
    playButton.innerHTML = icon(playing ? 'pause' : 'play');
    playButton.setAttribute('aria-label', playing ? '暂停' : '播放');
    sound.innerHTML = icon(player.muted ? 'muted' : 'volume');
    sound.setAttribute('aria-label', player.muted ? '取消静音' : '静音');
  }
  const toggle = () => { if (player.paused || player.ended) play(); else player.pause(); };
  playButton.addEventListener('click', toggle);
  sound.addEventListener('click', () => { player.muted = !player.muted; render(); });
  timeline.addEventListener('input', () => { player.currentTime = Number(timeline.value); paintPlaybackProgress(timeline); });
  ['loadedmetadata', 'durationchange', 'timeupdate', 'play', 'pause', 'ended', 'seeked', 'volumechange', 'emptied'].forEach(type => player.addEventListener(type, render));

  // Show the controls on any movement; hide them again after a still moment while playing.
  let idleTimer = 0;
  let revealTap = false;
  const playingNow = () => (moved ? [...moved.node.querySelectorAll('video')].some(video => !video.paused) : !player.paused && !player.ended);
  function wake() {
    dialog.classList.remove('is-idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (dialog.open && playingNow() && !dialog.querySelector(':focus-visible')) dialog.classList.add('is-idle');
    }, IDLE_MS);
  }
  function sleepNever() { clearTimeout(idleTimer); dialog.classList.remove('is-idle'); }
  dialog.addEventListener('pointerdown', event => {
    // A tap on a touch screen first brings the controls back without acting.
    if (dialog.classList.contains('is-idle') && event.pointerType !== 'mouse') revealTap = true;
    wake();
  }, true);
  for (const type of ['pointermove', 'keydown', 'focusin']) dialog.addEventListener(type, wake, true);
  player.addEventListener('play', wake);
  player.addEventListener('pause', sleepNever);
  dialog.addEventListener('play', wake, true);
  dialog.addEventListener('pause', () => { if (!playingNow()) sleepNever(); }, true);
  player.addEventListener('click', () => {
    if (revealTap) { revealTap = false; return; }
    toggle();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== ' ' || moved || event.target.closest('button, input')) return;
    event.preventDefault();
    toggle();
  });

  function close() {
    if (!dialog.open || closing) return;
    player.pause();
    if (!dialog.animate || win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      dialog.close(); return;
    }
    const attempt = generation;
    closing = dialog.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(6px) scale(.99)' }], { duration: 160, easing: 'ease-in', fill: 'forwards' });
    closing.finished.then(() => { if (attempt === generation && dialog.open) dialog.close(); }).catch(() => {});
  }

  function state(value) {
    dialog.dataset.videoState = value;
    loading.hidden = value !== 'loading';
    error.hidden = value !== 'error';
    retry.hidden = value !== 'error';
  }
  function play() {
    const attempt = generation;
    player.play().then(() => {
      if (!dialog.open || closing) player.pause();
    }).catch(() => {
      // Autoplay may be blocked: the floating play button stays for a user gesture.
      if (attempt === generation && dialog.open && player.error) state('error');
    });
  }
  for (const event of ['loadstart', 'waiting']) player.addEventListener(event, () => {
    if (dialog.open && dialog.dataset.videoState !== 'error') state('loading');
  });
  for (const event of ['loadeddata', 'canplay', 'playing']) player.addEventListener(event, () => {
    if (dialog.open) state('ready');
  });
  player.addEventListener('loadedmetadata', () => {
    if (dialog.open && player.videoWidth && player.videoHeight) {
      dialog.style.setProperty('--video-ratio', String(player.videoWidth / player.videoHeight));
    }
  });
  player.addEventListener('error', () => { if (dialog.open) state('error'); });
  retry.addEventListener('click', () => {
    if (!dialog.open) return;
    state('loading'); player.load(); play();
  });
  dialog.querySelector('#close-video').addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
  });
  dialog.addEventListener('close', () => {
    generation++;
    closing?.cancel(); closing = null;
    sleepNever(); revealTap = false;
    player.pause(); player.removeAttribute('src'); player.removeAttribute('poster'); player.load();
    state('idle'); dialog.style.removeProperty('--video-ratio');
    restore();
    onClose(); trigger?.focus(); trigger = null;
  });
  state('idle');
  render();
  return {
    open(video, source) {
      if (!video) return;
      generation++; trigger = source;
      closing?.cancel(); closing = null;
      title.textContent = video.title;
      if (video.node) {
        restore();
        const home = document.createComment('');
        video.node.before(home);
        moved = { node: video.node, home };
        player.hidden = true;
        dialog.classList.add('is-node');
        stage.prepend(video.node);
        state('ready'); dialog.showModal(); onOpen(); video.onShow?.(); wake();
        return;
      }
      player.poster = source?.querySelector('img')?.getAttribute('src') || video.poster || '';
      player.muted = Boolean(video.muted);
      player.src = video.src;
      state('loading'); dialog.showModal(); onOpen(); play(); wake();
    },
  };
}
