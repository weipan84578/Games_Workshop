function buildBoard() {
  board.innerHTML = '';
  laneLayer.innerHTML = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = `grid-cell ${r % 2 ? 'row-alt' : ''}`;
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('pointerdown', onCellClick);
      cell.addEventListener('pointerenter', () => markCell(cell));
      board.appendChild(cell);
    }
    const lane = document.createElement('div');
    lane.className = 'zombie-lane';
    lane.style.top = `calc(var(--cell) * ${r})`;
    laneLayer.appendChild(lane);
    const label = document.createElement('div');
    label.className = 'lane-label';
    label.style.top = `calc(var(--cell) * ${r})`;
    label.textContent = r + 1;
    laneLayer.appendChild(label);
  }
}

function buildPlantSelect() {
  updateLevelSelectUi();
  const list = $('plantList');
  list.innerHTML = '';
  PlantDefs.forEach(def => {
    const card = document.createElement('button');
    card.className = `select-card ${State.selectedPlants.includes(def.id) ? 'selected' : ''}`;
    card.innerHTML = `<div class="plant-face">${def.emoji}</div><strong>${def.name}</strong><small>☀ ${def.cost}</small>`;
    card.addEventListener('click', () => toggleSelectPlant(def.id));
    list.appendChild(card);
  });
  renderChosen();
}

function toggleSelectPlant(id) {
  audio.sfx('click');
  const exists = State.selectedPlants.includes(id);
  if (exists) State.selectedPlants = State.selectedPlants.filter(x => x !== id);
  else if (State.selectedPlants.length < MAX_SELECTED_PLANTS) State.selectedPlants.push(id);
  else toast(`最多選 ${MAX_SELECTED_PLANTS} 種植物`);
  buildPlantSelect();
}

function renderChosen() {
  const chosen = $('chosenList');
  chosen.innerHTML = '';
  for (let i = 0; i < MAX_SELECTED_PLANTS; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    const def = getPlantDef(State.selectedPlants[i]);
    slot.innerHTML = def ? `<div class="plant-face">${def.emoji}</div>` : '';
    if (def) {
      slot.classList.add('filled');
      slot.title = `取消選擇 ${def.name}`;
      slot.addEventListener('click', () => toggleSelectPlant(def.id));
    }
    chosen.appendChild(slot);
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function seconds(ms) {
  return `${(ms / 1000).toFixed(ms % 1000 ? 1 : 0)}s`;
}

function describePlant(def) {
  const lines = [];
  if (def.kind === 'sun') lines.push(`每 ${seconds(def.produceInterval)} 產生 ${def.sunValue || 25} 陽光。`);
  if (def.kind === 'shooter') lines.push(`直線射擊，每發造成 ${def.damage} 傷害${def.shots ? `，一次 ${def.shots} 發` : ''}。`);
  if (def.kind === 'threepeater') lines.push(`同時攻擊上、中、下三列，每發造成 ${def.damage} 傷害。`);
  if (def.kind === 'lobber') lines.push(`投擲攻擊，造成 ${def.damage} 傷害${def.splash ? `，並對附近造成 ${def.splash} 濺射傷害` : ''}。`);
  if (def.kind === 'bomb') lines.push('放下 1 秒後自爆，攻擊放置格與上下左右一格。');
  if (def.kind === 'rowBomb') lines.push('放下 1 秒後引燃整排，清除同列敵人。');
  if (def.kind === 'wall') lines.push(def.tall ? '高血量防禦植物，可阻擋撐竿殭屍跳躍。' : '高血量防禦植物，用來拖住敵人。');
  if (def.kind === 'spike') lines.push(`攻擊踩在同格附近的地面敵人，每次 ${def.damage} 傷害。`);
  if (def.kind === 'hypno') lines.push('被吃掉時催眠目標，直接處理正在啃食的敵人。');
  if (def.kind === 'mine') lines.push(`需要 ${seconds(def.armTime)} 準備，準備中與已準備完成的圖案不同；觸發後對附近地面敵人造成 ${def.blastDamage} 傷害。`);
  if (def.kind === 'chomper') lines.push('吞噬前方近距離敵人，但攻擊間隔較長。');
  if (def.kind === 'star') lines.push('向鄰近三列發射星星，適合補側線火力。');
  if (def.kind === 'magnet') lines.push('定期移除附近敵人的護甲。');
  if (def.kind === 'aura') lines.push('加速周圍植物的攻擊節奏。');
  if (def.kind === 'chain') lines.push(`同列前方有敵人才會射出閃光，先命中最前方敵人，再往上或往下 ${def.chainRange || 1.75} 格內折射，最多命中 ${def.chains} 個；沒有可折射目標時只命中第一個敵人，每個 ${def.damage} 傷害。`);
  if (def.kind === 'boomerang') lines.push(`回力攻擊可穿透 ${def.pierce} 個敵人，每次 ${def.damage} 傷害。`);
  if (def.kind === 'healer') lines.push(`每 ${seconds(def.attackInterval)} 治療附近受傷植物 ${def.heal} 生命。`);
  if (def.kind === 'freezeAura') lines.push('週期性傷害並緩速周圍敵人。');
  if (def.effect === 'slow') lines.push('附帶緩速。');
  if (def.effect === 'burn') lines.push('附帶燃燒持續傷害。');
  if (def.effect === 'poison') lines.push('附帶中毒持續傷害。');
  if (def.effect === 'stun') lines.push('有短暫暈眩效果。');
  if (def.effect === 'knockback') lines.push('命中時擊退敵人。');
  if (def.pierce && !['boomerang'].includes(def.kind)) lines.push(`投射物可穿透 ${def.pierce} 個敵人。`);
  if (def.scoreValue) lines.push(`同時提供少量分數收益。`);
  return lines.join(' ');
}

function describeZombie(def) {
  const lines = [];
  if (def.armor) lines.push(`有 ${def.armor} 護甲，需先打掉護甲。`);
  if (def.rageAt) lines.push('血量降低後會狂暴加速。');
  if (def.flying) lines.push('飛行敵人，不會被尖刺與地雷命中。');
  if (def.tunnel) lines.push('會從較靠近草坪的位置鑽出。');
  if (def.iceResist) lines.push('抗冰，緩速效果無效。');
  if (def.fireWeak) lines.push('被火焰攻擊時受到 1.5 倍傷害。');
  if (def.fireResist) lines.push('抗火，燃燒效果無效。');
  if (def.iceWeak) lines.push('被冰凍攻擊時受到 1.5 倍傷害。');
  if (def.jumper) lines.push('會跳過第一次遇到的植物，但無法跳過高大堅果。');
  if (def.dancer) lines.push('只會發動一次召喚，在上下左右召喚普通殭屍。');
  if (def.damageTakenMultiplier) lines.push('受到任何植物傷害減半。');
  if (def.ranged) lines.push('具備遠程騷擾能力，啃食節奏較慢但更安全。');
  if (def.poisonAura) lines.push('會週期性毒傷附近植物。');
  if (def.healer) lines.push('會治療附近其他敵人。');
  if (def.boss) lines.push('Boss 級敵人，血量、護甲和傷害都很高。');
  if (!lines.length) lines.push('標準敵人，穩定向左推進並啃食植物。');
  return lines.join(' ');
}

function codexMeta(items) {
  return items.filter(Boolean).map(item => `<span class="codex-pill">${escapeHtml(item)}</span>`).join('');
}

function codexPlantStates(def) {
  if (def.kind !== 'mine') return '';
  return `<div class="codex-states" aria-label="${escapeHtml(def.name)} 狀態圖示">
    <span class="codex-state"><span class="codex-state-emoji">${escapeHtml(def.emoji)}</span><span>準備中</span></span>
    <span class="codex-state"><span class="codex-state-emoji">${escapeHtml(def.readyEmoji || def.emoji)}</span><span>已準備</span></span>
  </div>`;
}

function renderEncyclopedia(type = 'plants') {
  const grid = $('encyclopediaGrid');
  const isPlants = type === 'plants';
  $('plantCodexTab').classList.toggle('active', isPlants);
  $('zombieCodexTab').classList.toggle('active', !isPlants);
  const entries = isPlants ? PlantDefs : Object.entries(ZombieDefs).map(([id, def]) => ({ id, ...def }));
  grid.innerHTML = entries.map(def => {
    const meta = isPlants
      ? codexMeta([`陽光 ${def.cost}`, `生命 ${def.hp}`, `CD ${seconds(def.cooldown)}`, def.attackInterval ? `攻速 ${seconds(def.attackInterval)}` : null])
      : codexMeta([`生命 ${def.hp}`, def.armor ? `護甲 ${def.armor}` : null, `速度 ${def.speed}`, `傷害 ${def.damage}`, `分數 ${def.score}`]);
    return `<article class="codex-card">
      <div class="codex-title"><span class="codex-emoji">${escapeHtml(def.emoji)}</span><span class="codex-name">${escapeHtml(def.id)} ${escapeHtml(def.name)}</span></div>
      ${isPlants ? codexPlantStates(def) : ''}
      <div class="codex-meta">${meta}</div>
      <p class="codex-desc">${escapeHtml(isPlants ? describePlant(def) : describeZombie(def))}</p>
    </article>`;
  }).join('');
}

function openEncyclopedia(type = 'plants') {
  renderEncyclopedia(type);
  $('encyclopediaOverlay').classList.add('active');
  audio.sfx('click');
}

function closeEncyclopedia() {
  $('encyclopediaOverlay').classList.remove('active');
  audio.sfx('click');
}

function renderHand() {
  const hand = $('plantHand');
  hand.innerHTML = '';
  State.selectedPlants.forEach(id => {
    const def = getPlantDef(id);
    const cdLeft = Math.max(0, (State.cooldowns[id] || 0) - nowMs());
    const disabled = State.sun < def.cost || cdLeft > 0;
    const card = document.createElement('button');
    card.className = `plant-card ${State.handPlant === id ? 'selected' : ''} ${disabled ? 'disabled' : ''}`;
    const progress = cdLeft > 0 ? cdLeft / def.cooldown : 0;
    card.innerHTML = `<div class="plant-face">${def.emoji}</div><div class="plant-cost">${def.cost}</div><div class="cooldown-mask" style="transform:scaleY(${progress})"></div>`;
    card.title = `${def.name} - ${def.cost}`;
    card.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      audio.sfx('click');
      if (disabled) return;
      State.handPlant = State.handPlant === id ? null : id;
      State.shovel = false;
      $('shovelBtn').classList.remove('active');
      ghost.textContent = State.handPlant ? def.emoji : '';
      renderHand();
    });
    hand.appendChild(card);
  });
  $('sunCount').textContent = State.sun;
}

function updateAutoSunButton() {
  const btn = $('autoSunBtn');
  if (!btn) return;
  btn.classList.toggle('active', State.autoCollectSun);
  btn.textContent = State.autoCollectSun ? '自動陽光 ON' : '自動陽光 OFF';
  btn.title = State.autoCollectSun ? '點擊關閉自動採集陽光' : '點擊開啟自動採集陽光';
}

function resetGame(level = 1) {
  State.level = level;
  State.wave = 0;
  State.totalWaves = Levels[level].waves.length;
  State.sun = 150;
  State.score = 0;
  State.time = 0;
  State.plants = [];
  State.zombies = [];
  State.projectiles = [];
  State.effects = [];
  State.suns = [];
  State.mowers = Array.from({ length: ROWS }, (_, row) => ({ row, active: true, x: -.7, rolling: false }));
  State.handPlant = null;
  State.shovel = false;
  State.autoCollectSun = false;
  State.paused = false;
  State.won = false;
  State.gameOver = false;
  State.kills = 0;
  State.lastNaturalSun = 0;
  State.nextWaveAt = getFirstWaveDelay(level);
  State.pendingSpawns = [];
  State.cooldowns = {};
  entityLayer.innerHTML = '';
  $('gameScreen').classList.toggle('night', isNightLevel(level));
  $('pauseOverlay').classList.remove('active');
  $('resultOverlay').classList.remove('active');
  buildBoard();
  renderHand();
  updateAutoSunButton();
  audio.startMusic('battle');
}

function onCellClick(e) {
  if (State.phase !== 'PLAYING' || State.paused || State.gameOver) return;
  const gridPos = getGridPositionFromEvent(e);
  if (!gridPos) return;
  const { row, col } = gridPos;
  if (State.shovel) {
    const plant = plantAt(row, col);
    if (plant) {
      removePlant(plant);
      State.shovel = false;
      $('shovelBtn').classList.remove('active');
      audio.sfx('plant');
    }
    return;
  }
  if (!State.handPlant) return;
  const def = getPlantDef(State.handPlant);
  if (!canPlace(row, col, def)) {
    audio.sfx('hit');
    markInvalid(row, col);
    return;
  }
  placePlant(row, col, def);
}

function getGridPositionFromEvent(e) {
  const cell = e.currentTarget?.classList?.contains('grid-cell') ? e.currentTarget : null;
  if (cell) return { row: Number(cell.dataset.row), col: Number(cell.dataset.col) };
  const rect = board.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) return null;
  return {
    row: Math.min(ROWS - 1, Math.floor(y / (rect.height / ROWS))),
    col: Math.min(COLS - 1, Math.floor(x / (rect.width / COLS)))
  };
}

function markCell(cell) {
  document.querySelectorAll('.grid-cell.valid,.grid-cell.invalid').forEach(x => x.classList.remove('valid', 'invalid'));
  if (!State.handPlant && !State.shovel) return;
  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  cell.classList.add(State.shovel || canPlace(row, col, getPlantDef(State.handPlant)) ? 'valid' : 'invalid');
}

function markInvalid(row, col) {
  const cell = [...board.children].find(c => Number(c.dataset.row) === row && Number(c.dataset.col) === col);
  if (!cell) return;
  cell.classList.add('invalid');
  setTimeout(() => cell.classList.remove('invalid'), 250);
}

function plantAt(row, col) { return State.plants.find(p => p.row === row && p.col === col); }
function canPlace(row, col, def) {
  return def && !plantAt(row, col) && State.sun >= def.cost && nowMs() >= (State.cooldowns[def.id] || 0);
}

function placePlant(row, col, def) {
  State.sun -= def.cost;
  State.cooldowns[def.id] = nowMs() + def.cooldown;
  const plant = {
    id: uid('p'), defId: def.id, row, col, hp: def.hp, maxHp: def.hp,
    lastAttack: 0, lastProduce: 0, born: State.time, exploding: false
  };
  State.plants.push(plant);
  if (def.kind === 'bomb') {
    plant.exploding = true;
    setTimeout(() => explodePlant(plant), 1000);
  }
  if (def.kind === 'rowBomb') {
    plant.exploding = true;
    setTimeout(() => explodeRow(plant), 1000);
  }
  State.handPlant = null;
  audio.sfx(def.kind === 'bomb' ? 'wave' : 'plant');
  vibrate(40);
  renderHand();
}

function removePlant(plant) {
  State.plants = State.plants.filter(p => p !== plant);
  audio.sfx('die');
}

function explodePlant(plant) {
  if (!State.plants.includes(plant)) return;
  audio.sfx('boom');
  State.zombies.forEach(z => {
    const zombieCol = Math.floor(z.x + .25);
    const sameRowRange = z.row === plant.row && Math.abs(zombieCol - plant.col) <= 1;
    const sameColRange = zombieCol === plant.col && Math.abs(z.row - plant.row) <= 1;
    if (sameRowRange || sameColRange) damageZombie(z, 999);
  });
  removePlant(plant);
}

function explodeRow(plant) {
  if (!State.plants.includes(plant)) return;
  audio.sfx('boom');
  State.zombies.filter(z => !z.dead && z.row === plant.row).forEach(z => damageZombie(z, 999));
  removePlant(plant);
}

function spawnSun(x, y, targetY, value = 25) {
  State.suns.push({ id: uid('s'), x, y, targetY, value, born: State.time, collected: false, lifetime: 10000, autoAt: State.time + 450 });
}

function collectSun(sun) {
  if (sun.collected) return;
  sun.collected = true;
  State.sun += sun.value;
  State.score += sun.value * 2;
  audio.sfx('collect');
  vibrate(25);
  renderHand();
}

function makeWaveSpawns() {
  const levelData = Levels[State.level];
  const wave = levelData.waves[State.wave - 1];
  const list = [];
  Object.entries(wave).forEach(([type, count]) => {
    for (let i = 0; i < count; i++) list.push(type);
  });
  list.sort(() => Math.random() - .5);
  const isHuge = levelData.hugeWaves.includes(State.wave);
  const beforeFirstHuge = State.wave < levelData.hugeWaves[0];
  const spawnGap = beforeFirstHuge ? 4200 : isHuge ? 1450 : 2400;
  const firstDelay = beforeFirstHuge ? 2400 : isHuge ? 1200 : 1700;
  State.pendingSpawns = list.map((type, i) => ({ type, at: State.time + firstDelay + i * (spawnGap + Math.random() * 1200) }));
  State.spawnedInWave = 0;
  toast(isHuge ? '一大波殭屍來襲！' : `Wave ${State.wave}`);
  audio.sfx(isHuge ? 'boom' : 'wave');
}

function spawnZombie(type) {
  const def = ZombieDefs[type];
  const row = Math.floor(Math.random() * ROWS);
  createZombie(type, row, def.tunnel ? 7.8 + Math.random() * .8 : 9.15 + Math.random() * 1.3);
  State.spawnedInWave++;
}

function createZombie(type, row, x) {
  const def = ZombieDefs[type];
  State.zombies.push({
    id: uid('z'), type, row, x,
    hp: def.hp, maxHp: def.hp, armor: def.armor || 0, maxArmor: def.armor || 0,
    speed: def.speed, damage: def.damage, state: 'walk', eatTimer: 0,
    frozenUntil: 0, burnUntil: 0, poisonUntil: 0, stunUntil: 0, specialTimer: 0,
    jumped: false, summoned: false, dead: false
  });
}

function shoot(plant, rowOverride = null) {
  const def = getPlantDef(plant.defId);
  const row = rowOverride ?? plant.row;
  const type = def.projectile || 'pea';
  State.projectiles.push({
    id: uid('b'), type, row, x: plant.col + .74, speed: def.projectileSpeed || 3.2, damage: def.damage || 20,
    effect: def.effect || (type === 'ice' || type === 'ice-melon' ? 'slow' : type === 'fire' ? 'burn' : null),
    splash: def.splash || 0,
    pierce: def.pierce || 1,
    hitIds: []
  });
  audio.sfx(type === 'ice' ? 'freeze' : 'shoot');
}
