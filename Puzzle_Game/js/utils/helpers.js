export function $(selector, root = document) {
  return root.querySelector(selector);
}

export function el(tagName, options = {}, children = []) {
  const node = document.createElement(tagName);

  if (options.className) node.className = options.className;
  if (options.text) node.textContent = options.text;
  if (options.html) node.innerHTML = options.html;
  if (options.type) node.type = options.type;
  if (options.value !== undefined) node.value = options.value;
  if (options.disabled !== undefined) node.disabled = options.disabled;
  if (options.ariaLabel) node.setAttribute("aria-label", options.ariaLabel);
  if (options.title) node.title = options.title;
  if (options.role) node.setAttribute("role", options.role);
  if (options.id) node.id = options.id;

  if (options.dataset) {
    Object.entries(options.dataset).forEach(([key, value]) => {
      node.dataset[key] = value;
    });
  }

  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      if (value !== null && value !== undefined) node.setAttribute(key, value);
    });
  }

  if (options.on) {
    Object.entries(options.on).forEach(([eventName, handler]) => {
      node.addEventListener(eventName, handler);
    });
  }

  const normalizedChildren = Array.isArray(children) ? children : [children];
  normalizedChildren
    .filter((child) => child !== null && child !== undefined)
    .forEach((child) => {
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    });

  return node;
}

export function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function getDifficultyById(difficulties, id) {
  return difficulties.find((difficulty) => difficulty.id === id) || difficulties[1];
}

export function copyCanvas(source) {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(source, 0, 0);
  return canvas;
}

export function drawCanvasPreview(source, target) {
  const ctx = target.getContext("2d");
  target.width = target.clientWidth || 320;
  target.height = target.clientHeight || target.width;
  ctx.clearRect(0, 0, target.width, target.height);
  ctx.drawImage(source, 0, 0, target.width, target.height);
}

export function makeButton(label, options = {}) {
  const classes = ["btn", options.variant ? `btn-${options.variant}` : ""].filter(Boolean).join(" ");
  return el("button", {
    className: classes,
    type: "button",
    ariaLabel: options.ariaLabel || label,
    disabled: options.disabled,
    on: options.on
  }, label);
}
