
function createTarget(run) {
  const stage = run.stage;
  const isHostage = Math.random() < stage.hostages;
  const typeId = pickType(stage, run);
  const type = isHostage
    ? { className: "target-hostage", hp: 1, score: -500, width: 82, height: 150, body: "#f4a261", head: "#f4d7bd" }
    : ENEMY_TYPES[typeId];
  const point = SPAWN_POINTS[Math.floor(Math.random() * SPAWN_POINTS.length)];
  const stayScale = type.stayScale || 1;

  return {
    id: run.nextTargetId++,
    typeId: isHostage ? "hostage" : typeId,
    isHostage,
    hp: type.hp,
    maxHp: type.hp,
    score: type.score,
    x: point[0],
    y: point[1],
    width: type.width,
    height: type.height,
    className: type.className,
    body: type.body,
    head: type.head,
    age: 0,
    stayMs: stage.stay * stayScale,
    node: null
  };
}

function createBoss(run) {
  const boss = ENEMY_TYPES.boss;
  return {
    id: run.nextTargetId++,
    typeId: "boss",
    isHostage: false,
    hp: boss.hp,
    maxHp: boss.hp,
    score: boss.score,
    x: 50,
    y: 54,
    width: boss.width,
    height: boss.height,
    className: boss.className,
    body: boss.body,
    head: boss.head,
    age: 0,
    stayMs: Infinity,
    node: null
  };
}

function renderTarget(target, layer) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `target ${target.className}`;
  button.dataset.targetId = String(target.id);
  button.style.left = `${target.x}%`;
  button.style.top = `${target.y}%`;
  button.style.setProperty("--target-width", `${target.width}px`);
  button.style.setProperty("--target-height", `${target.height}px`);
  button.style.setProperty("--body-color", target.body);
  button.style.setProperty("--head-color", target.head);
  button.innerHTML = `
    <span class="target-head"></span>
    <span class="target-body"></span>
    ${target.typeId === "shield" ? '<span class="shield"></span>' : ""}
    ${target.typeId === "boss" ? '<span class="boss-bar"><span></span></span>' : '<span class="target-gun"></span>'}
  `;
  layer.append(button);
  target.node = button;
  updateBossBar(target);
}

function updateBossBar(target) {
  if (target.typeId !== "boss" || !target.node) return;
  target.node.style.setProperty("--boss-hp", `${Math.max(0, target.hp / target.maxHp) * 100}%`);
}

function pickType(stage, run) {
  return stage.enemies[Math.floor(Math.random() * stage.enemies.length)];
}
