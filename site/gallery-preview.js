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
