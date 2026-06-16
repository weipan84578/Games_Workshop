import { createLevelSet } from './level-factory.js';

export const LEVELS_EASY = createLevelSet({
  difficulty: 'easy',
  count: 30,
  colorMin: 4,
  colorMax: 5,
  seedBase: 1000,
  manual: [
    {
      id: 1,
      name: '初次分流',
      colors: 4,
      optimalMoves: 7,
      timeBenchmark: 60,
      tubes: [
        ['red', 'blue', 'red', 'blue'],
        ['blue', 'red', 'blue', 'red'],
        ['yellow', 'green', 'yellow', 'green'],
        ['green', 'yellow', 'green', 'yellow'],
        [],
        [],
      ],
    },
    {
      id: 2,
      name: '交錯雙色',
      colors: 4,
      optimalMoves: 9,
      timeBenchmark: 70,
      tubes: [
        ['red', 'yellow', 'blue', 'green'],
        ['green', 'red', 'yellow', 'blue'],
        ['blue', 'green', 'red', 'yellow'],
        ['yellow', 'blue', 'green', 'red'],
        [],
        [],
      ],
    },
  ],
});
