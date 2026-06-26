(function (window) {
  'use strict';

  class StackTowerGame {
    constructor(canvas, callbacks = {}) {
      this.renderer = new Renderer(canvas);
      this.callbacks = callbacks;
      this.tower = new Tower(34);
      this.currentBlock = null;
      this.fragments = [];
      this.state = 'idle';
      this.score = 0;
      this.floors = 0;
      this.combo = 0;
      this.lastTime = 0;
      this.rafId = 0;
      this.savedCanvasWidth = 0;
    }

    resize(width, height) {
      const oldWidth = this.renderer.width;
      this.renderer.resize(width, height);
      if (oldWidth > 0 && Math.abs(oldWidth - width) > 1) {
        const ratio = width / oldWidth;
        this.tower.scaleX(ratio);
        if (this.currentBlock) {
          this.currentBlock.x *= ratio;
          this.currentBlock.width *= ratio;
        }
        this.fragments.forEach((fragment) => {
          fragment.x *= ratio;
          fragment.width *= ratio;
        });
      }
      this.render(16.67);
    }

    startNew() {
      this.cancelLoop();
      this.score = 0;
      this.floors = 0;
      this.combo = 0;
      this.fragments = [];
      this.tower.reset(34);
      const baseWidth = Math.max(132, this.renderer.width * 0.62);
      this.tower.add(new Block({
        x: (this.renderer.width - baseWidth) / 2,
        y: 0,
        width: baseWidth,
        height: this.tower.blockHeight,
        hue: 28,
        floorIndex: 0,
        kind: 'foundation'
      }));
      this.spawnNextBlock();
      this.state = 'playing';
      Storage.remove('save');
      this.emitHud();
      this.loop();
    }

    load(save) {
      if (!save || !save.tower) return false;
      this.cancelLoop();
      this.score = save.score || 0;
      this.floors = save.floors || 0;
      this.combo = save.combo || 0;
      this.tower = Tower.from(save.tower);
      this.currentBlock = save.currentBlock ? Block.from(save.currentBlock) : null;
      this.fragments = [];
      if (save.canvasWidth && this.renderer.width && Math.abs(save.canvasWidth - this.renderer.width) > 1) {
        const ratio = this.renderer.width / save.canvasWidth;
        this.tower.scaleX(ratio);
        if (this.currentBlock) {
          this.currentBlock.x *= ratio;
          this.currentBlock.width *= ratio;
        }
      }
      if (!this.currentBlock) this.spawnNextBlock();
      this.state = 'playing';
      this.emitHud();
      this.loop();
      return true;
    }

    pause() {
      if (this.state !== 'playing') return;
      this.state = 'paused';
      this.save();
      this.cancelLoop();
      this.render(16.67);
    }

    resume() {
      if (this.state !== 'paused') return;
      this.state = 'playing';
      this.loop();
    }

    quitToMenu() {
      if (this.state === 'playing' || this.state === 'paused') this.save();
      this.state = 'idle';
      this.cancelLoop();
      this.render(16.67);
    }

    spawnNextBlock() {
      const base = this.tower.topBlock();
      const floorIndex = this.tower.blocks.length;
      const direction = floorIndex % 2 === 0 ? -1 : 1;
      const width = base.width;
      const x = direction === 1 ? 0 : this.renderer.width - width;
      this.currentBlock = new Block({
        x,
        y: base.y + this.tower.blockHeight,
        width,
        height: this.tower.blockHeight,
        speed: Helpers.clamp(4 + this.floors * 0.35, 4, 14),
        direction,
        hue: ColorUtil.blockHue(floorIndex, this.score),
        floorIndex
      });
      this.tower.updateCamera(this.currentBlock.y, this.renderer.height);
    }

    place() {
      if (this.state !== 'playing' || !this.currentBlock) return;
      const base = this.tower.topBlock();
      const cut = Physics.calculateCut(this.currentBlock, base);

      if (cut.type === 'miss') {
        this.createMissFragment(this.currentBlock);
        this.gameOver();
        return;
      }

      const isPerfect = cut.type === 'perfect';
      if (isPerfect) {
        this.currentBlock.x = cut.newX;
        this.currentBlock.width = cut.newWidth;
        this.combo += 1;
      } else {
        this.createCutFragments(cut, this.currentBlock);
        this.currentBlock.x = cut.newX;
        this.currentBlock.width = cut.newWidth;
        this.combo = 0;
      }

      const points = Physics.calculateScore(this.currentBlock.width, base.width, isPerfect, this.combo);
      this.score += points;
      this.tower.add(this.currentBlock);
      this.floors = this.tower.blocks.length - 1;
      this.emitHud(true);

      if (isPerfect && this.combo >= 3) SFX.play('combo');
      else SFX.play(isPerfect ? 'perfect' : 'place');
      if (!isPerfect) SFX.play('cut');

      if (this.callbacks.onPlace) {
        this.callbacks.onPlace({
          points,
          isPerfect,
          combo: this.combo,
          score: this.score,
          floors: this.floors
        });
      }

      this.spawnNextBlock();
      this.save();
    }

    createCutFragments(cut, block) {
      [cut.cutLeft, cut.cutRight].forEach((piece, index) => {
        if (piece.width <= 1) return;
        this.fragments.push({
          x: piece.x,
          y: block.y,
          width: piece.width,
          height: block.height,
          hue: block.hue,
          kind: block.kind,
          vy: 0,
          vx: index === 0 ? -0.8 : 0.8,
          rotation: 0,
          spin: index === 0 ? -0.04 : 0.04,
          opacity: 1
        });
      });
      this.fragments = this.fragments.slice(-5);
    }

    createMissFragment(block) {
      this.fragments.push({
        x: block.x,
        y: block.y,
        width: block.width,
        height: block.height,
        hue: block.hue,
        kind: block.kind,
        vy: 0,
        vx: block.direction * 1.2,
        rotation: 0,
        spin: block.direction * 0.05,
        opacity: 1
      });
    }

    update(deltaTime) {
      if (this.state === 'playing' && this.currentBlock) {
        this.currentBlock.update(deltaTime, this.renderer.width);
        this.tower.updateCamera(this.currentBlock.y, this.renderer.height);
      }

      const frame = deltaTime / 16.67;
      this.fragments.forEach((fragment) => {
        fragment.x += fragment.vx * frame;
        fragment.y -= fragment.vy * frame;
        fragment.vy += 0.5 * frame;
        fragment.rotation += fragment.spin * frame;
        fragment.opacity -= 0.012 * frame;
      });
      this.fragments = this.fragments.filter((fragment) => fragment.opacity > 0);
    }

    render(deltaTime) {
      this.renderer.render({
        tower: this.tower,
        currentBlock: this.currentBlock,
        fragments: this.fragments,
        state: this.state,
        score: this.score,
        deltaTime
      });
    }

    loop(timestamp = performance.now()) {
      if (this.state !== 'playing') return;
      const deltaTime = this.lastTime ? Math.min(50, timestamp - this.lastTime) : 16.67;
      this.lastTime = timestamp;
      this.update(deltaTime);
      this.render(deltaTime);
      this.rafId = requestAnimationFrame((time) => this.loop(time));
    }

    cancelLoop() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = 0;
      this.lastTime = 0;
    }

    save() {
      if (!this.currentBlock || this.state === 'gameover') return false;
      const ok = Storage.set('save', {
        score: this.score,
        floors: this.floors,
        combo: this.combo,
        tower: this.tower.toJSON(),
        currentBlock: this.currentBlock.toJSON(),
        canvasWidth: this.renderer.width
      });
      if (!ok && this.callbacks.onStorageFail) this.callbacks.onStorageFail();
      return ok;
    }

    gameOver() {
      this.state = 'gameover';
      this.cancelLoop();
      Storage.remove('save');
      const previousBest = Storage.get('best', 0);
      const isBest = this.score > previousBest;
      if (isBest) Storage.set('best', this.score);
      if (window.Leaderboard) Leaderboard.add(this.score, this.floors);
      SFX.play('gameover');
      this.render(16.67);
      if (this.callbacks.onGameOver) {
        this.callbacks.onGameOver({
          score: this.score,
          floors: this.floors,
          isBest
        });
      }
    }

    emitHud(bump = false) {
      if (this.callbacks.onHud) {
        this.callbacks.onHud({
          score: this.score,
          floors: this.floors,
          bump
        });
      }
    }
  }

  window.StackTowerGame = StackTowerGame;
})(window);
