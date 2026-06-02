export class Timer {
  constructor(callback, interval = 1000) {
    this.callback = callback;
    this.interval = interval;
    this.id = null;
  }

  start() {
    this.stop();
    this.id = window.setInterval(this.callback, this.interval);
  }

  stop() {
    if (this.id) {
      window.clearInterval(this.id);
      this.id = null;
    }
  }
}
