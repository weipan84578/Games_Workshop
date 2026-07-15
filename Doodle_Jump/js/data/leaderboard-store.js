(function (Game) {
  "use strict";
  var KEY = "djgame.leaderboard.v1";
  function validEntry(entry) {
    return (
      Game.Validation.isPlainObject(entry) &&
      Game.Validation.string(entry.id, 100) &&
      Game.Validation.string(entry.name, 12) &&
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
    isValidName: function (name) {
      return (
        typeof name === "string" &&
        Array.from(name.trim().replace(/[\u0000-\u001f\u007f]/g, "")).length >=
          1
      );
    },
  });
})(window.DJGame);
