import { el, makeButton } from "../utils/helpers.js";

export class Modal {
  constructor({ title, onClose }) {
    this.onClose = onClose;
    this.backdrop = el("div", {
      className: "modal-backdrop",
      role: "presentation",
      on: {
        pointerdown: (event) => {
          if (event.target === this.backdrop) this.close();
        }
      }
    });

    this.modal = el("section", {
      className: "modal",
      role: "dialog",
      attrs: { "aria-modal": "true", "aria-label": title }
    });

    this.titleEl = el("h2", { text: title });
    this.closeButton = makeButton("×", {
      ariaLabel: "關閉",
      on: { click: () => this.close() }
    });
    this.closeButton.classList.add("btn-icon");

    this.body = el("div", { className: "modal-body" });
    this.footer = el("div", { className: "modal-footer" });
    this.modal.append(
      el("header", { className: "modal-header" }, [this.titleEl, this.closeButton]),
      this.body,
      this.footer
    );
    this.backdrop.append(this.modal);

    this.handleKeyDown = (event) => {
      if (event.key === "Escape") this.close();
    };
  }

  open() {
    document.body.append(this.backdrop);
    document.addEventListener("keydown", this.handleKeyDown);
    this.closeButton.focus();
  }

  setTitle(title) {
    this.titleEl.textContent = title;
    this.modal.setAttribute("aria-label", title);
  }

  setBody(...children) {
    this.body.replaceChildren(...children);
  }

  setFooter(...children) {
    this.footer.replaceChildren(...children);
  }

  close() {
    document.removeEventListener("keydown", this.handleKeyDown);
    this.backdrop.remove();
    this.onClose?.();
  }
}
