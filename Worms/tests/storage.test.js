"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const Storage = require("../js/storage/storage.js");

function adapter(value) {
  return {
    value,
    getItem() {
      return this.value;
    },
    setItem(key, next) {
      this.value = next;
    },
  };
}

test("missing, malformed, wrong-type, and out-of-range values recover safely", () => {
  const broken = adapter("{not json");
  const service = new Storage.StorageService(broken);
  assert.equal(service.data.version, 1);
  const sanitized = Storage.validate({
    settings: {
      bgmVolume: 4,
      sfxVolume: "loud",
      language: "xx",
      lastMatch: { turnSeconds: 12, playerTeamName: "   " },
    },
    stats: { wins: -3, matches: "many" },
  });
  assert.equal(sanitized.settings.bgmVolume, 1);
  assert.equal(sanitized.settings.sfxVolume, 0.7);
  assert.equal(sanitized.settings.language, "zh-Hant");
  assert.equal(sanitized.settings.lastMatch.turnSeconds, 30);
  assert.equal(sanitized.settings.lastMatch.playerTeamName, "蹦蹦隊");
  assert.equal(sanitized.stats.wins, 0);
});

test("clearStats preserves every user setting", () => {
  const service = new Storage.StorageService(adapter(null));
  service.updateSettings({ language: "ja", muted: true, bgmVolume: 0.2 });
  service.recordMatch({
    result: "win",
    shotsFired: 3,
    shotsHit: 2,
    damageDealt: 50,
    damageTaken: 8,
    weaponUses: { bazooka: 3 },
  });
  const settings = JSON.stringify(service.data.settings);
  service.clearStats();
  assert.equal(JSON.stringify(service.data.settings), settings);
  assert.equal(service.data.stats.matches, 0);
});

test("favorite weapon resolves a tie in favor of the most recent use", () => {
  const service = new Storage.StorageService(adapter(null));
  service.data.stats.weaponUses = { bazooka: 2, grenade: 2 };
  service.data.stats.recentWeapon = "grenade";
  assert.equal(service.favoriteWeapon(), "grenade");
});
