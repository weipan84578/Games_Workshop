(function (global) {
  "use strict";
  var CCC = global.CCC;
  var app = null;
  var cleanups = [];
  var fromPause = false;
  var lastFeedbackKey = "status.takeChicken";
  var lastQuality = null;

  function t(key, values) { return CCC.i18n.t(key, values); }
  function n(value) { return CCC.i18n.number(value); }
  function c() { return CCC.ui.components; }
  function recipe(id) { return c().recipeById(id); }

  function cleanup() {
    cleanups.forEach(function (remove) { remove(); });
    cleanups = [];
    if (CCC.ui.input) { CCC.ui.input.cancelDrag(); }
  }

  function listen(name, handler) { cleanups.push(CCC.events.on(name, handler)); }

  function setScreen(html, screenName) {
    cleanup();
    document.body.classList.toggle("game-active", screenName === "game");
    app.innerHTML = html;
    app.onclick = handleClick;
    app.onchange = handleChange;
    app.oninput = handleInput;
    app.focus({ preventScroll: true });
  }

  function header(title, backAction, extra) {
    return '<header class="screen-header"><h1 class="screen-header__title">' + CCC.utils.escapeHtml(title) + '</h1><div class="screen-header__actions">' + (extra || "") + '<button class="btn btn--secondary" type="button" data-action="' + backAction + '">← ' + t("common.back") + '</button></div></header>';
  }

  function preferenceChanged() {
    CCC.storage.savePreferences();
    CCC.audio.updateVolumes();
  }

  function handleClick(event) {
    var element = event.target.closest("[data-action]");
    if (!element || element.disabled) { return; }
    CCC.audio.initFromGesture();
    CCC.audio.play("click");
    var action = element.dataset.action;

    if (action === "route-home") { CCC.router.go("home"); }
    else if (action === "route-help") { CCC.router.go("help"); }
    else if (action === "route-settings") { CCC.router.go("settings", { fromPause: false }); }
    else if (action === "back-home") { CCC.router.go("home"); }
    else if (action === "new-game") { startNewGame(); }
    else if (action === "continue-game") {
      CCC.state.selectedDay = CCC.state.progress.completed ? 10 : CCC.state.progress.currentDay;
      CCC.router.go("briefing");
    }
    else if (action === "day-select") { CCC.state.selectedDay = Number(element.dataset.day); renderBriefing(); }
    else if (action === "start-day") { CCC.router.startGame(CCC.state.selectedDay); }
    else if (action === "open-upgrades") { CCC.router.go("upgrades"); }
    else if (action === "settings-back") {
      if (fromPause && CCC.state.session) { CCC.router.go("game", { resumeExisting: true, showPause: true }); }
      else { CCC.router.go("home"); }
    }
    else if (action === "toggle-fullscreen") { toggleFullscreen(); }
    else if (action === "clear-save") { confirmClearSave(); }
    else if (action === "dismiss-orientation") { CCC.state.orientationTipDismissed = true; updateOrientationTip(); }
    else if (action === "result-retry") { CCC.router.startGame(CCC.state.lastResult.day); }
    else if (action === "result-home") { CCC.router.go("home"); }
    else if (action === "result-upgrade") { CCC.state.selectedDay = Math.min(10, CCC.state.lastResult.day + 1); CCC.router.go("upgrades"); }
    else if (action === "result-next") {
      if (CCC.state.lastResult.day >= 10) { CCC.router.go("completion"); }
      else { CCC.state.selectedDay = CCC.state.lastResult.day + 1; CCC.router.go("briefing"); }
    }
    else if (action === "completion-play") { CCC.state.selectedDay = 10; CCC.router.go("briefing"); }
    else if (action === "buy-upgrade") { confirmUpgrade(element.dataset.upgrade); }
    else if (action === "upgrade-back") { CCC.router.go("briefing"); }
  }

  function handleChange(event) {
    var setting = event.target.dataset.setting;
    if (!setting) { return; }
    var pref = CCC.state.preferences;
    if (setting === "language") {
      pref.language = event.target.value;
      CCC.i18n.setLanguage(pref.language, false);
      preferenceChanged();
      renderSettings({ fromPause: fromPause });
    } else if (setting === "theme") {
      pref.theme = event.target.value;
      document.documentElement.dataset.theme = pref.theme;
      preferenceChanged();
    } else if (setting === "muted") {
      pref.muted = event.target.checked;
      preferenceChanged();
    } else if (setting === "reduceMotion") {
      pref.reduceMotion = event.target.checked;
      document.documentElement.classList.toggle("reduce-motion", pref.reduceMotion);
      document.documentElement.classList.add("motion-override");
      preferenceChanged();
    }
  }

  function handleInput(event) {
    var setting = event.target.dataset.setting;
    if (setting !== "bgmVolume" && setting !== "sfxVolume") { return; }
    CCC.state.preferences[setting] = Number(event.target.value);
    var output = document.querySelector('[data-output="' + setting + '"]');
    if (output) { output.value = event.target.value + "%"; output.textContent = event.target.value + "%"; }
    preferenceChanged();
  }

  function startNewGame() {
    function resetAndOpen() { CCC.storage.resetProgress(); CCC.state.selectedDay = 1; CCC.router.go("briefing"); }
    if (!CCC.storage.hasProgress()) { resetAndOpen(); return; }
    c().openDialog({
      title: t("newGame.title"), body: t("newGame.body"),
      actions: [
        { label: t("common.cancel"), className: "btn btn--secondary", value: "cancel" },
        { label: t("newGame.confirm"), className: "btn btn--danger", value: "confirm", onClick: resetAndOpen }
      ]
    });
  }

  function confirmClearSave() {
    c().openDialog({
      title: t("settings.clearTitle"), body: t("settings.clearBody"),
      actions: [
        { label: t("common.cancel"), className: "btn btn--secondary" },
        { label: t("settings.clearConfirm"), className: "btn btn--danger", onClick: function () { CCC.storage.clearProgress(); c().toast(t("settings.cleared"), "success"); } }
      ]
    });
  }

  function toggleFullscreen() {
    if (!CCC.fullscreen.supported()) { c().toast(t("settings.fullscreenUnavailable"), "error"); return; }
    CCC.fullscreen.toggle().then(function () {
      CCC.state.preferences.fullscreenPreferred = CCC.fullscreen.active();
      preferenceChanged();
      renderSettings({ fromPause: fromPause });
    }).catch(function () { c().toast(t("settings.fullscreenFailed"), "error"); });
  }

  function confirmUpgrade(id) {
    var data = CCC.data.upgrades[id];
    var price = CCC.upgrades.priceForNext(id);
    if (!data || price === null || !CCC.upgrades.canBuy(id)) { return; }
    c().openDialog({
      title: t("upgrade.confirmTitle"),
      body: t("upgrade.confirmBody", { price: n(price), name: t(data.nameKey) }),
      actions: [
        { label: t("common.cancel"), className: "btn btn--secondary" },
        { label: t("common.confirm"), className: "btn", onClick: function () {
          if (CCC.upgrades.buy(id)) {
            c().toast(t("upgrade.success", { name: t(data.nameKey), level: CCC.state.progress.upgrades[id] }), "success");
            setTimeout(renderUpgrades, 0);
          }
        } }
      ]
    });
  }

  function renderHome() {
    var hasSave = CCC.storage.hasProgress();
    var continueNote = hasSave ? t("home.continueDay", { day: CCC.state.progress.completed ? 10 : CCC.state.progress.currentDay }) : t("home.noProgress");
    setScreen('<section class="screen screen--center home-screen" aria-labelledby="home-title"><i class="home-deco home-deco--a" aria-hidden="true"></i><i class="home-deco home-deco--b" aria-hidden="true"></i><div class="home-card"><div class="home-brand"><img src="assets/images/characters/chick-chef.svg" width="220" height="220" alt=""><h1 id="home-title">' + t("app.title") + '</h1><p>' + t("app.subtitle") + '</p></div><nav class="home-menu" aria-label="' + t("app.title") + '"><button class="btn btn--accent btn--wide" type="button" data-action="new-game">' + t("home.start") + '</button><button class="btn btn--wide" type="button" data-action="continue-game"' + (hasSave ? '' : ' disabled aria-describedby="continue-note"') + '>' + t("home.continue") + '<span id="continue-note" class="btn__sub">' + continueNote + '</span></button><button class="btn btn--secondary btn--wide" type="button" data-action="route-help">' + t("home.help") + '</button><button class="btn btn--secondary btn--wide" type="button" data-action="route-settings">' + t("home.settings") + '</button></nav></div></section>', "home");
    CCC.audio.setTrack("morning");
  }

  function renderHelp() {
    var cards = CCC.data.helpSections.map(function (section) {
      return '<article class="card help-card"><span class="card__icon" aria-hidden="true">' + section[0] + '</span><div><h3>' + t(section[1]) + '</h3><p>' + t(section[2]) + '</p></div></article>';
    }).join("");
    setScreen('<section class="screen"><div class="content-panel">' + header(t("help.title"), "back-home") + '<div class="help-grid">' + cards + '</div></div></section>', "help");
    CCC.audio.setTrack("morning");
  }

  function renderSettings(options) {
    fromPause = !!(options && options.fromPause);
    var pref = CCC.state.preferences;
    var languages = '<option value="zh-TW"' + (pref.language === "zh-TW" ? ' selected' : '') + '>繁體中文</option><option value="en"' + (pref.language === "en" ? ' selected' : '') + '>English</option><option value="ja"' + (pref.language === "ja" ? ' selected' : '') + '>日本語</option>';
    var themes = CCC.data.themes.map(function (theme) { return '<option value="' + theme.id + '"' + (pref.theme === theme.id ? ' selected' : '') + '>' + t(theme.nameKey) + '</option>'; }).join("");
    var fullLabel = CCC.fullscreen.active() ? t("settings.exitFullscreen") : t("settings.enterFullscreen");
    var html = '<section class="screen"><div class="content-panel">' + header(t("settings.title"), "settings-back") + '<div class="settings-grid"><div class="card settings-section"><label class="field"><span class="field__top">' + t("settings.language") + '</span><select data-setting="language">' + languages + '</select></label><label class="field"><span class="field__top">' + t("settings.theme") + '</span><select data-setting="theme">' + themes + '</select></label><label class="field"><span class="field__top"><span>' + t("settings.bgm") + '</span><output data-output="bgmVolume">' + pref.bgmVolume + '%</output></span><input type="range" min="0" max="100" step="5" value="' + pref.bgmVolume + '" data-setting="bgmVolume"></label><label class="field"><span class="field__top"><span>' + t("settings.sfx") + '</span><output data-output="sfxVolume">' + pref.sfxVolume + '%</output></span><input type="range" min="0" max="100" step="5" value="' + pref.sfxVolume + '" data-setting="sfxVolume"></label></div><div class="card settings-section"><div class="switch-row"><span>' + t("settings.mute") + '</span><label class="switch"><input type="checkbox" data-setting="muted"' + (pref.muted ? ' checked' : '') + '><span class="switch__track"></span><span class="sr-only">' + t("settings.mute") + '</span></label></div><div class="switch-row"><span>' + t("settings.reduceMotion") + '</span><label class="switch"><input type="checkbox" data-setting="reduceMotion"' + (pref.reduceMotion ? ' checked' : '') + '><span class="switch__track"></span><span class="sr-only">' + t("settings.reduceMotion") + '</span></label></div><div class="field"><span class="field__top">' + t("settings.fullscreen") + '</span><button class="btn btn--secondary" type="button" data-action="toggle-fullscreen">' + fullLabel + '</button></div></div></div><div class="danger-zone"><h2 class="danger-text">' + t("settings.clearSave") + '</h2><p class="muted">' + t("settings.clearHint") + '</p><button class="btn btn--danger" type="button" data-action="clear-save">' + t("settings.clearSave") + '</button></div></div></section>';
    setScreen(html, "settings");
    CCC.audio.setTrack("morning");
  }

  function recipeBadge(item) { return '<span class="recipe-badge">' + c().recipeIcon(item, true) + CCC.utils.escapeHtml(t(item.nameKey)) + '</span>'; }

  function renderBriefing() {
    var day = CCC.state.selectedDay;
    var maxDay = CCC.state.progress.completed ? 10 : CCC.state.progress.currentDay;
    day = CCC.utils.clamp(day, 1, maxDay);
    CCC.state.selectedDay = day;
    var level = CCC.data.levels[day - 1];
    var record = CCC.state.progress.records[day];
    var dayPicker = "";
    if (CCC.state.progress.highestCompletedDay > 0) {
      dayPicker = '<div class="day-picker" aria-label="' + t("common.day", { day: day }) + '">' + CCC.data.levels.map(function (item) {
        var locked = item.day > maxDay;
        return '<button class="day-chip" type="button" data-action="day-select" data-day="' + item.day + '" aria-current="' + (item.day === day) + '"' + (locked ? ' disabled title="' + t("common.locked") + '"' : '') + '>' + item.day + (CCC.state.progress.records[item.day].stars ? ' ★' + CCC.state.progress.records[item.day].stars : '') + '</button>';
      }).join("") + '</div>';
    }
    var recipes = CCC.data.recipes.slice(0, level.recipes).map(recipeBadge).join("");
    var html = '<section class="screen"><div class="content-panel">' + header(t("briefing.title"), "back-home") + dayPicker + '<div class="briefing-hero"><img src="assets/images/characters/chick-chef.svg" width="150" height="150" alt=""><div><span class="status-pill">' + t("common.day", { day: day }) + '</span><h2>' + t("app.title") + '</h2><p>' + (record.stars ? t("briefing.best", { stars: record.stars, revenue: n(record.revenue) }) : t(level.tutorial)) + '</p></div></div><div class="briefing-stats"><div class="briefing-stat"><span>' + t("briefing.duration") + '</span><strong>' + t("briefing.seconds", { value: level.duration }) + '</strong></div><div class="briefing-stat"><span>' + t("briefing.goal") + '</span><strong>' + n(level.goal) + '</strong></div><div class="briefing-stat"><span>' + t("briefing.patience") + '</span><strong>' + t("briefing.seconds", { value: level.patience }) + '</strong></div><div class="briefing-stat"><span>' + t("briefing.orders") + '</span><strong>' + level.maxOrders + '</strong></div></div><div class="card stack"><div><h3>' + t("briefing.recipes") + '</h3><div class="recipe-row">' + recipes + '</div></div><div class="hint-box"><strong>🐥 ' + t("briefing.tip") + '</strong><span>' + t(level.tutorial) + '</span></div><div class="two-column"><button class="btn btn--accent btn--wide" type="button" data-action="start-day">' + t("briefing.start") + '</button><button class="btn btn--secondary btn--wide" type="button" data-action="open-upgrades">' + t("briefing.upgrades") + ' · ' + n(CCC.state.progress.coins) + ' ' + t("common.coins") + '</button></div></div></div></section>';
    setScreen(html, "briefing");
    CCC.audio.setTrack(day <= 5 ? "sizzling" : "golden");
  }

  function orderHtml(order, session) {
    var item = recipe(order.recipeId);
    var patience = Math.round(CCC.utils.clamp(order.patience / order.maxPatience * 100, 0, 100));
    var isSelected = session.selectedOrderId === order.id;
    var deliverable = session.cooking.current && session.cooking.current.stage === "bagged";
    return '<button class="order-card' + (isSelected ? ' is-selected' : '') + (order.isNew ? ' is-new' : '') + (deliverable ? ' is-deliverable' : '') + '" type="button" data-game-action="' + (deliverable ? 'deliver' : 'select-order') + '" data-order-id="' + order.id + '" aria-pressed="' + isSelected + '"><span class="order-card__top"><span class="order-card__avatar" style="--avatar-bg:' + order.customer.bg + '" aria-hidden="true">' + order.customer.icon + '</span><span class="order-card__name">' + c().recipeIcon(item, true) + CCC.utils.escapeHtml(t(item.nameKey)) + '</span><span class="order-card__price">+' + n(order.price) + '</span></span><span class="order-card__flavor">' + (deliverable ? t("action.deliver") : t("action.select")) + '</span><span class="progress progress--patience" data-order-progress="' + order.id + '" aria-label="' + patience + '%"><span class="progress__fill" style="--value:' + patience + '%"></span><span class="progress__label">⏳ ' + patience + '%</span></span></button>';
  }

  function renderOrders() {
    var session = CCC.state.session;
    var rail = document.getElementById("order-rail");
    if (!rail || !session) { return; }
    rail.innerHTML = session.orders.items.map(function (order) { return orderHtml(order, session); }).join("");
  }

  function station(className, zone, titleKey, body, actions, label) {
    return '<section class="station ' + className + '" data-drop-zone data-zone="' + zone + '" role="group" tabindex="0" aria-label="' + CCC.utils.escapeHtml(label || t(titleKey)) + '"><h3 class="station__title">' + t(titleKey) + '</h3><div class="station__body">' + body + '</div>' + (actions ? '<div class="station__actions">' + actions + '</div>' : '') + '</section>';
  }

  function currentAt(location) {
    var piece = CCC.state.session.cooking.current;
    return piece && piece.location === location ? c().food(piece, true) : "";
  }

  function renderKitchen() {
    var session = CCC.state.session;
    var target = document.getElementById("kitchen-grid");
    if (!target || !session) { return; }
    var cooking = session.cooking;
    var piece = cooking.current;
    var supplyBody = currentAt("supply") || '<span class="food-item" data-stage="raw" aria-hidden="true"><span>' + t("food.raw") + '</span></span>';
    var supplyActions = '<button class="btn btn--accent" type="button" data-game-action="take"' + (piece ? ' disabled' : '') + '>' + t("action.takeChicken") + '</button>';

    var marinadeBody = '<div class="bowl" aria-hidden="true">' + t("station.marinade") + '</div>' + currentAt("marinade");
    if (piece && piece.location === "marinade") { marinadeBody += c().progress(piece.marinade, "", t("meter.marinade", { value: Math.round(piece.marinade) })).replace('class="progress ', 'id="marinade-progress" class="progress '); }
    var marinadeActions = piece && piece.stage === "marinating" ? '<button class="btn" type="button" data-game-action="marinate-toggle">' + (piece.marinateActive ? t("action.stopMarinate") : t("action.startMarinate")) + '</button>' : "";

    var coatingBody = '<div class="flour-bed" aria-hidden="true">' + t("station.coating") + '</div>' + currentAt("coating");
    if (piece && piece.location === "coating") { coatingBody += c().progress(piece.coating, "", t("meter.coating", { value: Math.round(piece.coating) })).replace('class="progress ', 'id="coating-progress" class="progress '); }
    var coatingActions = piece && piece.stage === "coating" ? '<button class="btn" type="button" data-game-action="coat">' + t("action.coat") + '</button>' : "";

    var idealLow = session.upgrades.fryer >= 3 ? 167 : 170;
    var idealHigh = session.upgrades.fryer >= 3 ? 183 : 180;
    var heatValue = CCC.utils.clamp((cooking.temperature - 130) / 85 * 100, 0, 100);
    var basketHtml = cooking.fryers.map(function (fryingPiece, index) {
      if (!fryingPiece) { return '<div class="fryer-basket" data-drop-zone data-zone="fryer" data-basket-index="' + index + '" role="button" tabindex="0"><span class="fryer-basket__empty">' + t("meter.emptyBasket", { number: index + 1 }) + '</span></div>'; }
      var done = Math.round(fryingPiece.fry.doneness);
      var state = fryingPiece.fry.flipAt === null ? t("meter.notFlipped") : t("meter.flipped");
      return '<div class="fryer-basket" data-basket="' + index + '">' + c().food(fryingPiece, false) + c().progress(done, "", t("meter.doneness", { value: done })).replace('class="progress ', 'data-fry-progress="' + index + '" class="progress ') + '<span class="status-pill">' + state + '</span><div class="station__actions"><button class="btn btn--secondary" type="button" data-game-action="flip" data-index="' + index + '"' + (fryingPiece.fry.flipAt !== null ? ' disabled' : '') + '>' + t("action.flip") + '</button><button class="btn" type="button" data-game-action="collect" data-index="' + index + '">' + t("action.collect") + '</button></div></div>';
    }).join("");
    var collected = piece && piece.location === "fryer" ? c().food(piece, true) : "";
    var fryerBody = '<div class="fryer-wrap"><div class="fryer-meter"><strong class="temperature" id="temperature-value">' + t("meter.temperature", { value: Math.round(cooking.temperature) }) + '</strong>' + c().progress(heatValue, "progress--heat", t("meter.ideal") + ' ' + idealLow + '–' + idealHigh + '°C').replace('class="progress ', 'id="heat-progress" class="progress ') + '</div><div class="basket-row">' + basketHtml + '</div>' + collected + '</div>';
    var fryerActions = '<button class="btn btn--secondary" type="button" data-game-action="heat-down">' + t("action.heatDown") + '</button><button class="btn btn--accent" type="button" data-game-action="heat-up">' + t("action.heatUp") + '</button>';

    var seasoningPiece = currentAt("seasoning");
    var seasoningEnabled = piece && piece.location === "seasoning" && piece.stage === "fried" && !piece.failed;
    var seasoningJars = CCC.data.recipes.slice(0, session.level.recipes).map(function (item) {
      return '<button class="seasoning-jar" type="button" style="--jar-color:' + item.jarColor + ';--jar-shape:' + item.jarShape + '" data-game-action="season" data-recipe="' + item.id + '" aria-label="' + CCC.utils.escapeHtml(t(item.nameKey)) + '"' + (seasoningEnabled ? '' : ' disabled') + '><span aria-hidden="true">' + item.icon + '</span></button>';
    }).join("");
    var seasoningBody = seasoningPiece + '<div class="seasoning-grid">' + seasoningJars + '</div>';

    var bagBody = currentAt("bagging") || '<span aria-hidden="true" style="font-size:2.5rem">🛍️</span>';
    var bagActions = piece && piece.stage === "seasoned" ? '<button class="btn" type="button" data-game-action="bag">' + t("action.bag") + '</button>' : "";
    var wasteActions = piece && piece.failed ? '<button class="btn btn--danger" type="button" data-game-action="discard">' + t("action.discard") + '</button>' : "";

    target.innerHTML = station("station--supply", "supply", "station.supply", supplyBody, supplyActions) +
      station("station--marinade", "marinade", "station.marinade", marinadeBody, marinadeActions) +
      station("station--coating", "coating", "station.coating", coatingBody, coatingActions) +
      station("station--fryer", "fryer", "station.fryer", fryerBody, fryerActions) +
      station("station--seasoning", "seasoning", "station.seasoning", seasoningBody, "") +
      station("station--bagging", "bagging", "station.bagging", bagBody, bagActions) +
      station("station--waste", "waste", "station.waste", '<span aria-hidden="true" style="font-size:2.2rem">🗑️</span>', wasteActions);
  }

  function stepInfo(session) {
    var piece = session.cooking.current;
    if (!piece && session.cooking.fryers.some(Boolean)) { return { number: 4, key: "status.fry" }; }
    if (!piece) { return { number: 1, key: "status.takeChicken" }; }
    if (piece.stage === "raw") { return { number: 2, key: "status.moveMarinade" }; }
    if (piece.stage === "marinating") { return { number: 2, key: "status.marinate" }; }
    if (piece.stage === "marinated") { return { number: 3, key: "status.moveCoating" }; }
    if (piece.stage === "coating") { return { number: 3, key: "status.coat" }; }
    if (piece.stage === "fried") { return { number: 5, key: piece.failed ? "status.ruined" : "status.season" }; }
    if (piece.stage === "seasoned") { return { number: 5, key: "status.bag" }; }
    return { number: 5, key: "status.deliver" };
  }

  function qualityHtml() {
    if (!lastQuality) { return '<span class="muted">' + t("briefing.tip") + '</span>'; }
    return ['marinade', 'coating', 'frying', 'flavor'].map(function (key) {
      var labelKey = key === "coating" ? "quality.coat" : (key === "frying" ? "quality.fry" : (key === "flavor" ? "quality.flavor" : "quality.marinate"));
      return '<div class="quality-row"><span>' + t(labelKey) + '</span><strong>' + lastQuality[key] + '%</strong></div>';
    }).join("");
  }

  function renderGame(options) {
    var session = CCC.state.session;
    if (!session) { CCC.router.go("home"); return; }
    lastQuality = null;
    var step = stepInfo(session);
    var html = '<section id="game-screen" class="game-screen" aria-label="' + t("common.day", { day: session.day }) + '"><header class="game-hud"><div class="hud-cell"><span class="hud-cell__label">' + t("common.day", { day: session.day }) + '</span><strong class="hud-cell__value">' + session.day + ' / 10</strong></div><div class="hud-cell"><span class="hud-cell__label">' + t("game.time") + '</span><strong class="hud-cell__value" data-hud="time">' + CCC.utils.formatTime(session.remaining) + '</strong></div><div class="hud-cell"><span class="hud-cell__label">' + t("game.revenue") + '</span><strong class="hud-cell__value" data-hud="revenue">' + n(session.revenue) + '</strong></div><div class="hud-cell"><span class="hud-cell__label">' + t("game.goal") + '</span><strong class="hud-cell__value">' + n(session.level.goal) + '</strong></div><div class="hud-cell"><span class="hud-cell__label">' + t("common.coins") + '</span><strong class="hud-cell__value">' + n(CCC.state.progress.coins) + '</strong></div><div class="hud-cell"><span class="hud-cell__label">' + t("game.combo") + '</span><strong class="hud-cell__value" data-hud="combo">×' + session.combo + '</strong></div><button class="btn btn--square" type="button" data-game-action="pause" aria-label="' + t("game.pause") + '">⏸</button></header><aside class="panel-surface order-rail" id="order-rail" aria-label="' + t("game.orders") + '"></aside><main class="panel-surface kitchen" aria-label="' + t("game.kitchen") + '"><div class="kitchen-grid" id="kitchen-grid"></div></main><aside class="panel-surface control-rail" aria-label="' + t("game.controls") + '"><div class="control-panel"><h2 class="panel-heading">' + t("game.controls") + '</h2><div class="hint-box current-step"><span class="current-step__number" id="step-number">' + step.number + '</span><span id="game-hint">' + t(step.key) + '</span></div><span class="status-pill" data-hud="mistakes">' + t("game.mistakes", { count: session.mistakes }) + '</span><p class="muted" data-hud="combo-next">' + comboHint(session.combo) + '</p><div class="card quality-list" id="quality-list">' + qualityHtml() + '</div></div></aside></section><aside id="orientation-tip" class="orientation-tip" hidden><span>↔️ ' + t("orientation.tip") + '</span><button class="btn btn--secondary" type="button" data-action="dismiss-orientation">' + t("orientation.dismiss") + '</button></aside>';
    setScreen(html, "game");
    renderOrders();
    renderKitchen();
    updateGame(session);
    CCC.ui.input.bindGame(document.getElementById("game-screen"));
    listen("gametick", updateGame);
    listen("orderchange", function () { renderOrders(); });
    listen("cookingchange", function () {
      renderKitchen(); updateGame(session); renderOrders();
      var currentStep = stepInfo(session);
      var stepNumber = document.getElementById("step-number");
      if (stepNumber) { stepNumber.textContent = currentStep.number; }
    });
    listen("feedback", function (data) {
      lastFeedbackKey = data.key;
      var hint = document.getElementById("game-hint");
      if (hint) { hint.textContent = t(data.key, data.values); }
      if (data.tone === "error" || data.tone === "success" || data.tone === "warning") { c().toast(t(data.key, data.values), data.tone === "warning" ? "" : data.tone); }
    });
    listen("delivery", function (data) {
      lastQuality = data.quality;
      var list = document.getElementById("quality-list");
      if (list) { list.innerHTML = qualityHtml(); }
    });
    listen("viewportchange", updateOrientationTip);
    updateOrientationTip();
    CCC.audio.setTrack(session.day <= 5 ? "sizzling" : "golden");
    if (options && options.showPause) { setTimeout(CCC.router.togglePause, 0); }
  }

  function comboHint(combo) {
    if (combo >= 10) { return t("game.maxCombo"); }
    var next = combo < 3 ? 3 : (combo < 6 ? 6 : 10);
    return t("game.nextCombo", { count: next });
  }

  function updateGame(session) {
    if (!session || CCC.state.screen !== "game") { return; }
    var values = {
      time: CCC.utils.formatTime(session.remaining), revenue: n(session.revenue), combo: "×" + session.combo,
      mistakes: t("game.mistakes", { count: session.mistakes }), "combo-next": comboHint(session.combo)
    };
    Object.keys(values).forEach(function (key) { var el = document.querySelector('[data-hud="' + key + '"]'); if (el) { el.textContent = values[key]; } });
    var timeEl = document.querySelector('[data-hud="time"]');
    if (timeEl) { timeEl.classList.toggle("danger-text", session.remaining <= 10); }
    session.orders.items.forEach(function (order) {
      var bar = document.querySelector('[data-order-progress="' + order.id + '"]');
      if (!bar) { return; }
      var percent = Math.round(CCC.utils.clamp(order.patience / order.maxPatience * 100, 0, 100));
      bar.setAttribute("aria-label", percent + "%");
      var fill = bar.querySelector(".progress__fill"); if (fill) { fill.style.setProperty("--value", percent + "%"); }
      var label = bar.querySelector(".progress__label"); if (label) { label.textContent = "⏳ " + percent + "%"; }
    });
    var cooking = session.cooking;
    var temperature = document.getElementById("temperature-value");
    if (temperature) { temperature.textContent = t("meter.temperature", { value: Math.round(cooking.temperature) }); }
    var heat = document.getElementById("heat-progress");
    if (heat) { var heatFill = heat.querySelector(".progress__fill"); if (heatFill) { heatFill.style.setProperty("--value", CCC.utils.clamp((cooking.temperature - 130) / 85 * 100, 0, 100) + "%"); } }
    if (cooking.current && cooking.current.location === "marinade") { updateProgress("marinade-progress", cooking.current.marinade, t("meter.marinade", { value: Math.round(cooking.current.marinade) })); }
    var marinateButton = document.querySelector('[data-game-action="marinate-toggle"]');
    if (marinateButton && cooking.current) { marinateButton.textContent = cooking.current.marinateActive ? t("action.stopMarinate") : t("action.startMarinate"); }
    if (cooking.current && cooking.current.location === "coating") { updateProgress("coating-progress", cooking.current.coating, t("meter.coating", { value: Math.round(cooking.current.coating) })); }
    cooking.fryers.forEach(function (piece, index) {
      if (!piece) { return; }
      var done = Math.round(piece.fry.doneness);
      updateProgressBySelector('[data-fry-progress="' + index + '"]', done, t("meter.doneness", { value: done }));
      var food = document.querySelector('[data-basket="' + index + '"] .food-item');
      if (food) { food.dataset.stage = done > 100 ? "fried-burnt" : (done >= 90 ? "fried-golden" : "fried-light"); }
    });
  }

  function updateProgress(id, value, label) { updateProgressBySelector("#" + id, value, label); }
  function updateProgressBySelector(selector, value, label) {
    var bar = document.querySelector(selector); if (!bar) { return; }
    var fill = bar.querySelector(".progress__fill"); if (fill) { fill.style.setProperty("--value", CCC.utils.clamp(value, 0, 100) + "%"); }
    var text = bar.querySelector(".progress__label"); if (text) { text.textContent = label; }
    bar.setAttribute("aria-label", label);
  }

  function updateOrientationTip() {
    var tip = document.getElementById("orientation-tip");
    if (!tip) { return; }
    tip.hidden = CCC.state.orientationTipDismissed || global.innerWidth >= 768 || global.innerWidth > global.innerHeight;
  }

  function renderResult(options) {
    var result = (options && options.result) || CCC.state.lastResult;
    if (!result) { CCC.router.go("home"); return; }
    var title = result.success ? t("result.success") : t("result.failure");
    var stats = [
      [t("result.revenue"), n(result.revenue)], [t("result.quality"), result.quality + "%"], [t("result.satisfaction"), result.satisfaction + "%"],
      [t("result.mistakes"), result.mistakes], [t("result.waste"), result.waste], [t("result.bestCombo"), "×" + result.bestCombo]
    ].map(function (item) { return '<div class="result-stat"><span>' + item[0] + '</span><strong>' + item[1] + '</strong></div>'; }).join("");
    var actions = result.success ? '<button class="btn btn--secondary" type="button" data-action="result-home">' + t("common.home") + '</button><button class="btn" type="button" data-action="result-upgrade">' + t("result.upgrade") + '</button><button class="btn btn--accent" type="button" data-action="result-next">' + (result.day >= 10 ? t("result.finish") : t("result.nextDay")) + '</button>' : '<button class="btn btn--secondary" type="button" data-action="result-home">' + t("common.home") + '</button><button class="btn btn--accent" type="button" data-action="result-retry">' + t("common.retry") + '</button>';
    var html = '<section class="screen screen--center"><div class="content-panel result-hero"><img class="result-mascot" src="assets/images/characters/chick-chef.svg" width="140" height="140" alt=""><span class="status-pill">' + t("common.day", { day: result.day }) + '</span><h1>' + title + '</h1>' + c().stars(result.stars) + '<div class="result-stats">' + stats + '</div><p class="' + (result.success ? 'success-text' : 'muted') + '">' + (result.success ? t("result.coinsEarned", { coins: n(result.revenue) }) : t("result.failedHint")) + '</p><div class="cluster" style="justify-content:center">' + actions + '</div></div></section>';
    setScreen(html, "result");
    CCC.audio.setTrack(result.day >= 6 ? "golden" : "sizzling");
  }

  function upgradeCard(data) {
    var level = CCC.state.progress.upgrades[data.id];
    var price = CCC.upgrades.priceForNext(data.id);
    var canBuy = CCC.upgrades.canBuy(data.id);
    var pips = [1, 2, 3].map(function (value) { return '<i class="' + (value <= level ? 'is-on' : '') + '"></i>'; }).join("");
    var button = level >= 3 ? '<button class="btn btn--secondary" type="button" disabled>' + t("common.max") + '</button>' : '<button class="btn" type="button" data-action="buy-upgrade" data-upgrade="' + data.id + '"' + (canBuy ? '' : ' disabled') + '>' + t("upgrade.buy", { price: n(price) }) + (!canBuy ? '<span class="btn__sub">' + t("upgrade.short", { amount: n(price - CCC.state.progress.coins) }) + '</span>' : '') + '</button>';
    return '<article class="card upgrade-card"><div><span class="upgrade-icon" aria-hidden="true">' + data.icon + '</span><h2>' + t(data.nameKey) + '</h2><span class="status-pill">' + t("upgrade.level", { level: level }) + '</span></div><div class="level-pips" aria-label="' + level + ' / 3">' + pips + '</div><div><strong>' + t("upgrade.current") + '</strong><p>' + t(data.effectKeys[level - 1]) + '</p>' + (level < 3 ? '<strong>' + t("upgrade.next") + '</strong><p>' + t(data.effectKeys[level]) + '</p>' : '') + '</div>' + button + '</article>';
  }

  function renderUpgrades() {
    var cards = Object.keys(CCC.data.upgrades).map(function (id) { return upgradeCard(CCC.data.upgrades[id]); }).join("");
    setScreen('<section class="screen"><div class="content-panel">' + header(t("upgrade.title"), "upgrade-back", '<span class="status-pill">🪙 ' + t("upgrade.wallet", { coins: n(CCC.state.progress.coins) }) + '</span>') + '<div class="upgrade-grid">' + cards + '</div></div></section>', "upgrades");
    CCC.audio.setTrack("morning");
  }

  function renderCompletion() {
    var totalStars = 0;
    var days = CCC.data.levels.map(function (level) {
      var record = CCC.state.progress.records[level.day];
      totalStars += record.stars;
      return '<div class="completion-day"><strong>' + t("common.day", { day: level.day }) + '</strong><br>★ ' + record.stars + '<br>' + n(record.revenue) + '</div>';
    }).join("");
    setScreen('<section class="screen screen--center"><div class="content-panel completion-banner"><img src="assets/images/characters/chick-chef.svg" width="180" height="180" alt=""><h1>' + t("completion.title") + '</h1><p>' + t("completion.body") + '</p>' + c().stars(3) + '<h2>' + t("completion.totalStars", { stars: totalStars }) + '</h2><div class="completion-days">' + days + '</div><div class="cluster" style="justify-content:center"><button class="btn btn--secondary" type="button" data-action="back-home">' + t("common.home") + '</button><button class="btn btn--accent" type="button" data-action="completion-play">' + t("completion.playAgain") + '</button></div></div></section>', "completion");
    CCC.audio.setTrack("golden");
  }

  CCC.ui = CCC.ui || {};
  CCC.ui.screens = {
    init: function (element) { app = element; },
    home: renderHome, help: renderHelp, settings: renderSettings, briefing: renderBriefing,
    game: renderGame, result: renderResult, upgrades: renderUpgrades, completion: renderCompletion,
    updateGame: updateGame
  };
}(typeof window !== "undefined" ? window : globalThis));
