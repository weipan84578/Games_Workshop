(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("有效存檔可通過 schema 驗證", "save-store", function () {
    var state = Game.GameState.create(101);
    var snapshot = Game.GameState.snapshot(state);
    assert.truthy(Game.SaveStore.isValid(snapshot));
  });

  Test.test("NaN 或過大的陣列會被拒絕", "save-store", function () {
    var state = Game.GameState.snapshot(Game.GameState.create(102));
    state.player.x = NaN;
    assert.equal(Game.SaveStore.isValid(state), false);
    state.platforms = new Array(41).fill({});
    assert.equal(Game.SaveStore.isValid(state), false);
  });

  Test.test("巢狀物件損壞時不會接受存檔", "save-store", function () {
    var state = Game.GameState.snapshot(Game.GameState.create(103));
    state.platforms[0] = null;
    assert.equal(Game.SaveStore.isValid(state), false);

    state = Game.GameState.snapshot(Game.GameState.create(104));
    state.player.buffs = null;
    assert.equal(Game.SaveStore.isValid(state), false);

    state = Game.GameState.snapshot(Game.GameState.create(105));
    state.score.reachedMilestones = [500, "bad"];
    assert.equal(Game.SaveStore.isValid(state), false);
  });

  Test.test("自動存檔需跨過百米且遵守五秒節流", "save-store", function () {
    var state = Game.GameState.create(106);
    state.score.maxHeight = 99;
    assert.equal(Game.SaveStore.shouldAutoSave(state, 10000), false);

    state.score.maxHeight = 100;
    assert.equal(Game.SaveStore.shouldAutoSave(state, 10000), true);
    Game.SaveStore.markSaved(state, 10000);
    assert.equal(state.lastSavedHeight, 100);

    state.score.maxHeight = 200;
    assert.equal(Game.SaveStore.shouldAutoSave(state, 14999), false);
    assert.equal(Game.SaveStore.shouldAutoSave(state, 15000), true);
  });

  Test.test("舊存檔缺少新增選填欄位時會補上安全預設", "save-store", function () {
    var snapshot = Game.GameState.snapshot(Game.GameState.create(107));
    delete snapshot.score.comboPeakY;
    delete snapshot.lastSavedHeight;
    delete snapshot.lastSaveAt;
    var restored = Game.GameState.fromSnapshot(snapshot);

    assert.truthy(restored);
    assert.equal(restored.score.comboPeakY, null);
    assert.equal(restored.lastSavedHeight, 0);
    assert.equal(restored.lastSaveAt, 0);
  });
})(window.DJGame, window.DJTest);
