// Paint the native timeline's current value; playback and seeking remain with its controller.
export function paintPlaybackProgress(input) {
  const min = Number(input.min) || 0;
  const max = Number(input.max);
  const value = Number(input.value);
  const fraction = Number.isFinite(value) && Number.isFinite(max) && max > min
    ? Math.min(1, Math.max(0, (value - min) / (max - min))) : 0;
  input.style.setProperty('--playback-progress', `${fraction * 100}%`);
}
