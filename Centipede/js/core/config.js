(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};

  Game.Config = {
    GRID_COLS: 30,
    GRID_ROWS: 36,
    CELL: 20,
    PLAYER_ZONE_ROWS: 7,
    INITIAL_LIVES: 3,
    MAX_LIVES: 6,
    EXTRA_LIFE_EVERY: 12000,
    PLAYER_SPEED: 250,
    BULLET_SPEED: 620,
    BULLET_COOLDOWN: 0.11,
    CENTIPEDE_BASE_SPEED: 6,
    CENTIPEDE_MAX_SPEED: 14,
    INITIAL_MUSHROOM_MIN: 20,
    INITIAL_MUSHROOM_MAX: 40,
    MUSHROOM_HP: 4,
    SPIDER_MIN_TIME: 8,
    SPIDER_MAX_TIME: 15,
    SCORPION_MIN_TIME: 20,
    SCORPION_MAX_TIME: 30,
    FLEA_TRIGGER_MUSHROOMS: 5,
    PLAYER_DEATH_LOCK: 0.85
  };

  Game.Config.WIDTH = Game.Config.GRID_COLS * Game.Config.CELL;
  Game.Config.HEIGHT = Game.Config.GRID_ROWS * Game.Config.CELL;
  Game.Config.PLAYER_ZONE_START = Game.Config.GRID_ROWS - Game.Config.PLAYER_ZONE_ROWS;
})(window);
