function resizeCanvas() {
  const isMobile = window.innerWidth < 700;
  const top = document.getElementById("top-nav").offsetHeight;
  const players = document.getElementById("players-bar").offsetHeight;
  const hint = document.getElementById("hint-bar").offsetHeight;
  const availableH = Math.max(320, window.innerHeight - top - players - hint - 26);
  const size = isMobile ? Math.min(Math.floor(window.innerWidth * .96), availableH) : Math.min(650, Math.floor(window.innerWidth * .66), availableH);
  const dpr = window.devicePixelRatio || 1;
  boardCanvas.style.width = size + "px";
  boardCanvas.style.height = size + "px";
  boardCanvas.width = Math.floor(size * dpr);
  boardCanvas.height = Math.floor(size * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  layoutCells(size);
  draw();
}

function layoutCells(size) {
  cellLayout.clear();
  const pad = size * .075;
  const coords = boardNodes.map(n => axialToPixel(n.q, n.r, 1));
  const minX = Math.min(...coords.map(p => p.x));
  const maxX = Math.max(...coords.map(p => p.x));
  const minY = Math.min(...coords.map(p => p.y));
  const maxY = Math.max(...coords.map(p => p.y));
  const scale = Math.min((size - pad * 2) / (maxX - minX), (size - pad * 2) / (maxY - minY));
  boardNodes.forEach(n => {
    const p = axialToPixel(n.q, n.r, scale);
    cellLayout.set(n.pos, {
      x: p.x - minX * scale + pad,
      y: p.y - minY * scale + pad,
      r: Math.max(9, scale * .31)
    });
  });
}

function axialToPixel(q, r, scale) {
  return { x: scale * Math.sqrt(3) * (q + r / 2), y: scale * 1.5 * r };
}

function draw() {
  if (!ctx || !cellLayout.size) return;
  const size = parseFloat(boardCanvas.style.width) || 640;
  ctx.clearRect(0, 0, size, size);
  animationTick += .016;
  drawStar(size);
  drawHighlights();
  drawCells();
  drawPieces();
  if (game && game.gameOver) drawOverlay(size);
}

function drawStar(size) {
  ctx.save();
  Object.keys(zones || {}).forEach(zoneId => {
    const starter = game && Object.keys(game.assignments).find(p => game.assignments[p].start === zoneId);
    const targetFor = game && Object.keys(game.assignments).find(p => game.assignments[p].target === zoneId);
    ctx.globalAlpha = starter ? .28 : targetFor ? .24 : (document.body.classList.contains("dark") ? .08 : .12);
    ctx.fillStyle = starter ? PLAYER_META[starter].color : targetFor ? PLAYER_META[targetFor].color : "#8c7a66";
    ctx.beginPath();
    zones[zoneId].forEach((pos, i) => {
      const p = cellLayout.get(pos);
      if (!p) return;
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fill();
    if (targetFor) {
      ctx.globalAlpha = .82;
      ctx.strokeStyle = PLAYER_META[targetFor].color;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  });
  ctx.restore();
}

function drawCells() {
  boardNodes.forEach(n => {
    const p = cellLayout.get(n.pos);
    const currentTarget = game && game.mode === "homecoming" ? targetZone(currentPlayer()) : [];
    const inTarget = currentTarget.includes(n.pos);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * .55, 0, Math.PI * 2);
    ctx.fillStyle = inTarget ? "rgba(184,111,56,.22)" : "rgba(122, 105, 83, .20)";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(70, 53, 35, .22)";
    ctx.stroke();
  });
}

function drawHighlights() {
  if (!game || !settings.showHints) return;
  if (game.selected) {
    const p = cellLayout.get(game.selected);
    if (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 1.45, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(184,111,56,.88)";
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  }
  game.legal.forEach(m => {
    const p = cellLayout.get(m.to);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * (m.jump ? 1.1 : .95), 0, Math.PI * 2);
    ctx.fillStyle = m.capture ? "rgba(198,63,50,.38)" : "rgba(43,122,120,.34)";
    ctx.fill();
    ctx.strokeStyle = m.jump ? "rgba(43,122,120,.92)" : "rgba(43,122,120,.65)";
    ctx.lineWidth = 3;
    ctx.stroke();
  });
}

function drawPieces() {
  if (!game) return;
  Object.keys(game.board).forEach(pos => {
    const piece = game.board[pos].piece;
    if (!piece) return;
    const p = cellLayout.get(pos);
    const pulse = game.selected === pos ? Math.sin(Date.now() / 160) * 1.2 : 0;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,.28)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r + 2 + pulse, 0, Math.PI * 2);
    ctx.fillStyle = piece.color;
    ctx.fill();
    ctx.shadowColor = "transparent";
    const grad = ctx.createRadialGradient(p.x - p.r * .32, p.y - p.r * .42, 1, p.x, p.y, p.r + 3);
    grad.addColorStop(0, "rgba(255,255,255,.62)");
    grad.addColorStop(.45, "rgba(255,255,255,.05)");
    grad.addColorStop(1, "rgba(0,0,0,.25)");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(0,0,0,.28)";
    ctx.stroke();
    ctx.restore();
  });
}

function drawOverlay(size) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,.24)";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 34px Noto Sans TC, sans-serif";
  ctx.fillText(game.winner === "red" ? "勝利" : "落敗", size / 2, size / 2);
  ctx.restore();
}

function clickedNode(x, y) {
  let best = null;
  let bestDist = Infinity;
  cellLayout.forEach((p, pos) => {
    const d = Math.hypot(x - p.x, y - p.y);
    if (d < bestDist) { bestDist = d; best = { pos, r: p.r }; }
  });
  return best && bestDist <= Math.max(24, best.r * 1.8) ? best.pos : null;
}
