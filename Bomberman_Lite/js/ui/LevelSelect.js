(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  const LevelSelect = {
    open(game) {
      const scores = root.SaveManager.getScores();
      const save = root.SaveManager.getGame();
      const unlocked = Math.max(1, scores.bestStage + 1, save ? save.stage : 1);
      game.modal.open({
        title: "關卡選擇",
        body: `
          <div class="level-grid">
            ${Array.from({ length: 25 }, (_, index) => {
              const stage = index + 1;
              const locked = stage > unlocked;
              return `<button class="level-button ${locked ? "locked" : ""}" ${locked ? "disabled" : ""} data-stage="${stage}">${stage}</button>`;
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
