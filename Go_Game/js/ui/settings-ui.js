window.GoGame = window.GoGame || {};

GoGame.SettingsUI = {
  formHtml() {
    const s = GoGame.State.settings();
    return `
      <div class="form-grid">
        <div class="field">
          <label>棋盤</label>
          <select name="boardSize">
            ${[9, 13, 19].map((n) => `<option value="${n}" ${s.boardSize === n ? "selected" : ""}>${n} x ${n}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label>AI 難度</label>
          <select name="difficulty">
            ${[1, 2, 3, 4, 5].map((n) => `<option value="${n}" ${s.difficulty === n ? "selected" : ""}>${GoGame.I18N.difficulty(n)}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label>貼目</label>
          <select name="komi">
            ${[0, 5.5, 6.5, 7.5].map((n) => `<option value="${n}" ${Number(s.komi) === n ? "selected" : ""}>${n}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label>執子</label>
          <select name="playerColor">
            <option value="1" ${s.playerColor === 1 ? "selected" : ""}>黑棋</option>
            <option value="2" ${s.playerColor === 2 ? "selected" : ""}>白棋</option>
          </select>
        </div>
        <div class="field">
          <label>規則</label>
          <select name="rules">
            <option value="japanese" ${s.rules === "japanese" ? "selected" : ""}>日式地盤</option>
            <option value="chinese" ${s.rules === "chinese" ? "selected" : ""}>中式數子</option>
          </select>
        </div>
        <div class="field">
          <label>Undo 次數</label>
          <select name="maxUndo">
            ${[1, 3, 5, 99].map((n) => `<option value="${n}" ${s.maxUndo === n ? "selected" : ""}>${n === 99 ? "不限" : n}</option>`).join("")}
          </select>
        </div>
      </div>`;
  },

  bindForm(root, rerender = false) {
    root.querySelectorAll("select[name]").forEach((el) => {
      el.onchange = () => {
        const value = el.name === "rules" ? el.value : Number(el.value);
        GoGame.State.updateSettings({ [el.name]: value });
        if (rerender) this.render();
      };
    });
  },

  render() {
    const s = GoGame.State.settings();
    document.getElementById("screen-settings").innerHTML = `
      <div class="screen-title">
        <div>
          <h2>設定</h2>
          <p>主題、棋盤、音效與輔助顯示</p>
        </div>
        <button class="btn" data-route="menu">返回</button>
      </div>
      <div class="route-body">
        <div class="settings-card panel">
          <h3>對局</h3>
          ${this.formHtml()}
        </div>
        <div class="settings-card panel">
          <h3>主題</h3>
          <div class="theme-grid">
            ${GoGame.CONFIG.THEMES.map((theme) => `
              <button class="theme-chip" data-theme="${theme}">
                <span class="swatch" style="--swatch:${this.color(theme)}"></span>${theme}${s.theme === theme ? " ✓" : ""}
              </button>`).join("")}
          </div>
        </div>
        <div class="settings-card panel">
          <h3>顯示與音效</h3>
          ${this.toggle("showCoords", "顯示座標")}
          ${this.toggle("showLastMove", "標示最後一手")}
          ${this.toggle("sound", "啟用音效與音樂")}
          <div class="field">
            <label>主音量</label>
            <input type="range" min="0" max="1" step=".05" name="masterVolume" value="${s.masterVolume}">
          </div>
          <div class="field">
            <label>音效音量</label>
            <input type="range" min="0" max="1" step=".05" name="sfxVolume" value="${s.sfxVolume}">
          </div>
          <div class="field">
            <label>音樂音量</label>
            <input type="range" min="0" max="1" step=".05" name="musicVolume" value="${s.musicVolume}">
          </div>
        </div>
      </div>`;

    const root = document.getElementById("screen-settings");
    root.querySelectorAll("[data-route]").forEach((button) => {
      button.onclick = () => GoGame.Router.show(button.dataset.route);
    });
    this.bindForm(root, true);
    root.querySelectorAll("[data-theme]").forEach((button) => {
      button.onclick = () => {
        GoGame.ThemeSwitcher.switchTheme(button.dataset.theme);
        this.render();
      };
    });
    root.querySelectorAll("input[type=checkbox]").forEach((input) => {
      input.onchange = () => {
        GoGame.State.updateSettings({ [input.name]: input.checked });
        if (input.name === "sound") {
          if (input.checked) GoGame.AudioManager.playBGM(GoGame.AudioManager.currentBGM || "menu");
          else GoGame.AudioManager.stopLoopOnly();
        }
      };
    });
    root.querySelectorAll("input[type=range]").forEach((input) => {
      input.oninput = () => GoGame.State.updateSettings({ [input.name]: Number(input.value) });
    });
  },

  toggle(name, label) {
    const s = GoGame.State.settings();
    return `<label class="toggle-row"><span>${label}</span><input type="checkbox" name="${name}" ${s[name] ? "checked" : ""}></label>`;
  },

  color(theme) {
    return {
      classic: "#8b4513",
      dark: "#e94560",
      ocean: "#00b4d8",
      sakura: "#ff69b4",
      bamboo: "#2d6a4f",
      neon: "#00ff88",
    }[theme];
  },
};
