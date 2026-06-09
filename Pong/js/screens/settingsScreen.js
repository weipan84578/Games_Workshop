(function () {
  const SettingsScreen = {
    render(data) {
      const active = (data && data.tab) || "game";
      const settings = Pong.GameState.settings || Pong.Storage.loadSettings();
      const app = Pong.DOM.setApp(`
        <main class="screen screen-scroll settings-screen">
          <div class="screen-inner">
            <h1 class="subtitle">設定</h1>
            <div class="tab-row" role="tablist">
              <button class="tab-button ${active === "game" ? "is-active" : ""}" type="button" data-action="tabGame">遊戲設定</button>
              <button class="tab-button ${active === "audio" ? "is-active" : ""}" type="button" data-action="tabAudio">音效設定</button>
              <button class="tab-button ${active === "visual" ? "is-active" : ""}" type="button" data-action="tabVisual">視覺設定</button>
            </div>
            <section class="content-panel">
              ${SettingsScreen.section(active, settings)}
              <div class="grid-2" style="margin-top:24px;">
                ${Pong.DOM.button("重設預設值", { action: "reset" })}
                ${Pong.DOM.button("返回主選單", { action: "back" })}
              </div>
            </section>
          </div>
        </main>
      `);

      Pong.Audio.playMusic("menu_theme");
      Pong.DOM.bindClicks(app, {
        tabGame: () => SettingsScreen.render({ tab: "game" }),
        tabAudio: () => SettingsScreen.render({ tab: "audio" }),
        tabVisual: () => SettingsScreen.render({ tab: "visual" }),
        reset: () => {
          Pong.Storage.resetSettings();
          SettingsScreen.render({ tab: active });
        },
        back: () => {
          Pong.Audio.playSfx("menu_close");
          Pong.ScreenManager.show("mainMenu");
        }
      });

      SettingsScreen.bindControls(app, active);
    },

    section(active, settings) {
      if (active === "audio") {
        return `
          <div class="form-grid">
            ${SettingsScreen.rangeRow("musicVolume", "背景音樂音量", settings.musicVolume)}
            ${SettingsScreen.rangeRow("sfxVolume", "音效音量", settings.sfxVolume)}
          </div>
        `;
      }

      if (active === "visual") {
        return `
          <div class="form-grid">
            <div class="setting-row">
              <span class="setting-label">配色主題</span>
              <div class="theme-swatches">${Pong.DOM.themeSwatches(settings.theme)}</div>
            </div>
            ${SettingsScreen.switchRow("showFPS", "顯示 FPS", settings.showFPS)}
            ${SettingsScreen.switchRow("vibration", "震動回饋", settings.vibration)}
          </div>
        `;
      }

      return `
        <div class="form-grid">
          <div class="setting-row">
            <label for="targetScore">目標分數</label>
            <select class="select-input" id="targetScore">
              ${CONSTANTS.TARGET_SCORES.map((score) => `<option value="${score}" ${settings.targetScore === score ? "selected" : ""}>${score}</option>`).join("")}
            </select>
          </div>
          <div class="setting-row">
            <label for="ballSpeed">球速</label>
            <select class="select-input" id="ballSpeed">
              ${Object.keys(CONSTANTS.SPEED_MULTIPLIERS).map((speed) => `<option value="${speed}" ${settings.ballSpeed === speed ? "selected" : ""}>${Pong.DOM.speedName(speed)}</option>`).join("")}
            </select>
          </div>
        </div>
      `;
    },

    rangeRow(id, label, value) {
      return `
        <div class="setting-row">
          <label for="${id}">${label}</label>
          <div class="range-wrap">
            <input class="range-input" id="${id}" type="range" min="0" max="100" value="${Math.round(value * 100)}">
            <span id="${id}Value">${Math.round(value * 100)}%</span>
          </div>
        </div>
      `;
    },

    switchRow(id, label, checked) {
      return `
        <div class="setting-row">
          <span class="setting-label">${label}</span>
          <label class="switch">
            <input id="${id}" type="checkbox" ${checked ? "checked" : ""}>
            <span></span>
          </label>
        </div>
      `;
    },

    bindControls(app, active) {
      const update = (patch) => {
        Pong.Storage.saveSettings(Object.assign({}, Pong.GameState.settings, patch));
      };

      const targetScore = Pong.DOM.qs("#targetScore", app);
      if (targetScore) {
        targetScore.addEventListener("change", () => update({ targetScore: Number(targetScore.value) }));
      }

      const ballSpeed = Pong.DOM.qs("#ballSpeed", app);
      if (ballSpeed) {
        ballSpeed.addEventListener("change", () => update({ ballSpeed: ballSpeed.value }));
      }

      ["musicVolume", "sfxVolume"].forEach((id) => {
        const input = Pong.DOM.qs(`#${id}`, app);
        const value = Pong.DOM.qs(`#${id}Value`, app);
        if (input && value) {
          input.addEventListener("input", () => {
            value.textContent = `${input.value}%`;
            update({ [id]: Number(input.value) / 100 });
          });
        }
      });

      ["showFPS", "vibration"].forEach((id) => {
        const input = Pong.DOM.qs(`#${id}`, app);
        if (input) {
          input.addEventListener("change", () => update({ [id]: input.checked }));
        }
      });

      Pong.DOM.qsa("[data-theme-id]", app).forEach((button) => {
        button.addEventListener("click", () => {
          const theme = button.getAttribute("data-theme-id");
          update({ theme });
          Pong.Effects.scoreFlash();
          SettingsScreen.render({ tab: active });
        });
      });
    }
  };

  window.Pong = window.Pong || {};
  window.Pong.SettingsScreen = SettingsScreen;
})();
