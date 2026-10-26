// Keep the comparison and its real 3D viewer in one stage.
export function mountSimulationExplorer(root, {
  loadViewer = element => import('./simulation-viewer.js?v=usedv6-3d-20261026').then(module => module.mountSceneViewer(element)),
  onPause = () => {},
  comparisonLabel = '视频对比',
} = {}) {
  if (!root) return null;
  const tabs = [...root.querySelectorAll('[data-simulation-view]')];
  const panels = [...root.querySelectorAll('[data-simulation-panel]')];
  const viewerRoot = root.querySelector('[data-scene-viewer]');
  const status = viewerRoot.querySelector('[data-scene-status]');
  const retry = viewerRoot.querySelector('[data-scene-retry]');
  let selected = 'video';
  let stageActive = true;
  let inView = true;
  let viewer;
  let pending;

  function pause() {
    onPause();
    root.querySelectorAll('video').forEach(video => video.pause());
    viewer?.pause();
  }
  function syncVisibility() {
    const visible = selected === 'scene' && stageActive && inView && !document.hidden;
    if (!visible) viewer?.pause();
    viewer?.setVisible(visible);
  }
  async function ensureViewer() {
    if (viewer) return;
    if (pending) return pending;
    status.textContent = '正在加载三维场景…';
    status.hidden = false;
    retry.hidden = true;
    pending = (async () => {
      try {
        viewer = await loadViewer(viewerRoot);
        status.hidden = true;
        syncVisibility();
      } catch {
        status.textContent = `三维场景暂时无法加载，可重试或查看${comparisonLabel}。`;
        retry.hidden = false;
      } finally {
        pending = null;
      }
    })();
    return pending;
  }
  function select(view, focus = false) {
    if (!tabs.some(tab => tab.dataset.simulationView === view)) return;
    if (selected !== view) pause();
    selected = view;
    root.dataset.simulationMode = view;
    tabs.forEach(tab => {
      const active = tab.dataset.simulationView === view;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    panels.forEach(panel => { panel.hidden = panel.dataset.simulationPanel !== view; });
    syncVisibility();
    if (view === 'scene') void ensureViewer();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab.dataset.simulationView));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = tabs[(index + 1) % tabs.length];
      if (event.key === 'Home') next = tabs[0];
      if (event.key === 'End') next = tabs.at(-1);
      if (next) { event.preventDefault(); select(next.dataset.simulationView, true); }
    });
  });
  retry.addEventListener('click', () => void ensureViewer());
  document.addEventListener('visibilitychange', syncVisibility);
  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncVisibility();
    }, { threshold: 0 });
    observer.observe(root.querySelector('[data-scene-viewport]'));
  }
  select('video');
  return { pause, setActive(active) { stageActive = active; syncVisibility(); }, selectView: select };
}
