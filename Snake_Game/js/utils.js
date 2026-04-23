// utils.js
const Utils = {
    // 取得隨機整數 [min, max]
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // 取得隨機網格位置，且不在排除名單內 (如蛇身)
    getRandomGridPos(gridSize, excludeList = []) {
        let pos;
        let isExcluded;
        do {
            pos = {
                x: this.randomInt(0, gridSize - 1),
                y: this.randomInt(0, gridSize - 1)
            };
            isExcluded = excludeList.some(item => item.x === pos.x && item.y === pos.y);
        } while (isExcluded);
        return pos;
    },

    // 格式化時間 (秒 -> mm:ss)
    formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    },

    // 判斷兩點是否重疊
    isSamePos(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
    }
};
