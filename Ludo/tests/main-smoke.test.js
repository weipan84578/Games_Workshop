'use strict';

const assert = require('assert');
const { loadLudo } = require('./helpers/load-ludo');

class ClassList {
  constructor(initial) {
    this.items = new Set((initial || '').split(/\s+/).filter(Boolean));
  }
  add(...names) { names.forEach((name) => this.items.add(name)); }
  remove(...names) { names.forEach((name) => this.items.delete(name)); }
  contains(name) { return this.items.has(name); }
  toggle(name, force) {
    const shouldAdd = force === undefined ? !this.items.has(name) : !!force;
    if (shouldAdd) this.items.add(name);
    else this.items.delete(name);
    return shouldAdd;
  }
}

class Element {
  constructor(id, className) {
    this.id = id || '';
    this.classList = new ClassList(className);
    this.attributes = {};
    this.style = {};
    this.value = '';
    this.textContent = '';
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name]; }
  addEventListener() {}
  getBoundingClientRect() { return { width: 600, height: 600 }; }
}

function createDocument() {
  const elements = new Map();
  const all = [];

  function add(id, className) {
    const el = new Element(id, className);
    elements.set(id, el);
    all.push(el);
    return el;
  }

  add('theme-stylesheet');
  add('version-tag');
  add('btn-continue', 'btn');
  add('screen-menu', 'screen active');
  add('screen-mode-select', 'screen');
  add('screen-game', 'screen');
  add('screen-instructions', 'screen');
  add('screen-settings', 'screen');
  add('board');
  add('set-bgm');
  add('set-sfx');
  add('set-mute');
  add('set-anim');
  add('set-anim-label');
  all.push(new Element('', 'board-area'));
  all.push(new Element('', 'theme-swatch'));

  return {
    readyState: 'complete',
    documentElement: new Element('html'),
    addEventListener() {},
    getElementById(id) { return elements.get(id) || null; },
    querySelector(selector) {
      if (selector === '.board-area') return all.find((el) => el.classList.contains('board-area')) || null;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === '.screen') return all.filter((el) => el.classList.contains('screen'));
      if (selector === '[data-theme-name]') return all.filter((el) => el.attributes['data-theme-name'] != null);
      if (selector === '.token.movable') return [];
      return [];
    }
  };
}

global.document = createDocument();
global.localStorage = {
  getItem() { return null; },
  setItem() {},
  removeItem() {}
};
global.addEventListener = function () {};
global.scrollTo = function () {};
global.requestAnimationFrame = function (fn) { fn(); return 1; };
global.cancelAnimationFrame = function () {};

const L = loadLudo([
  'js/core/namespace.js',
  'js/core/config.js',
  'js/core/state.js',
  'js/core/storage.js',
  'js/engine/board.js',
  'js/engine/rules.js',
  'js/engine/dice.js',
  'js/engine/token.js',
  'js/engine/turn.js',
  'js/ai/ai-easy.js',
  'js/ai/ai-normal.js',
  'js/ai/ai-hard.js',
  'js/ai/ai-manager.js',
  'js/audio/sound-list.js',
  'js/audio/audio-manager.js',
  'js/ui/screen-manager.js',
  'js/ui/menu.js',
  'js/ui/settings.js',
  'js/ui/instructions.js',
  'js/ui/render-board.js',
  'js/ui/render-tokens.js',
  'js/ui/hud.js',
  'js/ui/animations.js',
  'js/input/pointer.js',
  'js/input/mobile-controls.js',
  'js/main.js'
]);

assert.strictEqual(L.ui.screen.current(), 'screen-menu');
assert.strictEqual(document.getElementById('screen-menu').classList.contains('active'), true);
assert.strictEqual(document.getElementById('version-tag').textContent, L.config.VERSION);
assert.strictEqual(document.getElementById('theme-stylesheet').attributes.href, 'css/themes/classic.css');

console.log('main-smoke.test.js passed');
