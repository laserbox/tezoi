import { icon } from './icons.js?v=mobile-polish-20261023';
import { mountHeroVideo } from './hero-video.js?v=watch-full-20261029';
import { mountAgentConversion } from './agent-conversion.js?v=concise-20261031';
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
  "hero-full": {"src":"assets/homepage-hero.mp4?v=hero-v8-20261031","title":"TEZOI 仿真演示","muted":false},
  "gallery-panda-mixing": {"src":"assets/gallery-panda-mixing.mp4","title":"离心管开盖与滴加混匀"},
  "gallery-soft-bag": {"src":"assets/gallery-soft-bag.mp4?v=laboratory-ipc-multiview-20261031","title":"软袋开袋、加液与夹封"},
  "gallery-pigment-dilution": {"src":"assets/gallery-pigment-dilution.mp4?v=20261031","title":"色素稀释"},
  "gallery-go2-walk": {"src":"assets/gallery-go2-walk.mp4","title":"Go2 行走"},
  "gallery-g1-dance": {"src":"assets/gallery-g1-dance.mp4","title":"G1 舞蹈"},
  "gallery-labimus-medicine": {"src":"assets/gallery-labimus-medicine.mp4?v=laboratory-highlights-20261031","title":"双臂取药"},
  "gallery-labimus-weighing": {"src":"assets/gallery-labimus-weighing.mp4?v=laboratory-highlights-20261031","title":"双臂称量"},
  "gallery-flexible-rj45": {"src":"assets/gallery-flexible-rj45.mp4","title":"柔性网线插拔"},
  "gallery-rubber-ring": {"src":"assets/gallery-rubber-ring.mp4","title":"双臂橡胶圈装配"},
  "gallery-ram-insertion": {"src":"assets/gallery-ram-insertion-hd.mp4","title":"双臂内存条插装"},
  "gallery-m12-nut": {"src":"assets/playground-m12-simulation-1080.mp4","title":"指尖拧紧 M12 螺母"},
  "gallery-bottle-packing": {"src":"assets/gallery-bottle-packing.mp4","title":"水瓶装盒与托盘放置"},
  "gallery-g1-box": {"src":"assets/gallery-g1-box.mp4","title":"G1 人形机器人搬箱"},
  "rigid": {"src":"assets/ipc-rigid-v2.mp4","title":"连锁接触与动量传递"},
  "soft": {"src":"assets/ipc-soft-v2.mp4","title":"弹性形变与卸载恢复"},
  "cables": {"src":"assets/ipc-cables.mp4","title":"线束弯曲与接触"},
  "fluid": {"src":"assets/ipc-fluid.mp4","title":"液体流动与流固接触"},
  "tactile": {"src":"assets/ipc-tactile.mp4","title":"凝胶形变与接触力"},
  "haoxiang-cloth": {"src":"assets/haoxiang-cloth.mp4?v=physical-robotbed-v20","title":"双臂毛毯对折"},
  "haoxiang-shell": {"src":"assets/haoxiang-shell.mp4?v=physical-robotbed-v20","title":"水瓶挤压"},
  "haoxiang-porous": {"src":"assets/haoxiang-porous.mp4?v=physical-robotbed-v20","title":"海绵吸水与挤水"},
  "haoxiang-safe-grasp": {"src":"assets/haoxiang-safe-grasp.mp4","title":"微滑反馈抓取"},
  "haoxiang-bolt-dashboard": {"src":"assets/haoxiang-bolt-dashboard.mp4","title":"多模态触觉感知"},
  "haoxiang-allegro-vbts": {"src":"assets/haoxiang-allegro-vbts.mp4","title":"Allegro 触觉抓取"},
  "haoxiang-l20-grasp": {"src":"assets/haoxiang-l20-grasp.mp4","title":"L20 灵巧手抓取"},
  "haoxiang-pressure-glove": {"src":"assets/haoxiang-pressure-glove.mp4","title":"指尖力控制"},
  "haoxiang-fr3-plastic-grasp": {"src":"assets/haoxiang-fr3-plastic-grasp.mp4","title":"弹性与塑性形变"},
  "haoxiang-basket-bunny": {"src":"assets/haoxiang-basket-bunny.mp4","title":"软体物体抓取"},
  "haoxiang-washroom-hang": {"src":"assets/haoxiang-washroom-hang.mp4","title":"双手衣物悬挂"},
  "haoxiang-go2-drape": {"src":"assets/haoxiang-go2-drape.mp4","title":"Go2 布料接触"},
  "gallery-matterix-liquid": {"src":"assets/gallery-matterix-liquid.mp4?v=20261031","title":"实验室液体操作"},
};
const dialog = $('#video-dialog');
const player = $('#demo-player');
let previousFocus;
$$('[data-video]').forEach((button) => button.addEventListener('click', () => {
  previousFocus = button;
  const video = videos[button.dataset.video];
  $('#video-title').textContent = video.title;
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
