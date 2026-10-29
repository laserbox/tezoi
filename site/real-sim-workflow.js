// Presentation stages, not a robot execution or policy-generation service.
export function mountRealSimWorkflow(root, { onStageChange = () => {} } = {}) {
  if (!root) return null;
  const tabs = [...root.querySelectorAll('[data-workflow-stage]')];
  const panels = [...root.querySelectorAll('[data-workflow-panel]')];
  const tablist = root.querySelector('[data-workflow-tabs]');
  const egoVideo = root.querySelector('[data-ego-video]');
  const pause = () => root.querySelectorAll('video').forEach(video => video.pause());
  const compact = window.matchMedia('(max-width: 800px)');
  let active = Math.max(0, tabs.findIndex(tab => tab.dataset.workflowStage === (root.dataset.activeStage || 'simulation')));

  function select(index, focus = false) {
    if (index < 0 || index >= tabs.length) return;
    const from = tabs[active].dataset.workflowStage;
    const to = tabs[index].dataset.workflowStage;
    if (active !== index) {
      pause();
      onStageChange({ from, to });
    }
    active = index;
    root.dataset.activeStage = to;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === active));
      tab.tabIndex = i === active ? 0 : -1;
    });
    panels.forEach(panel => { panel.hidden = panel.dataset.workflowPanel !== to; });
    if (focus) tabs[active].focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index, true));
    tab.addEventListener('keydown', (event) => {
      let target;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') target = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target !== undefined) {
        event.preventDefault();
        select(target, true);
      }
    });
  });
  const orient = () => tablist.setAttribute('aria-orientation', compact.matches ? 'horizontal' : 'vertical');
  compact.addEventListener('change', orient);
  orient();
  select(active);

  // Native Ego controls share the same suspension rules as the custom players.
  if (egoVideo) {
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) egoVideo.pause();
    }, { threshold: .05 }).observe(egoVideo);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  window.addEventListener('pagehide', pause);

  return {
    pause,
    selectStage(stage) { select(tabs.findIndex(tab => tab.dataset.workflowStage === stage)); },
    get activeStage() { return tabs[active].dataset.workflowStage; },
  };
}
