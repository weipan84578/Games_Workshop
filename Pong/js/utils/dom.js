(function () {
  const DOM = {
    app() {
      return document.getElementById("app");
    },

    qs(selector, parent) {
      return (parent || document).querySelector(selector);
    },

    qsa(selector, parent) {
      return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
    },

    html(strings) {
      return strings;
    },

    setApp(html) {
      const current = DOM.app();
      const fresh = current.cloneNode(false);
      fresh.id = "app";
      fresh.innerHTML = html;
      current.replaceWith(fresh);
      return fresh;
    },

    button(label, options) {
      const opts = options || {};
      const disabled = opts.disabled ? " disabled" : "";
      const data = opts.action ? ` data-action="${opts.action}"` : "";
      const title = opts.title ? ` title="${opts.title}" aria-label="${opts.title}"` : "";
      const extra = opts.className ? ` ${opts.className}` : "";
      return `<button class="game-button${extra}" type="button"${data}${title}${disabled}>${label}</button>`;
    },

    bindClicks(root, handlers) {
      root.addEventListener("click", (event) => {
        const target = event.target.closest("[data-action]");
        if (!target || !root.contains(target) || target.disabled) {
          return;
        }

        const action = target.getAttribute("data-action");
        if (handlers[action]) {
          Pong.Audio.unlock();
          Pong.Audio.playSfx("button_click");
          handlers[action](event, target);
        }
      });

      root.addEventListener("mouseover", (event) => {
        const target = event.target.closest("button");
        if (target && !target.disabled && root.contains(target)) {
          Pong.Audio.playSfx("button_hover", 0.35);
        }
      });
    },

    themeDots(selectedTheme) {
      return CONSTANTS.THEMES.map((theme) => {
        const active = theme.id === selectedTheme ? " is-active" : "";
        return `<button class="theme-dot${active}" type="button" style="--swatch-primary:${theme.primary};--swatch-secondary:${theme.secondary}" data-theme-id="${theme.id}" title="${theme.name}" aria-label="${theme.name}"></button>`;
      }).join("");
    },

    themeSwatches(selectedTheme) {
      return CONSTANTS.THEMES.map((theme) => {
        const active = theme.id === selectedTheme ? " is-active" : "";
        return `<button class="theme-swatch${active}" type="button" style="--swatch-primary:${theme.primary};--swatch-secondary:${theme.secondary}" data-theme-id="${theme.id}" title="${theme.name}" aria-label="${theme.name}"></button>`;
      }).join("");
    },

    difficultyName(value) {
      return CONSTANTS.DIFFICULTY_LABELS[value] || value;
    },

    speedName(value) {
      return CONSTANTS.BALL_SPEED_LABELS[value] || value;
    }
  };

  window.Pong = window.Pong || {};
  window.Pong.DOM = DOM;
})();
