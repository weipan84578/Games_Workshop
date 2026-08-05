import { SCREENS } from "../utils/constants.js";

export function createStateManager(initialScreen = SCREENS.MENU) {
  let currentScreen = initialScreen;
  let payload = {};
  const listeners = new Set();

  function transition(nextScreen, nextPayload = {}) {
    if (!Object.values(SCREENS).includes(nextScreen)) throw new Error(`Unknown screen: ${nextScreen}`);
    const previous = { screen: currentScreen, payload };
    currentScreen = nextScreen;
    payload = nextPayload;
    const next = { screen: currentScreen, payload };
    listeners.forEach((listener) => listener(next, previous));
    return next;
  }

  return {
    getState: () => ({ screen: currentScreen, payload }),
    transition,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
