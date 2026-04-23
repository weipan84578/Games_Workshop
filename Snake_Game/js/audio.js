// audio.js
const AudioSystem = {
    ctx: null,
    enabled: true,

    init() {
        const initAudio = () => {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
            window.removeEventListener('click', initAudio);
            window.removeEventListener('keydown', initAudio);
        };
        window.addEventListener('click', initAudio);
        window.addEventListener('keydown', initAudio);
    },

    play(type) {
        if (!this.ctx || !this.enabled) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;

        switch (type) {
            case 'eat': 
                this.playTone(600, 0.1, 'square', 0.1, 1000);
                break;
            case 'eat_golden':
                this.playTone(400, 0.3, 'triangle', 0.2, 1200);
                break;
            case 'eat_bonus': // 連擊加成
                this.playTone(800, 0.1, 'sine', 0.15, 1200);
                setTimeout(() => this.playTone(1000, 0.1, 'sine', 0.15, 1500), 50);
                break;
            case 'shrink': // 縮短音效 (下降)
                this.playTone(800, 0.2, 'sawtooth', 0.1, 200);
                break;
            case 'speed': // 加速音效 (快速上升)
                this.playTone(300, 0.15, 'square', 0.1, 1500);
                break;
            case 'move': // 移動滴答聲 (極短)
                this.playTone(150, 0.02, 'sine', 0.02);
                break;
            case 'death':
                this.playTone(300, 0.6, 'sawtooth', 0.2, 50);
                break;
            case 'level_up':
                this.playTone(500, 0.1, 'square', 0.1, 800);
                setTimeout(() => this.playTone(700, 0.2, 'square', 0.1, 1000), 100);
                break;
            case 'click': // 按鈕點擊
                this.playTone(1000, 0.05, 'sine', 0.1, 500);
                break;
            case 'pause':
                this.playTone(400, 0.1, 'sine', 0.1, 300);
                break;
            case 'resume':
                this.playTone(300, 0.1, 'sine', 0.1, 400);
                break;
        }
    },

    playTone(freq, duration, type, volume, endFreq = null) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        if (endFreq !== null) {
            osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);
        }
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
};
