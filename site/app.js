import { mountVideoDialog } from './video-dialog.js?v=float-player-20261108';
import { importViewerModule } from './viewer-module.js?v=website-audit-20261101';
import { icon } from './icons.js?v=mobile-polish-20261023';
import { mountPhysicsCarousel } from './physics-carousel.js?v=progress-below-20261109';
import { mountHeroVideo } from './hero-video.js?v=watch-full-20261029';
import { mountAgentConversion } from './agent-rokae-conversion.js?v=showcase-r16';
import { mountRealSimWorkflow } from './real-sim-workflow.js?v=robot-real-r11';
import { mountSceneComparison } from './scene-comparison.js?v=website-audit-20261101';
import { mountContactComparison } from './contact-comparison.js?v=dropper-150534-20261106';
import { mountSimulationExplorer } from './simulation-explorer.js?v=dropper-150534-20261106';

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
const usedv6Explorer = mountSimulationExplorer($('[data-usedv6-explorer]'), {
  comparisonLabel: '照片对比',
  loadViewer: root => importViewerModule('./studio1-viewer.js?v=studio1-baked-20261029b').then(module => module.mountStudio1Viewer(root)),
});

const meshMethodPanel = $('[data-usedv6-explorer]')?.closest('[data-reconstruction-panel]');
if (meshMethodPanel) {
  usedv6Explorer?.setActive(!meshMethodPanel.hidden);
  meshMethodPanel.addEventListener('reconstruction-visibility', event => usedv6Explorer?.setActive(event.detail.active));
}

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
  "gallery-plush-packing": {"src":"assets/gallery-plush-packing.mp4?v=d315954eb12e","title":"双臂毛绒玩具装箱与封胶"},
  "hero-full": {"poster":"assets/tezoi-showcase-v35.jpg","src":"assets/tezoi-showcase-v35.mp4","title":"TEZOI 仿真演示","muted":false},
  "gallery-panda-mixing": {"src":"assets/gallery-panda-mixing.mp4?v=full-task-20261103","title":"离心管开盖与滴加混匀"},
  "gallery-soft-bag": {"src":"assets/gallery-soft-bag.mp4?v=soft-bag-newton-20261109","title":"软袋开袋、加液与夹封"},
  "gallery-pigment-dilution": {"src":"assets/gallery-pigment-dilution.mp4?v=fixed-beakers-1080p-20261110","title":"色素稀释"},
  "gallery-go2-walk": {"src":"assets/gallery-go2-walk.mp4","title":"Go2 行走"},
  "gallery-g1-dance": {"src":"assets/gallery-g1-dance.mp4","title":"G1 舞蹈"},
  "gallery-labimus-medicine-weighing": {"src":"assets/gallery-labimus-medicine-weighing.mp4?v=calm-grains-20261109","title":"双臂取药与称量"},
  "gallery-flexible-rj45": {"src":"assets/gallery-flexible-rj45.mp4?v=rj45-c32bcdf1fb34","title":"柔性网线插拔"},
  "gallery-rubber-ring": {"src":"assets/gallery-rubber-ring.mp4?v=no-ui-792aa48f","title":"双臂橡胶圈装配"},
  "gallery-ram-insertion": {"src":"assets/gallery-ram-insertion-hd.mp4?v=faststart-20261108","title":"双臂内存条插装"},
  "gallery-bottle-packing": {"src":"assets/gallery-bottle-packing.mp4?v=76e3cbb7d715","title":"水瓶装盒与托盘放置"},
  "gallery-g1-box": {"src":"assets/gallery-g1-box.mp4","title":"G1 人形机器人搬箱"},
  "rigid": {"src":"assets/ipc-rigid-v2.mp4","title":"连锁接触与动量传递"},
  "soft": {"src":"assets/ipc-soft-v2.mp4","title":"弹性形变与卸载恢复"},
  "cables": {"src":"assets/ipc-cables.mp4","title":"线束弯曲与接触"},
  "fluid": {"src":"assets/ipc-fluid.mp4","title":"液体流动与流固接触"},
  "tactile": {"src":"assets/ipc-tactile.mp4","title":"凝胶形变与接触力"},
  "haoxiang-cloth": {"src":"assets/haoxiang-cloth.mp4?v=physical-robotbed-v20","title":"柔性仿真"},
  "haoxiang-shell": {"src":"assets/haoxiang-shell.mp4?v=physical-robotbed-v20","title":"液体仿真"},
  "haoxiang-safe-grasp": {"src":"assets/haoxiang-safe-grasp.mp4?v=faststart-20261108","title":"微滑反馈抓取"},
  "haoxiang-bolt-dashboard": {"src":"assets/haoxiang-bolt-dashboard.mp4?v=faststart-20261108","title":"多模态触觉感知"},
  "haoxiang-allegro-vbts": {"src":"assets/haoxiang-allegro-vbts.mp4?v=faststart-20261108","title":"Allegro 触觉抓取"},
  "haoxiang-l20-grasp": {"src":"assets/haoxiang-l20-grasp.mp4?v=faststart-20261108","title":"L20 灵巧手抓取"},
  "haoxiang-pressure-glove": {"src":"assets/haoxiang-pressure-glove.mp4?v=faststart-20261108","title":"指尖力控制"},
  "haoxiang-fr3-plastic-grasp": {"src":"assets/haoxiang-fr3-plastic-grasp.mp4","title":"弹性与塑性形变"},
  "haoxiang-basket-bunny": {"src":"assets/haoxiang-basket-bunny.mp4","title":"软体物体抓取"},
  "haoxiang-washroom-hang": {"src":"assets/haoxiang-washroom-hang.mp4","title":"双手衣物悬挂"},
  "haoxiang-go2-drape": {"src":"assets/haoxiang-go2-drape.mp4","title":"Go2 布料接触"},
  "gallery-matterix-liquid": {"src":"assets/gallery-matterix-liquid.mp4?v=liquid-revised-20261106","title":"实验室液体操作"},
};
const dialog = $('#video-dialog');
const videoDialog = mountVideoDialog(dialog, {
  onOpen() {
    heroVideo?.setActive(false);
    realSimWorkflow?.pause();
    agentConversion?.pause?.();
    contactComparison?.pause();
    simulationExplorer?.pause();
    document.body.classList.add('modal-open');
    updateMaterialMotion();
  },
  onClose() {
    heroVideo?.setActive(true);
    document.body.classList.remove('modal-open');
    updateMaterialMotion();
  },
});
$$('[data-video]').forEach(button => button.addEventListener('click', () => {
  videoDialog.open(videos[button.dataset.video], button);
}));
// Pipeline players ask for the same large player (pipeline-player.js).
document.addEventListener('tezoi:enlarge-video', event => videoDialog.open(event.detail, event.detail.source));

// Material and embodied studies move only while visible.
// Opening a large player also stops every preview.
const physicsCarousel = mountPhysicsCarousel($('#embodied-studies'));
const materialPreviews = $$('[data-material-preview]').filter(video => !video.closest('[data-physics-carousel]'));
const visiblePreviews = new Set();
let manualPreviewPlayback = new WeakMap();
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionToggles = $$('.motion-toggle');
let materialPaused = motionPreference.matches;
function updateMaterialMotion() {
  physicsCarousel?.setSuspended(dialog.open);
  motionToggles.forEach((toggle) => {
    toggle.setAttribute('aria-pressed', String(materialPaused));
    toggle.setAttribute('aria-label', materialPaused ? '播放动态' : '暂停动态');
    toggle.innerHTML = `<span class="motion-toggle-label">${materialPaused ? '播放动态' : '暂停动态'}</span>${icon(materialPaused ? 'play' : 'pause')}`;
  });
  for (const preview of materialPreviews) {
    if ((manualPreviewPlayback.get(preview) ?? !materialPaused) && !document.hidden && !dialog.open && !preview.closest('[hidden]') && visiblePreviews.has(preview)) {
      preview.play().catch(() => { /* The inline play button remains available to retry. */ });
    } else preview.pause();
  }
}
// These three studies play in place; Gallery keeps its separate modal player.
$$('[data-inline-video]').filter(button => !button.closest('[data-physics-carousel]')).forEach((button) => {
  const preview = button.querySelector('video');
  const title = button.closest('article').querySelector('h4');
  if (title?.id) button.setAttribute('aria-describedby', title.id);
  const sync = () => {
    button.setAttribute('aria-label', preview.paused ? '播放演示' : '暂停演示');
    button.setAttribute('aria-pressed', String(!preview.paused));
    button.querySelector('.material-inline-toggle').innerHTML = icon(preview.paused ? 'play' : 'pause');
  };
  button.addEventListener('click', () => {
    const shouldPlay = preview.paused;
    if (shouldPlay && preview.error) preview.load();
    manualPreviewPlayback.set(preview, shouldPlay);
    updateMaterialMotion();
  });
  preview.addEventListener('play', sync);
  preview.addEventListener('pause', sync);
  preview.addEventListener('error', sync);
  sync();
});
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
  manualPreviewPlayback = new WeakMap();
  updateMaterialMotion();
}));
motionPreference.addEventListener('change', (event) => {
  if (event.matches) { materialPaused = true; manualPreviewPlayback = new WeakMap(); }
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

// Legacy report links can change only the fragment without reloading the page.
function syncAgentLink() {
  if (location.hash !== '#ego2sim') return;
  const requested = new URLSearchParams(location.search).get('workflow');
  const stage = ['source', 'agent', 'simulation', 'validation'].includes(requested) ? requested : 'agent';
  realSimWorkflow?.selectStage(stage);
  agentConversion?.setActive(stage === 'agent');
  simulationExplorer?.setActive(stage === 'simulation');
  document.querySelector(`#workflow-panel-${stage}`)?.scrollIntoView({ block: 'start' });
}
window.addEventListener('hashchange', syncAgentLink);
syncAgentLink();
