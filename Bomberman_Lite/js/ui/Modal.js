(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  class Modal {
    constructor() {
      this.overlay = document.getElementById("modal-overlay");
      this.content = document.getElementById("modal-content");
      this.onClose = null;
      this.overlay.addEventListener("click", () => this.close());
      window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !this.content.classList.contains("hidden")) this.close();
      });
    }

    open(options) {
      this.onClose = options.onClose || null;
      const actions = options.actions || [{ label: "關閉", action: () => this.close(), className: "btn-secondary" }];
      this.content.innerHTML = `
        <div class="modal-head">
          <h2 class="modal-title">${options.title}</h2>
          <button class="icon-btn" data-modal-close title="關閉">×</button>
        </div>
        <div class="modal-body">${options.body || ""}</div>
        <div class="modal-actions"></div>
      `;
      const actionHost = this.content.querySelector(".modal-actions");
      actions.forEach((action) => {
        const button = document.createElement("button");
        button.className = action.className || "btn-secondary";
        button.textContent = action.label;
        button.addEventListener("click", () => action.action && action.action());
        actionHost.appendChild(button);
      });
      this.content.querySelector("[data-modal-close]").addEventListener("click", () => this.close());
      this.overlay.classList.remove("hidden");
      this.content.classList.remove("hidden");
      if (options.afterOpen) options.afterOpen(this.content);
    }

    close() {
      this.overlay.classList.add("hidden");
      this.content.classList.add("hidden");
      this.content.innerHTML = "";
      const callback = this.onClose;
      this.onClose = null;
      if (callback) callback();
    }

    confirm(message, onConfirm) {
      this.open({
        title: "確認",
        body: `<p>${message}</p>`,
        actions: [
          { label: "取消", className: "btn-secondary", action: () => this.close() },
          {
            label: "確定",
            className: "btn-primary",
            action: () => {
              this.close();
              onConfirm();
            }
          }
        ]
      });
    }

    howTo() {
      const pages = [
        {
          tab: "操作",
          html: `
            <div class="modal-grid two">
              <div>
                <h3>鍵盤</h3>
                <p>方向鍵 / WASD 移動</p>
                <p>Space / Z 放置炸彈</p>
                <p>Esc / P 暫停遊戲</p>
              </div>
              <div>
                <h3>行動裝置</h3>
                <p>左側搖桿移動</p>
                <p>右側 B 鈕放置炸彈</p>
                <p>右側暫停鈕開啟選單</p>
              </div>
            </div>`
        },
        {
          tab: "規則",
          html: `
            <p>使用炸彈消滅敵人，炸毀軟牆尋找出口。硬牆不可破壞，炸彈火焰會向上下左右延伸。</p>
            <p>敵人全滅後進入出口即可過關。第 25 關需要擊倒 Boss。</p>`
        },
        {
          tab: "道具",
          html: `
            <table class="info-table">
              <tr><th>圖示</th><th>名稱</th><th>效果</th></tr>
              ${Object.keys(root.POWERUPS).map((key) => {
                const item = root.POWERUPS[key];
                return `<tr><td>${item.icon}</td><td>${item.label}</td><td>${powerupText(key)}</td></tr>`;
              }).join("")}
            </table>`
        },
        {
          tab: "敵人",
          html: `
            <table class="info-table">
              <tr><th>名稱</th><th>特色</th><th>出現</th></tr>
              <tr><td>Balloom</td><td>隨機移動</td><td>1+</td></tr>
              <tr><td>Oneal</td><td>追蹤玩家</td><td>3+</td></tr>
              <tr><td>Doll</td><td>會避開危險</td><td>7+</td></tr>
              <tr><td>Minvo</td><td>快速尋路</td><td>11+</td></tr>
              <tr><td>Kondoria</td><td>穿牆移動</td><td>16+</td></tr>
              <tr><td>Ovape</td><td>高速穿牆</td><td>20+</td></tr>
              <tr><td>Daemon</td><td>五段生命 Boss</td><td>25</td></tr>
            </table>`
        }
      ];

      this.open({
        title: "說明",
        body: `
          <div class="tab-row">
            ${pages.map((page, index) => `<button class="tab-button ${index === 0 ? "active" : ""}" data-tab="${index}">${page.tab}</button>`).join("")}
          </div>
          <div data-tab-panel>${pages[0].html}</div>
        `,
        afterOpen: (content) => {
          const panel = content.querySelector("[data-tab-panel]");
          content.querySelectorAll("[data-tab]").forEach((button) => {
            button.addEventListener("click", () => {
              content.querySelectorAll("[data-tab]").forEach((item) => item.classList.remove("active"));
              button.classList.add("active");
              panel.innerHTML = pages[Number(button.dataset.tab)].html;
            });
          });
        }
      });
    }
  }

  function powerupText(key) {
    const map = {
      bomb: "最大同時炸彈數 +1",
      fire: "爆炸範圍 +1",
      speed: "移動速度提升",
      shield: "免疫一次傷害",
      time: "倒數時間 +30 秒",
      pierce: "爆炸可穿透軟牆",
      life: "生命 +1",
      remote: "手動引爆炸彈"
    };
    return map[key] || "";
  }

  root.Modal = Modal;
}());
