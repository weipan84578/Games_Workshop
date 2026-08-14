(function (root) {
    "use strict";
    var cg = root.CastleGame = root.CastleGame || {};
    var Help = cg.Help = {};
    var cards = [
        ["goal", "🏰", false], ["shooting", "🚀", false], ["gates", "✨", true], ["special", "⚠️", false], ["hp", "❤️", false], ["skill", "🛡️", false], ["desktop", "⌨️", false], ["mobile", "📱", false], ["pause", "⏸️", false], ["save", "💾", false], ["result", "🎯", false], ["performance", "⚙️", true], ["audio", "🎵", false], ["settings", "🌈", false]
    ];
    function card(key, icon, wide) {
        var item = document.createElement("article"); item.className = "help-card" + (wide ? " help-card--wide" : ""); var iconNode = document.createElement("div"); iconNode.className = "help-card__icon"; iconNode.setAttribute("aria-hidden", "true"); iconNode.textContent = icon; var title = document.createElement("h3"); title.textContent = cg.I18n.t("help." + key); var copy = document.createElement("p"); copy.textContent = cg.I18n.t("help." + key + "Text"); item.appendChild(iconNode); item.appendChild(title); item.appendChild(copy); return item;
    }
    Help.init = function () { Help.render(); };
    Help.render = function () { var grid = document.getElementById("help-grid"); if (!grid) return; grid.textContent = ""; cards.forEach(function (data) { grid.appendChild(card(data[0], data[1], data[2])); }); var route = document.createElement("article"); route.className = "help-card help-card--wide"; route.innerHTML = "<div class=\"help-card__icon\" aria-hidden=\"true\">🧭</div><h3></h3><p></p><div class=\"help-route\"><b></b><i>→</i><b></b><i>→</i><b></b></div>"; route.querySelector("h3").textContent = cg.I18n.t("help.routeLabel"); route.querySelector("p").textContent = cg.I18n.t("help.gateTip"); var labels = route.querySelectorAll("b"); labels[0].textContent = cg.I18n.t("help.goalRoute"); labels[1].textContent = cg.I18n.t("help.gateRoute"); labels[2].textContent = cg.I18n.t("help.enemyRoute"); grid.appendChild(route); };
}(window));
