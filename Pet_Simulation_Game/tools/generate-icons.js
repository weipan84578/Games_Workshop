'use strict';

const fs = require('fs');
const path = require('path');
const out = path.resolve(__dirname, '../assets/images/equipment');
fs.mkdirSync(out, { recursive: true });

const stages = ['#72b88a','#a56b45','#8ea3b8','#d29b34','#7669d8','#e15c76'];
const gear = {
  vital: '<path d="M32 50S12 39 12 24c0-12 15-15 20-5 5-10 20-7 20 5 0 15-20 26-20 26Z"/>',
  guard: '<path d="M32 10 51 17v14c0 12-8 20-19 25C21 51 13 43 13 31V17l19-7Zm0 9-10 4v8c0 7 4 12 10 16 6-4 10-9 10-16v-8l-10-4Z" fill-rule="evenodd"/>',
  strike: '<path d="m16 47 30-30 4 4-30 30-8 2 4-6Zm2-30 29 29-5 5-29-29 5-5Z"/>',
  spirit: '<path d="m32 9 6 15 16 2-12 11 4 17-14-9-14 9 4-17-12-11 16-2 6-15Z"/>',
  gale: '<path d="M12 25h28c8 0 8-11 1-11-4 0-5 3-5 5M10 33h38c9 0 9 13 0 13-5 0-7-4-7-7M15 41h18" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>',
  fortune: '<path d="M32 8 43 21 32 32 21 21 32 8Zm0 24 11 11-11 13-11-13 11-11ZM8 32l13-11 11 11-11 11L8 32Zm24 0 11-11 13 11-13 11-11-11Z"/> '
};
const consumables = {
  energy: '<path d="M24 9h16v8l6 7v30H18V24l6-7V9Zm5 18-5 13h8l-2 10 10-16h-8l4-7h-7Z" fill-rule="evenodd"/>',
  shield: '<path d="M13 25c0-8 8-13 19-13s19 5 19 13v17c0 8-8 12-19 12s-19-4-19-12V25Zm9 3h20v7H22v-7Z" fill-rule="evenodd"/>',
  focus: '<path d="m8 24 10-9 7 5h14l7-5 10 9-9 9 9 9-10 9-7-5H25l-7 5-10-9 9-9-9-9Zm24 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z" fill-rule="evenodd"/>'
};

function svg(color, shape, accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="${accent}"/></linearGradient></defs><rect x="3" y="3" width="58" height="58" rx="18" fill="url(#g)"/><g color="#fff" fill="#fff">${shape}</g><circle cx="50" cy="14" r="5" fill="#fff" opacity=".72"/></svg>`;
}

for (let stage = 1; stage <= 6; stage += 1) {
  Object.entries(gear).forEach(([key, shape]) => fs.writeFileSync(path.join(out, `eq_${stage}_${key}.svg`), svg(stages[stage - 1], shape, '#30243a')));
  Object.entries(consumables).forEach(([key, shape]) => fs.writeFileSync(path.join(out, `con_${stage}_${key}.svg`), svg(stages[stage - 1], shape, '#fff0b8')));
}
console.log('Generated 36 equipment icons and 18 consumable icons.');
