(() => {
  "use strict";
  const R = window.Roulette = window.Roulette || {};
  const { CHIP_COLORS, CHIP_VALUES, DEFAULT_SETTINGS, DIFFICULTY, HELP_TABS, THEME_META, $, $all, clamp, formatMoney, getResultColor, getWheelOrder, randomPick, createGameState, SaveManager, SettingsManager, AudioManager, i18n, AIPlayer, BettingBoard, calculateSettlement, createBet, sumBets, RouletteWheel, ParticleController, ToastNotification, describeArc, miniBetSvg } = R;

  class GameApp {
    constructor() {
      this.settingsManager = new SettingsManager();
      this.saveManager = new SaveManager();
      this.toast = new ToastNotification($("#toastHost"));
      this.audio = new AudioManager(this.settingsManager);
      this.particles = new ParticleController($("#particleCanvas"));
      this.wheel = new RouletteWheel($("#wheelCanvas"), this.settingsManager);
      this.ai = new AIPlayer();
      this.board = new BettingBoard($("#bettingBoard"), (id, target) => this.placeBet(id, target));
      this.state = createGameState(this.settingsManager.settings);
      this.selectedChip = 25;
      this.activeScreen = "menu";
      this.previousScreen = "menu";
      this.helpTab = "goal";
      this.lastResult = null;
      this.cacheDom();
      this.bindEvents();
      this.settingsManager.apply();
      this.renderAll();
    }

    cacheDom() {
      this.els = {
        screens: {
          menu: $("#menuScreen"),
          game: $("#gameScreen"),
          settings: $("#settingsScreen"),
          help: $("#helpScreen"),
        },
        languageSelect: $("#languageSelect"),
        quickMuteBtn: $("#quickMuteBtn"),
        quickMuteIcon: $("#quickMuteIcon"),
        startGameBtn: $("#startGameBtn"),
        continueGameBtn: $("#continueGameBtn"),
        openHelpBtn: $("#openHelpBtn"),
        openSettingsBtn: $("#openSettingsBtn"),
        backToMenuBtn: $("#backToMenuBtn"),
        settingsFromGameBtn: $("#settingsFromGameBtn"),
        soundFromGameBtn: $("#soundFromGameBtn"),
        saveGameBtn: $("#saveGameBtn"),
        roundLabel: $("#roundLabel"),
        aiDifficultyBadge: $("#aiDifficultyBadge"),
        aiBalance: $("#aiBalance"),
        aiBetTotal: $("#aiBetTotal"),
        aiThinkingLabel: $("#aiThinkingLabel"),
        aiThinkingBar: $("#aiThinkingBar"),
        aiReveal: $("#aiReveal"),
        targetBadge: $("#targetBadge"),
        playerBalance: $("#playerBalance"),
        playerBetTotal: $("#playerBetTotal"),
        resultNumber: $("#resultNumber"),
        resultText: $("#resultText"),
        resultDisplay: $("#resultDisplay"),
        selectedChipLabel: $("#selectedChipLabel"),
        wheelTypeLabel: $("#wheelTypeLabel"),
        activeBetCount: $("#activeBetCount"),
        activeBetList: $("#activeBetList"),
        historyList: $("#historyList"),
        chipRack: $("#chipRack"),
        clearBetsBtn: $("#clearBetsBtn"),
        spinBtn: $("#spinBtn"),
        bgmEnabledInput: $("#bgmEnabledInput"),
        sfxEnabledInput: $("#sfxEnabledInput"),
        bgmVolumeInput: $("#bgmVolumeInput"),
        sfxVolumeInput: $("#sfxVolumeInput"),
        bgmVolumeLabel: $("#bgmVolumeLabel"),
        sfxVolumeLabel: $("#sfxVolumeLabel"),
        themeGrid: $("#themeGrid"),
        saveSettingsBtn: $("#saveSettingsBtn"),
        helpTabs: $("#helpTabs"),
        helpContent: $("#helpContent"),
        helpPrevBtn: $("#helpPrevBtn"),
        helpNextBtn: $("#helpNextBtn"),
        endDialog: $("#endDialog"),
        endTitle: $("#endTitle"),
        endMessage: $("#endMessage"),
        endMenuBtn: $("#endMenuBtn"),
        endRestartBtn: $("#endRestartBtn"),
      };
    }

    bindEvents() {
      document.addEventListener("click", (event) => {
        const clickable = event.target.closest("button");
        if (clickable) this.audio.click();
      });
      this.els.startGameBtn.addEventListener("click", () => this.newGame());
      this.els.continueGameBtn.addEventListener("click", () => this.continueGame());
      this.els.openHelpBtn.addEventListener("click", () => this.route("help"));
      this.els.openSettingsBtn.addEventListener("click", () => this.route("settings"));
      this.els.backToMenuBtn.addEventListener("click", () => {
        this.saveGame(false);
        this.route("menu");
      });
      this.els.settingsFromGameBtn.addEventListener("click", () => this.route("settings"));
      this.els.soundFromGameBtn.addEventListener("click", () => this.toggleMute());
      this.els.quickMuteBtn.addEventListener("click", () => this.toggleMute());
      this.els.saveGameBtn.addEventListener("click", () => this.saveGame(true));
      this.els.clearBetsBtn.addEventListener("click", () => this.clearBets());
      this.els.spinBtn.addEventListener("click", () => this.spinRound());
      this.els.languageSelect.addEventListener("change", (event) => this.updateSetting("language", event.target.value));
      this.els.saveSettingsBtn.addEventListener("click", () => {
        this.settingsManager.save();
        this.toast.show(i18n.t("game.settingsSaved"), "success");
      });
      $all("[data-route-back]").forEach((button) => button.addEventListener("click", () => this.route(this.previousScreen || "menu")));
      document.addEventListener("change", (event) => {
        if (event.target === this.els.bgmEnabledInput) this.updateSetting("bgmEnabled", event.target.checked);
        if (event.target === this.els.sfxEnabledInput) this.updateSetting("sfxEnabled", event.target.checked);
        if (event.target === this.els.bgmVolumeInput) this.updateSetting("bgmVolume", Number(event.target.value) / 100);
        if (event.target === this.els.sfxVolumeInput) this.updateSetting("sfxVolume", Number(event.target.value) / 100);
      });
      document.addEventListener("input", (event) => {
        if (event.target === this.els.bgmVolumeInput) this.updateSetting("bgmVolume", Number(event.target.value) / 100);
        if (event.target === this.els.sfxVolumeInput) this.updateSetting("sfxVolume", Number(event.target.value) / 100);
      });
      document.addEventListener("click", (event) => {
        const settingButton = event.target.closest("[data-setting]");
        if (!settingButton) return;
        this.updateSetting(settingButton.dataset.setting, settingButton.dataset.value);
      });
      this.els.helpTabs.addEventListener("click", (event) => {
        const button = event.target.closest("[data-tab]");
        if (!button) return;
        this.helpTab = button.dataset.tab;
        this.renderHelp();
      });
      this.els.helpPrevBtn.addEventListener("click", () => this.shiftHelp(-1));
      this.els.helpNextBtn.addEventListener("click", () => this.shiftHelp(1));
      this.els.endMenuBtn.addEventListener("click", () => {
        this.hideEndDialog();
        this.route("menu");
      });
      this.els.endRestartBtn.addEventListener("click", () => {
        this.hideEndDialog();
        this.newGame();
      });
    }

    route(screenName) {
      if (!this.els.screens[screenName]) return;
      if (screenName !== this.activeScreen) {
        this.previousScreen = this.activeScreen;
        this.activeScreen = screenName;
      }
      Object.entries(this.els.screens).forEach(([name, screen]) => {
        screen.classList.toggle("active", name === screenName);
      });
      if (screenName === "help") this.renderHelp();
      if (screenName === "settings") this.renderSettings();
    }

    newGame() {
      this.state = createGameState(this.settingsManager.settings);
      this.lastResult = null;
      this.els.resultNumber.textContent = "--";
      this.els.resultText.textContent = i18n.t("game.placeBets");
      this.els.resultNumber.className = "";
      this.els.resultDisplay.classList.remove("win", "result-red", "result-black", "result-green");
      this.els.aiReveal.textContent = i18n.t("ai.hidden");
      this.wheel.setWheelType(this.state.wheel.type);
      this.route("game");
      this.renderAll();
      this.saveGame(false);
    }

    continueGame() {
      const save = this.saveManager.load();
      if (!save || !save.game) {
        this.toast.show(i18n.t("game.noSave"), "warning");
        return;
      }
      this.settingsManager.settings = { ...DEFAULT_SETTINGS, ...save.settings };
      this.settingsManager.apply();
      this.state = { ...createGameState(this.settingsManager.settings), ...save.game };
      this.state.wheel.isSpinning = false;
      this.lastResult = this.state.wheel.currentResult;
      this.wheel.setWheelType(this.state.wheel.type);
      this.route("game");
      this.renderAll();
      this.toast.show(i18n.t("game.loaded"), "success");
    }

    saveGame(showToast) {
      const saved = this.saveManager.save(this.settingsManager.settings, this.state);
      if (showToast) this.toast.show(saved ? i18n.t("game.saved") : i18n.t("game.storageUnavailable"), saved ? "success" : "warning");
    }

    updateSetting(key, value) {
      if (key === "bgmVolume" || key === "sfxVolume") value = clamp(Number(value), 0, 1);
      if (key === "difficulty" && !DIFFICULTY[value]) return;
      if (key === "wheelType" && !["european", "american"].includes(value)) return;
      this.settingsManager.update(key, value);
      if (key === "language") this.els.languageSelect.value = value;
      if (key === "wheelType") {
        this.state.wheel.type = value;
        this.wheel.setWheelType(value);
      }
      if (key === "difficulty") {
        this.state.difficulty = value;
      }
      this.audio.applySettings();
      this.renderAll();
    }

    toggleMute() {
      this.audio.setMuted(!this.audio.muted);
      this.renderSoundButtons();
    }

    renderAll() {
      i18n.updateDom();
      this.renderSettings();
      this.renderChips();
      this.renderGame();
      this.renderHelp();
      this.renderSoundButtons();
      this.els.continueGameBtn.disabled = !this.saveManager.hasSave();
    }

    renderSettings() {
      const settings = this.settingsManager.settings;
      this.els.languageSelect.value = settings.language;
      this.els.bgmEnabledInput.checked = settings.bgmEnabled;
      this.els.sfxEnabledInput.checked = settings.sfxEnabled;
      this.els.bgmVolumeInput.value = Math.round(settings.bgmVolume * 100);
      this.els.sfxVolumeInput.value = Math.round(settings.sfxVolume * 100);
      this.els.bgmVolumeLabel.textContent = `${Math.round(settings.bgmVolume * 100)}%`;
      this.els.sfxVolumeLabel.textContent = `${Math.round(settings.sfxVolume * 100)}%`;

      $all("[data-setting]").forEach((button) => {
        const key = button.dataset.setting;
        const isActive = String(settings[key]) === String(button.dataset.value);
        button.classList.toggle("active", isActive);
        if (button.getAttribute("role") === "radio") button.setAttribute("aria-checked", String(isActive));
      });

      this.els.themeGrid.innerHTML = THEME_META.map((theme) => `
        <button class="theme-card ${settings.theme === theme.key ? "active" : ""}" type="button" data-setting="theme" data-value="${theme.key}"
          style="background: linear-gradient(135deg, ${theme.felt} 0 58%, ${theme.border} 59% 100%)">
          ${i18n.t(theme.nameKey)}
        </button>
      `).join("");
    }

    renderSoundButtons() {
      const label = this.audio.muted ? "×" : "♪";
      this.els.quickMuteIcon.textContent = label;
      $("#soundFromGameBtn span").textContent = label;
    }

    renderChips() {
      this.els.chipRack.innerHTML = CHIP_VALUES.map((value, index) => `
        <button class="chip ${this.selectedChip === value ? "active" : ""}" type="button" data-chip="${value}" style="--chip-color:${CHIP_COLORS[index]}">
          $${value}
        </button>
      `).join("");
      $all("[data-chip]", this.els.chipRack).forEach((button) => {
        button.addEventListener("click", () => {
          this.selectedChip = Number(button.dataset.chip);
          this.renderChips();
          this.renderGame();
        });
      });
    }

    renderGame() {
      const state = this.state;
      const difficultyText = i18n.t(`difficulty.${state.difficulty}`);
      const config = DIFFICULTY[state.difficulty] || DIFFICULTY.normal;
      state.player.totalBet = sumBets(state.player.bets);
      state.ai.totalBet = sumBets(state.ai.bets);
      this.els.roundLabel.textContent = i18n.t("game.round", { round: state.round });
      this.els.aiDifficultyBadge.textContent = difficultyText;
      this.els.aiDifficultyBadge.className = `badge ${config.labelColor}`;
      this.els.targetBadge.textContent = i18n.t("game.target", { amount: formatMoney(state.targetBalance) });
      this.els.aiBalance.textContent = formatMoney(state.ai.balance);
      this.els.aiBetTotal.textContent = formatMoney(state.ai.totalBet);
      this.els.playerBalance.textContent = formatMoney(state.player.balance);
      this.els.playerBetTotal.textContent = formatMoney(state.player.totalBet);
      this.els.selectedChipLabel.textContent = `$${this.selectedChip}`;
      this.els.wheelTypeLabel.textContent = i18n.t(state.wheel.type === "american" ? "wheel.american" : "wheel.european");
      this.els.activeBetCount.textContent = String(state.player.bets.length);
      this.renderActiveBets();
      this.renderHistory();
      this.board.render({
        wheelType: state.wheel.type,
        bets: state.player.bets,
        result: state.wheel.currentResult,
        locked: state.wheel.isSpinning,
      });
      this.els.clearBetsBtn.disabled = state.wheel.isSpinning || state.player.bets.length === 0;
      this.els.spinBtn.disabled = state.wheel.isSpinning || state.player.bets.length === 0;
      this.els.spinBtn.textContent = state.wheel.isSpinning ? i18n.t("game.spinning") : i18n.t("game.spin");
    }

    renderActiveBets() {
      if (!this.state.player.bets.length) {
        this.els.activeBetList.innerHTML = `<span class="bet-pill">${i18n.t("game.noBets")}</span>`;
        return;
      }
      this.els.activeBetList.innerHTML = this.state.player.bets.map((bet) => `
        <span class="bet-pill"><strong>${bet.label}</strong>${formatMoney(bet.amount)}</span>
      `).join("");
    }

    renderHistory() {
      const results = this.state.wheel.lastResults.slice(0, 30);
      this.els.historyList.innerHTML = results.map((result) => `
        <span class="history-ball ${getResultColor(result)}">${result}</span>
      `).join("");
    }

    placeBet(betId, targetEl) {
      if (this.state.wheel.isSpinning) return;
      const def = this.board.getDef(betId);
      if (!def) return;
      if (this.state.player.balance < this.selectedChip) {
        this.toast.show(i18n.t("game.insufficient"), "warning");
        return;
      }
      this.state.player.balance -= this.selectedChip;
      const existing = this.state.player.bets.find((bet) => bet.id === betId);
      if (existing) {
        existing.amount += this.selectedChip;
      } else {
        this.state.player.bets.push(createBet(def, this.selectedChip));
      }
      this.state.betHistory.unshift({ id: betId, type: def.type, amount: this.selectedChip });
      this.state.wheel.currentResult = null;
      this.audio.chip();
      this.animateChip(targetEl);
      this.renderGame();
      this.saveGame(false);
    }

    animateChip(targetEl) {
      const activeChip = $(`[data-chip="${this.selectedChip}"]`, this.els.chipRack);
      if (!activeChip || !targetEl) return;
      const from = activeChip.getBoundingClientRect();
      const to = targetEl.getBoundingClientRect();
      const chip = document.createElement("div");
      chip.className = "chip-fly";
      chip.textContent = `$${this.selectedChip}`;
      chip.style.left = `${from.left}px`;
      chip.style.top = `${from.top}px`;
      chip.style.width = `${from.width}px`;
      chip.style.height = `${from.height}px`;
      document.body.appendChild(chip);
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      requestAnimationFrame(() => {
        chip.style.transform = `translate(${dx}px, ${dy}px) scale(0.72)`;
        chip.style.opacity = "0.35";
      });
      window.setTimeout(() => chip.remove(), 360);
    }

    clearBets() {
      if (this.state.wheel.isSpinning || !this.state.player.bets.length) return;
      const refund = sumBets(this.state.player.bets);
      this.state.player.balance += refund;
      this.state.player.bets = [];
      this.state.player.totalBet = 0;
      this.audio.clear();
      this.toast.show(`${i18n.t("game.clear")} ${formatMoney(refund)}`, "info");
      this.renderGame();
      this.saveGame(false);
    }

    async spinRound() {
      if (this.state.wheel.isSpinning) return;
      if (!this.state.player.bets.length) {
        this.toast.show(i18n.t("game.noBets"), "warning");
        return;
      }
      this.state.wheel.isSpinning = true;
      this.state.ai.bets = [];
      this.state.ai.totalBet = 0;
      this.els.aiReveal.textContent = i18n.t("ai.hidden");
      this.renderGame();

      await this.runAiThinking();
      this.board.buildDefs(this.state.wheel.type);
      const aiBets = this.ai.decideBets(this.state, this.board);
      let aiSpent = 0;
      aiBets.forEach((bet) => {
        if (this.state.ai.balance >= bet.amount) {
          this.state.ai.balance -= bet.amount;
          aiSpent += bet.amount;
          this.state.ai.bets.push(bet);
        }
      });
      this.state.ai.totalBet = aiSpent;
      this.renderGame();

      const result = randomPick(getWheelOrder(this.state.wheel.type));
      this.audio.spinStart();
      await this.wheel.spin(result, this.settingsManager.settings.animationSpeed);
      this.audio.drop();
      this.settle(result);
    }

    runAiThinking() {
      const config = DIFFICULTY[this.state.difficulty] || DIFFICULTY.normal;
      const duration = config.thinkMin + Math.random() * (config.thinkMax - config.thinkMin);
      this.state.ai.thinkingDuration = duration;
      this.els.aiThinkingLabel.textContent = i18n.t("ai.thinking");
      this.els.spinBtn.textContent = i18n.t("game.thinking");
      this.els.spinBtn.disabled = true;
      const startedAt = performance.now();
      return new Promise((resolve) => {
        const tick = (now) => {
          const progress = clamp((now - startedAt) / duration, 0, 1);
          this.els.aiThinkingBar.style.width = `${Math.round(progress * 100)}%`;
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            this.els.aiThinkingBar.style.width = "100%";
            window.setTimeout(() => resolve(), 120);
          }
        };
        requestAnimationFrame(tick);
      });
    }

    settle(result) {
      const state = this.state;
      const playerSettlement = calculateSettlement(state.player.bets, result);
      const aiSettlement = calculateSettlement(state.ai.bets, result);
      state.player.balance += playerSettlement.gross;
      state.ai.balance += aiSettlement.gross;
      const playerNet = playerSettlement.gross - playerSettlement.totalBet;
      const aiNet = aiSettlement.gross - aiSettlement.totalBet;
      state.player.winHistory.unshift(playerNet);
      state.ai.winHistory.unshift(aiNet);
      state.player.winHistory = state.player.winHistory.slice(0, 30);
      state.ai.winHistory = state.ai.winHistory.slice(0, 30);
      state.wheel.currentResult = result;
      state.wheel.lastResults.unshift(result);
      state.wheel.lastResults = state.wheel.lastResults.slice(0, 30);
      state.resultHistory.unshift(result);
      state.resultHistory = state.resultHistory.slice(0, 30);

      const color = getResultColor(result);
      this.els.resultNumber.textContent = String(result);
      this.els.resultNumber.className = color;
      this.els.resultText.textContent = i18n.t(playerNet > 0 ? "game.result.win" : playerNet < 0 ? "game.result.lose" : "game.result.push");
      this.els.resultDisplay.classList.remove("win", "result-red", "result-black", "result-green");
      this.els.resultDisplay.classList.add(`result-${color}`);
      requestAnimationFrame(() => this.els.resultDisplay.classList.add("win"));

      const aiDetails = state.ai.bets.length
        ? state.ai.bets.map((bet) => `${bet.label} ${formatMoney(bet.amount)}`).join(" / ")
        : i18n.t("game.noBets");
      this.els.aiReveal.textContent = i18n.t("ai.reveal", { bets: aiDetails });

      if (playerNet > 0) {
        this.audio.win();
        this.particles.burst(window.innerWidth * 0.5, window.innerHeight * 0.45);
        this.toast.show(`${i18n.t("game.result.win")} ${i18n.t("game.net", { amount: formatMoney(playerNet) })}`, "success");
      } else if (playerNet < 0) {
        this.audio.lose();
        this.toast.show(`${i18n.t("game.result.lose")} ${i18n.t("game.net", { amount: formatMoney(playerNet) })}`, "warning");
      } else {
        this.toast.show(i18n.t("game.result.push"), "info");
      }

      state.player.bets = [];
      state.ai.bets = [];
      state.player.totalBet = 0;
      state.ai.totalBet = 0;
      state.round += 1;
      state.wheel.isSpinning = false;
      this.els.aiThinkingLabel.textContent = i18n.t("ai.ready");
      this.els.aiThinkingBar.style.width = "0%";
      this.renderGame();
      this.saveGame(false);
      this.checkEndConditions();
    }

    checkEndConditions() {
      if (this.state.player.balance >= this.state.targetBalance) {
        this.showEndDialog(i18n.t("game.winTitle"), i18n.t("game.targetReached", { amount: formatMoney(this.state.targetBalance) }));
      } else if (this.state.ai.balance < 5) {
        this.showEndDialog(i18n.t("game.winTitle"), i18n.t("game.aiBankrupt"));
      } else if (this.state.player.balance < 5) {
        this.showEndDialog(i18n.t("game.loseTitle"), i18n.t("game.playerBankrupt"));
      }
    }

    showEndDialog(title, message) {
      this.els.endTitle.textContent = title;
      this.els.endMessage.textContent = message;
      this.els.endDialog.classList.remove("hidden");
    }

    hideEndDialog() {
      this.els.endDialog.classList.add("hidden");
    }

    shiftHelp(direction) {
      const index = HELP_TABS.indexOf(this.helpTab);
      const next = (index + direction + HELP_TABS.length) % HELP_TABS.length;
      this.helpTab = HELP_TABS[next];
      this.renderHelp();
    }

    renderHelp() {
      $all("[data-tab]", this.els.helpTabs).forEach((button) => {
        button.classList.toggle("active", button.dataset.tab === this.helpTab);
      });
      const content = {
        goal: this.helpGoal(),
        wheel: this.helpWheel(),
        bets: this.helpBets(),
        payout: this.helpPayout(),
        ai: this.helpAi(),
        controls: this.helpControls(),
      }[this.helpTab];
      this.els.helpContent.innerHTML = content;
      this.bindCalculator();
    }

    miniWheelSvg() {
      return `
        <svg class="mini-diagram" viewBox="0 0 180 180" aria-hidden="true">
          <circle cx="90" cy="90" r="78" fill="var(--color-table-border)"></circle>
          <circle cx="90" cy="90" r="66" fill="var(--color-wheel-base)"></circle>
          ${Array.from({ length: 12 }, (_, index) => {
            const start = index * 30;
            const color = index === 0 ? "var(--color-number-green)" : index % 2 ? "var(--color-number-red)" : "var(--color-number-black)";
            return `<path d="${describeArc(90, 90, 62, start, start + 28)} L90 90 Z" fill="${color}"></path>`;
          }).join("")}
          <circle cx="90" cy="90" r="28" fill="var(--color-wheel-accent)"></circle>
          <circle cx="128" cy="44" r="7" fill="#fff"></circle>
        </svg>
      `;
    }

    helpGoal() {
      return `
        <article class="help-card">
          <div class="help-grid">
            <div>${this.miniWheelSvg()}</div>
            <div>
              <h3>${i18n.t("help.goal")}</h3>
              <p>${i18n.t("help.goalBody")}</p>
            </div>
          </div>
        </article>
      `;
    }

    helpWheel() {
      return `
        <article class="help-card">
          <div class="help-grid">
            <div>${this.miniWheelSvg()}</div>
            <div>
              <h3>${i18n.t("help.wheel")}</h3>
              <p>${i18n.t("help.wheelBody")}</p>
              <ul>
                <li>${i18n.t("wheel.europeanDesc")}</li>
                <li>${i18n.t("wheel.americanDesc")}</li>
                <li>${i18n.t("help.wheelColors")}</li>
              </ul>
            </div>
          </div>
        </article>
      `;
    }

    helpBets() {
      const cards = [
        ["betType.straight", "1", "35:1", "neutral"],
        ["betType.redBlack", "18", "1:1", "red"],
        ["betType.oddEven", "18", "1:1", "neutral"],
        ["betType.lowHigh", "18", "1:1", "neutral"],
        ["betType.dozen", "12", "2:1", "neutral"],
        ["betType.column", "12", "2:1", "neutral"],
        ["betType.split", "2", "17:1", "neutral"],
        ["betType.corner", "4", "8:1", "neutral"],
      ];
      return `
        <article class="help-card">
          <h3>${i18n.t("help.bets")}</h3>
          <div class="help-grid">
            ${cards.map(([nameKey, coverage, payout, tone]) => `
              <section class="bet-type-card">
                ${miniBetSvg(tone)}
                <h4>${i18n.t(nameKey)}</h4>
                <p>${i18n.t("help.coverage")}: ${coverage}</p>
                <p>${i18n.t("help.payoutRatio")}: ${payout}</p>
              </section>
            `).join("")}
          </div>
        </article>
      `;
    }

    helpPayout() {
      const options = [
        ["35", "2.70", "betType.straight", "35:1"],
        ["17", "5.40", "betType.split", "17:1"],
        ["11", "8.10", "betType.street", "11:1"],
        ["8", "10.81", "betType.corner", "8:1"],
        ["5", "16.21", "betType.sixLine", "5:1"],
        ["2", "32.43", "betType.dozen", "2:1"],
        ["1", "48.65", "betType.outside", "1:1"],
      ];
      return `
        <article class="help-card">
          <h3>${i18n.t("help.payout")}</h3>
          <div class="calculator">
            <div class="calculator-controls">
              <select id="payoutType">
                ${options.map(([value, probability, key, ratio]) => `<option value="${value}" data-prob="${probability}">${i18n.t(key)} ${ratio}</option>`).join("")}
              </select>
              <input id="payoutAmount" type="number" min="5" step="5" value="100">
            </div>
            <div id="payoutOutput"></div>
          </div>
        </article>
      `;
    }

    helpAi() {
      return `
        <article class="help-card">
          <h3>${i18n.t("help.ai")}</h3>
          <p>${i18n.t("help.aiBody")}</p>
          <div class="help-grid">
            <section class="bet-type-card"><h4>${i18n.t("difficulty.easy")}</h4><p>${i18n.t("help.aiEasy")}</p></section>
            <section class="bet-type-card"><h4>${i18n.t("difficulty.normal")}</h4><p>${i18n.t("help.aiNormal")}</p></section>
            <section class="bet-type-card"><h4>${i18n.t("difficulty.hard")}</h4><p>${i18n.t("help.aiHard")}</p></section>
          </div>
        </article>
      `;
    }

    helpControls() {
      return `
        <article class="help-card">
          <h3>${i18n.t("help.controls")}</h3>
          <p>${i18n.t("help.controlsBody")}</p>
          <ul>
            <li>${i18n.t("help.controlClear")}</li>
            <li>${i18n.t("help.controlSave")}</li>
            <li>${i18n.t("help.controlTheme")}</li>
          </ul>
          <h4>${i18n.t("help.settingsReference")}</h4>
          <ul>
            <li>${i18n.t("help.settingSpeed")}</li>
            <li>${i18n.t("help.settingWheel")}</li>
          </ul>
        </article>
      `;
    }

    bindCalculator() {
      const type = $("#payoutType");
      const amount = $("#payoutAmount");
      const output = $("#payoutOutput");
      if (!type || !amount || !output) return;
      const update = () => {
        const option = type.selectedOptions[0];
        const ratio = Number(type.value);
        const stake = Math.max(0, Number(amount.value) || 0);
        const gross = stake * (ratio + 1);
        output.innerHTML = `
          <p>${i18n.t("help.winAmount")}: <strong>${formatMoney(gross)}</strong></p>
          <p>${i18n.t("help.probability")}: <strong>${option.dataset.prob}%</strong></p>
        `;
      };
      type.addEventListener("change", update);
      amount.addEventListener("input", update);
      update();
    }
  }

  Object.assign(R, { GameApp });
})();
