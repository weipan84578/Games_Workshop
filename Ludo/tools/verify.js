'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CHECK_ROOTS = ['js', 'tests', 'tools'];
const TESTS = [
  'tests/rules.test.js',
  'tests/turn-resume.test.js',
  'tests/main-smoke.test.js'
];

function walk(dir, out) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, out);
    else if (entry.isFile() && entry.name.endsWith('.js')) out.push(fullPath);
  });
  return out;
}

function rel(file) {
  return path.relative(ROOT, file);
}

function runNode(args) {
  execFileSync(process.execPath, args, { cwd: ROOT, stdio: 'inherit' });
}

const files = CHECK_ROOTS.flatMap((dir) => walk(path.join(ROOT, dir), []));

files.forEach((file) => runNode(['--check', file]));
console.log(`Syntax check passed (${files.length} files)`);

TESTS.forEach((file) => {
  console.log(`Running ${file}`);
  runNode([path.join(ROOT, file)]);
});

console.log('Verification passed');
