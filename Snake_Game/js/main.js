// main.js
window.onload = () => {
    // 初始化遊戲實例
    const game = new Game();
    
    // 初始化 UI 控制
    UI.init(game);
    
    // 初始化音效
    AudioSystem.init();

    console.log("Snake Game v1.0 Ready");
};
