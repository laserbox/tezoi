// A continuously animated architecture view of saved server feedback rules.
// No jobs, inference, repairs or solver iterations are dispatched by this UI.
export function mountFeedbackLoop(root) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let language = 'zh', stage = 0, enabled = false, inView = false;
  let userPaused = motion.matches, userChoice = false, playing = false, step = 0, timer;
  const phaseMs = 1600;
  const t = (zh, en) => language === 'en' ? en : zh;
  const branch = () => ['observe / toolkit','masks / depth / assets','motion / contacts','scene / physics / render'][stage];
  const route = () => stage === 0
    ? {code:'feedback/report.json', target:'environment / motion / contacts', label:t('按证据返回目标模块','Route evidence to the target module')}
    : stage === 1
      ? {code:'OCCLUDED_BACKGROUND_UNOBSERVED', target:'environment', label:t('定位：场景重建','Route: scene reconstruction')}
      : stage === 3
        ? {code:'ROBOT_SPEED_LIMIT', target:'hands_actions/robot_retarget', label:t('定位：动作重定向','Route: robot retargeting')}
        : {code:'ALIGNMENT_OR_CONTACT_REVIEW', target:'hands_actions/interaction', label:t('定位：手物对齐','Route: hand–object alignment')};
  root.setAttribute('role','region');
  root.innerHTML = `<div class="fl-heading"><span data-loop-title></span><button type="button" data-loop-play aria-controls="ego-feedback-map"></button></div>
    <div class="fl-map" id="ego-feedback-map">
      <svg viewBox="0 0 1000 140" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="fl-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="currentColor" stroke-width="1.2"/></marker></defs>
        <path class="fl-edge" d="M280 44H355" marker-end="url(#fl-arrow)"/><path class="fl-edge" d="M645 44H720" marker-end="url(#fl-arrow)"/>
        <path class="fl-return" d="M850 84V115Q850 130 835 130H165Q150 130 150 115V86" marker-end="url(#fl-arrow)"/>
        <path class="fl-trace fl-trace-tools" d="M280 44H355" pathLength="100"/><path class="fl-trace fl-trace-check" d="M645 44H720" pathLength="100"/>
        <path class="fl-trace fl-trace-back" d="M850 84V115Q850 130 835 130H165Q150 130 150 115V86" pathLength="100"/>
      </svg>
      <div class="fl-nodes"><div class="fl-node" data-loop-node="agent"><span class="fl-icon">&lt;/&gt;</span><b>Coding Agent</b><small data-loop-agent></small></div><div class="fl-node" data-loop-node="tools"><span class="fl-icon">◇</span><b data-loop-tools></b><small data-loop-branch></small></div><div class="fl-node" data-loop-node="verify"><span class="fl-icon">⌁</span><b data-loop-verify></b><small>verify / feedback</small></div></div>
      <span class="fl-return-label" data-loop-return></span>
    </div><div class="fl-state"><span data-loop-state></span><code data-loop-code></code></div>`;

  function paint() {
    const r = route();
    root.dataset.loopStep = String(step);
    root.dataset.loopPlaying = String(playing);
    root.dataset.loopPaused = String(userPaused);
    root.setAttribute('aria-label',t('Coding feedback 架构演示','Coding feedback architecture demonstration'));
    root.querySelector('[data-loop-title]').textContent=t('Coding feedback · 架构示意','Coding feedback · architecture');
    const button=root.querySelector('[data-loop-play]');
    button.textContent=userPaused?t('继续循环 ↻','Resume loop ↻'):t('暂停循环 Ⅱ','Pause loop Ⅱ');
    button.setAttribute('aria-pressed',String(userPaused));
    root.querySelector('[data-loop-agent]').textContent=t('代码与配置','Code & configuration');
    root.querySelector('[data-loop-tools]').textContent=t('工具执行','Tool execution');
    root.querySelector('[data-loop-branch]').textContent=branch();
    root.querySelector('[data-loop-verify]').textContent=t('证据检查','Evidence checks');
    root.querySelector('[data-loop-return]').textContent=t('反馈修正 · 按依赖重跑','Repair feedback · dependency-based rerun');
    const phases=[t('编写与修正','Write & refine'),t('调用工具','Call tools'),t('检查证据','Check evidence'),r.label,t('修正目标模块','Edit the target module'),t('重跑相关环节','Rerun affected stages')];
    const code=['config / module',branch(),'verify/report.json',r.code,r.target,'cache.fingerprint(stage, config, root)'];
    root.querySelector('[data-loop-state]').textContent=phases[step];
    root.querySelector('[data-loop-code]').textContent=code[step];
    root.querySelectorAll('[data-loop-node]').forEach(n=>n.dataset.lit=String(n.dataset.loopNode===['agent','tools','verify','verify','agent','tools'][step]));
  }
  function tick() {
    if(!playing)return;
    step=(step+1)%6;
    paint();
    timer=setTimeout(tick,phaseMs);
  }
  function sync() {
    const shouldPlay=enabled&&inView&&!document.hidden&&!userPaused;
    if(shouldPlay===playing){paint();return;}
    clearTimeout(timer);
    playing=shouldPlay;
    paint();
    if(playing)timer=setTimeout(tick,phaseMs);
  }
  root.querySelector('[data-loop-play]').onclick=()=>{userChoice=true;userPaused=!userPaused;sync();};
  document.addEventListener('visibilitychange',sync);
  const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;sync();},{threshold:0.02});
  observer.observe(root);
  motion.addEventListener('change',event=>{if(!userChoice)userPaused=event.matches;sync();});
  paint();
  return {
    setStage(value){stage=value;paint();},
    setLanguage(value){language=value;paint();},
    setActive(value){enabled=value;sync();},
  };
}
