// Static images retain the same size; only their shared clipping boundary moves.
export function mountSceneComparison(root) {
  if (!root) return;
  const get = name => root.querySelector(`[data-scene-${name}]`);
  const stage = get('stage');
  const split = get('split');
  const real = get('real');
  const sim = get('sim');
  const realLabel = get('real-label');
  const simLabel = get('sim-label');
  const feedback = get('feedback');
  const status = get('status');
  const retry = get('retry');
  const images = [real, sim];
  const sources = new Map(images.map(image => [image, image.src]));
  const states = new Map(images.map(image => [image,
    image.complete ? (image.naturalWidth ? 'ready' : 'error') : 'loading'
  ]));

  function updateSplit() {
    const position = Number(split.value);
    stage.style.setProperty('--split', `${position}%`);
    split.setAttribute('aria-valuetext', `真实照片 ${position}%，Real2Sim 场景 ${100 - position}%`);
    realLabel.hidden = position < 20;
    simLabel.hidden = position > 80;
  }
  function updateState() {
    const failed = images.filter(image => states.get(image) === 'error');
    const ready = images.every(image => states.get(image) === 'ready');
    const state = failed.length ? 'error' : ready ? 'ready' : 'loading';
    root.dataset.state = state;
    stage.setAttribute('aria-busy', String(state === 'loading'));
    split.disabled = !ready;
    feedback.hidden = ready;
    retry.hidden = !failed.length;
    status.textContent = failed.length
      ? `${failed.map(image => image === real ? '真实照片' : 'Real2Sim 场景').join('、')}加载失败，请重试。`
      : ready ? '' : '正在加载对比画面…';
  }
  images.forEach(image => {
    image.addEventListener('load', () => { states.set(image, 'ready'); updateState(); });
    image.addEventListener('error', () => { states.set(image, 'error'); updateState(); });
  });
  retry.addEventListener('click', () => {
    images.filter(image => states.get(image) === 'error').forEach(image => {
      states.set(image, 'loading');
      const url = new URL(sources.get(image));
      url.searchParams.set('retry', String(Date.now()));
      image.src = url.href;
    });
    updateState();
  });
  split.addEventListener('input', updateSplit);
  updateSplit();
  updateState();
}
