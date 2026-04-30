(function(ER) {
    var AudioManager = {
        ctx: null,
        masterGain: null,
        musicGain: null,
        sfxGain: null,
        _initialized: false,
        _currentBGM: null,
        _bgmScheduler: null,
        _bgmPlaying: false,
        _bgmType: null,
        _bpm: { menu: 140, game: 160, fast: 200 },

        init: function(settings) {
            if (this._initialized) return;
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                this.masterGain = this.ctx.createGain();
                this.musicGain = this.ctx.createGain();
                this.sfxGain = this.ctx.createGain();
                this.musicGain.connect(this.masterGain);
                this.sfxGain.connect(this.masterGain);
                this.masterGain.connect(this.ctx.destination);
                this.applySettings(settings);
                this._initialized = true;
            } catch(e) { console.warn('AudioContext failed:', e); }
        },

        applySettings: function(settings) {
            if (!this.ctx) return;
            var s = settings || {};
            if (this.masterGain) this.masterGain.gain.value = s.volMaster != null ? s.volMaster : 1.0;
            if (this.musicGain) this.musicGain.gain.value = s.volBGM != null ? s.volBGM : 0.7;
            if (this.sfxGain) this.sfxGain.gain.value = s.volSFX != null ? s.volSFX : 0.9;
        },

        resume: function() {
            if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
        },

        _stopBGM: function() {
            this._bgmPlaying = false;
            this._bgmType = null;
            if (this._bgmScheduler) { clearTimeout(this._bgmScheduler); this._bgmScheduler = null; }
        },

        _scheduleBGM: function(type) {
            if (!this.ctx || !this._bgmPlaying || this._bgmType !== type) return;
            var self = this;
            var melody, bpm;
            if (type === 'menu') { melody = ER.Synth.menuMelody; bpm = self._bpm.menu; }
            else if (type === 'fast') { melody = ER.Synth.gameFastMelody; bpm = self._bpm.fast; }
            else { melody = ER.Synth.gameMelody; bpm = self._bpm.game; }

            var startTime = self.ctx.currentTime;
            var endTime = ER.Synth.playMelody(self.ctx, self.musicGain, melody, startTime, bpm);
            var dur = (endTime - startTime) * 1000;
            self._bgmScheduler = setTimeout(function() {
                if (self._bgmPlaying && self._bgmType === type) self._scheduleBGM(type);
            }, Math.max(0, dur - 100));
        },

        playBGM: function(type) {
            if (!this.ctx) return;
            if (this._bgmType === type && this._bgmPlaying) return;
            this._stopBGM();
            this._bgmPlaying = true;
            this._bgmType = type;
            this._scheduleBGM(type);
        },

        stopBGM: function() { this._stopBGM(); },

        playSFX: function(name) {
            if (!this.ctx || !ER.Synth[name]) return;
            try { ER.Synth[name](this.ctx, this.sfxGain); } catch(e) {}
        },

        suspend: function() { if (this.ctx) this.ctx.suspend(); },

        setVolume: function(type, val) {
            if (!this.ctx) return;
            if (type === 'master' && this.masterGain) this.masterGain.gain.value = val;
            if (type === 'bgm' && this.musicGain) this.musicGain.gain.value = val;
            if (type === 'sfx' && this.sfxGain) this.sfxGain.gain.value = val;
        }
    };

    ER.Audio = AudioManager;
})(window.ER = window.ER || {});
