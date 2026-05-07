let lastTs = 0;
function loop(ts) {
  const dt = Math.min(50, ts - lastTs || 16.7);
  lastTs = ts;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

function bindUi() {
  $('newGameBtn').addEventListener('click', () => {
    audio.init(); audio.sfx('click'); audio.startMusic('menu');
    State.practiceMode = false;
    State.level = 1;
    State.selectedPlants = ['P01', 'P02', 'P03', 'P05', 'P06', 'P08'];
    buildPlantSelect();
    showScreen('select');
  });
  $('continueBtn').addEventListener('click', () => {
    audio.init(); audio.sfx('click');
    State.practiceMode = false;
    State.level = getMaxUnlockedLevel();
    buildPlantSelect();
    showScreen('select');
  });
  $('practiceBtn').addEventListener('click', () => {
    audio.init(); audio.sfx('click'); audio.startMusic('menu');
    State.practiceMode = true;
    State.level = 1;
    State.selectedPlants = ['P01', 'P02', 'P03', 'P05', 'P06', 'P08'];
    buildPlantSelect();
    showScreen('select');
  });
  $('encyclopediaBtn').addEventListener('click', () => { audio.init(); openEncyclopedia('plants'); });
  $('plantCodexTab').addEventListener('click', () => { audio.sfx('click'); renderEncyclopedia('plants'); });
  $('zombieCodexTab').addEventListener('click', () => { audio.sfx('click'); renderEncyclopedia('zombies'); });
  $('closeEncyclopediaBtn').addEventListener('click', closeEncyclopedia);
  $('settingsBtn').addEventListener('click', () => { audio.init(); openSettings(); });
  $('backMenuBtn').addEventListener('click', () => { audio.sfx('click'); showScreen('menu'); audio.startMusic('menu'); });
  $('startBattleBtn').addEventListener('click', () => {
    if (State.selectedPlants.length < 1 || State.selectedPlants.length > MAX_SELECTED_PLANTS) {
      toast(`請選擇 1 到 ${MAX_SELECTED_PLANTS} 種植物`);
      return;
    }
    audio.init(); audio.sfx('click');
    resetGame(State.level);
    showScreen('game');
  });
  $('prevLevelBtn').addEventListener('click', () => { audio.sfx('click'); setSelectedLevel(State.level - 1); });
  $('nextLevelSelectBtn').addEventListener('click', () => { audio.sfx('click'); setSelectedLevel(State.level + 1); });
  $('levelJumpSelect').addEventListener('change', (e) => { audio.sfx('click'); setSelectedLevel(Number(e.target.value)); });
  $('shovelBtn').addEventListener('click', () => {
    State.shovel = !State.shovel;
    State.handPlant = null;
    $('shovelBtn').classList.toggle('active', State.shovel);
    ghost.textContent = State.shovel ? '♨' : '';
    audio.sfx('click');
    renderHand();
  });
  $('autoSunBtn').addEventListener('click', () => {
    State.autoCollectSun = !State.autoCollectSun;
    updateAutoSunButton();
    audio.sfx('click');
  });
  $('pauseBtn').addEventListener('click', pauseGame);
  $('resumeBtn').addEventListener('click', resumeGame);
  $('restartBtn').addEventListener('click', () => resetGame(State.level));
  $('quitBtn').addEventListener('click', () => { audio.stopMusic(); showScreen('menu'); $('pauseOverlay').classList.remove('active'); audio.startMusic('menu'); });
  $('againBtn').addEventListener('click', () => { $('resultOverlay').classList.remove('active'); resetGame(State.level); });
  $('nextLevelBtn').addEventListener('click', () => {
    $('resultOverlay').classList.remove('active');
    resetGame(Math.min(MAX_LEVEL, State.level + 1));
  });
  $('resultMenuBtn').addEventListener('click', () => { $('resultOverlay').classList.remove('active'); showScreen('menu'); audio.startMusic('menu'); });
  $('closeSettingsBtn').addEventListener('click', closeSettings);

  document.addEventListener('pointermove', e => {
    if (!State.handPlant && !State.shovel) { ghost.classList.remove('active'); return; }
    ghost.classList.add('active');
    ghost.style.left = `${e.clientX}px`;
    ghost.style.top = `${e.clientY}px`;
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && State.phase === 'PLAYING') State.paused ? resumeGame() : pauseGame();
    const keySlots = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, '0': 9, '-': 10, '=': 11 };
    if (Object.prototype.hasOwnProperty.call(keySlots, e.key)) {
      const id = State.selectedPlants[keySlots[e.key]];
      if (id) State.handPlant = id;
    }
  });
  document.addEventListener('touchmove', e => {
    if (State.phase === 'PLAYING') e.preventDefault();
  }, { passive: false });
}

function pauseGame() {
  if (State.phase !== 'PLAYING' || State.gameOver) return;
  State.paused = true;
  $('pauseOverlay').classList.add('active');
  audio.sfx('click');
}
function resumeGame() {
  State.paused = false;
  $('pauseOverlay').classList.remove('active');
  audio.sfx('click');
}

function openSettings() {
  const save = SaveSystem.load();
  $('masterVolume').value = save.settings.masterVolume;
  $('musicVolume').value = save.settings.musicVolume;
  $('sfxVolume').value = save.settings.sfxVolume;
  $('vibrationToggle').checked = save.settings.vibration;
  $('settingsOverlay').classList.add('active');
  ['masterVolume', 'musicVolume', 'sfxVolume', 'vibrationToggle'].forEach(id => {
    $(id).oninput = () => {
      const current = SaveSystem.load();
      current.settings = {
        masterVolume: Number($('masterVolume').value),
        musicVolume: Number($('musicVolume').value),
        sfxVolume: Number($('sfxVolume').value),
        vibration: $('vibrationToggle').checked
      };
      SaveSystem.save(current);
      audio.applySettings(current.settings);
    };
  });
}
function closeSettings() {
  $('settingsOverlay').classList.remove('active');
  audio.sfx('click');
}

bindUi();
buildBoard();
buildPlantSelect();
renderHand();
requestAnimationFrame(loop);
