(function (root, factory) {
  var random = root.WormsGame && root.WormsGame.Random;
  if (!random && typeof require === "function")
    random = require("../utils/random.js");
  var api = factory(random);
  root.WormsGame = root.WormsGame || {};
  root.WormsGame.TurnManager = api.TurnManager;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (Random) {
  "use strict";
  var STATES = Object.freeze([
    "TURN_INTRO",
    "PLAYER_CONTROL",
    "AI_THINKING",
    "ACTION_ACTIVE",
    "WORLD_SETTLING",
    "DAMAGE_SUMMARY",
    "CHECK_VICTORY",
    "NEXT_TURN",
    "RESULT",
  ]);

  /** Controls turn order, timers, sudden death, and victory checks. */
  function TurnManager(characters, turnSeconds, seed) {
    this.characters = characters;
    this.turnSeconds =
      [20, 30, 45].indexOf(turnSeconds) >= 0 ? turnSeconds : 30;
    this.windRng = Random.mulberry32(Random.deriveSeed(seed, "wind"));
    this.activeTeam = 0;
    this.teamCursors = [0, 0];
    this.state = "TURN_INTRO";
    this.timeLeft = this.turnSeconds;
    this.matchElapsed = 0;
    this.introElapsed = 0;
    this.suddenDeath = false;
    this.suddenJustStarted = false;
    this.waterY = 1010;
    this.wind = 0;
    this.turnNumber = 0;
    this.paused = false;
    this.actionTaken = false;
  }

  TurnManager.prototype.teamMembers = function (team) {
    return this.characters.filter(function (character) {
      return character.team === team;
    });
  };

  TurnManager.prototype.currentCharacter = function () {
    var members = this.teamMembers(this.activeTeam);
    if (!members.length) return null;
    var start = this.teamCursors[this.activeTeam] % members.length;
    for (var offset = 0; offset < members.length; offset += 1) {
      var candidate = members[(start + offset) % members.length];
      if (candidate.alive) {
        this.teamCursors[this.activeTeam] = (start + offset) % members.length;
        return candidate;
      }
    }
    return null;
  };

  TurnManager.prototype.startTurn = function () {
    this.suddenJustStarted = false;
    if (!this.suddenDeath && this.matchElapsed >= 600) {
      this.suddenDeath = true;
      this.suddenJustStarted = true;
      this.characters.forEach(function (character) {
        if (character.alive) character.hp = 1;
      });
    }
    this.turnNumber += 1;
    this.state = "TURN_INTRO";
    this.timeLeft = this.turnSeconds;
    this.introElapsed = 0;
    this.actionTaken = false;
    this.wind = Math.round(this.windRng() * 200 - 100);
    return this.currentCharacter();
  };

  TurnManager.prototype.windLevel = function () {
    var magnitude = Math.abs(this.wind);
    return magnitude <= 4 ? 0 : Math.min(10, Math.ceil((magnitude - 4) / 10));
  };

  TurnManager.prototype.tick = function (dt) {
    if (this.paused || this.state === "RESULT") return null;
    this.matchElapsed += dt;
    if (this.state === "TURN_INTRO") {
      this.introElapsed += dt;
      if (this.introElapsed >= 0.8)
        this.state = this.activeTeam === 0 ? "PLAYER_CONTROL" : "AI_THINKING";
      return null;
    }
    if (this.state === "PLAYER_CONTROL" || this.state === "AI_THINKING") {
      this.timeLeft = Math.max(0, this.timeLeft - dt);
      if (this.timeLeft === 0) {
        this.state = "WORLD_SETTLING";
        return "timeout";
      }
    }
    return null;
  };

  TurnManager.prototype.markAction = function () {
    this.actionTaken = true;
    this.state = "ACTION_ACTIVE";
  };
  TurnManager.prototype.beginSettling = function () {
    this.state = "WORLD_SETTLING";
  };
  TurnManager.prototype.beginSummary = function () {
    this.state = "DAMAGE_SUMMARY";
  };

  TurnManager.prototype.checkVictory = function () {
    var alive = [0, 1].map(function (team) {
      return this.characters.some(function (character) {
        return character.team === team && character.alive;
      });
    }, this);
    if (!alive[0] && !alive[1]) return "draw";
    if (!alive[0]) return "team1";
    if (!alive[1]) return "team0";
    return null;
  };

  TurnManager.prototype.advance = function () {
    var result = this.checkVictory();
    if (result) {
      this.state = "RESULT";
      return result;
    }
    var outgoing = this.activeTeam;
    var members = this.teamMembers(outgoing);
    this.teamCursors[outgoing] =
      (this.teamCursors[outgoing] + 1) % Math.max(1, members.length);
    if (this.suddenDeath) this.waterY -= 18;
    this.activeTeam = 1 - outgoing;
    result = this.checkVictory();
    if (result) {
      this.state = "RESULT";
      return result;
    }
    this.startTurn();
    return null;
  };

  TurnManager.prototype.setPaused = function (value) {
    this.paused = !!value;
  };
  TurnManager.STATES = STATES;
  return { STATES: STATES, TurnManager: TurnManager };
});
