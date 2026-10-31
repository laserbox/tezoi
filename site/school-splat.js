const root = document.querySelector('[data-school-showcase]');

if (root) {
  const tabs = [...root.querySelectorAll('[data-school-mode]')];
  const panels = [...root.querySelectorAll('[data-school-panel]')];
  const stage = root.querySelector('.school-stage');
  const caption = root.querySelector('[data-school-caption]');
  const introVideo = root.querySelector('[data-school-intro-video]');
  const tourVideo = root.querySelector('[data-school-tour-video]');
  const introCta = root.querySelector('[data-school-intro-cta]');
  const enterInteractive = root.querySelector('[data-school-enter-interactive]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const captions = {
    evolution: '8 秒导览：蓝色点云沿空间逐步生长为完整 3DGS 场景，收束到适合继续探索的视角。',
    trajectory: '26 秒连续轨迹：沿原始相机路径自动漫游，观察重建空间在运动中的稳定性。',
    interactive: '左键环绕 · 中键 / Shift+左键平移 · 滚轮缩放 · 按住右键 + WASD/QE 移动 · Shift 加速。',
  };
  let viewer;
  let stageVisible = false;

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
    caption.textContent = captions[mode];
    if (viewer) {
      if (mode === 'interactive' && stageVisible) viewer.start();
      else viewer.stop();
    }
    if (mode === 'evolution' && stageVisible && !reduceMotion.matches) {
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

  introVideo.addEventListener('play', () => {
    introCta.hidden = true;
    root.classList.remove('is-intro-complete');
  });
  introVideo.addEventListener('ended', () => {
    introCta.hidden = false;
    root.classList.add('is-intro-complete');
  });
  introVideo.addEventListener('timeupdate', () => {
    if (!introCta.hidden && !introVideo.ended) introCta.hidden = true;
  });

  enterInteractive?.addEventListener('click', () => {
    const interactiveTab = tabs.find(tab => tab.dataset.schoolMode === 'interactive');
    select(interactiveTab);
    interactiveTab.focus();
    stage.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'center' });
  });

  // The eight-second introduction starts only when it can actually be seen.
  const stageObserver = new IntersectionObserver(entries => {
    stageVisible = entries.some(entry => entry.isIntersecting);
    if (viewer) {
      if (stageVisible && activeMode() === 'interactive') viewer.start();
      else viewer.stop();
    }
    if (stageVisible) {
      if (activeMode() === 'evolution' && !reduceMotion.matches) playIntro();
    } else {
      introVideo.pause();
      tourVideo.pause();
    }
  }, { threshold: 0.45 });
  stageObserver.observe(stage);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      introVideo.pause();
      tourVideo.pause();
    } else if (stageVisible && activeMode() === 'evolution') {
      playIntro();
    }
  });

  reduceMotion.addEventListener('change', event => {
    if (event.matches) {
      introVideo.pause();
      tourVideo.pause();
    }
  });

  const button = root.querySelector('[data-school-load]');
  const status = root.querySelector('[data-school-status]');
  const overlay = root.querySelector('[data-school-overlay]');
  window.addEventListener('pagehide', event => {
    if (event.persisted) viewer?.stop();
    else { viewer?.dispose(); viewer = null; }
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted && stageVisible && activeMode() === 'interactive') viewer?.start();
  });
  button.addEventListener('click', () => loadModel());
  async function loadModel() {
    viewer?.dispose(); viewer = null;
    button.disabled = true;
    status.textContent = '正在加载三维场景，请稍候…';
    try {
      const { mountReconstruction } = await import('./reconstruction-viewer.js?v=webgs-sog-20261031');
      viewer = await mountReconstruction(root, {
        onStatus: message => { status.textContent = message; },
        onError: error => {
          status.textContent = `三维场景不可用：${error.message}`;
          overlay.hidden = false;
          button.textContent = '重新加载';
          button.disabled = false;
        },
      });
      overlay.hidden = true;
      if (activeMode() === 'interactive' && stageVisible) viewer.start();
    } catch (error) {
      console.error('3DGS 加载失败', error);
      if (viewer) {
        viewer.dispose();
        viewer = null;
      }
      status.textContent = `三维场景加载失败：${error.message} 请使用支持 WebGPU 的桌面浏览器。`;
      button.textContent = '重新加载';
      button.disabled = false;
    }
  }
}
