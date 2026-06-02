export class AnimationManager {
  static pulse(element) {
    if (!element) return;
    element.style.animation = "none";
    element.offsetHeight;
    element.style.animation = "pop 160ms ease";
  }

  static shake(element) {
    if (!element) return;
    element.style.animation = "none";
    element.offsetHeight;
    element.style.animation = "shake 200ms ease";
  }
}
