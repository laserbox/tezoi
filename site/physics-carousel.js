import { icon } from './icons.js?v=mobile-polish-20261023';

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
      // Controls return after the frame has almost settled, rather than scaling up.
      motions.push(card.button.querySelector('.material-inline-toggle').animate([
        { opacity: 0 }, { opacity: 1 },
      ], { duration: 160, delay: 360, easing: 'ease-out', fill: 'both' }));
    });
    Promise.allSettled(motions.map(animation => animation.finished)).then(() => {
      if (token === motionRevision) settleMotion();
    });
  }

  const eligible = () => wanted && !suspended && !page.hidden && !root.closest('[hidden]') && visible.has(cards[active].button);
  function sync() {
    root.dataset.activeStudy = cards[active].title.id;
    cards.forEach((card, i) => {
      const playing = i === active && !card.video.paused;
      card.button.setAttribute('aria-current', String(i === active));
      card.button.setAttribute('aria-pressed', String(playing));
      card.button.setAttribute('aria-label', playing ? '暂停演示' : '播放演示');
      card.button.setAttribute('aria-describedby', card.title.id);
      card.button.querySelector('.material-inline-toggle').innerHTML = icon(playing ? 'pause' : 'play');
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
    }).catch(() => { /* Keep the existing inline button available for an explicit retry. */ })
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
