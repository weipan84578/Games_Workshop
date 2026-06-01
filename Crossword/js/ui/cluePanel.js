(function () {
  function render(model, userGrid, activeEntryId, mode = "mobile", activeTab = "across") {
    if (mode === "desktop") {
      return `
        <aside class="clue-layout desktop-clues desktop-down" data-clue-direction="down">${panel(model, userGrid, "down", activeEntryId)}</aside>
        <aside class="clue-layout desktop-clues desktop-across" data-clue-direction="across">${panel(model, userGrid, "across", activeEntryId)}</aside>
      `;
    }

    const direction = activeTab === "down" ? "down" : "across";
    return `
      <aside class="clue-layout mobile-clues" data-clue-direction="${direction}">
        <div class="clue-tabs" role="tablist" aria-label="提示方向">
          <button class="segment ${direction === "across" ? "active" : ""}" type="button" data-clue-tab="across">橫向</button>
          <button class="segment ${direction === "down" ? "active" : ""}" type="button" data-clue-tab="down">縱向</button>
        </div>
        ${panel(model, userGrid, direction, activeEntryId)}
      </aside>
    `;
  }

  function panel(model, userGrid, direction, activeEntryId) {
    const title = direction === "down" ? "縱向提示" : "橫向提示";
    return `
      <section class="clue-panel">
        <div class="clue-panel-header"><h2>${title}</h2></div>
        <div class="clue-list">
          ${model.clues[direction].map((entry) => item(model, userGrid, entry, activeEntryId)).join("")}
        </div>
      </section>
    `;
  }

  function item(model, userGrid, entry, activeEntryId) {
    const complete = Solver.isEntryComplete(model, userGrid, entry.id);
    const classes = ["clue-item"];
    if (entry.id === activeEntryId) {
      classes.push("active");
    }
    if (complete) {
      classes.push("complete");
    }
    return `
      <button class="${classes.join(" ")}" type="button" data-entry-id="${entry.id}">
        <span class="clue-number">${entry.number}</span>
        <span>${entry.clue}</span>
      </button>
    `;
  }

  window.CluePanel = {
    render,
  };
})();
