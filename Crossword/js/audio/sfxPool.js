(function () {
  const SFX_NAMES = [
    "click",
    "type_correct",
    "type_wrong",
    "word_complete",
    "puzzle_clear",
    "hint_use",
    "cell_select",
    "direction_toggle",
    "menu_open",
    "menu_close",
    "countdown",
  ];

  function create() {
    const pools = new Map();
    SFX_NAMES.forEach((name) => {
      pools.set(name, {
        index: 0,
        items: Array.from({ length: 3 }, () => {
          const audio = new Audio(`assets/audio/sfx/${name}.mp3`);
          audio.preload = "none";
          return audio;
        }),
      });
    });
    return pools;
  }

  function playFromPool(pools, name, volume) {
    const pool = pools.get(name);
    if (!pool) {
      return false;
    }
    const audio = pool.items[pool.index];
    pool.index = (pool.index + 1) % pool.items.length;
    try {
      audio.volume = volume;
      audio.currentTime = 0;
      const result = audio.play();
      if (result && typeof result.catch === "function") {
        result.catch(() => {});
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  window.SfxPool = {
    SFX_NAMES,
    create,
    playFromPool,
  };
})();
