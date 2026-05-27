import { AudioEngine } from "./audio/AudioEngine.js";
import { AudioSettings } from "./audio/AudioSettings.js";
import { MusicPlayer } from "./audio/MusicPlayer.js";
import { SoundEffects } from "./audio/SoundEffects.js";
import { Router } from "./core/router.js";
import { AppState } from "./core/state.js";
import { ScoreManager } from "./game/ScoreManager.js";
import { ImageImporter } from "./image/ImageImporter.js";
import { toCenterSquare } from "./image/ImageCropper.js";
import { GameScreen } from "./screens/GameScreen.js";
import { InstructionsScreen } from "./screens/InstructionsScreen.js";
import { MainMenuScreen } from "./screens/MainMenuScreen.js";
import { SettingsScreen } from "./screens/SettingsScreen.js";
import { VictoryScreen } from "./screens/VictoryScreen.js";
import { DIFFICULTIES, IMAGE_RULES } from "./utils/constants.js";
import { copyCanvas, getDifficultyById } from "./utils/helpers.js";
import { clearGameSnapshot, hasGameSnapshot, loadGameSnapshot, saveGameSnapshot } from "./utils/storage.js";
import { ThemeManager } from "./ui/ThemeManager.js";
import { Toast } from "./ui/Toast.js";

class PuzzleApp {
  constructor(root) {
    this.root = root;
    this.state = new AppState();
    this.defaultCanvas = this.createDefaultImage();
    this.state.setImage(copyCanvas(this.defaultCanvas), "預設插畫", "demo");
    this.toast = new Toast();
    this.importer = new ImageImporter();
    this.audio = new AudioEngine(this.state.settings);
    this.audioSettings = new AudioSettings(this.audio, this.state);
    this.sfx = new SoundEffects(this.audio);
    this.music = new MusicPlayer(this.audio);
    this.theme = new ThemeManager(this.state);
    this.scoreManager = new ScoreManager();
    this.audioUnlocked = false;

    this.router = new Router(root, {
      "main-menu": () => new MainMenuScreen(this),
      game: (data) => new GameScreen(this, data),
      settings: () => new SettingsScreen(this),
      instructions: () => new InstructionsScreen(this),
      victory: (data) => new VictoryScreen(this, data)
    });

    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
  }

  init() {
    this.theme.apply();
    document.addEventListener("click", this.handleDocumentClick);
    window.addEventListener("beforeunload", this.handleBeforeUnload);
    this.navigate("main-menu");
  }

  handleDocumentClick(event) {
    if (event.target.closest("button")) {
      this.unlockAudio();
      this.sfx.play("click");
    }
  }

  handleBeforeUnload() {
    this.router.currentScreen?.persist?.();
  }

  async unlockAudio() {
    await this.audio.unlock();
    if (!this.audioUnlocked) {
      this.audioUnlocked = true;
      this.playMusicForCurrentScreen();
    }
  }

  playMusicForCurrentScreen() {
    if (!this.audioUnlocked) return;
    const difficulty = this.state.gameConfig
      ? getDifficultyById(DIFFICULTIES, this.state.gameConfig.difficultyId)
      : this.state.defaultDifficulty;
    this.music.playFor(this.router.currentName || "main-menu", difficulty);
  }

  navigate(screenName, data = {}) {
    this.router.navigate(screenName, data);
    this.playMusicForCurrentScreen();
  }

  canContinue() {
    return hasGameSnapshot();
  }

  continueGame() {
    const snapshot = loadGameSnapshot();
    if (!snapshot) {
      this.toast.show("沒有可繼續的遊戲", "error");
      return;
    }

    if (snapshot.imageSourceKind === "upload" && this.state.imageSourceKind !== "upload") {
      this.toast.show("自訂圖片不會寫入瀏覽器儲存，請重新上傳圖片後開始。", "error");
      return;
    }

    if (snapshot.imageSourceKind === "demo") {
      this.state.setImage(copyCanvas(this.defaultCanvas), snapshot.imageName || "預設插畫", "demo");
    }

    this.state.setGameConfig({
      difficultyId: snapshot.difficulty,
      imageSourceKind: snapshot.imageSourceKind || this.state.imageSourceKind
    });

    this.navigate("game", { snapshot });
  }

  async importImageFile(file) {
    const imported = await this.importer.importFile(file);
    return {
      canvas: toCenterSquare(imported.image, IMAGE_RULES.outputSize),
      name: imported.name
    };
  }

  startGame({ sourceCanvas, imageName, sourceKind, difficultyId, snapshot = null }) {
    this.state.setImage(copyCanvas(sourceCanvas), imageName, sourceKind);
    this.state.setGameConfig({ difficultyId, imageSourceKind: sourceKind });
    this.navigate("game", { snapshot });
  }

  restartCurrentGame() {
    const config = this.state.gameConfig || {
      difficultyId: this.state.settings.defaultDifficulty,
      imageSourceKind: this.state.imageSourceKind
    };
    clearGameSnapshot();
    this.state.setGameConfig(config);
    this.navigate("game");
  }

  saveCurrentGame({ engineSnapshot, elapsedSeconds }) {
    if (!engineSnapshot || !this.state.gameConfig) return;
    saveGameSnapshot({
      difficulty: engineSnapshot.difficulty,
      pieces: engineSnapshot.pieces,
      elapsedSeconds,
      imageSourceKind: this.state.imageSourceKind,
      imageName: this.state.imageName
    });
  }

  finishGame({ elapsedSeconds, difficultyId, imageCanvas, imageName }) {
    clearGameSnapshot();
    const score = this.scoreManager.record(difficultyId, elapsedSeconds);
    this.state.lastResult = {
      elapsedSeconds,
      difficultyId,
      imageCanvas: imageCanvas || this.getDefaultCanvas(),
      imageName,
      bestSeconds: score.best,
      isNewBest: score.isNewBest
    };
    this.navigate("victory", this.state.lastResult);
  }

  updateSettings(partial) {
    this.audioSettings.update(partial);
    if (partial.theme) this.theme.apply(partial.theme);
    this.playMusicForCurrentScreen();
  }

  setTheme(themeId) {
    this.theme.set(themeId);
    this.playMusicForCurrentScreen();
    this.router.refresh();
  }

  getDefaultCanvas() {
    return this.defaultCanvas;
  }

  createDefaultImage() {
    const size = IMAGE_RULES.outputSize;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const sky = ctx.createLinearGradient(0, 0, 0, size * 0.62);
    sky.addColorStop(0, "#7dd3fc");
    sky.addColorStop(0.56, "#fef3c7");
    sky.addColorStop(1, "#fb7185");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "#fff7ed";
    ctx.beginPath();
    ctx.arc(size * 0.75, size * 0.2, size * 0.09, 0, Math.PI * 2);
    ctx.fill();

    drawMountain(ctx, [[0, 500], [150, 270], [280, 500]], "#34506b");
    drawMountain(ctx, [[150, 510], [410, 220], [690, 510]], "#223b57");
    drawMountain(ctx, [[450, 510], [645, 310], [800, 510]], "#48627b");

    const land = ctx.createLinearGradient(0, 500, 0, size);
    land.addColorStop(0, "#2d6a4f");
    land.addColorStop(1, "#95d5b2");
    ctx.fillStyle = land;
    ctx.fillRect(0, 500, size, 300);

    ctx.fillStyle = "#90e0ef";
    ctx.beginPath();
    ctx.moveTo(330, 800);
    ctx.bezierCurveTo(380, 700, 300, 610, 385, 520);
    ctx.bezierCurveTo(455, 590, 520, 680, 500, 800);
    ctx.closePath();
    ctx.fill();

    for (let i = 0; i < 9; i += 1) {
      drawTree(ctx, 64 + i * 82, 610 + (i % 3) * 32, 46 + (i % 2) * 12);
    }

    drawBalloon(ctx, 190, 170, "#d62b7a", "#ffd166");
    drawBalloon(ctx, 560, 145, "#0077b6", "#f97316");
    drawBalloon(ctx, 665, 275, "#52b788", "#ffffff");

    ctx.fillStyle = "rgba(255,255,255,0.86)";
    ctx.font = "900 58px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PUZZLE", size / 2, 100);
    ctx.font = "900 38px Nunito, sans-serif";
    ctx.fillText("CHALLENGE", size / 2, 146);

    return canvas;
  }
}

function drawMountain(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath();
  ctx.moveTo(points[1][0], points[1][1]);
  ctx.lineTo(points[1][0] - 42, points[1][1] + 72);
  ctx.lineTo(points[1][0] + 54, points[1][1] + 62);
  ctx.closePath();
  ctx.fill();
}

function drawTree(ctx, x, y, height) {
  ctx.fillStyle = "#6d4c41";
  ctx.fillRect(x - 6, y - height * 0.25, 12, height * 0.45);
  ctx.fillStyle = "#1b4332";
  ctx.beginPath();
  ctx.moveTo(x, y - height);
  ctx.lineTo(x - height * 0.38, y);
  ctx.lineTo(x + height * 0.38, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#2d6a4f";
  ctx.beginPath();
  ctx.moveTo(x, y - height * 1.18);
  ctx.lineTo(x - height * 0.28, y - height * 0.36);
  ctx.lineTo(x + height * 0.28, y - height * 0.36);
  ctx.closePath();
  ctx.fill();
}

function drawBalloon(ctx, x, y, primary, secondary) {
  ctx.fillStyle = primary;
  ctx.beginPath();
  ctx.ellipse(x, y, 38, 50, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = secondary;
  ctx.beginPath();
  ctx.ellipse(x, y, 14, 49, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(20,33,61,0.46)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 18, y + 42);
  ctx.lineTo(x - 10, y + 70);
  ctx.moveTo(x + 18, y + 42);
  ctx.lineTo(x + 10, y + 70);
  ctx.stroke();
  ctx.fillStyle = "#7c2d12";
  ctx.fillRect(x - 13, y + 68, 26, 18);
}

const app = new PuzzleApp(document.getElementById("app"));
app.init();
