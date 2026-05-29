(function (BS) {
  BS.Core.Status = {
    MENU: "menu",
    PLAYING: "playing",
    PAUSED: "paused",
    OVER: "over"
  };

  BS.Core.createGameState = function (saved) {
    var config = BS.Core.Config.game;
    var grid = new BS.Game.Grid(config);
    var shooter = new BS.Game.Shooter(config);

    if (saved && saved.grid) {
      grid.deserialize(saved.grid);
    } else {
      grid.fillInitial(config.initialRows, config.colorCount);
    }

    if (saved && saved.shooter) {
      shooter.deserialize(saved.shooter);
    } else {
      shooter.refreshPalette(grid.getActiveColors());
    }

    var activeBubble = null;
    if (saved && saved.activeBubble) {
      activeBubble = new BS.Game.Bubble(
        saved.activeBubble.color,
        saved.activeBubble.x,
        saved.activeBubble.y,
        saved.activeBubble.radius
      );
      activeBubble.vx = saved.activeBubble.vx;
      activeBubble.vy = saved.activeBubble.vy;
    }

    return {
      status: BS.Core.Status.PLAYING,
      score: saved && saved.score ? saved.score : 0,
      combo: saved && saved.combo ? saved.combo : 0,
      misses: saved && saved.misses ? saved.misses : 0,
      shots: saved && saved.shots ? saved.shots : 0,
      grid: grid,
      shooter: shooter,
      activeBubble: activeBubble,
      result: null
    };
  };

  BS.Core.serializeGameState = function (state) {
    if (!state || state.status === BS.Core.Status.OVER) {
      return null;
    }

    return {
      score: state.score,
      combo: state.combo,
      misses: state.misses,
      shots: state.shots,
      grid: state.grid.serialize(),
      shooter: state.shooter.serialize(),
      activeBubble: state.activeBubble ? {
        color: state.activeBubble.color,
        x: state.activeBubble.x,
        y: state.activeBubble.y,
        radius: state.activeBubble.radius,
        vx: state.activeBubble.vx,
        vy: state.activeBubble.vy
      } : null,
      savedAt: Date.now()
    };
  };
})(window.BubbleShooter);
