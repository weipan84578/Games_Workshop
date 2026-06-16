import { createLevelSet } from './level-factory.js';

export const LEVELS_HARD = createLevelSet({
  difficulty: 'hard',
  count: 50,
  colorMin: 9,
  colorMax: 12,
  seedBase: 9000,
});
