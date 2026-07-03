(function () {
  window.SicBo = window.SicBo || {};

  function createMenuController(deps) {
    const menuScreen = document.getElementById("menuScreen");
    const gameScreen = document.getElementById("gameScreen");
    const continueButton = document.getElementById("continueGameButton");
    const menuDieButton = document.getElementById("menuDieButton");
    const menuDieCube = menuDieButton ? menuDieButton.querySelector(".menu-die-cube") : null;
    let menuDieRotation = { x: -18, y: 0, z: 5 };

    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomSign() {
      return Math.random() < 0.5 ? -1 : 1;
    }

    function setAngleVar(name, value) {
      if (menuDieButton) menuDieButton.style.setProperty(name, value.toFixed(0) + "deg");
    }

    function setIdleRotation(rotation) {
      const mid = {
        x: rotation.x + randomInt(-14, 14),
        y: rotation.y + 180,
        z: rotation.z + randomInt(-18, 18)
      };
      setAngleVar("--menu-die-idle-x0", rotation.x);
      setAngleVar("--menu-die-idle-y0", rotation.y);
      setAngleVar("--menu-die-idle-z0", rotation.z);
      setAngleVar("--menu-die-idle-x1", mid.x);
      setAngleVar("--menu-die-idle-y1", mid.y);
      setAngleVar("--menu-die-idle-z1", mid.z);
      setAngleVar("--menu-die-idle-x2", rotation.x);
      setAngleVar("--menu-die-idle-y2", rotation.y + 360);
      setAngleVar("--menu-die-idle-z2", rotation.z);
    }

    function makeRandomSpin() {
      const rest = {
        x: randomInt(-48, 48),
        y: randomInt(0, 359),
        z: randomInt(-24, 24)
      };
      const direction = {
        x: randomSign(),
        y: randomSign(),
        z: randomSign()
      };
      const final = {
        x: rest.x + direction.x * randomInt(3, 6) * 360,
        y: rest.y + direction.y * randomInt(5, 9) * 360,
        z: rest.z + direction.z * randomInt(3, 7) * 360
      };
      const points = [
        menuDieRotation,
        {
          x: menuDieRotation.x + direction.x * randomInt(420, 860),
          y: menuDieRotation.y + direction.y * randomInt(620, 1180),
          z: menuDieRotation.z + direction.z * randomInt(360, 820)
        },
        {
          x: final.x * 0.58 + randomInt(-220, 220),
          y: final.y * 0.58 + randomInt(-260, 260),
          z: final.z * 0.58 + randomInt(-220, 220)
        },
        {
          x: final.x * 0.82 + randomInt(-140, 140),
          y: final.y * 0.82 + randomInt(-180, 180),
          z: final.z * 0.82 + randomInt(-160, 160)
        },
        final
      ];
      return { final: final, points: points, rest: rest };
    }

    function updateContinue() {
      continueButton.disabled = !deps.storage.hasPlayableSave();
    }

    function showMenu() {
      gameScreen.hidden = true;
      menuScreen.hidden = false;
      menuScreen.classList.add("screen-active");
      gameScreen.classList.remove("screen-active");
      deps.audio.setMode("menu");
      updateContinue();
    }

    function showGame() {
      menuScreen.hidden = true;
      gameScreen.hidden = false;
      gameScreen.classList.add("screen-active");
      menuScreen.classList.remove("screen-active");
      deps.audio.setMode("game");
      deps.game.render();
    }

    function spinMenuDie() {
      if (!menuDieButton || !menuDieCube || menuDieButton.disabled) return;
      const spin = makeRandomSpin();
      spin.points.forEach(function (point, index) {
        setAngleVar("--menu-die-spin-x" + index, point.x);
        setAngleVar("--menu-die-spin-y" + index, point.y);
        setAngleVar("--menu-die-spin-z" + index, point.z);
      });
      menuDieButton.disabled = true;
      menuDieButton.classList.add("is-fast-spinning");
      menuDieButton.setAttribute("aria-busy", "true");
      deps.audio.ensureContext();
      deps.audio.playBGM();
      deps.audio.playSFX("diceShake");

      let finished = false;
      function finishSpin() {
        if (finished) return;
        finished = true;
        menuDieRotation = spin.rest;
        setIdleRotation(menuDieRotation);
        deps.audio.playSFX("diceLand");
        menuDieButton.classList.remove("is-fast-spinning");
        menuDieButton.disabled = false;
        menuDieButton.setAttribute("aria-busy", "false");
        menuDieCube.removeEventListener("animationend", finishSpin);
      }

      menuDieCube.addEventListener("animationend", finishSpin);
      window.setTimeout(finishSpin, 1450);
    }

    document.getElementById("startGameButton").addEventListener("click", function () {
      deps.audio.ensureContext();
      deps.audio.playBGM();
      if (deps.storage.hasPlayableSave() && !window.confirm(window.SicBo.I18n.t("game.newGameConfirm"))) {
        return;
      }
      deps.game.startNewGame();
      showGame();
    });

    continueButton.addEventListener("click", function () {
      const saved = deps.storage.loadGame();
      if (!saved || !deps.storage.hasPlayableSave()) return;
      deps.audio.ensureContext();
      deps.audio.playBGM();
      ["language", "theme", "bgmVolume", "sfxVolume", "vibration"].forEach(function (key) {
        if (Object.prototype.hasOwnProperty.call(saved, key)) deps.settings.set(key, saved[key]);
      });
      deps.game.loadGame(saved);
      showGame();
    });

    document.getElementById("helpButton").addEventListener("click", function () {
      deps.audio.ensureContext();
      deps.audio.playBGM();
      deps.audio.playSFX("page");
      deps.modals.openHelp();
    });

    document.getElementById("settingsButton").addEventListener("click", function () {
      deps.audio.ensureContext();
      deps.audio.playBGM();
      deps.audio.playSFX("page");
      deps.syncSettingsUI();
      deps.modals.openSettings();
    });

    document.getElementById("backToMenuButton").addEventListener("click", function () {
      deps.audio.playSFX("page");
      showMenu();
    });

    if (menuDieButton) {
      menuDieButton.addEventListener("click", spinMenuDie);
    }

    document.querySelectorAll(".language-option").forEach(function (button) {
      button.addEventListener("click", function () {
        deps.settings.set("language", button.dataset.language);
        deps.audio.ensureContext();
        deps.audio.playBGM();
        deps.audio.playSFX("button");
        deps.game.render();
        updateContinue();
      });
    });

    updateContinue();

    return {
      showGame: showGame,
      showMenu: showMenu,
      updateContinue: updateContinue
    };
  }

  window.SicBo.MenuController = {
    create: createMenuController
  };
})();
