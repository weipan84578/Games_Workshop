export function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

export function formatPercent(value) {
  return `${Math.round(clamp(Number(value) || 0) * 100)}%`;
}

export function qs(selector, root = document) {
  return root.querySelector(selector);
}

export function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

export function createIcon(name, alt = "", className = "") {
  const image = document.createElement("img");
  image.src = `assets/images/icons/icon-${name}.svg`;
  image.alt = alt;
  if (className) image.className = className;
  return image;
}

export function setText(element, value) {
  if (element) element.textContent = value;
}

export function announce(message, root = document) {
  const liveRegion = root.querySelector("#live-region");
  if (!liveRegion) return;
  liveRegion.textContent = "";
  requestAnimationFrame(() => {
    liveRegion.textContent = message;
  });
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}
