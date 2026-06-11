(function () {
  "use strict";

  window.Game = window.Game || {};

  Game.Constants = {
    VERSION: "1.0.0",
    WORLD: {
      WIDTH: 960,
      HEIGHT: 640,
      MAX_DPR: 2
    },
    STATES: {
      MENU: "MENU",
      HELP: "HELP",
      SETTINGS: "SETTINGS",
      PLAYING: "PLAYING",
      PAUSED: "PAUSED",
      GAME_OVER: "GAME_OVER"
    },
    SHIP: {
      RADIUS: 14,
      TURN_SPEED: 220 * Math.PI / 180,
      THRUST: 280,
      MAX_SPEED: 420,
      FRICTION: 0.985,
      BULLET_SPEED: 600,
      BULLET_LIFE: 1.1,
      FIRE_COOLDOWN: 0.25,
      RAPID_FIRE_COOLDOWN: 0.13,
      MAX_BULLETS: 6,
      INVULNERABLE_TIME: 1.5,
      RESPAWN_GRACE: 3,
      WARP_COOLDOWN: 5,
      WARP_RISK: 0.15
    },
    ASTEROIDS: {
      SAFE_RADIUS: 150,
      SHAPES: {
        large: { radius: 48, speedMin: 40, speedMax: 90, score: 20, splitsTo: "medium" },
        medium: { radius: 26, speedMin: 70, speedMax: 130, score: 50, splitsTo: "small" },
        small: { radius: 14, speedMin: 110, speedMax: 190, score: 100, splitsTo: null }
      }
    },
    UFO: {
      LARGE_RADIUS: 22,
      SMALL_RADIUS: 15,
      LARGE_SCORE: 200,
      SMALL_SCORE: 1000,
      BULLET_SPEED: 310,
      FIRE_INTERVAL: 1.7,
      SPAWN_MIN: 12,
      SPAWN_MAX: 25
    },
    POWERUPS: {
      CHANCE: 0.12,
      LIFE: 10,
      TYPES: {
        shield: { label: "Shield", duration: 10 },
        triple: { label: "Triple", duration: 10 },
        boost: { label: "Boost", duration: 8 },
        rapid: { label: "Rapid", duration: 8 }
      }
    },
    SCORE: {
      EXTRA_LIFE_EVERY: 10000
    },
    LIMITS: {
      MAX_PARTICLES: 300,
      MAX_BULLETS: 80,
      MAX_ENEMY_BULLETS: 24
    }
  };
}());
