// game.js
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.gridSize = 20;
        this.canvas.width = 400;
        this.canvas.height = 400;
        
        this.settings = Storage.getSettings();
        this.snake = new Snake(10, 10);
        this.food = new Food(this.gridSize);
        this.renderer = new Renderer(this.canvas, this.gridSize);
        this.input = new InputHandler(this);
        
        this.state = 'MENU'; // MENU, PLAYING, PAUSED, GAMEOVER
        this.mode = 'classic';
        this.difficulty = 'normal';
        
        this.score = 0;
        this.bestScore = Storage.getBestScore(this.mode);
        this.level = 1;
        this.baseSpeed = 150;
        this.speed = this.baseSpeed;
        
        this.lastTick = 0;
        this.comboTimer = 0;
        this.comboMultiplier = 1;
        
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
        
        this.obstacles = [];
        this.timeLeft = 0;
        this.maxTime = 60;
    }

    start(mode = 'classic', difficulty = 'normal') {
        this.mode = mode;
        this.difficulty = difficulty;
        this.reset();
        this.state = 'PLAYING';
        UI.showScreen('game-screen');
        this.updateStats();
    }

    reset() {
        this.snake.reset(10, 10);
        this.food.reset();
        this.score = 0;
        this.level = 1;
        
        const difficultySpeeds = { easy: 180, normal: 150, hard: 120 };
        this.baseSpeed = difficultySpeeds[this.difficulty] || 150;
        this.speed = this.baseSpeed;
        
        this.bestScore = Storage.getBestScore(this.mode);
        this.comboMultiplier = 1;
        this.comboTimer = 0;
        this.obstacles = [];

        if (this.mode === 'timeattack') {
            this.timeLeft = 60;
        } else if (this.mode === 'obstacle') {
            this.spawnObstacles(3);
        }

        this.state = 'PLAYING';
        this.updateStats();
        this.food.spawn([...this.snake.getBody(), ...this.obstacles]);
    }

    spawnObstacles(count) {
        for (let i = 0; i < count; i++) {
            const pos = Utils.getRandomGridPos(this.gridSize, [...this.snake.getBody(), ...this.obstacles]);
            this.obstacles.push(pos);
        }
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            UI.showPauseOverlay(true);
            if (typeof AudioSystem !== 'undefined') AudioSystem.play('pause');
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            UI.showPauseOverlay(false);
            if (typeof AudioSystem !== 'undefined') AudioSystem.play('resume');
        }
    }

    backToMenu() {
        this.state = 'MENU';
        UI.showScreen('main-menu');
    }

    update(now) {
        if (this.state !== 'PLAYING') return;

        if (now - this.lastTick >= this.speed) {
            this.lastTick = now;
            this.tick();
        }

        if (this.mode === 'timeattack') {
            this.timeLeft -= 16 / 1000;
            if (this.timeLeft <= 0) {
                this.timeLeft = 0;
                this.gameOver();
            }
            UI.updateTimer(this.timeLeft, this.maxTime);
        }

        this.food.update();
        
        if (this.comboTimer > 0) {
            this.comboTimer -= 16;
            if (this.comboTimer <= 0) {
                this.comboMultiplier = 1;
            }
        }
    }

    tick() {
        this.snake.move();
        if (typeof AudioSystem !== 'undefined') AudioSystem.play('move');

        const head = this.snake.getHead();

        if (this.settings.borderMode === 'wall') {
            if (this.snake.checkWallCollision(this.gridSize)) {
                this.gameOver();
                return;
            }
        } else {
            this.snake.handleWrapAround(this.gridSize);
        }

        if (this.snake.checkSelfCollision()) {
            this.gameOver();
            return;
        }

        if (this.obstacles.some(obs => Utils.isSamePos(head, obs))) {
            this.gameOver();
            return;
        }

        const eatenFood = this.food.items.find(f => Utils.isSamePos(head, f));
        if (eatenFood) {
            this.handleEat(eatenFood);
            this.food.remove(eatenFood.id);
            this.food.spawn([...this.snake.getBody(), ...this.obstacles]);
        }

        if (this.food.items.length < 2) {
            this.food.spawn([...this.snake.getBody(), ...this.obstacles]);
        }
    }

    handleEat(food) {
        if (typeof AudioSystem !== 'undefined') {
            if (food.type === 'golden') AudioSystem.play('eat_golden');
            else if (food.type === 'shrink') AudioSystem.play('shrink');
            else if (food.type === 'speed') AudioSystem.play('speed');
            else AudioSystem.play('eat');

            if (this.comboMultiplier > 1) {
                setTimeout(() => AudioSystem.play('eat_bonus'), 150);
            }
        }

        const points = food.score * this.comboMultiplier;
        this.score += Math.round(points);
        
        this.comboMultiplier = Math.min(3, this.comboMultiplier + 0.5);
        this.comboTimer = 3000;

        switch (food.effect) {
            case 'grow': this.snake.grow(1); break;
            case 'speed': this.snake.grow(1); break;
            case 'golden': this.snake.grow(1); break;
            case 'shrink': this.snake.shrink(2); break;
        }

        if (this.mode === 'timeattack') {
            const totalEaten = this.snake.body.length - 3;
            if (totalEaten % 5 === 0) {
                this.timeLeft = Math.min(90, this.timeLeft + 5);
            }
        } else if (this.mode === 'obstacle') {
            const totalEaten = this.snake.body.length - 3;
            if (totalEaten % 5 === 0) {
                this.spawnObstacles(1);
            }
        }

        const totalEaten = this.snake.body.length - 3;
        if (totalEaten > 0 && totalEaten % 5 === 0) {
            this.speed = Math.max(60, this.speed - 10);
            this.level++;
            if (typeof AudioSystem !== 'undefined') AudioSystem.play('level_up');
        }

        this.updateStats();
    }

    updateStats() {
        UI.updateScore(this.score, this.bestScore);
        UI.updateHeaderInfo(this.mode, this.difficulty);
    }

    gameOver() {
        if (this.state === 'GAMEOVER') return;
        this.state = 'GAMEOVER';
        if (typeof AudioSystem !== 'undefined') AudioSystem.play('death');
        
        const isNewRecord = Storage.saveBestScore(this.mode, this.score);
        Storage.saveScore(this.mode, {
            score: Math.round(this.score),
            date: new Date().toLocaleDateString()
        });
        
        UI.showGameOver(this.score, this.level, isNewRecord);
    }

    loop(now) {
        this.update(now);
        this.render();
        requestAnimationFrame(this.loop);
    }

    render() {
        this.renderer.clear();
        this.renderer.drawGrid(this.settings.grid);
        this.renderer.drawObstacles(this.obstacles);
        this.renderer.drawFood(this.food.items);
        this.renderer.drawSnake(this.snake);
    }
}
