export class DragController {
  constructor(canvas, engine, options = {}) {
    this.canvas = canvas;
    this.engine = engine;
    this.onInteraction = options.onInteraction;
    this.pointerType = "mouse";
    this.activePointerId = null;

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
  }

  attach() {
    this.canvas.addEventListener("pointerdown", this.handlePointerDown);
    this.canvas.addEventListener("pointermove", this.handlePointerMove);
    this.canvas.addEventListener("pointerup", this.handlePointerUp);
    this.canvas.addEventListener("pointercancel", this.handlePointerUp);
  }

  destroy() {
    this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.canvas.removeEventListener("pointermove", this.handlePointerMove);
    this.canvas.removeEventListener("pointerup", this.handlePointerUp);
    this.canvas.removeEventListener("pointercancel", this.handlePointerUp);
  }

  handlePointerDown(event) {
    const point = this.getPoint(event);
    const piece = this.engine.pick(point.x, point.y);
    if (!piece) return;

    this.pointerType = event.pointerType || "mouse";
    this.activePointerId = event.pointerId;
    this.canvas.setPointerCapture?.(event.pointerId);
    this.onInteraction?.();
    event.preventDefault();
  }

  handlePointerMove(event) {
    if (this.activePointerId !== event.pointerId) return;
    const point = this.getPoint(event);
    this.engine.dragTo(point.x, point.y);
    event.preventDefault();
  }

  handlePointerUp(event) {
    if (this.activePointerId !== event.pointerId) return;
    this.engine.drop(this.pointerType);
    this.activePointerId = null;
    this.canvas.releasePointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  getPoint(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.engine.boardSize / rect.width;
    const scaleY = this.engine.boardSize / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }
}
