class FxPool {
  constructor(layer) {
    this.layer = layer;
  }

  spawn(type, x, y) {
    const node = document.createElement("span");
    node.className = `effect effect-${type}`;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    this.layer.append(node);
    window.setTimeout(() => node.remove(), type === "hole" ? 4200 : 750);
  }

  score(text, x, y) {
    const node = document.createElement("span");
    node.className = "floating-score";
    node.textContent = text;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    this.layer.append(node);
    window.setTimeout(() => node.remove(), 800);
  }
}
