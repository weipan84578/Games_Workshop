// renderer.js
class Renderer {
    constructor(canvas, gridSize) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = gridSize;
        this.cellSize = canvas.width / gridSize;
        this.theme = 'dark';
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid(showGrid = true) {
        if (!showGrid) return;
        this.ctx.strokeStyle = this.theme === 'neon' ? 'rgba(57, 255, 20, 0.1)' : 'rgba(15, 52, 96, 0.2)';
        this.ctx.lineWidth = 1;

        for (let i = 0; i <= this.gridSize; i++) {
            const pos = i * this.cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
        }
    }

    drawObstacles(obstacles) {
        this.ctx.fillStyle = this.theme === 'neon' ? '#ff0000' : '#4e4e4e';
        obstacles.forEach(obs => {
            const x = obs.x * this.cellSize;
            const y = obs.y * this.cellSize;
            this.drawRoundedRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2, 2);
            this.ctx.fill();
            
            // 霓虹主題發光
            if (this.theme === 'neon') {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#ff0000';
                this.ctx.strokeRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
                this.ctx.shadowBlur = 0;
            }
        });
    }

    drawSnake(snake) {
        const body = snake.getBody();
        const head = snake.getHead();

        body.forEach((part, index) => {
            const isHead = index === 0;
            const x = part.x * this.cellSize;
            const y = part.y * this.cellSize;
            const radius = this.cellSize * 0.4;

            this.ctx.save();
            
            if (isHead) {
                // 蛇頭顏色
                this.ctx.fillStyle = '#00d4aa';
                this.drawRoundedRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2, 5);
                this.ctx.fill();

                // 繪製眼睛
                this.drawEyes(x, y, snake.direction);
            } else {
                // 蛇身漸層
                const alpha = 1 - (index / body.length) * 0.6;
                this.ctx.fillStyle = `rgba(0, 122, 96, ${alpha})`;
                this.drawRoundedRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4, 4);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        });
    }

    drawEyes(x, y, dir) {
        this.ctx.fillStyle = '#fff';
        const eyeSize = this.cellSize * 0.15;
        const offset = this.cellSize * 0.25;

        let e1, e2;
        if (dir.x === 1) { // 右
            e1 = { x: x + this.cellSize * 0.7, y: y + offset };
            e2 = { x: x + this.cellSize * 0.7, y: y + this.cellSize - offset };
        } else if (dir.x === -1) { // 左
            e1 = { x: x + this.cellSize * 0.3, y: y + offset };
            e2 = { x: x + this.cellSize * 0.3, y: y + this.cellSize - offset };
        } else if (dir.y === 1) { // 下
            e1 = { x: x + offset, y: y + this.cellSize * 0.7 };
            e2 = { x: x + this.cellSize - offset, y: y + this.cellSize * 0.7 };
        } else { // 上
            e1 = { x: x + offset, y: y + this.cellSize * 0.3 };
            e2 = { x: x + this.cellSize - offset, y: y + this.cellSize * 0.3 };
        }

        this.ctx.beginPath();
        this.ctx.arc(e1.x, e1.y, eyeSize, 0, Math.PI * 2);
        this.ctx.arc(e2.x, e2.y, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 瞳孔
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(e1.x, e1.y, eyeSize * 0.5, 0, Math.PI * 2);
        this.ctx.arc(e2.x, e2.y, eyeSize * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawFood(foods) {
        foods.forEach(food => {
            const x = food.x * this.cellSize + this.cellSize / 2;
            const y = food.y * this.cellSize + this.cellSize / 2;
            const radius = this.cellSize * 0.4;

            this.ctx.save();
            
            // 黃金食物閃爍效果
            if (food.type === 'golden') {
                const pulse = Math.sin(Date.now() / 100) * 0.2 + 0.8;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = food.color;
                this.ctx.globalAlpha = pulse;
            }

            this.ctx.fillStyle = food.color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }

    drawRoundedRect(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x + r, y);
        this.ctx.arcTo(x + w, y, x + w, y + h, r);
        this.ctx.arcTo(x + w, y + h, x, y + h, r);
        this.ctx.arcTo(x, y + h, x, y, r);
        this.ctx.arcTo(x, y, x + w, y, r);
        this.ctx.closePath();
    }
}
