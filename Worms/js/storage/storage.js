(function (root, factory) {
  var api = factory();
  root.WormsGame = root.WormsGame || {};
  root.WormsGame.StorageService = api.StorageService;
  root.WormsGame.DEFAULT_SAVE = api.DEFAULT_SAVE;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  var KEY = "wormy_boom_squad_save_v1";
  var DEFAULT_SAVE = Object.freeze({
    version: 1,
    settings: Object.freeze({
      language: "zh-Hant",
      bgmVolume: 0.45,
      sfxVolume: 0.7,
      muted: false,
      reducedMotion: false,
      preferredInput: "auto",
      tutorialCompleted: false,
      lastMatch: Object.freeze({
        aiDifficulty: "normal",
        theme: "random",
        turnSeconds: 30,
        playerTeamName: "蹦蹦隊",
        playerColor: "pink",
      }),
    }),
    stats: Object.freeze({
      matches: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      shotsFired: 0,
      shotsHit: 0,
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      weaponUses: Object.freeze({}),
      recentWeapon: "",
    }),
  });
  function oneOf(value, choices, fallback) {
    return choices.indexOf(value) >= 0 ? value : fallback;
  }
  function bounded(value, min, max, fallback) {
    return typeof value === "number" && Number.isFinite(value)
      ? Math.min(max, Math.max(min, value))
      : fallback;
  }
  function count(value) {
    return Number.isSafeInteger(value) && value >= 0 ? value : 0;
  }
  function teamName(value) {
    var text =
      typeof value === "string"
        ? Array.from(value.trim()).slice(0, 12).join("")
        : "";
    return text || "蹦蹦隊";
  }
  function validate(source) {
    source = source && typeof source === "object" ? source : {};
    var s =
      source.settings && typeof source.settings === "object"
        ? source.settings
        : {};
    var m = s.lastMatch && typeof s.lastMatch === "object" ? s.lastMatch : {};
    var stats =
      source.stats && typeof source.stats === "object" ? source.stats : {};
    var uses = {};
    if (
      stats.weaponUses &&
      typeof stats.weaponUses === "object" &&
      !Array.isArray(stats.weaponUses)
    )
      Object.keys(stats.weaponUses).forEach(function (key) {
        uses[key] = count(stats.weaponUses[key]);
      });
    return {
      version: 1,
      settings: {
        language: oneOf(s.language, ["zh-Hant", "en", "ja"], "zh-Hant"),
        bgmVolume: bounded(s.bgmVolume, 0, 1, 0.45),
        sfxVolume: bounded(s.sfxVolume, 0, 1, 0.7),
        muted: s.muted === true,
        reducedMotion: s.reducedMotion === true,
        preferredInput: oneOf(
          s.preferredInput,
          ["auto", "keyboard", "pointer", "touch"],
          "auto",
        ),
        tutorialCompleted: s.tutorialCompleted === true,
        lastMatch: {
          aiDifficulty: oneOf(
            m.aiDifficulty,
            ["easy", "normal", "hard"],
            "normal",
          ),
          theme: oneOf(
            m.theme,
            ["random", "candy", "forest", "icecream"],
            "random",
          ),
          turnSeconds:
            [20, 30, 45].indexOf(m.turnSeconds) >= 0 ? m.turnSeconds : 30,
          playerTeamName: teamName(m.playerTeamName),
          playerColor: oneOf(
            m.playerColor,
            ["pink", "mint", "sky", "grape"],
            "pink",
          ),
        },
      },
      stats: {
        matches: count(stats.matches),
        wins: count(stats.wins),
        losses: count(stats.losses),
        draws: count(stats.draws),
        shotsFired: count(stats.shotsFired),
        shotsHit: count(stats.shotsHit),
        totalDamageDealt: count(stats.totalDamageDealt),
        totalDamageTaken: count(stats.totalDamageTaken),
        weaponUses: uses,
        recentWeapon:
          typeof stats.recentWeapon === "string" ? stats.recentWeapon : "",
      },
    };
  }
  /** Safe localStorage wrapper which continues in memory when storage is unavailable. */
  function StorageService(adapter) {
    this.adapter =
      adapter || (typeof localStorage !== "undefined" ? localStorage : null);
    this.memory = validate(DEFAULT_SAVE);
    this.data = this.load();
  }
  StorageService.prototype.load = function () {
    try {
      var raw = this.adapter && this.adapter.getItem(KEY);
      this.memory = validate(raw ? JSON.parse(raw) : DEFAULT_SAVE);
    } catch (_) {
      this.memory = validate(DEFAULT_SAVE);
    }
    return this.memory;
  };
  StorageService.prototype.save = function () {
    try {
      if (this.adapter) this.adapter.setItem(KEY, JSON.stringify(this.data));
    } catch (_) {}
    return this.data;
  };
  StorageService.prototype.updateSettings = function (partial) {
    var merged = validate({
      version: 1,
      settings: Object.assign({}, this.data.settings, partial, {
        lastMatch: Object.assign(
          {},
          this.data.settings.lastMatch,
          partial.lastMatch || {},
        ),
      }),
      stats: this.data.stats,
    });
    this.data = merged;
    return this.save();
  };
  StorageService.prototype.recordMatch = function (match) {
    var s = this.data.stats;
    s.matches += 1;
    s[
      match.result === "win"
        ? "wins"
        : match.result === "loss"
          ? "losses"
          : "draws"
    ] += 1;
    s.shotsFired += count(match.shotsFired);
    s.shotsHit += count(match.shotsHit);
    s.totalDamageDealt += count(match.damageDealt);
    s.totalDamageTaken += count(match.damageTaken);
    var usedWeapons = Object.keys(match.weaponUses || {});
    usedWeapons.forEach(function (k) {
      s.weaponUses[k] = (s.weaponUses[k] || 0) + count(match.weaponUses[k]);
    });
    if (typeof match.recentWeapon === "string" && match.recentWeapon)
      s.recentWeapon = match.recentWeapon;
    else if (usedWeapons.length)
      s.recentWeapon = usedWeapons[usedWeapons.length - 1];
    return this.save();
  };
  StorageService.prototype.clearStats = function () {
    this.data.stats = validate(DEFAULT_SAVE).stats;
    return this.save();
  };
  StorageService.prototype.favoriteWeapon = function () {
    var uses = this.data.stats.weaponUses,
      recent = this.data.stats.recentWeapon,
      best = "",
      score = -1;
    Object.keys(uses).forEach(function (k) {
      if (uses[k] > score || (uses[k] === score && k === recent)) {
        best = k;
        score = uses[k];
      }
    });
    return best;
  };
  StorageService.KEY = KEY;
  return {
    KEY: KEY,
    DEFAULT_SAVE: DEFAULT_SAVE,
    validate: validate,
    StorageService: StorageService,
  };
});
