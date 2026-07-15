(function (Game) {
  "use strict";
  function StateMachine(initial, transitions, bus) {
    this.state = initial;
    this.transitions = transitions || {};
    this.bus = bus;
  }
  StateMachine.prototype.can = function (next) {
    var allowed = this.transitions[this.state] || [];
    return allowed.indexOf(next) !== -1;
  };
  StateMachine.prototype.transition = function (next, payload) {
    if (next === this.state) return true;
    if (!this.can(next)) return false;
    var previous = this.state;
    this.state = next;
    if (this.bus)
      this.bus.emit("state:changed", {
        from: previous,
        to: next,
        payload: payload,
      });
    return true;
  };
  Game.StateMachine = StateMachine;
})(window.DJGame);
