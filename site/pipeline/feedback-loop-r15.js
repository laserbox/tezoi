// Architecture demonstration from the server's typed feedback and cache rules.
// This component never dispatches a pipeline job or reports an executed repair.
export function mountFeedbackLoop(root) {
  let language = 'zh', stage = 1, enabled = false, playing = false, step = -1, timer;
  const t = (zh, en) => language === 'en' ? en : zh;
  const route = () => stage === 1
    ? {code:'OCCLUDED_BACKGROUND_UNOBSERVED', target:'environment', label:t('场景重建','Scene geometry')}
    : stage === 3
      ? {code:'ROBOT_SPEED_LIMIT', target:'hands_actions/robot_retarget', label:t('动作重定向','Robot motion')}
      : {code:'ALIGNMENT_OR_CONTACT_REVIEW', target:'hands_actions/interaction', label:t('手物对齐','Hand–object alignment')};
  root.innerHTML = `<div class="fl-heading"><span data-loop-title></span><button type="button" data-loop-play></button></div>
    <div class="fl-map">
      <svg viewBox="0 0 1000 140" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="fl-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="currentColor" stroke-width="1.2"/></marker></defs><path class="fl-forward" d="M280 44H355" marker-end="url(#fl-arrow)"/><path class="fl-forward" d="M645 44H720" marker-end="url(#fl-arrow)"/><path class="fl-return" d="M850 84V115Q850 130 835 130H165Q150 130 150 115V86" marker-end="url(#fl-arrow)"/></svg>
      <div class="fl-nodes"><div class="fl-node" data-loop-node="agent"><span class="fl-icon">&lt;/&gt;</span><b>Coding Agent</b><small data-loop-agent></small></div><div class="fl-node" data-loop-node="tools"><span class="fl-icon">◇</span><b data-loop-tools></b><small data-loop-branch></small></div><div class="fl-node" data-loop-node="verify"><span class="fl-icon">⌁</span><b data-loop-verify></b><small>verify / feedback</small></div></div>
      <span class="fl-return-label" data-loop-return></span>
    </div><div class="fl-state" aria-live="polite"><span data-loop-state></span><code data-loop-code></code></div>`;
  const stop = () => {clearTimeout(timer); playing=false; step=-1; paint();};
  function paint() {
    const r=route();
    root.dataset.loopStep=String(step);root.dataset.loopPlaying=String(playing);
    root.querySelector('[data-loop-title]').textContent=t('Coding feedback · 架构示意','Coding feedback · architecture');
    root.querySelector('[data-loop-play]').textContent=playing?t('停止演示','Stop demo'):t('演示闭环 ↻','Show feedback ↻');
    root.querySelector('[data-loop-agent]').textContent=t('修改代码与配置','Edit code & config');
    root.querySelector('[data-loop-tools]').textContent=t('工具执行','Tool execution');
    root.querySelector('[data-loop-branch]').textContent=stage===1?'masks / depth / assets':stage===3?'scene / physics / render':'motion / contacts';
    root.querySelector('[data-loop-verify]').textContent=t('证据检查','Evidence checks');
    root.querySelector('[data-loop-return]').textContent=t('反馈修正 · 按依赖重跑','Repair feedback · dependency-based rerun');
    const phases=[t('读取工具输出','Read tool outputs'),t('检查来源与约束','Check evidence & constraints'),t('定位：','Route: ')+r.label,t('修正目标模块','Edit the target module'),t('重跑受影响环节','Rerun affected stages')];
    root.querySelector('[data-loop-state]').textContent=step<0?t('对齐 → 接触 → 材料 → 外观','Alignment → contact → material → appearance'):phases[step];
    root.querySelector('[data-loop-code]').textContent=step===2?r.code:step===3?r.target:step===4?'cache.fingerprint(stage, config, root)':t('服务器反馈规则','Server feedback rules');
    root.querySelectorAll('[data-loop-node]').forEach(n=>n.dataset.lit=String(n.dataset.loopNode===(['tools','verify','verify','agent','tools'][step])));
  }
  function advance() {
    if(!enabled||document.hidden){stop();return;}
    step++;if(step>4){stop();return;}paint();timer=setTimeout(advance,1300);
  }
  root.querySelector('[data-loop-play]').onclick=()=>{if(playing){stop();return;}if(!enabled)return;playing=true;step=-1;advance();};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  paint();
  return {setStage(value){stage=value;stop();},setLanguage(value){language=value;paint();},setActive(value){enabled=value;if(!value)stop();},stop};
}
