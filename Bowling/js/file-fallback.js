/*
 * Classic-script fallback for direct file:// opening.
 * Some browsers support modules but refuse to import another file from a file:// page.
 * The normal module app gets priority; this small self-contained launcher takes over only
 * when the module entry point does not announce readiness.
 */
(function () {
  "use strict";

  var start = function () {
    if (window.__CUTE_BOWLING_READY__ || window.__CUTE_BOWLING_FALLBACK_STARTED__) return;
    window.__CUTE_BOWLING_FALLBACK_STARTED__ = true;

    var sections = {
      menu: document.getElementById("screen-main-menu"),
      game: document.getElementById("screen-game"),
      instructions: document.getElementById("screen-instructions"),
      settings: document.getElementById("screen-settings")
    };
    var themes = ["cute", "ocean", "sunset", "forest", "night"];
    var languages = ["zh", "en", "ja"];
    var fallbackSettings = {
      language: "zh",
      theme: "cute",
      bgmVolume: 0.5,
      sfxVolume: 0.7,
      vibration: true
    };
    var language = "zh";
    try { language = localStorage.getItem("lang") || "zh"; } catch (error) { language = "zh"; }
    var settings = readSettings();
    language = languages.indexOf(language) >= 0 ? language : settings.language;
    settings.language = language;
    var gameState = { rolls: [], currentFrame: 1 };
    var angle = 0;
    var power = 0.68;
    var rolling = false;
    var paused = false;
    var animationId = 0;
    var animationStart = 0;
    var animationPauseAt = 0;
    var animationPausedFor = 0;
    var visualProgress = 0;

    var text = {
      zh: {
        title: "可愛保齡球", start: "開始遊戲", cont: "繼續遊戲", instructions: "遊戲說明", settings: "設定",
        noProgress: "目前尚無遊戲進度", welcome: "波波和平平等你來挑戰全倒！", home: "回主畫面", back: "返回",
        game: "遊戲畫面", frame: "第 {n} 局", ball: "第 {n} 球", score: "目前得分", total: "總分", direction: "方向",
        power: "力道", launch: "發球！", ready: "準備好了嗎？瞄準後蓄力發球！", rolling: "球正在滾動……",
        pause: "暫停", paused: "遊戲暫停", resume: "繼續", restart: "重新開始", gameOver: "恭喜完成十局！",
        playAgain: "再玩一局", strike: "全倒！", spare: "補中！", nice: "漂亮的一球！", instructionTitle: "遊戲說明",
        basic: "基本操作", aim: "瞄準", aimText: "拖曳球道左右移動，找到最舒服的出手角度。", charge: "蓄力",
        chargeText: "調整力道拉桿；力道越大，球速越快。", release: "發球", releaseText: "按下發球鍵，觀察球瓶碰撞與連鎖倒地！",
        scoring: "計分規則", strikeRule: "全倒 Strike：第一球擊倒十瓶，該局分數加上下兩球。",
        spareRule: "補中 Spare：兩球合計十瓶，該局分數加上下方的下一球。", tenth: "第十局：全倒或補中時可獲得額外補球。",
        tips: "波波小提醒", tip: "蓄力太滿又偏太多，球會跑去旁邊玩耍唷！", language: "語言", theme: "配色主題",
        cute: "可愛粉彩", ocean: "海洋藍調", sunset: "夕陽橘蜜", forest: "森林綠意", night: "夜間柔光",
        bgm: "BGM 音量", sfx: "音效音量", vibration: "震動回饋", reset: "重設為預設值", saved: "設定已即時套用"
      },
      en: {
        title: "Cute Bowling", start: "Start Game", cont: "Continue", instructions: "How to Play", settings: "Settings",
        noProgress: "No saved progress yet", welcome: "Bobo and Pingping are ready for your perfect game!", home: "Home", back: "Back",
        game: "Bowling Game", frame: "Frame {n}", ball: "Ball {n}", score: "Frame score", total: "Total", direction: "Direction",
        power: "Power", launch: "Roll!", ready: "Ready? Aim, charge, and roll!", rolling: "The ball is rolling…",
        pause: "Pause", paused: "Game paused", resume: "Resume", restart: "Restart", gameOver: "Congratulations on ten frames!",
        playAgain: "Play again", strike: "Strike!", spare: "Spare!", nice: "Nice roll!", instructionTitle: "How to Play",
        basic: "Basic controls", aim: "Aim", aimText: "Drag the lane left or right until your angle feels just right.", charge: "Charge",
        chargeText: "Adjust the power slider; more power makes the ball faster.", release: "Roll", releaseText: "Press Roll and watch the pins tumble through chain reactions!",
        scoring: "Scoring", strikeRule: "Strike: clear all ten pins on the first ball and add your next two balls.",
        spareRule: "Spare: clear ten pins in two balls and add your next one ball.", tenth: "Tenth frame: a strike or spare grants bonus balls.",
        tips: "Bobo's tip", tip: "If you max the power while aiming too far aside, the ball may go sightseeing!", language: "Language", theme: "Color theme",
        cute: "Pastel cute", ocean: "Ocean blue", sunset: "Sunset orange", forest: "Forest green", night: "Soft night",
        bgm: "BGM volume", sfx: "Sound effects", vibration: "Vibration feedback", reset: "Reset to defaults", saved: "Settings applied instantly"
      },
      ja: {
        title: "かわいいボウリング", start: "ゲーム開始", cont: "つづきから", instructions: "遊び方", settings: "設定",
        noProgress: "保存された進行はありません", welcome: "ボボとピンピンと一緒にパーフェクトを目指そう！", home: "ホームへ戻る", back: "戻る",
        game: "ボウリングゲーム", frame: "{n}フレーム目", ball: "{n}投目", score: "フレーム得点", total: "合計", direction: "方向",
        power: "パワー", launch: "投げる！", ready: "準備はいい？狙って、ためて、投げよう！", rolling: "ボールが転がっています…",
        pause: "一時停止", paused: "ゲーム一時停止", resume: "再開", restart: "最初から", gameOver: "10フレーム完走おめでとう！",
        playAgain: "もう一度遊ぶ", strike: "ストライク！", spare: "スペア！", nice: "ナイスボール！", instructionTitle: "遊び方",
        basic: "基本操作", aim: "狙う", aimText: "レーンを左右にドラッグして、投げやすい角度を探そう。", charge: "ためる",
        chargeText: "パワースライダーを調整。パワーが大きいほど速くなるよ。", release: "投げる", releaseText: "投球ボタンを押して、ピンの連鎖反応を見届けよう！",
        scoring: "スコアのルール", strikeRule: "ストライク：1投目で10本すべて倒すと、次の2投分が加算されます。",
        spareRule: "スペア：2投で10本倒すと、次の1投分が加算されます。", tenth: "10フレーム目：ストライクやスペアにはボーナス投球があります。",
        tips: "ボボのヒント", tip: "パワー満タンで狙いがずれると、ボールがお散歩しちゃうよ！", language: "言語", theme: "カラーテーマ",
        cute: "パステルキュート", ocean: "オーシャンブルー", sunset: "サンセットオレンジ", forest: "フォレストグリーン", night: "ソフトナイト",
        bgm: "BGM音量", sfx: "効果音音量", vibration: "振動フィードバック", reset: "初期設定に戻す", saved: "設定をすぐに適用しました"
      }
    };

    function t(key, params) {
      var value = (text[language] && text[language][key]) || text.zh[key] || key;
      Object.keys(params || {}).forEach(function (name) { value = value.replace(new RegExp("\\{" + name + "\\}", "g"), params[name]); });
      return value;
    }

    function readSettings() {
      var result = {};
      try { result = JSON.parse(localStorage.getItem("bowling_settings_v1") || "{}"); } catch (error) { result = {}; }
      result = Object.assign({}, fallbackSettings, result);
      result.language = languages.indexOf(result.language) >= 0 ? result.language : "zh";
      result.theme = themes.indexOf(result.theme) >= 0 ? result.theme : "cute";
      result.bgmVolume = Math.max(0, Math.min(1, Number(result.bgmVolume) || 0));
      result.sfxVolume = Math.max(0, Math.min(1, Number(result.sfxVolume) || 0));
      return result;
    }

    function saveSettings() {
      try { localStorage.setItem("bowling_settings_v1", JSON.stringify(settings)); localStorage.setItem("lang", language); } catch (error) { /* storage may be disabled */ }
      applyTheme(settings.theme);
    }

    function applyTheme(theme) {
      document.body.dataset.theme = theme;
      var link = document.getElementById("theme-style");
      if (link) link.href = "css/themes/theme-" + theme + ".css";
    }

    function show(name) {
      Object.keys(sections).forEach(function (key) { sections[key].classList.toggle("active", key === name); });
    }

    function loadProgress() {
      try {
        var value = JSON.parse(localStorage.getItem("bowling_save_v1") || "null");
        return value && Array.isArray(value.rolls) && value.rolls.length ? value : null;
      } catch (error) { return null; }
    }

    function clearProgress() {
      try { localStorage.removeItem("bowling_save_v1"); } catch (error) { /* storage may be disabled */ }
    }

    function saveProgress() {
      if (!gameState.rolls.length) return;
      try { localStorage.setItem("bowling_save_v1", JSON.stringify(gameState)); } catch (error) { /* storage may be disabled */ }
    }

    function stopAnimation() {
      if (animationId) cancelAnimationFrame(animationId);
      animationId = 0;
      rolling = false;
      paused = false;
    }

    function frameRecords(rolls) {
      var records = [], index = 0;
      for (var frame = 0; frame < 9; frame += 1) {
        if (index >= rolls.length) { records.push({ rolls: [], type: "empty", complete: false }); continue; }
        var first = rolls[index];
        if (first === 10) { records.push({ rolls: [first], type: "strike", complete: true }); index += 1; continue; }
        if (index + 1 >= rolls.length) { records.push({ rolls: [first], type: "partial", complete: false }); index += 1; continue; }
        var second = rolls[index + 1];
        records.push({ rolls: [first, second], type: first + second === 10 ? "spare" : "open", complete: true });
        index += 2;
      }
      var last = rolls.slice(index, index + 3), type = "empty", complete = false;
      if (last.length) {
        if (last[0] === 10) { type = "strike"; complete = last.length === 3; }
        else if (last.length === 1) type = "partial";
        else if (last[0] + last[1] === 10) { type = "spare"; complete = last.length === 3; }
        else { type = "open"; complete = true; }
      }
      records.push({ rolls: last, type: type, complete: complete });
      return records;
    }

    function scores(rolls) {
      var result = [], index = 0;
      for (var frame = 0; frame < 10; frame += 1) {
        if (index >= rolls.length) { result.push(null); continue; }
        var first = rolls[index];
        if (frame === 9) {
          var last = rolls.slice(index, index + 3);
          if (first === 10 && last.length === 3) result.push(last[0] + last[1] + last[2]);
          else if (last.length >= 2 && first + last[1] < 10) result.push(first + last[1]);
          else if (last.length === 3) result.push(last[0] + last[1] + last[2]);
          else result.push(null);
          continue;
        }
        if (first === 10) { result.push(index + 2 < rolls.length ? 10 + rolls[index + 1] + rolls[index + 2] : null); index += 1; continue; }
        if (index + 1 >= rolls.length) { result.push(null); continue; }
        var second = rolls[index + 1];
        if (first + second === 10) result.push(index + 2 < rolls.length ? 10 + rolls[index + 2] : null);
        else result.push(first + second);
        index += 2;
      }
      return result;
    }

    function totalScore() { return scores(gameState.rolls).reduce(function (sum, value) { return sum + (value || 0); }, 0); }

    function nextContext() {
      var records = frameRecords(gameState.rolls), current = records.find(function (record) { return !record.complete; });
      if (!current) return { done: true, frame: 10, ball: 0, pins: 0 };
      var currentFrame = records.indexOf(current) + 1;
      if (currentFrame === 10) {
        if (current.rolls.length === 0) return { done: false, frame: 10, ball: 1, pins: 10 };
        if (current.rolls[0] === 10) return { done: false, frame: 10, ball: current.rolls.length + 1, pins: current.rolls.length === 1 || current.rolls[1] === 10 ? 10 : 10 - current.rolls[1] };
        if (current.rolls.length === 1) return { done: false, frame: 10, ball: 2, pins: 10 - current.rolls[0] };
        if (current.rolls[0] + current.rolls[1] === 10) return { done: false, frame: 10, ball: 3, pins: 10 };
        return { done: true, frame: 10, ball: 0, pins: 0 };
      }
      if (current.rolls.length === 0) return { done: false, frame: currentFrame, ball: 1, pins: 10 };
      return { done: false, frame: currentFrame, ball: 2, pins: 10 - current.rolls[0] };
    }

    function currentIsComplete() { return frameRecords(gameState.rolls)[9].complete; }

    function renderMenu() {
      var progress = loadProgress();
      sections.menu.innerHTML = '<div class="main-menu-shell"><div class="quick-language"><img src="assets/images/icons/icon-language.svg" alt="" aria-hidden="true" /><select id="fb-language" aria-label="' + t("language") + '"><option value="zh">繁中</option><option value="en">English</option><option value="ja">日本語</option></select></div><div class="mascot-stage" aria-hidden="true"><img class="mascot-bobo" src="assets/images/characters/mascot-bobo.svg" alt="" /><img class="mascot-pingping" src="assets/images/characters/mascot-pingping.svg" alt="" /></div><div class="menu-content"><div class="game-logo"><span class="game-logo__eyebrow">BOBO × PINGPING</span><h1 id="main-menu-title" class="game-logo__title">' + t("title") + '</h1></div><p class="welcome-copy">' + t("welcome") + '</p><div class="menu-actions"><button class="cute-button cute-button--large" id="fb-start"><img class="button-icon" src="assets/images/icons/icon-start.svg" alt="" aria-hidden="true" />' + t("start") + '</button><button class="cute-button cute-button--secondary cute-button--large" id="fb-continue" ' + (progress ? "" : "disabled") + '><img class="button-icon" src="assets/images/icons/icon-continue.svg" alt="" aria-hidden="true" />' + t("cont") + '</button><p class="continue-hint">' + (progress ? "" : t("noProgress")) + '</p><button class="cute-button cute-button--soft cute-button--large" id="fb-instructions"><img class="button-icon" src="assets/images/icons/icon-instructions.svg" alt="" aria-hidden="true" />' + t("instructions") + '</button><button class="cute-button cute-button--soft cute-button--large" id="fb-settings"><img class="button-icon" src="assets/images/icons/icon-settings.svg" alt="" aria-hidden="true" />' + t("settings") + '</button></div></div></div>';
      var selector = document.getElementById("fb-language"); selector.value = language;
      document.getElementById("fb-start").onclick = function () { clearProgress(); gameState = { rolls: [], currentFrame: 1 }; renderGame(); show("game"); };
      document.getElementById("fb-continue").onclick = function () { var saved = loadProgress(); if (saved) { gameState = saved; renderGame(); show("game"); } };
      document.getElementById("fb-instructions").onclick = function () { renderInstructions(); show("instructions"); };
      document.getElementById("fb-settings").onclick = function () { renderSettings(); show("settings"); };
      selector.onchange = function () { language = selector.value; settings.language = language; saveSettings(); renderMenu(); };
    }

    function drawCanvas(progress, knocked) {
      var canvas = document.getElementById("fb-canvas"); if (!canvas) return;
      var rect = canvas.getBoundingClientRect(), ratio = Math.min(window.devicePixelRatio || 1, 2), width = Math.max(320, Math.round(rect.width || 800)), height = Math.max(260, Math.round(rect.height || 500));
      if (canvas.width !== width * ratio || canvas.height !== height * ratio) { canvas.width = width * ratio; canvas.height = height * ratio; }
      var ctx = canvas.getContext("2d"); ctx.setTransform(ratio, 0, 0, ratio, 0, 0); ctx.clearRect(0, 0, width, height);
      var sky = ctx.createLinearGradient(0, 0, 0, height); sky.addColorStop(0, "#b8e8fc"); sky.addColorStop(0.48, "#e8f8ff"); sky.addColorStop(0.49, "#c69477"); sky.addColorStop(1, "#7b4e42"); ctx.fillStyle = sky; ctx.fillRect(0, 0, width, height);
      var topLeft = width * 0.38, topRight = width * 0.62, bottomLeft = width * 0.13, bottomRight = width * 0.87;
      var lane = ctx.createLinearGradient(0, height * 0.18, 0, height * 0.96); lane.addColorStop(0, "#fff0c7"); lane.addColorStop(1, "#d79a68"); ctx.fillStyle = lane; ctx.beginPath(); ctx.moveTo(topLeft, height * 0.18); ctx.lineTo(topRight, height * 0.18); ctx.lineTo(bottomRight, height * 0.96); ctx.lineTo(bottomLeft, height * 0.96); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#d53d59"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(width * 0.2, height * 0.77); ctx.lineTo(width * 0.8, height * 0.77); ctx.stroke();
      var pins = [{ x: .5, y: .2 }, { x: .455, y: .25 }, { x: .545, y: .25 }, { x: .41, y: .3 }, { x: .5, y: .3 }, { x: .59, y: .3 }, { x: .365, y: .35 }, { x: .455, y: .35 }, { x: .545, y: .35 }, { x: .635, y: .35 }];
      pins.forEach(function (pin, index) { var y = height * (0.18 + pin.y * .75), left = topLeft + (bottomLeft - topLeft) * pin.y, right = topRight + (bottomRight - topRight) * pin.y, x = left + (right - left) * pin.x, fallen = index < knocked && progress > .55; ctx.save(); ctx.translate(x + (fallen ? (index % 2 ? 20 : -20) * progress : 0), y + (fallen ? progress * 18 : 0)); ctx.rotate(fallen ? (index % 2 ? .9 : -.9) * progress : 0); ctx.fillStyle = "#fffaf4"; ctx.beginPath(); ctx.ellipse(0, 0, 14, 22, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#ee5e75"; ctx.fillRect(-9, -6, 18, 5); ctx.restore(); });
      var ballY = height * (.88 - progress * .63), ballX = width * (.5 + angle * .25 * progress), radius = Math.max(12, width * .035); ctx.fillStyle = "#c32d72"; ctx.beginPath(); ctx.arc(ballX, ballY, radius, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ballX - radius * .35, ballY - radius * .38, radius * .18, 0, Math.PI * 2); ctx.fill();
    }

    function renderScoreboard() {
      var board = document.getElementById("fb-scoreboard"); if (!board) return;
      var recordList = frameRecords(gameState.rolls), scoreList = scores(gameState.rolls);
      board.innerHTML = recordList.map(function (record, index) { var shown = record.rolls.map(function (roll, rollIndex) { return roll === 10 ? "X" : record.type === "spare" && rollIndex === 1 ? "/" : roll; }).join(" ") || "&nbsp;"; return '<div class="score-frame' + (index + 1 === gameState.currentFrame && !record.complete ? " is-current" : "") + '"><div class="score-frame__number">' + (index + 1) + '</div><div class="score-frame__rolls">' + shown + '</div><div class="score-frame__total">' + (scoreList[index] == null ? "—" : scoreList[index]) + '</div></div>'; }).join("");
    }

    function renderGame() {
      var context = nextContext();
      sections.game.innerHTML = '<h1 id="game-screen-title" class="game-screen-title">' + t("game") + '</h1><div class="game-topbar"><div class="hud"><div class="hud__stats"><div class="hud-stat"><span class="hud-stat__label">' + t("frame", { n: context.frame }) + '</span><strong class="hud-stat__value">' + context.frame + '</strong></div><div class="hud-stat"><span class="hud-stat__label">' + t("ball", { n: context.ball }) + '</span><strong class="hud-stat__value">' + context.ball + '</strong></div><div class="hud-stat"><span class="hud-stat__label">' + t("score") + '</span><strong class="hud-stat__value">' + totalScore() + '</strong></div><div class="hud-stat"><span class="hud-stat__label">' + t("total") + '</span><strong id="fb-total" class="hud-stat__value">' + totalScore() + '</strong></div></div><button class="icon-button" id="fb-pause" aria-label="' + t("pause") + '"><img src="assets/images/icons/icon-pause.svg" alt="" aria-hidden="true" /></button></div></div><div class="game-scoreboard-wrap"><div class="scoreboard" id="fb-scoreboard" aria-label="' + t("total") + '"></div></div><div class="game-stage-wrap"><canvas id="fb-canvas" class="game-canvas" tabindex="0" aria-label="' + t("game") + '"></canvas><p id="fb-status" class="game-status">' + t(currentIsComplete() ? "gameOver" : "ready") + '</p><div id="fb-celebration" class="celebration"></div></div><div class="control-dock"><div class="control-group"><label for="fb-angle">' + t("direction") + '<output class="range-value" id="fb-angle-value">0°</output></label><input id="fb-angle" type="range" min="-100" max="100" value="0" /></div><div class="control-group"><label for="fb-power">' + t("power") + '<output class="range-value" id="fb-power-value">68%</output></label><input id="fb-power" type="range" min="0" max="100" value="68" /></div><button class="cute-button cute-button--large launch-button" id="fb-launch"><img class="button-icon" src="assets/images/icons/icon-launch.svg" alt="" aria-hidden="true" />' + t("launch") + '</button></div><div class="modal-backdrop" id="fb-modal" hidden><div class="modal-card"><div class="modal-card__header"><h2>' + t("paused") + '</h2><button class="icon-button" id="fb-close"><img src="assets/images/icons/icon-close.svg" alt="" aria-hidden="true" /></button></div><div class="modal-card__body"><button class="cute-button" id="fb-resume">' + t("resume") + '</button><button class="cute-button cute-button--secondary" id="fb-home">' + t("home") + '</button><button class="cute-button cute-button--soft" id="fb-restart">' + t("restart") + '</button></div></div></div>';
      renderScoreboard(); drawCanvas(visualProgress, 0);
      document.getElementById("fb-angle").oninput = function (event) { angle = Number(event.target.value) / 100; document.getElementById("fb-angle-value").textContent = Math.round(angle * 30) + "°"; };
      document.getElementById("fb-power").oninput = function (event) { power = Number(event.target.value) / 100; document.getElementById("fb-power-value").textContent = Math.round(power * 100) + "%"; };
      document.getElementById("fb-launch").onclick = launch;
      document.getElementById("fb-pause").onclick = openPause;
      document.getElementById("fb-close").onclick = closePause;
      document.getElementById("fb-resume").onclick = closePause;
      document.getElementById("fb-home").onclick = function () { stopAnimation(); saveProgress(); renderMenu(); show("menu"); };
      document.getElementById("fb-restart").onclick = function () { stopAnimation(); clearProgress(); gameState = { rolls: [], currentFrame: 1 }; closePause(); renderGame(); };
      sections.game.onkeydown = function (event) { if (event.key === "ArrowLeft") { angle = Math.max(-1, angle - .05); document.getElementById("fb-angle").value = angle * 100; } if (event.key === "ArrowRight") { angle = Math.min(1, angle + .05); document.getElementById("fb-angle").value = angle * 100; } if (event.code === "Space" && event.target.tagName !== "INPUT") { event.preventDefault(); launch(); } };
    }

    function launch() {
      if (rolling || currentIsComplete()) return;
      var context = nextContext(), center = 1 - Math.abs(angle), knocked = power >= .999 && Math.abs(angle) < .04 ? 10 : Math.min(context.pins, Math.max(0, Math.round(power * (.34 + center * .66) * 10)));
      rolling = true; paused = false; visualProgress = 0; animationStart = performance.now(); animationPausedFor = 0;
      document.getElementById("fb-launch").disabled = true; document.getElementById("fb-status").textContent = t("rolling");
      function animate(now) { if (paused) return; var progress = Math.min(1, (now - animationStart - animationPausedFor) / (power > .7 ? 760 : 1180)); visualProgress = progress; drawCanvas(progress, knocked); if (progress < 1) animationId = requestAnimationFrame(animate); else finishRoll(knocked); }
      animationId = requestAnimationFrame(animate);
    }

    function finishRoll(knocked) {
      animationId = 0;
      var context = nextContext(); gameState.rolls.push(knocked); gameState.currentFrame = nextContext().frame; saveProgress(); rolling = false; visualProgress = 1; renderScoreboard();
      var record = frameRecords(gameState.rolls)[context.frame - 1], celebration = document.getElementById("fb-celebration");
      if (record.type === "strike") celebration.textContent = t("strike"); else if (record.type === "spare") celebration.textContent = t("spare"); else celebration.textContent = t("nice");
      celebration.classList.remove("is-visible"); void celebration.offsetWidth; celebration.classList.add("is-visible");
      if (currentIsComplete()) document.getElementById("fb-status").textContent = t("gameOver"); else document.getElementById("fb-status").textContent = t("ready");
      document.getElementById("fb-launch").disabled = currentIsComplete(); drawCanvas(0, 0);
    }

    function openPause() { if (rolling) { paused = true; animationPauseAt = performance.now(); } document.getElementById("fb-modal").hidden = false; }
    function closePause() { document.getElementById("fb-modal").hidden = true; if (paused && rolling) { animationPausedFor += performance.now() - animationPauseAt; paused = false; var resumeFrame = function (now) { var button = document.getElementById("fb-launch"); if (!button) return; var context = nextContext(); var center = 1 - Math.abs(angle); var knocked = Math.min(context.pins, Math.max(0, Math.round(power * (.34 + center * .66) * 10))); var progress = Math.min(1, (now - animationStart - animationPausedFor) / (power > .7 ? 760 : 1180)); visualProgress = progress; drawCanvas(progress, knocked); if (progress < 1) requestAnimationFrame(resumeFrame); else finishRoll(knocked); }; animationId = requestAnimationFrame(resumeFrame); } }

    function renderInstructions() {
      sections.instructions.innerHTML = '<div class="screen-shell page-shell"><header class="page-header"><div class="page-header__title"><img src="assets/images/icons/icon-instructions.svg" alt="" aria-hidden="true" /><h1 id="instructions-screen-title">' + t("instructionTitle") + '</h1></div><button class="cute-button cute-button--soft" id="fb-instruction-back">' + t("home") + '</button></header><main class="instructions-content"><section class="instruction-card"><h2 class="instruction-card__title"><img src="assets/images/icons/icon-aim.svg" alt="" aria-hidden="true" />' + t("basic") + '</h2><div class="step-grid"><article class="step-card"><span class="step-card__number">1</span><h3>' + t("aim") + '</h3><p>' + t("aimText") + '</p></article><article class="step-card"><span class="step-card__number">2</span><h3>' + t("charge") + '</h3><p>' + t("chargeText") + '</p></article><article class="step-card"><span class="step-card__number">3</span><h3>' + t("release") + '</h3><p>' + t("releaseText") + '</p></article></div></section><section class="instruction-card"><h2 class="instruction-card__title"><img src="assets/images/icons/icon-strike.svg" alt="" aria-hidden="true" />' + t("scoring") + '</h2><ul class="rule-list"><li>' + t("strikeRule") + '</li><li>' + t("spareRule") + '</li><li>' + t("tenth") + '</li></ul></section><section class="instruction-card"><h2 class="instruction-card__title"><img src="assets/images/icons/icon-mascot.svg" alt="" aria-hidden="true" />' + t("tips") + '</h2><ul class="tip-list"><li>' + t("tip") + '</li></ul></section></main></div>';
      document.getElementById("fb-instruction-back").onclick = function () { renderMenu(); show("menu"); };
    }

    function renderSettings() {
      sections.settings.innerHTML = '<div class="screen-shell page-shell"><header class="page-header"><div class="page-header__title"><img src="assets/images/icons/icon-settings.svg" alt="" aria-hidden="true" /><h1 id="settings-screen-title">' + t("settings") + '</h1></div><button class="cute-button cute-button--soft" id="fb-settings-back">' + t("back") + '</button></header><main class="settings-list"><section class="setting-card"><h2 class="setting-card__heading"><img src="assets/images/icons/icon-language.svg" alt="" aria-hidden="true" />' + t("language") + '</h2><div class="choice-grid">' + languages.map(function (item) { return '<button class="choice-card' + (language === item ? " is-selected" : "") + '" data-fb-language="' + item + '">' + (item === "zh" ? "繁中" : item === "en" ? "English" : "日本語") + '</button>'; }).join("") + '</div></section><section class="setting-card"><h2 class="setting-card__heading"><img src="assets/images/icons/icon-theme.svg" alt="" aria-hidden="true" />' + t("theme") + '</h2><div class="choice-grid choice-grid--themes">' + themes.map(function (item) { return '<button class="choice-card' + (settings.theme === item ? " is-selected" : "") + '" data-fb-theme="' + item + '"><span class="theme-swatch theme-swatch--' + item + '"></span>' + t(item) + '</button>'; }).join("") + '</div></section><section class="setting-card"><label class="setting-label" for="fb-bgm">' + t("bgm") + '<output id="fb-bgm-value">' + Math.round(settings.bgmVolume * 100) + '%</output></label><input id="fb-bgm" type="range" min="0" max="100" value="' + Math.round(settings.bgmVolume * 100) + '" /><label class="setting-label" for="fb-sfx">' + t("sfx") + '<output id="fb-sfx-value">' + Math.round(settings.sfxVolume * 100) + '%</output></label><input id="fb-sfx" type="range" min="0" max="100" value="' + Math.round(settings.sfxVolume * 100) + '" /></section><section class="setting-card"><div class="toggle-row"><h2 class="setting-card__heading"><img src="assets/images/icons/icon-vibration.svg" alt="" aria-hidden="true" />' + t("vibration") + '</h2><label class="toggle"><input id="fb-vibration" type="checkbox" ' + (settings.vibration ? "checked" : "") + ' /><span class="toggle__track"></span></label></div></section></main><div class="setting-actions"><p class="text-small">' + t("saved") + '</p><button class="cute-button cute-button--soft" id="fb-reset">' + t("reset") + '</button></div></div>';
      document.querySelectorAll("[data-fb-language]").forEach(function (button) { button.onclick = function () { language = button.getAttribute("data-fb-language"); settings.language = language; saveSettings(); renderSettings(); }; });
      document.querySelectorAll("[data-fb-theme]").forEach(function (button) { button.onclick = function () { settings.theme = button.getAttribute("data-fb-theme"); saveSettings(); renderSettings(); }; });
      document.getElementById("fb-bgm").oninput = function (event) { settings.bgmVolume = Number(event.target.value) / 100; document.getElementById("fb-bgm-value").textContent = Math.round(settings.bgmVolume * 100) + "%"; saveSettings(); };
      document.getElementById("fb-sfx").oninput = function (event) { settings.sfxVolume = Number(event.target.value) / 100; document.getElementById("fb-sfx-value").textContent = Math.round(settings.sfxVolume * 100) + "%"; saveSettings(); };
      document.getElementById("fb-vibration").onchange = function (event) { settings.vibration = event.target.checked; saveSettings(); };
      document.getElementById("fb-reset").onclick = function () { settings = Object.assign({}, fallbackSettings); language = "zh"; saveSettings(); renderSettings(); };
      document.getElementById("fb-settings-back").onclick = function () { renderMenu(); show("menu"); };
    }

    applyTheme(settings.theme);
    renderMenu();
    show("menu");
  };

  window.setTimeout(start, 650);
}());
