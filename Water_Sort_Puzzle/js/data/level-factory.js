import { COLOR_IDS } from './color-palettes.js';

function rng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled(values, seed) {
  const next = [...values];
  const random = rng(seed);
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function generatedTubes(colorCount, seed) {
  const colors = COLOR_IDS.slice(0, colorCount);
  const pool = colors.flatMap((color) => [color, color, color, color]);
  let packed = [];

  for (let attempt = 0; attempt < 18; attempt += 1) {
    const candidate = shuffled(pool, seed + attempt * 997);
    packed = [];
    for (let i = 0; i < colorCount; i += 1) {
      packed.push(candidate.slice(i * 4, i * 4 + 4));
    }

    const hasOnlyMixed = packed.every((tube) => new Set(tube).size > 1);
    const hasValidOpening = packed.some((tube) => tube[3] === packed[(packed.indexOf(tube) + 1) % packed.length]?.[3]);
    if (hasOnlyMixed || hasValidOpening) break;
  }

  return [...packed, [], []];
}

function normalizeManual(tubes) {
  return tubes.map((tube) => [...tube]);
}

export function createLevelSet({ difficulty, count, colorMin, colorMax, seedBase, manual = [] }) {
  const levels = [];

  for (const level of manual) {
    levels.push({
      difficulty,
      timeBenchmark: level.timeBenchmark,
      optimalMoves: level.optimalMoves,
      colors: level.colors,
      id: level.id,
      name: level.name,
      tubes: normalizeManual(level.tubes),
    });
  }

  for (let id = levels.length + 1; id <= count; id += 1) {
    const span = colorMax - colorMin + 1;
    const colors = colorMin + ((id - 1) % span);
    levels.push({
      difficulty,
      id,
      name: `第 ${id} 關`,
      colors,
      optimalMoves: Math.round(colors * 2.8 + (id % 9) + (difficulty === 'hard' ? 8 : 0)),
      timeBenchmark: 45 + colors * 8 + Math.floor(id * 1.5),
      tubes: generatedTubes(colors, seedBase + id * 131),
    });
  }

  return levels;
}
