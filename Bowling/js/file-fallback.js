/*
 * Direct-file fallback
 * --------------------
 * Some browsers block ES module imports from file:// pages. The normal module
 * app gets priority; this classic-script app starts only when the module entry
 * point has not announced readiness after a short grace period.
 */
(function () {
  "use strict";

  var startFallback = function () {
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
    var pinLayout = [
      { x: 0.5, y: 0.18 },
      { x: 0.455, y: 0.23 },
      { x: 0.545, y: 0.23 },
      { x: 0.41, y: 0.28 },
      { x: 0.5, y: 0.28 },
      { x: 0.59, y: 0.28 },
      { x: 0.365, y: 0.33 },
      { x: 0.455, y: 0.33 },
      { x: 0.545, y: 0.33 },
      { x: 0.635, y: 0.33 }
    ];

    var language = "zh";
    var settings;
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
    var currentKnocked = 0;
    var currentImpactOrder = [];
    var impactPlayed = [];
    var activeRollAngle = 0;
    var activeRollPower = 0;
    var activeRollDurationMs = 1180;
    var pressStartedAt = 0;
    var suppressClickUntil = 0;

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

    /* ----------------------------- Audio ----------------------------- */

    var audio = createAudioEngine();

    function createAudioEngine() {
      var context = null;
      var bgmGain = null;
      var sfxGain = null;
      var compressor = null;
      var bgmTimer = 0;
      var bgmStep = 0;
      var currentScreen = null;
      var inGame = false;
      var bgmVolume = fallbackSettings.bgmVolume;
      var sfxVolume = fallbackSettings.sfxVolume;
      var melody = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23, 392, 493.88, 587.33, 493.88];
      var effects = {
        button: { frequency: 880, duration: 0.08, type: "sine" },
        pin: { frequency: 620, duration: 0.12, type: "triangle" },
        strike: { frequency: 1046, duration: 0.32, type: "sine", sweep: 440 },
        spare: { frequency: 784, duration: 0.24, type: "triangle", sweep: 220 },
        roll: { frequency: 170, duration: 0.5, type: "sine", sweep: 90 }
      };

      function ensureContext() {
        if (context) return context;
        var Factory = window.AudioContext || window.webkitAudioContext;
        if (!Factory) return null;
        try {
          context = new Factory();
          bgmGain = context.createGain();
          sfxGain = context.createGain();
          compressor = context.createDynamicsCompressor();
          bgmGain.connect(compressor).connect(context.destination);
          sfxGain.connect(context.destination);
          updateVolumes();
        } catch (error) {
          context = null;
        }
        return context;
      }

      function setGain(gainNode, value) {
        if (!gainNode || !context) return;
        var now = context.currentTime;
        if (gainNode.gain.setTargetAtTime) gainNode.gain.setTargetAtTime(value, now, 0.05);
        else gainNode.gain.value = value;
      }

      function updateVolumes() {
        if (!context) return;
        setGain(bgmGain, Math.min(bgmVolume * (inGame ? 10 : 1), 3));
        setGain(sfxGain, sfxVolume);
      }

      function resumeContext() {
        var audioContext = ensureContext();
        if (!audioContext) return null;
        if (audioContext.state === "suspended" && audioContext.resume) {
          var resumeResult = audioContext.resume();
          if (resumeResult && resumeResult.catch) resumeResult.catch(function () {});
        }
        return audioContext;
      }

      function playTone(definition, output, amplitude) {
        var audioContext = resumeContext();
        if (!audioContext) return;
        var oscillator = audioContext.createOscillator();
        var gain = audioContext.createGain();
        var start = audioContext.currentTime;
        oscillator.type = definition.type;
        oscillator.frequency.setValueAtTime(definition.frequency, start);
        if (definition.sweep) oscillator.frequency.linearRampToValueAtTime(definition.frequency + definition.sweep, start + definition.duration);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, amplitude), start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + definition.duration);
        oscillator.connect(gain).connect(output);
        oscillator.start(start);
        oscillator.stop(start + definition.duration + 0.02);
      }

      function startBgm() {
        var audioContext = resumeContext();
        if (!audioContext || bgmTimer) return Boolean(audioContext);
        var playNextNote = function () {
          playTone({ frequency: melody[bgmStep % melody.length], duration: 0.38, type: "triangle" }, bgmGain, 0.16);
          bgmStep += 1;
        };
        playNextNote();
        bgmTimer = window.setInterval(playNextNote, 440);
        return true;
      }

      function stopBgm() {
        if (bgmTimer) window.clearInterval(bgmTimer);
        bgmTimer = 0;
      }

      return {
        setVolumes: function (nextBgm, nextSfx) {
          bgmVolume = Math.max(0, Math.min(1, Number(nextBgm) || 0));
          sfxVolume = Math.max(0, Math.min(1, Number(nextSfx) || 0));
          updateVolumes();
        },
        setScreen: function (screen) {
          if (currentScreen !== null && currentScreen !== screen) stopBgm();
          currentScreen = screen;
          inGame = screen === "game";
          updateVolumes();
        },
        unlock: resumeContext,
        startBgm: startBgm,
        stopBgm: stopBgm,
        playSfx: function (name) {
          var definition = effects[name];
          if (!definition) return;
          var output = sfxGain;
          if (!output) {
            var audioContext = ensureContext();
            output = audioContext ? audioContext.destination : null;
          }
          if (output) playTone(definition, output, 0.24);
        }
      };
    }

    /* -------------------------- Local storage ------------------------- */

    function readSettings() {
      var stored = {};
      try {
        stored = JSON.parse(localStorage.getItem("bowling_settings_v1") || "{}");
      } catch (error) {
        stored = {};
      }
      var result = Object.assign({}, fallbackSettings, stored);
      result.language = languages.indexOf(result.language) >= 0 ? result.language : "zh";
      result.theme = themes.indexOf(result.theme) >= 0 ? result.theme : "cute";
      result.bgmVolume = Math.max(0, Math.min(1, Number(result.bgmVolume) || 0));
      result.sfxVolume = Math.max(0, Math.min(1, Number(result.sfxVolume) || 0));
      return result;
    }

    function saveSettings() {
      settings.language = language;
      try {
        localStorage.setItem("bowling_settings_v1", JSON.stringify(settings));
        localStorage.setItem("lang", language);
      } catch (error) {
        // Private browsing may disable storage; the current session still works.
      }
      applyTheme(settings.theme);
      audio.setVolumes(settings.bgmVolume, settings.sfxVolume);
    }

    function loadProgress() {
      try {
        var value = JSON.parse(localStorage.getItem("bowling_save_v1") || "null");
        return value && Array.isArray(value.rolls) && value.rolls.length ? value : null;
      } catch (error) {
        return null;
      }
    }

    function saveProgress() {
      if (!gameState.rolls.length) return;
      try { localStorage.setItem("bowling_save_v1", JSON.stringify(gameState)); } catch (error) { /* optional storage */ }
    }

    function clearProgress() {
      try { localStorage.removeItem("bowling_save_v1"); } catch (error) { /* optional storage */ }
    }

    function applyTheme(theme) {
      document.body.dataset.theme = theme;
      var themeLink = document.getElementById("theme-style");
      if (themeLink) themeLink.href = "css/themes/theme-" + theme + ".css";
    }

    /* ----------------------------- Helpers ----------------------------- */

    function t(key, params) {
      var value = (text[language] && text[language][key]) || text.zh[key] || key;
      Object.keys(params || {}).forEach(function (name) {
        value = value.replace(new RegExp("\\{" + name + "\\}", "g"), params[name]);
      });
      return value;
    }

    function clamp(value, minimum, maximum) {
      return Math.max(minimum, Math.min(maximum, value));
    }

    function show(screenName) {
      Object.keys(sections).forEach(function (name) {
        sections[name].classList.toggle("active", name === screenName);
      });
      audio.setScreen(screenName);
      audio.startBgm();
    }

    function bindButton(id, handler) {
      var button = document.getElementById(id);
      if (!button) return;
      button.addEventListener("click", function () {
        audio.unlock();
        audio.playSfx("button");
        audio.startBgm();
        handler();
      });
    }

    function setAngle(nextAngle) {
      if (rolling) return;
      angle = clamp(Number(nextAngle) || 0, -1, 1);
      var input = document.getElementById("fb-angle");
      var output = document.getElementById("fb-angle-value");
      if (input) input.value = String(Math.round(angle * 100));
      if (output) output.textContent = Math.round(angle * 30) + "°";
      visualProgress = 0;
      drawCanvas(0);
    }

    function setPower(nextPower) {
      if (rolling) return;
      power = clamp(Number(nextPower) || 0, 0, 1);
      var input = document.getElementById("fb-power");
      var output = document.getElementById("fb-power-value");
      if (input) input.value = String(Math.round(power * 100));
      if (output) output.textContent = Math.round(power * 100) + "%";
      visualProgress = 0;
      drawCanvas(0);
    }

    /* -------------------------- Bowling scoring ------------------------ */

    function frameRecords(rolls) {
      var records = [];
      var index = 0;
      for (var frame = 0; frame < 9; frame += 1) {
        if (index >= rolls.length) {
          records.push({ rolls: [], type: "empty", complete: false });
          continue;
        }
        var first = rolls[index];
        if (first === 10) {
          records.push({ rolls: [first], type: "strike", complete: true });
          index += 1;
          continue;
        }
        if (index + 1 >= rolls.length) {
          records.push({ rolls: [first], type: "partial", complete: false });
          index += 1;
          continue;
        }
        var second = rolls[index + 1];
        records.push({ rolls: [first, second], type: first + second === 10 ? "spare" : "open", complete: true });
        index += 2;
      }

      var finalRolls = rolls.slice(index, index + 3);
      var finalType = "empty";
      var finalComplete = false;
      if (finalRolls.length) {
        if (finalRolls[0] === 10) {
          finalType = "strike";
          finalComplete = finalRolls.length === 3;
        } else if (finalRolls.length === 1) {
          finalType = "partial";
        } else if (finalRolls[0] + finalRolls[1] === 10) {
          finalType = "spare";
          finalComplete = finalRolls.length === 3;
        } else {
          finalType = "open";
          finalComplete = true;
        }
      }
      records.push({ rolls: finalRolls, type: finalType, complete: finalComplete });
      return records;
    }

    function scores(rolls) {
      var result = [];
      var index = 0;
      for (var frame = 0; frame < 10; frame += 1) {
        if (index >= rolls.length) {
          result.push(null);
          continue;
        }
        var first = rolls[index];
        if (frame === 9) {
          var finalRolls = rolls.slice(index, index + 3);
          if (first === 10 && finalRolls.length === 3) result.push(finalRolls[0] + finalRolls[1] + finalRolls[2]);
          else if (finalRolls.length >= 2 && first + finalRolls[1] < 10) result.push(first + finalRolls[1]);
          else if (finalRolls.length === 3) result.push(finalRolls[0] + finalRolls[1] + finalRolls[2]);
          else result.push(null);
          continue;
        }
        if (first === 10) {
          result.push(index + 2 < rolls.length ? 10 + rolls[index + 1] + rolls[index + 2] : null);
          index += 1;
          continue;
        }
        if (index + 1 >= rolls.length) {
          result.push(null);
          continue;
        }
        var second = rolls[index + 1];
        if (first + second === 10) result.push(index + 2 < rolls.length ? 10 + rolls[index + 2] : null);
        else result.push(first + second);
        index += 2;
      }
      return result;
    }

    function totalScore() {
      return scores(gameState.rolls).reduce(function (sum, value) { return sum + (value || 0); }, 0);
    }

    function nextContext() {
      var records = frameRecords(gameState.rolls);
      var current = records.find(function (record) { return !record.complete; });
      if (!current) return { done: true, frame: 10, ball: 0, pins: 0 };
      var frameNumber = records.indexOf(current) + 1;
      if (frameNumber === 10) {
        if (!current.rolls.length) return { done: false, frame: 10, ball: 1, pins: 10 };
        if (current.rolls[0] === 10) {
          return { done: false, frame: 10, ball: current.rolls.length + 1, pins: current.rolls.length === 1 || current.rolls[1] === 10 ? 10 : 10 - current.rolls[1] };
        }
        if (current.rolls.length === 1) return { done: false, frame: 10, ball: 2, pins: 10 - current.rolls[0] };
        if (current.rolls[0] + current.rolls[1] === 10) return { done: false, frame: 10, ball: 3, pins: 10 };
        return { done: true, frame: 10, ball: 0, pins: 0 };
      }
      if (!current.rolls.length) return { done: false, frame: frameNumber, ball: 1, pins: 10 };
      return { done: false, frame: frameNumber, ball: 2, pins: 10 - current.rolls[0] };
    }

    function currentIsComplete() {
      return frameRecords(gameState.rolls)[9].complete;
    }

    function syncFallbackControls() {
      var disabled = rolling || currentIsComplete();
      ["fb-angle", "fb-power", "fb-launch"].forEach(function (id) {
        var control = document.getElementById(id);
        if (control) control.disabled = disabled;
      });
    }

    var pinDeckExitY = 0.12;
    var pinCollisionWindow = 0.18;
    var ballPathLateralScale = 0.34;

    // Keep the direct-file renderer's collision timing in sync with the
    // module physics: a pin can react only after the ball reaches its depth.
    function pinImpactProgress(pin, sequence) {
      var travel = clamp((0.9 - pin.y) / (0.9 - pinDeckExitY), 0, 1);
      var progressAtDepth = 1 - Math.sqrt(1 - travel);
      return clamp(progressAtDepth + sequence * 0.018, 0, 0.96);
    }

    function ballPathXAtPin(pinY) {
      var travel = clamp((0.9 - pinY) / (0.9 - pinDeckExitY), 0, 1);
      return 0.5 + clamp(angle, -1, 1) * ballPathLateralScale * travel;
    }

    // Direction chooses which pins the ball can reach; power controls both
    // the available impact range and the number of pins in the chain reaction.
    function calculateImpactOrder() {
      var safeAngle = clamp(Number(angle) || 0, -1, 1);
      var safePower = clamp(Number(power) || 0, 0, 1);
      if (safePower <= 0) return [];

      var alignment = 1 - Math.abs(safeAngle);
      var pocketQuality = 1 - clamp(Math.abs(Math.abs(safeAngle) - 0.06) / 0.09, 0, 1);
      var pocketBonus = safePower > 0.86 && pocketQuality > 0.55 ? 1 : 0;
      var targetCount = clamp(Math.round(safePower * (2.4 + alignment * 6.6) + pocketBonus), 0, pinLayout.length);
      var collisionReach = 0.04 + safePower * 0.125;

      var candidates = pinLayout.map(function (pin, id) {
        var gap = Math.abs(pin.x - ballPathXAtPin(pin.y));
        return { id: id, gap: gap, proximity: clamp(1 - gap / collisionReach, 0, 1) };
      }).filter(function (candidate) {
        return candidate.proximity > 0.05;
      }).sort(function (first, second) {
        return second.proximity - first.proximity || first.id - second.id;
      }).slice(0, targetCount);

      return candidates.sort(function (first, second) {
        var firstProgress = pinImpactProgress(pinLayout[first.id], 0);
        var secondProgress = pinImpactProgress(pinLayout[second.id], 0);
        return firstProgress - secondProgress || first.gap - second.gap;
      }).map(function (candidate) {
        return candidate.id;
      });
    }

    function calculateKnockedPins(context) {
      currentImpactOrder = calculateImpactOrder().slice(0, context.pins);
      return currentImpactOrder.length;
    }

    /* ------------------------- Canvas presentation --------------------- */

    var sceneImage = new Image();
    var sceneLoaded = false;
    sceneImage.onload = function () {
      sceneLoaded = true;
      drawCanvas(visualProgress);
    };
    sceneImage.src = "assets/images/backgrounds/bowling-alley-realistic.png";

    function laneBounds(depth, width) {
      var amount = clamp(depth, 0, 1);
      return {
        left: width * (0.405 - 0.195 * amount),
        right: width * (0.595 + 0.195 * amount)
      };
    }

    function canvasPosition(position, width, height) {
      var depth = clamp(position.y, 0, 1);
      var bounds = laneBounds(depth, width);
      return {
        x: bounds.left + (bounds.right - bounds.left) * clamp(position.x, 0, 1),
        y: height * (0.2 + depth * 0.72),
        scale: 0.42 + depth * 0.66
      };
    }

    function resizeCanvas(canvas) {
      var rect = canvas.getBoundingClientRect();
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      var width = Math.max(320, Math.round(rect.width || 900));
      var height = Math.max(260, Math.round(rect.height || 560));
      if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
      }
      return { width: width, height: height, ratio: ratio };
    }

    function drawCoverImage(context, width, height) {
      var imageRatio = sceneImage.naturalWidth / sceneImage.naturalHeight;
      var canvasRatio = width / height;
      var sourceWidth = sceneImage.naturalWidth;
      var sourceHeight = sceneImage.naturalHeight;
      var sourceX = 0;
      var sourceY = 0;
      if (imageRatio > canvasRatio) {
        sourceWidth = sceneImage.naturalHeight * canvasRatio;
        sourceX = (sceneImage.naturalWidth - sourceWidth) / 2;
      } else if (imageRatio < canvasRatio) {
        sourceHeight = sceneImage.naturalWidth / canvasRatio;
        sourceY = (sceneImage.naturalHeight - sourceHeight) / 2;
      }
      context.drawImage(sceneImage, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
    }

    function drawProceduralScene(context, width, height) {
      var backdrop = context.createLinearGradient(0, 0, 0, height);
      backdrop.addColorStop(0, "#071321");
      backdrop.addColorStop(0.48, "#153d52");
      backdrop.addColorStop(0.49, "#5d3b2c");
      backdrop.addColorStop(1, "#1b1118");
      context.fillStyle = backdrop;
      context.fillRect(0, 0, width, height);
      var lane = laneBounds(0, width);
      var nearLane = laneBounds(1, width);
      context.fillStyle = "#ce9353";
      context.beginPath();
      context.moveTo(lane.left, height * 0.2);
      context.lineTo(lane.right, height * 0.2);
      context.lineTo(nearLane.right, height);
      context.lineTo(nearLane.left, height);
      context.closePath();
      context.fill();
    }

    function drawLaneDetails(context, width, height) {
      var farLane = laneBounds(0, width);
      var nearLane = laneBounds(1, width);
      context.fillStyle = "rgba(255, 191, 88, 0.08)";
      context.beginPath();
      context.moveTo(farLane.left, height * 0.2);
      context.lineTo(farLane.right, height * 0.2);
      context.lineTo(nearLane.right, height * 0.98);
      context.lineTo(nearLane.left, height * 0.98);
      context.closePath();
      context.fill();

      context.save();
      context.globalAlpha = 0.22;
      context.strokeStyle = "#fff1c7";
      context.lineWidth = Math.max(1, width * 0.0015);
      for (var board = 1; board < 15; board += 1) {
        var amount = board / 15;
        context.beginPath();
        context.moveTo(farLane.left + (farLane.right - farLane.left) * amount, height * 0.2);
        context.lineTo(nearLane.left + (nearLane.right - nearLane.left) * amount, height * 0.98);
        context.stroke();
      }
      context.restore();

      var foulDepth = 0.78;
      var foulLane = laneBounds(foulDepth, width);
      var foulY = height * (0.2 + foulDepth * 0.72);
      context.strokeStyle = "#e85b63";
      context.lineWidth = Math.max(2, width * 0.004);
      context.beginPath();
      context.moveTo(foulLane.left, foulY);
      context.lineTo(foulLane.right, foulY);
      context.stroke();

      context.fillStyle = "rgba(255, 246, 211, 0.72)";
      for (var arrow = -2; arrow <= 2; arrow += 1) {
        var x = width / 2 + arrow * width * 0.035;
        var y = height * 0.57;
        context.beginPath();
        context.moveTo(x, y + 10);
        context.lineTo(x - 6, y - 5);
        context.lineTo(x + 6, y - 5);
        context.closePath();
        context.fill();
      }

      var vignette = context.createRadialGradient(width / 2, height * 0.56, height * 0.1, width / 2, height * 0.56, width * 0.76);
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(1, "rgba(3, 10, 20, 0.38)");
      context.fillStyle = vignette;
      context.fillRect(0, 0, width, height);
    }

    function drawPinShape(context, size) {
      context.beginPath();
      context.moveTo(0, -size * 0.82);
      context.bezierCurveTo(size * 0.2, -size * 0.84, size * 0.24, -size * 0.59, size * 0.18, -size * 0.42);
      context.bezierCurveTo(size * 0.15, -size * 0.29, size * 0.42, -size * 0.18, size * 0.47, size * 0.2);
      context.bezierCurveTo(size * 0.52, size * 0.57, size * 0.3, size * 0.78, 0, size * 0.82);
      context.bezierCurveTo(-size * 0.3, size * 0.78, -size * 0.52, size * 0.57, -size * 0.47, size * 0.2);
      context.bezierCurveTo(-size * 0.42, -size * 0.18, -size * 0.15, -size * 0.29, -size * 0.18, -size * 0.42);
      context.bezierCurveTo(-size * 0.24, -size * 0.59, -size * 0.2, -size * 0.84, 0, -size * 0.82);
      context.closePath();
    }

    function drawPin(context, x, y, scale, rotation, fallProgress) {
      var size = 28 * scale;
      var fall = fallProgress || 0;
      context.save();
      context.translate(x, y + fall * size * 0.9);
      context.rotate(rotation || 0);
      context.globalAlpha = 1 - fall * 0.12;
      context.fillStyle = "rgba(0, 0, 0, 0.38)";
      context.beginPath();
      context.ellipse(0, size * 0.82, size * 0.55, size * 0.16, 0, 0, Math.PI * 2);
      context.fill();

      var body = context.createLinearGradient(-size, 0, size, 0);
      body.addColorStop(0, "#b9c8cc");
      body.addColorStop(0.22, "#ffffff");
      body.addColorStop(0.64, "#fffdf8");
      body.addColorStop(1, "#9eabb3");
      drawPinShape(context, size);
      context.fillStyle = body;
      context.fill();
      context.save();
      drawPinShape(context, size);
      context.clip();
      context.fillStyle = "#d93443";
      context.fillRect(-size * 0.3, -size * 0.48, size * 0.6, size * 0.1);
      context.fillRect(-size * 0.28, -size * 0.33, size * 0.56, size * 0.085);
      context.restore();
      context.fillStyle = "rgba(255, 255, 255, 0.8)";
      context.beginPath();
      context.ellipse(-size * 0.18, -size * 0.56, size * 0.08, size * 0.16, -0.4, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    function ballPalette() {
      var palettes = {
        cute: ["#ffbedb", "#ec4f91", "#8d2459"],
        ocean: ["#a8f2ff", "#168fa8", "#074b6b"],
        sunset: ["#ffd0a8", "#ee674e", "#8e2e3a"],
        forest: ["#d1f6bf", "#429b67", "#19513d"],
        night: ["#d9d1ff", "#7867de", "#292257"]
      };
      return palettes[settings.theme] || palettes.cute;
    }

    function drawBall(context, position, rotation, trail, width, height) {
      var screen = canvasPosition(position, width, height);
      var radius = Math.max(10, width * 0.032 * screen.scale);
      var palette = ballPalette();
      if (trail && trail.length > 1) {
        trail.forEach(function (point, index) {
          var trailPoint = canvasPosition(point, width, height);
          context.globalAlpha = (index / trail.length) * 0.18;
          context.fillStyle = palette[1];
          context.beginPath();
          context.arc(trailPoint.x, trailPoint.y, radius * 0.45, 0, Math.PI * 2);
          context.fill();
        });
        context.globalAlpha = 1;
      }

      context.save();
      context.translate(screen.x, screen.y);
      context.rotate(rotation || 0);
      context.fillStyle = "rgba(0, 0, 0, 0.45)";
      context.beginPath();
      context.ellipse(0, radius * 0.84, radius * 1.16, radius * 0.3, 0, 0, Math.PI * 2);
      context.fill();
      var gradient = context.createRadialGradient(-radius * 0.4, -radius * 0.5, radius * 0.08, 0, 0, radius * 1.05);
      gradient.addColorStop(0, palette[0]);
      gradient.addColorStop(0.28, palette[1]);
      gradient.addColorStop(1, palette[2]);
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "rgba(8, 11, 25, 0.48)";
      [-0.22, 0, 0.22].forEach(function (offset, index) {
        context.beginPath();
        context.arc(offset * radius * 2.1, -radius * (0.18 + (index === 1 ? 0.12 : 0)), radius * 0.1, 0, Math.PI * 2);
        context.fill();
      });
      context.fillStyle = "rgba(255, 255, 255, 0.78)";
      context.beginPath();
      context.ellipse(-radius * 0.4, -radius * 0.47, radius * 0.16, radius * 0.3, -0.4, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    function drawAimGuide(context, width, height) {
      var start = canvasPosition({ x: 0.5, y: 0.9 }, width, height);
      var end = canvasPosition({ x: 0.5 + angle * ballPathLateralScale, y: pinDeckExitY }, width, height);
      context.save();
      context.strokeStyle = "rgba(255, 237, 170, 0.72)";
      context.lineWidth = Math.max(2, width * 0.0025);
      context.setLineDash([8, 10]);
      context.beginPath();
      context.moveTo(start.x, start.y - 6);
      context.lineTo(end.x, end.y + 8);
      context.stroke();
      context.setLineDash([]);
      context.strokeStyle = "rgba(255, 255, 255, 0.9)";
      context.beginPath();
      context.arc(start.x, start.y, 13 + power * 8, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    }

    function drawImpactEffect(context, x, y, scale, localProgress) {
      var fade = clamp(1 - localProgress / 0.42, 0, 1);
      if (fade <= 0) return;
      var radius = (10 + localProgress * 28) * scale;
      context.save();
      context.globalAlpha = fade;
      context.strokeStyle = "#fff3b0";
      context.lineWidth = Math.max(2, scale * 2);
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.stroke();
      context.strokeStyle = "#ffffff";
      for (var ray = 0; ray < 8; ray += 1) {
        var rayAngle = ray * Math.PI / 4;
        context.beginPath();
        context.moveTo(x + Math.cos(rayAngle) * radius * 1.15, y + Math.sin(rayAngle) * radius * 1.15);
        context.lineTo(x + Math.cos(rayAngle) * radius * 1.65, y + Math.sin(rayAngle) * radius * 1.65);
        context.stroke();
      }
      context.restore();
    }

    function triggerImpacts(progress) {
      currentImpactOrder.forEach(function (pinId, sequence) {
        var impactAt = pinImpactProgress(pinLayout[pinId], sequence);
        if (progress >= impactAt && !impactPlayed[pinId]) {
          impactPlayed[pinId] = true;
          audio.playSfx("pin");
        }
      });
    }

    function drawCanvas(progress) {
      var canvas = document.getElementById("fb-canvas");
      if (!canvas) return;
      var size = resizeCanvas(canvas);
      var context = canvas.getContext("2d");
      context.setTransform(size.ratio, 0, 0, size.ratio, 0, 0);
      context.clearRect(0, 0, size.width, size.height);
      if (sceneLoaded) drawCoverImage(context, size.width, size.height);
      else drawProceduralScene(context, size.width, size.height);
      drawLaneDetails(context, size.width, size.height);

      if (rolling) triggerImpacts(progress);
      if (!rolling) drawAimGuide(context, size.width, size.height);
      pinLayout.forEach(function (pin, index) {
        var position = canvasPosition(pin, size.width, size.height);
        var sequence = currentImpactOrder.indexOf(index);
        var impactAt = sequence >= 0 ? pinImpactProgress(pin, sequence) : 1.1;
        var fallProgress = sequence >= 0 ? clamp((progress - impactAt) / pinCollisionWindow, 0, 1) : 0;
        drawPin(context, position.x + (fallProgress ? (index % 2 ? 1 : -1) * 22 * fallProgress : 0), position.y, position.scale, fallProgress ? (index % 2 ? 0.9 : -0.9) * fallProgress : 0, fallProgress);
        if (fallProgress > 0 && fallProgress < 0.42) drawImpactEffect(context, position.x, position.y, position.scale, fallProgress);
      });
      var ease = 1 - Math.pow(1 - progress, 2);
      var ballDepth = 0.9 - ease * (0.9 - pinDeckExitY);
      var renderAngle = rolling ? activeRollAngle : angle;
      var ballPosition = { x: 0.5 + renderAngle * ballPathLateralScale * ease, y: ballDepth };
      drawBall(context, ballPosition, renderAngle * 18 * progress, [], size.width, size.height);
    }

    window.addEventListener("resize", function () {
      drawCanvas(visualProgress);
    });

    /* --------------------------- Screen views -------------------------- */

    function renderMenu() {
      var progress = loadProgress();
      sections.menu.innerHTML = `
        <div class="main-menu-shell">
          <div class="mascot-stage" aria-hidden="true">
            <img class="mascot-bobo" src="assets/images/characters/mascot-bobo.svg" alt="" />
            <img class="mascot-pingping" src="assets/images/characters/mascot-pingping.svg" alt="" />
          </div>
          <div class="menu-content">
            <div class="game-logo">
              <span class="game-logo__eyebrow">BOBO × PINGPING</span>
              <h1 id="main-menu-title" class="game-logo__title">${t("title")}</h1>
            </div>
            <p class="welcome-copy">${t("welcome")}</p>
            <div class="menu-actions">
              <button class="cute-button cute-button--large" id="fb-start" type="button">
                <img class="button-icon" src="assets/images/icons/icon-start.svg" alt="" aria-hidden="true" />${t("start")}
              </button>
              <button class="cute-button cute-button--secondary cute-button--large" id="fb-continue" type="button" ${progress ? "" : "disabled"}>
                <img class="button-icon" src="assets/images/icons/icon-continue.svg" alt="" aria-hidden="true" />${t("cont")}
              </button>
              <p class="continue-hint">${progress ? "" : t("noProgress")}</p>
              <button class="cute-button cute-button--soft cute-button--large" id="fb-instructions" type="button">
                <img class="button-icon" src="assets/images/icons/icon-instructions.svg" alt="" aria-hidden="true" />${t("instructions")}
              </button>
              <button class="cute-button cute-button--soft cute-button--large" id="fb-settings" type="button">
                <img class="button-icon" src="assets/images/icons/icon-settings.svg" alt="" aria-hidden="true" />${t("settings")}
              </button>
            </div>
          </div>
        </div>`;

      bindButton("fb-start", function () {
        clearProgress();
        gameState = { rolls: [], currentFrame: 1 };
        renderGame();
        show("game");
      });
      bindButton("fb-continue", function () {
        var saved = loadProgress();
        if (!saved) return;
        gameState = saved;
        renderGame();
        show("game");
      });
      bindButton("fb-instructions", function () {
        renderInstructions();
        show("instructions");
      });
      bindButton("fb-settings", function () {
        renderSettings();
        show("settings");
      });
    }

    function renderScoreboard() {
      var board = document.getElementById("fb-scoreboard");
      if (!board) return;
      var records = frameRecords(gameState.rolls);
      var scoreList = scores(gameState.rolls);
      board.innerHTML = records.map(function (record, index) {
        var shown = record.rolls.map(function (roll, rollIndex) {
          if (roll === 10) return "X";
          if (record.type === "spare" && rollIndex === 1) return "/";
          return roll;
        }).join(" ") || "&nbsp;";
        var score = scoreList[index] == null ? "—" : scoreList[index];
        var active = index + 1 === gameState.currentFrame && !record.complete ? " is-current" : "";
        return `<div class="score-frame${active}">
          <div class="score-frame__number">${index + 1}</div>
          <div class="score-frame__rolls">${shown}</div>
          <div class="score-frame__total">${score}</div>
        </div>`;
      }).join("");
    }

    function renderGame() {
      // A new game view always starts with the ball at the approach. This is
      // important when Continue reuses the same fallback page after a roll.
      visualProgress = 0;
      currentKnocked = 0;
      currentImpactOrder = [];
      impactPlayed = [];
      activeRollAngle = angle;
      activeRollPower = power;
      activeRollDurationMs = 1180;
      rolling = false;
      paused = false;
      var context = nextContext();
      sections.game.innerHTML = `
        <h1 id="game-screen-title" class="game-screen-title">${t("game")}</h1>
        <div class="game-topbar">
          <div class="hud">
            <div class="hud__stats">
              <div class="hud-stat"><span class="hud-stat__label">${t("frame", { n: context.frame })}</span><strong class="hud-stat__value">${context.frame}</strong></div>
              <div class="hud-stat"><span class="hud-stat__label">${t("ball", { n: context.ball })}</span><strong class="hud-stat__value">${context.ball}</strong></div>
              <div class="hud-stat"><span class="hud-stat__label">${t("score")}</span><strong class="hud-stat__value">${totalScore()}</strong></div>
              <div class="hud-stat"><span class="hud-stat__label">${t("total")}</span><strong id="fb-total" class="hud-stat__value">${totalScore()}</strong></div>
            </div>
            <button class="icon-button" id="fb-pause" type="button" aria-label="${t("pause")}"><img src="assets/images/icons/icon-pause.svg" alt="" aria-hidden="true" /></button>
          </div>
        </div>
        <div class="game-scoreboard-wrap"><div class="scoreboard" id="fb-scoreboard" aria-label="${t("total")}"></div></div>
        <div class="game-stage-wrap">
          <canvas id="fb-canvas" class="game-canvas" tabindex="0" aria-label="${t("game")}"></canvas>
          <p id="fb-status" class="game-status">${currentIsComplete() ? t("gameOver") : t("ready")}</p>
          <div id="fb-celebration" class="celebration" aria-live="polite"></div>
          <div id="fb-game-over" class="game-over-panel">
            <strong>${t("gameOver")}</strong>
            <span>${t("total")}: ${totalScore()}</span>
            <button class="cute-button" id="fb-new-game" type="button"><img class="button-icon" src="assets/images/icons/icon-restart.svg" alt="" aria-hidden="true" />${t("playAgain")}</button>
          </div>
        </div>
        <div class="control-dock">
          <div class="control-group">
            <label for="fb-angle">${t("direction")}<output class="range-value" id="fb-angle-value">${Math.round(angle * 30)}°</output></label>
            <input id="fb-angle" type="range" min="-100" max="100" value="${Math.round(angle * 100)}" aria-label="${t("direction")}" />
          </div>
          <div class="control-group">
            <label for="fb-power">${t("power")}<output class="range-value" id="fb-power-value">${Math.round(power * 100)}%</output></label>
            <input id="fb-power" type="range" min="0" max="100" value="${Math.round(power * 100)}" aria-label="${t("power")}" />
          </div>
          <button class="cute-button cute-button--large launch-button" id="fb-launch" type="button"><img class="button-icon" src="assets/images/icons/icon-launch.svg" alt="" aria-hidden="true" />${t("launch")}</button>
        </div>
        <div class="modal-backdrop" id="fb-modal" hidden>
          <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="fb-pause-title">
            <div class="modal-card__header"><h2 id="fb-pause-title">${t("paused")}</h2><button class="icon-button" id="fb-close" type="button" aria-label="${t("resume")}"><img src="assets/images/icons/icon-close.svg" alt="" aria-hidden="true" /></button></div>
            <div class="modal-card__body">
              <button class="cute-button" id="fb-resume" type="button"><img class="button-icon" src="assets/images/icons/icon-continue.svg" alt="" aria-hidden="true" />${t("resume")}</button>
              <button class="cute-button cute-button--secondary" id="fb-home" type="button"><img class="button-icon" src="assets/images/icons/icon-home.svg" alt="" aria-hidden="true" />${t("home")}</button>
              <button class="cute-button cute-button--soft" id="fb-restart" type="button"><img class="button-icon" src="assets/images/icons/icon-restart.svg" alt="" aria-hidden="true" />${t("restart")}</button>
            </div>
          </div>
        </div>`;

      renderScoreboard();
      drawCanvas(visualProgress);
      document.getElementById("fb-angle").addEventListener("input", function (event) { setAngle(Number(event.target.value) / 100); });
      document.getElementById("fb-power").addEventListener("input", function (event) { setPower(Number(event.target.value) / 100); });
      document.getElementById("fb-pause").addEventListener("click", openPause);
      document.getElementById("fb-close").addEventListener("click", closePause);
      document.getElementById("fb-resume").addEventListener("click", closePause);
      document.getElementById("fb-home").addEventListener("click", goHome);
      document.getElementById("fb-restart").addEventListener("click", restart);
      document.getElementById("fb-new-game").addEventListener("click", restart);

      var launchButton = document.getElementById("fb-launch");
      launchButton.addEventListener("pointerdown", function () { pressStartedAt = performance.now(); });
      launchButton.addEventListener("pointerup", function () {
        if (!pressStartedAt) return;
        var heldSeconds = (performance.now() - pressStartedAt) / 1000;
        if (heldSeconds > 0.12) setPower(Math.max(power, clamp(heldSeconds / 1.2, 0, 1)));
        pressStartedAt = 0;
        suppressClickUntil = Date.now() + 400;
        launch();
      });
      launchButton.addEventListener("pointercancel", function () { pressStartedAt = 0; });
      launchButton.addEventListener("click", function () {
        if (Date.now() < suppressClickUntil) return;
        launch();
      });
      sections.game.addEventListener("keydown", onGameKeyDown);
      document.getElementById("fb-game-over").classList.toggle("is-visible", currentIsComplete());
      syncFallbackControls();
    }

    /* -------------------------- Game interaction ----------------------- */

    function onGameKeyDown(event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setAngle(angle - 0.05);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setAngle(angle + 0.05);
      } else if (event.code === "Space" && !event.repeat && event.target.tagName !== "INPUT") {
        event.preventDefault();
        launch();
      }
    }

    function launch() {
      if (rolling || currentIsComplete()) return;
      var context = nextContext();
      // Snapshot the throw inputs. Changing a slider must affect the next
      // throw, never the ball that is already travelling down the lane.
      activeRollAngle = angle;
      activeRollPower = power;
      activeRollDurationMs = 1180 - activeRollPower * 420;
      currentKnocked = calculateKnockedPins(context);
      rolling = true;
      paused = false;
      visualProgress = 0;
      animationStart = performance.now();
      animationPausedFor = 0;
      audio.unlock();
      audio.startBgm();
      audio.playSfx("roll");
      syncFallbackControls();
      document.getElementById("fb-status").textContent = t("rolling");

      var animate = function (now) {
        if (paused) return;
        var progress = Math.min(1, (now - animationStart - animationPausedFor) / activeRollDurationMs);
        visualProgress = progress;
        drawCanvas(progress);
        if (progress < 1) animationId = requestAnimationFrame(animate);
        else finishRoll(currentKnocked);
      };
      animationId = requestAnimationFrame(animate);
    }

    function finishRoll(knocked) {
      animationId = 0;
      var context = nextContext();
      gameState.rolls.push(knocked);
      gameState.currentFrame = nextContext().frame;
      saveProgress();
      rolling = false;
      visualProgress = 0;
      renderScoreboard();

      var records = frameRecords(gameState.rolls);
      var record = records[context.frame - 1];
      var celebration = document.getElementById("fb-celebration");
      if (record && record.type === "strike") {
        celebration.textContent = t("strike");
        audio.playSfx("strike");
      } else if (record && record.type === "spare") {
        celebration.textContent = t("spare");
        audio.playSfx("spare");
      } else {
        celebration.textContent = t("nice");
      }
      celebration.classList.remove("is-visible");
      void celebration.offsetWidth;
      celebration.classList.add("is-visible");
      currentKnocked = 0;
      currentImpactOrder = [];
      impactPlayed = [];
      document.getElementById("fb-status").textContent = currentIsComplete() ? t("gameOver") : t("ready");
      document.getElementById("fb-game-over").classList.toggle("is-visible", currentIsComplete());
      syncFallbackControls();
      drawCanvas(0);
    }

    function stopAnimation() {
      if (animationId) cancelAnimationFrame(animationId);
      animationId = 0;
      rolling = false;
      paused = false;
      visualProgress = 0;
      currentKnocked = 0;
      currentImpactOrder = [];
      impactPlayed = [];
      syncFallbackControls();
    }

    function openPause() {
      audio.playSfx("button");
      if (rolling) {
        paused = true;
        animationPauseAt = performance.now();
      }
      document.getElementById("fb-modal").hidden = false;
      document.getElementById("fb-status").textContent = t("paused");
    }

    function resumeAnimation() {
      animationPausedFor += performance.now() - animationPauseAt;
      paused = false;
      var resumeFrame = function (now) {
        if (paused) return;
        var progress = Math.min(1, (now - animationStart - animationPausedFor) / activeRollDurationMs);
        visualProgress = progress;
        drawCanvas(progress);
        if (progress < 1) animationId = requestAnimationFrame(resumeFrame);
        else finishRoll(currentKnocked);
      };
      animationId = requestAnimationFrame(resumeFrame);
    }

    function closePause() {
      audio.playSfx("button");
      document.getElementById("fb-modal").hidden = true;
      if (rolling && paused) {
        resumeAnimation();
        document.getElementById("fb-status").textContent = t("rolling");
      } else if (!currentIsComplete()) {
        document.getElementById("fb-status").textContent = t("ready");
      }
    }

    function goHome() {
      audio.playSfx("button");
      stopAnimation();
      if (gameState.rolls.length) saveProgress();
      else clearProgress();
      renderMenu();
      show("menu");
    }

    function restart() {
      audio.playSfx("button");
      stopAnimation();
      clearProgress();
      gameState = { rolls: [], currentFrame: 1 };
      renderGame();
      show("game");
    }

    /* -------------------------- Instructions/settings ------------------ */

    function renderInstructions() {
      sections.instructions.innerHTML = `
        <div class="screen-shell page-shell">
          <header class="page-header">
            <div class="page-header__title"><img src="assets/images/icons/icon-instructions.svg" alt="" aria-hidden="true" /><h1>${t("instructionTitle")}</h1></div>
            <button class="cute-button cute-button--soft" id="fb-instruction-back" type="button">${t("home")}</button>
          </header>
          <main class="instructions-content">
            <section class="instruction-card"><h2 class="instruction-card__title"><img src="assets/images/icons/icon-aim.svg" alt="" aria-hidden="true" />${t("basic")}</h2>
              <div class="step-grid">
                <article class="step-card"><span class="step-card__number">1</span><h3>${t("aim")}</h3><p>${t("aimText")}</p></article>
                <article class="step-card"><span class="step-card__number">2</span><h3>${t("charge")}</h3><p>${t("chargeText")}</p></article>
                <article class="step-card"><span class="step-card__number">3</span><h3>${t("release")}</h3><p>${t("releaseText")}</p></article>
              </div>
            </section>
            <section class="instruction-card"><h2 class="instruction-card__title"><img src="assets/images/icons/icon-strike.svg" alt="" aria-hidden="true" />${t("scoring")}</h2><ul class="rule-list"><li>${t("strikeRule")}</li><li>${t("spareRule")}</li><li>${t("tenth")}</li></ul></section>
            <section class="instruction-card"><h2 class="instruction-card__title"><img src="assets/images/icons/icon-mascot.svg" alt="" aria-hidden="true" />${t("tips")}</h2><ul class="tip-list"><li>${t("tip")}</li></ul></section>
          </main>
        </div>`;
      bindButton("fb-instruction-back", function () { renderMenu(); show("menu"); });
    }

    function renderSettings() {
      sections.settings.innerHTML = `
        <div class="screen-shell page-shell">
          <header class="page-header"><div class="page-header__title"><img src="assets/images/icons/icon-settings.svg" alt="" aria-hidden="true" /><h1>${t("settings")}</h1></div><button class="cute-button cute-button--soft" id="fb-settings-back" type="button">${t("back")}</button></header>
          <main class="settings-list">
            <section class="setting-card"><h2 class="setting-card__heading"><img src="assets/images/icons/icon-language.svg" alt="" aria-hidden="true" />${t("language")}</h2><div class="choice-grid">${languages.map(function (item) { return `<button class="choice-card${language === item ? " is-selected" : ""}" type="button" data-fb-language="${item}">${item === "zh" ? "繁中" : item === "en" ? "English" : "日本語"}</button>`; }).join("")}</div></section>
            <section class="setting-card"><h2 class="setting-card__heading"><img src="assets/images/icons/icon-theme.svg" alt="" aria-hidden="true" />${t("theme")}</h2><div class="choice-grid choice-grid--themes">${themes.map(function (item) { return `<button class="choice-card${settings.theme === item ? " is-selected" : ""}" type="button" data-fb-theme="${item}"><span class="theme-swatch theme-swatch--${item}"></span>${t(item)}</button>`; }).join("")}</div></section>
            <section class="setting-card"><label class="setting-label" for="fb-bgm">${t("bgm")}<output id="fb-bgm-value">${Math.round(settings.bgmVolume * 100)}%</output></label><input id="fb-bgm" type="range" min="0" max="100" value="${Math.round(settings.bgmVolume * 100)}" /><label class="setting-label" for="fb-sfx">${t("sfx")}<output id="fb-sfx-value">${Math.round(settings.sfxVolume * 100)}%</output></label><input id="fb-sfx" type="range" min="0" max="100" value="${Math.round(settings.sfxVolume * 100)}" /></section>
            <section class="setting-card"><div class="toggle-row"><h2 class="setting-card__heading"><img src="assets/images/icons/icon-vibration.svg" alt="" aria-hidden="true" />${t("vibration")}</h2><label class="toggle"><input id="fb-vibration" type="checkbox" ${settings.vibration ? "checked" : ""} /><span class="toggle__track"></span></label></div></section>
          </main>
          <div class="setting-actions"><p class="text-small">${t("saved")}</p><button class="cute-button cute-button--soft" id="fb-reset" type="button">${t("reset")}</button></div>
        </div>`;

      document.querySelectorAll("[data-fb-language]").forEach(function (button) {
        button.addEventListener("click", function () {
          audio.playSfx("button");
          language = button.getAttribute("data-fb-language");
          saveSettings();
          renderSettings();
        });
      });
      document.querySelectorAll("[data-fb-theme]").forEach(function (button) {
        button.addEventListener("click", function () {
          audio.playSfx("button");
          settings.theme = button.getAttribute("data-fb-theme");
          saveSettings();
          renderSettings();
        });
      });
      document.getElementById("fb-bgm").addEventListener("input", function (event) {
        settings.bgmVolume = Number(event.target.value) / 100;
        document.getElementById("fb-bgm-value").textContent = Math.round(settings.bgmVolume * 100) + "%";
        saveSettings();
      });
      document.getElementById("fb-sfx").addEventListener("input", function (event) {
        settings.sfxVolume = Number(event.target.value) / 100;
        document.getElementById("fb-sfx-value").textContent = Math.round(settings.sfxVolume * 100) + "%";
        saveSettings();
      });
      document.getElementById("fb-vibration").addEventListener("change", function (event) {
        settings.vibration = event.target.checked;
        saveSettings();
      });
      bindButton("fb-reset", function () {
        settings = Object.assign({}, fallbackSettings);
        language = "zh";
        saveSettings();
        renderSettings();
      });
      bindButton("fb-settings-back", function () { renderMenu(); show("menu"); });
    }

    settings = readSettings();
    try { language = localStorage.getItem("lang") || settings.language; } catch (error) { language = settings.language; }
    if (languages.indexOf(language) < 0) language = settings.language;
    settings.language = language;
    applyTheme(settings.theme);
    audio.setVolumes(settings.bgmVolume, settings.sfxVolume);
    renderMenu();
    show("menu");
  };

  window.setTimeout(startFallback, 650);
}());
