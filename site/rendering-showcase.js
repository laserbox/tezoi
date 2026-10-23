// Native video presentation of three original, locally rendered scenes.
const PHASE_TIMES = [0.55, 4.0, 6.5];
const phaseAt = (time) => time < 1.2 ? 0 : time < 4.3 ? 1 : 2;

function waitUntilReady(video, signal) {
  return new Promise((resolve, reject) => {
    const events = ['loadeddata', 'canplay', 'progress', 'durationchange'];
    const clean = () => {
      events.forEach((event) => video.removeEventListener(event, check));
      video.removeEventListener('error', failed);
      signal.removeEventListener('abort', aborted);
    };
    const check = () => {
      if (video.readyState >= 2 && video.seekable.length && video.seekable.end(video.seekable.length - 1) > 0) {
        clean(); resolve();
      }
    };
    const failed = () => { clean(); reject(new Error('Media could not be loaded')); };
    const aborted = () => { clean(); reject(new DOMException('Aborted', 'AbortError')); };
    events.forEach((event) => video.addEventListener(event, check));
    video.addEventListener('error', failed);
    signal.addEventListener('abort', aborted, { once: true });
    if (signal.aborted) aborted(); else check();
  });
}

export function mountRenderingShowcase(root) {
  if (!root) return;
  const video = root.querySelector('video');
  const tabs = [...root.querySelectorAll('[data-render-scene]')];
  const phases = [...root.querySelectorAll('[data-render-phase]')];
  const play = root.querySelector('[data-render-play]');
  const replay = root.querySelector('[data-render-replay]');
  const panel = root.querySelector('[role="tabpanel"]');
  const status = root.querySelector('[data-render-status]');
  const title = root.querySelector('[data-render-title]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const dialog = document.querySelector('#video-dialog');
  const urls = new Map();
  let current = tabs[0];
  let controller;
  let generation = 0;
  let visible = false;
  let ready = false;
  let failed = false;
  let wantPlayback = !reduced.matches;
  let pendingTime = reduced.matches ? PHASE_TIMES[2] : 0;
  let hasPlayed = false;

  const allowed = () => visible && !document.hidden && !dialog?.open;
  const updatePlay = () => {
    play.setAttribute('aria-label', failed ? '重新加载演示' : wantPlayback ? '暂停演示' : '播放演示');
    play.innerHTML = `<span aria-hidden="true">${failed ? '↻' : wantPlayback ? 'Ⅱ' : '▶'}</span>`;
    play.setAttribute('aria-pressed', String(wantPlayback));
  };
  const showPhase = (index) => phases.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  const updateTime = () => {
    if (!ready || video.seeking) return;
    showPhase(phaseAt(video.currentTime));
    const progress = Math.min(100, video.currentTime / video.duration * 100);
    current.style.setProperty('--film-progress', `${progress}%`);
  };
  const syncPlayback = async () => {
    if (!ready || !wantPlayback || !allowed()) { video.pause(); return; }
    const intentGeneration = generation;
    try {
      await video.play();
      // A late play promise must not revive a hidden or superseded clip.
      if (intentGeneration !== generation) return;
      if (!wantPlayback || !allowed()) video.pause();
      else hasPlayed = true;
    } catch {
      if (intentGeneration === generation && allowed()) { wantPlayback = false; updatePlay(); }
    }
  };

  async function selectScene(button, initialTime = reduced.matches && !wantPlayback ? PHASE_TIMES[2] : 0) {
    const intentGeneration = ++generation;
    controller?.abort();controller = new AbortController();
    const signal = controller.signal;
    video.pause();ready = false;failed = false;
    current = button;pendingTime = initialTime;
    video.removeAttribute('src');video.load();
    tabs.forEach((tab) => {
      tab.setAttribute('aria-selected', String(tab === button));
      tab.tabIndex = tab === button ? 0 : -1;
      tab.style.setProperty('--film-progress', '0%');
    });
    panel.setAttribute('aria-labelledby', button.id);
    title.textContent = button.dataset.renderTitle;
    video.poster = button.dataset.renderPoster;
    status.textContent = '';
    showPhase(phaseAt(pendingTime));updatePlay();
    try {
      const src = button.dataset.renderSrc;
      if (!urls.has(src)) {
        const response = await fetch(src, { signal });
        if (!response.ok) throw new Error(`Media HTTP ${response.status}`);
        const blob = await response.blob();
        if (signal.aborted) return;
        urls.set(src, URL.createObjectURL(blob));
      }
      if (intentGeneration !== generation) return;
      video.preload = 'auto';video.src = urls.get(src);video.load();
      await waitUntilReady(video, signal);
      if (intentGeneration !== generation) return;
      ready = true;
      video.currentTime = pendingTime;
      await syncPlayback();
    } catch (error) {
      if (error.name === 'AbortError' || intentGeneration !== generation) return;
      const badUrl = urls.get(current.dataset.renderSrc);
      if (badUrl) { URL.revokeObjectURL(badUrl);urls.delete(current.dataset.renderSrc); }
      failed = true;wantPlayback = false;
      status.textContent = '演示载入失败，请点击重新加载。';
      updatePlay();
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectScene(tab));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
      if (event.key === 'ArrowLeft') next = tabs[(index + tabs.length - 1) % tabs.length];
      if (event.key === 'Home') next = tabs[0];
      if (event.key === 'End') next = tabs.at(-1);
      if (next) { event.preventDefault();selectScene(next);next.focus(); }
    });
  });
  phases.forEach((button, index) => button.addEventListener('click', () => {
    wantPlayback = false;hasPlayed = true;pendingTime = PHASE_TIMES[index];
    video.pause();showPhase(index);updatePlay();
    if (ready) video.currentTime = pendingTime;
    else if (!controller) selectScene(current, pendingTime);
  }));
  play.addEventListener('click', async () => {
    if (failed) { wantPlayback = true;selectScene(current);return; }
    wantPlayback = !wantPlayback;
    if (wantPlayback && (!hasPlayed || video.ended)) {
      pendingTime = 0;if (ready) video.currentTime = 0;
    }
    updatePlay();
    if (!controller) selectScene(current);else syncPlayback();
  });
  replay.addEventListener('click', () => {
    pendingTime = 0;wantPlayback = true;
    if (ready) video.currentTime = 0;
    updatePlay();
    if (!controller) selectScene(current);else syncPlayback();
  });
  video.addEventListener('timeupdate', updateTime);
  video.addEventListener('seeked', updateTime);
  video.addEventListener('ended', () => {
    if (wantPlayback && allowed()) selectScene(tabs[(tabs.indexOf(current) + 1) % tabs.length]);
  });
  const observer = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (visible && !controller) selectScene(current);else syncPlayback();
  }, { threshold: .15 });
  observer.observe(root.querySelector('.rendering-stage'));
  document.addEventListener('visibilitychange', syncPlayback);
  if (dialog) new MutationObserver(syncPlayback).observe(dialog, { attributes: true, attributeFilter: ['open'] });
  reduced.addEventListener('change', () => {
    if (reduced.matches) { wantPlayback = false;updatePlay();syncPlayback(); }
  });
  window.addEventListener('pagehide', (event) => {
    video.pause();
    if (!event.persisted) { controller?.abort();urls.forEach((url) => URL.revokeObjectURL(url)); }
  });
  window.addEventListener('pageshow', syncPlayback);
  updatePlay();
}
