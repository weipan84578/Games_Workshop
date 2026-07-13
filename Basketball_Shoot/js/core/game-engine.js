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
    this.level=1;
    this.time=C.LEVELS[0].time;
    this.last=0;
    this.elapsed=0;
    this.stageElapsed=0;
    this.drag=null;
    this.netBounce=0;
    this.rimFlash=0;
    this.shake=0;
    this.stageFlash=0;
    this.particles=[];
    this.hoopX=C.HOOP_X;
    this.hoopVelocity=0;
    this.rackSlots=this.createRackSlots();
    this.balls=this.createBalls();
    this.controls=new BB.TouchControls(canvas,{
      getBall:this.findRackBall.bind(this),
      onDrag:this.dragBall.bind(this),
      onRelease:this.shoot.bind(this)
    });
    this.loop=this.loop.bind(this);
  }

  GameEngine.prototype.createRackSlots=function(){return[{x:326,y:938},{x:388,y:958},{x:450,y:918},{x:512,y:958},{x:574,y:938}];};
  GameEngine.prototype.createBalls=function(){var self=this;return this.rackSlots.map(function(slot,index){return self.newBall(index,slot);});};
  GameEngine.prototype.newBall=function(index,slot){return{id:index,state:'rack',homeIndex:index,x:slot.x,y:slot.y,vx:0,vy:0,radius:C.BALL_RADIUS,rotation:(index-2)*.18,scored:false,touchedRim:false,previousY:slot.y,rimCooldown:0,returnProgress:0,returnStart:null,returnSide:index%2?-1:1};};

  GameEngine.prototype.start=function(saved){
    this.score=saved&&saved.score||0;
    this.combo=saved&&saved.combo||0;
    this.bestCombo=saved&&saved.bestCombo||this.combo;
    this.level=BB.MathUtils.clamp(saved&&Number(saved.level)||1,1,C.LEVELS.length);
    this.time=saved&&Number(saved.time)||C.LEVELS[this.level-1].time;
    this.elapsed=0;this.stageElapsed=0;this.hoopX=C.HOOP_X;this.hoopVelocity=0;
    this.balls=this.createBalls();this.drag=null;this.particles=[];this.stageFlash=1.2;
    this.running=true;this.paused=false;this.last=performance.now();requestAnimationFrame(this.loop);this.emit();
  };
  GameEngine.prototype.pause=function(value){this.paused=value;if(!value&&this.running){this.last=performance.now();requestAnimationFrame(this.loop);}};
  GameEngine.prototype.stop=function(){this.running=false;};
  GameEngine.prototype.snapshot=function(){var cfg=C.LEVELS[this.level-1];return{score:this.score,combo:this.combo,bestCombo:this.bestCombo,time:Math.max(0,this.time),level:this.level,target:cfg.target,isDouble:this.time<=C.DOUBLE_TIME,availableBalls:this.balls.filter(function(b){return b.state==='rack';}).length};};

  GameEngine.prototype.findRackBall=function(point){
    if(!this.running||this.paused||this.stageFlash>0)return null;
    var candidates=this.balls.filter(function(b){return b.state==='rack'&&BB.MathUtils.distance(point,b)<92;});
    candidates.sort(function(a,b){return BB.MathUtils.distance(point,a)-BB.MathUtils.distance(point,b);});
    return candidates[0]||null;
  };
  GameEngine.prototype.dragBall=function(start,current,ball){
    if(!ball||ball.state!=='rack'&&ball.state!=='held')return;
    ball.state='held';
    ball.x=BB.MathUtils.clamp(current.x,95,C.WIDTH-95);
    ball.y=BB.MathUtils.clamp(current.y,475,1000);
    this.drag={start:start,current:current,ball:ball};
  };
  GameEngine.prototype.shoot=function(shot,ball){
    this.drag=null;
    if(!ball||!this.running||this.paused||ball.state!=='held')return;
    if(shot.power<50){this.returnToRack(ball);return;}
    ball.vx=shot.x;ball.vy=shot.y;ball.state='flying';ball.scored=false;ball.touchedRim=false;ball.rimCooldown=0;ball.rotation=-.35;
    this.shake=.1;if(this.options.onSound)this.options.onSound('shoot');
  };
  GameEngine.prototype.returnToRack=function(ball){var slot=this.rackSlots[ball.homeIndex];ball.state='rack';ball.x=slot.x;ball.y=slot.y;ball.vx=0;ball.vy=0;ball.returnProgress=0;};

  GameEngine.prototype.loop=function(now){
    if(!this.running||this.paused)return;
    var dt=Math.min((now-this.last)/1000,.03),cfg=C.LEVELS[this.level-1];
    this.last=now;this.elapsed+=dt;
    if(this.stageFlash<=0){this.stageElapsed+=dt;this.time=Math.max(0,this.time-dt);}
    this.hoopX=C.HOOP_X+Math.sin(this.stageElapsed*cfg.hoopSpeed)*cfg.hoopRange;
    this.hoopVelocity=cfg.hoopRange*cfg.hoopSpeed*Math.cos(this.stageElapsed*cfg.hoopSpeed);
    this.balls.forEach(function(ball){if(ball.state==='flying')this.updateFlyingBall(ball,dt);else if(ball.state==='returning')this.updateReturningBall(ball,dt);}.bind(this));
    this.resolveBallCollisions();this.updateParticles(dt);
    this.netBounce*=Math.pow(.018,dt);this.rimFlash=Math.max(0,this.rimFlash-dt*3.6);this.shake=Math.max(0,this.shake-dt);this.stageFlash=Math.max(0,this.stageFlash-dt);
    this.draw();this.emit();
    if(this.time<=0){this.handleStageEnd();if(!this.running)return;}
    requestAnimationFrame(this.loop);
  };
  GameEngine.prototype.emit=function(){if(this.options.onUpdate)this.options.onUpdate(this.snapshot());};

  GameEngine.prototype.updateFlyingBall=function(ball,dt){
    var hx=this.hoopX,hy=C.HOOP_Y,left={x:hx-C.HOOP_WIDTH/2,y:hy},right={x:hx+C.HOOP_WIDTH/2,y:hy};
    ball.previousY=ball.y;ball.rimCooldown=Math.max(0,ball.rimCooldown-dt);BB.Physics.step(ball,dt);
    if(ball.x-ball.radius<62&&ball.vx<0){ball.x=62+ball.radius;ball.vx=Math.abs(ball.vx)*.62;this.shake=.06;}
    if(ball.x+ball.radius>C.WIDTH-62&&ball.vx>0){ball.x=C.WIDTH-62-ball.radius;ball.vx=-Math.abs(ball.vx)*.62;this.shake=.06;}
    if(ball.y-ball.radius<42&&ball.vy<0){ball.y=42+ball.radius;ball.vy=Math.abs(ball.vy)*.58;}
    if(ball.rimCooldown<=0&&(BB.Physics.circleCollision(ball,left,C.RIM_COLLISION_RADIUS,C.RIM_RESTITUTION)||BB.Physics.circleCollision(ball,right,C.RIM_COLLISION_RADIUS,C.RIM_RESTITUTION))){ball.touchedRim=true;ball.rimCooldown=.075;ball.vx+=this.hoopVelocity*.22;this.rimFlash=1;this.shake=.12;if(this.options.onSound)this.options.onSound('rim');}
    var boardLeft=hx-198,boardRight=hx+198,boardTop=hy-232,boardBottom=hy-55;
    if(ball.y>boardTop-ball.radius&&ball.y<boardBottom+ball.radius){
      if(ball.x+ball.radius>boardRight&&ball.previousY<hy&&ball.vx>0){ball.x=boardRight-ball.radius;ball.vx=-Math.abs(ball.vx)*.7;ball.touchedRim=true;}
      if(ball.x-ball.radius<boardLeft&&ball.previousY<hy&&ball.vx<0){ball.x=boardLeft+ball.radius;ball.vx=Math.abs(ball.vx)*.7;ball.touchedRim=true;}
    }
    var crossed=ball.previousY<hy&&ball.y>=hy&&ball.vy>0&&ball.x>left.x+10&&ball.x<right.x-10;
    if(crossed&&!ball.scored)this.scoreBall(ball);
    if(ball.scored&&ball.y>hy+195)this.beginReturn(ball);
    else if(ball.y+ball.radius>C.FLOOR_Y||ball.y>C.HEIGHT+80)this.beginReturn(ball,true);
  };

  GameEngine.prototype.resolveBallCollisions=function(){
    var flying=this.balls.filter(function(b){return b.state==='flying';});
    for(var i=0;i<flying.length;i++)for(var j=i+1;j<flying.length;j++){
      var a=flying[i],b=flying[j],dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy),min=a.radius+b.radius;
      if(!dist||dist>=min)continue;
      var nx=dx/dist,ny=dy/dist,overlap=min-dist;a.x-=nx*overlap/2;a.y-=ny*overlap/2;b.x+=nx*overlap/2;b.y+=ny*overlap/2;
      var rel=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rel>=0)continue;
      var impulse=rel*.82;a.vx+=impulse*nx;a.vy+=impulse*ny;b.vx-=impulse*nx;b.vy-=impulse*ny;
    }
  };

  GameEngine.prototype.scoreBall=function(ball){
    ball.scored=true;this.combo++;this.bestCombo=Math.max(this.bestCombo,this.combo);
    var base=ball.touchedRim?2:3,comboMultiplier=this.combo>=6?2:this.combo>=4?1.5:this.combo>=2?1.2:1,doubleMultiplier=this.time<=C.DOUBLE_TIME?2:1,points=Math.round(base*comboMultiplier*doubleMultiplier);
    this.score+=points;this.netBounce=1;this.rimFlash=1;this.shake=.22;this.makeParticles(ball.x,ball.y);
    if(this.options.onScore)this.options.onScore(points,this.combo,!ball.touchedRim,doubleMultiplier===2);
  };

  GameEngine.prototype.beginReturn=function(ball,missed){
    if(ball.state==='returning')return;
    if(missed&&!ball.scored)this.combo=0;
    ball.state='returning';ball.vx=0;ball.vy=0;ball.returnProgress=0;ball.returnStart={x:ball.x,y:Math.min(ball.y,C.FLOOR_Y-20)};ball.returnSide=ball.x<C.WIDTH/2?-1:1;
  };
  GameEngine.prototype.updateReturningBall=function(ball,dt){
    ball.returnProgress=Math.min(1,ball.returnProgress+dt/C.RETURN_DURATION);var t=ball.returnProgress,s=ball.returnStart,e=this.rackSlots[ball.homeIndex],side=ball.returnSide<0?88:C.WIDTH-88;
    var c1={x:side,y:Math.max(650,s.y+90)},c2={x:side+(ball.returnSide<0?90:-90),y:930},u=1-t;
    ball.x=u*u*u*s.x+3*u*u*t*c1.x+3*u*t*t*c2.x+t*t*t*e.x;
    ball.y=u*u*u*s.y+3*u*u*t*c1.y+3*u*t*t*c2.y+t*t*t*e.y;
    ball.rotation+=dt*(5+3*t);
    if(t>=1)this.returnToRack(ball);
  };

  GameEngine.prototype.handleStageEnd=function(){
    var cfg=C.LEVELS[this.level-1];
    if(this.score>=cfg.target&&this.level<C.LEVELS.length){
      this.level++;this.time=C.LEVELS[this.level-1].time;this.stageElapsed=0;this.combo=0;this.stageFlash=1.8;this.balls=this.createBalls();this.drag=null;
      if(this.options.onLevel)this.options.onLevel(this.level,C.LEVELS[this.level-1].target);this.emit();
    }else{this.running=false;if(this.options.onEnd)this.options.onEnd(this.snapshot());}
  };

  GameEngine.prototype.makeParticles=function(x,y){var colors=['#ff3131','#ffe33f','#35efff','#fff'];for(var i=0;i<34;i++)this.particles.push({x:x,y:y,vx:(Math.random()-.5)*720,vy:-Math.random()*620-80,life:1,color:colors[i%colors.length],size:5+Math.random()*10,round:i%3===0});};
  GameEngine.prototype.updateParticles=function(dt){this.particles.forEach(function(p){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=900*dt;p.life-=dt*1.9;});this.particles=this.particles.filter(function(p){return p.life>0;});};

  GameEngine.prototype.draw=function(){var x=this.ctx;x.clearRect(0,0,C.WIDTH,C.HEIGHT);x.save();if(this.shake>0)x.translate((Math.random()-.5)*10,(Math.random()-.5)*8);this.drawArena(x);this.drawCage(x);this.drawBackboard(x);this.drawRamp(x);this.drawReturnTracks(x);if(this.options.getSettings().trajectory&&this.drag)this.drawGuide(x);this.balls.slice().sort(function(a,b){return a.y-b.y;}).forEach(function(ball){this.drawBasketball(x,ball.x,ball.y,ball.radius,ball.rotation,ball.state==='held'||ball.state==='flying');}.bind(this));this.drawParticles(x);this.drawStageOverlay(x);x.restore();};
  GameEngine.prototype.drawArena=function(x){var cfg=C.LEVELS[this.level-1],g=x.createLinearGradient(0,0,0,C.HEIGHT);g.addColorStop(0,'#090a12');g.addColorStop(.42,'#1e1327');g.addColorStop(.72,'#3b1734');g.addColorStop(1,'#09080e');x.fillStyle=g;x.fillRect(0,0,C.WIDTH,C.HEIGHT);x.fillStyle='#020205';x.fillRect(34,60,C.WIDTH-68,470);for(var row=0;row<4;row++)for(var i=0;i<18;i++){var pulse=.3+.25*Math.sin(this.elapsed*5+i*.8+row);x.fillStyle='hsla('+((i*37+row*19)%360)+',80%,65%,'+pulse+')';x.beginPath();x.arc(65+i*45+(row%2)*12,92+row*72,9+(i%3),0,Math.PI*2);x.fill();}x.fillStyle='#101017';x.fillRect(52,430,C.WIDTH-104,110);x.fillStyle=this.time<=C.DOUBLE_TIME?'#ff4038':'#f6d344';x.font='900 25px ui-monospace,monospace';x.textAlign='center';x.fillText(this.time<=C.DOUBLE_TIME?'DOUBLE SCORE ×2':'STAGE '+this.level+'  TARGET '+cfg.target,C.WIDTH/2,500);for(var l=0;l<14;l++){var on=(Math.floor(this.elapsed*12)+l)%4===0;x.fillStyle=on?'#fff167':'#8d2b38';x.shadowColor=on?'#fff167':'transparent';x.shadowBlur=on?16:0;x.beginPath();x.arc(65+l*59,35,7,0,Math.PI*2);x.fill();}x.shadowBlur=0;};
  GameEngine.prototype.drawCage=function(x){x.save();x.strokeStyle='rgba(190,195,205,.48)';x.lineWidth=4;x.beginPath();x.moveTo(32,0);x.lineTo(92,C.HEIGHT);x.moveTo(C.WIDTH-32,0);x.lineTo(C.WIDTH-92,C.HEIGHT);x.stroke();x.strokeStyle='rgba(145,150,160,.2)';x.lineWidth=2;for(var i=0;i<13;i++){x.beginPath();x.moveTo(34,i*92);x.lineTo(92,i*92+70);x.moveTo(C.WIDTH-34,i*92);x.lineTo(C.WIDTH-92,i*92+70);x.stroke();}for(var j=0;j<5;j++){x.beginPath();x.moveTo(34+j*12,0);x.lineTo(92+j*2,C.HEIGHT);x.moveTo(C.WIDTH-34-j*12,0);x.lineTo(C.WIDTH-92-j*2,C.HEIGHT);x.stroke();}x.restore();};
  GameEngine.prototype.drawBackboard=function(x){var hx=this.hoopX,hy=C.HOOP_Y;x.save();x.shadowColor='rgba(0,0,0,.8)';x.shadowBlur=22;x.fillStyle='rgba(222,232,241,.17)';x.strokeStyle='#e8edf2';x.lineWidth=14;x.fillRect(hx-198,hy-232,396,177);x.strokeRect(hx-198,hy-232,396,177);x.shadowBlur=0;x.strokeStyle='#e62f2f';x.lineWidth=10;x.strokeRect(hx-72,hy-178,144,94);x.strokeStyle='#555b64';x.lineWidth=15;x.beginPath();x.moveTo(hx+210,hy-225);x.lineTo(hx+250,hy+165);x.moveTo(hx-210,hy-225);x.lineTo(hx-250,hy+165);x.stroke();x.strokeStyle=this.rimFlash>0?'#fff34f':'#f13a21';x.shadowColor='#ff3b22';x.shadowBlur=18+this.rimFlash*25;x.lineWidth=20;x.beginPath();x.moveTo(hx-C.HOOP_WIDTH/2,hy);x.lineTo(hx+C.HOOP_WIDTH/2,hy);x.stroke();x.shadowBlur=0;var bounce=this.netBounce*Math.sin(this.elapsed*38)*28;x.strokeStyle='rgba(245,247,255,.92)';x.lineWidth=4;for(var i=0;i<=8;i++){var px=hx-C.HOOP_WIDTH/2+i*C.HOOP_WIDTH/8;x.beginPath();x.moveTo(px,hy+9);x.quadraticCurveTo(hx+(i-4)*10+bounce,hy+92,hx+(i-4)*10,hy+156);x.stroke();}for(var n=1;n<6;n++){x.beginPath();x.ellipse(hx,hy+n*27,C.HOOP_WIDTH/2-n*9,10,0,0,Math.PI*2);x.stroke();}x.restore();};
  GameEngine.prototype.drawRamp=function(x){var g=x.createLinearGradient(0,560,0,C.HEIGHT);g.addColorStop(0,'#4d2338');g.addColorStop(.6,'#1a1821');g.addColorStop(1,'#08080c');x.fillStyle=g;x.beginPath();x.moveTo(90,565);x.lineTo(810,565);x.lineTo(850,C.HEIGHT);x.lineTo(50,C.HEIGHT);x.closePath();x.fill();x.strokeStyle='#74737e';x.lineWidth=13;x.beginPath();x.moveTo(90,565);x.lineTo(50,C.HEIGHT);x.moveTo(810,565);x.lineTo(850,C.HEIGHT);x.stroke();x.strokeStyle='rgba(245,245,255,.17)';x.lineWidth=3;for(var i=0;i<12;i++){x.beginPath();x.moveTo(100,585+i*48);x.lineTo(800,585+i*48);x.stroke();}x.fillStyle='#121118';x.strokeStyle='#5e5d69';x.lineWidth=9;x.beginPath();x.roundRect(225,876,450,165,35);x.fill();x.stroke();x.fillStyle='#e33b1e';x.fillRect(278,1002,344,22);x.fillStyle='#f5d848';x.font='900 20px ui-monospace,monospace';x.textAlign='center';x.fillText('5 BALL RETURN',C.WIDTH/2,1080);};
  GameEngine.prototype.drawReturnTracks=function(x){x.save();x.strokeStyle='rgba(255,224,70,.38)';x.lineWidth=5;x.setLineDash([12,16]);x.beginPath();x.moveTo(82,570);x.quadraticCurveTo(55,780,260,950);x.moveTo(C.WIDTH-82,570);x.quadraticCurveTo(C.WIDTH-55,780,C.WIDTH-260,950);x.stroke();x.restore();};
  GameEngine.prototype.drawGuide=function(x){var shot=BB.Physics.dragToShot(this.drag.start,this.drag.current);if(!shot.power)return;x.save();x.setLineDash([14,15]);x.lineWidth=8;x.lineCap='round';x.strokeStyle='rgba(255,239,65,.9)';x.shadowColor='#ffe927';x.shadowBlur=12;x.beginPath();for(var t=0;t<1.35;t+=.055){var p=BB.Physics.trajectory(this.drag.ball,{x:shot.x,y:shot.y},t);if(p.y>C.HEIGHT||p.x<0||p.x>C.WIDTH)break;if(t===0)x.moveTo(p.x,p.y);else x.lineTo(p.x,p.y);}x.stroke();x.restore();};
  GameEngine.prototype.drawBasketball=function(x,bx,by,r,rotation,active){x.save();x.translate(bx,by);x.rotate(rotation||0);if(active){x.shadowColor='#ffb332';x.shadowBlur=15;}var shadow=x.createRadialGradient(-r*.28,-r*.34,r*.06,0,0,r);shadow.addColorStop(0,'#ffd064');shadow.addColorStop(.18,'#f89a25');shadow.addColorStop(.68,'#e85a10');shadow.addColorStop(1,'#8d2709');x.fillStyle=shadow;x.strokeStyle='#35130c';x.lineWidth=Math.max(5,r*.12);x.beginPath();x.arc(0,0,r,0,Math.PI*2);x.fill();x.stroke();x.shadowBlur=0;x.save();x.beginPath();x.arc(0,0,r-2,0,Math.PI*2);x.clip();x.strokeStyle='#3c160e';x.lineWidth=Math.max(4,r*.09);x.beginPath();x.moveTo(-r,0);x.quadraticCurveTo(0,r*.23,r,0);x.stroke();x.beginPath();x.moveTo(0,-r);x.quadraticCurveTo(-r*.25,0,0,r);x.stroke();x.beginPath();x.arc(-r*.86,0,r*.94,-1.27,1.27);x.stroke();x.beginPath();x.arc(r*.86,0,r*.94,1.87,4.41);x.stroke();x.fillStyle='rgba(54,18,8,.22)';for(var row=0;row<9;row++)for(var col=0;col<9;col++){var dx=-r*.72+col*r*.18+(row%2)*2,dy=-r*.72+row*r*.18;if(dx*dx+dy*dy<r*r*.73){x.beginPath();x.arc(dx,dy,1.1,0,Math.PI*2);x.fill();}}if(active){x.fillStyle='rgba(255,245,180,.65)';x.beginPath();x.ellipse(-r*.3,-r*.38,r*.16,r*.08,-.6,0,Math.PI*2);x.fill();}x.restore();x.restore();};
  GameEngine.prototype.drawParticles=function(x){this.particles.forEach(function(p){x.globalAlpha=p.life;x.fillStyle=p.color;x.save();x.translate(p.x,p.y);x.rotate(p.life*7);if(p.round){x.beginPath();x.arc(0,0,p.size/2,0,Math.PI*2);x.fill();}else{x.fillRect(-p.size/2,-p.size/2,p.size,p.size);}x.restore();});x.globalAlpha=1;};
  GameEngine.prototype.drawStageOverlay=function(x){if(this.stageFlash<=0)return;var alpha=Math.min(1,this.stageFlash*1.2);x.save();x.globalAlpha=alpha;x.fillStyle='rgba(4,2,10,.72)';x.fillRect(120,485,C.WIDTH-240,170);x.strokeStyle='#ffe33f';x.lineWidth=8;x.strokeRect(120,485,C.WIDTH-240,170);x.fillStyle='#fff';x.textAlign='center';x.font='900 58px ui-monospace,monospace';x.fillText('STAGE '+this.level,C.WIDTH/2,557);x.fillStyle='#ffe33f';x.font='900 27px ui-monospace,monospace';x.fillText('TARGET '+C.LEVELS[this.level-1].target,C.WIDTH/2,612);x.restore();};

  BB.GameEngine=GameEngine;
})(window.BB=window.BB||{});
