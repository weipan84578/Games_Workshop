(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var C = NMM.Constants;
  var GS = NMM.GameState;

  function isEmpty(state, index) {
    return state.board[index] === null || typeof state.board[index] === "undefined";
  }

  function hasPosition(index) {
    return Number.isInteger(index) && index >= 0 && index < 24;
  }

  function getMillsFor(board, actor) {
    var mills = [];
    for (var i = 0; i < C.MILLS.length; i += 1) {
      var line = C.MILLS[i];
      if (board[line[0]] === actor && board[line[1]] === actor && board[line[2]] === actor) {
        mills.push(line.slice());
      }
    }
    return mills;
  }

  function isMillAt(board, index, actor) {
    for (var i = 0; i < C.MILLS.length; i += 1) {
      var line = C.MILLS[i];
      if (line.indexOf(index) >= 0 && board[line[0]] === actor && board[line[1]] === actor && board[line[2]] === actor) {
        return true;
      }
    }
    return false;
  }

  function isPieceInMill(board, index, actor) {
    return board[index] === actor && isMillAt(board, index, actor);
  }

  function getEmptyPositions(state) {
    var result = [];
    for (var i = 0; i < 24; i += 1) {
      if (isEmpty(state, i)) {
        result.push(i);
      }
    }
    return result;
  }

  function getActorPositions(state, actor) {
    var result = [];
    for (var i = 0; i < 24; i += 1) {
      if (state.board[i] === actor) {
        result.push(i);
      }
    }
    return result;
  }

  function getLegalDestinations(state, actor, from) {
    var phase = GS.currentPhaseFor(state, actor);
    var empty = getEmptyPositions(state);
    var result = [];
    var i;

    if (!hasPosition(from) || state.board[from] !== actor || phase === C.PHASES.PLACING) {
      return result;
    }

    if (phase === C.PHASES.FLYING) {
      return empty;
    }

    var adjacent = C.ADJACENCY[from] || [];
    for (i = 0; i < adjacent.length; i += 1) {
      if (isEmpty(state, adjacent[i])) {
        result.push(adjacent[i]);
      }
    }
    return result;
  }

  function getBaseActions(state, actor) {
    var phase = GS.currentPhaseFor(state, actor);
    var actions = [];
    var i;
    var positions;
    var destinations;

    if (state.gameOver || state.awaitingRemoval) {
      return actions;
    }

    if (phase === C.PHASES.PLACING) {
      positions = getEmptyPositions(state);
      for (i = 0; i < positions.length; i += 1) {
        actions.push({ type: "place", to: positions[i] });
      }
      return actions;
    }

    positions = getActorPositions(state, actor);
    for (i = 0; i < positions.length; i += 1) {
      destinations = getLegalDestinations(state, actor, positions[i]);
      for (var j = 0; j < destinations.length; j += 1) {
        actions.push({ type: "move", from: positions[i], to: destinations[j] });
      }
    }
    return actions;
  }

  function applyBaseMutation(state, action, actor) {
    if (action.type === "place") {
      state.board[action.to] = actor;
      GS.setHand(state, actor, GS.getHand(state, actor) - 1);
      GS.setOnBoard(state, actor, GS.getOnBoard(state, actor) + 1);
      state.lastMove = { by: actor, type: "place", to: action.to };
      return true;
    }

    if (action.type === "move") {
      state.board[action.from] = null;
      state.board[action.to] = actor;
      state.lastMove = { by: actor, type: "move", from: action.from, to: action.to };
      return true;
    }
    return false;
  }

  function getRemovablePieces(state, targetActor) {
    var pieces = getActorPositions(state, targetActor);
    var outsideMills = [];
    for (var i = 0; i < pieces.length; i += 1) {
      if (!isPieceInMill(state.board, pieces[i], targetActor)) {
        outsideMills.push(pieces[i]);
      }
    }
    return outsideMills.length ? outsideMills : pieces;
  }

  function removeAt(state, index) {
    var actor = state.board[index];
    if (actor !== C.PLAYERS.PLAYER && actor !== C.PLAYERS.AI) {
      return null;
    }
    state.board[index] = null;
    GS.setOnBoard(state, actor, GS.getOnBoard(state, actor) - 1);
    return actor;
  }

  function switchTurn(state) {
    state.currentTurn = GS.opponent(state.currentTurn);
    GS.syncPhase(state);
  }

  function checkGameOver(state) {
    var player = C.PLAYERS.PLAYER;
    var ai = C.PLAYERS.AI;

    if (state.awaitingRemoval) {
      return state;
    }

    if (GS.getHand(state, player) === 0 && GS.getOnBoard(state, player) < 3) {
      state.gameOver = true;
      state.winner = ai;
      return state;
    }

    if (GS.getHand(state, ai) === 0 && GS.getOnBoard(state, ai) < 3) {
      state.gameOver = true;
      state.winner = player;
      return state;
    }

    if (state.movesSinceCapture >= C.DRAW_WITHOUT_CAPTURE) {
      state.gameOver = true;
      state.winner = "draw";
      return state;
    }

    if (GS.getHand(state, state.currentTurn) === 0 && GS.getOnBoard(state, state.currentTurn) > 3 && getBaseActions(state, state.currentTurn).length === 0) {
      state.gameOver = true;
      state.winner = GS.opponent(state.currentTurn);
    }

    return state;
  }

  function finishTurn(state, captured) {
    if (!captured) {
      state.movesSinceCapture = Number(state.movesSinceCapture || 0) + 1;
    } else {
      state.movesSinceCapture = 0;
    }
    switchTurn(state);
    checkGameOver(state);
  }

  function isLegalBaseAction(state, actor, action) {
    var base = getBaseActions(state, actor);
    for (var i = 0; i < base.length; i += 1) {
      if (base[i].type === action.type && base[i].from === action.from && base[i].to === action.to) {
        return true;
      }
      if (base[i].type === "place" && action.type === "place" && base[i].to === action.to) {
        return true;
      }
    }
    return false;
  }

  function applyTurnAction(state, action, actor, options) {
    var opts = options || {};
    var target = opts.mutate ? state : GS.clone(state);
    var formedMill;
    var removable;
    var removedActor = null;
    var captured = false;
    var pending = false;

    if (!isLegalBaseAction(target, actor, action)) {
      return { ok: false, state: target, reason: "illegal" };
    }

    target.awaitingRemoval = null;
    applyBaseMutation(target, action, actor);
    formedMill = isMillAt(target.board, action.to, actor);

    if (formedMill) {
      removable = getRemovablePieces(target, GS.opponent(actor));
      if (typeof action.remove === "number" && removable.indexOf(action.remove) >= 0) {
        removedActor = removeAt(target, action.remove);
        captured = Boolean(removedActor);
        if (target.lastMove) {
          target.lastMove.remove = action.remove;
        }
      } else if (opts.allowPending && removable.length > 0) {
        target.awaitingRemoval = { by: actor, at: action.to };
        pending = true;
      }
    }

    if (opts.record) {
      GS.addHistory(target, {
        type: action.type,
        by: actor,
        from: action.from,
        to: action.to,
        formedMill: formedMill,
        removed: typeof action.remove === "number" ? action.remove : null
      });
    }

    if (!pending) {
      finishTurn(target, captured);
    }

    target.timestamp = Date.now();
    return {
      ok: true,
      state: target,
      formedMill: formedMill,
      removed: removedActor,
      pending: pending
    };
  }

  function removePending(state, index) {
    var pending = state.awaitingRemoval;
    var remover;
    var targetActor;
    var valid;
    var removed;

    if (!pending || !hasPosition(index)) {
      return { ok: false, state: state, reason: "no-pending-removal" };
    }

    remover = pending.by;
    targetActor = GS.opponent(remover);
    valid = getRemovablePieces(state, targetActor);
    if (valid.indexOf(index) < 0) {
      return { ok: false, state: state, reason: "not-removable" };
    }

    removed = removeAt(state, index);
    state.awaitingRemoval = null;
    state.movesSinceCapture = 0;
    state.lastMove = state.lastMove || {};
    state.lastMove.remove = index;

    if (state.history.length) {
      state.history[state.history.length - 1].removed = index;
    } else {
      GS.addHistory(state, { type: "remove", by: remover, removed: index });
    }

    switchTurn(state);
    checkGameOver(state);
    state.timestamp = Date.now();
    return { ok: true, state: state, removed: removed };
  }

  function getLegalTurnActions(state, actor) {
    var base = getBaseActions(state, actor);
    var actions = [];
    for (var i = 0; i < base.length; i += 1) {
      var draft = GS.clone(state);
      applyBaseMutation(draft, base[i], actor);
      if (isMillAt(draft.board, base[i].to, actor)) {
        var removable = getRemovablePieces(draft, GS.opponent(actor));
        if (removable.length) {
          for (var r = 0; r < removable.length; r += 1) {
            var withRemove = Object.assign({}, base[i], { remove: removable[r] });
            actions.push(withRemove);
          }
        } else {
          actions.push(Object.assign({}, base[i]));
        }
      } else {
        actions.push(Object.assign({}, base[i]));
      }
    }
    return actions;
  }

  function wouldFormMill(state, action, actor) {
    var draft = GS.clone(state);
    if (!isLegalBaseAction(draft, actor, action)) {
      return false;
    }
    applyBaseMutation(draft, action, actor);
    return isMillAt(draft.board, action.to, actor);
  }

  NMM.Rules = {
    hasPosition: hasPosition,
    isEmpty: isEmpty,
    getMillsFor: getMillsFor,
    isMillAt: isMillAt,
    isPieceInMill: isPieceInMill,
    getEmptyPositions: getEmptyPositions,
    getActorPositions: getActorPositions,
    getLegalDestinations: getLegalDestinations,
    getBaseActions: getBaseActions,
    getLegalTurnActions: getLegalTurnActions,
    getRemovablePieces: getRemovablePieces,
    wouldFormMill: wouldFormMill,
    applyTurnAction: applyTurnAction,
    removePending: removePending,
    checkGameOver: checkGameOver
  };
})(window);
