const Game = {
      horses:[], bets:[], race:null, stake:0, preview:{weather:UncertaintySystem.weather(),track:"草地"},
      prepareRace(){
        this.preview={weather:UncertaintySystem.weather(),track:"草地"};
        this.race={id:GameState.data.stats.totalRaces+1,distance:1200,weather:UncertaintySystem.weather()};
        this.race.track=this.race.weather.track;
        this.horses=HorseEngine.generate();
        this.horses.forEach(h=>h.odds=BettingSystem.calcOdds(h,this.horses,this.race));
        this.bets=[]; UI.renderBetting();
      },
      addBet(horseId,type,amount){
        const horse=this.horses.find(h=>h.id===horseId);
        const total=this.bets.reduce((s,b)=>s+b.amount,0);
        if(!amount||amount<100) return UI.toast("單注最低為 $100");
        if(amount>GameState.data.chips*.5) return UI.toast("單注最高為持有籌碼的 50%");
        if(total+amount>GameState.data.chips) return UI.toast("下注總額不可超過持有籌碼");
        if(this.bets.length>=6) return UI.toast("每場最多 6 注");
        this.bets.push({horseId,type,amount,odds:horse.odds,name:horse.nameZh});
        AudioEngine.sfxPlay("bet"); UI.renderSlip();
      },
      confirm(){
        if(!this.bets.length) return UI.toast("請先加入下注");
        this.stake=this.bets.reduce((s,b)=>s+b.amount,0);
        GameState.data.chips-=this.stake; GameState.save();
        Router.go("race");
        myBets.textContent="你的下注：" + this.bets.map(b=>`${b.type} ${b.name} ${Utils.money(b.amount)}`).join(" / ");
        raceTitle.textContent=`第 ${this.race.id} 場　${this.race.distance}m　${this.race.track}　${this.race.weather.name}`;
        Renderer.draw(); RaceSimulator.start();
      },
      finishRace(){
        const settlement=BettingSystem.settle(this.bets,this.horses);
        const net=settlement.payout-this.stake;
        GameState.data.chips+=settlement.payout;
        GameState.data.stats.totalRaces++;
        if(net>0){ GameState.data.stats.wins++; GameState.data.stats.totalWon+=net; GameState.data.stats.bestWin=Math.max(GameState.data.stats.bestWin,net); if(settlement.rows.some(r=>r.won&&r.odds>=5)) GameState.data.stats.bigWins++; AudioEngine.sfxPlay("win"); }
        else { GameState.data.stats.losses++; GameState.data.stats.totalLost+=Math.abs(net); AudioEngine.sfxPlay("lose"); }
        GameState.data.raceHistory.push({raceId:this.race.id,winner:settlement.order[0].nameZh,myBet:this.bets.map(b=>b.type).join("/"),result:net>0?"win":"loss",profit:net});
        GameState.data.raceHistory=GameState.data.raceHistory.slice(-20); GameState.save();
        UI.result(settlement); Router.go("result");
      }
    };
