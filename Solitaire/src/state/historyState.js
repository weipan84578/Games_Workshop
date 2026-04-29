const MAX_HISTORY = 100;
let history = [];

export function pushHistory(state) {
  history.push(JSON.parse(JSON.stringify(state)));
  if (history.length > MAX_HISTORY) history.shift();
}

export function popHistory() {
  return history.pop() || null;
}

export function clearHistory() {
  history = [];
}

export function historyLength() {
  return history.length;
}
