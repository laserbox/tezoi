// Presentation stages, not a robot execution or policy-generation service.
export function mountRealSimWorkflow(root, { onStageChange = () => {} } = {}) {
  if (!root) return null;
  const tabs = [...root.querySelectorAll('[data-workflow-stage]')];
  const panels = [...root.querySelectorAll('[data-workflow-panel]')];
  const tablist = root.querySelector('[data-workflow-tabs]');
  const nativeVideos = [...root.querySelectorAll('[data-ego-video], [data-validation-video]')];
  const pause = () => root.querySelectorAll('video').forEach(video => video.pause());
  const compact = window.matchMedia('(max-width: 850px)');
  const requestedStage = new URLSearchParams(location.search).get('workflow');
  const initialStage = tabs.some(tab => tab.dataset.workflowStage === requestedStage)
    ? requestedStage : (root.dataset.activeStage || 'simulation');
  let active = Math.max(0, tabs.findIndex(tab => tab.dataset.workflowStage === initialStage));

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

  // Native source and real-robot clips pause when their panel leaves the viewport.
  const videoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (!entry.isIntersecting) entry.target.pause(); });
  }, { threshold: .05 });
  nativeVideos.forEach(video => videoObserver.observe(video));
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  window.addEventListener('pagehide', pause);

  return {
    pause,
    selectStage(stage) { select(tabs.findIndex(tab => tab.dataset.workflowStage === stage)); },
    get activeStage() { return tabs[active].dataset.workflowStage; },
  };
}
