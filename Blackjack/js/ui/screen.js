export class ScreenManager {
  constructor() {
    this.screens = [...document.querySelectorAll(".screen")];
  }

  show(name) {
    this.screens.forEach((screen) => {
      screen.classList.toggle("is-active", screen.id === `${name}-screen`);
    });
  }
}
