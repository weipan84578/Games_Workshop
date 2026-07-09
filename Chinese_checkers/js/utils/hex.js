function key(q, r) { return q + "," + r; }
function parseKey(pos) { const [q, r] = pos.split(",").map(Number); return { q, r }; }
function add(a, d, n = 1) { return key(a.q + d[0] * n, a.r + d[1] * n); }
function hexDistance(aKey, bKey) {
  const a = typeof aKey === "string" ? parseKey(aKey) : aKey;
  const b = typeof bKey === "string" ? parseKey(bKey) : bKey;
  return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
}
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function starContains(q, r) {
  const s = -q - r;
  const abs = [Math.abs(q), Math.abs(r), Math.abs(s)].sort((a, b) => a - b);
  return abs[2] <= 8 && abs[1] <= 4;
}

function triangle(zone) {
  const cells = [];
  for (let q = -8; q <= 8; q++) {
    for (let r = -8; r <= 8; r++) {
      if (!starContains(q, r)) continue;
      const s = -q - r;
      if (zone === "top" && r < -4) cells.push(key(q, r));
      if (zone === "bottom" && r > 4) cells.push(key(q, r));
      if (zone === "left" && q < -4) cells.push(key(q, r));
      if (zone === "right" && q > 4) cells.push(key(q, r));
      if (zone === "upperLeft" && s > 4) cells.push(key(q, r));
      if (zone === "lowerRight" && s < -4) cells.push(key(q, r));
    }
  }
  return cells.sort((a, b) => {
    const pa = parseKey(a), pb = parseKey(b);
    return pa.r - pb.r || pa.q - pb.q;
  });
}
