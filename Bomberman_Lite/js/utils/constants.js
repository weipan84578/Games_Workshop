(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  const TILE = {
    FLOOR: 0,
    WALL: 1,
    BRICK: 2,
    BOMB: 3,
    FLAME: 4,
    POWERUP: 5,
    EXIT: 6
  };

  const AI_LEVEL = {
    RANDOM: 0,
    CHASE: 1,
    AVOID_BOMB: 2,
    SMART: 3,
    PHASE: 4,
    SUPER: 5
  };

  const CONFIG = {
    mapW: 15,
    mapH: 13,
    tileSize: 48,
    baseWidth: 720,
    baseHeight: 624,
    targetFps: 60,
    maxLives: 5,
    startLives: 3,
    startBombs: 1,
    startFireRange: 1,
    startSpeed: 1,
    playerSize: 34,
    enemySize: 34,
    saveVersion: 1
  };

  const BOMB_CONFIG = {
    fuseTime: 2500,
    flameLife: 600,
    baseRange: 1,
    maxRange: 8,
    maxBombs: 1,
    chainDelay: 100
  };

  const SCORE = {
    enemy_basic: 100,
    enemy_medium: 300,
    enemy_fast: 500,
    enemy_smart: 800,
    enemy_phase: 1200,
    enemy_super: 2000,
    boss: 10000,
    time_bonus: 10,
    powerup_collect: 50,
    clear_stage: 500
  };

  const POWERUPS = {
    bomb: { label: "炸彈+1", icon: "B", color: "#ffd166" },
    fire: { label: "火焰升級", icon: "F", color: "#ff6b35" },
    speed: { label: "加速靴", icon: "S", color: "#06d6a0" },
    shield: { label: "護盾", icon: "D", color: "#4cc9f0" },
    time: { label: "時間+30", icon: "T", color: "#f7e733" },
    pierce: { label: "穿牆炸彈", icon: "P", color: "#c77dff" },
    life: { label: "加命", icon: "+", color: "#ef476f" },
    remote: { label: "遙控炸彈", icon: "R", color: "#90be6d" }
  };

  const ENEMY_TYPES = {
    balloom: {
      label: "Balloom",
      color: "#b26cff",
      accent: "#f7c8ff",
      speed: 54,
      ai: AI_LEVEL.RANDOM,
      scoreKey: "enemy_basic",
      hp: 1,
      phase: false
    },
    oneal: {
      label: "Oneal",
      color: "#f94144",
      accent: "#ffd0d0",
      speed: 70,
      ai: AI_LEVEL.CHASE,
      scoreKey: "enemy_medium",
      hp: 1,
      phase: false
    },
    doll: {
      label: "Doll",
      color: "#ffd166",
      accent: "#fff7c2",
      speed: 72,
      ai: AI_LEVEL.AVOID_BOMB,
      scoreKey: "enemy_fast",
      hp: 1,
      phase: false
    },
    minvo: {
      label: "Minvo",
      color: "#43aa8b",
      accent: "#d8fff2",
      speed: 92,
      ai: AI_LEVEL.SMART,
      scoreKey: "enemy_smart",
      hp: 1,
      phase: false
    },
    kondoria: {
      label: "Kondoria",
      color: "#4cc9f0",
      accent: "#e0f8ff",
      speed: 48,
      ai: AI_LEVEL.PHASE,
      scoreKey: "enemy_phase",
      hp: 1,
      phase: true
    },
    ovape: {
      label: "Ovape",
      color: "#f3722c",
      accent: "#ffe0c8",
      speed: 100,
      ai: AI_LEVEL.SUPER,
      scoreKey: "enemy_super",
      hp: 1,
      phase: true
    },
    boss: {
      label: "Daemon",
      color: "#d00000",
      accent: "#ffd700",
      speed: 70,
      ai: AI_LEVEL.SUPER,
      scoreKey: "boss",
      hp: 5,
      phase: true,
      boss: true
    }
  };

  const DIRECTIONS = [
    { x: 0, y: -1, name: "up" },
    { x: 1, y: 0, name: "right" },
    { x: 0, y: 1, name: "down" },
    { x: -1, y: 0, name: "left" }
  ];

  const THEMES = [
    { id: "classic", label: "經典火焰" },
    { id: "neon", label: "霓虹電路" },
    { id: "forest", label: "森林迷宮" },
    { id: "ocean", label: "深海冒險" },
    { id: "volcano", label: "火山地獄" },
    { id: "candy", label: "糖果樂園" }
  ];

  root.TILE = TILE;
  root.AI_LEVEL = AI_LEVEL;
  root.CONFIG = CONFIG;
  root.BOMB_CONFIG = BOMB_CONFIG;
  root.SCORE = SCORE;
  root.POWERUPS = POWERUPS;
  root.ENEMY_TYPES = ENEMY_TYPES;
  root.DIRECTIONS = DIRECTIONS;
  root.THEMES = THEMES;
}());
