const save=new SaveSystem(),
  audio=new AudioEngine(),
  music=new MusicEngine(),
  canvas=document.getElementById('gameCanvas'),
  overlay=document.getElementById('overlay'),
  hudLevel=document.getElementById('hudLevel'),
  hudLives=document.getElementById('hudLives'),
  hudScore=document.getElementById('hudScore'),
  homeButton=document.getElementById('homeButton'),
  settingsRows=document.getElementById('settingsRows'),
  levelGrid=document.getElementById('levelGrid'),
  leaderboardRows=document.getElementById('leaderboardRows'),
  renderer=new Renderer(canvas.getContext('2d')),
  game=new Game(),
  input=new InputHandler(),
  ui=new UIManager();
function unlockAudio(){music.start();removeEventListener('pointerdown',unlockAudio);removeEventListener('keydown',unlockAudio)}
addEventListener('pointerdown',unlockAudio,{once:true});addEventListener('keydown',unlockAudio,{once:true});
homeButton.onclick=()=>ui.backToMenu();
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{music.start();ui.show(b.dataset.go);if(b.dataset.go==='settings')ui.settings();if(b.dataset.go==='select')ui.levels();if(b.dataset.go==='leaderboard')ui.leaderboard()});
let last=0;function loop(ts){const dt=Math.min((ts-last)/16.67||1,3);last=ts;game.update(dt);renderer.draw();requestAnimationFrame(loop)}
setTimeout(()=>ui.show('menu'),500);requestAnimationFrame(loop);
