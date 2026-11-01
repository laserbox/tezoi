// Reconstruction cards share the Agent's playback bar while keeping their own timelines.
let nextLabel = 0;
export function mountPreviewControls(video, { canPlay, onError }) {
  const card = video.closest('figure');
  const caption = card.querySelector('figcaption');
  const title = caption.querySelector('h6');
  if (!title.id) title.id = `preview-title-${++nextLabel}`;
  card.insertBefore(caption, video);
  video.controls = false;

  const controls = document.createElement('div');
  controls.className = 'ego-controls ego-preview-controls';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-labelledby', title.id);
  controls.innerHTML = '<button type="button" data-preview-play aria-label="播放演示">播放</button><input data-preview-scrub type="range" min="0" max="0" step="0.01" value="0" disabled><output data-preview-time>00.0 / --.- s</output><button type="button" data-preview-fullscreen aria-label="全屏查看处理结果">放大 ↗</button>';
  video.after(controls);
  const play = controls.querySelector('[data-preview-play]');
  const scrub = controls.querySelector('[data-preview-scrub]');
  const time = controls.querySelector('[data-preview-time]');
  const fullscreen = controls.querySelector('[data-preview-fullscreen]');
  play.setAttribute('aria-describedby', title.id);
  fullscreen.setAttribute('aria-describedby', title.id);
  scrub.setAttribute('aria-label', `${video.getAttribute('aria-label')}时间`);

  function update() {
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const position = Number.isFinite(video.currentTime) ? video.currentTime : 0;
    const playing = !video.paused && !video.ended;
    play.textContent = playing ? '暂停' : '播放';
    play.setAttribute('aria-label', playing ? '暂停演示' : '播放演示');
    play.disabled = Boolean(video.error);
    scrub.disabled = !duration || Boolean(video.error);
    scrub.max = String(duration);
    scrub.value = String(position);
    if (duration) scrub.setAttribute('aria-valuetext', `${position.toFixed(1)} 秒，共 ${duration.toFixed(1)} 秒`);
    else scrub.removeAttribute('aria-valuetext');
    time.textContent = `${position.toFixed(1).padStart(4, '0')} / ${duration ? duration.toFixed(1) : '--.-'} s`;
    fullscreen.disabled = !video.hasAttribute('src');
  }
  play.addEventListener('click', () => {
    if (!canPlay()) return;
    if (!video.paused) video.pause();
    else {
      if (video.ended) video.currentTime = 0;
      video.play().catch(error => { if (error.name !== 'AbortError') onError(error); });
    }
    update();
  });
  scrub.addEventListener('input', () => {
    if (scrub.disabled) return;
    video.pause();
    video.currentTime = Math.max(0, Math.min(video.duration, Number(scrub.value)));
    update();
  });
  fullscreen.addEventListener('click', () => {
    if (card.requestFullscreen) card.requestFullscreen()?.catch(() => {});
    else video.webkitEnterFullscreen?.();
  });
  for (const event of ['loadstart', 'loadedmetadata', 'durationchange', 'timeupdate', 'play', 'pause', 'ended', 'emptied', 'error']) video.addEventListener(event, update);
  update();
  return controls;
}
