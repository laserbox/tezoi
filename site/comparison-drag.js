// Keep the range's keyboard/ARIA semantics, but map pointer motion directly to
// the image bounds instead of the browser's native range-thumb drag threshold.
export function bindComparisonDrag(input) {
  const surface = input.parentElement;
  // The input stays focusable, but cannot compete for native touch gestures.
  input.style.pointerEvents = 'none';
  surface.style.touchAction = 'pan-y';
  let gesture;
  const update = (clientX) => {
    if (input.disabled) return;
    const bounds = input.getBoundingClientRect();
    if (!bounds.width) return;
    const min = Number(input.min) || 0;
    const max = Number(input.max) || 100;
    const step = Number(input.step) || 1;
    const ratio = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width));
    const value = Math.max(min, Math.min(max, min + Math.round(ratio * (max - min) / step) * step));
    if (Number(input.value) === value) return;
    input.value = String(value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };
  surface.addEventListener('pointerdown', event => {
    if (input.disabled || !event.isPrimary || event.button !== 0) return;
    if (event.target.closest('button, a, input, select, textarea, [contenteditable="true"]')) return;
    // Suppress image dragging/selection. pan-y still lets a vertical gesture
    // scroll the page; the browser then cancels this pointer sequence.
    event.preventDefault();
    input.focus({ preventScroll: true });
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY,
      value: input.value, moved: false, axis: event.pointerType === 'mouse' ? 'horizontal' : null };
    surface.setPointerCapture(event.pointerId);
    if (gesture.axis) update(event.clientX);
  });
  surface.addEventListener('pointermove', event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    if (!gesture.axis) {
      const dx = Math.abs(event.clientX - gesture.x);
      const dy = Math.abs(event.clientY - gesture.y);
      if (Math.max(dx, dy) < 2) return;
      gesture.moved = true;
      // Do not lock a small initial vertical wobble. Let the browser decide
      // when it is a page scroll, or claim it once horizontal intent is clear.
      if (dx >= dy) gesture.axis = 'horizontal';
    }
    if (gesture.axis === 'horizontal') update(event.clientX);
  });
  surface.addEventListener('pointerup', event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    if (gesture.axis === 'horizontal' || !gesture.moved) update(event.clientX);
    const changed = input.value !== gesture.value;
    gesture = null;
    if (surface.hasPointerCapture(event.pointerId)) surface.releasePointerCapture(event.pointerId);
    if (changed) input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  const cancel = () => { gesture = null; };
  surface.addEventListener('pointercancel', cancel);
  surface.addEventListener('lostpointercapture', cancel);
}
