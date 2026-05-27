import { el } from "../utils/helpers.js";

export class Toast {
  constructor(root = document.getElementById("toast-root")) {
    this.root = root;
  }

  show(message, type = "info") {
    const toast = el("div", {
      className: `toast ${type === "error" ? "is-error" : ""} ${type === "success" ? "is-success" : ""}`,
      role: "status",
      text: message
    });

    this.root.append(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    window.setTimeout(() => {
      toast.classList.remove("is-visible");
      window.setTimeout(() => toast.remove(), 320);
    }, 3200);
  }
}
