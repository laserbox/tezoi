// Section titles collapse into the header. Once a section's title scrolls up
// under the header, its name appears beside the logo, so readers always know
// which part of the page they are in without a separate tier of chapter words.
// Decorative duplicate of real headings: aria-hidden, never captures input.
const header = document.querySelector('.site-header');
const brand = header?.querySelector('.brand');
const nav = header?.querySelector('nav');
const titles = [...document.querySelectorAll('#playground-title, #showcase .subchapter-heading h3, #gallery-title')];

if (header && brand && titles.length) {
  const indicator = document.createElement('span');
  indicator.className = 'section-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  label.className = 'section-indicator-label';
  indicator.append(label);
  header.append(indicator);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let current = null;
  let frame = 0;
  let lastY = scrollY;
  let room = Infinity;

  function place() {
    const box = header.getBoundingClientRect();
    const left = brand.getBoundingClientRect().right - box.left + 22;
    const navLeft = nav && getComputedStyle(nav).display !== 'none' ? nav.getBoundingClientRect().left - box.left : box.width;
    room = navLeft - left - 24;
    indicator.style.setProperty('--indicator-left', `${Math.round(left)}px`);
    indicator.style.setProperty('--indicator-room', `${Math.max(0, Math.round(room))}px`);
  }

  function render() {
    frame = 0;
    const edge = header.getBoundingClientRect().bottom + 12;
    let next = null;
    for (const title of titles) {
      if (title.getClientRects().length && title.getBoundingClientRect().top < edge) next = title;
    }
    const text = next?.textContent.trim() ?? '';
    const fits = room >= 120;
    if (next !== current || label.textContent !== text) {
      if (text && label.textContent && next !== current && !reduced.matches) {
        const offset = scrollY >= lastY ? 6 : -6;
        label.animate([{ opacity: 0, transform: `translateY(${offset}px)` }, { opacity: 1, transform: 'none' }], { duration: 200, easing: 'ease-out' });
      }
      label.textContent = text;
      current = next;
    }
    indicator.classList.toggle('is-visible', Boolean(text) && fits);
    lastY = scrollY;
  }

  function schedule() { if (!frame) frame = requestAnimationFrame(render); }
  function relayout() { place(); schedule(); }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', relayout, { passive: true });
  // The language switch rewrites heading text in place.
  const watcher = new MutationObserver(schedule);
  for (const title of titles) watcher.observe(title, { childList: true, characterData: true, subtree: true });
  new ResizeObserver(relayout).observe(header);
  relayout();
}
