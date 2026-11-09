// Gallery cards play a few silent seconds of their task while a mouse rests on
// them, from a small preview clip (assets/previews); a click still opens the
// full video. Touch screens and reduced-motion visitors keep the still image.
const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
const still = window.matchMedia('(prefers-reduced-motion: reduce)');

for (const card of document.querySelectorAll('.gallery-image[data-preview]')) {
  let video = null;
  const stop = () => {
    card.classList.remove('is-previewing');
    video?.pause();
  };
  card.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse' || !hover.matches || still.matches) return;
    if (!video) {
      video = document.createElement('video');
      video.className = 'gallery-preview';
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.tabIndex = -1;
      video.setAttribute('aria-hidden', 'true');
      video.src = card.dataset.preview;
      video.addEventListener('playing', () => { if (card.matches(':hover')) card.classList.add('is-previewing'); });
      card.append(video);
    }
    video.currentTime = 0;
    video.play().catch(() => {});
  });
  card.addEventListener('pointerleave', stop);
  card.addEventListener('click', stop);
}

// Asset credits: the asterisk after a card title shows its note on hover or
// focus (CSS); a tap toggles it, and Escape or a tap elsewhere closes it.
const credits = [...document.querySelectorAll('[data-credit]')];
const closeCredit = credit => {
  credit.classList.remove('is-open');
  credit.querySelector('.credit-mark').setAttribute('aria-expanded', 'false');
};
for (const credit of credits) {
  const mark = credit.querySelector('.credit-mark');
  mark.addEventListener('click', event => {
    event.stopPropagation();
    const open = !credit.classList.contains('is-open');
    credits.forEach(closeCredit);
    credit.classList.toggle('is-open', open);
    mark.setAttribute('aria-expanded', String(open));
  });
}
document.addEventListener('click', event => {
  credits.forEach(credit => { if (!credit.contains(event.target)) closeCredit(credit); });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') credits.forEach(closeCredit);
});
