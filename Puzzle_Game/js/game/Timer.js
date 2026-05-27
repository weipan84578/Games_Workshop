export class Timer {
  constructor({ startAt = 0, onTick }) {
    this.elapsedBeforeStart = startAt * 1000;
    this.onTick = onTick;
    this.startedAt = 0;
    this.intervalId = null;
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.startedAt = performance.now();
    this.intervalId = window.setInterval(() => this.tick(), 250);
    this.tick();
  }

  pause() {
    if (!this.running) return;
    this.elapsedBeforeStart = this.getElapsedMilliseconds();
    this.running = false;
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.tick();
  }

  resume() {
    this.start();
  }

  stop() {
    if (this.running) {
      this.elapsedBeforeStart = this.getElapsedMilliseconds();
    }
    this.running = false;
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.tick();
  }

  reset(seconds = 0) {
    this.elapsedBeforeStart = seconds * 1000;
    this.startedAt = performance.now();
    this.tick();
  }

  getElapsedMilliseconds() {
    if (!this.running) return this.elapsedBeforeStart;
    return this.elapsedBeforeStart + (performance.now() - this.startedAt);
  }

  getElapsedSeconds() {
    return Math.floor(this.getElapsedMilliseconds() / 1000);
  }

  tick() {
    this.onTick?.(this.getElapsedSeconds());
  }
}
