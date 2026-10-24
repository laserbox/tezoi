import { icon } from './icons.js?v=mobile-polish-20261023';
import { mountAgentConversion } from './agent-conversion.js?v=agent-physics8-20261024';
import { mountRealSimWorkflow } from './real-sim-workflow.js?v=review-fixes-20261023';
import { mountRenderingShowcase } from './rendering-showcase.js?v=mobile-polish-20261023';
import { mountContactComparison } from './contact-comparison.js?v=review-fixes-20261023';
import { mountSimulationExplorer } from './simulation-explorer.js?v=mobile-polish-20261023';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const contactComparison = mountContactComparison($('[data-contact-comparison]'));
const simulationExplorer = mountSimulationExplorer($('[data-simulation-explorer]'), { onPause: () => contactComparison?.pause() });
const agentConversion = mountAgentConversion($('[data-agent-conversion]'));
const realSimWorkflow = mountRealSimWorkflow($('[data-real-sim-workflow]'), { onStageChange: ({ to }) => {
  contactComparison?.pause();
  agentConversion?.setActive(to === 'agent');
  simulationExplorer?.setActive(to === 'simulation');
} });
$$('[data-workflow-target]').forEach(link => link.addEventListener('click', () => {
  realSimWorkflow?.selectStage(link.dataset.workflowTarget);
  if (link.dataset.workflowTarget === 'simulation') simulationExplorer?.selectView('video');
}));
mountRenderingShowcase($('[data-rendering-showcase]'));

const tabs = $$('[data-scene]');
function selectScene(tab) {
  tabs.forEach((item) => {
    item.setAttribute('aria-selected', String(item === tab));
    item.tabIndex = item === tab ? 0 : -1;
  });
  $$('[data-scene-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.scenePanel !== tab.dataset.scene;
  });
}
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectScene(tab));
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
    if (event.key === 'ArrowLeft') next = tabs[(i + tabs.length - 1) % tabs.length];
    if (event.key === 'Home') next = tabs[0];
    if (event.key === 'End') next = tabs.at(-1);
    if (next) {
      event.preventDefault();
      selectScene(next);
      next.focus();
    }
  });
});

const videos = {
  "gallery-pigment-dilution": {"src":"assets/gallery-pigment-dilution.mp4","title":"色素稀释","description":"实验室 / UR5e / Robotiq 2F85 / 0:50","note":"夹爪挤压滴管胶头，展示不同预压力下的吸液、排液与色素浓度变化。液体采用简化模型，结果未经真机标定；此处播放完整仿真预览。"},
  "gallery-go2-walk": {"src":"assets/gallery-go2-walk.mp4","title":"Go2 行走","description":"运动控制 / Unitree Go2 / 0:05","note":"行走策略驱动四足机器人连续运动，呈现步态协调与足端地面接触。"},
  "gallery-g1-dance": {"src":"assets/gallery-g1-dance.mp4","title":"G1 舞蹈","description":"运动控制 / Unitree G1 / Dual Dex3 / 0:20","note":"舞蹈策略驱动人形机器人执行 Shuffle 动作，呈现连续步伐、躯干与双臂的协同运动。"},
  "gallery-labimus-medicine": {"src":"assets/gallery-labimus-medicine.mp4","title":"双臂取药","description":"实验室 / Dual UR5e / Robotiq 2F85 / 2:43","note":"完成称量舟准备后，双臂协同持瓶与持勺，倾瓶取出颗粒并扶正药瓶。"},
  "gallery-labimus-weighing": {"src":"assets/gallery-labimus-weighing.mp4","title":"双臂称量","description":"实验室 / Dual UR5e / Robotiq 2F85 / 1:08","note":"端稳药勺并将颗粒转移至称量舟，完成还勺、关闭天平门和稳定读数。原任务的目标剂量未达。"},
  "gallery-flexible-rj45": {"src":"assets/gallery-flexible-rj45.mp4","title":"柔性网线插拔","description":"工厂 / Franka / 0:25","note":"呈现一米柔性网线的抓取、插入锁止、重抓解锁与拔出，展示柔性线缆与连接器的接触操作。"},
  "gallery-rubber-ring": {"src":"assets/gallery-rubber-ring.mp4","title":"双臂橡胶圈装配","description":"工厂 / Dual UR5e / 0:20","note":"双臂通过摩擦夹持完成胶圈拾取、搬运、拉伸与入槽。部分装配条件仍未达标。"},
  "gallery-ram-insertion": {"src":"assets/gallery-ram-insertion-hd.mp4","title":"双臂内存条插装","description":"工厂 / Dual UR5e / 0:37","note":"双臂协同完成内存条拾取、DIMM 插槽对准与压入，呈现松爪撤离后的状态。任务效果与训练适用性尚待验证。"},
  "gallery-m12-nut": {"src":"assets/playground-m12-simulation-1080.mp4","title":"指尖拧紧 M12 螺母","description":"工厂 / Franka / 1:17","note":"呈现螺母抓取、转运、再抓取调整、指尖旋拧与预紧卸载。夹持稳定性尚未达标。"},
  "gallery-bottle-packing": {"src":"assets/gallery-bottle-packing.mp4","title":"水瓶装盒与托盘放置","description":"工厂 / Dual UR5e / 0:40","note":"双臂协同完成水瓶入盒、四片盒盖折叠、搬运与托盘放置。接触计算采用简化末端模型，完整机械臂用于运动展示。"},
  "gallery-rj45-attempt": {"src":"assets/gallery-rj45-attempt-hd.mp4","title":"RJ45 连接器插接尝试","description":"工厂 / Franka / 0:16","note":"呈现刚性连接器的抓取、抬升、定向、转移与插接过程。该研究演示尚未达到插接精度要求。"},
  "rigid": {"src":"assets/ipc-rigid-v2.mp4","title":"连锁接触与动量传递","description":"刚体接触与动量传递","note":"通过连续碰撞呈现刚体接触、运动传递与稳定过程。"},
  "soft": {"src":"assets/ipc-soft-v2.mp4","title":"弹性形变与卸载恢复","description":"弹性形变与卸载恢复","note":"呈现柔性材料在受压与卸载过程中的形变与恢复。材料参数为仿真示例，尚未经实物标定。"},
  "cables": {"src":"assets/ipc-cables.mp4","title":"线束弯曲与接触","description":"柔性线束动力学","note":"呈现多根线束在重力与接触作用下的弯曲、垂落与支撑。材料参数为仿真示例，尚未经实物标定。"},
  "fluid": {"src":"assets/ipc-fluid.mp4","title":"液体流动与流固接触","description":"液体流动与流固耦合","note":"呈现液体绕过障碍、形成波浪并与固体接触的动态过程。"},
  "tactile": {"src":"assets/ipc-tactile.mp4","title":"凝胶形变与接触力","description":"凝胶形变与法向接触力分布","note":"凝胶受压形变与法向接触力同步可视化，颜色用于显示仿真接触力分布。"},
  "haoxiang-cloth": {"src":"assets/haoxiang-cloth.mp4","title":"双臂床单对折","description":"Cloth / Dual Franka FR3 / 0:24","note":"双臂通过接触与摩擦完成床单抓取、对折、释放与撤离。"},
  "haoxiang-shell": {"src":"assets/haoxiang-shell.mp4","title":"水瓶挤压","description":"Shells & Fluids / Franka FR3 / 0:13","note":"呈现薄壳瓶体在夹持作用下的形变，以及液体从瓶口流出的过程。"},
  "haoxiang-porous": {"src":"assets/haoxiang-porous.mp4","title":"海绵吸水与挤水","description":"Porous Media / Franka FR3 / 0:39","note":"呈现海绵吸水、转移、三次挤压排水与回置的连续过程。"},
  "haoxiang-safe-grasp": {"src":"assets/haoxiang-safe-grasp.mp4","title":"微滑反馈抓取","description":"触觉 / Parallel gripper / 0:13","note":"根据螺栓微滑反馈调整夹持力，完成提起与保持。"},
  "haoxiang-bolt-dashboard": {"src":"assets/haoxiang-bolt-dashboard.mp4","title":"多模态触觉感知","description":"触觉 / Parallel gripper / 0:09","note":"同步呈现螺栓抓取中的凝胶形变、触觉分布与三轴力。"},
  "haoxiang-allegro-vbts": {"src":"assets/haoxiang-allegro-vbts.mp4","title":"Allegro 触觉抓取","description":"触觉 / Allegro Hand / 0:07","note":"呈现灵巧手指端接触与凝胶形变，展示触觉深度变化。"},
  "haoxiang-l20-grasp": {"src":"assets/haoxiang-l20-grasp.mp4","title":"L20 灵巧手抓取","description":"触觉 / LinkerHand L20 / 0:06","note":"呈现灵巧手抓取中的指端接触、材料形变与触觉反馈。"},
  "haoxiang-pressure-glove": {"src":"assets/haoxiang-pressure-glove.mp4","title":"指尖力控制","description":"触觉 / LinkerHand L20 / 0:08","note":"通过四指依次点按，呈现手部接触分布与力反馈。"},
  "haoxiang-fr3-plastic-grasp": {"src":"assets/haoxiang-fr3-plastic-grasp.mp4","title":"弹性与塑性形变","description":"软材料 / Franka FR3 / 0:17","note":"对比不同夹持载荷下的弹性回弹与塑性残余形变。"},
  "haoxiang-basket-bunny": {"src":"assets/haoxiang-basket-bunny.mp4","title":"软体物体抓取","description":"软材料 / WujiHand / 1:03","note":"灵巧手从周转箱抓取软体物体，呈现包覆接触、材料形变与提起过程。"},
  "haoxiang-washroom-hang": {"src":"assets/haoxiang-washroom-hang.mp4","title":"双手衣物悬挂","description":"布料 / Dual WujiHand / 0:25","note":"双手协同完成衬衫抓取、衣架穿入、悬挂与释放。"},
  "haoxiang-go2-drape": {"src":"assets/haoxiang-go2-drape.mp4","title":"Go2 布料接触","description":"布料 / Unitree Go2 / Stationary / 0:04","note":"呈现布料在静止机器狗背部与四肢表面的接触和垂落。"},
  "haoxiang-lab-liquid": {"src":"assets/haoxiang-lab-liquid.mp4","title":"实验室液体操作","description":"实验室 / Franka FR3 / 0:36 / 4× playback","note":"呈现实验台中的取液、倾倒、搅拌与废液处理流程，以 4 倍速播放。"},
};
const dialog = $('#video-dialog');
const player = $('#demo-player');
let previousFocus;
$$('[data-video]').forEach((button) => button.addEventListener('click', () => {
  previousFocus = button;
  const video = videos[button.dataset.video];
  $('#video-title').textContent = video.title;
  $('#video-description').textContent = video.description;
  $('#video-note').textContent = video.note || '具身仿真演示。';
  player.src = video.src;
  dialog.showModal();
  realSimWorkflow?.pause();
  contactComparison?.pause();
  simulationExplorer?.pause();
  document.body.classList.add('modal-open');
  updateMaterialMotion();
  player.play().catch(() => { /* Native controls remain usable if autoplay is blocked. */ });
}));
$('#close-video').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  player.pause();
  player.removeAttribute('src');
  player.load();
  document.body.classList.remove('modal-open');
  updateMaterialMotion();
  previousFocus?.focus();
});

// Material and embodied studies move only while visible.
// Opening a large player also stops every preview.
const materialPreviews = $$('[data-material-preview]');
const visiblePreviews = new Set();
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionToggles = $$('.motion-toggle');
let materialPaused = motionPreference.matches;
function updateMaterialMotion() {
  motionToggles.forEach((toggle) => {
    toggle.setAttribute('aria-pressed', String(materialPaused));
    toggle.setAttribute('aria-label', materialPaused ? '播放动态' : '暂停动态');
    toggle.innerHTML = `<span class="motion-toggle-label">${materialPaused ? '播放动态' : '暂停动态'}</span>${icon(materialPaused ? 'play' : 'pause')}`;
  });
  for (const preview of materialPreviews) {
    if (!materialPaused && !document.hidden && !dialog.open && !preview.closest('[hidden]') && visiblePreviews.has(preview)) {
      preview.play().catch(() => { /* The user can still open the native player. */ });
    } else preview.pause();
  }
}
const materialObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) visiblePreviews.add(entry.target);
    else visiblePreviews.delete(entry.target);
  }
  updateMaterialMotion();
}, { threshold: .35 });
materialPreviews.forEach((preview) => materialObserver.observe(preview));
motionToggles.forEach((toggle) => toggle.addEventListener('click', () => {
  materialPaused = !materialPaused;
  updateMaterialMotion();
}));
motionPreference.addEventListener('change', (event) => {
  if (event.matches) materialPaused = true;
  updateMaterialMotion();
});
document.addEventListener('visibilitychange', updateMaterialMotion);
updateMaterialMotion();

const materialTabs = $$('[data-material]');
function selectMaterial(tab) {
  materialTabs.forEach((item) => {
    item.setAttribute('aria-selected', String(item === tab));
    item.tabIndex = item === tab ? 0 : -1;
  });
  $$('[data-material-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.materialPanel !== tab.dataset.material;
  });
  updateMaterialMotion();
}
materialTabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectMaterial(tab));
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight') next = materialTabs[(i + 1) % materialTabs.length];
    if (event.key === 'ArrowLeft') next = materialTabs[(i + materialTabs.length - 1) % materialTabs.length];
    if (event.key === 'Home') next = materialTabs[0];
    if (event.key === 'End') next = materialTabs.at(-1);
    if (next) {
      event.preventDefault();
      selectMaterial(next);
      next.focus();
    }
  });
});

if(location.hash === '#ego2sim') { realSimWorkflow?.selectStage('agent'); agentConversion?.setActive(true); document.querySelector('#workflow-panel-agent')?.scrollIntoView(); }
