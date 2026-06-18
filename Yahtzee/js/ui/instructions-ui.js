window.YZ = window.YZ || {};

YZ.InstructionsUI = (function () {
  function t(key) {
    return YZ.I18n.t(key);
  }

  function render() {
    var root = document.getElementById("screen-instructions");
    if (!root) return;
    root.innerHTML = [
      '<div class="page-shell instructions-shell">',
      '<header class="section-header">',
      '<div><h1>' + YZ.Effects.esc(t("instructions.title")) + '</h1><p class="muted">' + YZ.Effects.esc(t("app.subtitle")) + "</p></div>",
      '<button class="btn" id="instructions-back">← ' + YZ.Effects.esc(t("common.back")) + "</button>",
      "</header>",
      '<div class="instructions-grid">',
      card("🎯", t("instructions.goal"), t("instructions.goalBody"), YZ.Effects.diceSample([6, 6, 6, 5, 5])),
      card("🎲", t("instructions.how"), t("instructions.howBody"), YZ.Effects.diceSample([1, 2, 3, 4, 5])),
      card("🔢", t("instructions.upper"), t("instructions.upperBody"), '<span class="highlight-number">63 + 35</span>'),
      card("🃏", t("instructions.lower"), t("instructions.lowerBody"), lowerExamples()),
      card("⭐", t("instructions.yahtzee"), t("instructions.yahtzeeBody"), YZ.Effects.diceSample([4, 4, 4, 4, 4]) + ' <span class="highlight-number">50 / +100</span>'),
      card("🤖", t("instructions.ai"), t("instructions.aiBody"), difficultyBadges()),
      card("💡", t("instructions.tips"), t("instructions.tipsBody"), YZ.Effects.diceSample([5, 5, 5, 2, 6])),
      "</div>",
      "</div>"
    ].join("");
    root.querySelector("#instructions-back").addEventListener("click", function () {
      YZ.ScreenManager.show("menu");
    });
  }

  function card(icon, title, body, extra) {
    return [
      '<details class="info-card" open>',
      '<summary><span aria-hidden="true">' + icon + '</span><span>' + YZ.Effects.esc(title) + "</span></summary>",
      '<div class="info-card__body"><p>' + YZ.Effects.esc(body) + "</p><div>" + extra + "</div></div>",
      "</details>"
    ].join("");
  }

  function lowerExamples() {
    var items = [
      ["score.fullHouse", [5, 5, 5, 2, 2], "25"],
      ["score.smallStraight", [1, 2, 3, 4, 6], "30"],
      ["score.largeStraight", [2, 3, 4, 5, 6], "40"],
      ["score.yahtzee", [6, 6, 6, 6, 6], "50"]
    ];
    return '<div class="score-examples">' + items.map(function (item) {
      return '<div class="score-example"><span>' + YZ.Effects.esc(t(item[0])) + '</span>' + YZ.Effects.diceSample(item[1]) + '<strong class="highlight-number">' + item[2] + "</strong></div>";
    }).join("") + "</div>";
  }

  function difficultyBadges() {
    return '<div class="pill-row">' + YZ.Constants.DIFFICULTIES.map(function (difficulty) {
      return '<span class="app-badge">' + YZ.Effects.esc(t("difficulty." + difficulty)) + "</span>";
    }).join("") + "</div>";
  }

  return {
    render: render
  };
})();
