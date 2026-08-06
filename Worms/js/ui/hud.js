(function (root, factory) {
  var api = factory(root.WormsGame || {});
  root.WormsGame = root.WormsGame || {};
  root.WormsGame.BattleHUD = api.BattleHUD;
})(typeof window !== "undefined" ? window : globalThis, function (WG) {
  "use strict";

  /** DOM-only battle heads-up display. */
  function BattleHUD(i18n, callbacks) {
    this.i18n = i18n;
    this.callbacks = callbacks || {};
    this.elements = {
      playerName: document.getElementById("player-team-name"),
      enemyName: document.getElementById("enemy-team-name"),
      playerRoster: document.getElementById("player-roster"),
      enemyRoster: document.getElementById("enemy-roster"),
      turnTeam: document.getElementById("turn-team"),
      timer: document.getElementById("turn-timer"),
      wind: document.getElementById("wind-meter"),
      weaponButton: document.getElementById("weapon-current"),
      weaponGrid: document.getElementById("weapon-grid"),
      angle: document.getElementById("angle-value"),
      power: document.getElementById("power-value"),
      banner: document.getElementById("turn-banner"),
      summary: document.getElementById("damage-summary"),
      targetOverlay: document.getElementById("target-overlay"),
      ariaLive: document.getElementById("aria-live"),
    };
    this.lastSecond = null;
    this.lastRosterKey = "";
    this.lastWeaponId = "";
    this.lastWeaponGridKey = "";
    this.buildWeapons();
  }

  BattleHUD.prototype.buildWeapons = function () {
    var self = this;
    var grid = this.elements.weaponGrid;
    grid.textContent = "";
    WG.WeaponRegistry.list().forEach(function (weapon) {
      var button = document.createElement("button");
      button.type = "button";
      button.dataset.weapon = weapon.id;
      button.innerHTML =
        '<span class="weapon-art" aria-hidden="true"><img alt=""></span>' +
        "<span><b></b><small></small></span>";
      button.querySelector("img").src = weapon.icon;
      button.querySelector("b").textContent = self.i18n.t(
        "weapon." + weapon.id,
      );
      button.addEventListener("click", function () {
        if (self.callbacks.selectWeapon) self.callbacks.selectWeapon(weapon.id);
      });
      grid.appendChild(button);
    });
  };

  BattleHUD.prototype.toggleWeapons = function (force) {
    var grid = this.elements.weaponGrid;
    grid.hidden = typeof force === "boolean" ? !force : !grid.hidden;
    this.elements.weaponButton.setAttribute(
      "aria-expanded",
      String(!grid.hidden),
    );
  };

  BattleHUD.prototype.renderRoster = function (characters) {
    var key = characters
      .map(function (character) {
        return character.id + ":" + character.hp + ":" + character.alive;
      })
      .join("|");
    if (key === this.lastRosterKey) return;
    this.lastRosterKey = key;
    [0, 1].forEach(function (team) {
      var container =
        team === 0 ? this.elements.playerRoster : this.elements.enemyRoster;
      container.textContent = "";
      characters
        .filter(function (character) {
          return character.team === team;
        })
        .forEach(function (character) {
          var chip = document.createElement("span");
          chip.className = "worm-chip" + (character.alive ? "" : " dead");
          chip.setAttribute(
            "aria-label",
            character.name + " " + character.hp + " HP",
          );
          chip.innerHTML = "<span></span><b></b>";
          chip
            .querySelector("span")
            .style.setProperty("--worm-color", character.color);
          chip.querySelector("b").textContent = character.hp;
          container.appendChild(chip);
        });
    }, this);
  };

  BattleHUD.prototype.update = function (snapshot) {
    var playerName = snapshot.config.playerTeamName;
    var enemyName = this.i18n.t("battle.enemy");
    var teamName = snapshot.turn.activeTeam === 0 ? playerName : enemyName;
    this.elements.playerName.textContent = playerName;
    this.elements.enemyName.textContent = enemyName;
    this.elements.turnTeam.textContent = teamName;
    this.elements.playerName.closest(".team-card").style.setProperty(
      "--team-color",
      snapshot.characters.find(function (c) {
        return c.team === 0;
      }).color,
    );
    this.elements.enemyName.closest(".team-card").style.setProperty(
      "--team-color",
      snapshot.characters.find(function (c) {
        return c.team === 1;
      }).color,
    );
    this.renderRoster(snapshot.characters);

    var seconds = Math.max(0, Math.ceil(snapshot.turn.timeLeft));
    this.elements.timer.textContent = seconds;
    this.elements.timer.style.color = seconds <= 5 ? "#d82f58" : "";
    var wind = this.elements.wind;
    var direction =
      snapshot.turn.wind < 0
        ? "left"
        : snapshot.turn.wind > 0
          ? "right"
          : "none";
    wind.querySelector("strong").textContent = snapshot.turn.windLevel;
    wind.querySelector("i").style.width = snapshot.turn.windLevel * 10 + "%";
    wind.querySelector("i").style.marginLeft =
      direction === "left" ? "auto" : "0";
    wind.querySelectorAll(":scope > span")[0].style.opacity =
      direction === "left" ? "1" : ".25";
    wind.querySelectorAll(":scope > span")[1].style.opacity =
      direction === "right" ? "1" : ".25";

    var weapon = WG.WeaponRegistry.get(snapshot.selectedWeapon);
    var ammo = snapshot.ammo[snapshot.turn.activeTeam][weapon.id];
    var button = this.elements.weaponButton;
    if (this.lastWeaponId !== weapon.id) {
      button.querySelector(".weapon-icon img").src = weapon.icon;
      button.querySelector("b").textContent = this.i18n.t(
        "weapon." + weapon.id,
      );
      this.lastWeaponId = weapon.id;
    }
    button.querySelector("small").firstChild.textContent =
      (Number.isFinite(ammo) ? ammo : "∞") + " · ";
    this.elements.angle.textContent = Math.round(snapshot.angle) + "°";
    this.elements.power.textContent = Math.round(snapshot.power * 100) + "%";
    var weaponGridKey =
      snapshot.turn.activeTeam +
      ":" +
      weapon.id +
      ":" +
      WG.WeaponRegistry.list()
        .map(function (definition) {
          return snapshot.ammo[snapshot.turn.activeTeam][definition.id];
        })
        .join(",");
    if (weaponGridKey !== this.lastWeaponGridKey) {
      this.elements.weaponGrid
        .querySelectorAll("[data-weapon]")
        .forEach(function (weaponButton) {
          var id = weaponButton.dataset.weapon;
          var count = snapshot.ammo[snapshot.turn.activeTeam][id];
          weaponButton.disabled = count === 0 || snapshot.turn.activeTeam === 1;
          weaponButton.classList.toggle("selected", id === weapon.id);
          weaponButton.querySelector("b").textContent = this.i18n.t(
            "weapon." + id,
          );
          weaponButton.querySelector("small").textContent = Number.isFinite(
            count,
          )
            ? "● " + count
            : "∞";
        }, this);
      this.lastWeaponGridKey = weaponGridKey;
    }
    this.elements.targetOverlay.hidden = !snapshot.targetMode;

    var ariaSummary = this.i18n.t("aria.turn", {
      team: teamName,
      worm: snapshot.current ? snapshot.current.name : "",
      time: seconds,
      weapon: this.i18n.t("weapon." + weapon.id),
      wind: snapshot.turn.windLevel,
    });
    document
      .getElementById("game-canvas")
      .setAttribute("aria-label", ariaSummary);
  };

  BattleHUD.prototype.showTurnBanner = function (team, wormName) {
    var banner = this.elements.banner;
    banner.querySelector("strong").textContent =
      team === 0
        ? this.i18n.t("battle.yourTurn")
        : this.i18n.t("battle.enemyTurn");
    banner.querySelector("span").textContent = wormName || "";
    banner.classList.remove("show");
    void banner.offsetWidth;
    banner.classList.add("show");
  };

  BattleHUD.prototype.showDamage = function (events) {
    var container = this.elements.summary;
    container.textContent = "";
    events.slice(-5).forEach(function (event, index) {
      var pop = document.createElement("div");
      pop.className = "damage-pop";
      pop.style.animationDelay = index * 0.08 + "s";
      pop.textContent = "−" + event.damage;
      container.appendChild(pop);
    });
  };

  BattleHUD.prototype.announce = function (message) {
    this.elements.ariaLive.textContent = "";
    requestAnimationFrame(
      function () {
        this.elements.ariaLive.textContent = message;
      }.bind(this),
    );
  };

  BattleHUD.prototype.refreshLanguage = function () {
    this.buildWeapons();
    this.lastRosterKey = "";
    this.lastWeaponId = "";
    this.lastWeaponGridKey = "";
  };

  return { BattleHUD: BattleHUD };
});
