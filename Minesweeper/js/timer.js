class Timer {
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.seconds = 0;
        this.intervalId = null;
    }

    start() {
        if (this.intervalId) return;
        
        this.intervalId = setInterval(() => {
            this.seconds++;
            if (this.seconds > 999) {
                this.seconds = 999;
                this.stop();
            }
            this.updateDisplay();
        }, 1000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    reset() {
        this.stop();
        this.seconds = 0;
        this.updateDisplay();
    }

    updateDisplay() {
        if (this.displayElement) {
            this.displayElement.textContent = this.seconds.toString().padStart(3, '0');
        }
    }

    getTime() {
        return this.seconds;
    }
}

window.Timer = Timer;