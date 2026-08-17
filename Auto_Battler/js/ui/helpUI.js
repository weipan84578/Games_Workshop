(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};
  var activeChapter = "goal";
  var openFaq = 0;
  var chapters = [
    ["goal", "🎯"], ["economy", "💰"], ["shop", "🛒"], ["board", "♟️"], ["merge", "⭐"], ["synergy", "🤝"], ["battle", "⚔️"], ["result", "🏆"], ["faq", "❓"]
  ];

  function text(key) { return app.I18n.t("help." + activeChapter + "." + key); }

  function renderSteps() {
    var steps = [0, 1, 2].map(function (index) {
      return '<div class="step-card"><span class="step-number">' + (index + 1) + '</span><h3>' + text("steps." + index + ".title") + '</h3><p>' + text("steps." + index + ".text") + '</p></div>';
    }).join("");
    return '<div class="help-section-grid">' + steps + '</div>' + (activeChapter === "battle" ? '<div class="formula-card" style="margin-top:12px"><strong>✦ ' + app.I18n.t("help.battle.formula") + '</strong><span class="formula">' + text("formula") + '</span></div>' : "") + '<div class="help-callout"><strong>💡</strong> ' + text("callout") + '</div>';
  }

  function renderFaq() {
    var items = app.I18n.t("help.faq.items", []);
    return '<div class="faq-list">' + items.map(function (item, index) {
      return '<div class="faq-item ' + (openFaq === index ? "is-open" : "") + '"><button type="button" class="faq-question" data-action="toggle-faq" data-faq-index="' + index + '"><span>' + item.q + '</span><span aria-hidden="true">' + (openFaq === index ? "−" : "+") + '</span></button><div class="faq-answer">' + item.a + '</div></div>';
    }).join("") + "</div>";
  }

  app.HelpUI = {
    setChapter: function (chapter) {
      if (chapters.some(function (item) { return item[0] === chapter; })) {
        activeChapter = chapter;
        openFaq = 0;
        this.render();
      }
    },
    toggleFaq: function (index) {
      openFaq = openFaq === Number(index) ? -1 : Number(index);
      this.render();
    },
    render: function () {
      var tabs = document.getElementById("help-tabs");
      var content = document.getElementById("help-content");
      if (!tabs || !content) return;
      tabs.innerHTML = chapters.map(function (item) {
        return '<button type="button" class="help-tab ' + (activeChapter === item[0] ? "is-active" : "") + '" data-action="help-tab" data-chapter="' + item[0] + '"><span class="help-tab-icon">' + item[1] + '</span><span>' + app.I18n.t("help.chapters." + item[0]) + '</span></button>';
      }).join("");
      var title = activeChapter === "faq" ? app.I18n.t("help.faq.title") : text("title");
      var intro = activeChapter === "faq" ? app.I18n.t("help.faq.intro") : text("intro");
      var icon = chapters.find(function (item) { return item[0] === activeChapter; })[1];
      content.innerHTML = '<div class="help-article"><div class="help-article-heading"><div class="help-article-icon">' + icon + '</div><div><h2>' + title + '</h2><p class="help-article-intro">' + intro + '</p></div></div>' + (activeChapter === "faq" ? renderFaq() : renderSteps()) + '</div>';
    }
  };
}(window));
