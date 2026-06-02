export class SFXPool {
  constructor(src, poolSize = 5) {
    this.pool = Array.from({ length: poolSize }, () => {
      const audio = new Audio(src);
      audio.preload = "auto";
      return audio;
    });
    this.index = 0;
  }

  play(volume = 1) {
    const audio = this.pool[this.index % this.pool.length];
    audio.currentTime = 0;
    audio.volume = volume;
    audio.play().catch(() => {});
    this.index += 1;
  }
}
