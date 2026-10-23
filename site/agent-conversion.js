// A scripted, illustrative animation. No video inference, physics or policy service.
const DURATION = 20;
const PHASES = ['ego', 'environment', 'trajectory', 'policy'];
const CAPTIONS = [
  '从 Ego 视频中识别对象、接触与操作顺序。',
  '从空间线索重建几何、材质与可交互环境。',
  '将操作映射到机器人，组织末端动作轨迹。',
  '以观察、动作和反馈组成面向任务的执行策略。',
];
const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };

export function mountAgentConversion(root) {
  if (!root) return null;
  const find = name => root.querySelector(`[data-agent-${name}]`);
  const play = find('play'), replay = find('replay'), timeline = find('timeline');
  const steps = [...root.querySelectorAll('[data-agent-step]')];
  const outputs = [...root.querySelectorAll('[data-agent-output]')];
  const points = [...root.querySelectorAll('[data-agent-point]')].map((point, i) => ({
    point, dx: ((i * 97 + 31) % 360 + 30) - Number(point.getAttribute('cx')),
    dy: ((i * 53 + 17) % 240 + 20) - Number(point.getAttribute('cy')),
  }));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const dialog = document.querySelector('#video-dialog');
  let progress = reduced.matches ? 1 : 0;
  let active = false, visible = false, visited = false, wantPlayback = false;
  let frame = null, lastTime = null, lastPhase = -1;
  const canPlay = () => active && visible && !document.hidden && !dialog?.open && wantPlayback;

  function draw() {
    const phase = Math.min(3, Math.floor(progress * 4));
    const environment = smooth((progress - .25) / .2);
    const trajectory = clamp((progress - .5) / .22);
    const policy = clamp((progress - .75) / .2);
    root.dataset.phase = PHASES[phase];
    root.dataset.playing = String(canPlay());
    root.style.setProperty('--ego-progress', clamp(progress * 4));
    play.setAttribute('aria-label', wantPlayback ? '暂停转换演示' : progress >= 1 ? '重播转换演示' : '播放转换演示');
    play.setAttribute('aria-pressed', String(wantPlayback));
    play.textContent = wantPlayback ? 'Ⅱ 暂停' : progress >= 1 ? '↺ 重播' : '▶ 播放';
    timeline.value = Math.round(progress * 1000);
    timeline.setAttribute('aria-valuetext', `流程示意 ${Math.round(progress * DURATION)} 秒，共 ${DURATION} 秒`);
    find('time').textContent = `00:${String(Math.floor(progress * DURATION)).padStart(2, '0')} / 00:20`;
    if (phase !== lastPhase) {
      lastPhase = phase;
      find('caption').textContent = CAPTIONS[phase];
      steps.forEach((step, i) => {
        step.setAttribute('aria-selected', String(i === phase));
        step.tabIndex = i === phase ? 0 : -1;
      });
      find('stage').setAttribute('aria-labelledby', steps[phase].id);
    }
    outputs.forEach((output, i) => {
      const value = [environment, trajectory, policy][i];
      output.dataset.state = value >= .99 ? 'ready' : value > 0 ? 'building' : 'pending';
      output.style.setProperty('--output-progress', value);
    });
    find('ego-hand').setAttribute('transform', `translate(${Math.sin(progress * Math.PI * 6) * 5} ${-Math.sin(clamp(progress * 4) * Math.PI) * 14})`);
    find('detection').setAttribute('opacity', smooth(progress * 8));
    find('environment').setAttribute('opacity', environment > 0 ? '1' : '0');
    find('solids').setAttribute('opacity', clamp((environment - .45) / .5));
    points.forEach(({ point, dx, dy }) => {
      point.setAttribute('transform', `translate(${dx * (1 - environment)} ${dy * (1 - environment)})`);
      point.setAttribute('opacity', progress >= .25 ? 1 - environment * .65 : 0);
    });
    find('trajectory').setAttribute('opacity', progress >= .5 ? '1' : '0');
    find('trajectory').style.strokeDashoffset = 1 - trajectory;
    const t = smooth(trajectory), u = 1 - t;
    const x = u ** 3 * 95 + 3 * u ** 2 * t * 115 + 3 * u * t ** 2 * 295 + t ** 3 * 254;
    const y = u ** 3 * 86 + 3 * u ** 2 * t * 25 + 3 * u * t ** 2 * 40 + t ** 3 * 142;
    find('tool').setAttribute('opacity', progress >= .5 ? '1' : '0');
    find('tool').setAttribute('transform', `translate(${x} ${y}) rotate(${policy > 0 ? Math.sin(policy * Math.PI * 4) * 9 : -12 * (1 - t)})`);
    find('policy').setAttribute('opacity', smooth(policy * 3));
    root.dataset.policyBeat = String(Math.floor(policy * 9) % 3);
    find('packet').setAttribute('cx', 8 + (progress * 12 % 1) * 64);
  }

  function tick(time) {
    frame = null;
    if (!canPlay()) { lastTime = null; draw(); return; }
    if (lastTime !== null) progress = clamp(progress + Math.min(Math.max(time - lastTime, 0), 120) / (DURATION * 1000));
    lastTime = time;
    if (progress >= 1) wantPlayback = false;
    draw();
    if (canPlay()) frame = window.requestAnimationFrame(tick);
    else lastTime = null;
  }
  function sync() {
    if (frame !== null) window.cancelAnimationFrame(frame);
    frame = null; lastTime = null;
    draw();
    if (canPlay()) frame = window.requestAnimationFrame(tick);
  }
  function selectPhase(index, focus = false) {
    progress = (index + .95) / 4;
    wantPlayback = false;
    sync();
    if (focus) steps[index].focus();
  }
  play.addEventListener('click', () => {
    if (progress >= 1) progress = 0;
    wantPlayback = !wantPlayback;
    sync();
  });
  replay.addEventListener('click', () => { progress = 0; wantPlayback = true; sync(); });
  timeline.addEventListener('input', () => { progress = clamp(Number(timeline.value) / 1000); wantPlayback = false; sync(); });
  steps.forEach((step, i) => {
    step.addEventListener('click', () => selectPhase(i));
    step.addEventListener('keydown', event => {
      let index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') index = (i + 1) % 4;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') index = (i + 3) % 4;
      if (event.key === 'Home') index = 0;
      if (event.key === 'End') index = 3;
      if (index !== undefined) { event.preventDefault(); selectPhase(index, true); }
    });
  });
  new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); sync(); }, { threshold: .15 }).observe(root);
  document.addEventListener('visibilitychange', sync);
  if (dialog) new MutationObserver(sync).observe(dialog, { attributes: true, attributeFilter: ['open'] });
  reduced.addEventListener('change', () => { if (reduced.matches) wantPlayback = false; sync(); });
  draw();
  return {
    setActive(value) {
      if (active === value) return;
      active = value;
      if (active && !visited) { visited = true; wantPlayback = !reduced.matches; }
      if (!active) wantPlayback = false;
      sync();
    },
  };
}
