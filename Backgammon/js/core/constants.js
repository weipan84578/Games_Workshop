(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  BG.VERSION = "1.0.0";

  BG.COLOR = {
    PLAYER: "white",
    AI: "black",
  };

  BG.PLAYER = {
    HUMAN: "player",
    AI: "ai",
  };

  BG.DIRECTION = {
    white: -1,
    black: 1,
  };

  BG.HOME_BOARD = {
    white: [1, 2, 3, 4, 5, 6],
    black: [19, 20, 21, 22, 23, 24],
  };

  BG.BEAR_OFF_POINT = {
    white: 0,
    black: 25,
  };

  BG.BAR_POINT = {
    white: 25,
    black: 0,
  };

  BG.POINT_ROWS = {
    top: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    bottom: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  };

  BG.ownerForColor = function ownerForColor(color) {
    return color === BG.COLOR.PLAYER ? BG.PLAYER.HUMAN : BG.PLAYER.AI;
  };

  BG.colorForOwner = function colorForOwner(owner) {
    return owner === BG.PLAYER.HUMAN ? BG.COLOR.PLAYER : BG.COLOR.AI;
  };

  BG.opponentColor = function opponentColor(color) {
    return color === BG.COLOR.PLAYER ? BG.COLOR.AI : BG.COLOR.PLAYER;
  };

  BG.opponentOwner = function opponentOwner(owner) {
    return owner === BG.PLAYER.HUMAN ? BG.PLAYER.AI : BG.PLAYER.HUMAN;
  };

  BG.clamp = function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  };
})(window);
