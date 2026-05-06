import { GameEngine } from "./game/engine.js";
import { Renderer, money } from "./ui/renderer.js";
import { ScreenManager } from "./ui/screen.js";
import { Synth } from "./audio/synth.js";
import { Music } from "./audio/music.js";
import { scoreHand } from "./game/hand.js";
import { loadRecords, loadSettings, saveSettings } from "./utils/storage.js";

const synth = new Synth();
const music = new Music(synth);
const screens = new ScreenManager();
let settings = loadSettings();
let engine = new GameEngine(settings, synth);
let renderer = new Renderer(engine);

bindNavigation();
bindGameControls();
bindSettings();
renderRecords();
renderer.render();

function bindNavigation() {
  document.addEventListener("click", async (event) => {
    const nav = event.target.closest("[data-nav]");
    if (!nav) return;
    await unlockAudio();
    const target = nav.dataset.nav;
    renderer.closeSettlement();
    if (target === "game") {
      engine.prepareBetting();
      renderer.render();
    }
    if (target === "leaderboard") renderRecords();
    screens.show(target);
    synth.play("button");
  });
}

function bindGameControls() {
  document.querySelector("#chip-buttons").addEventListener("click", (event) => {
    const chip = event.target.closest("[data-chip]");
    if (!chip) return;
    engine.addBet(Number(chip.dataset.chip));
    renderer.render();
  });

  document.querySelector("#clear-bet-btn").addEventListener("click", () => {
    engine.clearBet();
    renderer.render();
  });

  document.querySelector("#deal-btn").addEventListener("click", async () => {
    await unlockAudio();
    await engine.deal();
    renderer.render();
    await maybeAutoAdvance();
  });

  document.querySelector("#hit-btn").addEventListener("click", async () => {
    const done = engine.hitHuman();
    renderer.render();
    if (done) await advanceAfterHuman();
  });

  document.querySelector("#stand-btn").addEventListener("click", async () => {
    engine.standHuman();
    renderer.render();
    await advanceAfterHuman();
  });

  document.querySelector("#double-btn").addEventListener("click", async () => {
    const done = engine.doubleHuman();
    renderer.render();
    if (done) await advanceAfterHuman();
  });

  document.querySelector("#surrender-btn").addEventListener("click", async () => {
    engine.surrenderHuman();
    renderer.render();
    await advanceAfterHuman();
  });

  document.querySelector("#next-round-btn").addEventListener("click", () => {
    renderer.closeSettlement();
    engine.prepareBetting();
    renderer.render();
  });
}

async function maybeAutoAdvance() {
  const score = scoreHand(engine.human.hands[0]);
  if (score.isBlackjack || score.value === 21) {
    engine.standHuman();
    renderer.render();
    await advanceAfterHuman();
  }
}

async function advanceAfterHuman() {
  await engine.playAiTurns(() => renderer.render());
  await engine.playDealer(() => renderer.render());
  const summary = engine.settle();
  renderer.render();
  renderRecords();
  renderer.showSettlement(summary);
}

function bindSettings() {
  const form = document.querySelector("#settings-form");
  fillSettingsForm(form, settings);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    settings = saveSettings(Object.fromEntries(new FormData(form)));
    synth.setVolumes(settings);
    engine = new GameEngine(settings, synth);
    renderer = new Renderer(engine);
    renderer.render();
    screens.show("home");
  });
}

function fillSettingsForm(form, nextSettings) {
  for (const [key, value] of Object.entries(nextSettings)) {
    if (form.elements[key]) form.elements[key].value = String(value);
  }
}

function renderRecords() {
  const records = loadRecords();
  document.querySelector("#home-high-score").textContent = money(records.highScore);
  document.querySelector("#games-played").textContent = String(records.gamesPlayed);
  document.querySelector("#games-won").textContent = String(records.gamesWon);
  const list = document.querySelector("#leaderboard-list");
  list.innerHTML = records.leaderboard.length
    ? records.leaderboard.map((row) => `<li>${money(row.score)} · ${row.date}</li>`).join("")
    : "<li>尚無紀錄</li>";
}

async function unlockAudio() {
  await synth.init(settings);
  music.start();
}
