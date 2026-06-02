const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export class KeyboardVisualizer {
  constructor(container) {
    this.container = container;
    this.keys = new Map();
  }

  render() {
    this.container.innerHTML = "";
    this.keys.clear();
    this.container.className = "keyboard";
    for (const row of ROWS) {
      const rowEl = document.createElement("div");
      rowEl.className = "keyboard-row";
      for (const key of row) {
        const el = document.createElement("span");
        el.className = "key";
        el.textContent = key;
        rowEl.append(el);
        this.keys.set(key, el);
      }
      this.container.append(rowEl);
    }
  }

  flash(key) {
    const el = this.keys.get(String(key).toUpperCase());
    if (!el) return;
    el.classList.add("is-active");
    window.setTimeout(() => el.classList.remove("is-active"), 110);
  }

  setNext(key) {
    for (const el of this.keys.values()) {
      el.classList.remove("is-next");
    }
    const el = this.keys.get(String(key ?? "").toUpperCase());
    el?.classList.add("is-next");
  }
}
