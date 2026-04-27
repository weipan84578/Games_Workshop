'use strict';

const UI = (() => {
  let currentSettings = null;
  let settingsOrigin = 'menu'; // 'menu' | 'pause'

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  function showModal(id) {
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  }

  function hideModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  }

  function updateScore(score, lines, level, time, combo) {
    setText('score-display', String(score).padStart(6, '0'));
    setText('lines-display', lines);
    setText('level-display', level);
    setText('time-display', time);
    setText('combo-display', combo > 0 ? `${combo}x` : '-');
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function updateMenuHighScore() {
    const best = Storage.getBestScore();
    setText('menu-highscore', best.toLocaleString());
  }

  function showGameOver(stats) {
    const best = Storage.getBestScore();
    const isNew = stats.score > 0 && stats.score >= best;

    const entry = {
      score: stats.score, lines: stats.lines, level: stats.level,
      time: stats.time, date: new Date().toISOString().slice(0, 10)
    };
    Storage.saveHighScore(entry);

    setText('go-score', stats.score.toLocaleString());
    setText('go-lines', stats.lines);
    setText('go-level', stats.level);
    setText('go-time', stats.time);
    setText('go-highscore', Storage.getBestScore().toLocaleString());

    const badge = document.getElementById('new-record-badge');
    if (badge) {
      if (isNew && stats.score > 0) {
        badge.classList.remove('hidden');
        Audio.SFX.newRecord();
      } else {
        badge.classList.add('hidden');
      }
    }
    showModal('modal-gameover');
  }

  function renderHighScores() {
    const tbody = document.getElementById('hs-tbody');
    if (!tbody) return;
    const scores = Storage.getHighScores();
    tbody.innerHTML = '';
    if (!scores.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#aaa;font-size:8px;padding:16px">尚無記錄</td></tr>';
      return;
    }
    for (const s of scores) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${s.rank}</td><td>${s.score.toLocaleString()}</td><td>${s.lines}</td><td>${s.level}</td><td>${s.time}</td>`;
      tbody.appendChild(tr);
    }
  }

  function loadSettingsUI(s) {
    currentSettings = { ...s };
    setRange('set-bgm-vol', s.bgmVolume * 100, 'set-bgm-vol-val', '%');
    setRange('set-sfx-vol', s.sfxVolume * 100, 'set-sfx-vol-val', '%');
    setToggle('set-bgm-toggle', s.bgmEnabled);
    setToggle('set-sfx-toggle', s.sfxEnabled);
    setToggle('set-ghost-toggle', s.ghostPiece);
    setRange('set-das', s.das, 'set-das-val', 'ms');
    setRange('set-arr', s.arr, 'set-arr-val', 'ms');
  }

  function setRange(inputId, val, labelId, unit) {
    const el = document.getElementById(inputId);
    const lbl = document.getElementById(labelId);
    if (el) { el.value = Math.round(val); el.oninput = () => { if (lbl) lbl.textContent = Math.round(el.value) + unit; }; }
    if (lbl) lbl.textContent = Math.round(val) + unit;
  }

  function setToggle(btnId, on) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.textContent = on ? '● ON' : '○ OFF';
    btn.className = 'toggle-btn ' + (on ? 'on' : 'off');
    btn.onclick = () => {
      const isOn = btn.classList.contains('on');
      btn.textContent = isOn ? '○ OFF' : '● ON';
      btn.className = 'toggle-btn ' + (isOn ? 'off' : 'on');
    };
  }

  function readSettingsUI() {
    const s = { ...currentSettings };
    s.bgmVolume = +(document.getElementById('set-bgm-vol')?.value ?? 60) / 100;
    s.sfxVolume = +(document.getElementById('set-sfx-vol')?.value ?? 80) / 100;
    s.bgmEnabled = document.getElementById('set-bgm-toggle')?.classList.contains('on') ?? true;
    s.sfxEnabled = document.getElementById('set-sfx-toggle')?.classList.contains('on') ?? true;
    s.ghostPiece = document.getElementById('set-ghost-toggle')?.classList.contains('on') ?? true;
    s.das = +(document.getElementById('set-das')?.value ?? 167);
    s.arr = +(document.getElementById('set-arr')?.value ?? 33);
    return s;
  }

  return {
    showScreen, showModal, hideModals, updateScore, updateMenuHighScore,
    showGameOver, renderHighScores, loadSettingsUI, readSettingsUI,
    get settingsOrigin() { return settingsOrigin; },
    set settingsOrigin(v) { settingsOrigin = v; }
  };
})();
