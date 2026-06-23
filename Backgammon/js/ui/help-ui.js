(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  const tabs = ["overview", "movement", "bar", "bear_off", "winning", "terms"];

  const content = {
    "zh-TW": {
      overview: `<section class="help-panel"><h3>遊戲目標</h3><p>率先將 15 顆棋子全部熊入即可獲勝。</p><pre class="help-diagram">AI 側：13 14 15 16 17 18 |BAR| 19 20 21 22 23 24
玩家側：12 11 10  9  8  7 |BAR|  6  5  4  3  2  1</pre><ol><li>擲骰決定步數。</li><li>依骰點移動棋子。</li><li>所有棋子回到 Home Board 後開始熊入。</li></ol></section>`,
      movement: `<section class="help-panel"><h3>移動規則</h3><ul><li>玩家白棋往低點位移動，AI 黑棋往高點位移動。</li><li>落點為空位或同色棋可進入。</li><li>落點只有一顆對方棋可打出到 BAR。</li><li>落點有兩顆以上對方棋時不可進入。</li><li>擲出對子時同一點數可走四次。</li></ul></section>`,
      bar: `<section class="help-panel"><h3>BAR 規則</h3><p>棋子被打出後會放在中央 BAR。BAR 上有棋時，必須先用骰點讓它重新入場，不能移動其他棋子。</p></section>`,
      bear_off: `<section class="help-panel"><h3>熊入規則</h3><p>本方所有棋子都在 Home Board 內才可熊入。骰點正好對應距離可直接熊入；若骰點超出，只能從最遠且無更遠棋子的點位熊入。</p></section>`,
      winning: `<section class="help-panel"><h3>勝利條件</h3><ul><li>普通勝：對手已至少熊入一顆。</li><li>豪奪：對手尚未熊入。</li><li>絕殺：對手尚未熊入且仍有棋在 BAR 或勝方 Home Board。</li></ul></section>`,
      terms: `<section class="help-panel"><h3>術語</h3><ul><li>Point：棋盤上的三角形位置。</li><li>BAR：中央隔板，被打出的棋子位置。</li><li>Home Board：可熊入前必須集中的本方終點區。</li><li>Double：兩顆骰子相同，可移動四次。</li></ul></section>`,
    },
    en: {
      overview: `<section class="help-panel"><h3>Goal</h3><p>Be the first to bear off all 15 checkers.</p><pre class="help-diagram">AI side: 13 14 15 16 17 18 |BAR| 19 20 21 22 23 24
Player: 12 11 10  9  8  7 |BAR|  6  5  4  3  2  1</pre><ol><li>Roll dice.</li><li>Move by the pips.</li><li>Bear off after all checkers reach your home board.</li></ol></section>`,
      movement: `<section class="help-panel"><h3>Movement</h3><ul><li>White moves toward lower points. Black moves toward higher points.</li><li>Empty points and friendly points are open.</li><li>A single opposing checker can be hit.</li><li>Two or more opposing checkers block the point.</li></ul></section>`,
      bar: `<section class="help-panel"><h3>Bar</h3><p>Hit checkers go to the bar. When you have checkers on the bar, they must enter before any other move.</p></section>`,
      bear_off: `<section class="help-panel"><h3>Bear Off</h3><p>All checkers must be in your home board. Exact dice bear off directly; oversized dice may bear off only from the farthest occupied point.</p></section>`,
      winning: `<section class="help-panel"><h3>Winning</h3><ul><li>Normal: opponent has borne off.</li><li>Gammon: opponent has borne off none.</li><li>Backgammon: opponent has borne off none and remains on the bar or in your home board.</li></ul></section>`,
      terms: `<section class="help-panel"><h3>Terms</h3><ul><li>Point: one triangle on the board.</li><li>Bar: center divider for hit checkers.</li><li>Home Board: final quadrant before bearing off.</li><li>Double: matching dice, four moves.</li></ul></section>`,
    },
    ja: {
      overview: `<section class="help-panel"><h3>目的</h3><p>15 個すべてのチェッカーを先にベアオフします。</p><pre class="help-diagram">AI 側：13 14 15 16 17 18 |BAR| 19 20 21 22 23 24
プレイヤー：12 11 10  9  8  7 |BAR|  6  5  4  3  2  1</pre></section>`,
      movement: `<section class="help-panel"><h3>移動</h3><ul><li>白は小さい番号へ、黒は大きい番号へ進みます。</li><li>空きまたは味方のポイントへ入れます。</li><li>相手が 1 個だけならヒットできます。</li><li>相手が 2 個以上なら入れません。</li></ul></section>`,
      bar: `<section class="help-panel"><h3>バー</h3><p>ヒットされたチェッカーはバーへ置かれます。バーに駒がある場合、それを先に戻します。</p></section>`,
      bear_off: `<section class="help-panel"><h3>ベアオフ</h3><p>全駒がホームボードに入るとベアオフできます。大きすぎる目は、より遠い駒が無い場合のみ使えます。</p></section>`,
      winning: `<section class="help-panel"><h3>勝利</h3><ul><li>通常勝ち：相手がベアオフ済み。</li><li>ギャモン：相手が 0 個。</li><li>バックギャモン：相手が 0 個でバーまたは勝者ホームに残る。</li></ul></section>`,
      terms: `<section class="help-panel"><h3>用語</h3><ul><li>ポイント：盤上の三角形。</li><li>バー：中央の仕切り。</li><li>ホームボード：ベアオフ前の終点エリア。</li><li>ゾロ目：同じ目で 4 回移動。</li></ul></section>`,
    },
  };

  BG.HelpUI = {
    active: "overview",

    init() {
      const root = document.getElementById("helpTabs");
      tabs.forEach((tab) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "help-tab";
        button.dataset.tab = tab;
        button.addEventListener("click", () => {
          BG.AudioEngine.playSfx("btn_click");
          this.active = tab;
          this.render();
        });
        root.append(button);
      });
      this.render();
    },

    render() {
      const locale = BG.I18n.currentLocale;
      document.querySelectorAll(".help-tab").forEach((button) => {
        button.textContent = BG.I18n.t(`help.tabs.${button.dataset.tab}`);
        button.classList.toggle("active", button.dataset.tab === this.active);
      });
      const localized = content[locale] || content["zh-TW"];
      document.getElementById("helpContent").innerHTML = localized[this.active] || localized.overview;
    },
  };
})(window);
