/* Run with PLAYWRIGHT_CORE pointing at a playwright-core installation. */
'use strict';
var fs=require('fs'),path=require('path'),url=require('url'),os=require('os');
var playwright=require(process.env.PLAYWRIGHT_CORE||'playwright-core');
var root=path.resolve(__dirname,'..');
var artifactDir=path.join(os.tmpdir(),'basketball-shoot-playwright-'+process.pid);
var chrome=process.env.CHROME_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
var captures=[];

function check(value,message){if(!value)throw new Error(message);}
function localUrl(file){return url.pathToFileURL(path.join(root,file)).href;}
async function capture(page,name,fullPage){var file=path.join(artifactDir,name);await page.screenshot({path:file,fullPage:fullPage!==false});captures.push(file);}
async function assertResponsive(page,label){
  var metrics=await page.evaluate(function(){var canvas=document.querySelector('#game-canvas'),r=canvas.getBoundingClientRect(),strip=document.querySelector('#control-strip').getBoundingClientRect();return{scrollWidth:document.documentElement.scrollWidth,innerWidth:innerWidth,canvasWidth:r.width,canvasHeight:r.height,canvasLeft:r.left,canvasRight:r.right,canvasBottom:r.bottom,innerHeight:innerHeight,controlLeft:strip.left,controlTop:strip.top};});
  check(metrics.scrollWidth<=metrics.innerWidth+2,label+' has horizontal overflow');
  check(metrics.canvasWidth>0&&metrics.canvasHeight>0,label+' canvas is not visible');
  var ratio=metrics.canvasWidth/metrics.canvasHeight;check(ratio>.76&&ratio<.85,label+' canvas aspect ratio is distorted: '+ratio);
  var expectedCenter=metrics.controlLeft>=metrics.canvasRight?metrics.controlLeft/2:metrics.innerWidth/2;
  check(Math.abs((metrics.canvasLeft+metrics.canvasRight)/2-expectedCenter)<3,label+' canvas is not centered in the playable area');
}
async function flickRackBall(page){
  var canvas=page.locator('#game-canvas'),box=await canvas.boundingBox();check(box,'Canvas is not visible');
  var ball=await page.evaluate(function(){var e=BBApp.getEngine(),b=e.balls.filter(function(item){return item.state==='rack';})[0];return b&&{x:b.x,y:b.y};});check(ball,'No rack ball is available');
  var sx=box.x+box.width*(ball.x/900),sy=box.y+box.height*(ball.y/1120),ey=box.y+box.height*(620/1120);
  await page.mouse.move(sx,sy);await page.mouse.down();await page.mouse.move(sx+8,ey,{steps:8});await page.mouse.up();
}

(async function(){
  var browser,errors=[];fs.mkdirSync(artifactDir,{recursive:true});
  try{
    browser=await playwright.chromium.launch({headless:true,executablePath:chrome,args:['--autoplay-policy=no-user-gesture-required']});
    var desktop=await browser.newContext({viewport:{width:1180,height:900},deviceScaleFactor:1});
    var page=await desktop.newPage();page.on('pageerror',function(e){errors.push(e.message);});
    await page.goto(localUrl('index.html'));await page.waitForLoadState('load');await capture(page,'01-audio-gate.png');
    await page.locator('#enter-arcade-btn').click({force:true});await page.waitForTimeout(300);
    check(await page.evaluate(function(){return !!(window.BBApp&&BBApp.getAudio().timer&&BBApp.getAudio().mode==='menu');}),'Main-menu BGM did not start');
    await page.evaluate(function(){BB.Leaderboard.clear();BB.Leaderboard.add({name:'ACE',score:88,combo:9,date:new Date().toISOString()});});await page.locator('#leaderboard-btn').click();check(await page.locator('#leaderboard-modal').isVisible(),'Leaderboard entry is not accessible');check((await page.locator('#leaderboard-view').textContent()).indexOf('ACE')>=0,'Leaderboard rows are not rendered');await page.waitForTimeout(250);await capture(page,'02-leaderboard.png',false);await page.locator('#leaderboard-modal .modal-close').click();
    await capture(page,'03-main-menu.png');
    await page.locator('#start-btn').click();await page.waitForTimeout(350);
    check(await page.evaluate(function(){var e=BBApp.getEngine(),opening=BB.Constants.HOOP_WIDTH-2*(BB.Constants.BALL_RADIUS+BB.Constants.RIM_COLLISION_RADIUS);return e.running&&BBApp.getAudio().mode==='game'&&e.balls.length===5&&e.balls.every(function(b){return b.state==='rack';})&&opening>=95;}),'Five-ball game or forgiving hoop opening did not initialize');
    await page.evaluate(function(){BBApp.getEngine().pause(true);});await capture(page,'04-five-ball-machine.png');await page.evaluate(function(){var e=BBApp.getEngine();e.stageFlash=0;e.pause(false);});
    await flickRackBall(page);await page.waitForTimeout(90);await flickRackBall(page);await page.waitForTimeout(120);
    check(await page.evaluate(function(){var e=BBApp.getEngine(),busy=e.balls.filter(function(b){return b.state==='flying'||b.state==='returning';}).length;return busy>=2&&e.balls.length===5;}),'Two balls could not fly independently');
    await page.evaluate(function(){BBApp.getEngine().pause(true);});await capture(page,'05-multi-ball-flight.png');
    var returnStates=await page.evaluate(function(){var e=BBApp.getEngine();e.balls.forEach(function(ball){e.returnToRack(ball);});var b=e.balls[4];e.beginReturn(b,true);e.updateReturningBall(b,.55);var mid=b.state;e.updateReturningBall(b,1.2);return{mid:mid,end:b.state};});
    check(returnStates.mid==='returning'&&returnStates.end==='rack','Slow ball-return cycle did not complete correctly');
    var scored=await page.evaluate(function(){var e=BBApp.getEngine();e.balls.forEach(function(ball){e.returnToRack(ball);});var b=e.balls[0];b.state='flying';b.x=e.hoopX;b.y=BB.Constants.HOOP_Y-12;b.previousY=b.y;b.vx=0;b.vy=420;b.scored=false;b.touchedRim=false;e.updateFlyingBall(b,.04);return e.score;});
    check(scored>=2,'Downward hoop crossing did not score');
    var doubleGain=await page.evaluate(function(){var e=BBApp.getEngine(),before=e.score;e.time=9;e.balls.forEach(function(ball){e.returnToRack(ball);});var b=e.balls[1];b.state='flying';b.x=e.hoopX;b.y=BB.Constants.HOOP_Y-12;b.previousY=b.y;b.vx=0;b.vy=420;b.scored=false;b.touchedRim=false;e.updateFlyingBall(b,.04);return e.score-before;});
    check(doubleGain>=4,'Final-ten-second double scoring failed');
    check(await page.evaluate(function(){var e=BBApp.getEngine(),b=e.balls[2];e.returnToRack(b);b.state='flying';b.x=62+b.radius-2;b.y=700;b.vx=-500;b.vy=0;e.updateFlyingBall(b,.02);return b.vx>0;}),'Side-cage boundary did not rebound the ball');
    await page.evaluate(function(){var e=BBApp.getEngine();e.score=12;e.time=0;e.handleStageEnd();e.stageFlash=0;e.pause(false);});
    check(await page.evaluate(function(){return BBApp.getEngine().level===2;}),'Stage one did not advance after target score');
    var hoopBefore=await page.evaluate(function(){return BBApp.getEngine().hoopX;});await page.waitForTimeout(320);
    check(Math.abs((await page.evaluate(function(){return BBApp.getEngine().hoopX;}))-hoopBefore)>5,'Stage two hoop is not moving');
    await page.evaluate(function(){var e=BBApp.getEngine();e.pause(true);e.score=30;e.time=0;e.handleStageEnd();});
    check(await page.evaluate(function(){return BBApp.getEngine().level===3&&BB.Constants.LEVELS[2].hoopSpeed>BB.Constants.LEVELS[1].hoopSpeed;}),'Stage three speed progression failed');
    await assertResponsive(page,'desktop');
    await page.goto(localUrl('tests/test-runner.html'));await page.waitForFunction(function(){return document.querySelector('#summary').textContent.indexOf('passed')>0;});
    check((await page.locator('#summary').textContent()).trim()==='34/34 passed','Browser unit tests did not all pass');await capture(page,'06-unit-tests.png');await desktop.close();

    var phoneContext=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
    var phone=await phoneContext.newPage();phone.on('pageerror',function(e){errors.push(e.message);});await phone.goto(localUrl('index.html'));await phone.locator('#enter-arcade-btn').tap({force:true});await phone.locator('#start-btn').tap({force:true});await phone.waitForTimeout(250);await assertResponsive(phone,'mobile portrait');await phone.evaluate(function(){BBApp.getEngine().pause(true);});await capture(phone,'07-mobile-portrait.png');await phoneContext.close();

    var landscapeContext=await browser.newContext({viewport:{width:844,height:390},deviceScaleFactor:1,isMobile:true,hasTouch:true});
    var landscape=await landscapeContext.newPage();landscape.on('pageerror',function(e){errors.push(e.message);});await landscape.goto(localUrl('index.html'));await landscape.locator('#enter-arcade-btn').tap({force:true});await landscape.locator('#start-btn').tap({force:true});await landscape.waitForTimeout(250);await assertResponsive(landscape,'mobile landscape');await landscape.evaluate(function(){BBApp.getEngine().pause(true);});await capture(landscape,'08-mobile-landscape.png');await landscapeContext.close();

    var tabletContext=await browser.newContext({viewport:{width:820,height:1180},deviceScaleFactor:1,isMobile:true,hasTouch:true});
    var tablet=await tabletContext.newPage();tablet.on('pageerror',function(e){errors.push(e.message);});await tablet.goto(localUrl('index.html'));await tablet.locator('#enter-arcade-btn').tap({force:true});await tablet.locator('#start-btn').tap({force:true});await tablet.waitForTimeout(250);await assertResponsive(tablet,'tablet portrait');await tablet.evaluate(function(){BBApp.getEngine().pause(true);});await capture(tablet,'09-tablet-portrait.png');await tabletContext.close();

    check(errors.length===0,'Browser errors: '+errors.join(' | '));
    process.stdout.write('PLAYWRIGHT_OK: forgiving hoop, five balls, slow return, leaderboard, rim/wall physics, double time, 3 stages, RWD, 34/34 tests\n');
    process.stdout.write('CAPTURES_VERIFIED: '+captures.length+'\n');
  }catch(error){process.stderr.write('PLAYWRIGHT_FAIL: '+error.stack+'\n');process.exitCode=1;}
  finally{
    if(browser)await browser.close();
    if(process.env.KEEP_CAPTURES==='1')process.stdout.write('CAPTURES_RETAINED_FOR_INSPECTION: '+captures.length+'\n');
    else{
      if(fs.existsSync(artifactDir)){
        fs.readdirSync(artifactDir).forEach(function(file){fs.rmSync(path.join(artifactDir,file),{force:true});});
        try{fs.rmSync(artifactDir,{recursive:true,force:true});}catch(ignore){}
      }
      var remainingImages=fs.existsSync(artifactDir)?fs.readdirSync(artifactDir).filter(function(file){return /\.(png|jpe?g)$/i.test(file);}):[];
      if(remainingImages.length)throw new Error('Playwright screenshot cleanup verification failed: '+remainingImages.join(', '));
      process.stdout.write('CAPTURES_DELETED: '+captures.length+'\n');
    }
  }
})();
