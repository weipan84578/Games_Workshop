function update(dt) {
  if (State.phase !== 'PLAYING' || State.paused || State.gameOver) return;
  State.time += dt;

  if (State.time - State.lastNaturalSun > getNaturalSunInterval()) {
    State.lastNaturalSun = State.time;
    spawnSun(Math.random() * 7.8 + .5, -0.5, Math.random() * 3.8 + .45);
  }

  if (State.wave < State.totalWaves && State.time >= State.nextWaveAt && State.pendingSpawns.length === 0) {
    State.wave++;
    makeWaveSpawns();
  }
  State.pendingSpawns = State.pendingSpawns.filter(spawn => {
    if (State.time >= spawn.at) {
      spawnZombie(spawn.type);
      return false;
    }
    return true;
  });
  if (State.pendingSpawns.length === 0 && State.zombies.length === 0 && State.wave > 0 && State.wave < State.totalWaves) {
    const nextWave = State.wave + 1;
    const nextIsFirstHuge = Levels[State.level].hugeWaves[0] === nextWave;
    const beforeFirstHuge = nextWave < Levels[State.level].hugeWaves[0];
    State.nextWaveAt = State.time + (beforeFirstHuge ? 12000 : nextIsFirstHuge ? 18000 : 8000);
  }

  updatePlants(dt);
  updateZombies(dt);
  updateProjectiles(dt);
  updateSuns(dt);
  updateMowers(dt);
  checkEnd();
  renderHand();
}

function updatePlants(dt) {
  State.plants.forEach(plant => {
    const def = getPlantDef(plant.defId);
    if (def.kind === 'sun' && State.time - plant.lastProduce > def.produceInterval) {
      plant.lastProduce = State.time;
      spawnSun(plant.col + .25, plant.row + .08, plant.row + .35, def.sunValue || 25);
      State.score += def.scoreValue || 0;
      audio.sfx('collect');
    }
    const hasted = State.plants.some(p => getPlantDef(p.defId).aura === 'haste' && Math.abs(p.row - plant.row) <= 1 && Math.abs(p.col - plant.col) <= 1);
    const interval = (def.attackInterval || 999999) * (hasted ? .75 : 1);
    if (['shooter', 'threepeater', 'lobber', 'boomerang'].includes(def.kind)) {
      const hasTarget = State.zombies.some(z => !z.dead && z.row === plant.row && z.x > plant.col - .1);
      if (hasTarget && State.time - plant.lastAttack > interval) {
        plant.lastAttack = State.time;
        if (def.kind === 'threepeater') {
          [plant.row - 1, plant.row, plant.row + 1].filter(r => r >= 0 && r < ROWS).forEach(r => shoot(plant, r));
        } else {
          shoot(plant);
          if (def.shots === 2) setTimeout(() => shoot(plant), 180);
          if (def.shots === 4) [120, 240, 360].forEach(delay => setTimeout(() => shoot(plant), delay));
        }
      }
    }
    if (def.kind === 'spike' && State.time - plant.lastAttack > def.attackInterval) {
      const targets = State.zombies.filter(z => !z.dead && !ZombieDefs[z.type].flying && z.row === plant.row && Math.abs(z.x - plant.col) < .62);
      if (targets.length) {
        plant.lastAttack = State.time;
        targets.forEach(z => damageZombie(z, def.damage));
        audio.sfx('hit');
      }
    }
    if (def.kind === 'mine' && State.time - plant.born > def.armTime) {
      const target = State.zombies.find(z => !z.dead && !ZombieDefs[z.type].flying && z.row === plant.row && Math.abs(z.x - plant.col) < .55);
      if (target) {
        State.zombies.filter(z => !z.dead && z.row === plant.row && Math.abs(z.x - plant.col) < 1).forEach(z => damageZombie(z, def.blastDamage));
        audio.sfx('boom');
        removePlant(plant);
      }
    }
    if (def.kind === 'chomper' && State.time - plant.lastAttack > interval) {
      const target = State.zombies.find(z => !z.dead && !ZombieDefs[z.type].flying && z.row === plant.row && z.x >= plant.col - .15 && z.x <= plant.col + 1);
      if (target) {
        plant.lastAttack = State.time;
        damageZombie(target, def.damage);
        audio.sfx('hit');
      }
    }
    if (def.kind === 'healer' && State.time - plant.lastAttack > interval) {
      const allies = State.plants.filter(p => p.hp < p.maxHp && Math.abs(p.row - plant.row) <= 1 && Math.abs(p.col - plant.col) <= 1);
      const ally = allies.sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];
      if (ally) {
        plant.lastAttack = State.time;
        ally.hp = Math.min(ally.maxHp, ally.hp + def.heal);
      }
    }
    if (def.kind === 'freezeAura' && State.time - plant.lastAttack > interval) {
      plant.lastAttack = State.time;
      State.zombies.filter(z => !z.dead && Math.abs(z.row - plant.row) <= 1 && Math.abs(z.x - plant.col) <= 1.5)
        .forEach(z => damageZombie(z, def.damage, 'slow'));
    }
    if (def.kind === 'magnet' && State.time - plant.lastAttack > interval) {
      const target = State.zombies.find(z => !z.dead && z.armor > 0 && Math.abs(z.row - plant.row) <= 1 && Math.abs(z.x - plant.col) <= 4);
      if (target) {
        plant.lastAttack = State.time;
        target.armor = 0;
        audio.sfx('hit');
      }
    }
    if (def.kind === 'chain' && State.time - plant.lastAttack > interval) {
      const targets = State.zombies.filter(z => !z.dead && z.x > plant.col - .1).sort((a, b) => a.x - b.x).slice(0, def.chains);
      if (targets.length) {
        plant.lastAttack = State.time;
        targets.forEach(z => damageZombie(z, def.damage));
        audio.sfx('hit');
      }
    }
    if (def.kind === 'star' && State.time - plant.lastAttack > interval) {
      const targets = State.zombies.filter(z => !z.dead && Math.abs(z.row - plant.row) <= 2 && z.x > plant.col - .5);
      if (targets.length) {
        plant.lastAttack = State.time;
        [plant.row - 1, plant.row, plant.row + 1].filter(r => r >= 0 && r < ROWS).forEach(r => shoot(plant, r));
      }
    }
  });
}

function updateZombies(dt) {
  State.zombies.forEach(z => {
    if (z.dead) return;
    const def = ZombieDefs[z.type];
    const frozen = State.time < z.frozenUntil;
    const stunned = State.time < z.stunUntil;
    const raging = def.rageAt && z.hp / z.maxHp < def.rageAt;
    const speed = stunned ? 0 : (raging ? def.rageSpeed : z.speed) * (frozen ? .5 : 1);
    if (State.time < z.burnUntil) damageZombie(z, dt * .035);
    if (State.time < z.poisonUntil) damageZombie(z, dt * .025);
    z.specialTimer += dt;
    if (def.healer && z.specialTimer > 1800) {
      z.specialTimer = 0;
      State.zombies.filter(other => !other.dead && other !== z && Math.abs(other.row - z.row) <= 1 && Math.abs(other.x - z.x) <= 1.5)
        .forEach(other => other.hp = Math.min(other.maxHp, other.hp + 45));
    }
    if (def.poisonAura && z.specialTimer > 1200) {
      z.specialTimer = 0;
      State.plants.filter(p => Math.abs(p.row - z.row) <= 1 && Math.abs(p.col - z.x) <= 1)
        .forEach(p => p.hp -= 20);
    }

    const target = State.plants.find(p => p.row === z.row && Math.abs((p.col + .3) - z.x) < .38);
    if (target) {
      const targetDef = getPlantDef(target.defId);
      if (targetDef.kind === 'hypno') {
        damageZombie(z, z.maxHp);
        removePlant(target);
        return;
      }
      z.state = 'eat';
      z.eatTimer += dt;
      const biteDelay = def.ranged && Math.abs((target.col + .3) - z.x) < 2.5 ? 850 : 500;
      if (z.eatTimer > biteDelay) {
        z.eatTimer = 0;
        target.hp -= def.damage * .5;
        audio.sfx('bite');
        if (target.hp <= 0) removePlant(target);
      }
    } else {
      z.state = 'walk';
      z.x -= speed * dt / 1000;
    }
    if (z.x < -.35) {
      const mower = State.mowers[z.row];
      if (mower && mower.active && !mower.rolling) {
        mower.rolling = true;
        audio.sfx('mower');
      } else {
        loseGame();
      }
    }
  });
  State.plants.filter(p => p.hp <= 0).forEach(removePlant);
}

function updateProjectiles(dt) {
  State.projectiles.forEach(p => {
    p.x += p.speed * dt / 1000;
    const hit = State.zombies
      .filter(z => !z.dead && z.row === p.row && !p.hitIds.includes(z.id) && z.x > p.x - .22 && z.x < p.x + .36)
      .sort((a, b) => a.x - b.x)[0];
    if (hit) {
      damageZombie(hit, p.damage, p.effect);
      p.hitIds.push(hit.id);
      if (p.splash) {
        State.zombies.filter(z => !z.dead && z !== hit && Math.abs(z.row - hit.row) <= 1 && Math.abs(z.x - hit.x) <= 1)
          .forEach(z => damageZombie(z, p.splash, p.effect));
      }
      p.pierce--;
      p.hit = p.pierce <= 0;
      audio.sfx('hit');
    }
  });
  State.projectiles = State.projectiles.filter(p => !p.hit && p.x < COLS + 2);
}

function damageZombie(z, amount, effect = null) {
  if (z.dead) return;
  let remaining = amount;
  if (z.armor > 0) {
    const used = Math.min(z.armor, remaining);
    z.armor -= used;
    remaining -= used;
  }
  z.hp -= remaining;
  const def = ZombieDefs[z.type];
  if (effect === 'slow' && !def.iceResist) z.frozenUntil = Math.max(z.frozenUntil, State.time + 3000);
  if (effect === 'burn' && !def.fireResist) z.burnUntil = Math.max(z.burnUntil, State.time + 2200);
  if (effect === 'poison') z.poisonUntil = Math.max(z.poisonUntil, State.time + 3500);
  if (effect === 'stun') z.stunUntil = Math.max(z.stunUntil, State.time + 900);
  if (effect === 'knockback') z.x = Math.min(COLS + 1.5, z.x + .35);
  if (z.hp <= 0) {
    z.dead = true;
    State.kills++;
    State.score += def.score;
    if (Math.random() < .28) spawnSun(z.x, z.row + .2, z.row + .2, Math.random() < .18 ? 50 : 25);
    audio.sfx('die');
    setTimeout(() => State.zombies = State.zombies.filter(item => item !== z), 650);
  }
}

function updateSuns() {
  State.suns.forEach(s => {
    if (s.y < s.targetY) s.y += .012;
    if (State.autoCollectSun && !s.collected && State.time >= s.autoAt) collectSun(s);
  });
  State.suns = State.suns.filter(s => !s.collected && State.time - s.born < s.lifetime);
}

function updateMowers(dt) {
  State.mowers.forEach(m => {
    if (!m.rolling) return;
    m.x += 5.5 * dt / 1000;
    State.zombies.filter(z => z.row === m.row && z.x < m.x + .45).forEach(z => damageZombie(z, 9999));
    if (m.x > COLS + 2) {
      m.active = false;
      m.rolling = false;
    }
  });
}

function checkEnd() {
  if (State.wave >= State.totalWaves && State.pendingSpawns.length === 0 && State.zombies.length === 0 && !State.won) {
    State.won = true;
    State.gameOver = true;
    State.score += Math.max(0, 3000 - Math.floor(State.time / 100));
    if (!State.practiceMode) SaveSystem.recordScore(State.level, State.score);
    showResult(true);
  }
}

function loseGame() {
  if (State.gameOver) return;
  State.gameOver = true;
  State.won = false;
  showResult(false);
}

function showResult(won) {
  audio.stopMusic();
  audio.sfx(won ? 'collect' : 'die');
  $('resultTitle').textContent = won ? '勝利！' : '草坪失守';
  $('statTime').textContent = formatTime(State.time);
  $('statScore').textContent = State.score;
  $('statKills').textContent = State.kills;
  $('statWave').textContent = `${State.wave}/${State.totalWaves}`;
  $('nextLevelBtn').style.display = won && State.level < MAX_LEVEL ? '' : 'none';
  $('resultOverlay').classList.add('active');
}

function render() {
  $('timer').textContent = formatTime(State.time);
  $('waveLabel').textContent = `Wave ${State.wave}/${State.totalWaves}`;
  $('sunCount').textContent = State.sun;
  const els = [];

  State.mowers.forEach(m => {
    const parkedX = m.active ? Math.max(-.55, m.x) : 0;
    els.push(`<div class="mower ${m.active || m.rolling ? '' : 'used'}" style="top:calc(var(--cell) * ${m.row} + var(--cell) * .28); transform:translateX(calc(var(--cell) * ${m.rolling ? m.x : parkedX}))">⚙️</div>`);
  });

  State.plants.forEach(p => {
    const def = getPlantDef(p.defId);
    const hp = Math.max(0, p.hp / p.maxHp * 100);
    els.push(`<div class="plant ${p.exploding ? 'attacking' : ''}" style="left:calc(var(--cell) * ${p.col} + var(--cell) * .09);top:calc(var(--cell) * ${p.row} + var(--cell) * .08)">
      <div class="plant-hp"><span style="width:${hp}%"></span></div>${def.emoji}
    </div>`);
  });

  State.zombies.forEach(z => {
    const hp = Math.max(0, z.hp / z.maxHp * 100);
    const armor = z.maxArmor ? Math.max(0, z.armor / z.maxArmor * 100) : 0;
    els.push(`<div class="zombie ${z.state === 'eat' ? 'eat' : ''} ${State.time < z.frozenUntil ? 'frozen' : ''} ${State.time < z.burnUntil ? 'burning' : ''} ${z.dead ? 'dying' : ''}" style="left:calc(var(--cell) * ${z.x});top:calc(var(--cell) * ${z.row} + var(--cell) * .02)">
      <div class="hpbar ${hp < 30 ? 'low' : ''}"><span style="width:${hp}%"></span></div>
      ${z.maxArmor ? `<div class="hpbar armorbar"><span style="width:${armor}%"></span></div>` : ''}
      ${ZombieDefs[z.type].emoji}
    </div>`);
  });

  State.projectiles.forEach(p => {
    els.push(`<div class="projectile ${p.type}" style="left:calc(var(--cell) * ${p.x});top:calc(var(--cell) * ${p.row} + var(--cell) * .39)"></div>`);
  });

  State.suns.forEach(s => {
    els.push(`<div class="sun-ball" data-sun="${s.id}" style="left:calc(var(--cell) * ${s.x});top:calc(var(--cell) * ${s.y})"></div>`);
  });

  entityLayer.innerHTML = els.join('');
  entityLayer.querySelectorAll('.sun-ball').forEach(el => {
    el.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      const sun = State.suns.find(s => s.id === el.dataset.sun);
      if (sun) collectSun(sun);
    });
  });
}

