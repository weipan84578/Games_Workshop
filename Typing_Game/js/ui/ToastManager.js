export class ToastManager {
  constructor(container) {
    this.container = container;
  }

  show(message, type = "info", timeout = 2800) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    this.container.append(toast);
    window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      window.setTimeout(() => toast.remove(), 180);
    }, timeout);
  }
}
