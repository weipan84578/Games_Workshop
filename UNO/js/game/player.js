(function () {
  window.Player = {
    create(id, nameKey) {
      return {
        id,
        nameKey,
        hand: [],
        score: 0,
      };
    },
  };
})();
