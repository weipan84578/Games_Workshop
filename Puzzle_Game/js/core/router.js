export class Router {
  constructor(root, factories) {
    this.root = root;
    this.factories = factories;
    this.currentScreen = null;
    this.currentName = "";
  }

  navigate(name, data = {}) {
    this.currentScreen?.destroy?.();
    this.root.replaceChildren();

    const ScreenFactory = this.factories[name];
    if (!ScreenFactory) {
      throw new Error(`Unknown screen: ${name}`);
    }

    const screen = ScreenFactory(data);
    this.currentScreen = screen;
    this.currentName = name;
    this.root.append(screen.render());
    screen.afterRender?.();
  }

  refresh(data = {}) {
    if (this.currentName) this.navigate(this.currentName, data);
  }
}
