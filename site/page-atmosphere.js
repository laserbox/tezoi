// Decorative projection of the public usedv6 laboratory. Never captures input.
const imageURL = new URL('./assets/usedv6-atmosphere.svg', import.meta.url);
const atmosphere = document.createElement('div');
atmosphere.className = 'page-atmosphere';
atmosphere.setAttribute('aria-hidden', 'true');
atmosphere.innerHTML = '<div class="page-atmosphere-motion"><img alt="" draggable="false" width="1600" height="900"></div>';
atmosphere.querySelector('img').src = imageURL;
document.body.prepend(atmosphere);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let frame = 0;
function render() {
  frame = 0;
  const range = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const anchors = [...document.querySelectorAll('#playground,#showcase,#scene-reconstruction,#gallery,.page-intro,.page-topics')];
  const distance = Math.min(...anchors.map(node => Math.abs(node.getBoundingClientRect().top - innerHeight * .35)), innerHeight);
  const strength = Math.max(0, 1 - distance / (innerHeight * .8));
  const heroVisible = (document.querySelector('#overview')?.getBoundingClientRect().bottom ?? 0) > innerHeight * .75;
  atmosphere.style.setProperty('--atmosphere-opacity', String(heroVisible ? 0 : reduced.matches ? .07 : strength * .14));
  atmosphere.style.setProperty('--atmosphere-offset', `${reduced.matches ? 0 : -Math.min(1, scrollY / range) * 80}px`);
}
function schedule() { if (!frame && !document.hidden) frame = requestAnimationFrame(render); }
function visibility() {
  document.documentElement.toggleAttribute('data-page-hidden', document.hidden);
  if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
  else schedule();
}
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule, { passive: true });
reduced.addEventListener('change', schedule);
document.addEventListener('visibilitychange', visibility);
visibility();

addEventListener('pagehide', () => {
  document.documentElement.setAttribute('data-page-hidden', '');
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
});
addEventListener('pageshow', visibility);
