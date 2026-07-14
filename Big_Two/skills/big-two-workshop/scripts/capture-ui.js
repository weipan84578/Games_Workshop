#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const { pathToFileURL } = require('url');

function option(name, fallback) {
  const flag = '--' + name;
  const index = process.argv.indexOf(flag);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function fail(message) {
  throw new Error(message);
}

function inside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative));
}

function parseViewports(value) {
  return value.split(',').map((entry) => {
    const match = entry.trim().match(/^(\d+)x(\d+)$/i);
    if (!match) fail('Invalid viewport: ' + entry);
    const width = Number(match[1]);
    const height = Number(match[2]);
    if (width < 320 || height < 320) fail('Viewport is below the supported minimum: ' + entry);
    return { width, height, label: width + 'x' + height };
  });
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ].filter(Boolean);
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (found) return found;
  const command = process.platform === 'win32' ? 'where.exe' : 'which';
  const names = process.platform === 'win32' ? ['chrome.exe'] : ['google-chrome', 'chromium'];
  for (const name of names) {
    const result = spawnSync(command, [name], { encoding: 'utf8' });
    if (result.status === 0 && result.stdout.trim()) return result.stdout.trim().split(/\r?\n/)[0];
  }
  fail('Chrome was not found. Set CHROME_PATH and retry.');
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function readDebugPort(profile) {
  const file = path.join(profile, 'DevToolsActivePort');
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (fs.existsSync(file)) {
      const port = Number(fs.readFileSync(file, 'utf8').split(/\r?\n/)[0]);
      if (port) return port;
    }
    await delay(100);
  }
  fail('Chrome did not publish a debugging port.');
}

async function findPage(port) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const targets = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
      const page = targets.find((target) => target.type === 'page' && target.url.startsWith('file:'));
      if (page) return page;
    } catch (error) {
      // Chrome may still be starting.
    }
    await delay(100);
  }
  fail('No file:// page target became available.');
}

async function connect(url) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });
  let sequence = 0;
  const pending = new Map();
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const request = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
  };
  return {
    socket,
    send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = ++sequence;
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params }));
      });
    }
  };
}

async function evaluate(send, expression) {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (result.exceptionDetails) {
    fail(result.exceptionDetails.exception && result.exceptionDetails.exception.description || 'Page evaluation failed.');
  }
  return result.result && result.result.value;
}

async function waitForApp(send) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const ready = await evaluate(send,
      "document.readyState === 'complete' && !!(window.BigTwo && BigTwo.App) && !!document.querySelector('.home-menu')");
    if (ready) return;
    await delay(100);
  }
  fail('Big Two did not initialize.');
}

async function waitForHumanTurn(send) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const ready = await evaluate(send, `(() => {
      const state = BigTwo.App.getGameState();
      const player = state && state.players && state.players[state.currentPlayerIndex];
      return !BigTwo.App.isBusy() && (!player || player.id === 'human' || state.phase !== 'playing');
    })()`);
    if (ready) return;
    await delay(100);
  }
}

async function setViewport(send, viewport) {
  const mobile = viewport.width <= 767 || (viewport.width <= 900 && viewport.height <= 700);
  await send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    screenWidth: viewport.width,
    screenHeight: viewport.height,
    deviceScaleFactor: 1,
    mobile
  });
  await delay(150);
}

async function prepareScreen(send, screen, theme, tableDemo) {
  await evaluate(send, `BigTwo.App.updateSettings({ theme: ${JSON.stringify(theme)} })`);
  if (screen === 'home') {
    await evaluate(send, "BigTwo.App.navigate('home')");
  } else if (screen === 'settings') {
    await evaluate(send, "BigTwo.App.navigate('settings')");
  } else if (screen === 'help') {
    await evaluate(send, "BigTwo.App.navigate('help')");
  } else {
    await evaluate(send, 'BigTwo.App.startNewGame()');
    await waitForHumanTurn(send);
    if (tableDemo === 'diamonds') {
      await evaluate(send, `(() => {
        const zone = document.querySelector('.table-cards');
        if (!zone) return false;
        zone.replaceChildren();
        ['3', '4', '5', '6', '7'].forEach((rank) => {
          zone.appendChild(BigTwo.UI.CardRenderer.render({
            id: rank + '-diamonds', rank, suit: 'diamonds'
          }, { disabled: true, tabIndex: -1 }));
        });
        return true;
      })()`);
    }
    if (screen === 'dialog') {
      await evaluate(send, 'void BigTwo.App.confirmLeaveGame()');
      await delay(100);
    }
  }
}

async function main() {
  if (typeof WebSocket !== 'function' || typeof fetch !== 'function') {
    fail('Node.js 22 or newer is required.');
  }
  const root = path.resolve(option('root', process.cwd()));
  const output = path.resolve(root, option('output', '.visual-check'));
  const screen = option('screen', 'game');
  const theme = option('theme', 'realistic');
  const tableDemo = option('table-demo', '');
  const viewports = parseViewports(option('viewports', '1440x900,390x844,844x390'));
  const screens = ['home', 'settings', 'help', 'game', 'dialog'];
  const themes = ['realistic', 'midnight', 'sakura', 'cuteParty'];
  if (!screens.includes(screen)) fail('Unsupported screen: ' + screen);
  if (!themes.includes(theme)) fail('Unsupported theme: ' + theme);
  if (tableDemo && tableDemo !== 'diamonds') fail('Unsupported table demo: ' + tableDemo);
  if (!fs.existsSync(path.join(root, 'index.html'))) fail('index.html was not found under --root.');
  if (!inside(root, output)) fail('--output must remain inside --root.');

  fs.mkdirSync(output, { recursive: true });
  const profile = path.join(output, '.chrome-profile-' + process.pid);
  fs.mkdirSync(profile, { recursive: true });
  const chrome = spawn(findChrome(), [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run',
    '--no-default-browser-check', '--remote-allow-origins=*', '--allow-file-access-from-files',
    '--remote-debugging-port=0', '--user-data-dir=' + profile,
    pathToFileURL(path.join(root, 'index.html')).href
  ], { stdio: 'ignore' });
  chrome.unref();
  let connection;
  try {
    const port = await readDebugPort(profile);
    const page = await findPage(port);
    connection = await connect(page.webSocketDebuggerUrl);
    const send = connection.send;
    await send('Page.enable');
    await send('Runtime.enable');
    await setViewport(send, viewports[0]);
    await send('Page.reload', { ignoreCache: true });
    await waitForApp(send);
    await prepareScreen(send, screen, theme, tableDemo);
    for (const viewport of viewports) {
      await setViewport(send, viewport);
      if (screen === 'help') {
        await evaluate(send, `(() => {
          const level = document.querySelector('.help-ai-level');
          if (!level) return false;
          level.closest('.help-card').scrollIntoView({ block: 'center' });
          return true;
        })()`);
        await delay(100);
      }
      const capture = await send('Page.captureScreenshot', {
        format: 'png', fromSurface: true, captureBeyondViewport: false
      });
      const filename = screen + '-' + theme + '-' + viewport.label + '.png';
      fs.writeFileSync(path.join(output, filename), Buffer.from(capture.data, 'base64'));
      process.stdout.write(path.join(output, filename) + '\n');
    }
    await send('Browser.close');
    connection.socket.close();
    await delay(300);
  } finally {
    try { chrome.kill(); } catch (error) { /* already closed */ }
    if (connection) {
      try { connection.socket.close(); } catch (error) { /* already closed */ }
    }
    if (inside(output, profile)) {
      try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch (error) {
        process.stderr.write('Warning: could not remove Chrome profile: ' + profile + '\n');
      }
    }
  }
}

main().catch((error) => {
  process.stderr.write((error.stack || error.message || String(error)) + '\n');
  process.exitCode = 1;
});
