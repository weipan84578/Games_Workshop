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

  function addExperience(unit, amount) {
    var remaining = Math.max(0, Math.floor(Number(amount) || 0));
    var gained = 0;
    var starUps = [];
    var maxStar = app.UnitData.maxStar;
    var star = app.Helpers.clamp(Math.floor(Number(unit.star) || 1), 1, maxStar);
    var experience = Math.max(0, Math.floor(Number(unit.experience) || 0));
    while (remaining > 0 && star < maxStar) {
      var required = app.UnitData.experienceToNext(star);
      var available = Math.min(remaining, Math.max(1, required - experience));
      experience += available;
      remaining -= available;
      gained += available;
      if (experience >= required) {
        experience = 0;
        star += 1;
        starUps.push(star);
      }
    }
    unit.star = star;
    unit.experience = star >= maxStar ? 0 : experience;
    return { experience: gained, starUps: starUps };
  }

  function pickKeeper(state, group) {
    return group.slice().sort(function (first, second) {
      var starDifference = (second.star || 1) - (first.star || 1);
      if (starDifference) return starDifference;
      var experienceDifference = (second.experience || 0) - (first.experience || 0);
      if (experienceDifference) return experienceDifference;
      var firstLocation = findLocation(state, first.instanceId);
      var secondLocation = findLocation(state, second.instanceId);
      var firstPriority = firstLocation && firstLocation.area === "board" ? 0 : 1;
      var secondPriority = secondLocation && secondLocation.area === "board" ? 0 : 1;
      return firstPriority - secondPriority;
    })[0];
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
      merged.events = [];
      merged.totalExperience = 0;
      var didMerge = true;
      while (didMerge) {
        didMerge = false;
        var candidates = allInstances(state);
        var groups = {};
        candidates.forEach(function (unit) {
          var key = unit.typeId;
          groups[key] = groups[key] || [];
          groups[key].push(unit);
        });
        var keys = Object.keys(groups);
        for (var index = 0; index < keys.length; index += 1) {
          var group = groups[keys[index]];
          if (group.length < 2) continue;
          var keep = pickKeeper(state, group);
          var consumed = [];
          var experience = 0;
          var starUps = [];
          var others = group.filter(function (unit) { return unit.instanceId !== keep.instanceId; });
          for (var otherIndex = 0; otherIndex < others.length; otherIndex += 1) {
            if (keep.star >= app.UnitData.maxStar) break;
            var eaten = removeInstance(state, others[otherIndex].instanceId);
            if (!eaten) continue;
            var progress = addExperience(keep, 1);
            consumed.push(eaten);
            experience += progress.experience;
            starUps = starUps.concat(progress.starUps);
          }
          if (!consumed.length) continue;
          merged.push(keep);
          merged.events.push({ unit: keep, consumed: consumed, experience: experience, starUps: starUps });
          merged.totalExperience += experience;
          didMerge = true;
          break;
        }
      }
      return merged;
    },
    addExperience: addExperience,
    addExperienceToAll: function (state, amount) {
      var events = [];
      allInstances(state).forEach(function (unit) {
        var progress = addExperience(unit, amount);
        if (progress.experience || progress.starUps.length) {
          events.push({ unit: unit, experience: progress.experience, starUps: progress.starUps });
        }
      });
      return events;
    },
    removeInstance: removeInstance
  };
}(window));
