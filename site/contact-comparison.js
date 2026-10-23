// One camera and timeline, with a draggable reveal of the contact-force view.
export function mountContactComparison(root) {
  if (!root) return null;
  const get = (selector) => root.querySelector(selector);
  const stage = get('.compare-stage');
  const simulation = get('[data-compare-simulation]');
  const forces = get('[data-compare-forces]');
  const media = [simulation, forces];
  const sources = media.map((video) => video.src);
  const split = get('[data-compare-split]');
  const timeline = get('[data-compare-timeline]');
  const playButton = get('[data-compare-play]');
  const playLabel = get('[data-compare-play-label]');
  const restart = get('[data-compare-restart]');
  const clock = get('[data-compare-time]');
  const status = get('[data-compare-status]');
  let duration = Number(timeline.max);
  let ready = false;
  let failed = false;
  let desiredPlaying = false;
  let buffering = false;
  let starting = false;
  let intent = 0;
  let seekIntent = 0;
  let frame = 0;
  let loadPromise;
  let objectUrls = [];

  const formatTime = (seconds) => {
    const value = Math.max(0, Math.round(seconds));
    return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
  };
  function updateClock(time = simulation.currentTime) {
    timeline.value = String(time);
    timeline.setAttribute('aria-valuetext', `${formatTime(time)}，共 ${formatTime(duration)}`);
    clock.textContent = `${formatTime(time)} / ${formatTime(duration)}`;
  }
  function updateButton() {
    const label = failed ? '重新加载' : desiredPlaying ? '暂停播放' : simulation.ended ? '重新播放' : '播放对比';
    playLabel.textContent = label;
    playButton.setAttribute('aria-label', label);
    playButton.firstElementChild.textContent = desiredPlaying ? 'Ⅱ' : '▶';
  }
  function stopMedia() {
    media.forEach((video) => video.pause());
    cancelAnimationFrame(frame);
    frame = 0;
  }
  function pause() {
    desiredPlaying = false;
    buffering = false;
    intent += 1;
    stopMedia();
    if (ready && Math.abs(forces.currentTime - simulation.currentTime) > .005) {
      forces.currentTime = simulation.currentTime;
    }
    forces.playbackRate = 1;
    updateButton();
  }
  function showError() {
    pause();
    failed = true;
    ready = false;
    loadPromise = undefined;
    timeline.disabled = true;
    restart.disabled = true;
    status.textContent = '视频加载失败，请点击重新加载。';
    updateButton();
  }
  function once(video, eventName) {
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        video.removeEventListener(eventName, done);
        video.removeEventListener('error', error);
      };
      const done = () => { cleanup(); resolve(); };
      const error = () => { cleanup(); reject(new Error('Comparison media unavailable')); };
      video.addEventListener(eventName, done);
      video.addEventListener('error', error);
    });
  }
  function waitSeekable(video, time) {
    const available = () => time < .001 || [...Array(video.seekable.length)].some((_, index) =>
      video.seekable.start(index) <= time + .001 && video.seekable.end(index) >= time - .001);
    if (available()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const events = ['progress', 'loadeddata', 'canplay', 'canplaythrough', 'durationchange'];
      const cleanup = () => {
        events.forEach((name) => video.removeEventListener(name, check));
        video.removeEventListener('error', error);
      };
      const check = () => { if (available()) { cleanup(); resolve(); } };
      const error = () => { cleanup(); reject(new Error('Comparison seek unavailable')); };
      events.forEach((name) => video.addEventListener(name, check));
      video.addEventListener('error', error);
      check();
    });
  }
  async function seekPair(time) {
    const request = ++seekIntent;
    const target = Math.max(0, Math.min(duration, time));
    // Metadata can arrive before the first nonzero seekable range. Seeking then
    // silently clamps to zero in WebKit, even though a seeked event still fires.
    await Promise.all(media.map((video) => waitSeekable(video, target)));
    if (request !== seekIntent) return;
    await Promise.all(media.map((video) => {
      if (Math.abs(video.currentTime - target) < .001 && !video.seeking) return Promise.resolve();
      const settled = once(video, 'seeked');
      video.currentTime = target;
      return settled;
    }));
    if (request !== seekIntent) return;
    if (media.some((video) => Math.abs(video.currentTime - target) > .04)) {
      throw new Error('Comparison seek did not reach the requested frame');
    }
    updateClock(target);
    updateButton();
  }
  function prepare() {
    if (loadPromise) return loadPromise;
    failed = false;
    status.textContent = '正在加载对比画面…';
    loadPromise = (async () => {
      // The private host can serve MP4s without byte-range seeking. Loading the
      // unchanged files as local blobs gives both native players random access.
      const blobs = await Promise.all(sources.map(async (source) => {
        const response = await fetch(source, { credentials: 'same-origin' });
        if (!response.ok) throw new Error('Comparison download unavailable');
        return response.blob();
      }));
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      objectUrls = blobs.map((blob) => URL.createObjectURL(blob));
      const metadata = media.map((video) => once(video, 'loadedmetadata'));
      media.forEach((video, index) => {
        video.src = objectUrls[index];
        video.preload = 'auto';
        video.load();
      });
      await Promise.all(metadata);
      duration = Math.min(...media.map((video) => video.duration));
      timeline.max = String(duration);
      await seekPair(Number(root.dataset.start) || 0);
      ready = true;
      timeline.disabled = false;
      restart.disabled = false;
      status.textContent = '';
      updateButton();
    })();
    return loadPromise;
  }
  function tick() {
    if (!desiredPlaying || buffering) return;
    const drift = simulation.currentTime - forces.currentTime;
    if (!forces.seeking) {
      if (Math.abs(drift) > .08) forces.currentTime = simulation.currentTime;
      else forces.playbackRate = Math.max(.95, Math.min(1.05, 1 + drift * .5));
    }
    updateClock();
    frame = requestAnimationFrame(tick);
  }
  async function startPair(token) {
    if (starting || !desiredPlaying || token !== intent) return;
    starting = true;
    try {
      await seekPair(simulation.currentTime);
      if (!desiredPlaying || token !== intent) return;
      await Promise.all(media.map((video) => video.play()));
      if (!desiredPlaying || token !== intent) { stopMedia(); return; }
      buffering = false;
      status.textContent = '';
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    } catch {
      if (token === intent) {
        pause();
        status.textContent = '请点击播放继续对比。';
      }
    } finally {
      starting = false;
      // A rapid pause/play or restart can replace an in-flight play request.
      if (desiredPlaying && token !== intent) startPair(intent);
    }
  }
  async function play(fromStart = false) {
    desiredPlaying = true;
    const token = ++intent;
    updateButton();
    try {
      await prepare();
      if (!desiredPlaying || token !== intent) return;
      if (fromStart || simulation.ended || simulation.currentTime >= duration - .03) await seekPair(0);
      if (!desiredPlaying || token !== intent) return;
      await startPair(token);
    } catch { showError(); }
  }
  playButton.addEventListener('click', () => desiredPlaying ? pause() : play());
  restart.addEventListener('click', () => { pause(); play(true); });
  timeline.addEventListener('input', () => {
    const time = Number(timeline.value);
    pause();
    seekPair(time).catch(showError);
  });
  split.addEventListener('input', () => {
    const position = Number(split.value);
    stage.style.setProperty('--split', `${position}%`);
    split.setAttribute('aria-valuetext', `仿真画面 ${position}%，接触力热点 ${100 - position}%`);
    get('.compare-simulation-label').hidden = position < 15;
    get('.compare-forces-label').hidden = position > 85;
  });
  simulation.addEventListener('timeupdate', () => { if (ready && !simulation.seeking) updateClock(); });
  simulation.addEventListener('ended', () => { pause(); seekPair(duration).catch(showError); });
  media.forEach((video) => {
    video.addEventListener('error', showError);
    video.addEventListener('waiting', () => {
      if (!desiredPlaying || !ready || media.some((item) => item.seeking)) return;
      buffering = true;
      stopMedia();
      status.textContent = '正在缓冲对比画面…';
    });
    video.addEventListener('canplay', () => {
      if (buffering && desiredPlaying && media.every((item) => item.readyState >= 3)) startPair(intent);
    });
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  window.addEventListener('pagehide', pause);
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) prepare().catch(showError);
    else pause();
  }, { threshold: .15 });
  observer.observe(root);
  return { pause };
}
