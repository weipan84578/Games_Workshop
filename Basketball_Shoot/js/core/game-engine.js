(function(BB){
'use strict';
var C=BB.Constants;

function GameEngine(canvas,options){
  this.canvas=canvas;
  this.ctx=canvas.getContext('2d');
  this.options=options||{};
  this.running=false;
  this.paused=false;
  this.score=0;
  this.combo=0;
  this.bestCombo=0;
  this.time=C.GAME_TIME;
  this.last=0;
  this.elapsed=0;
  this.drag=null;
  this.netBounce=0;
  this.rimFlash=0;
  this.shake=0;
  this.respawnTimer=0;
  this.particles=[];
  this.hoopX=C.HOOP_X;
  this.ball=this.newBall();
  this.controls=new BB.TouchControls(canvas,{
    getBall:function(){return this.ball;}.bind(this),
    onDrag:function(s,p){this.drag={start:s,current:p};}.bind(this),
    onRelease:this.shoot.bind(this)
  });
  this.loop=this.loop.bind(this);
}

GameEngine.prototype.newBall=function(){
  return{x:C.BALL_START_X,y:C.BALL_START_Y,vx:0,vy:0,radius:C.BALL_RADIUS,rotation:0,flying:false,scored:false,touchedRim:false,previousY:C.BALL_START_Y,respawning:false};
};

GameEngine.prototype.start=function(saved){
  this.score=saved&&saved.score||0;
  this.combo=saved&&saved.combo||0;
  this.bestCombo=saved&&saved.bestCombo||this.combo;
  this.time=saved&&Number(saved.time)||C.GAME_TIME;
  this.elapsed=0;
  this.hoopX=C.HOOP_X;
  this.ball=this.newBall();
  this.drag=null;
  this.particles=[];
  this.respawnTimer=0;
  this.running=true;
  this.paused=false;
  this.last=performance.now();
  requestAnimationFrame(this.loop);
  this.emit();
};

GameEngine.prototype.pause=function(value){this.paused=value;if(!value&&this.running){this.last=performance.now();requestAnimationFrame(this.loop);}};
GameEngine.prototype.stop=function(){this.running=false;};
GameEngine.prototype.snapshot=function(){return{score:this.score,combo:this.combo,bestCombo:this.bestCombo,time:Math.max(0,this.time)};};

GameEngine.prototype.shoot=function(shot){
  this.drag=null;
  if(!this.running||this.paused||this.ball.flying||this.ball.respawning||shot.power<50)return;
  this.ball.vx=shot.x;
  this.ball.vy=shot.y;
  this.ball.flying=true;
  this.ball.rotation=-.35;
  this.shake=.12;
  if(this.options.onSound)this.options.onSound('shoot');
};

GameEngine.prototype.loop=function(now){
  if(!this.running||this.paused)return;
  var dt=Math.min((now-this.last)/1000,.03);
  this.last=now;
  this.elapsed+=dt;
  this.time=Math.max(0,this.time-dt);
  this.hoopX=this.time<=15?C.HOOP_X+Math.sin(this.elapsed*1.85)*125:C.HOOP_X;
  if(this.ball.flying)this.updateBall(dt);
  if(this.respawnTimer>0){this.respawnTimer-=dt;if(this.respawnTimer<=0){this.ball=this.newBall();this.respawnTimer=0;}}
  this.updateParticles(dt);
  this.netBounce*=Math.pow(.018,dt);
  this.rimFlash=Math.max(0,this.rimFlash-dt*3.6);
  this.shake=Math.max(0,this.shake-dt);
  this.draw();
  this.emit();
  if(this.time<=0){this.running=false;if(this.options.onEnd)this.options.onEnd(this.snapshot());return;}
  requestAnimationFrame(this.loop);
};

GameEngine.prototype.emit=function(){if(this.options.onUpdate)this.options.onUpdate(this.snapshot());};

GameEngine.prototype.updateBall=function(dt){
  var b=this.ball,hx=this.hoopX,hy=C.HOOP_Y;
  b.previousY=b.y;
  BB.Physics.step(b,dt);
  var left={x:hx-C.HOOP_WIDTH/2,y:hy},right={x:hx+C.HOOP_WIDTH/2,y:hy};
  if(BB.Physics.circleCollision(b,left,14)||BB.Physics.circleCollision(b,right,14)){
    b.touchedRim=true;this.rimFlash=1;this.shake=.16;
    if(this.options.onSound)this.options.onSound('rim');
  }
  var boardLeft=hx-185,boardRight=hx+185;
  if(b.y>hy-210&&b.y<hy-32){
    if(b.x+b.radius>boardRight&&b.previousY<hy&&b.vx>0){b.x=boardRight-b.radius;b.vx=-Math.abs(b.vx)*.72;b.touchedRim=true;}
    if(b.x-b.radius<boardLeft&&b.previousY<hy&&b.vx<0){b.x=boardLeft+b.radius;b.vx=Math.abs(b.vx)*.72;b.touchedRim=true;}
  }
  var crossed=b.previousY<hy&&b.y>=hy&&b.vy>0&&b.x>left.x+18&&b.x<right.x-18;
  if(crossed&&!b.scored){
    b.scored=true;
    this.combo++;
    this.bestCombo=Math.max(this.bestCombo,this.combo);
    var base=b.touchedRim?2:3,mult=this.combo>=6?2:this.combo>=4?1.5:this.combo>=2?1.2:1,points=Math.round(base*mult);
    this.score+=points;
    this.netBounce=1;
    this.rimFlash=1;
    this.shake=.22;
    this.makeParticles(b.x,b.y);
    if(this.options.onScore)this.options.onScore(points,this.combo,!b.touchedRim);
  }
  if(b.scored&&b.y>hy+190)this.queueBall(false);
  else if(b.y+b.radius>C.FLOOR_Y||b.x<-100||b.x>C.WIDTH+100||b.y>C.HEIGHT+120)this.queueBall(true);
};

GameEngine.prototype.queueBall=function(missed){
  if(this.ball.respawning)return;
  if(missed&&this.ball.flying)this.combo=0;
  this.ball.respawning=true;
  this.ball.flying=false;
  this.respawnTimer=C.RESPAWN_DELAY;
  this.drag=null;
  this.emit();
};

GameEngine.prototype.makeParticles=function(x,y){
  var colors=['#ff3131','#ffe33f','#35efff','#fff'];
  for(var i=0;i<34;i++)this.particles.push({x:x,y:y,vx:(Math.random()-.5)*720,vy:-Math.random()*620-80,life:1,color:colors[i%colors.length],size:5+Math.random()*10,round:i%3===0});
};

GameEngine.prototype.updateParticles=function(dt){
  this.particles.forEach(function(p){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=900*dt;p.life-=dt*1.9;});
  this.particles=this.particles.filter(function(p){return p.life>0;});
};

GameEngine.prototype.draw=function(){
  var x=this.ctx;
  x.clearRect(0,0,C.WIDTH,C.HEIGHT);
  x.save();
  if(this.shake>0)x.translate((Math.random()-.5)*10,(Math.random()-.5)*8);
  this.drawArena(x);
  this.drawCage(x);
  this.drawBackboard(x);
  this.drawRamp(x);
  if(this.options.getSettings().trajectory&&this.drag)this.drawGuide(x);
  this.drawRackBalls(x);
  if(!this.ball.respawning)this.drawBasketball(x,this.ball.x,this.ball.y,this.ball.radius,this.ball.rotation,true);
  this.drawParticles(x);
  x.restore();
};

GameEngine.prototype.drawArena=function(x){
  var g=x.createLinearGradient(0,0,0,C.HEIGHT);
  g.addColorStop(0,'#090a12');g.addColorStop(.42,'#1e1327');g.addColorStop(.72,'#3b1734');g.addColorStop(1,'#09080e');
  x.fillStyle=g;x.fillRect(0,0,C.WIDTH,C.HEIGHT);
  x.fillStyle='#020205';x.fillRect(34,60,C.WIDTH-68,470);
  for(var row=0;row<4;row++)for(var i=0;i<18;i++){
    var pulse=.3+.25*Math.sin(this.elapsed*5+i*.8+row);
    x.fillStyle='hsla('+((i*37+row*19)%360)+',80%,65%,'+pulse+')';
    x.beginPath();x.arc(65+i*45+(row%2)*12,92+row*72,9+(i%3),0,Math.PI*2);x.fill();
  }
  x.fillStyle='#101017';x.fillRect(52,430,C.WIDTH-104,110);
  x.fillStyle='#f6d344';x.font='900 28px ui-monospace,monospace';x.textAlign='center';x.fillText(this.time<=15?'MOVING HOOP BONUS!':'MAKE SOME NOISE!',C.WIDTH/2,500);
  for(var l=0;l<14;l++){
    var on=(Math.floor(this.elapsed*12)+l)%4===0;
    x.fillStyle=on?'#fff167':'#8d2b38';x.shadowColor=on?'#fff167':'transparent';x.shadowBlur=on?16:0;
    x.beginPath();x.arc(65+l*59,35,7,0,Math.PI*2);x.fill();
  }
  x.shadowBlur=0;
};

GameEngine.prototype.drawCage=function(x){
  x.save();x.strokeStyle='rgba(190,195,205,.48)';x.lineWidth=4;
  x.beginPath();x.moveTo(32,0);x.lineTo(92,C.HEIGHT);x.moveTo(C.WIDTH-32,0);x.lineTo(C.WIDTH-92,C.HEIGHT);x.stroke();
  x.strokeStyle='rgba(145,150,160,.2)';x.lineWidth=2;
  for(var i=0;i<13;i++){
    x.beginPath();x.moveTo(34,i*92);x.lineTo(92,i*92+70);x.moveTo(C.WIDTH-34,i*92);x.lineTo(C.WIDTH-92,i*92+70);x.stroke();
  }
  for(var j=0;j<5;j++){
    x.beginPath();x.moveTo(34+j*12,0);x.lineTo(92+j*2,C.HEIGHT);x.moveTo(C.WIDTH-34-j*12,0);x.lineTo(C.WIDTH-92-j*2,C.HEIGHT);x.stroke();
  }
  x.restore();
};

GameEngine.prototype.drawBackboard=function(x){
  var hx=this.hoopX,hy=C.HOOP_Y;
  x.save();
  x.shadowColor='rgba(0,0,0,.8)';x.shadowBlur=22;
  x.fillStyle='rgba(222,232,241,.17)';x.strokeStyle='#e8edf2';x.lineWidth=14;
  x.fillRect(hx-198,hy-232,396,177);x.strokeRect(hx-198,hy-232,396,177);
  x.shadowBlur=0;
  x.strokeStyle='#e62f2f';x.lineWidth=10;x.strokeRect(hx-72,hy-178,144,94);
  x.strokeStyle='#555b64';x.lineWidth=15;x.beginPath();x.moveTo(hx+210,hy-225);x.lineTo(hx+250,hy+165);x.moveTo(hx-210,hy-225);x.lineTo(hx-250,hy+165);x.stroke();
  x.strokeStyle=this.rimFlash>0?'#fff34f':'#f13a21';x.shadowColor='#ff3b22';x.shadowBlur=18+this.rimFlash*25;x.lineWidth=20;x.beginPath();x.moveTo(hx-C.HOOP_WIDTH/2,hy);x.lineTo(hx+C.HOOP_WIDTH/2,hy);x.stroke();x.shadowBlur=0;
  var bounce=this.netBounce*Math.sin(this.elapsed*38)*28;
  x.strokeStyle='rgba(245,247,255,.92)';x.lineWidth=4;
  for(var i=0;i<=8;i++){
    var px=hx-C.HOOP_WIDTH/2+i*C.HOOP_WIDTH/8;
    x.beginPath();x.moveTo(px,hy+9);x.quadraticCurveTo(hx+(i-4)*10+bounce,hy+92,hx+(i-4)*10,hy+156);x.stroke();
  }
  for(var n=1;n<6;n++){x.beginPath();x.ellipse(hx,hy+n*27,C.HOOP_WIDTH/2-n*9,10,0,0,Math.PI*2);x.stroke();}
  x.restore();
};

GameEngine.prototype.drawRamp=function(x){
  var g=x.createLinearGradient(0,560,0,C.HEIGHT);g.addColorStop(0,'#4d2338');g.addColorStop(.6,'#1a1821');g.addColorStop(1,'#08080c');
  x.fillStyle=g;x.beginPath();x.moveTo(90,565);x.lineTo(810,565);x.lineTo(850,C.HEIGHT);x.lineTo(50,C.HEIGHT);x.closePath();x.fill();
  x.strokeStyle='#74737e';x.lineWidth=13;x.beginPath();x.moveTo(90,565);x.lineTo(50,C.HEIGHT);x.moveTo(810,565);x.lineTo(850,C.HEIGHT);x.stroke();
  x.strokeStyle='rgba(245,245,255,.17)';x.lineWidth=3;
  for(var i=0;i<12;i++){x.beginPath();x.moveTo(100,585+i*48);x.lineTo(800,585+i*48);x.stroke();}
  x.fillStyle='#121118';x.strokeStyle='#5e5d69';x.lineWidth=9;x.beginPath();x.roundRect(225,876,450,165,35);x.fill();x.stroke();
  x.fillStyle='#e33b1e';x.fillRect(278,1002,344,22);
  x.fillStyle='#f5d848';x.font='900 20px ui-monospace,monospace';x.textAlign='center';x.fillText('BALL RETURN',C.WIDTH/2,1080);
};

GameEngine.prototype.drawRackBalls=function(x){
  var positions=[[305,958,41,-.4],[380,976,44,.1],[520,976,44,-.2],[595,958,41,.35]];
  for(var i=0;i<positions.length;i++){var p=positions[i];this.drawBasketball(x,p[0],p[1],p[2],p[3],false);}
};

GameEngine.prototype.drawGuide=function(x){
  var shot=BB.Physics.dragToShot(this.drag.start,this.drag.current);
  if(!shot.power)return;
  x.save();x.setLineDash([14,15]);x.lineWidth=8;x.lineCap='round';x.strokeStyle='rgba(255,239,65,.9)';x.shadowColor='#ffe927';x.shadowBlur=12;x.beginPath();
  for(var t=0;t<1.35;t+=.055){var p=BB.Physics.trajectory(this.ball,{x:shot.x,y:shot.y},t);if(p.y>C.HEIGHT||p.x<0||p.x>C.WIDTH)break;if(t===0)x.moveTo(p.x,p.y);else x.lineTo(p.x,p.y);}x.stroke();x.restore();
};

GameEngine.prototype.drawBasketball=function(x,bx,by,r,rotation,active){
  x.save();x.translate(bx,by);x.rotate(rotation||0);
  var shadow=x.createRadialGradient(-r*.28,-r*.34,r*.06,0,0,r);
  shadow.addColorStop(0,'#ffd064');shadow.addColorStop(.18,'#f89a25');shadow.addColorStop(.68,'#e85a10');shadow.addColorStop(1,'#8d2709');
  x.fillStyle=shadow;x.strokeStyle='#35130c';x.lineWidth=Math.max(5,r*.12);x.beginPath();x.arc(0,0,r,0,Math.PI*2);x.fill();x.stroke();
  x.save();x.beginPath();x.arc(0,0,r-2,0,Math.PI*2);x.clip();
  x.strokeStyle='#3c160e';x.lineWidth=Math.max(4,r*.09);
  x.beginPath();x.moveTo(-r,0);x.quadraticCurveTo(0,r*.23,r,0);x.stroke();
  x.beginPath();x.moveTo(0,-r);x.quadraticCurveTo(-r*.25,0,0,r);x.stroke();
  x.beginPath();x.arc(-r*.86,0,r*.94,-1.27,1.27);x.stroke();
  x.beginPath();x.arc(r*.86,0,r*.94,1.87,4.41);x.stroke();
  x.fillStyle='rgba(54,18,8,.22)';
  for(var row=0;row<9;row++)for(var col=0;col<9;col++){var dx=-r*.72+col*r*.18+(row%2)*2,dy=-r*.72+row*r*.18;if(dx*dx+dy*dy<r*r*.73){x.beginPath();x.arc(dx,dy,1.1,0,Math.PI*2);x.fill();}}
  if(active){x.fillStyle='rgba(255,245,180,.65)';x.beginPath();x.ellipse(-r*.3,-r*.38,r*.16,r*.08,-.6,0,Math.PI*2);x.fill();}
  x.restore();x.restore();
};

GameEngine.prototype.drawParticles=function(x){
  this.particles.forEach(function(p){x.globalAlpha=p.life;x.fillStyle=p.color;x.save();x.translate(p.x,p.y);x.rotate(p.life*7);if(p.round){x.beginPath();x.arc(0,0,p.size/2,0,Math.PI*2);x.fill();}else{x.fillRect(-p.size/2,-p.size/2,p.size,p.size);}x.restore();});x.globalAlpha=1;
};

BB.GameEngine=GameEngine;
})(window.BB=window.BB||{});
