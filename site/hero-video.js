// Decorative hero media stays still when hidden, paused, or reduced motion is requested.
export function mountHeroVideo(root, { doc = globalThis.document, win = globalThis.window } = {}) {
  if (!root) return null;
  const video = root.querySelector('[data-hero-video]');
  const toggle = root.querySelector('[data-hero-toggle]');
  const motion = win.matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = motion.matches;
  let visible = !win.IntersectionObserver;
  let active = true;
  let failed = false;
  let pending = false;
  let generation = 0;
  video.muted = true;

  const shouldPlay = () => visible && active && !doc.hidden && !userPaused && !failed;
  function label() {
    toggle.hidden = failed;
    toggle.setAttribute('aria-label', userPaused ? '播放背景视频' : '暂停背景视频');
    toggle.setAttribute('aria-pressed', String(!userPaused));
  }
  function sync() {
    label();
    if (!shouldPlay()) { generation++; pending = false; video.pause(); return; }
    if (!video.paused || pending) return;
    pending = true;
    const attempt = ++generation;
    video.play().catch(() => {
      if (attempt === generation && shouldPlay()) { userPaused = true; label(); }
    }).finally(() => { if (attempt === generation) pending = false; });
  }
  video.addEventListener('playing', () => {
    if (shouldPlay()) video.hidden = false;
    else video.pause();
  });
  video.addEventListener('error', () => {
    failed = true;
    video.hidden = true;
    sync();
  });
  toggle.addEventListener('click', () => { userPaused = !userPaused; sync(); });
  motion.addEventListener('change', () => {
    if (motion.matches) userPaused = true;
    sync();
  });
  doc.addEventListener('visibilitychange', sync);
  if (win.IntersectionObserver) {
    const observer = new win.IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.1 });
    observer.observe(root.querySelector('.overview-video'));
  }
  sync();
  return { setActive(value) { active = value; sync(); } };
}
