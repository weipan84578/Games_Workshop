(function (window) {
  'use strict';

  class Renderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.time = 0;
      this.stars = Array.from({ length: 26 }, () => ({
        x: Math.random(),
        y: Math.random() * 0.46,
        r: Helpers.rand(0.8, 2.2),
        pulse: Helpers.rand(0, Math.PI * 2)
      }));
    }

    resize(width, height) {
      this.width = Math.max(1, width);
      this.height = Math.max(1, height);
      this.dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }

    render(scene) {
      this.time += scene.deltaTime || 16.67;
      this.clear();
      this.drawBackground(scene.score || 0, scene.tower.cameraY);
      this.drawCrane(scene.currentBlock, scene.tower);
      this.drawFoundation(scene.tower);

      scene.tower.blocks.forEach((block) => this.drawBlock(block, scene.tower.cameraY, { placed: true }));
      if (scene.currentBlock && scene.state === 'playing') {
        this.drawBlock(scene.currentBlock, scene.tower.cameraY, { active: true });
      }
      scene.fragments.forEach((fragment) => this.drawFragment(fragment, scene.tower.cameraY));
      this.drawVignette();
    }

    worldY(y, height, cameraY) {
      const ground = this.height - 58;
      return ground - (y - cameraY) - height;
    }

    drawBackground(score, cameraY) {
      const [top, mid, bottom] = ColorUtil.sky(score);
      const ctx = this.ctx;
      const grad = ctx.createLinearGradient(0, 0, 0, this.height);
      grad.addColorStop(0, top);
      grad.addColorStop(0.5, mid);
      grad.addColorStop(1, bottom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.save();
      ctx.globalAlpha = 0.8;
      this.stars.forEach((star) => {
        const twinkle = 0.55 + Math.sin(this.time * 0.002 + star.pulse) * 0.28;
        ctx.fillStyle = `rgba(255,255,255,${twinkle})`;
        ctx.beginPath();
        ctx.arc(star.x * this.width, star.y * this.height + cameraY * 0.04, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      this.drawCityLayer(0.25, cameraY, 'rgba(8, 15, 29, 0.78)', 0.72);
      this.drawCityLayer(0.45, cameraY, 'rgba(5, 10, 20, 0.92)', 0.88);
    }

    drawCityLayer(parallax, cameraY, color, heightRatio) {
      const ctx = this.ctx;
      const base = this.height - 42 + cameraY * parallax;
      const buildingWidth = Math.max(32, this.width / 9);
      ctx.save();
      ctx.fillStyle = color;
      for (let i = -1; i < 11; i += 1) {
        const h = (48 + ((i * 37) % 72)) * heightRatio;
        const x = i * buildingWidth + ((cameraY * parallax) % buildingWidth) - buildingWidth;
        ctx.fillRect(x, base - h, buildingWidth * 0.72, h);
        ctx.fillStyle = 'rgba(255, 209, 102, 0.5)';
        for (let row = 0; row < Math.floor(h / 20); row += 1) {
          if ((row + i) % 3 === 0) ctx.fillRect(x + 9, base - h + row * 18 + 8, 4, 4);
          if ((row + i) % 4 === 0) ctx.fillRect(x + 24, base - h + row * 18 + 8, 4, 4);
        }
        ctx.fillStyle = color;
      }
      ctx.restore();
    }

    drawFoundation(tower) {
      const base = tower.blocks[0];
      if (!base) return;
      const ctx = this.ctx;
      const y = this.worldY(0, 0, tower.cameraY);
      const x = base.x - 22;
      const width = base.width + 44;

      ctx.save();
      ctx.fillStyle = 'rgba(8, 10, 15, 0.38)';
      ctx.beginPath();
      ctx.ellipse(this.width / 2, y + 34, width * 0.72, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#6E7788';
      ctx.fillRect(x, y - 12, width, 18);
      ctx.fillStyle = '#444B59';
      ctx.fillRect(x + 8, y + 6, width - 16, 12);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      for (let i = 0; i < 6; i += 1) {
        ctx.fillRect(x + 24 + i * 26, y - 25, 4, 16);
      }
      ctx.restore();
    }

    drawCrane(currentBlock, tower) {
      if (!currentBlock) return;
      const ctx = this.ctx;
      const blockY = this.worldY(currentBlock.y, currentBlock.height, tower.cameraY);
      const hookX = currentBlock.x + currentBlock.width / 2;

      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hookX, 32);
      ctx.lineTo(hookX, Math.max(40, blockY - 12));
      ctx.stroke();
      ctx.restore();
    }

    drawBlock(block, cameraY, flags = {}) {
      const ctx = this.ctx;
      const y = this.worldY(block.y, block.height, cameraY);
      if (y > this.height + 70 || y + block.height < -90) return;

      const depth = 9;
      const topDepth = 8;
      const palette = block.kind === 'foundation'
        ? { top: '#9AA4B4', face: '#6E7788', side: '#4B5362', beam: '#424A58', window: 'rgba(255,255,255,0.28)', windowDark: 'rgba(0,0,0,0.25)' }
        : ColorUtil.buildingPalette(block.hue);

      ctx.save();
      if (flags.active) {
        ctx.shadowBlur = 18;
        ctx.shadowColor = ColorUtil.hsl(block.hue, 62);
      } else {
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0,0,0,0.36)';
      }

      ctx.fillStyle = 'rgba(0,0,0,0.26)';
      ctx.fillRect(block.x + 3, y + block.height + 2, block.width, 8);

      ctx.shadowBlur = 0;
      ctx.fillStyle = palette.top;
      ctx.beginPath();
      ctx.moveTo(block.x, y + topDepth);
      ctx.lineTo(block.x + depth, y);
      ctx.lineTo(block.x + block.width + depth, y);
      ctx.lineTo(block.x + block.width, y + topDepth);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = palette.face;
      ctx.fillRect(block.x, y + topDepth, block.width, block.height - topDepth);

      ctx.fillStyle = palette.side;
      ctx.beginPath();
      ctx.moveTo(block.x + block.width, y + topDepth);
      ctx.lineTo(block.x + block.width + depth, y);
      ctx.lineTo(block.x + block.width + depth, y + block.height - 3);
      ctx.lineTo(block.x + block.width, y + block.height);
      ctx.closePath();
      ctx.fill();

      this.drawFloorDetails(block, y, topDepth, palette, flags.active);
      ctx.restore();
    }

    drawFloorDetails(block, y, topDepth, palette, active) {
      const ctx = this.ctx;
      const frontY = y + topDepth;
      const frontH = block.height - topDepth;

      ctx.save();
      ctx.fillStyle = palette.beam;
      ctx.globalAlpha = active ? 0.52 : 0.42;
      ctx.fillRect(block.x, frontY, block.width, 3);
      ctx.fillRect(block.x, frontY + frontH - 4, block.width, 4);
      ctx.fillRect(block.x + 5, frontY, 4, frontH);
      ctx.fillRect(block.x + block.width - 9, frontY, 4, frontH);

      const cols = Math.max(1, Math.floor(block.width / 34));
      const gap = block.width / (cols + 1);
      for (let i = 1; i <= cols; i += 1) {
        const wx = block.x + gap * i - 5;
        ctx.globalAlpha = 0.92;
        ctx.fillStyle = palette.windowDark;
        ctx.fillRect(wx, frontY + 8, 11, 11);
        ctx.fillStyle = palette.window;
        ctx.fillRect(wx + 1, frontY + 9, 4, 4);
        ctx.fillRect(wx + 6, frontY + 9, 4, 4);
      }

      if (active) {
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(block.x + 3, frontY + 3, Math.max(0, block.width - 6), 2);
      }
      ctx.restore();
    }

    drawFragment(fragment, cameraY) {
      const ctx = this.ctx;
      const y = this.worldY(fragment.y, fragment.height, cameraY);
      if (y > this.height + 90 || y + fragment.height < -90) return;
      const depth = 9;
      const topDepth = 8;
      const palette = ColorUtil.buildingPalette(fragment.hue);

      ctx.save();
      ctx.globalAlpha = fragment.opacity;
      ctx.translate(fragment.x + fragment.width / 2, y + fragment.height / 2);
      ctx.rotate(fragment.rotation);
      const x = -fragment.width / 2;
      const top = -fragment.height / 2;

      ctx.fillStyle = palette.top;
      ctx.beginPath();
      ctx.moveTo(x, top + topDepth);
      ctx.lineTo(x + depth, top);
      ctx.lineTo(x + fragment.width + depth, top);
      ctx.lineTo(x + fragment.width, top + topDepth);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = palette.face;
      ctx.fillRect(x, top + topDepth, fragment.width, fragment.height - topDepth);

      ctx.fillStyle = palette.side;
      ctx.beginPath();
      ctx.moveTo(x + fragment.width, top + topDepth);
      ctx.lineTo(x + fragment.width + depth, top);
      ctx.lineTo(x + fragment.width + depth, top + fragment.height - 3);
      ctx.lineTo(x + fragment.width, top + fragment.height);
      ctx.closePath();
      ctx.fill();

      this.drawFloorDetails({ x, width: fragment.width, height: fragment.height }, top, topDepth, palette, false);
      ctx.restore();
    }

    drawVignette() {
      const ctx = this.ctx;
      const grad = ctx.createRadialGradient(this.width / 2, this.height * 0.48, this.height * 0.1, this.width / 2, this.height * 0.5, this.height * 0.75);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.36)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  window.Renderer = Renderer;
})(window);
