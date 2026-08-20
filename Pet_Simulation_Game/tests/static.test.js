'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let passed = 0;
function check(name, fn) {
  try { fn(); passed += 1; process.stdout.write(`✓ ${name}\n`); }
  catch (error) { process.stderr.write(`✗ ${name}\n${error.stack}\n`); process.exitCode = 1; }
}

check('viewport includes width, scale, and safe-area cover', () => {
  assert.match(index, /width=device-width, initial-scale=1, viewport-fit=cover/);
});

check('the application uses classic scripts and app.js is last', () => {
  assert.doesNotMatch(index, /<script[^>]+type=["']module/i);
  const scripts = [...index.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match => match[1]);
  assert.equal(scripts.at(-1), 'js/core/app.js');
});

check('every local stylesheet, script, image, and favicon referenced by index exists', () => {
  const refs = [...index.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]).filter(ref => !ref.startsWith('#'));
  refs.forEach(ref => assert.ok(fs.existsSync(path.join(root, ref)), `missing ${ref}`));
});

check('production JavaScript has no fetch, dynamic import, or remote URL dependency', () => {
  const files = walk(path.join(root, 'js')).filter(file => file.endsWith('.js'));
  const source = files.map(file => fs.readFileSync(file, 'utf8')).join('\n');
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(source, /\bimport\s*\(/);
  assert.doesNotMatch(source, /https?:\/\//);
});

check('all index asset paths are relative and offline-safe', () => {
  const refs = [...index.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]);
  refs.forEach(ref => assert.ok(!/^(?:https?:)?\/\//.test(ref), `remote reference ${ref}`));
});

check('responsive CSS declares mobile, tablet, desktop, and landscape modes', () => {
  assert.match(fs.readFileSync(path.join(root, 'css/responsive/mobile.css'), 'utf8'), /max-width:575px/);
  assert.match(fs.readFileSync(path.join(root, 'css/responsive/tablet.css'), 'utf8'), /min-width:576px/);
  assert.match(fs.readFileSync(path.join(root, 'css/responsive/desktop.css'), 'utf8'), /min-width:1024px/);
  assert.match(fs.readFileSync(path.join(root, 'css/responsive/landscape.css'), 'utf8'), /orientation:landscape/);
});

check('five complete theme files are present', () => {
  ['candy','ocean','forest','sunset','night'].forEach(theme => {
    const source = fs.readFileSync(path.join(root, `css/themes/theme-${theme}.css`), 'utf8');
    ['--background','--surface','--text','--text-muted','--border','--primary','--secondary','--success','--warning','--danger','--focus','--shadow'].forEach(token => assert.ok(source.includes(token), `${theme} missing ${token}`));
  });
});

check('core controls meet the 48px touch target minimum', () => {
  const source = fs.readFileSync(path.join(root, 'css/components/buttons.css'), 'utf8');
  assert.match(source, /min-height:52px/);
  assert.match(source, /min-height:48px/);
});

check('all three generated pet portraits are local and non-empty', () => {
  ['eagle','lion','crocodile'].forEach(species => assert.ok(fs.statSync(path.join(root, `assets/images/pets/${species}/portrait.png`)).size > 100000));
});

check('all 54 item icons and three outing backdrops are local', () => {
  assert.equal(fs.readdirSync(path.join(root, 'assets/images/equipment')).filter(name => name.endsWith('.svg')).length, 54);
  ['park','forest','river'].forEach(name => assert.ok(fs.statSync(path.join(root, `assets/images/backgrounds/${name}.svg`)).size > 400));
});

check('the project contains no forbidden README', () => {
  assert.equal(walk(root).some(file => /^readme\.md$/i.test(path.basename(file))), false);
});

check('source files contain no trailing whitespace', () => {
  walk(root).filter(file => /\.(?:html|css|js|svg)$/i.test(file)).forEach(file => {
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => assert.doesNotMatch(line, /[ \t]+$/, `${path.relative(root, file)}:${index + 1}`));
  });
});

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}

process.stdout.write(`\n${passed}/12 static checks passed.\n`);
