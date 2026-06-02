import { ComboSystem } from "./ComboSystem.js";
import { DifficultyManager } from "./DifficultyManager.js";
import { ScoreCalculator } from "./ScoreCalculator.js";
import { WordGenerator } from "./WordGenerator.js";

export class GameEngine {
  constructor({ settings, snapshot = null, audio = null, onUpdate = () => {}, onFinish = () => {}, onCombo = () => {} }) {
    this.settings = { ...settings };
    this.audio = audio;
    this.onUpdate = onUpdate;
    this.onFinish = onFinish;
    this.onCombo = onCombo;
    this.generator = new WordGenerator(this.settings);
    this.comboSystem = new ComboSystem();
    this.timerId = null;
    this.lastTick = 0;
    this.status = "idle";
    this.hydrate(snapshot);
  }

  hydrate(snapshot) {
    const duration = Number(this.settings.gameDuration);
    this.stats = {
      correctChars: snapshot?.correctChars ?? 0,
      wrongChars: snapshot?.wrongChars ?? 0,
      score: snapshot?.score ?? 0,
      wordsCompleted: snapshot?.wordsCompleted ?? 0,
      maxCombo: snapshot?.maxCombo ?? 0,
      elapsedSeconds: snapshot?.elapsedSeconds ?? 0,
      timeRemaining: snapshot?.timeRemaining ?? (duration > 0 ? duration : 0),
      startedAt: snapshot?.startedAt ?? new Date().toISOString(),
    };
    this.comboSystem.hydrate(snapshot?.combo ?? 0, this.stats.maxCombo);
    this.currentWord = snapshot?.currentWord ?? this.generator.next(this.stats.wordsCompleted);
    this.input = snapshot?.input ?? "";
  }

  start() {
    if (this.status === "playing") return;
    this.status = "playing";
    this.lastTick = performance.now();
    this.timerId = window.setInterval(() => this.tick(), 250);
    this.emitUpdate();
  }

  pause() {
    if (this.status !== "playing") return;
    this.tick();
    this.status = "paused";
    this.clearTimer();
    this.emitUpdate();
  }

  resume() {
    if (this.status !== "paused") return;
    this.start();
  }

  stop() {
    this.clearTimer();
    this.status = "stopped";
  }

  tick() {
    if (this.status !== "playing") return;
    const now = performance.now();
    const delta = Math.max(0, (now - this.lastTick) / 1000);
    this.lastTick = now;
    this.stats.elapsedSeconds += delta;
    if (this.settings.gameDuration > 0) {
      this.stats.timeRemaining = Math.max(0, this.stats.timeRemaining - delta);
      if (this.stats.timeRemaining <= 0) {
        this.finish("time");
        return;
      }
    }
    this.emitUpdate();
  }

  clearTimer() {
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  typeChar(char) {
    if (this.status !== "playing" || !char) return;
    const typed = [...char][0];
    if (!typed || typed === "\n" || typed === "\r") return;
    if ([...this.input].length >= [...this.currentWord].length) return;

    const expected = [...this.currentWord][[...this.input].length];
    this.input += typed;
    if (typed === expected) {
      const comboState = this.comboSystem.add();
      this.stats.correctChars += 1;
      this.stats.maxCombo = comboState.maxCombo;
      this.stats.score += ScoreCalculator.scoreForChar(comboState.combo, this.settings.difficulty);
      this.audio?.playSfx("keyCorrect");
      if (comboState.milestone) {
        this.onCombo(comboState.milestone);
        this.audio?.playSfx("combo");
      }
    } else {
      const previousCombo = this.comboSystem.reset();
      this.stats.wrongChars += 1;
      this.stats.timeRemaining = Math.max(0, this.stats.timeRemaining - DifficultyManager.timePenalty(this.settings.difficulty));
      this.audio?.playSfx(previousCombo > 4 ? "comboBreak" : "keyWrong");
    }

    if (this.input === this.currentWord) {
      this.completeWord();
    } else {
      this.emitUpdate();
    }
  }

  backspace() {
    if (this.status !== "playing" || !this.input) return;
    this.input = [...this.input].slice(0, -1).join("");
    this.emitUpdate();
  }

  completeWord() {
    this.stats.wordsCompleted += 1;
    this.stats.score += ScoreCalculator.scoreForWord([...this.currentWord].length, this.comboSystem.combo, this.settings.difficulty);
    this.audio?.playSfx("wordComplete");
    this.currentWord = this.generator.next(this.stats.wordsCompleted);
    this.input = "";
    this.emitUpdate();
  }

  finish(reason = "manual") {
    if (this.status === "finished") return;
    if (this.status === "playing") {
      const now = performance.now();
      const delta = Math.max(0, (now - this.lastTick) / 1000);
      this.lastTick = now;
      this.stats.elapsedSeconds += delta;
      if (this.settings.gameDuration > 0) {
        this.stats.timeRemaining = Math.max(0, this.stats.timeRemaining - delta);
      }
    }
    this.clearTimer();
    this.status = "finished";
    const result = ScoreCalculator.finalize(
      {
        ...this.stats,
        combo: this.comboSystem.combo,
        maxCombo: this.comboSystem.maxCombo,
        timeRemaining: this.stats.timeRemaining,
        reason,
      },
      this.settings
    );
    this.audio?.playSfx("gameOver");
    this.onFinish(result);
  }

  serialize() {
    return {
      ...this.stats,
      combo: this.comboSystem.combo,
      maxCombo: this.comboSystem.maxCombo,
      currentWord: this.currentWord,
      input: this.input,
      settings: { ...this.settings },
      status: this.status,
    };
  }

  getViewState() {
    const wpm = ScoreCalculator.wpm(this.stats.correctChars, Math.max(1, this.stats.elapsedSeconds));
    const accuracy = ScoreCalculator.accuracy(this.stats.correctChars, this.stats.wrongChars);
    return {
      status: this.status,
      settings: this.settings,
      currentWord: this.currentWord,
      input: this.input,
      combo: this.comboSystem.combo,
      maxCombo: this.comboSystem.maxCombo,
      score: Math.round(this.stats.score),
      correctChars: this.stats.correctChars,
      wrongChars: this.stats.wrongChars,
      wordsCompleted: this.stats.wordsCompleted,
      elapsedSeconds: this.stats.elapsedSeconds,
      timeRemaining: this.stats.timeRemaining,
      progress: this.settings.gameDuration > 0 ? this.stats.timeRemaining / this.settings.gameDuration : 1,
      wpm,
      accuracy,
    };
  }

  emitUpdate() {
    this.onUpdate(this.getViewState());
  }
}
