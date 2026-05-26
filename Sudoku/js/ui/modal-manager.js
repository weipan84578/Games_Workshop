(function (global) {
  "use strict";

  let root = null;
  let titleNode = null;
  let bodyNode = null;
  let actionsNode = null;

  function close() {
    if (!root) {
      return;
    }
    root.hidden = true;
    titleNode.textContent = "";
    bodyNode.textContent = "";
    actionsNode.replaceChildren();
  }

  function createAction(action) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = action.className || "btn btn-secondary";
    button.textContent = action.label;
    button.addEventListener("click", () => {
      if (action.onClick) {
        action.onClick();
      }
      if (action.autoClose !== false) {
        close();
      }
    });
    return button;
  }

  function open(options) {
    if (!root) {
      return;
    }

    titleNode.textContent = options.title || "";
    if (options.html) {
      bodyNode.innerHTML = options.html;
    } else {
      bodyNode.textContent = options.body || "";
    }

    actionsNode.replaceChildren(...(options.actions || []).map(createAction));
    root.hidden = false;

    const firstButton = actionsNode.querySelector("button");
    if (firstButton) {
      firstButton.focus();
    }
  }

  global.ModalManager = {
    init() {
      root = document.getElementById("modal-root");
      titleNode = document.getElementById("modal-title");
      bodyNode = document.getElementById("modal-body");
      actionsNode = document.getElementById("modal-actions");

      root.addEventListener("click", (event) => {
        if (event.target.matches("[data-modal-close]")) {
          close();
        }
      });
    },
    open,
    close,
    isOpen() {
      return root && !root.hidden;
    },
  };
})(window);
