const BettingSystem = {
      calcOdds(h, horses, race){
        const max=Math.max(...horses.map(x=>HorseEngine.score(x,race)));
        const ratio=HorseEngine.score(h,race)/max;
        const affinity=(race.track==="草地"?h.stats.turfAffinity:h.stats.dirtAffinity)/10;
        const gate=h.gateNum<=3?1.04:0.98;
        return Utils.clamp((1.5+(1-ratio)*15)*race.weather.speed*(1.1-affinity*.12)*gate,1.5,20);
      },
      settle(bets, horses){
        const order=[...horses].sort((a,b)=>a.live.finishTime-b.live.finishTime);
        let payout=0;
        const rows=bets.map(b=>{
          let won=false, amount=0;
          const ids=order.map(h=>h.id);
          if(b.type==="獨贏" && ids[0]===b.horseId) won=true;
          if(b.type==="位置" && ids.slice(0,3).includes(b.horseId)) won=true;
          if(b.type==="連贏" && b.combo && b.combo.every(id=>ids.slice(0,2).includes(id))) won=true;
          if(b.type==="三重彩" && b.combo && b.combo.join(",")===ids.slice(0,3).join(",")) won=true;
          if(won){
            amount=b.type==="位置"?b.amount*b.odds*.25:b.amount*b.odds;
            payout+=amount;
          }
          return {...b,won,payout:amount};
        });
        return {rows,payout,order};
      }
    };
