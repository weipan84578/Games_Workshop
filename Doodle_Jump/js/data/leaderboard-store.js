(function (Game) {
  "use strict";
  var KEY = "djgame.leaderboard.v1";
  var PLAYER_KEY = "djgame.player.v1";
  function isValidName(name) {
    if (typeof name !== "string") return false;
    var visible = Array.from(
      name.trim().replace(/[\u0000-\u001f\u007f]/g, ""),
    );
    return visible.length >= 1 && visible.length <= 12;
  }
  function validEntry(entry) {
    return (
      Game.Validation.isPlainObject(entry) &&
      Game.Validation.string(entry.id, 100) &&
      isValidName(entry.name) &&
      Game.Validation.finite(entry.score, 0, 100000000) &&
      Game.Validation.finite(entry.height, 0, 100000000) &&
      Game.Validation.finite(entry.bestCombo, 0, 100000) &&
      Game.Validation.finite(entry.collected, 0, 100000) &&
      Game.Validation.oneOf(entry.theme, Game.Themes) &&
      typeof entry.createdAt === "string"
    );
  }
  function compare(a, b) {
    return (
      b.score - a.score ||
      b.height - a.height ||
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }
  function sanitize(value) {
    return Array.isArray(value)
      ? value.filter(validEntry).sort(compare).slice(0, 20)
      : [];
  }
  function load() {
    return sanitize(
      Game.Storage.read(
        KEY,
        function (value) {
          return Array.isArray(value);
        },
        [],
      ).value,
    );
  }
  function save(entries) {
    return Game.Storage.write(KEY, sanitize(entries));
  }
  function loadPlayerName() {
    var result = Game.Storage.read(
      PLAYER_KEY,
      function (value) {
        return (
          Game.Validation.isPlainObject(value) &&
          typeof value.name === "string"
        );
      },
      null,
    ).value;
    if (!result) return "";
    var name = Game.Validation.cleanName(result.name, "");
    return isValidName(name) ? name : "";
  }
  function savePlayerName(name) {
    var clean = Game.Validation.cleanName(name, "");
    if (!isValidName(clean)) return { ok: false, invalid: true };
    return Game.Storage.write(PLAYER_KEY, { name: clean });
  }
  Game.LeaderboardStore = Object.freeze({
    key: KEY,
    compare: compare,
    sanitize: sanitize,
    load: load,
    save: save,
    add: function (entry) {
      if (!validEntry(entry))
        return { ok: false, invalid: true, entries: load() };
      var entries = load();
      if (
        entries.some(function (item) {
          return item.id === entry.id;
        })
      )
        return { ok: true, duplicate: true, entries: entries };
      entries.push(entry);
      entries = sanitize(entries);
      var result = save(entries);
      return {
        ok: result.ok,
        entry: entry,
        entries: entries,
        ranked: entries.some(function (item) {
          return item.id === entry.id;
        }),
      };
    },
    clear: function () {
      return Game.Storage.remove(KEY);
    },
    isValidName: isValidName,
    loadPlayerName: loadPlayerName,
    savePlayerName: savePlayerName,
  });
})(window.DJGame);
