(function (global) {
  'use strict';
  var BigTwo = global.BigTwo = global.BigTwo || {};
  BigTwo.Screens = BigTwo.Screens || {};

  function t(key, values) { return BigTwo.I18n ? BigTwo.I18n.t(key, values) : key; }

  function makeButton(label, className, action) {
    var button = global.document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = label;
    button.addEventListener('click', action);
    return button;
  }

  BigTwo.Screens.createHomeScreen = function (app) {
    return {
      render: function (container) {
        var hero = global.document.createElement('div');
        var decoration = global.document.createElement('div');
        var title = global.document.createElement('h1');
        var subtitle = global.document.createElement('p');
        var nav = global.document.createElement('nav');
        var start;
        var resume;
        var help;
        var settings;
        var resumeMeta = global.document.createElement('p');
        var version = global.document.createElement('p');
        var info = app.getContinueInfo ? app.getContinueInfo() : { status: 'empty' };
        var config = BigTwo.Config || {};
        hero.className = 'home-hero';
        decoration.className = 'home-decoration';
        decoration.setAttribute('aria-hidden', 'true');
        decoration.textContent = '♣  ♦  ♥  ♠';
        title.id = 'screen-home-title';
        title.className = 'home-title';
        title.setAttribute('data-screen-heading', '');
        title.textContent = t('app.title');
        subtitle.className = 'home-subtitle';
        subtitle.textContent = t('app.subtitle');
        nav.className = 'home-menu';
        nav.setAttribute('aria-label', t('aria.mainMenu'));
        start = makeButton(t('home.start'), 'button button--primary button--large home-menu__primary', function () {
          app.startNewGame();
        });
        resume = makeButton(t('home.continue'), 'button button--secondary button--large', function () {
          app.continueGame();
        });
        resume.disabled = info.status !== 'ok';
        resume.setAttribute('aria-describedby', 'continue-game-meta');
        help = makeButton(t('home.help'), 'button button--secondary button--large', function () {
          app.navigate('help');
        });
        settings = makeButton(t('home.settings'), 'button button--secondary button--large', function () {
          app.navigate('settings');
        });
        resumeMeta.id = 'continue-game-meta';
        resumeMeta.className = 'home-continue-meta';
        resumeMeta.textContent = info.status === 'ok' ? t('home.continueMeta', {
          round: info.round || 1,
          date: BigTwo.I18n ? BigTwo.I18n.formatDate(info.savedAt) : info.savedAt
        }) : t('home.continueEmpty');
        version.className = 'home-version';
        version.textContent = t('app.version', { version: config.APP_VERSION || config.VERSION || '1.0.0' });
        nav.appendChild(start);
        nav.appendChild(resume);
        nav.appendChild(resumeMeta);
        nav.appendChild(help);
        nav.appendChild(settings);
        hero.appendChild(decoration);
        hero.appendChild(title);
        hero.appendChild(subtitle);
        hero.appendChild(nav);
        hero.appendChild(version);
        container.appendChild(hero);
      }
    };
  };
}(window));
