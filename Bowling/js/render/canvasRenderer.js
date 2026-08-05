import { clamp, lerp } from "../utils/helpers.js";

const SCENE_IMAGE_PATH = "assets/images/backgrounds/bowling-alley-realistic.png";
const BALL_PATH_LATERAL_SCALE = 0.34;
const BALL_PATH_END_Y = 0.12;

const BALL_PALETTES = Object.freeze({
  cute: ["#ffbedb", "#ec4f91", "#8d2459"],
  ocean: ["#a8f2ff", "#168fa8", "#074b6b"],
  sunset: ["#ffd0a8", "#ee674e", "#8e2e3a"],
  forest: ["#d1f6bf", "#429b67", "#19513d"],
  night: ["#d9d1ff", "#7867de", "#292257"],
});

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

/**
 * Draws the playable lane on a responsive canvas.
 * Static scenery is cached once, while the ball, pins and aim guide are drawn
 * every frame so the generated bowling-alley image never affects animation.
 */
export function createCanvasRenderer(canvas) {
  const context = canvas?.getContext?.("2d");
  const documentRef = canvas?.ownerDocument || (typeof document === "undefined" ? null : document);
  const cacheCanvas = documentRef?.createElement?.("canvas") || null;
  const cacheContext = cacheCanvas?.getContext?.("2d") || null;
  const sceneImage = documentRef?.createElement?.("img") || null;

  let width = 900;
  let height = 560;
  let pixelRatio = 1;
  let sceneLoaded = false;

  if (sceneImage) {
    sceneImage.alt = "";
    sceneImage.decoding = "async";
    sceneImage.addEventListener("load", () => {
      sceneLoaded = true;
      rebuildCache();
    });
    sceneImage.src = SCENE_IMAGE_PATH;
  }

  // The centre of the generated image is the active lane. These normalized
  // bounds keep the same perspective on desktop, tablet and mobile layouts.
  function laneBounds(depth) {
    const amount = clamp(depth, 0, 1);
    return {
      left: lerp(width * 0.405, width * 0.21, amount),
      right: lerp(width * 0.595, width * 0.79, amount),
    };
  }

  function toScreen(position = { x: 0.5, y: 0.9 }) {
    const depth = clamp(position.y, 0, 1);
    const y = height * (0.2 + depth * 0.72);
    const bounds = laneBounds(depth);
    return {
      x: lerp(bounds.left, bounds.right, clamp(position.x, 0, 1)),
      y,
      scale: lerp(0.42, 1.08, depth),
    };
  }

  function drawCoverImage(target, image) {
    const imageRatio = image.naturalWidth / image.naturalHeight;
    const canvasRatio = width / height;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = image.naturalWidth;
    let sourceHeight = image.naturalHeight;

    if (imageRatio > canvasRatio) {
      sourceWidth = image.naturalHeight * canvasRatio;
      sourceX = (image.naturalWidth - sourceWidth) / 2;
    } else if (imageRatio < canvasRatio) {
      sourceHeight = image.naturalWidth / canvasRatio;
      sourceY = (image.naturalHeight - sourceHeight) / 2;
    }

    target.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
  }

  function drawProceduralFallback(target) {
    // This fallback keeps the game usable if the image is still loading or
    // unavailable in an offline browser.
    const backdrop = target.createLinearGradient(0, 0, 0, height);
    backdrop.addColorStop(0, "#071321");
    backdrop.addColorStop(0.48, "#153d52");
    backdrop.addColorStop(0.49, "#5d3b2c");
    backdrop.addColorStop(1, "#1b1118");
    target.fillStyle = backdrop;
    target.fillRect(0, 0, width, height);

    target.fillStyle = "rgba(18, 104, 128, 0.35)";
    for (let index = 0; index < 8; index += 1) {
      target.fillRect(width * (0.04 + index * 0.13), height * 0.16, width * 0.045, height * 0.28);
    }

    const lane = laneBounds(0);
    const laneEnd = laneBounds(1);
    const wood = target.createLinearGradient(0, height * 0.2, 0, height);
    wood.addColorStop(0, "#d7a15e");
    wood.addColorStop(0.45, "#e9bd78");
    wood.addColorStop(1, "#8f5636");
    target.fillStyle = wood;
    target.beginPath();
    target.moveTo(lane.left, height * 0.2);
    target.lineTo(lane.right, height * 0.2);
    target.lineTo(laneEnd.right, height * 0.98);
    target.lineTo(laneEnd.left, height * 0.98);
    target.closePath();
    target.fill();
  }

  function drawLaneDetails(target) {
    const nearLane = laneBounds(1);
    const farLane = laneBounds(0);

    // A translucent glaze links the generated image to the live game objects.
    target.fillStyle = "rgba(255, 191, 88, 0.08)";
    target.beginPath();
    target.moveTo(farLane.left, height * 0.2);
    target.lineTo(farLane.right, height * 0.2);
    target.lineTo(nearLane.right, height * 0.98);
    target.lineTo(nearLane.left, height * 0.98);
    target.closePath();
    target.fill();

    // Real lane boards and approach dots make the perspective readable.
    target.save();
    target.globalAlpha = 0.22;
    target.strokeStyle = "#fff1c7";
    target.lineWidth = Math.max(1, width * 0.0015);
    for (let index = 1; index < 15; index += 1) {
      const amount = index / 15;
      target.beginPath();
      target.moveTo(lerp(farLane.left, farLane.right, amount), height * 0.2);
      target.lineTo(lerp(nearLane.left, nearLane.right, amount), height * 0.98);
      target.stroke();
    }
    target.restore();

    const foulDepth = 0.78;
    const foulBounds = laneBounds(foulDepth);
    target.strokeStyle = "#e85b63";
    target.lineWidth = Math.max(2, width * 0.004);
    target.beginPath();
    target.moveTo(foulBounds.left, height * (0.2 + foulDepth * 0.72));
    target.lineTo(foulBounds.right, height * (0.2 + foulDepth * 0.72));
    target.stroke();

    // Lane targeting arrows: useful for play, subtle enough to preserve realism.
    target.fillStyle = "rgba(255, 246, 211, 0.72)";
    for (let index = -2; index <= 2; index += 1) {
      const depth = 0.52;
      const bounds = laneBounds(depth);
      const x = width / 2 + index * width * 0.035;
      const y = height * (0.2 + depth * 0.72);
      target.beginPath();
      target.moveTo(x, y + 10);
      target.lineTo(x - 6, y - 5);
      target.lineTo(x + 6, y - 5);
      target.closePath();
      target.fill();
      if (x < bounds.left || x > bounds.right) target.globalAlpha = 0.35;
    }
    target.globalAlpha = 1;

    // A soft vignette hides the image crop edges on narrow screens.
    const vignette = target.createRadialGradient(width / 2, height * 0.56, height * 0.1, width / 2, height * 0.56, width * 0.76);
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(1, "rgba(3, 10, 20, 0.38)");
    target.fillStyle = vignette;
    target.fillRect(0, 0, width, height);
  }

  function drawBackground(target) {
    if (sceneLoaded && sceneImage?.naturalWidth) drawCoverImage(target, sceneImage);
    else drawProceduralFallback(target);
    drawLaneDetails(target);
  }

  function rebuildCache() {
    if (!cacheCanvas || !cacheContext) return;
    cacheContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    cacheContext.clearRect(0, 0, width, height);
    drawBackground(cacheContext);
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
    }
    rebuildCache();
    return { width, height, pixelRatio };
  }

  function drawPinShape(target, size) {
    target.beginPath();
    target.moveTo(0, -size * 0.82);
    target.bezierCurveTo(size * 0.2, -size * 0.84, size * 0.24, -size * 0.59, size * 0.18, -size * 0.42);
    target.bezierCurveTo(size * 0.15, -size * 0.29, size * 0.42, -size * 0.18, size * 0.47, size * 0.2);
    target.bezierCurveTo(size * 0.52, size * 0.57, size * 0.3, size * 0.78, 0, size * 0.82);
    target.bezierCurveTo(-size * 0.3, size * 0.78, -size * 0.52, size * 0.57, -size * 0.47, size * 0.2);
    target.bezierCurveTo(-size * 0.42, -size * 0.18, -size * 0.15, -size * 0.29, -size * 0.18, -size * 0.42);
    target.bezierCurveTo(-size * 0.24, -size * 0.59, -size * 0.2, -size * 0.84, 0, -size * 0.82);
    target.closePath();
  }

  function drawPin(target, pin) {
    const screen = toScreen(pin);
    const size = 28 * screen.scale;
    const fall = pin.fallProgress || 0;
    target.save();
    target.translate(screen.x + (pin.drift || 0) * width, screen.y + fall * size * 0.9);
    target.rotate(pin.rotation || 0);
    target.globalAlpha = 1 - fall * 0.12;

    target.fillStyle = "rgba(0, 0, 0, 0.38)";
    target.beginPath();
    target.ellipse(0, size * 0.82, size * 0.55, size * 0.16, 0, 0, Math.PI * 2);
    target.fill();

    const body = target.createLinearGradient(-size, 0, size, 0);
    body.addColorStop(0, "#b9c8cc");
    body.addColorStop(0.22, "#ffffff");
    body.addColorStop(0.64, "#fffdf8");
    body.addColorStop(1, "#9eabb3");
    drawPinShape(target, size);
    target.fillStyle = body;
    target.fill();

    // Clip the red neck bands to the curved pin body.
    target.save();
    drawPinShape(target, size);
    target.clip();
    target.fillStyle = "#d93443";
    target.fillRect(-size * 0.3, -size * 0.48, size * 0.6, size * 0.1);
    target.fillRect(-size * 0.28, -size * 0.33, size * 0.56, size * 0.085);
    target.restore();

    target.fillStyle = "rgba(255, 255, 255, 0.8)";
    target.beginPath();
    target.ellipse(-size * 0.18, -size * 0.56, size * 0.08, size * 0.16, -0.4, 0, Math.PI * 2);
    target.fill();
    target.restore();
  }

  function getBallPalette() {
    const theme = documentRef?.body?.dataset?.theme || "cute";
    return BALL_PALETTES[theme] || BALL_PALETTES.cute;
  }

  function drawBall(target, ball) {
    const screen = toScreen(ball);
    const radius = Math.max(10, width * 0.032 * screen.scale);
    const palette = getBallPalette();

    if (ball.trail?.length > 1) {
      target.save();
      target.lineCap = "round";
      ball.trail.forEach((point, index) => {
        const trailPoint = toScreen(point);
        target.globalAlpha = (index / ball.trail.length) * 0.18;
        target.fillStyle = palette[1];
        target.beginPath();
        target.arc(trailPoint.x, trailPoint.y, radius * 0.45, 0, Math.PI * 2);
        target.fill();
      });
      target.restore();
    }

    target.save();
    target.translate(screen.x, screen.y);
    target.rotate(ball.rotation || 0);
    target.fillStyle = "rgba(0, 0, 0, 0.45)";
    target.beginPath();
    target.ellipse(0, radius * 0.84, radius * 1.16, radius * 0.3, 0, 0, Math.PI * 2);
    target.fill();

    const ballGradient = target.createRadialGradient(-radius * 0.4, -radius * 0.5, radius * 0.08, 0, 0, radius * 1.05);
    ballGradient.addColorStop(0, palette[0]);
    ballGradient.addColorStop(0.28, palette[1]);
    ballGradient.addColorStop(1, palette[2]);
    target.fillStyle = ballGradient;
    target.beginPath();
    target.arc(0, 0, radius, 0, Math.PI * 2);
    target.fill();

    // Three small finger holes sell the ball as a real bowling ball.
    target.fillStyle = "rgba(8, 11, 25, 0.48)";
    [-0.22, 0, 0.22].forEach((offset, index) => {
      target.beginPath();
      target.arc(offset * radius * 2.1, -radius * (0.18 + (index === 1 ? 0.12 : 0)), radius * 0.1, 0, Math.PI * 2);
      target.fill();
    });
    target.fillStyle = "rgba(255, 255, 255, 0.78)";
    target.beginPath();
    target.ellipse(-radius * 0.4, -radius * 0.47, radius * 0.16, radius * 0.3, -0.4, 0, Math.PI * 2);
    target.fill();
    target.restore();
  }

  function drawAimGuide(target, aim = {}) {
    const safeAngle = clamp(Number(aim.angle) || 0, -1, 1);
    const safePower = clamp(Number(aim.power) || 0, 0, 1);
    const start = toScreen({ x: 0.5, y: 0.9 });
    const end = toScreen({ x: 0.5 + safeAngle * BALL_PATH_LATERAL_SCALE, y: BALL_PATH_END_Y });
    target.save();
    target.strokeStyle = "rgba(255, 237, 170, 0.72)";
    target.lineWidth = Math.max(2, width * 0.0025);
    target.setLineDash([8, 10]);
    target.beginPath();
    target.moveTo(start.x, start.y - 6);
    target.lineTo(end.x, end.y + 8);
    target.stroke();
    target.setLineDash([]);
    target.strokeStyle = "rgba(255, 255, 255, 0.9)";
    target.lineWidth = 3;
    target.beginPath();
    target.arc(start.x, start.y, 13 + safePower * 8, 0, Math.PI * 2);
    target.stroke();
    target.restore();
  }

  function render(physicsState, { particles, camera, aim } = {}) {
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
    if (physicsState.phase === "ready") drawAimGuide(context, aim);
    physicsState.pins?.forEach((pin) => drawPin(context, pin));
    drawBall(context, physicsState.ball || { x: 0.5, y: 0.9 });
    context.restore();
    particles?.draw(context, width, height);
  }

  resize();
  return { resize, render, getSize: () => ({ width, height, pixelRatio }), toScreen };
}
