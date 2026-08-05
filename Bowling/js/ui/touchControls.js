export function attachAimGestures(element, { onAim = () => {} } = {}) {
  if (!element) return () => {};
  let previousX = null;

  const onPointerDown = (event) => {
    previousX = event.clientX;
    element.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event) => {
    if (previousX === null) return;
    const delta = event.clientX - previousX;
    previousX = event.clientX;
    if (Math.abs(delta) > 0) onAim(delta / Math.max(element.clientWidth || 600, 1));
  };
  const clear = () => { previousX = null; };

  element.addEventListener("pointerdown", onPointerDown);
  element.addEventListener("pointermove", onPointerMove);
  element.addEventListener("pointerup", clear);
  element.addEventListener("pointercancel", clear);
  element.addEventListener("pointerleave", clear);

  return () => {
    element.removeEventListener("pointerdown", onPointerDown);
    element.removeEventListener("pointermove", onPointerMove);
    element.removeEventListener("pointerup", clear);
    element.removeEventListener("pointercancel", clear);
    element.removeEventListener("pointerleave", clear);
  };
}
