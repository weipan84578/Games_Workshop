(function (Game) {
  "use strict";
  function LeaderboardScreen(root) {
    this.root = root;
    this.content = root.querySelector("#leaderboard-content");
  }
  LeaderboardScreen.prototype.render = function (entries, newestId) {
    while (this.content.firstChild)
      this.content.removeChild(this.content.firstChild);
    if (!entries.length) {
      var empty = document.createElement("div");
      empty.className = "empty-board";
      var trophy = document.createElement("div");
      trophy.className = "empty-trophy";
      trophy.setAttribute("aria-hidden", "true");
      trophy.textContent = "♛";
      var title = document.createElement("h2");
      title.textContent = Game.I18n.t("leaderboard.emptyTitle");
      var body = document.createElement("p");
      body.textContent = Game.I18n.t("leaderboard.emptyBody");
      empty.appendChild(trophy);
      empty.appendChild(title);
      empty.appendChild(body);
      this.content.appendChild(empty);
      return;
    }
    var wrap = document.createElement("div");
    wrap.className = "leaderboard-table-wrap";
    var table = document.createElement("table");
    table.className = "leaderboard-table";
    var thead = document.createElement("thead");
    var row = document.createElement("tr");
    ["rank", "name", "score", "height", "date", "theme"].forEach(
      function (key) {
        var cell = document.createElement("th");
        cell.scope = "col";
        cell.textContent = Game.I18n.t("leaderboard." + key);
        row.appendChild(cell);
      },
    );
    thead.appendChild(row);
    table.appendChild(thead);
    var tbody = document.createElement("tbody");
    entries.forEach(function (entry, index) {
      var tr = document.createElement("tr");
      if (entry.id === newestId) tr.className = "is-new";
      var rank = document.createElement("td");
      rank.className = "rank-cell";
      if (index < 3) {
        var medal = document.createElement("span");
        medal.className = "medal medal-" + ["gold", "silver", "bronze"][index];
        medal.textContent = String(index + 1);
        rank.appendChild(medal);
      }
      var rankText = document.createElement("span");
      rankText.textContent = String(index + 1);
      rank.appendChild(rankText);
      tr.appendChild(rank);
      var name = document.createElement("td");
      name.className = "name-cell";
      var nameStrong = document.createElement("strong");
      nameStrong.textContent = entry.name;
      name.appendChild(nameStrong);
      if (entry.id === newestId) {
        var tag = document.createElement("span");
        tag.className = "new-tag";
        tag.textContent = Game.I18n.t("leaderboard.new");
        name.appendChild(tag);
      }
      tr.appendChild(name);
      [
        ["score", Game.I18n.number(entry.score)],
        ["height", Game.I18n.number(entry.height) + " m"],
        ["date", Game.I18n.date(entry.createdAt)],
        [
          "theme",
          Game.I18n.t(
            "theme." +
              ({
                "pastel-sky": "pastel",
                "candy-sunset": "candy",
                "mint-forest": "mint",
                "neon-night": "neon",
              }[entry.theme] || "pastel"),
          ),
        ],
      ].forEach(function (pair) {
        var cell = document.createElement("td");
        cell.textContent = pair[1];
        tr.appendChild(cell);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    this.content.appendChild(wrap);
  };
  Game.LeaderboardScreen = LeaderboardScreen;
})(window.DJGame);
