(function (window, document) {
  "use strict";

  const Game = window.Game = window.Game || {};

  const dictionaries = {
    "zh-Hant": {
      "app.label": "Centipede 網頁遊戲",
      "hud.score": "分數",
      "hud.high": "最高",
      "hud.lives": "生命",
      "hud.level": "關卡",
      "aria.gameArea": "遊戲區",
      "aria.canvas": "Centipede 遊戲畫布",
      "aria.touchControls": "觸控控制",
      "aria.moveStick": "移動搖桿",
      "aria.mainMenu": "主選單",
      "action.pause": "暫停",
      "action.continue": "繼續",
      "action.settings": "設定",
      "action.close": "關閉",
      "action.back": "返回",
      "action.done": "完成",
      "action.playAgain": "再玩一次",
      "action.mainMenu": "主選單",
      "action.fire": "射擊",
      "menu.eyebrow": "街機戰場",
      "menu.new": "開始新遊戲",
      "menu.continue": "繼續遊戲",
      "menu.help": "操作說明",
      "menu.settings": "設定",
      "menu.noSave": "尚未偵測到可繼續的存檔",
      "menu.saveFound": "可繼續：第 {level} 關，{score} 分，{date}",
      "toast.noSave": "沒有可用的存檔",
      "ribbon.ready": "準備",
      "ribbon.levelClear": "關卡完成",
      "ribbon.extraLife": "額外生命",
      "modal.message": "訊息",
      "modal.gameOver": "遊戲結束",
      "modal.finalScore": "本次分數：",
      "modal.highScore": "最高分：",
      "modal.pause": "暫停",
      "modal.saved": "目前進度已保存。",
      "settings.title": "設定",
      "settings.language": "語言",
      "settings.musicVol": "音樂音量",
      "settings.sfxVol": "音效音量",
      "settings.theme": "色彩主題",
      "settings.fontSize": "文字大小",
      "settings.shake": "碰撞震動",
      "settings.touchFire": "觸控射擊鍵",
      "settings.touchHint": "手機橫向時會套用左右配置。",
      "lang.zh-Hant": "繁體中文",
      "lang.en": "English",
      "lang.ja": "日本語",
      "theme.neon": "霓虹",
      "theme.retro": "復古",
      "theme.ocean": "海洋",
      "theme.sunset": "夕陽",
      "theme.mono": "高對比",
      "font.compact": "緊湊",
      "font.normal": "標準",
      "font.large": "放大",
      "side.right": "右側",
      "side.left": "左側",
      "help.title": "操作說明",
      "help.body": `
        <div class="help-layout">
          <section class="help-card">
            <span class="help-icon help-icon--keyboard" aria-hidden="true"></span>
            <div>
              <h3>鍵盤</h3>
              <p><span class="keycap">↑</span><span class="keycap">↓</span><span class="keycap">←</span><span class="keycap">→</span> 或 <span class="keycap">W</span><span class="keycap">A</span><span class="keycap">S</span><span class="keycap">D</span> 移動砲台。</p>
              <p><span class="keycap keycap--wide">Space</span> 或 <span class="keycap keycap--wide">Enter</span> 射擊，<span class="keycap">Esc</span> 暫停。</p>
            </div>
          </section>
          <section class="help-card">
            <span class="help-icon help-icon--touch" aria-hidden="true"></span>
            <div>
              <h3>滑鼠與觸控</h3>
              <p>滑鼠移到遊戲區內可牽引砲台，點擊畫布射擊。</p>
              <p>手機使用虛擬搖桿移動，射擊按鈕可連續開火；可在設定中切換射擊鍵位置。</p>
            </div>
          </section>
          <section class="help-card">
            <span class="help-icon help-icon--mushroom" aria-hidden="true"></span>
            <div>
              <h3>場地與蘑菇</h3>
              <p>蘑菇有 4 格耐久，會阻擋蜈蚣並讓牠轉向下移。</p>
              <p>蠍子會把蘑菇變成毒蘑菇；蜈蚣碰到毒蘑菇會向玩家區俯衝。</p>
            </div>
          </section>
          <section class="help-card">
            <span class="help-icon help-icon--enemy" aria-hidden="true"></span>
            <div>
              <h3>敵人與得分</h3>
              <p>蜈蚣身體 10 分，頭部 100 分；擊中身體會分裂成新的蜈蚣。</p>
              <p>蜘蛛依距離給 300 / 600 / 900 分，跳蚤 200 分，蠍子 1000 分。</p>
              <p>每 12000 分加 1 條生命，最多 6 條。死亡後蘑菇會修復並給少量分數。</p>
            </div>
          </section>
        </div>
      `
    },
    en: {
      "app.label": "Centipede Web Game",
      "hud.score": "SCORE",
      "hud.high": "HIGH",
      "hud.lives": "LIVES",
      "hud.level": "LEVEL",
      "aria.gameArea": "Game area",
      "aria.canvas": "Centipede game canvas",
      "aria.touchControls": "Touch controls",
      "aria.moveStick": "Move stick",
      "aria.mainMenu": "Main menu",
      "action.pause": "Pause",
      "action.continue": "Continue",
      "action.settings": "Settings",
      "action.close": "Close",
      "action.back": "Back",
      "action.done": "Done",
      "action.playAgain": "Play Again",
      "action.mainMenu": "Main Menu",
      "action.fire": "Fire",
      "menu.eyebrow": "ARCADE FIELD",
      "menu.new": "New Game",
      "menu.continue": "Continue",
      "menu.help": "How to Play",
      "menu.settings": "Settings",
      "menu.noSave": "No saved game found",
      "menu.saveFound": "Continue: Level {level}, {score} points, {date}",
      "toast.noSave": "No saved game available",
      "ribbon.ready": "READY",
      "ribbon.levelClear": "LEVEL CLEAR",
      "ribbon.extraLife": "EXTRA LIFE",
      "modal.message": "Message",
      "modal.gameOver": "Game Over",
      "modal.finalScore": "Score: ",
      "modal.highScore": "High Score: ",
      "modal.pause": "Paused",
      "modal.saved": "Progress has been saved.",
      "settings.title": "Settings",
      "settings.language": "Language",
      "settings.musicVol": "Music Volume",
      "settings.sfxVol": "SFX Volume",
      "settings.theme": "Color Theme",
      "settings.fontSize": "Text Size",
      "settings.shake": "Collision Shake",
      "settings.touchFire": "Touch Fire Button",
      "settings.touchHint": "Applied in landscape layouts on mobile devices.",
      "lang.zh-Hant": "繁體中文",
      "lang.en": "English",
      "lang.ja": "日本語",
      "theme.neon": "Neon",
      "theme.retro": "Retro",
      "theme.ocean": "Ocean",
      "theme.sunset": "Sunset",
      "theme.mono": "High Contrast",
      "font.compact": "Compact",
      "font.normal": "Normal",
      "font.large": "Large",
      "side.right": "Right",
      "side.left": "Left",
      "help.title": "How to Play",
      "help.body": `
        <div class="help-layout">
          <section class="help-card">
            <span class="help-icon help-icon--keyboard" aria-hidden="true"></span>
            <div>
              <h3>Keyboard</h3>
              <p>Move with <span class="keycap">↑</span><span class="keycap">↓</span><span class="keycap">←</span><span class="keycap">→</span> or <span class="keycap">W</span><span class="keycap">A</span><span class="keycap">S</span><span class="keycap">D</span>.</p>
              <p>Shoot with <span class="keycap keycap--wide">Space</span> or <span class="keycap keycap--wide">Enter</span>. Pause with <span class="keycap">Esc</span>.</p>
            </div>
          </section>
          <section class="help-card">
            <span class="help-icon help-icon--touch" aria-hidden="true"></span>
            <div>
              <h3>Mouse and Touch</h3>
              <p>Move the mouse inside the board to guide the shooter. Click the canvas to fire.</p>
              <p>On mobile, use the virtual stick to move and the fire button to shoot continuously. The fire side can be changed in settings.</p>
            </div>
          </section>
          <section class="help-card">
            <span class="help-icon help-icon--mushroom" aria-hidden="true"></span>
            <div>
              <h3>Field and Mushrooms</h3>
              <p>Mushrooms have 4 HP. They block the centipede and force it to turn downward.</p>
              <p>Scorpions poison mushrooms. A centipede that hits poison will dive toward the player zone.</p>
            </div>
          </section>
          <section class="help-card">
            <span class="help-icon help-icon--enemy" aria-hidden="true"></span>
            <div>
              <h3>Enemies and Score</h3>
              <p>Centipede bodies are worth 10 points and heads are worth 100. Hitting a body splits the centipede.</p>
              <p>Spiders score 300 / 600 / 900 by distance, fleas score 200, and scorpions score 1000.</p>
              <p>Earn 1 extra life every 12000 points, up to 6 lives. Mushrooms repair after death and award small repair points.</p>
            </div>
          </section>
        </div>
      `
    },
    ja: {
      "app.label": "Centipede Webゲーム",
      "hud.score": "スコア",
      "hud.high": "最高",
      "hud.lives": "ライフ",
      "hud.level": "レベル",
      "aria.gameArea": "ゲームエリア",
      "aria.canvas": "Centipedeゲームキャンバス",
      "aria.touchControls": "タッチ操作",
      "aria.moveStick": "移動スティック",
      "aria.mainMenu": "メインメニュー",
      "action.pause": "一時停止",
      "action.continue": "続ける",
      "action.settings": "設定",
      "action.close": "閉じる",
      "action.back": "戻る",
      "action.done": "完了",
      "action.playAgain": "もう一度",
      "action.mainMenu": "メインメニュー",
      "action.fire": "発射",
      "menu.eyebrow": "アーケード戦場",
      "menu.new": "新規ゲーム",
      "menu.continue": "続きから",
      "menu.help": "操作説明",
      "menu.settings": "設定",
      "menu.noSave": "続きから再開できるセーブはありません",
      "menu.saveFound": "再開可能：レベル {level}、{score} 点、{date}",
      "toast.noSave": "利用できるセーブデータがありません",
      "ribbon.ready": "準備",
      "ribbon.levelClear": "レベルクリア",
      "ribbon.extraLife": "ライフ追加",
      "modal.message": "メッセージ",
      "modal.gameOver": "ゲームオーバー",
      "modal.finalScore": "今回のスコア：",
      "modal.highScore": "最高スコア：",
      "modal.pause": "一時停止",
      "modal.saved": "現在の進行状況を保存しました。",
      "settings.title": "設定",
      "settings.language": "言語",
      "settings.musicVol": "音楽音量",
      "settings.sfxVol": "効果音音量",
      "settings.theme": "カラーテーマ",
      "settings.fontSize": "文字サイズ",
      "settings.shake": "衝突時の揺れ",
      "settings.touchFire": "タッチ発射ボタン",
      "settings.touchHint": "モバイル横向きレイアウトで適用されます。",
      "lang.zh-Hant": "繁體中文",
      "lang.en": "English",
      "lang.ja": "日本語",
      "theme.neon": "ネオン",
      "theme.retro": "レトロ",
      "theme.ocean": "オーシャン",
      "theme.sunset": "サンセット",
      "theme.mono": "高コントラスト",
      "font.compact": "コンパクト",
      "font.normal": "標準",
      "font.large": "大きめ",
      "side.right": "右側",
      "side.left": "左側",
      "help.title": "操作説明",
      "help.body": `
        <div class="help-layout">
          <section class="help-card">
            <span class="help-icon help-icon--keyboard" aria-hidden="true"></span>
            <div>
              <h3>キーボード</h3>
              <p><span class="keycap">↑</span><span class="keycap">↓</span><span class="keycap">←</span><span class="keycap">→</span> または <span class="keycap">W</span><span class="keycap">A</span><span class="keycap">S</span><span class="keycap">D</span> で砲台を移動します。</p>
              <p><span class="keycap keycap--wide">Space</span> または <span class="keycap keycap--wide">Enter</span> で発射、<span class="keycap">Esc</span> で一時停止します。</p>
            </div>
          </section>
          <section class="help-card">
            <span class="help-icon help-icon--touch" aria-hidden="true"></span>
            <div>
              <h3>マウスとタッチ</h3>
              <p>盤面内でマウスを動かすと砲台を誘導できます。キャンバスをクリックすると発射します。</p>
              <p>モバイルでは仮想スティックで移動し、発射ボタンで連射できます。発射ボタンの位置は設定で切り替えられます。</p>
            </div>
          </section>
          <section class="help-card">
            <span class="help-icon help-icon--mushroom" aria-hidden="true"></span>
            <div>
              <h3>フィールドとキノコ</h3>
              <p>キノコは4耐久です。ムカデを遮り、下方向へ進路変更させます。</p>
              <p>サソリはキノコを毒化します。毒キノコに触れたムカデはプレイヤーエリアへ急降下します。</p>
            </div>
          </section>
          <section class="help-card">
            <span class="help-icon help-icon--enemy" aria-hidden="true"></span>
            <div>
              <h3>敵とスコア</h3>
              <p>ムカデの胴体は10点、頭は100点です。胴体に命中するとムカデが分裂します。</p>
              <p>クモは距離に応じて300 / 600 / 900点、ノミは200点、サソリは1000点です。</p>
              <p>12000点ごとにライフが1つ増え、最大6つまで保持できます。死亡後はキノコが修復され、少量の修復点が入ります。</p>
            </div>
          </section>
        </div>
      `
    }
  };

  let currentLanguage = "zh-Hant";

  function interpolate(template, values) {
    return String(template).replace(/\{(\w+)\}/g, (match, key) => {
      return Object.prototype.hasOwnProperty.call(values || {}, key) ? values[key] : match;
    });
  }

  Game.I18n = {
    languages: ["zh-Hant", "en", "ja"],

    setLanguage(lang) {
      currentLanguage = dictionaries[lang] ? lang : "zh-Hant";
      document.documentElement.lang = currentLanguage;
      this.translateDom();
    },

    getLanguage() {
      return currentLanguage;
    },

    getLocale() {
      return {
        "zh-Hant": "zh-TW",
        en: "en-US",
        ja: "ja-JP"
      }[currentLanguage] || "zh-TW";
    },

    t(key, values) {
      const active = dictionaries[currentLanguage] || dictionaries["zh-Hant"];
      const fallback = dictionaries["zh-Hant"];
      const template = active[key] || fallback[key] || key;
      return interpolate(template, values);
    },

    translateDom(root) {
      const scope = root || document;
      scope.querySelectorAll("[data-i18n]").forEach((element) => {
        element.textContent = this.t(element.dataset.i18n);
      });
      scope.querySelectorAll("[data-i18n-aria]").forEach((element) => {
        element.setAttribute("aria-label", this.t(element.dataset.i18nAria));
      });
      scope.querySelectorAll("[data-i18n-title]").forEach((element) => {
        element.title = this.t(element.dataset.i18nTitle);
      });
    }
  };
})(window, document);
