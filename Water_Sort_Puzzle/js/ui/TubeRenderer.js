import { colorName } from '../data/color-palettes.js';
import { getTopColor, isComplete } from '../core/PourLogic.js';

function tubeLabel(tube, idx) {
  if (!tube.length) return `第 ${idx + 1} 支試管，空白`;
  const top = colorName(getTopColor(tube));
  return `第 ${idx + 1} 支試管，${tube.length} 格水，頂端 ${top}`;
}

export function renderTubes(container, tubes, options = {}) {
  const { selectedTube = null, hintMove = null, onTubeClick = () => {} } = options;

  container.innerHTML = tubes.map((tube, idx) => {
    const classes = [
      'tube',
      selectedTube === idx ? 'tube--selected' : '',
      isComplete(tube) ? 'tube--sealed' : '',
      isComplete(tube) ? 'tube--complete' : '',
      hintMove?.from === idx || hintMove?.to === idx ? 'tube--hint' : '',
      hintMove?.from === idx ? 'tube--source' : '',
      hintMove?.to === idx ? 'tube--target' : '',
    ].filter(Boolean).join(' ');

    const layers = tube
      .map((color) => `<span class="tube__layer tube__layer--${color}" aria-hidden="true"></span>`)
      .join('');

    return `
      <button class="${classes}" type="button" data-tube="${idx}" aria-label="${tubeLabel(tube, idx)}" aria-selected="${selectedTube === idx}">
        ${isComplete(tube) ? '<span class="tube__cork" aria-hidden="true"></span>' : ''}
        <span class="tube__stack">${layers}</span>
        <span class="tube__base" aria-hidden="true"></span>
      </button>
    `;
  }).join('');

  container.querySelectorAll('[data-tube]').forEach((button) => {
    button.addEventListener('click', () => onTubeClick(Number(button.dataset.tube)));
    button.addEventListener('touchstart', (event) => {
      event.preventDefault();
      onTubeClick(Number(button.dataset.tube));
    }, { passive: false });
  });
}
