(function(ER) {
    ER.Synth = {
        jump: function(ctx, dst) {
            var o = ctx.createOscillator(), g = ctx.createGain();
            o.connect(g); g.connect(dst);
            o.frequency.setValueAtTime(300, ctx.currentTime);
            o.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
            g.gain.setValueAtTime(0.35, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.15);
        },
        doubleJump: function(ctx, dst) {
            var o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'square';
            o.connect(g); g.connect(dst);
            o.frequency.setValueAtTime(500, ctx.currentTime);
            o.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
            g.gain.setValueAtTime(0.3, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.15);
        },
        land: function(ctx, dst) {
            var o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'triangle';
            o.connect(g); g.connect(dst);
            o.frequency.setValueAtTime(200, ctx.currentTime);
            o.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);
            g.gain.setValueAtTime(0.3, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.1);
        },
        coin: function(ctx, dst) {
            var o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'sine';
            o.connect(g); g.connect(dst);
            o.frequency.setValueAtTime(880, ctx.currentTime);
            o.frequency.setValueAtTime(1100, ctx.currentTime + 0.05);
            g.gain.setValueAtTime(0.3, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.2);
        },
        coinRare: function(ctx, dst) {
            var t = ctx.currentTime;
            [880, 1100, 1320, 1760].forEach(function(freq, i) {
                var o = ctx.createOscillator(), g = ctx.createGain();
                o.type = 'sine';
                o.connect(g); g.connect(dst);
                o.frequency.value = freq;
                g.gain.setValueAtTime(0, t + i*0.08);
                g.gain.linearRampToValueAtTime(0.25, t + i*0.08 + 0.04);
                g.gain.exponentialRampToValueAtTime(0.001, t + i*0.08 + 0.12);
                o.start(t + i*0.08); o.stop(t + i*0.08 + 0.15);
            });
        },
        hit: function(ctx, dst) {
            var bufSize = Math.floor(ctx.sampleRate * 0.3);
            var buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
            var data = buf.getChannelData(0);
            for (var i = 0; i < bufSize; i++)
                data[i] = (Math.random()*2-1) * Math.pow(1 - i/bufSize, 2);
            var src = ctx.createBufferSource();
            var bq = ctx.createBiquadFilter();
            bq.type = 'lowpass'; bq.frequency.value = 300;
            var g = ctx.createGain();
            src.buffer = buf;
            src.connect(bq); bq.connect(g); g.connect(dst);
            g.gain.setValueAtTime(0.6, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            src.start(ctx.currentTime);
        },
        die: function(ctx, dst) {
            var o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'sawtooth';
            o.connect(g); g.connect(dst);
            o.frequency.setValueAtTime(400, ctx.currentTime);
            o.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.8);
            g.gain.setValueAtTime(0.5, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
            o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.8);
        },
        btnClick: function(ctx, dst) {
            var o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'square';
            o.connect(g); g.connect(dst);
            o.frequency.value = 440;
            g.gain.setValueAtTime(0.15, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.08);
        },
        countdown: function(ctx, dst, isGo) {
            var o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'square';
            o.connect(g); g.connect(dst);
            o.frequency.value = isGo ? 880 : 440;
            var dur = isGo ? 0.3 : 0.15;
            g.gain.setValueAtTime(0.3, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
            o.start(ctx.currentTime); o.stop(ctx.currentTime + dur);
        },
        combo: function(ctx, dst) {
            var t = ctx.currentTime;
            [440, 550, 660, 880].forEach(function(freq, i) {
                var o = ctx.createOscillator(), g = ctx.createGain();
                o.type = 'square';
                o.connect(g); g.connect(dst);
                o.frequency.value = freq;
                g.gain.setValueAtTime(0.2, t + i*0.06);
                g.gain.exponentialRampToValueAtTime(0.001, t + i*0.06 + 0.1);
                o.start(t + i*0.06); o.stop(t + i*0.06 + 0.12);
            });
        },
        newRecord: function(ctx, dst) {
            var t = ctx.currentTime;
            [523, 659, 784, 1047].forEach(function(freq, i) {
                var o = ctx.createOscillator(), g = ctx.createGain();
                o.type = 'square';
                o.connect(g); g.connect(dst);
                o.frequency.value = freq;
                g.gain.setValueAtTime(0.3, t + i*0.15);
                g.gain.exponentialRampToValueAtTime(0.001, t + i*0.15 + 0.2);
                o.start(t + i*0.15); o.stop(t + i*0.15 + 0.25);
            });
        },
        speedUp: function(ctx, dst) {
            var o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'sawtooth';
            o.connect(g); g.connect(dst);
            o.frequency.setValueAtTime(100, ctx.currentTime);
            o.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);
            g.gain.setValueAtTime(0.2, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.5);
        },

        // BGM: generate a looping sequence of notes
        _noteFreqs: {
            'C3':130.81,'D3':146.83,'E3':164.81,'F3':174.61,'G3':196,'A3':220,'B3':246.94,
            'C4':261.63,'D4':293.66,'E4':329.63,'F4':349.23,'G4':392,'A4':440,'B4':493.88,
            'C5':523.25,'D5':587.33,'E5':659.25,'G5':783.99,'A5':880
        },

        menuMelody: [
            {n:'C4',d:0.25},{n:'E4',d:0.25},{n:'G4',d:0.25},{n:'C5',d:0.5},
            {n:'G4',d:0.25},{n:'E4',d:0.25},{n:'C4',d:0.5},
            {n:'D4',d:0.25},{n:'F4',d:0.25},{n:'A4',d:0.25},{n:'D5',d:0.5},
            {n:'A4',d:0.25},{n:'F4',d:0.25},{n:'D4',d:0.5},
            {n:'E4',d:0.25},{n:'G4',d:0.25},{n:'B4',d:0.25},{n:'E5',d:0.5},
            {n:'B4',d:0.25},{n:'G4',d:0.25},{n:'E4',d:0.5},
            {n:'C4',d:0.25},{n:'E4',d:0.25},{n:'G4',d:0.25},{n:'C5',d:1.0}
        ],

        gameMelody: [
            {n:'C4',d:0.125},{n:'C4',d:0.125},{n:'G4',d:0.25},{n:'E4',d:0.25},
            {n:'A4',d:0.125},{n:'A4',d:0.125},{n:'G4',d:0.25},{n:'F4',d:0.25},
            {n:'E4',d:0.125},{n:'E4',d:0.125},{n:'D4',d:0.25},{n:'C4',d:0.5},
            {n:'G3',d:0.125},{n:'G3',d:0.125},{n:'C4',d:0.25},{n:'B3',d:0.25},
            {n:'A3',d:0.125},{n:'B3',d:0.125},{n:'C4',d:0.125},{n:'D4',d:0.125},{n:'E4',d:0.5},
            {n:'G4',d:0.125},{n:'G4',d:0.125},{n:'A4',d:0.25},{n:'G4',d:0.125},
            {n:'F4',d:0.125},{n:'E4',d:0.25},{n:'D4',d:0.25},{n:'C4',d:0.5}
        ],

        gameFastMelody: [
            {n:'C5',d:0.0625},{n:'C5',d:0.0625},{n:'G4',d:0.125},{n:'E5',d:0.125},
            {n:'A4',d:0.0625},{n:'A4',d:0.0625},{n:'G4',d:0.125},{n:'F4',d:0.125},
            {n:'E4',d:0.0625},{n:'E4',d:0.0625},{n:'D4',d:0.125},{n:'C4',d:0.25},
            {n:'G3',d:0.0625},{n:'G3',d:0.0625},{n:'C4',d:0.125},{n:'B3',d:0.125},
            {n:'A3',d:0.0625},{n:'B3',d:0.0625},{n:'C4',d:0.0625},{n:'D4',d:0.0625},{n:'E5',d:0.25},
            {n:'G5',d:0.0625},{n:'G5',d:0.0625},{n:'A5',d:0.125},{n:'G5',d:0.0625},
            {n:'F4',d:0.0625},{n:'E4',d:0.125},{n:'D4',d:0.125},{n:'C5',d:0.25}
        ],

        playMelody: function(ctx, dst, melody, startTime, bpm) {
            var self = this;
            var beatLen = 60 / (bpm || 160);
            var t = startTime;
            melody.forEach(function(note) {
                var freq = self._noteFreqs[note.n];
                if (!freq) { t += note.d * beatLen; return; }
                var o = ctx.createOscillator(), g = ctx.createGain();
                o.type = 'square';
                o.connect(g); g.connect(dst);
                o.frequency.value = freq;
                var dur = note.d * beatLen;
                g.gain.setValueAtTime(0, t);
                g.gain.linearRampToValueAtTime(0.15, t + 0.01);
                g.gain.setValueAtTime(0.12, t + dur * 0.7);
                g.gain.linearRampToValueAtTime(0, t + dur);
                o.start(t); o.stop(t + dur + 0.01);
                t += dur;
            });
            return t; // return end time
        },

        getMelodyDuration: function(melody, bpm) {
            var beatLen = 60 / (bpm || 160);
            return melody.reduce(function(s, n) { return s + n.d * beatLen; }, 0);
        }
    };
})(window.ER = window.ER || {});
