import { icon } from './icons.js?v=mobile-polish-20261023';
import { mountHeroVideo } from './hero-video.js?v=watch-full-20261029';
import { mountAgentConversion } from './agent-conversion.js?v=agent-simple-20261029';
import { mountRealSimWorkflow } from './real-sim-workflow.js?v=playground-20261029';
import { mountSceneComparison } from './scene-comparison.js?v=usedv6-comparison-20261026';
import { mountContactComparison } from './contact-comparison.js?v=review-fixes-20261023';
import { mountSimulationExplorer } from './simulation-explorer.js?v=usedv6-baked-20261026';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const heroVideo = mountHeroVideo($('[data-hero-media]'));
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
mountSceneComparison($('[data-scene-comparison]'));
mountSimulationExplorer($('[data-usedv6-explorer]'), {
  comparisonLabel: '照片对比',
  loadViewer: root => import('./studio1-viewer.js?v=studio1-baked-20261029b').then(module => module.mountStudio1Viewer(root)),
});

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
  "hero-full": {"src":"assets/homepage-hero.mp4?v=hero-v8-20261031","title":"TEZOI 仿真演示","description":"完整视频 · 00:34","note":"刚体接触、柔性物体操作与流体交互。","muted":false},
  "gallery-panda-mixing": {"src":"assets/gallery-panda-mixing.mp4","title":"离心管开盖与滴加混匀","description":"实验室 / Dual Panda / 1:01 / 原速","note":"双臂协作完成离心管开盖、胶头滴管吸液与滴加、压盖及三次倒置混匀。脚本控制的仿真演示，胶头、卡扣与液体采用未标定的简化模型；结果尚未经过真机验证。"},
  "gallery-soft-bag": {"src":"assets/gallery-soft-bag.mp4?v=laboratory-ipc-multiview-20261031","title":"软袋开袋、加液与夹封","description":"实验室 / Dual UR5e / Allegro v4 / 2:15 / 2K主画面 / 同步三视角","note":"第三视角、左腕与右腕同步展示完整134.9秒，主画面2560×1440，组合3840×1440，20fps原速无剪切。双臂协同开袋、持杯加液、放杯、机械夹封并撤手；薄膜与液体由IPC重新计算。起始杯内225mL，按粒子质量统计98.40%入袋，有少量溅液。机械臂与夹具沿控制轨迹执行；材料未经实物标定，夹封未经气密或泄漏验证。"},
  "gallery-pigment-dilution": {"src":"assets/gallery-pigment-dilution.mp4?v=20261031","title":"色素稀释","description":"实验室 / UR5e / Robotiq 2F85 / 0:50","note":"夹爪挤压滴管胶头，展示不同预压力下的吸液、排液与色素浓度变化。液体采用简化模型，结果未经真机标定；此处播放完整仿真预览。"},
  "gallery-go2-walk": {"src":"assets/gallery-go2-walk.mp4","title":"Go2 行走","description":"运动控制 / Unitree Go2 / 0:05","note":"行走策略驱动四足机器人连续运动，呈现步态协调与足端地面接触。"},
  "gallery-g1-dance": {"src":"assets/gallery-g1-dance.mp4","title":"G1 舞蹈","description":"运动控制 / Unitree G1 / Dual Dex3 / 0:20","note":"舞蹈策略驱动人形机器人执行 Shuffle 动作，呈现连续步伐、躯干与双臂的协同运动。"},
  "gallery-labimus-medicine": {"src":"assets/gallery-labimus-medicine.mp4?v=laboratory-highlights-20261031","title":"双臂取药","description":"实验室 / Dual UR5e / Robotiq 2F85 / 0:58 / 2K主画面 / 关键步骤","note":"关键步骤剪辑：持瓶与倾斜、抓勺抬升、取料退出、扶正药瓶。第三视角、左腕与右腕同步保留，主画面2560×1440，组合3840×1440；片段原速播放，共58.1秒。机械臂沿控制轨迹执行；颗粒由IPC计算，非850mg精密称量验证。"},
  "gallery-labimus-weighing": {"src":"assets/gallery-labimus-weighing.mp4?v=laboratory-highlights-20261031","title":"双臂称量","description":"实验室 / Dual UR5e / Robotiq 2F85 / 0:52 / 2K主画面 / 关键步骤","note":"关键步骤剪辑：对准倒料、还勺撤手、关门、稳定终态。第三视角、左腕与右腕同步保留，主画面2560×1440，组合3840×1440；片段原速播放，共51.75秒。机械臂沿控制轨迹执行；颗粒由IPC计算，非850mg精密称量验证。"},
  "gallery-flexible-rj45": {"src":"assets/gallery-flexible-rj45.mp4","title":"柔性网线插拔","description":"工厂 / Franka / 0:25","note":"呈现一米柔性网线的抓取、插入锁止、重抓解锁与拔出，展示柔性线缆与连接器的接触操作。"},
  "gallery-rubber-ring": {"src":"assets/gallery-rubber-ring.mp4","title":"双臂橡胶圈装配","description":"工厂 / Dual UR5e / 0:20","note":"双臂通过摩擦夹持完成胶圈拾取、搬运、拉伸与入槽。部分装配条件仍未达标。"},
  "gallery-ram-insertion": {"src":"assets/gallery-ram-insertion-hd.mp4","title":"双臂内存条插装","description":"工厂 / Dual UR5e / 0:37","note":"双臂协同完成内存条拾取、DIMM 插槽对准与压入，呈现松爪撤离后的状态。任务效果与训练适用性尚待验证。"},
  "gallery-m12-nut": {"src":"assets/playground-m12-simulation-1080.mp4","title":"指尖拧紧 M12 螺母","description":"工厂 / Franka / 1:17","note":"呈现螺母抓取、转运、再抓取调整、指尖旋拧与预紧卸载。夹持稳定性尚未达标。"},
  "gallery-bottle-packing": {"src":"assets/gallery-bottle-packing.mp4","title":"水瓶装盒与托盘放置","description":"工厂 / Dual UR5e / 0:40","note":"双臂协同完成水瓶入盒、四片盒盖折叠、搬运与托盘放置。接触计算采用简化末端模型，完整机械臂用于运动展示。"},
  "gallery-g1-box": {"src":"assets/gallery-g1-box.mp4","title":"G1 人形机器人搬箱","description":"工厂 / G1 · Revo / 0:43","note":"G1 双手从货架取箱，行走搬运后放入蓝色箱筐。保留同源仿真接触力与指尖变形可视化；触觉未经硬件标定，热图为每 2 秒快照并显示采样时间与年龄。抓取对齐片段加速 2.5 倍，抬起与放下 2 倍，行走原速。工厂背景为 Blender Cycles 渲染场景。"},
  "rigid": {"src":"assets/ipc-rigid-v2.mp4","title":"连锁接触与动量传递","description":"刚体接触与动量传递","note":"通过连续碰撞呈现刚体接触、运动传递与稳定过程。"},
  "soft": {"src":"assets/ipc-soft-v2.mp4","title":"弹性形变与卸载恢复","description":"弹性形变与卸载恢复","note":"呈现柔性材料在受压与卸载过程中的形变与恢复。材料参数为仿真示例，尚未经实物标定。"},
  "cables": {"src":"assets/ipc-cables.mp4","title":"线束弯曲与接触","description":"柔性线束动力学","note":"呈现多根线束在重力与接触作用下的弯曲、垂落与支撑。材料参数为仿真示例，尚未经实物标定。"},
  "fluid": {"src":"assets/ipc-fluid.mp4","title":"液体流动与流固接触","description":"液体流动与流固耦合","note":"呈现液体绕过障碍、形成波浪并与固体接触的动态过程。"},
  "tactile": {"src":"assets/ipc-tactile.mp4","title":"凝胶形变与接触力","description":"凝胶形变与法向接触力分布","note":"凝胶受压形变与法向接触力同步可视化，颜色用于显示仿真接触力分布。"},
  "haoxiang-cloth": {"src":"assets/haoxiang-cloth.mp4?v=physical-robotbed-v20","title":"双臂毛毯对折","description":"Cloth / Dual Franka FR3 / 0:22","note":"双臂抓取床尾毛毯，沿圆弧翻折后释放与撤离，呈现布料接触与摩擦。"},
  "haoxiang-shell": {"src":"assets/haoxiang-shell.mp4?v=physical-robotbed-v20","title":"水瓶挤压","description":"Shells & Fluids / Franka FR3 / 0:13","note":"呈现开口方瓶在夹持作用下的形变，以及液体从瓶口溢出的过程。"},
  "haoxiang-porous": {"src":"assets/haoxiang-porous.mp4?v=physical-robotbed-v20","title":"海绵吸水与挤水","description":"Porous Media / Franka FR3 / 1:35","note":"呈现双槽水槽间四个周期的海绵吸水、换位重抓与挤水，保留排水近景。"},
  "haoxiang-safe-grasp": {"src":"assets/haoxiang-safe-grasp.mp4","title":"微滑反馈抓取","description":"触觉 / Parallel gripper / 0:13","note":"根据螺栓微滑反馈调整夹持力，完成提起与保持。"},
  "haoxiang-bolt-dashboard": {"src":"assets/haoxiang-bolt-dashboard.mp4","title":"多模态触觉感知","description":"触觉 / Parallel gripper / 0:09","note":"同步呈现螺栓抓取中的凝胶形变、触觉分布与三轴力。"},
  "haoxiang-allegro-vbts": {"src":"assets/haoxiang-allegro-vbts.mp4","title":"Allegro 触觉抓取","description":"触觉 / Allegro Hand / 0:07","note":"呈现灵巧手指端接触与凝胶形变，展示触觉深度变化。"},
  "haoxiang-l20-grasp": {"src":"assets/haoxiang-l20-grasp.mp4","title":"L20 灵巧手抓取","description":"触觉 / LinkerHand L20 / 0:06","note":"呈现灵巧手抓取中的指端接触、材料形变与触觉反馈。"},
  "haoxiang-pressure-glove": {"src":"assets/haoxiang-pressure-glove.mp4","title":"指尖力控制","description":"触觉 / LinkerHand L20 / 0:08","note":"通过四指依次点按，呈现手部接触分布与力反馈。"},
  "haoxiang-fr3-plastic-grasp": {"src":"assets/haoxiang-fr3-plastic-grasp.mp4","title":"弹性与塑性形变","description":"软材料 / Franka FR3 / 0:17","note":"对比不同夹持载荷下的弹性回弹与塑性残余形变。"},
  "haoxiang-basket-bunny": {"src":"assets/haoxiang-basket-bunny.mp4","title":"软体物体抓取","description":"软材料 / WujiHand / 1:03","note":"灵巧手从周转箱抓取软体物体，呈现包覆接触、材料形变与提起过程。"},
  "haoxiang-washroom-hang": {"src":"assets/haoxiang-washroom-hang.mp4","title":"双手衣物悬挂","description":"布料 / Dual WujiHand / 0:25","note":"双手协同完成衬衫抓取、衣架穿入、悬挂与释放。"},
  "haoxiang-go2-drape": {"src":"assets/haoxiang-go2-drape.mp4","title":"Go2 布料接触","description":"布料 / Unitree Go2 / Stationary / 0:04","note":"呈现布料在静止机器狗背部与四肢表面的接触和垂落。"},
  "gallery-matterix-liquid": {"src":"assets/gallery-matterix-liquid.mp4?v=20261031","title":"实验室液体操作","description":"实验室 / Franka Panda · Robotiq 2F85 / 0:46 / 1× playback","note":"完整呈现两次抓杯、倾倒与放回，液体由琥珀色转为浅浑浊色。颜色为未标定的局部光学近似。"},
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
  if (typeof video.muted === 'boolean') player.muted = video.muted;
  dialog.showModal();
  heroVideo?.setActive(false);
  realSimWorkflow?.pause();
  agentConversion?.pause?.();
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
  heroVideo?.setActive(true);
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
