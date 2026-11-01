export function mountReconstructionMethods(root, options = {}) {
  if (!root) return null;
  const location = options.location ?? window.location;
  const navigation = options.navigation ?? window;
  const tabs = [...root.querySelectorAll('[data-reconstruction-method]')];
  const panels = [...root.querySelectorAll('[data-reconstruction-panel]')];
  function select(method, focus = false) {
    if (!tabs.some(tab => tab.dataset.reconstructionMethod === method)) return;
    tabs.forEach(tab => {
      const active = tab.dataset.reconstructionMethod === method;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    panels.forEach(panel => {
      const active = panel.dataset.reconstructionPanel === method;
      panel.hidden = !active;
      panel.dispatchEvent(new CustomEvent('reconstruction-visibility', { detail: { active } }));
    });
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab.dataset.reconstructionMethod));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (event.key === 'ArrowLeft') next = tabs[(i + tabs.length - 1) % tabs.length];
      if (event.key === 'Home') next = tabs[0];
      if (event.key === 'End') next = tabs.at(-1);
      if (next) { event.preventDefault(); select(next.dataset.reconstructionMethod, true); }
    });
  });
  function syncHash() {
    if (location.hash === '#visual-rendering' || location.hash.startsWith('#usedv6-')) select('mesh');
    else if (location.hash === '#scene-reconstruction') select('gaussian');
  }
  select('gaussian');
  syncHash();
  navigation.addEventListener('hashchange', syncHash);
  return { select };
}
