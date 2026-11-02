// One viewing surface for the homepage film and all Gallery videos.
export function mountVideoDialog(dialog, { onOpen = () => {}, onClose = () => {}, win = globalThis.window } = {}) {
  const player = dialog.querySelector('#demo-player');
  const title = dialog.querySelector('#video-title');
  const loading = dialog.querySelector('[data-video-loading]');
  const error = dialog.querySelector('[data-video-error]');
  const retry = dialog.querySelector('[data-video-retry]');
  let trigger, closing, generation = 0;

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
      // Autoplay may be blocked: keep native controls available for a user gesture.
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
    player.pause(); player.removeAttribute('src'); player.removeAttribute('poster'); player.load();
    state('idle'); dialog.style.removeProperty('--video-ratio');
    onClose(); trigger?.focus(); trigger = null;
  });
  state('idle');
  return {
    open(video, source) {
      if (!video) return;
      generation++; trigger = source;
      closing?.cancel(); closing = null;
      title.textContent = video.title;
      player.poster = source?.querySelector('img')?.getAttribute('src') || video.poster || '';
      player.muted = Boolean(video.muted);
      player.src = video.src;
      state('loading'); dialog.showModal(); onOpen(); play();
    },
  };
}
