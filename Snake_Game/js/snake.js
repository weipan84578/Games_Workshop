// snake.js
class Snake {
    constructor(gridX, gridY) {
        this.initialLength = 3;
        this.reset(gridX, gridY);
    }

    reset(gridX, gridY) {
        this.body = [];
        // 初始位置在地圖中央，長度 3，向右
        for (let i = 0; i < this.initialLength; i++) {
            this.body.push({ x: gridX - i, y: gridY });
        }
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.queuedDirections = []; // Queue Buffer
        this.growing = 0;
    }

    setDirection(dir) {
        // 禁止 180 度反向操作
        if (dir.x === -this.direction.x && dir.x !== 0) return;
        if (dir.y === -this.direction.y && dir.y !== 0) return;

        if (this.queuedDirections.length < 2) {
            this.queuedDirections.push(dir);
        }
    }

    move() {
        // 處理排隊的方向輸入
        if (this.queuedDirections.length > 0) {
            const nextDir = this.queuedDirections.shift();
            // 再次檢查防止快速按下的 180 度反轉
            if (!(nextDir.x === -this.direction.x && nextDir.x !== 0) &&
                !(nextDir.y === -this.direction.y && nextDir.y !== 0)) {
                this.direction = nextDir;
            }
        }

        const head = this.getHead();
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };

        this.body.unshift(newHead);

        if (this.growing > 0) {
            this.growing--;
        } else {
            this.body.pop();
        }
    }

    grow(count = 1) {
        this.growing += count;
    }

    shrink(count = 2) {
        // 縮短蛇身（最短保留 3 格）
        const targetLength = Math.max(3, this.body.length - count);
        while (this.body.length > targetLength) {
            this.body.pop();
        }
    }

    checkSelfCollision() {
        const head = this.getHead();
        // 從索引 1 開始檢查，因為 0 是頭部
        for (let i = 1; i < this.body.length; i++) {
            if (Utils.isSamePos(head, this.body[i])) {
                return true;
            }
        }
        return false;
    }

    checkWallCollision(gridSize) {
        const head = this.getHead();
        return (
            head.x < 0 || 
            head.x >= gridSize || 
            head.y < 0 || 
            head.y >= gridSize
        );
    }

    handleWrapAround(gridSize) {
        const head = this.getHead();
        if (head.x < 0) head.x = gridSize - 1;
        else if (head.x >= gridSize) head.x = 0;
        
        if (head.y < 0) head.y = gridSize - 1;
        else if (head.y >= gridSize) head.y = 0;
    }

    getHead() {
        return this.body[0];
    }

    getBody() {
        return this.body;
    }
}
