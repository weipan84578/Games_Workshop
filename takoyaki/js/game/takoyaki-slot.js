(function registerTakoyakiSlot(app) {
  "use strict";

  class TakoyakiSlot {
    constructor(id, timing = app.Config.slotTiming) {
      this.id = id;
      this.timing = timing;
      this.reset();
    }

    reset() {
      this.state = "empty";
      this.startedAt = 0;
      this.halfAt = 0;
      this.flippedAt = 0;
      this.cookedAt = 0;
      this.doneAt = 0;
      this.hasOctopus = false;
      this.hasTopping = false;
      this.sauced = false;
      this.flipAccuracy = 0;
      this.lastCue = "";
    }

    update(now) {
      if (this.state === "raw" && now - this.startedAt >= this.timing.rawToHalf) {
        this.state = "half";
        this.halfAt = now;
        return { changed: true, cue: "msg_flip_ready", sfx: "sizzle" };
      }
      if (this.state === "half" && now - this.halfAt >= this.timing.halfToBurnt) {
        this.state = "burnt";
        return { changed: true, cue: "msg_burnt", sfx: "fail", penalty: true };
      }
      if (this.state === "flipped" && now - this.flippedAt >= this.timing.flippedToCooked) {
        this.state = "cooked";
        this.cookedAt = now;
        return { changed: true, cue: "msg_plate_ready", sfx: "star" };
      }
      if (this.state === "cooked" && now - this.cookedAt >= this.timing.cookedToBurnt) {
        this.state = "burnt";
        return { changed: true, cue: "msg_burnt", sfx: "fail", penalty: true };
      }
      if (this.state === "done" && now - this.doneAt >= this.timing.doneToClear) {
        this.reset();
        return { changed: true };
      }
      return { changed: false };
    }

    applyAction(action, now) {
      if (action === "batter" && this.state === "empty") {
        this.state = "raw";
        this.startedAt = now;
        return { ok: true, cue: "msg_added_batter", sfx: "pour" };
      }

      if (action === "octopus" && ["raw", "half"].includes(this.state) && !this.hasOctopus) {
        this.hasOctopus = true;
        return { ok: true, cue: "msg_add_octopus", sfx: "button" };
      }

      if (action === "topping" && ["raw", "half", "flipped"].includes(this.state) && !this.hasTopping) {
        this.hasTopping = true;
        return { ok: true, cue: "msg_add_topping", sfx: "button" };
      }

      if (action === "flip") {
        if (this.state === "raw") {
          return { ok: false, cue: "msg_too_early", sfx: "fail" };
        }
        if (this.state === "half") {
          const elapsed = now - this.halfAt;
          this.flipAccuracy = Math.max(0, 1 - elapsed / this.timing.halfToBurnt);
          this.state = "flipped";
          this.flippedAt = now;
          return { ok: true, cue: "msg_flipped", sfx: "flip" };
        }
      }

      if (action === "plate") {
        if (this.state === "burnt") {
          return { ok: false, cue: "msg_use_discard", sfx: "fail" };
        }
        if (this.state === "cooked") {
          this.state = "plated";
          return { ok: true, cue: "msg_plated", sfx: "plate" };
        }
      }

      if (action === "discard" && this.state === "burnt") {
        this.reset();
        return { ok: true, cue: "msg_discarded", sfx: "button" };
      }

      if (action === "sauce" && this.state === "plated") {
        this.sauced = true;
        this.state = "done";
        this.doneAt = now;
        const score = app.Scoring.scoreSlot(this, now);
        return { ok: true, cue: "msg_sauce_done", sfx: "success", completed: true, score };
      }

      return { ok: false, cue: "msg_wrong_tool", sfx: "fail" };
    }

    isReady() {
      return this.state === "half" || this.state === "cooked";
    }

    isWarning(now) {
      if (this.state === "half") {
        return now - this.halfAt > this.timing.halfToBurnt * 0.72;
      }
      if (this.state === "cooked") {
        return now - this.cookedAt > this.timing.cookedToBurnt * 0.72;
      }
      return this.state === "burnt";
    }

    toJSON() {
      return {
        id: this.id,
        state: this.state,
        hasOctopus: this.hasOctopus,
        hasTopping: this.hasTopping,
        sauced: this.sauced
      };
    }
  }

  app.TakoyakiSlot = TakoyakiSlot;
})(window.Takoyaki = window.Takoyaki || {});
