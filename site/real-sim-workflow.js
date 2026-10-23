// Presentation stages, not a robot execution or policy-generation service.
export function mountRealSimWorkflow(root, { onStageChange = () => {} } = {}) {
  if (!root) return null;
  const tabs = [...root.querySelectorAll('[data-workflow-stage]')];
  const panels = [...root.querySelectorAll('[data-workflow-panel]')];
  const tablist = root.querySelector('[data-workflow-tabs]');
  const previous = root.querySelector('[data-workflow-prev]');
  const next = root.querySelector('[data-workflow-next]');
  const position = root.querySelector('[data-workflow-position]');
  const compact = window.matchMedia('(max-width: 800px)');
  const labels = {
    source: 'Ego · 真实第一视角视频',
    agent: 'Agent · Ego 转仿真',
    simulation: 'Simulation · 仿真交互',
    validation: 'Robotics · 真机',
  };
  let active = Math.max(0, tabs.findIndex(tab => tab.dataset.workflowStage === (root.dataset.activeStage || 'simulation')));

  function select(index, focus = false) {
    if (index < 0 || index >= tabs.length) return;
    const from = tabs[active].dataset.workflowStage;
    const to = tabs[index].dataset.workflowStage;
    if (active !== index) {
      root.querySelectorAll('video').forEach(video => video.pause());
      onStageChange({ from, to });
    }
    active = index;
    root.dataset.activeStage = to;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === active));
      tab.tabIndex = i === active ? 0 : -1;
    });
    panels.forEach(panel => { panel.hidden = panel.dataset.workflowPanel !== to; });
    previous.disabled = active === 0;
    position.textContent = `${active + 1} / ${tabs.length}`;
    next.textContent = active === tabs.length - 1 ? '回到 Ego ↺' : '下一阶段 →';
    next.setAttribute('aria-label', active === tabs.length - 1
      ? '回到 Ego · 真实第一视角视频'
      : `进入 ${labels[tabs[active + 1].dataset.workflowStage]}`);
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
  previous.addEventListener('click', () => select(active - 1));
  next.addEventListener('click', () => select((active + 1) % tabs.length));
  const orient = () => tablist.setAttribute('aria-orientation', compact.matches ? 'horizontal' : 'vertical');
  compact.addEventListener('change', orient);
  orient();
  select(active);

  return {
    selectStage(stage) { select(tabs.findIndex(tab => tab.dataset.workflowStage === stage)); },
    get activeStage() { return tabs[active].dataset.workflowStage; },
  };
}
