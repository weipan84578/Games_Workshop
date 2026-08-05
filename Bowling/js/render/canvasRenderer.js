import { PIN_LAYOUT } from "../utils/constants.js";
import { clamp, lerp } from "../utils/helpers.js";

function roundedRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

export function createCanvasRenderer(canvas) {
  const context = canvas?.getContext?.("2d");
  const documentRef = canvas?.ownerDocument || (typeof document === "undefined" ? null : document);
  const cacheCanvas = documentRef?.createElement?.("canvas") || null;
  const cacheContext = cacheCanvas?.getContext?.("2d") || null;
  let width = 900;
  let height = 560;
  let pixelRatio = 1;

  function laneBounds(y) {
    const top = { left: width * 0.38, right: width * 0.62 };
    const bottom = { left: width * 0.13, right: width * 0.87 };
    const amount = clamp(y, 0, 1);
    return { left: lerp(top.left, bottom.left, amount), right: lerp(top.right, bottom.right, amount) };
  }

  function toScreen(position) {
    const y = height * (0.18 + clamp(position.y, 0, 1) * 0.75);
    const bounds = laneBounds(clamp(position.y, 0, 1));
    return { x: lerp(bounds.left, bounds.right, clamp(position.x, 0, 1)), y, scale: lerp(0.46, 1.05, clamp(position.y, 0, 1)) };
  }

  function drawBackground(target) {
    const sky = target.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "#b8e8fc");
    sky.addColorStop(0.48, "#e8f8ff");
    sky.addColorStop(0.49, "#c69477");
    sky.addColorStop(1, "#7b4e42");
    target.fillStyle = sky;
    target.fillRect(0, 0, width, height);

    target.fillStyle = "rgba(255,255,255,0.78)";
    for (let index = 0; index < 6; index += 1) {
      const x = width * (0.08 + index * 0.18);
      const y = height * (0.11 + (index % 2) * 0.04);
      target.beginPath();
      target.arc(x, y, 22, 0, Math.PI * 2);
      target.arc(x + 25, y + 4, 28, 0, Math.PI * 2);
      target.arc(x + 53, y, 19, 0, Math.PI * 2);
      target.fill();
    }

    target.fillStyle = "rgba(74,59,74,0.36)";
    for (let index = 0; index < 28; index += 1) {
      const x = (index / 28) * width;
      const y = height * (0.42 + (index % 3) * 0.015);
      target.beginPath();
      target.arc(x, y, 8 + (index % 4), Math.PI, 0);
      target.fill();
    }

    const lane = laneBounds(0);
    const laneEnd = laneBounds(1);
    const laneGradient = target.createLinearGradient(0, height * 0.18, 0, height * 0.96);
    laneGradient.addColorStop(0, "#fff0c7");
    laneGradient.addColorStop(0.45, "#eecb9e");
    laneGradient.addColorStop(1, "#d79a68");
    target.fillStyle = laneGradient;
    target.beginPath();
    target.moveTo(lane.left, height * 0.18);
    target.lineTo(lane.right, height * 0.18);
    target.lineTo(laneEnd.right, height * 0.96);
    target.lineTo(laneEnd.left, height * 0.96);
    target.closePath();
    target.fill();

    target.save();
    target.globalAlpha = 0.18;
    target.strokeStyle = "#8d4d38";
    target.lineWidth = 2;
    for (let index = 0; index < 11; index += 1) {
      const amount = index / 10;
      const topX = lerp(lane.left, lane.right, amount);
      const bottomX = lerp(laneEnd.left, laneEnd.right, amount);
      target.beginPath();
      target.moveTo(topX, height * 0.18);
      target.lineTo(bottomX, height * 0.96);
      target.stroke();
    }
    target.restore();

    const foulY = height * 0.77;
    target.strokeStyle = "#d53d59";
    target.lineWidth = 5;
    target.beginPath();
    target.moveTo(laneBounds(0.79).left, foulY);
    target.lineTo(laneBounds(0.79).right, foulY);
    target.stroke();

    target.fillStyle = "rgba(255,255,255,0.32)";
    for (let index = 0; index < 5; index += 1) {
      const x = width * (0.42 + index * 0.04);
      roundedRect(target, x, height * 0.43, 18, 5, 3);
      target.fill();
    }

    target.fillStyle = "rgba(74,59,74,0.18)";
    target.beginPath();
    target.ellipse(width / 2, height * 0.97, width * 0.36, height * 0.025, 0, 0, Math.PI * 2);
    target.fill();
  }

  function resize() {
    if (!canvas || !context) return { width, height, pixelRatio };
    const rect = canvas.getBoundingClientRect?.();
    width = Math.max(320, Math.round(rect?.width || canvas.clientWidth || 900));
    height = Math.max(260, Math.round(rect?.height || canvas.clientHeight || 560));
    pixelRatio = Math.min(globalThis.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    if (cacheCanvas && cacheContext) {
      cacheCanvas.width = canvas.width;
      cacheCanvas.height = canvas.height;
      cacheContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      cacheContext.clearRect(0, 0, width, height);
      drawBackground(cacheContext);
    }
    return { width, height, pixelRatio };
  }

  function drawPin(target, pin) {
    const screen = toScreen(pin);
    const size = 32 * screen.scale;
    target.save();
    target.translate(screen.x + pin.drift * width, screen.y + pin.fallProgress * 18 * screen.scale);
    target.rotate(pin.rotation || 0);
    target.globalAlpha = 1 - pin.fallProgress * 0.08;
    target.fillStyle = "rgba(74,59,74,0.2)";
    target.beginPath();
    target.ellipse(0, size * 0.55, size * 0.55, size * 0.16, 0, 0, Math.PI * 2);
    target.fill();
    target.fillStyle = "#fffaf4";
    target.beginPath();
    target.ellipse(0, 0, size * 0.42, size * 0.68, 0, 0, Math.PI * 2);
    target.fill();
    target.fillStyle = "#ee5e75";
    roundedRect(target, -size * 0.28, -size * 0.2, size * 0.56, size * 0.16, size * 0.05);
    target.fill();
    target.fillStyle = "#30303d";
    target.beginPath();
    target.arc(-size * 0.13, -size * 0.38, size * 0.045, 0, Math.PI * 2);
    target.arc(size * 0.13, -size * 0.38, size * 0.045, 0, Math.PI * 2);
    target.fill();
    target.restore();
  }

  function drawBall(target, ball) {
    const screen = toScreen(ball);
    const radius = Math.max(10, width * 0.035 * screen.scale);
    if (ball.trail?.length > 1) {
      target.save();
      target.lineCap = "round";
      ball.trail.forEach((point, index) => {
        const trailPoint = toScreen(point);
        target.globalAlpha = (index / ball.trail.length) * 0.18;
        target.fillStyle = "#ffffff";
        target.beginPath();
        target.arc(trailPoint.x, trailPoint.y, radius * 0.5, 0, Math.PI * 2);
        target.fill();
      });
      target.restore();
    }
    target.save();
    target.translate(screen.x, screen.y);
    target.rotate(ball.rotation || 0);
    target.fillStyle = "rgba(74,59,74,0.22)";
    target.beginPath();
    target.ellipse(0, radius * 0.72, radius * 1.1, radius * 0.32, 0, 0, Math.PI * 2);
    target.fill();
    const gradient = target.createRadialGradient(-radius * 0.35, -radius * 0.4, radius * 0.1, 0, 0, radius);
    gradient.addColorStop(0, "#ffecf7");
    gradient.addColorStop(0.25, "#ff72ae");
    gradient.addColorStop(1, "#c32d72");
    target.fillStyle = gradient;
    target.beginPath();
    target.arc(0, 0, radius, 0, Math.PI * 2);
    target.fill();
    target.fillStyle = "rgba(255,255,255,0.75)";
    target.beginPath();
    target.arc(-radius * 0.35, -radius * 0.38, radius * 0.18, 0, Math.PI * 2);
    target.fill();
    target.restore();
  }

  function render(physicsState, { particles, camera } = {}) {
    if (!context || !canvas) return;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);
    if (cacheCanvas) context.drawImage(cacheCanvas, 0, 0, width, height);
    else drawBackground(context);

    const transform = camera?.getTransform?.(physicsState.elapsed || 0) || { zoom: 1, offsetX: 0, offsetY: 0 };
    context.save();
    context.translate(width * transform.offsetX, height * transform.offsetY);
    context.scale(transform.zoom, transform.zoom);
    context.translate(width * (1 - transform.zoom) / (2 * transform.zoom), height * (1 - transform.zoom) / (2 * transform.zoom));
    physicsState.pins?.forEach((pin) => drawPin(context, pin));
    drawBall(context, physicsState.ball || { x: 0.5, y: 0.9 });
    context.restore();
    particles?.draw(context, width, height);
  }

  resize();
  return { resize, render, getSize: () => ({ width, height, pixelRatio }), toScreen };
}
