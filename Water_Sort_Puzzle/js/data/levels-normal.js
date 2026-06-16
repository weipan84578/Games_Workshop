import { createLevelSet } from './level-factory.js';

export const LEVELS_NORMAL = createLevelSet({
  difficulty: 'normal',
  count: 40,
  colorMin: 6,
  colorMax: 8,
  seedBase: 4000,
  manual: [
    {
      id: 1,
      name: '六色開局',
      colors: 6,
      optimalMoves: 15,
      timeBenchmark: 105,
      tubes: [
        ['red', 'blue', 'orange', 'green'],
        ['green', 'yellow', 'red', 'cyan'],
        ['cyan', 'orange', 'blue', 'yellow'],
        ['yellow', 'green', 'cyan', 'red'],
        ['blue', 'red', 'yellow', 'orange'],
        ['orange', 'cyan', 'green', 'blue'],
        [],
        [],
      ],
    },
  ],
});
