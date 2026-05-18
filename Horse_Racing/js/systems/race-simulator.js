const RaceSimulator = {
      running:false,last:0,elapsed:0,
      start(){
        this.running=true; this.last=performance.now(); this.elapsed=0; AudioEngine.sfxPlay("start"); requestAnimationFrame(this.loop.bind(this));
      },
      loop(now){
        if(!this.running) return;
        const speedMap={slow:.7,normal:1,fast:1.35};
        const dt=Math.min((now-this.last)/1000, .05)*speedMap[GameState.data.settings.raceSpeed];
        this.last=now; this.elapsed+=dt; this.tick(dt); Renderer.draw();
        if(Game.horses.every(h=>h.live.finished)){ this.running=false; Game.finishRace(); return; }
        requestAnimationFrame(this.loop.bind(this));
      },
      tick(dt){
        const race=Game.race;
        Game.horses.forEach(h=>{
          if(h.live.finished) return;
          const p=h.live.x;
          const base=(h.stats.speed*.4+h.stats.stamina*.3+h.stats.burst*.3)/10;
          const affinity=(race.track==="草地"?h.stats.turfAffinity:h.stats.dirtAffinity)/10;
          const dist=h.stats.shortDist/10;
          const gate=h.gateNum<=3?1.06:0.98;
          const energyMod=h.live.energy>50?1:.7+(h.live.energy/50)*.3;
          const strategy=p<.2?(h.race.strategy==="frontrun"?1.08:1):p>.7?(h.race.strategy==="closer"?1.08:1):1;
          const burst=p>.8?1+(h.stats.burst/10)*.3*(h.live.energy/100):1;
          if(p>.2&&p<.8&&h.live.events.length<2&&Math.random()<.02){
            const ev=UncertaintySystem.event(h);
            if(ev){ h.live.events.push(ev); h.live.eventFrames=ev.frames; h.live.eventMod=ev.mod; UI.event(ev.text); AudioEngine.sfxPlay(ev.good?"good":"bad"); }
          }
          const eventMod=h.live.eventFrames>0?(h.live.eventFrames--,1+h.live.eventMod):1;
          const noise=Utils.rand(-.015,.015);
          h.live.speed=Math.max(.02, base*race.weather.speed*(.92+affinity*.16)*gate*h.race.mood*h.race.fitness*(1+h.race.jockeyBonus)*energyMod*strategy*burst*eventMod+noise);
          h.live.x+=h.live.speed*dt*.12;
          h.live.energy=Utils.clamp(h.live.energy-(.55+h.live.speed*.7)*race.weather.softness*(1-h.stats.stamina/20),0,100);
          h.live.bobPhase+=dt*(6+h.live.speed*6);
          if(h.live.x>=1){ h.live.x=1; h.live.finished=true; h.live.finishTime=this.elapsed; }
        });
        const order=[...Game.horses].sort((a,b)=>b.live.x-a.live.x);
        order.forEach((h,i)=>h.live.rank=i+1);
        UI.updateRace();
      }
    };
