// Keep the real media nodes: promotion changes their positions, never their sources.
export function mountPhysicsCarousel(root) {
  if (!root) return null;
  const cards = [...root.querySelectorAll('.embodied-card')].map(node => ({
    node,
    button: node.querySelector('[data-inline-video]'),
    video: node.querySelector('[data-inline-video]').querySelector('video'),
    title: node.querySelector('h4'),
  }));
  if (cards.length < 2) return null;
  const page = root.ownerDocument;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();
  let active = 0;
  let wanted = !preference.matches;
  let suspended = false;
  let advancePending = false;
  let revision = 0;
  let pending = null;
  let motions = [];
  let motionRevision = 0;

  function settleMotion() {
    motionRevision++;
    motions.forEach(animation => animation.cancel());
    motions = [];
    cards.forEach(card => { card.node.style.zIndex = ''; });
  }
  function positions() {
    if (preference.matches || page.hidden || suspended || !cards[0].button.animate) return null;
    return cards.map(card => ({ film: card.button.getBoundingClientRect(), title: card.title.getBoundingClientRect() }));
  }
  function moveFrom(before) {
    if (!before) return;
    const token = ++motionRevision;
    const timing = { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' };
    cards.forEach((card, i) => {
      const film = card.button.getBoundingClientRect();
      const title = card.title.getBoundingClientRect();
      if (!film.width || !film.height || !before[i].film.width) return;
      card.node.style.zIndex = i === active ? '3' : '1';
      motions.push(card.button.animate([
        { transformOrigin: '0 0', transform: `translate(${before[i].film.left - film.left}px,${before[i].film.top - film.top}px) scale(${before[i].film.width / film.width},${before[i].film.height / film.height})` },
        { transformOrigin: '0 0', transform: 'translate(0px,0px) scale(1,1)' },
      ], timing));
      // Move text without scaling its glyphs along with the changing video size.
      motions.push(card.title.animate([
        { transform: `translate(${before[i].title.left - title.left}px,${before[i].title.top - title.top}px)` },
        { transform: 'translate(0px,0px)' },
      ], timing));
    });
    Promise.allSettled(motions.map(animation => animation.finished)).then(() => {
      if (token === motionRevision) settleMotion();
    });
  }

  const eligible = () => wanted && !suspended && !page.hidden && !root.closest('[hidden]') && visible.has(cards[active].button);
  function sync() {
    root.dataset.activeStudy = cards[active].title.id;
    if (cards[0].progress) scheduleProgress();
    cards.forEach((card, i) => {
      const playing = i === active && !card.video.paused;
      card.button.setAttribute('aria-current', String(i === active));
      card.button.setAttribute('aria-pressed', String(playing));
      card.button.setAttribute('aria-label', playing ? '暂停演示' : '播放演示');
      card.button.setAttribute('aria-describedby', card.title.id);
      // The centre play button shows only on the active film when it is paused
      // and will stay paused (not merely about to start after a swap).
      card.button.dataset.paused = String(i === active && card.video.paused && !(wanted && eligible()));
    });
  }
  function reset(video) {
    try { video.currentTime = 0; } catch { /* A metadata-less video starts at zero when loaded. */ }
  }
  function select(index, manual) {
    const focus = page.activeElement;
    // Capture the current rendered position before cancelling an interrupted move.
    const before = positions();
    settleMotion();
    revision++;
    pending = null;
    cards.forEach(card => card.video.pause());
    // Seeking alone leaves the decoded frame on screen. A fresh media selection
    // restores the native poster and resets the outgoing playhead without changing src.
    cards[active].video.load();
    active = index;
    advancePending = false;
    if (manual) wanted = true;
    reset(cards[active].video);
    [...cards.slice(active), ...cards.slice(0, active)].forEach(card => root.append(card.node));
    sync();
    // DOM moves can drop focus, notably in Safari. Keep the same selected control.
    if (root.contains(focus)) focus.focus({ preventScroll: true });
    if (manual) {
      // Stop a smooth scroll still in flight (keyboard focus on an off-screen thumbnail
      // starts one) so it cannot carry the promoted film back out of view.
      window.scrollTo?.({ top: window.scrollY, left: window.scrollX, behavior: 'instant' });
      cards[active].button.scrollIntoView({ block: 'nearest', behavior: preference.matches ? 'auto' : 'smooth' });
    }
    moveFrom(before);
    update();
  }
  function update() {
    const video = cards[active].video;
    cards.forEach(card => { if (card.video !== video) card.video.pause(); });
    if (!eligible()) {
      if (page.hidden || suspended) settleMotion();
      revision++;
      pending = null;
      video.pause();
      sync();
      return;
    }
    if (advancePending) {
      select((active + 1) % cards.length, false);
      return;
    }
    if (!video.paused || pending?.video === video) return;
    const token = ++revision;
    pending = { video, token };
    let playing;
    try { playing = video.play(); } catch { pending = null; sync(); return; }
    Promise.resolve(playing).then(() => {
      // A late play result may belong to a video that has already become a thumbnail.
      if (video !== cards[active].video || !eligible()) video.pause();
    }).catch(error => {
      // Autoplay refused by the browser: show the play button for an explicit start.
      if (error?.name === 'NotAllowedError') wanted = false;
    })
      .finally(() => { if (pending?.token === token) pending = null; sync(); });
  }
  cards.forEach((card, i) => {
    // The carousel owns movement; a scroll-entry transform would fight its path.
    card.node.style.animation = 'none';
    card.video.loop = false;
    card.video.removeAttribute('loop');
    card.button.addEventListener('click', () => {
      if (i !== active) {
        if (card.video.error) card.video.load();
        select(i, true);
      } else {
        wanted = card.video.paused;
        if (wanted && card.video.error) card.video.load();
        update();
      }
    });
    card.video.addEventListener('ended', () => {
      if (i !== active) return;
      advancePending = true;
      update();
    });
    card.video.addEventListener('play', () => {
      if (i !== active || !eligible()) card.video.pause();
      sync();
    });
    card.video.addEventListener('pause', sync);
    card.video.addEventListener('error', sync);
  });
  // A thin line along the bottom of the large film shows how far it has played;
  // when it reaches the end the next demo takes its place.
  let frame = 0;
  function paintProgress() {
    frame = 0;
    cards.forEach((card, i) => {
      const { duration, currentTime } = card.video;
      const share = i === active && duration > 0 ? Math.min(1, currentTime / duration) : 0;
      card.progress.style.transform = `scaleX(${share})`;
    });
    const video = cards[active].video;
    if (!video.paused && !video.ended) frame = requestAnimationFrame(paintProgress);
  }
  const scheduleProgress = () => { if (!frame) frame = requestAnimationFrame(paintProgress); };
  cards.forEach(card => {
    const track = page.createElement('span');
    track.className = 'film-progress';
    track.setAttribute('aria-hidden', 'true');
    card.progress = page.createElement('span');
    track.append(card.progress);
    card.button.append(track);
    ['play', 'seeked', 'loadedmetadata', 'emptied', 'ended'].forEach(type => card.video.addEventListener(type, scheduleProgress));
  });
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting && entry.intersectionRatio >= .35) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    update();
  }, { threshold: [0, .35] });
  cards.forEach(card => observer.observe(card.button));
  preference.addEventListener('change', () => {
    if (preference.matches) { wanted = false; settleMotion(); }
    update();
  });
  window.addEventListener('resize', settleMotion);
  page.addEventListener('visibilitychange', update);
  sync();
  return {
    setSuspended(value) {
      if (suspended === value) return;
      suspended = value;
      update();
    },
  };
}
