(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  const LevelSelect = {
    open(game) {
      game.modal.open({
        title: "關卡選擇",
        body: `
          <div class="level-grid">
            ${Array.from({ length: 25 }, (_, index) => {
              const stage = index + 1;
              return `<button class="level-button" data-stage="${stage}">${stage}</button>`;
            }).join("")}
          </div>
        `,
        afterOpen: (content) => {
          content.querySelectorAll("[data-stage]").forEach((button) => {
            button.addEventListener("click", () => {
              game.modal.close();
              game.startAtStage(Number(button.dataset.stage));
            });
          });
        }
      });
    }
  };

  root.LevelSelect = LevelSelect;
}());
