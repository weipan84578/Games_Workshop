import { getFrameRecords, rollSymbol } from "../core/scoring.js";

export function renderScoreboard(container, rolls, { t, currentFrame = 1 } = {}) {
  if (!container) return;
  const translate = t || ((key) => key);
  const records = getFrameRecords(rolls);
  container.innerHTML = records.map((record) => {
    const symbols = record.rolls.map((roll, index) => rollSymbol(roll, index, record.rolls, record.type)).join(" ");
    const score = record.score === null ? translate("score_pending") : String(record.score);
    return `<div class="score-frame${record.number === currentFrame && !record.complete ? " is-current" : ""}" aria-label="${record.number}">
      <div class="score-frame__number">${record.number}</div>
      <div class="score-frame__rolls">${symbols || "&nbsp;"}</div>
      <div class="score-frame__total">${score}</div>
    </div>`;
  }).join("");
}

export function renderHudStats(root, { t, frame, ball, score, total } = {}) {
  if (!root) return;
  const translate = t || ((key) => key);
  root.querySelector("[data-role='frame-label']")?.replaceChildren(document.createTextNode(translate("game_frame", { n: frame })));
  root.querySelector("[data-role='frame-value']")?.replaceChildren(document.createTextNode(`${frame}`));
  root.querySelector("[data-role='ball-label']")?.replaceChildren(document.createTextNode(translate("game_ball", { n: ball })));
  root.querySelector("[data-role='ball-value']")?.replaceChildren(document.createTextNode(`${ball}`));
  root.querySelector("[data-role='score-value']")?.replaceChildren(document.createTextNode(`${score}`));
  root.querySelector("[data-role='total-value']")?.replaceChildren(document.createTextNode(`${total}`));
}
