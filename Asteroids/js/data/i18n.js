(function () {
  "use strict";

  var current = "zh-Hant";

  var text = {
    en: {
      "meta.title": "Asteroids",
      "aria.mainMenu": "Main menu",
      "aria.mainActions": "Main actions",
      "aria.game": "Game",
      "aria.canvas": "Asteroids play field",
      "aria.toggleSound": "Toggle sound",
      "aria.sound": "Sound",
      "aria.pause": "Pause",
      "aria.touchControls": "Touch controls",
      "aria.turnLeft": "Turn left",
      "aria.thrust": "Thrust",
      "aria.turnRight": "Turn right",
      "aria.warp": "Warp",
      "aria.fire": "Fire",
      "aria.help": "Help",
      "aria.back": "Back",
      "aria.helpSections": "Help sections",
      "aria.settings": "Settings",
      "aria.theme": "Theme",
      "aria.paused": "Paused",
      "aria.gameOver": "Game over",

      "menu.kicker": "Vector arcade",
      "menu.title": "ASTEROIDS",
      "menu.tagline": "Break the field. Dodge the debris. Chase the high score.",
      "menu.newGame": "New Game",
      "menu.continue": "Continue",
      "menu.help": "Help",
      "menu.settings": "Settings",
      "menu.high": "High",

      "hud.score": "Score",
      "hud.high": "High",
      "hud.level": "Level",
      "hud.lives": "Lives",

      "touch.left": "L",
      "touch.thrust": "TH",
      "touch.right": "R",
      "touch.warp": "WP",
      "touch.fire": "FIRE",

      "help.title": "How To Play",
      "help.controls": "Controls",
      "help.scoring": "Scoring",
      "help.powerups": "Powerups",
      "help.control.left.key": "A / Left",
      "help.control.left.desc": "Turn left",
      "help.control.right.key": "D / Right",
      "help.control.right.desc": "Turn right",
      "help.control.thrust.key": "W / Up",
      "help.control.thrust.desc": "Thrust",
      "help.control.fire.key": "Space / J",
      "help.control.fire.desc": "Fire",
      "help.control.warp.key": "Shift / K",
      "help.control.warp.desc": "Warp with risk",
      "help.control.pause.key": "Esc / P",
      "help.control.pause.desc": "Pause",
      "help.control.mute.key": "M",
      "help.control.mute.desc": "Mute",
      "help.score.largeAsteroid": "Large asteroid",
      "help.score.mediumAsteroid": "Medium asteroid",
      "help.score.smallAsteroid": "Small asteroid",
      "help.score.largeUfo": "Large UFO",
      "help.score.smallUfo": "Small UFO",
      "help.score.extraLife": "Extra life",
      "help.score.20": "20 points",
      "help.score.50": "50 points",
      "help.score.100": "100 points",
      "help.score.200": "200 points",
      "help.score.1000": "1000 points",
      "help.score.extraLifeDesc": "Every 10,000 points",
      "help.power.shield.desc": "Absorbs one hit",
      "help.power.triple.desc": "Fires three rounds",
      "help.power.boost.desc": "Raises thrust speed",
      "help.power.rapid.desc": "Shorter fire cooldown",

      "settings.title": "Settings",
      "settings.language": "Language",
      "settings.theme": "Theme",
      "settings.bgm": "BGM Volume",
      "settings.sfx": "SFX Volume",
      "settings.touchOpacity": "Touch Opacity",
      "settings.touchLayout": "Touch Layout",
      "settings.layout.default": "Default",
      "settings.layout.compact": "Compact",
      "settings.layout.split": "Split",
      "settings.muted": "Muted",
      "settings.particles": "Particles",
      "settings.screenShake": "Screen shake",
      "settings.showFps": "Show FPS",
      "theme.neon": "Neon",
      "theme.retro": "Retro",
      "theme.ocean": "Ocean",
      "theme.sunset": "Sunset",
      "theme.mono": "Mono",

      "modal.paused": "Paused",
      "modal.resume": "Resume",
      "modal.restart": "Restart",
      "modal.mainMenu": "Main Menu",
      "modal.gameOver": "Game Over",
      "modal.playAgain": "Play Again",
      "game.scoreLine": "Score {score}",
      "game.highLine": "High {score}",
      "game.levelTitle": "LEVEL {level}",
      "game.incomingField": "Incoming field",
      "game.fps": "FPS {fps}",

      "power.shield": "Shield",
      "power.triple": "Triple",
      "power.boost": "Boost",
      "power.rapid": "Rapid"
    },

    ja: {
      "meta.title": "アステロイド",
      "aria.mainMenu": "メインメニュー",
      "aria.mainActions": "メイン操作",
      "aria.game": "ゲーム",
      "aria.canvas": "アステロイドのプレイフィールド",
      "aria.toggleSound": "サウンド切り替え",
      "aria.sound": "サウンド",
      "aria.pause": "一時停止",
      "aria.touchControls": "タッチ操作",
      "aria.turnLeft": "左へ旋回",
      "aria.thrust": "推進",
      "aria.turnRight": "右へ旋回",
      "aria.warp": "ワープ",
      "aria.fire": "発射",
      "aria.help": "ヘルプ",
      "aria.back": "戻る",
      "aria.helpSections": "ヘルプ項目",
      "aria.settings": "設定",
      "aria.theme": "テーマ",
      "aria.paused": "一時停止中",
      "aria.gameOver": "ゲームオーバー",

      "menu.kicker": "ベクターアーケード",
      "menu.title": "ASTEROIDS",
      "menu.tagline": "小惑星帯を突破し、破片を避け、ハイスコアを狙え。",
      "menu.newGame": "ニューゲーム",
      "menu.continue": "つづきから",
      "menu.help": "ヘルプ",
      "menu.settings": "設定",
      "menu.high": "ハイスコア",

      "hud.score": "スコア",
      "hud.high": "最高",
      "hud.level": "レベル",
      "hud.lives": "残機",

      "touch.left": "左",
      "touch.thrust": "推進",
      "touch.right": "右",
      "touch.warp": "転送",
      "touch.fire": "発射",

      "help.title": "遊び方",
      "help.controls": "操作",
      "help.scoring": "スコア",
      "help.powerups": "パワーアップ",
      "help.control.left.key": "A / 左",
      "help.control.left.desc": "左へ旋回",
      "help.control.right.key": "D / 右",
      "help.control.right.desc": "右へ旋回",
      "help.control.thrust.key": "W / 上",
      "help.control.thrust.desc": "推進",
      "help.control.fire.key": "Space / J",
      "help.control.fire.desc": "発射",
      "help.control.warp.key": "Shift / K",
      "help.control.warp.desc": "危険を伴うワープ",
      "help.control.pause.key": "Esc / P",
      "help.control.pause.desc": "一時停止",
      "help.control.mute.key": "M",
      "help.control.mute.desc": "ミュート",
      "help.score.largeAsteroid": "大型小惑星",
      "help.score.mediumAsteroid": "中型小惑星",
      "help.score.smallAsteroid": "小型小惑星",
      "help.score.largeUfo": "大型UFO",
      "help.score.smallUfo": "小型UFO",
      "help.score.extraLife": "残機追加",
      "help.score.20": "20点",
      "help.score.50": "50点",
      "help.score.100": "100点",
      "help.score.200": "200点",
      "help.score.1000": "1000点",
      "help.score.extraLifeDesc": "10,000点ごと",
      "help.power.shield.desc": "攻撃を1回防ぐ",
      "help.power.triple.desc": "3方向に発射",
      "help.power.boost.desc": "推進速度アップ",
      "help.power.rapid.desc": "発射間隔を短縮",

      "settings.title": "設定",
      "settings.language": "言語",
      "settings.theme": "テーマ",
      "settings.bgm": "BGM音量",
      "settings.sfx": "効果音音量",
      "settings.touchOpacity": "タッチ操作の透明度",
      "settings.touchLayout": "タッチ配置",
      "settings.layout.default": "標準",
      "settings.layout.compact": "コンパクト",
      "settings.layout.split": "分割",
      "settings.muted": "ミュート",
      "settings.particles": "パーティクル",
      "settings.screenShake": "画面揺れ",
      "settings.showFps": "FPS表示",
      "theme.neon": "ネオン",
      "theme.retro": "レトロ",
      "theme.ocean": "オーシャン",
      "theme.sunset": "サンセット",
      "theme.mono": "モノクロ",

      "modal.paused": "一時停止",
      "modal.resume": "再開",
      "modal.restart": "リスタート",
      "modal.mainMenu": "メインメニュー",
      "modal.gameOver": "ゲームオーバー",
      "modal.playAgain": "もう一度プレイ",
      "game.scoreLine": "スコア {score}",
      "game.highLine": "ハイスコア {score}",
      "game.levelTitle": "レベル {level}",
      "game.incomingField": "次の小惑星帯",
      "game.fps": "FPS {fps}",

      "power.shield": "シールド",
      "power.triple": "3連射",
      "power.boost": "ブースト",
      "power.rapid": "連射"
    },

    "zh-Hant": {
      "meta.title": "小行星",
      "aria.mainMenu": "主選單",
      "aria.mainActions": "主要操作",
      "aria.game": "遊戲",
      "aria.canvas": "小行星遊戲區",
      "aria.toggleSound": "切換音效",
      "aria.sound": "音效",
      "aria.pause": "暫停",
      "aria.touchControls": "觸控操作",
      "aria.turnLeft": "向左旋轉",
      "aria.thrust": "推進",
      "aria.turnRight": "向右旋轉",
      "aria.warp": "躍遷",
      "aria.fire": "射擊",
      "aria.help": "說明",
      "aria.back": "返回",
      "aria.helpSections": "說明分類",
      "aria.settings": "設定",
      "aria.theme": "主題",
      "aria.paused": "已暫停",
      "aria.gameOver": "遊戲結束",

      "menu.kicker": "向量街機",
      "menu.title": "ASTEROIDS",
      "menu.tagline": "突破小行星帶，閃避碎片，挑戰最高分。",
      "menu.newGame": "開始遊戲",
      "menu.continue": "繼續遊戲",
      "menu.help": "說明",
      "menu.settings": "設定",
      "menu.high": "最高分",

      "hud.score": "分數",
      "hud.high": "最高",
      "hud.level": "關卡",
      "hud.lives": "生命",

      "touch.left": "左",
      "touch.thrust": "推進",
      "touch.right": "右",
      "touch.warp": "躍遷",
      "touch.fire": "射擊",

      "help.title": "遊戲說明",
      "help.controls": "操作",
      "help.scoring": "計分",
      "help.powerups": "強化道具",
      "help.control.left.key": "A / 左",
      "help.control.left.desc": "向左旋轉",
      "help.control.right.key": "D / 右",
      "help.control.right.desc": "向右旋轉",
      "help.control.thrust.key": "W / 上",
      "help.control.thrust.desc": "推進",
      "help.control.fire.key": "Space / J",
      "help.control.fire.desc": "射擊",
      "help.control.warp.key": "Shift / K",
      "help.control.warp.desc": "帶有風險的躍遷",
      "help.control.pause.key": "Esc / P",
      "help.control.pause.desc": "暫停",
      "help.control.mute.key": "M",
      "help.control.mute.desc": "靜音",
      "help.score.largeAsteroid": "大型小行星",
      "help.score.mediumAsteroid": "中型小行星",
      "help.score.smallAsteroid": "小型小行星",
      "help.score.largeUfo": "大型 UFO",
      "help.score.smallUfo": "小型 UFO",
      "help.score.extraLife": "額外生命",
      "help.score.20": "20 分",
      "help.score.50": "50 分",
      "help.score.100": "100 分",
      "help.score.200": "200 分",
      "help.score.1000": "1000 分",
      "help.score.extraLifeDesc": "每 10,000 分獲得一次",
      "help.power.shield.desc": "抵擋一次撞擊",
      "help.power.triple.desc": "三方向射擊",
      "help.power.boost.desc": "提高推進速度",
      "help.power.rapid.desc": "縮短射擊冷卻",

      "settings.title": "設定",
      "settings.language": "語言",
      "settings.theme": "主題",
      "settings.bgm": "背景音樂音量",
      "settings.sfx": "音效音量",
      "settings.touchOpacity": "觸控透明度",
      "settings.touchLayout": "觸控配置",
      "settings.layout.default": "預設",
      "settings.layout.compact": "精簡",
      "settings.layout.split": "分離",
      "settings.muted": "靜音",
      "settings.particles": "粒子效果",
      "settings.screenShake": "畫面震動",
      "settings.showFps": "顯示 FPS",
      "theme.neon": "霓虹",
      "theme.retro": "復古",
      "theme.ocean": "海洋",
      "theme.sunset": "夕陽",
      "theme.mono": "黑白",

      "modal.paused": "暫停",
      "modal.resume": "繼續",
      "modal.restart": "重新開始",
      "modal.mainMenu": "主選單",
      "modal.gameOver": "遊戲結束",
      "modal.playAgain": "再玩一次",
      "game.scoreLine": "分數 {score}",
      "game.highLine": "最高分 {score}",
      "game.levelTitle": "關卡 {level}",
      "game.incomingField": "下一波小行星",
      "game.fps": "FPS {fps}",

      "power.shield": "護盾",
      "power.triple": "三連射",
      "power.boost": "加速",
      "power.rapid": "連射"
    }
  };

  function interpolate(value, params) {
    return String(value).replace(/\{(\w+)\}/g, function (_, key) {
      return params && params[key] !== undefined ? params[key] : "";
    });
  }

  function t(key, params) {
    var bundle = text[current] || text.en;
    return interpolate(bundle[key] || text.en[key] || key, params);
  }

  function apply(root) {
    root = root || document;
    document.documentElement.lang = current;
    document.title = t("meta.title");

    root.querySelectorAll("[data-i18n]").forEach(function (node) {
      node.textContent = t(node.getAttribute("data-i18n"));
    });

    root.querySelectorAll("[data-i18n-aria]").forEach(function (node) {
      node.setAttribute("aria-label", t(node.getAttribute("data-i18n-aria")));
    });

    root.querySelectorAll("[data-i18n-title]").forEach(function (node) {
      node.setAttribute("title", t(node.getAttribute("data-i18n-title")));
    });
  }

  Game.I18n = {
    languages: ["zh-Hant", "en", "ja"],
    names: {
      "zh-Hant": "繁體中文",
      en: "English",
      ja: "日本語"
    },

    setLanguage: function (language) {
      current = text[language] ? language : "zh-Hant";
      apply();
    },

    getLanguage: function () {
      return current;
    },

    t: t,
    apply: apply
  };
}());
