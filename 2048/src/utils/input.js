const InputHandler = (() => {
  let touchStartX = 0, touchStartY = 0;
  let onMove = null;

  const KEY_MAP = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right',
    W: 'up', S: 'down', A: 'left', D: 'right',
  };

  function init(moveCallback) {
    onMove = moveCallback;

    document.addEventListener('keydown', handleKey);

    const board = document.getElementById('board-wrapper');
    board.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });
    board.addEventListener('touchend', handleTouch, { passive: true });

    document.querySelectorAll('.dir-btn').forEach(btn => {
      btn.addEventListener('click', () => onMove && onMove(btn.dataset.dir));
    });
  }

  function handleKey(e) {
    const dir = KEY_MAP[e.key];
    if (dir) { e.preventDefault(); onMove && onMove(dir); return; }

    if (e.key === 'r' || e.key === 'R') { document.getElementById('btn-restart')?.click(); return; }
    if (e.key === 'z' || e.key === 'Z') { document.getElementById('btn-undo')?.click(); return; }
    if (e.key === 'p' || e.key === 'P') { document.getElementById('btn-pause')?.click(); return; }
    if (e.key === 'm' || e.key === 'M') { document.getElementById('btn-mute-game')?.click(); return; }
  }

  function handleTouch(e) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
    let dir;
    if (Math.abs(dx) > Math.abs(dy)) dir = dx > 0 ? 'right' : 'left';
    else dir = dy > 0 ? 'down' : 'up';
    onMove && onMove(dir);
  }

  function setCallback(cb) { onMove = cb; }

  return { init, setCallback };
})();
