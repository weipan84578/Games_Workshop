/* state.js — 遊戲狀態物件與基本存取/初始化函式。 */
(function (L) {
  'use strict';

  var S = L.state;

  // 目前對局狀態(由 newGame 建立)
  S.game = null;

  // 遊戲流程 phase 常數(§10.2)
  S.PHASE = {
    BOOT: 'BOOT', MENU: 'MENU', MODE_SELECT: 'MODE_SELECT',
    TURN_START: 'TURN_START', ROLL: 'ROLL', RESOLVE: 'RESOLVE',
    AWAIT_MOVE: 'AWAIT_MOVE', MOVE_ANIMATE: 'MOVE_ANIMATE',
    GAME_OVER: 'GAME_OVER'
  };

  // 設定(獨立於對局,常駐)
  S.settings = null;

  /* 建立一場新對局。
     opts = { aiCount:1..3, difficulty:'easy|normal|hard', playerColor:0..3 } */
  S.newGame = function (opts) {
    var cfg = L.config;
    var aiCount = opts.aiCount;
    var totalPlayers = aiCount + 1;          // 含人類
    var humanColor = opts.playerColor != null ? opts.playerColor : 0;

    // 依顏色順序決定參賽者(固定順時針 red→green→yellow→blue)
    // 取等距分佈的顏色,確保版面平衡
    var seats = pickSeats(totalPlayers, humanColor);

    var players = [];
    var tokens = [];
    for (var s = 0; s < seats.length; s++) {
      var colorIdx = seats[s];
      var isHuman = (colorIdx === humanColor);
      players.push({
        id: colorIdx,
        color: cfg.COLORS[colorIdx],
        isHuman: isHuman,
        difficulty: isHuman ? null : opts.difficulty
      });
      for (var t = 0; t < cfg.TOKENS_PER_PLAYER; t++) {
        tokens.push({
          id: colorIdx * 4 + t,
          owner: colorIdx,
          index: t,
          inYard: true,
          finished: false,
          rel: -1            // 在基地時無意義
        });
      }
    }

    // 回合順序:依顏色索引升冪(順時針)
    players.sort(function (a, b) { return a.id - b.id; });
    var order = players.map(function (p) { return p.id; });

    S.game = {
      mode: 'pvai',
      players: players,
      order: order,             // 參賽顏色索引的輪替順序
      turnPtr: 0,               // 指向 order 的索引
      tokens: tokens,
      currentPlayer: order[0],
      dice: { value: 0, rolled: false, sixStreak: 0 },
      phase: S.PHASE.TURN_START,
      winner: null,
      ranking: [],              // 完成順序
      humanColor: humanColor,
      difficulty: opts.difficulty,
      aiCount: aiCount
    };
    return S.game;
  };

  // 選擇座位顏色,讓玩家在場,其餘 AI 取對角/均勻分布
  function pickSeats(total, human) {
    if (total === 2) {
      // 玩家 + 對角 AI
      return uniq([human, (human + 2) % 4]);
    }
    if (total === 3) {
      return uniq([human, (human + 1) % 4, (human + 2) % 4, (human + 3) % 4]).slice(0, 3);
    }
    return [0, 1, 2, 3];
  }
  function uniq(arr) {
    var out = []; for (var i = 0; i < arr.length; i++) if (out.indexOf(arr[i]) < 0) out.push(arr[i]); return out;
  }

  S.tokensOf = function (owner) {
    return S.game.tokens.filter(function (t) { return t.owner === owner; });
  };

  S.getToken = function (id) {
    var tk = S.game.tokens;
    for (var i = 0; i < tk.length; i++) if (tk[i].id === id) return tk[i];
    return null;
  };

  S.playerById = function (id) {
    var p = S.game.players;
    for (var i = 0; i < p.length; i++) if (p[i].id === id) return p[i];
    return null;
  };

  S.isHumanTurn = function () {
    var p = S.playerById(S.game.currentPlayer);
    return p && p.isHuman;
  };

  S.finishedCount = function (owner) {
    return S.tokensOf(owner).filter(function (t) { return t.finished; }).length;
  };
})(window.Ludo);
