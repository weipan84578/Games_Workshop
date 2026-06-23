(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  function getPoint(board, point) {
    return board.points[point] || { count: 0, color: null };
  }

  function getBarCount(board, color) {
    return board.bar[BG.ownerForColor(color)];
  }

  function isBarPoint(from, color) {
    return from === BG.BAR_POINT[color];
  }

  function entryTargetFromBar(color, die) {
    return color === BG.COLOR.PLAYER ? 25 - die : die;
  }

  function rawTarget(color, from, die) {
    if (isBarPoint(from, color)) return entryTargetFromBar(color, die);
    return from + BG.DIRECTION[color] * die;
  }

  function isBearOffTarget(color, target) {
    return target === BG.BEAR_OFF_POINT[color];
  }

  function hasFartherChecker(board, color, point) {
    if (color === BG.COLOR.PLAYER) {
      for (let p = point + 1; p <= 6; p += 1) {
        if (getPoint(board, p).color === color && getPoint(board, p).count > 0) return true;
      }
      return false;
    }
    for (let p = 19; p < point; p += 1) {
      if (getPoint(board, p).color === color && getPoint(board, p).count > 0) return true;
    }
    return false;
  }

  function moveMatchesDie(board, from, to, color, die) {
    if (isBarPoint(from, color)) return to === entryTargetFromBar(color, die);
    const exact = rawTarget(color, from, die);
    if (exact >= 1 && exact <= 24) return to === exact;
    if (!BG.Rules.canBearOff(board, color) || !isBearOffTarget(color, to)) return false;
    if (color === BG.COLOR.PLAYER) {
      if (from - die === 0) return true;
      return from - die < 0 && !hasFartherChecker(board, color, from);
    }
    if (from + die === 25) return true;
    return from + die > 25 && !hasFartherChecker(board, color, from);
  }

  function targetOpen(board, to, color) {
    if (to === 0 || to === 25) return true;
    const target = getPoint(board, to);
    return target.count === 0 || target.color === color || target.count === 1;
  }

  function allDicePermutations(dice) {
    const results = [];
    const used = Array(dice.length).fill(false);
    const ordered = [...dice].sort((a, b) => b - a);

    function backtrack(path) {
      if (path.length === ordered.length) {
        results.push(path.slice());
        return;
      }
      let last = null;
      for (let i = 0; i < ordered.length; i += 1) {
        if (used[i] || ordered[i] === last) continue;
        last = ordered[i];
        used[i] = true;
        path.push(ordered[i]);
        backtrack(path);
        path.pop();
        used[i] = false;
      }
    }

    backtrack([]);
    return results;
  }

  function moveKey(move) {
    return `${move.from}:${move.to}:${move.die}`;
  }

  BG.Rules = {
    getLegalMoves(board, fromPoint, playerColor, remainingDice) {
      const records = this.getLegalMoveRecords(board, fromPoint, playerColor, remainingDice);
      return [...new Set(records.map((move) => move.to))];
    },

    getLegalMoveRecords(board, fromPoint, playerColor, remainingDice) {
      const legal = [];
      [...new Set(remainingDice)].forEach((die) => {
        const to = this.targetForDie(board, fromPoint, playerColor, die);
        if (to !== null && this.isLegalMove(board, fromPoint, to, playerColor, die)) {
          legal.push({ from: fromPoint, to, die });
        }
      });
      return legal;
    },

    targetForDie(board, from, color, die) {
      if (isBarPoint(from, color)) return entryTargetFromBar(color, die);
      const target = rawTarget(color, from, die);
      if (target >= 1 && target <= 24) return target;
      if (!this.canBearOff(board, color)) return null;
      if (color === BG.COLOR.PLAYER && target < 1) return BG.BEAR_OFF_POINT[color];
      if (color === BG.COLOR.AI && target > 24) return BG.BEAR_OFF_POINT[color];
      return null;
    },

    isLegalMove(board, from, to, playerColor, dieValue) {
      if (!dieValue || dieValue < 1 || dieValue > 6) return false;
      if (getBarCount(board, playerColor) > 0 && !isBarPoint(from, playerColor)) return false;

      if (isBarPoint(from, playerColor)) {
        if (getBarCount(board, playerColor) <= 0) return false;
      } else if (from < 1 || from > 24) {
        return false;
      } else {
        const source = getPoint(board, from);
        if (source.color !== playerColor || source.count <= 0) return false;
      }

      if (!moveMatchesDie(board, from, to, playerColor, dieValue)) return false;
      if (isBearOffTarget(playerColor, to)) return this.canBearOff(board, playerColor);
      return to >= 1 && to <= 24 && targetOpen(board, to, playerColor);
    },

    applyMove(board, from, to, playerColor, dieValue) {
      if (!this.isLegalMove(board, from, to, playerColor, dieValue)) {
        throw new Error("Illegal move");
      }
      const next = BG.Board.clone(board);
      const owner = BG.ownerForColor(playerColor);
      const opponent = BG.opponentColor(playerColor);
      const opponentOwner = BG.ownerForColor(opponent);

      if (isBarPoint(from, playerColor)) {
        next.bar[owner] -= 1;
      } else {
        next.points[from].count -= 1;
        if (next.points[from].count === 0) next.points[from].color = null;
      }

      if (isBearOffTarget(playerColor, to)) {
        next.home[owner] += 1;
        return next;
      }

      const target = next.points[to];
      if (target.color === opponent && target.count === 1) {
        next.bar[opponentOwner] += 1;
        next.points[to] = { count: 1, color: playerColor };
        return next;
      }

      next.points[to] = {
        color: playerColor,
        count: target.color === playerColor ? target.count + 1 : 1,
      };
      return next;
    },

    canBearOff(board, playerColor) {
      if (getBarCount(board, playerColor) > 0) return false;
      const homeSet = new Set(BG.HOME_BOARD[playerColor]);
      for (let point = 1; point <= 24; point += 1) {
        const checker = getPoint(board, point);
        if (checker.color === playerColor && checker.count > 0 && !homeSet.has(point)) return false;
      }
      return true;
    },

    checkGameOver(board) {
      if (board.home.player >= board.totalPieces) {
        return { isOver: true, winner: "player", type: this.getWinType(board, BG.COLOR.PLAYER) };
      }
      if (board.home.ai >= board.totalPieces) {
        return { isOver: true, winner: "ai", type: this.getWinType(board, BG.COLOR.AI) };
      }
      return { isOver: false, winner: null, type: null };
    },

    getWinType(board, winnerColor) {
      const loserColor = BG.opponentColor(winnerColor);
      const loserOwner = BG.ownerForColor(loserColor);
      if (board.home[loserOwner] > 0) return "normal";
      if (board.bar[loserOwner] > 0) return "backgammon";
      const winnerHome = new Set(BG.HOME_BOARD[winnerColor]);
      for (let point = 1; point <= 24; point += 1) {
        const checker = getPoint(board, point);
        if (checker.color === loserColor && winnerHome.has(point)) return "backgammon";
      }
      return "gammon";
    },

    hasAnyLegalMove(board, playerColor, dice) {
      return this.getAllowedMoves(board, playerColor, dice).length > 0;
    },

    getAllLegalMovesForDie(board, playerColor, die) {
      const legal = [];
      if (getBarCount(board, playerColor) > 0) {
        const from = BG.BAR_POINT[playerColor];
        const to = this.targetForDie(board, from, playerColor, die);
        if (to !== null && this.isLegalMove(board, from, to, playerColor, die)) {
          legal.push({ from, to, die });
        }
        return legal;
      }

      for (let point = 1; point <= 24; point += 1) {
        const checker = getPoint(board, point);
        if (checker.color !== playerColor || checker.count <= 0) continue;
        const to = this.targetForDie(board, point, playerColor, die);
        if (to !== null && this.isLegalMove(board, point, to, playerColor, die)) {
          legal.push({ from: point, to, die });
        }
      }
      return legal;
    },

    getLegalTurnSequences(board, playerColor, dice) {
      if (!dice || dice.length === 0) return [];
      const sequences = [];
      const permutations = allDicePermutations(dice);

      permutations.forEach((orderedDice) => {
        const walk = (currentBoard, remaining, path) => {
          if (remaining.length === 0) {
            sequences.push(path.slice());
            return;
          }
          const die = remaining[0];
          const moves = this.getAllLegalMovesForDie(currentBoard, playerColor, die);
          if (moves.length === 0) {
            sequences.push(path.slice());
            return;
          }
          moves.forEach((move) => {
            const nextBoard = this.applyMove(currentBoard, move.from, move.to, playerColor, move.die);
            walk(nextBoard, remaining.slice(1), path.concat(move));
          });
        };
        walk(board, orderedDice, []);
      });

      const maxLength = sequences.reduce((max, sequence) => Math.max(max, sequence.length), 0);
      let filtered = sequences.filter((sequence) => sequence.length === maxLength);
      const uniqueDice = [...new Set(dice)];
      if (maxLength === 1 && uniqueDice.length > 1) {
        const highest = Math.max(...uniqueDice);
        const highDieSequences = filtered.filter((sequence) => sequence[0] && sequence[0].die === highest);
        if (highDieSequences.length > 0) filtered = highDieSequences;
      }

      const seen = new Set();
      return filtered.filter((sequence) => {
        const key = sequence.map(moveKey).join("|");
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    },

    getAllowedMoves(board, playerColor, dice) {
      const sequences = this.getLegalTurnSequences(board, playerColor, dice);
      const firstMoves = [];
      const seen = new Set();
      sequences.forEach((sequence) => {
        if (!sequence.length) return;
        const key = moveKey(sequence[0]);
        if (!seen.has(key)) {
          seen.add(key);
          firstMoves.push(sequence[0]);
        }
      });
      return firstMoves;
    },
  };
})(window);
