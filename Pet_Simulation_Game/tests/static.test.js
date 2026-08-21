'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let passed = 0;
function check(name, fn) {
  try {
    fn();
    passed += 1;
    process.stdout.write(`✓ ${name}\n`);
  } catch (error) {
    process.stderr.write(`✗ ${name}\n${error.stack}\n`);
    process.exitCode = 1;
  }
}

check('viewport includes width, scale, and safe-area cover', () => {
  assert.match(index, /width=device-width, initial-scale=1, viewport-fit=cover/);
});

check('the application uses classic scripts and app.js is last', () => {
  assert.doesNotMatch(index, /<script[^>]+type=["']module/i);
  const scripts = [...index.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(scripts.at(-1), 'js/core/app.js');
});

check('every local stylesheet, script, image, and favicon referenced by index exists', () => {
  const refs = [...index.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((ref) => !ref.startsWith('#'));
  refs.forEach((ref) => assert.ok(fs.existsSync(path.join(root, ref)), `missing ${ref}`));
});

check('production JavaScript has no fetch, dynamic import, or remote URL dependency', () => {
  const files = walk(path.join(root, 'js')).filter((file) => file.endsWith('.js'));
  const source = files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(source, /\bimport\s*\(/);
  assert.doesNotMatch(source, /https?:\/\//);
});

check('all index asset paths are relative and offline-safe', () => {
  const refs = [...index.matchAll(/(?:src|href)="([^"]+)"/g)].map((match) => match[1]);
  refs.forEach((ref) => assert.ok(!/^(?:https?:)?\/\//.test(ref), `remote reference ${ref}`));
});

check('responsive CSS declares mobile, tablet, desktop, and landscape modes', () => {
  assert.match(fs.readFileSync(path.join(root, 'css/responsive/mobile.css'), 'utf8'), /max-width:\s*575px/);
  assert.match(fs.readFileSync(path.join(root, 'css/responsive/tablet.css'), 'utf8'), /min-width:\s*576px/);
  assert.match(fs.readFileSync(path.join(root, 'css/responsive/desktop.css'), 'utf8'), /min-width:\s*1024px/);
  assert.match(fs.readFileSync(path.join(root, 'css/responsive/landscape.css'), 'utf8'), /orientation:\s*landscape/);
});

check('five complete theme files are present', () => {
  ['candy', 'ocean', 'forest', 'sunset', 'night'].forEach((theme) => {
    const source = fs.readFileSync(path.join(root, `css/themes/theme-${theme}.css`), 'utf8');
    [
      '--background',
      '--surface',
      '--text',
      '--text-muted',
      '--border',
      '--primary',
      '--secondary',
      '--success',
      '--warning',
      '--danger',
      '--focus',
      '--shadow'
    ].forEach((token) => assert.ok(source.includes(token), `${theme} missing ${token}`));
  });
});

check('core controls meet the 48px touch target minimum', () => {
  const source = fs.readFileSync(path.join(root, 'css/components/buttons.css'), 'utf8');
  assert.match(source, /min-height:\s*52px/);
  assert.match(source, /min-height:\s*48px/);
});

check('all three generated pet portraits are local and non-empty', () => {
  ['eagle', 'lion', 'crocodile'].forEach((species) =>
    assert.ok(fs.statSync(path.join(root, `assets/images/pets/${species}/portrait.png`)).size > 100000)
  );
});

check('all 54 item icons and three outing backdrops are local', () => {
  assert.equal(
    fs.readdirSync(path.join(root, 'assets/images/equipment')).filter((name) => name.endsWith('.svg')).length,
    54
  );
  ['park', 'forest', 'river'].forEach((name) =>
    assert.ok(fs.statSync(path.join(root, `assets/images/backgrounds/${name}.svg`)).size > 400)
  );
});

check('ability candy modules load in dependency-safe order', () => {
  const scripts = [...index.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(scripts.indexOf('js/data/abilityCandyData.js') > scripts.indexOf('js/data/speciesData.js'));
  assert.ok(scripts.indexOf('js/economy/abilityCandyManager.js') > scripts.indexOf('js/pet/statCalculator.js'));
  assert.ok(scripts.indexOf('js/ui/shopUI.js') > scripts.indexOf('js/economy/abilityCandyManager.js'));
});

check('shop tiers and training effects include responsive and reduced-motion hooks', () => {
  const shop = fs.readFileSync(path.join(root, 'css/components/shop.css'), 'utf8');
  const training = fs.readFileSync(path.join(root, 'css/components/training-effects.css'), 'utf8');
  assert.match(shop, /shop-stage-nav/);
  assert.match(shop, /candy-card/);
  assert.match(shop, /@media \(max-width: 760px\)/);
  assert.match(training, /training-feedback/);
  assert.match(training, /training-confetti/);
  assert.match(training, /\[data-motion\s*=\s*["']reduced["']\]/);
});

check('save slots, save-menu exits, persistent battle speed, and auto battle hooks exist', () => {
  const constants = fs.readFileSync(path.join(root, 'js/core/constants.js'), 'utf8');
  const saveManager = fs.readFileSync(path.join(root, 'js/storage/saveManager.js'), 'utf8');
  const menu = fs.readFileSync(path.join(root, 'js/ui/mainMenuUI.js'), 'utf8');
  const common = fs.readFileSync(path.join(root, 'js/ui/commonUI.js'), 'utf8');
  const battle = fs.readFileSync(path.join(root, 'js/ui/battleUI.js'), 'utf8');
  assert.match(constants, /SAVE_SLOT_COUNT:\s*3/);
  assert.match(saveManager, /function list\(\)/);
  assert.match(menu, /data-slot-continue/);
  assert.match(common, /data-action="save-menu"/);
  assert.match(battle, /id="fast-battle"/);
  assert.match(battle, /battleFast/);
  assert.match(battle, /id="auto-battle"/);
  assert.match(battle, /energy >= 100 \? 'special' : 'normal'/);
  assert.match(battle, /var exiting = false/);
  assert.match(battle, /if \(exiting\) return;/);
  assert.doesNotMatch(battle, /function next\(\) \{\s*if \(stopped\) return;/);
});

check('savings account is loaded, repaired, and connected to rest settlement', () => {
  const scripts = [...index.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  const bank = fs.readFileSync(path.join(root, 'js/economy/bankManager.js'), 'utf8');
  const daily = fs.readFileSync(path.join(root, 'js/pet/dailyActions.js'), 'utf8');
  const saveManager = fs.readFileSync(path.join(root, 'js/storage/saveManager.js'), 'utf8');
  const home = fs.readFileSync(path.join(root, 'js/ui/homeUI.js'), 'utf8');
  const locales = fs.readFileSync(path.join(root, 'js/i18n/featureLocales.js'), 'utf8');
  assert.ok(scripts.indexOf('js/economy/bankManager.js') < scripts.indexOf('js/pet/dailyActions.js'));
  assert.match(bank, /INTEREST_RATE\s*=\s*0\.01/);
  assert.match(bank, /save\.player\.coins[\s\S]*\+ interest/);
  assert.match(bank, /account\.balance = principal/);
  assert.match(bank, /function deposit\(save, value\)/);
  assert.match(bank, /function withdraw\(save, value\)/);
  assert.match(daily, /PSG\.economy\.bank\.settleInterest\(save\)/);
  assert.match(saveManager, /savings:\s*\{ balance: 0 \}/);
  assert.match(home, /data-savings-action="deposit"/);
  assert.match(home, /data-savings-action="withdraw"/);
  assert.match(locales, /bank\.title/);
});

check('toast opacity and candy pricing presentation match the requested features', () => {
  const toast = fs.readFileSync(path.join(root, 'css/components/toasts.css'), 'utf8');
  const candy = fs.readFileSync(path.join(root, 'js/economy/abilityCandyManager.js'), 'utf8');
  const locales = fs.readFileSync(path.join(root, 'js/i18n/featureLocales.js'), 'utf8');
  assert.match(toast, /\.toast\s*\{[\s\S]*opacity:\s*0?\.5;/);
  assert.match(toast, /\.toast:nth-last-child\(1\)[\s\S]*opacity:\s*0?\.5;/);
  assert.match(candy, /REGULAR_CANDY_PRICE_FACTOR\s*=\s*0?\.6/);
  assert.match(candy, /FESTIVAL_PRICE_FACTOR\s*=\s*0?\.5/);
  assert.match(candy, /function isCandyFestival\(save\)/);
  assert.match(locales, /Candy Festival/);
});

check('Candy Festival messaging and daily coin boost are wired into the UI and economy', () => {
  const home = fs.readFileSync(path.join(root, 'js/ui/homeUI.js'), 'utf8');
  const shop = fs.readFileSync(path.join(root, 'js/ui/shopUI.js'), 'utf8');
  const festivalCss = fs.readFileSync(path.join(root, 'css/components/candy-festival.css'), 'utf8');
  const daily = fs.readFileSync(path.join(root, 'js/pet/dailyActions.js'), 'utf8');
  assert.doesNotMatch(home, /candy-festival-alert/);
  assert.match(home, /pet-stage__bubble--festival/);
  assert.match(home, /talkKey = candyFestival \? 'shop\.candyFestivalTitle' : PSG\.pet\.model\.talkKey\(save, state\)/);
  assert.doesNotMatch(festivalCss, /candy-festival-alert/);
  assert.match(festivalCss, /pet-stage__bubble--festival/);
  assert.match(shop, /candy-festival-shop-banner/);
  assert.match(daily, /DAILY_COIN_MULTIPLIER\s*=\s*4/);
});

check('toast notifications overlap in one fixed bottom-right slot', () => {
  const toast = fs.readFileSync(path.join(root, 'css/components/toasts.css'), 'utf8');
  assert.match(toast, /position:\s*fixed/);
  assert.match(toast, /grid-area:\s*1\s*\/\s*1/);
  assert.match(toast, /\.toast \+ \.toast/);
  assert.match(toast, /height:\s*4\.4rem/);
});

check('the project README is complete, trilingual, local, and internally linked', () => {
  const readmePath = path.join(root, 'README.md');
  assert.ok(fs.existsSync(readmePath));
  const readme = fs.readFileSync(readmePath, 'utf8');
  const english = readme.indexOf('<a id="english"></a>');
  const japanese = readme.indexOf('<a id="japanese"></a>');
  const traditionalChinese = readme.indexOf('<a id="traditional-chinese"></a>');
  assert.ok(english >= 0 && english < japanese && japanese < traditionalChinese);
  ['en', 'ja', 'zh'].forEach((language) => {
    [
      'game-introduction',
      'features',
      'gameplay',
      'quick-start',
      'program-overview',
      'code-organization',
      'supporting-systems',
      'testing',
      'status'
    ].forEach((section) => {
      assert.ok(readme.includes(`<a id="${language}-${section}"></a>`), `README missing ${language}-${section}`);
    });
  });
  const ids = new Set([...readme.matchAll(/<a id="([^"]+)"><\/a>/g)].map((match) => match[1]));
  [...readme.matchAll(/\]\(#([^)]+)\)/g)].forEach((match) =>
    assert.ok(ids.has(match[1]), `README link missing #${match[1]}`)
  );
  [...readme.matchAll(/<img[^>]+src="([^"]+)"/g)].forEach((match) =>
    assert.ok(fs.existsSync(path.join(root, match[1])), `README image missing ${match[1]}`)
  );
  assert.equal(readme.trimEnd().split(/\r?\n/).at(-1), '[⬆️ Back to top](#top)');
});

check('source files contain no trailing whitespace', () => {
  walk(root)
    .filter((file) => /\.(?:html|css|js|svg)$/i.test(file))
    .forEach((file) => {
      const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
      lines.forEach((line, index) => assert.doesNotMatch(line, /[ \t]+$/, `${path.relative(root, file)}:${index + 1}`));
    });
});

function walk(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]
    );
}

process.stdout.write(`\n${passed}/19 static checks passed.\n`);
