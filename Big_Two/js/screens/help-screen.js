(function (global) {
  'use strict';
  var BigTwo = global.BigTwo = global.BigTwo || {};
  BigTwo.Screens = BigTwo.Screens || {};
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function t(key, values) { return BigTwo.I18n ? BigTwo.I18n.t(key, values) : key; }

  function icon(kind) {
    var svg = global.document.createElementNS(SVG_NS, 'svg');
    var circle = global.document.createElementNS(SVG_NS, 'circle');
    var path = global.document.createElementNS(SVG_NS, 'path');
    svg.setAttribute('class', 'help-icon help-icon--' + kind);
    svg.setAttribute('viewBox', '0 0 48 48');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    circle.setAttribute('cx', '24');
    circle.setAttribute('cy', '24');
    circle.setAttribute('r', '20');
    path.setAttribute('d', kind === 'keyboard'
      ? 'M12 17h24v15H12zM16 22h3m3 0h3m3 0h3M16 27h16'
      : kind === 'cards'
        ? 'M16 11h20v27H16zM11 16h5v22h15'
        : kind === 'save'
          ? 'M14 12h18l4 4v20H12V12zM18 12v9h12v-9M18 29h12'
          : 'M24 12v24M12 24h24');
    svg.appendChild(circle);
    svg.appendChild(path);
    return svg;
  }

  function section(titleKey, bodyKeys, kind) {
    var article = global.document.createElement('article');
    var header = global.document.createElement('header');
    var title = global.document.createElement('h2');
    article.className = 'help-card';
    header.className = 'help-card__header';
    title.textContent = t(titleKey);
    header.appendChild(icon(kind || 'rule'));
    header.appendChild(title);
    article.appendChild(header);
    (bodyKeys || []).forEach(function (key) {
      var paragraph = global.document.createElement('p');
      paragraph.textContent = t(key);
      article.appendChild(paragraph);
    });
    return article;
  }

  function backButton(app) {
    var button = global.document.createElement('button');
    button.type = 'button';
    button.className = 'button button--secondary screen-back';
    button.textContent = '← ' + t('common.back');
    button.addEventListener('click', function () { app.navigate('home'); });
    return button;
  }

  function scoringSection() {
    var article = section('help.scoringTitle', [], 'score');
    var table = global.document.createElement('table');
    var thead = global.document.createElement('thead');
    var tbody = global.document.createElement('tbody');
    var headRow = global.document.createElement('tr');
    var description = global.document.createElement('p');
    [['help.scoringHeaderCards', null], ['help.scoringHeaderRate', null]].forEach(function (item) {
      var th = global.document.createElement('th');
      th.scope = 'col';
      th.textContent = t(item[0]);
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    [['help.scoringRow1', '×1'], ['help.scoringRow2', '×2'], ['help.scoringRow3', '×3'], ['help.scoringRow4', '×4']].forEach(function (row) {
      var tr = global.document.createElement('tr');
      var label = global.document.createElement('th');
      var value = global.document.createElement('td');
      label.scope = 'row';
      label.textContent = t(row[0]);
      value.textContent = row[1];
      tr.appendChild(label);
      tr.appendChild(value);
      tbody.appendChild(tr);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    description.textContent = t('help.scoringBody');
    article.appendChild(table);
    article.appendChild(description);
    return article;
  }

  function aiSection() {
    var article = section('help.aiTitle', [], 'ai');
    ['easy', 'normal', 'hard'].forEach(function (difficulty) {
      var block = global.document.createElement('div');
      var heading = global.document.createElement('h3');
      var paragraph = global.document.createElement('p');
      block.className = 'help-ai-level';
      heading.textContent = t('difficulty.' + difficulty);
      paragraph.textContent = t('difficulty.' + difficulty + 'Desc');
      block.appendChild(heading);
      block.appendChild(paragraph);
      article.appendChild(block);
    });
    return article;
  }

  BigTwo.Screens.createHelpScreen = function (app) {
    return {
      render: function (container) {
        var header = global.document.createElement('header');
        var title = global.document.createElement('h1');
        var intro = global.document.createElement('p');
        var grid = global.document.createElement('div');
        header.className = 'screen-header';
        title.id = 'screen-help-title';
        title.setAttribute('data-screen-heading', '');
        title.textContent = t('help.title');
        intro.className = 'screen-intro';
        intro.textContent = t('help.intro');
        header.appendChild(backButton(app));
        header.appendChild(title);
        header.appendChild(intro);
        grid.className = 'help-grid';
        grid.appendChild(section('help.goalTitle', ['help.goalBody'], 'goal'));
        grid.appendChild(section('help.orderTitle', ['help.rankOrder', 'help.suitOrder'], 'cards'));
        grid.appendChild(section('help.openingTitle', ['help.openingBody'], 'cards'));
        grid.appendChild(section('help.basicHandsTitle', ['help.singleBody', 'help.pairBody', 'help.tripleBody'], 'cards'));
        grid.appendChild(section('help.fiveHandsTitle', ['help.fiveHandsOrder', 'help.straight', 'help.flush', 'help.fullHouse', 'help.fourKind', 'help.straightFlush'], 'cards'));
        grid.appendChild(section('help.straightsTitle', ['help.straightsBody'], 'cards'));
        grid.appendChild(section('help.controlsTitle', ['help.controlsBody'], 'keyboard'));
        grid.appendChild(section('help.trickTitle', ['help.trickBody'], 'rule'));
        grid.appendChild(scoringSection());
        grid.appendChild(aiSection());
        grid.appendChild(section('help.saveTitle', ['help.saveBody'], 'save'));
        grid.appendChild(section('help.customizeTitle', ['help.customizeBody'], 'settings'));
        grid.appendChild(section('help.keyboardTitle', ['help.keyboardBody'], 'keyboard'));
        container.appendChild(header);
        container.appendChild(grid);
        container.appendChild(backButton(app));
      }
    };
  };
}(window));
