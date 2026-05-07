const State = {
  phase: 'MAIN_MENU',
  level: 1,
  wave: 0,
  totalWaves: 5,
  sun: 150,
  score: 0,
  time: 0,
  plants: [],
  zombies: [],
  projectiles: [],
  suns: [],
  mowers: [],
  selectedPlants: ['P01', 'P02', 'P03', 'P05', 'P06', 'P08'],
  practiceMode: false,
  autoCollectSun: false,
  handPlant: null,
  shovel: false,
  paused: false,
  won: false,
  gameOver: false,
  kills: 0,
  lastNaturalSun: 0,
  nextWaveAt: 3000,
  spawnedInWave: 0,
  pendingSpawns: [],
  cooldowns: {},
  nextId: 1
};

const $ = (id) => document.getElementById(id);
const screens = { menu: $('mainMenu'), select: $('plantSelect'), game: $('gameScreen') };
const board = $('board');
const entityLayer = $('entityLayer');
const laneLayer = $('laneLayer');
const ghost = $('ghost');

function uid(prefix) { return `${prefix}${State.nextId++}`; }
function nowMs() { return performance.now(); }
function getPlantDef(id) { return PlantDefs.find(p => p.id === id); }
function isNightLevel(level = State.level) { return level >= 35; }
function getNaturalSunInterval(level = State.level) { return isNightLevel(level) ? 14000 : 5500; }
function getFirstWaveDelay(level = State.level) { return isNightLevel(level) ? 60000 : 40000; }
function getMaxUnlockedLevel() {
  const save = SaveSystem.load();
  return Math.min(MAX_LEVEL, Math.max(1, ...(save.unlockedLevels || [1])));
}
function getSelectableMaxLevel() {
  return State.practiceMode ? MAX_LEVEL : getMaxUnlockedLevel();
}
function setSelectedLevel(level) {
  State.level = Math.max(1, Math.min(getSelectableMaxLevel(), level));
  updateLevelSelectUi();
}
function updateLevelSelectUi() {
  const maxUnlocked = getSelectableMaxLevel();
  const label = $('selectLevelLabel');
  const title = $('selectTitle');
  if (!label || !title) return;
  title.textContent = `${State.practiceMode ? '練習 ' : ''}第 ${State.level} 關：選擇 6 種植物`;
  label.textContent = `Level ${State.level} / ${MAX_LEVEL}${State.practiceMode ? ' · Practice' : ''}`;
  $('prevLevelBtn').disabled = State.level <= 1;
  $('nextLevelSelectBtn').disabled = State.level >= maxUnlocked;
  $('nextLevelSelectBtn').title = State.level >= maxUnlocked && !State.practiceMode ? '尚未解鎖下一關' : '下一關';
  const select = $('levelJumpSelect');
  if (select) {
    const optionCount = select.options.length;
    const needsRebuild = optionCount !== maxUnlocked || select.dataset.practice !== String(State.practiceMode);
    if (needsRebuild) {
      select.innerHTML = Array.from({ length: maxUnlocked }, (_, i) => {
        const level = i + 1;
        return `<option value="${level}">第 ${level} 關${isNightLevel(level) ? ' · 夜晚' : ' · 白天'}</option>`;
      }).join('');
      select.dataset.practice = String(State.practiceMode);
    }
    select.value = String(State.level);
  }
}
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  State.phase = name === 'menu' ? 'MAIN_MENU' : name === 'select' ? 'PLANT_SELECT' : 'PLAYING';
}
function toast(message) {
  const el = $('toast');
  el.textContent = message;
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
}
function vibrate(ms = 35) {
  if (SaveSystem.load().settings.vibration && navigator.vibrate) navigator.vibrate(ms);
}
function formatTime(ms) {
  const sec = Math.floor(ms / 1000);
  return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
}

