(function (global) {
  'use strict';
  var BigTwo = global.BigTwo = global.BigTwo || {};
  BigTwo.Screens = BigTwo.Screens || {};

  function t(key, values) { return BigTwo.I18n ? BigTwo.I18n.t(key, values) : key; }
  function name(id) { return t('player.' + id); }
  function signed(value) {
    var number = Number(value) || 0;
    return number > 0 ? '+' + (BigTwo.I18n ? BigTwo.I18n.formatNumber(number) : number) : String(number);
  }

  function makeButton(label, className, action) {
    var button = global.document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = label;
    button.addEventListener('click', action);
    return button;
  }

  function standingsFor(state) {
    var result = state && state.roundResult || {};
    var entries = result.standings || result.entries || [];
    if (entries.length) { return entries.slice().sort(function (a, b) { return (a.rank || 9) - (b.rank || 9); }); }
    return (state && state.players || []).map(function (player, index) {
      return {
        rank: index + 1,
        playerId: player.id,
        remainingCards: player.cardCount != null ? player.cardCount : player.hand.length,
        delta: 0,
        totalScore: player.score
      };
    });
  }

  BigTwo.Screens.createResultsScreen = function (app) {
    var audioRound = null;
    return {
      render: function (container) {
        var state = app.getGameState();
        var result = state && state.roundResult || {};
        var winnerId = result.winnerId || (standingsFor(state)[0] && standingsFor(state)[0].playerId) || 'human';
        var won = winnerId === 'human';
        var header = global.document.createElement('header');
        var title = global.document.createElement('h1');
        var champion = global.document.createElement('div');
        var avatar = BigTwo.UI.TableRenderer.createAvatar(winnerId,
          'results-champion__avatar avatar avatar--' + winnerId);
        var message = global.document.createElement('p');
        var table = global.document.createElement('table');
        var thead = global.document.createElement('thead');
        var tbody = global.document.createElement('tbody');
        var headRow = global.document.createElement('tr');
        var actions = global.document.createElement('div');
        var stats = app.getStatistics();
        var streak = global.document.createElement('p');
        header.className = 'results-hero ' + (won ? 'is-victory' : 'is-defeat');
        title.id = 'screen-results-title';
        title.setAttribute('data-screen-heading', '');
        title.textContent = t('results.title');
        champion.className = 'results-champion';
        message.className = 'results-message';
        message.textContent = won ? t('results.win') : t('results.lose', { name: name(winnerId) });
        champion.appendChild(avatar);
        champion.appendChild(message);
        header.appendChild(title);
        header.appendChild(champion);
        if (won) {
          var confetti = global.document.createElement('div');
          confetti.className = 'confetti';
          confetti.setAttribute('aria-hidden', 'true');
          for (var c = 0; c < 18; c += 1) {
            var piece = global.document.createElement('span');
            piece.style.setProperty('--confetti-index', String(c));
            confetti.appendChild(piece);
          }
          header.appendChild(confetti);
        }
        table.className = 'results-table';
        table.setAttribute('aria-label', t('results.title'));
        ['results.rank', 'results.player', 'results.remaining', 'results.roundScore', 'results.totalScore'].forEach(function (key) {
          var th = global.document.createElement('th');
          th.scope = 'col';
          th.textContent = t(key);
          headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        standingsFor(state).forEach(function (entry) {
          var row = global.document.createElement('tr');
          var values = [entry.rank, name(entry.playerId || entry.id), entry.remainingCards,
            signed(entry.delta != null ? entry.delta : entry.scoreDelta),
            entry.totalScore != null ? entry.totalScore : ((state.players.find(function (p) { return p.id === (entry.playerId || entry.id); }) || {}).score || 0)];
          if ((entry.playerId || entry.id) === winnerId) { row.className = 'is-winner'; }
          values.forEach(function (value, index) {
            var cell = global.document.createElement(index === 1 ? 'th' : 'td');
            if (index === 1) { cell.scope = 'row'; }
            cell.textContent = String(value);
            row.appendChild(cell);
          });
          tbody.appendChild(row);
        });
        table.appendChild(thead);
        table.appendChild(tbody);
        streak.className = 'results-streak';
        streak.textContent = t('results.streak', { count: stats.currentWinStreak || 0 });
        actions.className = 'results-actions';
        actions.appendChild(makeButton(t('results.playAgain'), 'button button--primary button--large', function () { app.startNextRound(); }));
        actions.appendChild(makeButton(t('results.home'), 'button button--secondary button--large', function () { app.finishToHome(); }));
        container.appendChild(header);
        container.appendChild(table);
        container.appendChild(streak);
        container.appendChild(actions);
      },
      onShow: function () {
        var state = app.getGameState();
        if (state && state.roundNumber !== audioRound) {
          audioRound = state.roundNumber;
          app.playResultAudio(state.roundResult && state.roundResult.winnerId === 'human');
        }
      }
    };
  };
}(window));
