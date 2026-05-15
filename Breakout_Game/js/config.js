const W=800,H=600, STORAGE='brickstorm-save-v1';
const COLORS=['#ff2d55','#ff9500','#ffcc00','#34c759','#5ac8fa','#007aff','#af52de','#ff2d9c'];
const BRICK_TYPES={NORMAL_1:{hp:1,score:10},NORMAL_2:{hp:2,score:20},NORMAL_3:{hp:3,score:40},STONE:{hp:5,score:100},METAL:{hp:999,score:0},BOMB:{hp:1,score:50},POWER:{hp:1,score:20},RAINBOW:{hp:1,score:50}};
const POWERUPS=['EXPAND','SHRINK','MULTI','SLOW','FAST','LASER','SHIELD','EXTRA_LIFE','STICKY','SCORE_2X','FIREBALL'];
const LEVEL_NAMES=['DAWN','EMBER','RUSH','CIRCUIT','NEON','ECHO','VECTOR','ION','NOVA','APEX'];
const settingsSchema=[
 ['musicVolume','音樂音量',[0,30,70,100]],['sfxVolume','音效音量',[0,30,80,100]],['ballSpeed','球速',['EASY','NORMAL','HARD']],['difficulty','難度',['EASY','NORMAL','HARD']],['particles','粒子效果',[true,false]],['screenShake','畫面震動',[true,false]],['language','語言',['zh-TW','EN']],['controlMode','控制模式',['AUTO','KEYBOARD','TOUCH']]
];
const defaultSave={version:'1.0.0',progress:{unlockedLevels:1,levelStars:Array(50).fill(0),totalStars:0,highScore:0},settings:{musicVolume:70,sfxVolume:80,ballSpeed:'NORMAL',difficulty:'NORMAL',particles:true,screenShake:true,language:'zh-TW',controlMode:'AUTO'},leaderboard:[],stats:{totalBricksDestroyed:0,totalGamesPlayed:0,maxCombo:0,totalPowerupsCollected:0}};
const clone=o=>JSON.parse(JSON.stringify(o));
