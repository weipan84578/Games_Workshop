export class Router {
  constructor(container) {
    this.container = container;
    this.screens = new Map();
    this.current = null;
    this.currentName = "";
  }

  register(name, screen) {
    this.screens.set(name, screen);
  }

  async navigate(name, params = {}) {
    const nextScreen = this.screens.get(name);
    if (!nextScreen) {
      throw new Error(`Unknown screen: ${name}`);
    }

    if (this.current?.unmount) {
      this.current.unmount();
    }

    this.current = nextScreen;
    this.currentName = name;
    this.container.innerHTML = "";
    const element = await nextScreen.mount(params);
    this.container.append(element);
    requestAnimationFrame(() => {
      element.querySelector("[data-autofocus]")?.focus();
    });
  }
}
