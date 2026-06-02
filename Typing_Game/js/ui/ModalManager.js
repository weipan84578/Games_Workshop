export class ModalManager {
  constructor(overlay, audio) {
    this.overlay = overlay;
    this.audio = audio;
    this.resolve = null;
  }

  open({ title = "", body = "", actions = [] }) {
    this.close(null, false);
    this.overlay.classList.add("is-open");
    this.overlay.setAttribute("aria-hidden", "false");

    const modal = document.createElement("section");
    modal.className = "modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    const bodyNode = body instanceof HTMLElement ? body : document.createElement("div");
    if (!(body instanceof HTMLElement)) {
      bodyNode.innerHTML = body;
    }

    modal.innerHTML = `
      <header class="modal-header">
        <h2 class="section-title">${title}</h2>
        <button class="modal-close" type="button" aria-label="關閉">x</button>
      </header>
    `;
    const content = document.createElement("div");
    content.className = "modal-body";
    content.append(bodyNode);

    const footer = document.createElement("footer");
    footer.className = "modal-footer";
    for (const action of actions) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = action.className ?? "btn";
      button.textContent = action.label;
      button.dataset.action = action.value;
      button.disabled = Boolean(action.disabled);
      footer.append(button);
    }

    modal.append(content, footer);
    this.overlay.append(modal);

    modal.querySelector(".modal-close").addEventListener("click", () => this.close(null));
    footer.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");
      if (!button) return;
      this.audio?.playSfx("buttonClick");
      this.close(button.dataset.action);
    });
    this.overlay.addEventListener("click", this.handleBackdrop);
    document.addEventListener("keydown", this.handleEscape);
    modal.querySelector("button:not(:disabled)")?.focus();

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  handleBackdrop = (event) => {
    if (event.target === this.overlay) {
      this.close(null);
    }
  };

  handleEscape = (event) => {
    if (event.key === "Escape") {
      this.close(null);
    }
  };

  close(value = null, shouldResolve = true) {
    document.removeEventListener("keydown", this.handleEscape);
    this.overlay.removeEventListener("click", this.handleBackdrop);
    this.overlay.classList.remove("is-open");
    this.overlay.setAttribute("aria-hidden", "true");
    this.overlay.innerHTML = "";
    if (shouldResolve && this.resolve) {
      const resolve = this.resolve;
      this.resolve = null;
      resolve(value);
    }
  }
}
