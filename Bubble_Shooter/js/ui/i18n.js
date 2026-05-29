(function (BS) {
  var dictionaries = {
    zh: {
      "app.title": "Bubble Shooter 泡泡龍",
      "app.eyebrow": "HTML5 Canvas",
      "menu.highScore": "最高分",
      "menu.newGame": "新遊戲",
      "menu.continue": "繼續遊戲",
      "menu.instructions": "玩法說明",
      "menu.settings": "設定",
      "hud.score": "分數",
      "hud.high": "最高",
      "hud.next": "下一顆",
      "hud.nextAria": "下一顆泡泡",
      "common.backMenu": "返回主選單",
      "common.pause": "暫停",
      "common.resume": "繼續",
      "common.restart": "重新開始",
      "common.mainMenu": "主選單",
      "common.playAgain": "再玩一次",
      "settings.title": "設定",
      "settings.language": "語言",
      "settings.theme": "主題",
      "settings.difficulty": "難易度",
      "settings.bgm": "背景音量",
      "settings.sfx": "音效音量",
      "settings.muted": "靜音",
      "settings.clearSave": "清除存檔",
      "difficulty.easy.label": "簡單",
      "difficulty.easy.desc": "下推較慢",
      "difficulty.normal.label": "普通",
      "difficulty.normal.desc": "標準節奏",
      "difficulty.hard.label": "困難",
      "difficulty.hard.desc": "下推較快",
      "instructions.title": "玩法說明",
      "instructions.aim.title": "瞄準與發射",
      "instructions.aim.body": "移動游標或手指瞄準，點擊、放開或按空白鍵發射泡泡。",
      "instructions.match.title": "消除泡泡",
      "instructions.match.body": "三顆以上同色泡泡相連就會消除，連段會給更多分數。",
      "instructions.drop.title": "掉落加分",
      "instructions.drop.body": "消除後沒有連到頂端的泡泡會掉落，掉落泡泡也會加分。",
      "instructions.pressure.title": "下推壓力",
      "instructions.pressure.body": "難度越高，泡泡列下推越快；多次未消除也會觸發下推。",
      "instructions.win.title": "勝負條件",
      "instructions.win.body": "清空場上泡泡即可過關。泡泡碰到警戒線時遊戲結束。",
      "result.score": "本局分數",
      "result.victory": "過關",
      "result.gameOver": "遊戲結束",
      "result.victoryKicker": "Victory",
      "result.gameOverKicker": "Game Over"
    },
    en: {
      "app.title": "Bubble Shooter",
      "app.eyebrow": "HTML5 Canvas",
      "menu.highScore": "High Score",
      "menu.newGame": "New Game",
      "menu.continue": "Continue",
      "menu.instructions": "How to Play",
      "menu.settings": "Settings",
      "hud.score": "Score",
      "hud.high": "Best",
      "hud.next": "Next",
      "hud.nextAria": "Next bubble",
      "common.backMenu": "Back to Menu",
      "common.pause": "Pause",
      "common.resume": "Resume",
      "common.restart": "Restart",
      "common.mainMenu": "Main Menu",
      "common.playAgain": "Play Again",
      "settings.title": "Settings",
      "settings.language": "Language",
      "settings.theme": "Theme",
      "settings.difficulty": "Difficulty",
      "settings.bgm": "BGM Volume",
      "settings.sfx": "SFX Volume",
      "settings.muted": "Mute",
      "settings.clearSave": "Clear Save",
      "difficulty.easy.label": "Easy",
      "difficulty.easy.desc": "Slower pressure",
      "difficulty.normal.label": "Normal",
      "difficulty.normal.desc": "Standard pace",
      "difficulty.hard.label": "Hard",
      "difficulty.hard.desc": "Faster pressure",
      "instructions.title": "How to Play",
      "instructions.aim.title": "Aim and Shoot",
      "instructions.aim.body": "Move the pointer or your finger to aim. Click, release, or press Space to shoot.",
      "instructions.match.title": "Match Bubbles",
      "instructions.match.body": "Connect three or more bubbles of the same color to pop them and score.",
      "instructions.drop.title": "Drop Bonuses",
      "instructions.drop.body": "Bubbles no longer connected to the ceiling will fall and award extra points.",
      "instructions.pressure.title": "Pressure Rows",
      "instructions.pressure.body": "Higher difficulty pushes rows down faster. Several misses will also add a row.",
      "instructions.win.title": "Win and Lose",
      "instructions.win.body": "Clear every bubble to win. The game ends when bubbles reach the warning line.",
      "result.score": "Final Score",
      "result.victory": "Cleared",
      "result.gameOver": "Game Over",
      "result.victoryKicker": "Victory",
      "result.gameOverKicker": "Game Over"
    },
    ja: {
      "app.title": "Bubble Shooter バブルシューター",
      "app.eyebrow": "HTML5 Canvas",
      "menu.highScore": "ハイスコア",
      "menu.newGame": "ニューゲーム",
      "menu.continue": "続きから",
      "menu.instructions": "遊び方",
      "menu.settings": "設定",
      "hud.score": "スコア",
      "hud.high": "最高",
      "hud.next": "次",
      "hud.nextAria": "次のバブル",
      "common.backMenu": "メニューに戻る",
      "common.pause": "一時停止",
      "common.resume": "再開",
      "common.restart": "やり直す",
      "common.mainMenu": "メニュー",
      "common.playAgain": "もう一度",
      "settings.title": "設定",
      "settings.language": "言語",
      "settings.theme": "テーマ",
      "settings.difficulty": "難易度",
      "settings.bgm": "BGM音量",
      "settings.sfx": "効果音音量",
      "settings.muted": "ミュート",
      "settings.clearSave": "セーブを削除",
      "difficulty.easy.label": "かんたん",
      "difficulty.easy.desc": "ゆっくり下がる",
      "difficulty.normal.label": "ふつう",
      "difficulty.normal.desc": "標準ペース",
      "difficulty.hard.label": "むずかしい",
      "difficulty.hard.desc": "速く下がる",
      "instructions.title": "遊び方",
      "instructions.aim.title": "狙って撃つ",
      "instructions.aim.body": "ポインターや指で狙い、クリック・指を離す・Spaceキーで発射します。",
      "instructions.match.title": "同じ色をそろえる",
      "instructions.match.body": "同じ色のバブルを3個以上つなげると消えてスコアになります。",
      "instructions.drop.title": "落下ボーナス",
      "instructions.drop.body": "天井につながっていないバブルは落下し、追加スコアになります。",
      "instructions.pressure.title": "下がる列",
      "instructions.pressure.body": "難易度が高いほど列が早く下がります。ミスが続いても列が追加されます。",
      "instructions.win.title": "勝敗条件",
      "instructions.win.body": "すべてのバブルを消すとクリア。警戒ラインに届くとゲーム終了です。",
      "result.score": "今回のスコア",
      "result.victory": "クリア",
      "result.gameOver": "ゲーム終了",
      "result.victoryKicker": "Victory",
      "result.gameOverKicker": "Game Over"
    }
  };

  function getLanguageConfig(name) {
    var languages = BS.Core.Config.languages;
    for (var i = 0; i < languages.length; i += 1) {
      if (languages[i].name === name) {
        return languages[i];
      }
    }
    return languages[0];
  }

  BS.UI.I18n = {
    current: "zh",

    t: function (key) {
      var dictionary = dictionaries[this.current] || dictionaries.zh;
      return dictionary[key] || dictionaries.zh[key] || key;
    },

    setLanguage: function (language) {
      var config = getLanguageConfig(language);
      this.current = config.name;
      document.documentElement.lang = config.htmlLang;
      document.title = this.t("app.title");
      this.apply(document);
    },

    apply: function (root) {
      var self = this;
      var scope = root || document;

      Array.prototype.forEach.call(scope.querySelectorAll("[data-i18n]"), function (element) {
        element.textContent = self.t(element.getAttribute("data-i18n"));
      });

      Array.prototype.forEach.call(scope.querySelectorAll("[data-i18n-aria]"), function (element) {
        element.setAttribute("aria-label", self.t(element.getAttribute("data-i18n-aria")));
      });
    }
  };
})(window.BubbleShooter);
