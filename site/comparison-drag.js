// Keep the range's keyboard/ARIA semantics, but map pointer motion directly to
// the image bounds instead of the browser's native range-thumb drag threshold.
export function bindComparisonDrag(input) {
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
  input.addEventListener('pointerdown', event => {
    if (input.disabled || !event.isPrimary || event.button !== 0) return;
    // Prevent native range handling from competing with these coordinates.
    // CSS touch-action: pan-y still lets a vertical gesture scroll the page.
    event.preventDefault();
    input.focus({ preventScroll: true });
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY,
      value: input.value, axis: event.pointerType === 'mouse' ? 'horizontal' : null };
    input.setPointerCapture(event.pointerId);
    if (gesture.axis) update(event.clientX);
  });
  input.addEventListener('pointermove', event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    if (!gesture.axis) {
      const dx = Math.abs(event.clientX - gesture.x);
      const dy = Math.abs(event.clientY - gesture.y);
      if (Math.max(dx, dy) < 2) return;
      gesture.axis = dx >= dy ? 'horizontal' : 'vertical';
    }
    if (gesture.axis === 'horizontal') update(event.clientX);
  });
  input.addEventListener('pointerup', event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    if (gesture.axis !== 'vertical') update(event.clientX);
    const changed = input.value !== gesture.value;
    gesture = null;
    if (input.hasPointerCapture(event.pointerId)) input.releasePointerCapture(event.pointerId);
    if (changed) input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  const cancel = () => { gesture = null; };
  input.addEventListener('pointercancel', cancel);
  input.addEventListener('lostpointercapture', cancel);
}
