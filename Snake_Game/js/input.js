// input.js
class InputHandler {
    constructor(game) {
        this.game = game;
        this.initKeyboard();
        this.initTouch();
    }

    initKeyboard() {
        window.addEventListener('keydown', (e) => {
            const key = e.key;
            
            // 方向控制
            if (['ArrowUp', 'w', 'W'].includes(key)) this.game.snake.setDirection({ x: 0, y: -1 });
            else if (['ArrowDown', 's', 'S'].includes(key)) this.game.snake.setDirection({ x: 0, y: 1 });
            else if (['ArrowLeft', 'a', 'A'].includes(key)) this.game.snake.setDirection({ x: -1, y: 0 });
            else if (['ArrowRight', 'd', 'D'].includes(key)) this.game.snake.setDirection({ x: 1, y: 0 });
            
            // 功能按鍵
            else if (key === ' ') this.game.togglePause();
            else if (key === 'r' || key === 'R') this.game.reset();
            else if (key === 'Escape') this.game.backToMenu();
        });
    }

    initTouch() {
        let touchStartX = 0;
        let touchStartY = 0;

        window.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            e.preventDefault(); // 防止捲動
        }, { passive: false });

        window.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            if (Math.max(absDx, absDy) > 30) { // 最小滑動距離
                if (absDx > absDy) {
                    this.game.snake.setDirection({ x: dx > 0 ? 1 : -1, y: 0 });
                } else {
                    this.game.snake.setDirection({ x: 0, y: dy > 0 ? 1 : -1 });
                }
            }
        });
    }
}
