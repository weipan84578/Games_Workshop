/* animations.js — 棋子逐格移動、骰子翻滾、吃子回家動畫。
   以 left/top 轉場搭配 transform 置中;尊重「動畫速度」設定(0=關閉)。 */
(function (L) {
  'use strict';

  var ANIM = L.ui.animations = L.ui.animations || {};

  function speed() {
    var s = L.state.settings;
    return s ? s.animSpeed : 1;
  }
  function scaled(ms) {
    var sp = speed();
    if (sp === 0) return 0;
    return ms / (sp || 1);
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  // 骰子翻滾動畫,最終停在 value
  ANIM.rollDice = function (value) {
    var dice = document.getElementById('dice');
    if (!dice) return Promise.resolve();
    dice.classList.add('rolling');
    var dur = scaled(620);
    if (dur === 0) {
      L.ui.hud.renderDiceFace(value);
      dice.classList.remove('rolling');
      return Promise.resolve();
    }
    return new Promise(function (resolve) {
      var elapsed = 0, iv = 70;
      var timer = setInterval(function () {
        elapsed += iv;
        L.ui.hud.renderDiceFace(1 + Math.floor(Math.random() * 6));
        if (elapsed >= dur) {
          clearInterval(timer);
          L.ui.hud.renderDiceFace(value);
          dice.classList.remove('rolling');
          resolve();
        }
      }, iv);
    });
  };

  // 逐格移動棋子,coords 為 {x,y} 分數陣列
  ANIM.moveToken = function (tokenId, coords, fromYard) {
    var el = document.getElementById('token-' + tokenId);
    if (!el || !coords.length) return Promise.resolve();
    el.classList.add('moving');

    var hopDur = scaled(150);
    var chain = Promise.resolve();

    coords.forEach(function (pt, i) {
      chain = chain.then(function () {
        return step(el, pt, hopDur, fromYard && i === 0 ? scaled(220) : hopDur, !fromYard);
      });
    });

    return chain.then(function () {
      el.classList.remove('moving');
    });
  };

  function step(el, pt, dur, transDur, playHop) {
    el.style.transition = transDur ? ('left ' + transDur + 'ms ease, top ' + transDur + 'ms ease') : 'none';
    el.style.left = (pt.x * 100) + '%';
    el.style.top = (pt.y * 100) + '%';
    el.style.transform = 'translate(-50%, -50%)';
    if (playHop && dur > 0) L.audio.playSfx('sfx_token_hop');
    return wait(dur + 10);
  }

  // 被吃棋子回家
  ANIM.sendHome = function (tokenId) {
    var el = document.getElementById('token-' + tokenId);
    var tk = L.state.getToken(tokenId);
    if (!el || !tk) return Promise.resolve();
    var pos = L.engine.board.tokenPos(tk);
    var dur = scaled(320);
    el.classList.add('captured');
    el.style.transition = dur ? ('left ' + dur + 'ms ease, top ' + dur + 'ms ease, transform ' + dur + 'ms ease') : 'none';
    el.style.left = (pos.x * 100) + '%';
    el.style.top = (pos.y * 100) + '%';
    el.style.transform = 'translate(-50%, -50%) scale(0.6)';
    return wait(dur + 20);
  };
})(window.Ludo);
