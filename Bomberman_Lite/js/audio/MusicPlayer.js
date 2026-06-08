(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  class MusicPlayer {
    constructor(audio) {
      this.audio = audio;
      this.currentTrack = null;
      this.noteIndex = 0;
      this.timer = 0;
    }

    switchBGM(trackId) {
      if (this.currentTrack === trackId && this.timer) return;
      this.stop();
      this.currentTrack = trackId;
      this.noteIndex = 0;
      this.start();
    }

    start() {
      const track = root.AudioAssets.bgm[this.currentTrack];
      if (!track) return;
      const interval = Math.max(80, 60000 / track.tempo / 2);
      this.timer = setInterval(() => {
        if (!this.audio.ready) return;
        const note = track.notes[this.noteIndex % track.notes.length];
        const harmony = track.notes[(this.noteIndex + 4) % track.notes.length] / 2;
        this.audio.tone(note, interval / 1000 * 0.82, {
          type: track.wave,
          gain: 0.035,
          bus: "bgm"
        });
        if (this.noteIndex % 4 === 0) {
          this.audio.tone(harmony, interval / 1000 * 1.6, {
            type: "triangle",
            gain: 0.025,
            bus: "bgm"
          });
        }
        this.noteIndex += 1;
      }, interval);
    }

    stop() {
      clearInterval(this.timer);
      this.timer = 0;
    }
  }

  root.MusicPlayer = MusicPlayer;
}());
