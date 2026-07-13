/* Run with PLAYWRIGHT_CORE pointing at a playwright-core installation. */
'use strict';
var fs=require('fs'),path=require('path'),url=require('url');
var playwright=require(process.env.PLAYWRIGHT_CORE||'playwright-core');
var root=path.resolve(__dirname,'..');
var artifactDir=path.join(__dirname,'.playwright-artifacts');
var chrome=process.env.CHROME_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
var captures=[];
function check(value,message){if(!value)throw new Error(message);}
function localUrl(file){return url.pathToFileURL(path.join(root,file)).href;}
async function capture(page,name){var file=path.join(artifactDir,name);await page.screenshot({path:file,fullPage:true});captures.push(file);}

(async function(){
  var browser,errors=[];
  fs.mkdirSync(artifactDir,{recursive:true});
  try{
    browser=await playwright.chromium.launch({headless:true,executablePath:chrome,args:['--autoplay-policy=no-user-gesture-required']});
    var desktop=await browser.newContext({viewport:{width:1180,height:900},deviceScaleFactor:1});
    var page=await desktop.newPage();
    page.on('pageerror',function(e){errors.push(e.message);});
    await page.goto(localUrl('index.html'));await page.waitForLoadState('load');
    await capture(page,'01-audio-gate.png');
    await page.locator('#enter-arcade-btn').click({force:true});await page.waitForTimeout(350);
    check(await page.evaluate(function(){return !!(window.BBApp&&BBApp.getAudio().timer&&BBApp.getAudio().mode==='menu');}),'Main-menu BGM did not start after the audio gate');
    await capture(page,'02-main-menu.png');
    await page.locator('#start-btn').click();await page.waitForTimeout(500);
    check(await page.evaluate(function(){return BBApp.getEngine().running&&BBApp.getAudio().mode==='game';}),'Game or high-tempo game BGM did not start');
    await capture(page,'03-arcade-game.png');
    var canvas=page.locator('#game-canvas'),box=await canvas.boundingBox();check(box,'Canvas is not visible');
    var sx=box.x+box.width*.5,sy=box.y+box.height*(920/1120),ey=box.y+box.height*(625/1120);
    await page.mouse.move(sx,sy);await page.mouse.down();await page.mouse.move(sx+12,ey,{steps:8});await page.mouse.up();await page.waitForTimeout(180);
    check(await page.evaluate(function(){var e=BBApp.getEngine();return e.ball.flying||e.ball.respawning;}),'Upward flick did not launch the ball');
    await page.evaluate(function(){BBApp.getEngine().pause(true);});await capture(page,'04-fast-flick.png');await page.evaluate(function(){var e=BBApp.getEngine();e.ball.x=e.hoopX;e.ball.y=BB.Constants.HOOP_Y-12;e.ball.previousY=e.ball.y;e.ball.vx=0;e.ball.vy=420;e.ball.flying=true;e.ball.scored=false;e.pause(false);});await page.waitForTimeout(100);
    check(await page.evaluate(function(){return BBApp.getEngine().score>=2;}),'Downward hoop crossing did not score');
    await page.goto(localUrl('tests/test-runner.html'));await page.waitForLoadState('load');
    await page.waitForFunction(function(){return document.querySelector('#summary').textContent.indexOf('passed')>0;});
    check((await page.locator('#summary').textContent()).trim()==='27/27 passed','Browser unit tests did not all pass');
    await capture(page,'05-unit-tests.png');
    await desktop.close();

    var mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
    var phone=await mobile.newPage();phone.on('pageerror',function(e){errors.push(e.message);});
    await phone.goto(localUrl('index.html'));await phone.locator('#enter-arcade-btn').tap({force:true});await phone.waitForTimeout(250);await phone.locator('#start-btn').tap({force:true});await phone.waitForTimeout(350);
    check(await phone.locator('#game-canvas').isVisible(),'Mobile arcade canvas is not visible');
    await phone.evaluate(function(){BBApp.getEngine().pause(true);});await capture(phone,'06-mobile-arcade.png');
    await mobile.close();
    check(errors.length===0,'Browser errors: '+errors.join(' | '));
    process.stdout.write('PLAYWRIGHT_OK: menu BGM, arcade game, flick shot, scoring, mobile layout, 27/27 browser tests\n');
    process.stdout.write('CAPTURES_VERIFIED: '+captures.length+'\n');
  }catch(error){process.stderr.write('PLAYWRIGHT_FAIL: '+error.stack+'\n');process.exitCode=1;}
  finally{
    if(browser)await browser.close();
    if(process.env.KEEP_CAPTURES==='1')process.stdout.write('CAPTURES_RETAINED_FOR_INSPECTION: '+captures.length+'\n');
    else{
      if(fs.existsSync(artifactDir)){
        fs.readdirSync(artifactDir).forEach(function(file){fs.rmSync(path.join(artifactDir,file),{force:true});});
        fs.rmSync(artifactDir,{recursive:true,force:true});
      }
      if(fs.existsSync(artifactDir))throw new Error('Playwright screenshot cleanup verification failed');
      process.stdout.write('CAPTURES_DELETED: '+captures.length+'\n');
    }
  }
})();
