import { bindComparisonDrag } from './comparison-drag.js?v=website-audit-20261101';
import { mountReconstructionMethods } from './reconstruction-methods.js?v=methods-20261101';
const root = document.querySelector('[data-school-showcase]');

if (root) {
  const tabs = [...root.querySelectorAll('[data-school-mode]')];
  const panels = [...root.querySelectorAll('[data-school-panel]')];
  const stage = root.querySelector('.school-stage');
  const introVideo = root.querySelector('[data-school-intro-video]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let stageVisible = false;
  const methodPanel = root.closest('[data-reconstruction-panel]');
  let methodActive = !methodPanel?.hidden;
  const canPlay = () => methodActive && stageVisible && !document.hidden;
  function syncMethod() {
    if (!canPlay()) introVideo.pause();
    else if (activeMode() === 'evolution' && !reduceMotion.matches) playIntro();
  }
  methodPanel?.addEventListener('reconstruction-visibility', event => {
    methodActive = event.detail.active;
    syncMethod();
  });

  const imageSplit = root.querySelector('[data-school-image-split]');
  bindComparisonDrag(imageSplit);
  imageSplit.addEventListener('input', () => {
    const value = Number(imageSplit.value);
    imageSplit.closest('.school-image-comparison').style.setProperty('--school-split', `${value}%`);
    imageSplit.setAttribute('aria-valuetext', `实拍 ${value}%，重建 ${100 - value}%`);
  });

  const activeMode = () => tabs.find(tab => tab.getAttribute('aria-selected') === 'true')?.dataset.schoolMode;

  function playIntro() {
    if (!introVideo.paused || introVideo.ended) return;
    introVideo.play().catch(() => { /* Native controls remain available. */ });
  }

  function select(tab) {
    const mode = tab.dataset.schoolMode;
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => {
      panel.hidden = panel.dataset.schoolPanel !== mode;
      panel.querySelectorAll('video').forEach(video => video.pause());
    });
    if (mode === 'evolution' && canPlay() && !reduceMotion.matches) {
      playIntro();
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
      if (event.key === 'ArrowLeft') next = tabs[(index + tabs.length - 1) % tabs.length];
      if (event.key === 'Home') next = tabs[0];
      if (event.key === 'End') next = tabs.at(-1);
      if (next) {
        event.preventDefault();
        select(next);
        next.focus();
      }
    });
  });

  // The reconstruction film starts only when it can actually be seen.
  const stageObserver = new IntersectionObserver(entries => {
    stageVisible = entries.some(entry => entry.isIntersecting);
    syncMethod();
  }, { threshold: 0.45 });
  stageObserver.observe(stage);

  document.addEventListener('visibilitychange', syncMethod);

  reduceMotion.addEventListener('change', event => {
    if (event.matches) {
      introVideo.pause();
    }
  });
}

mountReconstructionMethods(document.querySelector('[data-reconstruction-methods]'));
