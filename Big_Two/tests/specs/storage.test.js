(function (global) {
  'use strict';

  var BigTwo = global.BigTwo;

  function memoryStorage() {
    var data = {};
    return {
      getItem: function (key) { return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null; },
      setItem: function (key, value) { data[key] = String(value); },
      removeItem: function (key) { delete data[key]; },
      data: data
    };
  }

  function throwingStorage() {
    return {
      getItem: function () { throw new DOMException('denied', 'SecurityError'); },
      setItem: function () { throw new DOMException('quota', 'QuotaExceededError'); },
      removeItem: function () { throw new DOMException('denied', 'SecurityError'); }
    };
  }

  describe('Storage and save snapshots', function () {
    var store;
    beforeEach(function () {
      store = memoryStorage();
      BigTwo.Storage.configure(store);
    });

    it('serializes and restores an equivalent complete game state', function () {
      var state = BigTwo.Game.createNewGame({ seed: 'save-restore' });
      var result = BigTwo.Storage.saveActiveGame(state, { backend: store, savedAt: '2026-07-14T00:00:00.000Z' });
      var loaded = BigTwo.Storage.loadActiveGame(store);
      assertTrue(result.ok);
      assertEqual(loaded.status, 'ok');
      assertDeepEqual(loaded.gameState, state);
    });

    it('uses separate namespaced keys for settings, statistics and active games', function () {
      assertEqual(BigTwo.Storage.keys.settings, 'bigTwo.settings.v1');
      assertEqual(BigTwo.Storage.keys.activeGame, 'bigTwo.activeGame.v1');
      assertEqual(BigTwo.Storage.keys.statistics, 'bigTwo.statistics.v1');
      assertTrue(BigTwo.Storage.keys.settings !== BigTwo.Storage.keys.activeGame);
      assertTrue(BigTwo.Storage.keys.statistics !== BigTwo.Storage.keys.activeGame);
    });

    it('rejects broken JSON and clears only the active-game key', function () {
      store.setItem(BigTwo.Storage.keys.settings, JSON.stringify(BigTwo.Config.DEFAULT_SETTINGS));
      store.setItem(BigTwo.Storage.keys.statistics, JSON.stringify(BigTwo.Config.DEFAULT_STATISTICS));
      store.setItem(BigTwo.Storage.keys.activeGame, '{broken');
      var loaded = BigTwo.Storage.loadActiveGame(store);
      assertEqual(loaded.status, 'invalid');
      assertEqual(store.getItem(BigTwo.Storage.keys.activeGame), null);
      assertTrue(store.getItem(BigTwo.Storage.keys.settings) !== null);
      assertTrue(store.getItem(BigTwo.Storage.keys.statistics) !== null);
    });

    it('rejects wrong versions, duplicate cards, missing players and bad indices', function () {
      function expectInvalid(mutator) {
        var state = BigTwo.Game.createNewGame({ seed: 'invalid-save' });
        mutator(state);
        var snapshot = BigTwo.SaveSchema.createSnapshot(state, { savedAt: '2026-07-14T00:00:00.000Z' });
        store.setItem(BigTwo.Storage.keys.activeGame, JSON.stringify(snapshot));
        assertEqual(BigTwo.Storage.loadActiveGame(store).status, 'invalid');
      }
      expectInvalid(function (state) { state.schemaVersion = 99; });
      expectInvalid(function (state) { state.players[0].hand[0] = BigTwo.Utils.deepClone(state.players[1].hand[0]); });
      expectInvalid(function (state) { state.players.pop(); });
      expectInvalid(function (state) { state.currentPlayerIndex = 9; });
    });

    it('quietly degrades when localStorage throws security or quota errors', function () {
      var hostile = throwingStorage();
      var state = BigTwo.Game.createNewGame({ seed: 'hostile-storage' });
      assertTrue(!BigTwo.Storage.isAvailable(hostile));
      assertTrue(!BigTwo.Storage.saveActiveGame(state, { backend: hostile }).ok);
      assertEqual(BigTwo.Storage.loadActiveGame(hostile).status, 'unavailable');
      assertDeepEqual(BigTwo.Storage.loadSettings(hostile), BigTwo.Config.DEFAULT_SETTINGS);
    });

    it('never exposes a finished game through continue-game APIs', function () {
      var state = BigTwo.Game.createNewGame({ seed: 'finished-save' });
      state.phase = 'finished';
      var result = BigTwo.Storage.saveActiveGame(state, { backend: store });
      assertTrue(result.removed);
      assertTrue(!BigTwo.Storage.hasActiveGame(store));
    });

    it('saves exactly once after each successful controller action', function () {
      var state = BigTwo.Game.createNewGame({ seed: 'autosave-action' });
      var saves = 0;
      var fakeApi = { saveActiveGame: function () { saves += 1; return { ok: true }; } };
      var controller = BigTwo.Game.createController({ state: state, storage: fakeApi });
      var opening = BigTwo.Game.getLegalMovesForCurrentPlayer(state)[0];
      controller.dispatch({
        type: 'PLAY_CARDS',
        playerId: state.players[state.currentPlayerIndex].id,
        cardIds: opening.map(function (card) { return card.id; })
      });
      assertEqual(saves, 1);
    });
  });
}(window));
