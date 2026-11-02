// Decorative projections of existing robot, contact and lab data. Never captures input.
const motifs = {
  robot: new URL('./assets/robot-atmosphere.svg', import.meta.url),
  contact: new URL('./assets/contact-atmosphere.svg', import.meta.url),
  reconstruction: new URL('./assets/reconstruction-atmosphere.svg', import.meta.url),
};
const atmosphere = document.createElement('div');
atmosphere.className = 'page-atmosphere';
atmosphere.setAttribute('aria-hidden', 'true');
const movement = document.createElement('div');
movement.className = 'page-atmosphere-motion';
for (const [kind, url] of Object.entries(motifs)) {
  const image = document.createElement('img');
  image.alt = '';
  image.draggable = false;
  image.width = 1600;
  image.height = 1000;
  image.dataset.atmosphereKind = kind;
  image.src = url;
  movement.append(image);
}
atmosphere.append(movement);
document.body.prepend(atmosphere);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let frame = 0;
function render() {
  frame = 0;
  const range = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const anchors = [...document.querySelectorAll('#playground,#showcase,#scene-reconstruction,#gallery,.page-intro,.page-topics')];
  const nearest = anchors.map(node => ({ node, distance: Math.abs(node.getBoundingClientRect().top - innerHeight * .35) }))
    .sort((a, b) => a.distance - b.distance)[0];
  const distance = Math.min(nearest?.distance ?? innerHeight, innerHeight);
  const kind = nearest?.node.id === 'scene-reconstruction' || document.body.dataset.page === 'research'
    ? 'reconstruction' : nearest?.node.id === 'showcase' ? 'contact' : 'robot';
  for (const image of movement.children) image.classList.toggle('is-active', image.dataset.atmosphereKind === kind);
  atmosphere.dataset.activeMotif = kind;
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
