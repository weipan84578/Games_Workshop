(function(ER) {
    var _lastTimestamp = 0;
    var _animId = null;
    var _scene = null;
    var _sceneName = '';

    ER.Game = {
        state: {
            scene: 'main',
            score: 0,
            bestScore: 0,
            lives: 3,
            speed: 5,
            gameTime: 0,
            isRunning: false,
            isPaused: false,
            comboCount: 0,
            quality: 'high',
            worldX: 0
        },

        init: function() {
            var data = ER.Storage.load();
            this.state.bestScore = data.bestScore;
            this.state.quality = data.settings.quality || 'high';

            ER.Audio.init(data.settings);

            // Resume audio on first user interaction
            var self = this;
            var initAudio = function() {
                ER.Audio.resume();
                ER.Audio.init(data.settings);
                document.removeEventListener('click', initAudio);
                document.removeEventListener('keydown', initAudio);
                document.removeEventListener('touchstart', initAudio);
            };
            document.addEventListener('click', initAudio);
            document.addEventListener('keydown', initAudio);
            document.addEventListener('touchstart', initAudio);

            document.addEventListener('visibilitychange', function() {
                if (document.hidden) ER.Audio.suspend();
                else ER.Audio.resume();
            });
        },

        gotoScene: function(name) {
            _sceneName = name;
            if (name === 'main') {
                _scene = ER.MainMenu;
                ER.Audio.playBGM('menu');
            } else if (name === 'game') {
                _scene = ER.GameScene;
            } else if (name === 'pause') {
                _scene = ER.PauseScene;
            } else if (name === 'gameover') {
                _scene = ER.GameOver;
                ER.GameOver.enter(this.state.score, this.state.bestScore);
                return;
            } else if (name === 'settings') {
                _scene = ER.Settings;
            }
            if (_scene && _scene.enter) _scene.enter();
        },

        startGame: function() {
            this.state.worldX = 0;
            this.gotoScene('game');
        },

        pauseGame: function() {
            this.state.isPaused = true;
            ER.Audio.stopBGM();
            _scene = ER.PauseScene;
            if (_scene.enter) _scene.enter();
        },

        resumeGame: function() {
            this.state.isPaused = false;
            var bgmType = this.state.gameTime >= 120 ? 'fast' : 'game';
            ER.Audio.playBGM(bgmType);
            _scene = ER.GameScene;
        },

        loop: function(timestamp) {
            _animId = requestAnimationFrame(function(ts) { ER.Game.loop(ts); });

            var dt = Math.min(timestamp - (_lastTimestamp || timestamp), 50);
            _lastTimestamp = timestamp;

            ER.Input.update();

            if (_scene) {
                _scene.update(dt);
                _scene.draw(ER.Renderer.ctx);
            }
        },

        start: function() {
            this.init();
            ER.Renderer.init(document.getElementById('gameCanvas'));
            ER.Input.init(ER.Renderer.canvas);

            var onResize = function() { ER.Renderer.resize(); };
            window.addEventListener('resize', onResize);
            // visualViewport fires when iOS URL bar shows/hides or keyboard appears
            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', onResize);
            }

            this.gotoScene('main');
            requestAnimationFrame(function(ts) { ER.Game.loop(ts); });
        }
    };
})(window.ER = window.ER || {});
