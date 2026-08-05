import { clamp, lerp } from "../utils/helpers.js";

export function createCameraController() {
  let shake = 0;
  let zoom = 1;

  return {
    resize() {
      zoom = 1;
    },
    update(deltaSeconds, intensity = 0) {
      const decay = Math.max(0, 1 - deltaSeconds * 8);
      shake = Math.max(shake * decay, intensity);
    },
    triggerShake(amount = 0.02) {
      shake = Math.max(shake, clamp(amount, 0, 0.12));
    },
    getTransform(time = 0) {
      return {
        zoom: lerp(zoom, 1 + shake * 0.2, 0.35),
        offsetX: Math.sin(time * 42) * shake,
        offsetY: Math.cos(time * 37) * shake,
      };
    },
  };
}
