'use strict';

class Game {
  constructor(renderer, board, scoring, input, effects, settings) {
    this.renderer = renderer;
    this.board = board;
    this.scoring = scoring;
    this.input = input;
    this.effects = effects;
    this.settings = { ...settings };

    this.bag = new Bag();
    this.nextQueue = [];
    this.current = null;
    this.held = null;
    this.canHold = true;
    this.ghost = null;

    this.gravityAccum = 0;
    this.lockDelay = 0;
    this.lockMoveCount = 0;
    this.isOnGround = false;
    this.softDropActive = false;

    this.elapsed = 0; // seconds
    this.lastTime = null;
    this.raf = null;
    this.paused = false;
    this.over = false;
    this.waitingClear = false; // during clear animation

    this.onScoreUpdate = null;
    this.onLevelUp = null;
    this.onGameOver = null;
    this.onPause = null;
    this.onResume = null;
    this.onRestart = null;
  }

  init() {
    this.board.reset();
    this.scoring.reset();
    this.bag = new Bag();
    this.nextQueue = [];
    this.held = null; this.canHold = true;
    this.elapsed = 0; this.lastTime = null;
    this.over = false; this.paused = false; this.waitingClear = false;
    this.renderer.gameOverRows = 0;

    for (let i = 0; i < 4; i++) this.nextQueue.push(new Tetromino(this.bag.next()));
    this._spawnNext();
    this.input.enable();
  }

  _spawnNext() {
    this.current = this.nextQueue.shift();
    this.nextQueue.push(new Tetromino(this.bag.next()));
    this.current.x = 3; this.current.y = -1;
    this.canHold = true;
    this.gravityAccum = 0;
    this.lockDelay = 0; this.lockMoveCount = 0;
    this.isOnGround = false;

    if (this.board.isGameOver(this.current)) {
      this._triggerGameOver();
      return;
    }
    this._updateGhost();
    this._updateUI();
  }

  _updateGhost() {
    this.ghost = this.board.getGhost(this.current);
  }

  start() {
    this.init();
    Audio.startBGM(this.scoring.level >= 15);
    this._loop(performance.now());
  }

  _loop(now) {
    if (this.over) return;
    this.raf = requestAnimationFrame(t => this._loop(t));
    if (this.paused || this.waitingClear) {
      this.lastTime = null;
      this.renderer.render(this.board, this.current, this.ghost, this.settings.ghostPiece);
      this.renderer.renderHold(this.held, this.canHold);
      this.renderer.renderNextQueue(this.nextQueue);
      return;
    }

    const dt = this.lastTime ? Math.min((now - this.lastTime) / 1000, 0.1) : 0;
    this.lastTime = now;
    this.elapsed += dt;

    this._processInput();
    if (!this.over && !this.waitingClear) this._updateGravity(dt);

    this.renderer.render(this.board, this.current, this.ghost, this.settings.ghostPiece);
    this.renderer.renderHold(this.held, this.canHold);
    this.renderer.renderNextQueue(this.nextQueue);
  }

  _processInput() {
    const actions = this.input.consume();
    for (const action of actions) {
      if (this.over || this.waitingClear) break;
      switch(action) {
        case 'left':
          if (this.board.tryMove(this.current, -1, 0)) {
            Audio.SFX.move();
            this._resetLockIfGround();
            this._updateGhost();
          }
          break;
        case 'right':
          if (this.board.tryMove(this.current, 1, 0)) {
            Audio.SFX.move();
            this._resetLockIfGround();
            this._updateGhost();
          }
          break;
        case 'softDrop':
          if (this.board.tryMove(this.current, 0, 1)) {
            this.scoring.addDropBonus(1, false);
            this._updateScoreUI();
          } else {
            this._lockPiece();
          }
          break;
        case 'hardDrop':
          this._hardDrop();
          break;
        case 'rotateCW':
          if (this.board.tryRotate(this.current, 1)) {
            Audio.SFX.rotate();
            this._resetLockIfGround();
            this._updateGhost();
          }
          break;
        case 'rotateCCW':
          if (this.board.tryRotate(this.current, -1)) {
            Audio.SFX.rotate();
            this._resetLockIfGround();
            this._updateGhost();
          }
          break;
        case 'hold':
          this._holdPiece();
          break;
        case 'pause':
          this.togglePause();
          break;
        case 'restart':
          if (this.onRestart) this.onRestart();
          break;
      }
    }
  }

  _resetLockIfGround() {
    if (this.isOnGround) {
      if (this.lockMoveCount < 15) {
        this.lockDelay = 0;
        this.lockMoveCount++;
      }
    }
  }

  _updateGravity(dt) {
    const speed = this.scoring.getSpeed(this.scoring.level);
    this.gravityAccum += dt;

    while (this.gravityAccum >= speed) {
      this.gravityAccum -= speed;
      if (!this.board.tryMove(this.current, 0, 1)) {
        break; // hit ground, don't keep subtracting
      }
    }

    // Check if currently on ground
    const testDown = this.current.clone();
    testDown.y++;
    if (!this.board.isValid(testDown)) {
      this.isOnGround = true;
      this.lockDelay += dt;
      if (this.lockDelay >= 0.5 || this.lockMoveCount >= 15) {
        this._lockPiece();
      }
    } else {
      this.isOnGround = false;
      this.lockDelay = 0;
      this.lockMoveCount = 0;
    }
  }

  _hardDrop() {
    let cells = 0;
    while (this.board.tryMove(this.current, 0, 1)) cells++;
    this.scoring.addDropBonus(cells, true);
    Audio.SFX.hardDrop();
    this._lockPiece();
  }

  _lockPiece() {
    if (this.waitingClear) return;
    this.renderer.triggerLockFlash(this.current);
    const isTSpin = this.board.checkTSpin(this.current);
    this.board.lock(this.current);
    Audio.SFX.lock();

    const cleared = this.board.clearLines();
    const prevLevel = this.scoring.level;

    if (cleared.length > 0) {
      this.waitingClear = true;
      this.renderer.startClearAnim(cleared, () => {
        this.waitingClear = false;
        const wasbtb = this.scoring.btb;
        const pts = this.scoring.addLines(cleared.length, isTSpin);
        const combo = this.scoring.combo;
        const btb = wasbtb && (cleared.length === 4 || isTSpin);
        this.effects.showClearText(cleared.length, isTSpin, btb, combo > 0 ? combo : 0);

        if (cleared.length === 4) Audio.SFX.tetris();
        else if (isTSpin) Audio.SFX.tspin();
        else if (cleared.length === 3) Audio.SFX.clear3();
        else if (cleared.length === 2) Audio.SFX.clear2();
        else Audio.SFX.clear1();
        if (combo > 0) Audio.SFX.combo();
        if (btb) Audio.SFX.btb();

        if (this.scoring.level > prevLevel) {
          this.effects.showLevelUp(this.scoring.level);
          const wrapper = document.querySelector('.game-board-wrapper');
          if (wrapper) this.effects.flashBoard(wrapper);
          Audio.SFX.levelUp();
          if (this.scoring.level >= 15) Audio.startBGM(true);
        }

        this._updateUI();
        this._spawnNext();
      });
    } else {
      if (isTSpin) {
        const pts = this.scoring.addLines(0, true);
        Audio.SFX.tspin();
        this.effects.showClearText(0, true, false, 0);
      } else {
        this.scoring.combo = -1;
      }
      this._updateUI();
      this._spawnNext();
    }
  }

  _holdPiece() {
    if (!this.canHold) return;
    Audio.SFX.hold();
    const curType = this.current.type;
    if (this.held) {
      this.current = new Tetromino(this.held.type);
    } else {
      this.current = this.nextQueue.shift();
      this.nextQueue.push(new Tetromino(this.bag.next()));
    }
    this.held = new Tetromino(curType);
    this.current.x = 3; this.current.y = -1;
    this.canHold = false;
    this.gravityAccum = 0;
    this.lockDelay = 0; this.lockMoveCount = 0;
    this.isOnGround = false;
    this._updateGhost();
    this._updateUI();
  }

  _triggerGameOver() {
    this.over = true;
    Audio.SFX.gameOver();
    Audio.stopBGM();
    this.input.disable();
    this.renderer.animateGameOver(() => {
      if (this.onGameOver) this.onGameOver(this._getStats());
    });
  }

  _getStats() {
    return {
      score: this.scoring.score,
      lines: this.scoring.lines,
      level: this.scoring.level,
      time: this._formatTime(this.elapsed)
    };
  }

  _formatTime(s) {
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  }

  _updateUI() {
    if (this.onScoreUpdate) this.onScoreUpdate(this.scoring.score, this.scoring.lines, this.scoring.level, this._formatTime(this.elapsed), this.scoring.combo);
  }

  _updateScoreUI() { this._updateUI(); }

  togglePause() {
    if (this.over) return;
    if (this.paused) {
      this.paused = false;
      this.lastTime = null;
      Audio.fadeBGM(this.settings.bgmEnabled ? this.settings.bgmVolume : 0, 300);
      if (this.onResume) this.onResume();
    } else {
      this.paused = true;
      Audio.fadeBGM(0.3 * (this.settings.bgmEnabled ? this.settings.bgmVolume : 0), 300);
      if (this.onPause) this.onPause();
    }
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.input.disable();
    Audio.stopBGM();
  }

  updateSettings(s) {
    this.settings = { ...s };
    this.input.updateSettings(s);
    Audio.applySettings(s);
  }
}
