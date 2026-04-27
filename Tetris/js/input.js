'use strict';

class InputHandler {
  constructor(settings) {
    this.das = settings.das ?? 167;
    this.arr = settings.arr ?? 33;
    this.keys = {};
    this.queue = [];
    this.dasActive = {};
    this.dasTimers = {};
    this.arrTimers = {};
    this.enabled = false;
    this._onKey = this._onKey.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
  }

  enable() {
    if (this.enabled) return;
    document.addEventListener('keydown', this._onKey);
    document.addEventListener('keyup',  this._onKeyUp);
    this.enabled = true;
  }

  disable() {
    document.removeEventListener('keydown', this._onKey);
    document.removeEventListener('keyup',  this._onKeyUp);
    this.enabled = false;
    this.keys = {}; this.dasActive = {};
    Object.values(this.dasTimers).forEach(clearTimeout);
    Object.values(this.arrTimers).forEach(clearInterval);
    this.dasTimers = {}; this.arrTimers = {};
  }

  updateSettings(s) { this.das = s.das; this.arr = s.arr; }

  _mapKey(e) {
    switch(e.code) {
      case 'ArrowLeft':  case 'KeyA': return 'left';
      case 'ArrowRight': case 'KeyD': return 'right';
      case 'ArrowDown':  case 'KeyS': return 'softDrop';
      case 'ArrowUp':    case 'KeyW': case 'KeyX': return 'rotateCW';
      case 'KeyZ': return e.ctrlKey ? null : 'rotateCCW';
      case 'ControlLeft': case 'ControlRight': return 'rotateCCW';
      case 'Space':      return 'hardDrop';
      case 'KeyC':       case 'ShiftLeft': case 'ShiftRight': return 'hold';
      case 'KeyP':       case 'Escape': return 'pause';
      case 'KeyR':       return 'restart';
      default:           return null;
    }
  }

  _onKey(e) {
    const action = this._mapKey(e);
    if (!action) return;
    if (['left','right','softDrop','hardDrop','rotateCW','rotateCCW','hold','pause','restart'].includes(action))
      e.preventDefault();
    if (this.keys[action]) return; // already held
    this.keys[action] = true;
    this.queue.push(action);

    if (['left','right','softDrop'].includes(action)) {
      clearTimeout(this.dasTimers[action]);
      clearInterval(this.arrTimers[action]);
      this.dasTimers[action] = setTimeout(() => {
        this.arrTimers[action] = setInterval(() => {
          if (this.keys[action]) this.queue.push(action);
          else { clearInterval(this.arrTimers[action]); }
        }, this.arr === 0 ? 1 : this.arr);
      }, this.das);
    }
  }

  _onKeyUp(e) {
    const action = this._mapKey(e);
    if (!action) return;
    this.keys[action] = false;
    clearTimeout(this.dasTimers[action]);
    clearInterval(this.arrTimers[action]);
  }

  consume() {
    const q = this.queue.slice();
    this.queue = [];
    return q;
  }

  // Touch / virtual buttons
  bindMobileButton(el, action) {
    let dasT = null, arrT = null;

    const press = () => {
      this.queue.push(action);
      if (['left','right','softDrop'].includes(action)) {
        dasT = setTimeout(() => {
          arrT = setInterval(() => this.queue.push(action), this.arr === 0 ? 1 : this.arr);
        }, this.das);
      }
    };

    const release = () => {
      clearTimeout(dasT); clearInterval(arrT);
    };

    el.addEventListener('touchstart', (e) => { e.preventDefault(); press(); }, { passive: false });
    el.addEventListener('touchend',   (e) => { e.preventDefault(); release(); }, { passive: false });
    el.addEventListener('mousedown',  press);
    el.addEventListener('mouseup',    release);
    el.addEventListener('mouseleave', release);
  }
}
