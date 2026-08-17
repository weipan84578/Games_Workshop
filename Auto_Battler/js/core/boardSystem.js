(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};

  function findLocation(state, instanceId) {
    var boardIndex = state.board.findIndex(function (unit) { return unit && unit.instanceId === instanceId; });
    if (boardIndex >= 0) return { area: "board", index: boardIndex, unit: state.board[boardIndex] };
    var benchIndex = state.bench.findIndex(function (unit) { return unit && unit.instanceId === instanceId; });
    if (benchIndex >= 0) return { area: "bench", index: benchIndex, unit: state.bench[benchIndex] };
    return null;
  }

  function allInstances(state) {
    return state.board.filter(Boolean).concat(state.bench);
  }

  function removeInstance(state, instanceId) {
    var location = findLocation(state, instanceId);
    if (!location) return null;
    if (location.area === "board") state.board[location.index] = null;
    else state.bench.splice(location.index, 1);
    return location.unit;
  }

  app.BoardSystem = {
    findLocation: findLocation,
    allInstances: allInstances,
    boardCount: function (state) { return state.board.filter(Boolean).length; },
    maxUnits: function (state) { return Math.min(8, state.level + 2); },
    setSelection: function (state, instanceId) {
      state.selectedId = instanceId || null;
      return state.selectedId;
    },
    clearSelection: function (state) { state.selectedId = null; },
    placeSelected: function (state, slotIndex) {
      var selected = state.selectedId ? findLocation(state, state.selectedId) : null;
      if (!selected || slotIndex < 0 || slotIndex >= state.board.length) return { ok: false, reason: "no-selection" };
      var target = state.board[slotIndex];
      if (selected.area === "bench") {
        if (this.boardCount(state) >= this.maxUnits(state)) return { ok: false, reason: "full" };
        state.bench.splice(selected.index, 1);
        if (target) state.bench.push(target);
        state.board[slotIndex] = selected.unit;
      } else if (selected.index !== slotIndex) {
        state.board[selected.index] = target || null;
        state.board[slotIndex] = selected.unit;
      }
      state.selectedId = null;
      return { ok: true, unit: selected.unit };
    },
    returnToBench: function (state, slotIndex) {
      var unit = state.board[slotIndex];
      if (!unit || state.bench.length >= 8) return { ok: false, reason: "bench-full" };
      state.board[slotIndex] = null;
      state.bench.push(unit);
      state.selectedId = null;
      return { ok: true, unit: unit };
    },
    autoMerge: function (state) {
      var merged = [];
      var didMerge = true;
      while (didMerge) {
        didMerge = false;
        var candidates = allInstances(state).filter(function (unit) { return unit.star < 3; });
        var groups = {};
        candidates.forEach(function (unit) {
          var key = unit.typeId + ":" + unit.star;
          groups[key] = groups[key] || [];
          groups[key].push(unit);
        });
        var keys = Object.keys(groups);
        for (var index = 0; index < keys.length; index += 1) {
          var group = groups[keys[index]];
          if (group.length < 3) continue;
          var keep = group[0];
          removeInstance(state, group[1].instanceId);
          removeInstance(state, group[2].instanceId);
          keep.star += 1;
          merged.push(keep);
          didMerge = true;
          break;
        }
      }
      return merged;
    },
    removeInstance: removeInstance
  };
}(window));
