const settings = {
  musicVolume: .7,
  sfxVolume: .8,
  musicMuted: false,
  sfxMuted: false,
  fontSize: "L",
  darkMode: "auto",
  showAggro: true,
  showHints: true
};
const setup = { mode: "homecoming", players: 2, difficulty: "easy" };
const boardCanvas = document.getElementById("board");
const ctx = boardCanvas.getContext("2d");
const titleCanvas = document.getElementById("title-art");
const titleCtx = titleCanvas.getContext("2d");

let audioCtx = null;
let bgmTimer = null;
let bgmGain = null;
let lastScreen = "title";
let animationTick = 0;
let game = null;
let aiTimer = null;
let cellLayout = new Map();
let boardNodes = [];
let boardSet = new Set();
let zones = null;
