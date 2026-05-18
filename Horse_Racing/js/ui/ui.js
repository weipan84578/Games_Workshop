const UI = {
      toast(msg){ const t=document.getElementById("toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),1800); },
      renderHome(){
        const d=GameState.data;
        homeChips.textContent=Utils.money(d.chips)+(d.chips<=0?" ⚠️":"");
        homeRecord.textContent=`${d.stats.wins}勝 ${d.stats.losses}負`;
        startBtn.disabled=d.chips<=0;
      },
      renderKnowledge(filter="全部"){
        knowledgeFilters.innerHTML=["全部","馬匹","場地","氣象","策略","歷史"].map(x=>`<button class="chip ${x===filter?"active":""}" data-filter="${x}">${x}</button>`).join("");
        knowledgeList.innerHTML=Knowledge.filter(k=>filter==="全部"||k[0]===filter).map(k=>`<article class="knowledge-card"><span class="tag">${k[0]}</span><h3>${k[1]}</h3><p>${k[2]}</p><footer>對遊戲的影響：${k[3]}</footer></article>`).join("");
      },
      renderBetting(){
        raceMeta.innerHTML=`<div class="card">本場：第 ${Game.race.id} 場</div><div class="card">距離：${Game.race.distance}m</div><div class="card">場地：${Game.race.track}</div><div class="card">天氣：${Game.race.weather.icon} ${Game.race.weather.name}<br><span class="muted">${Game.race.weather.condition}</span></div><div class="card">我的籌碼：<strong>${Utils.money(GameState.data.chips)}</strong></div>`;
        horseGrid.innerHTML=Game.horses.map(h=>`<article class="card horse-card" style="--horse-color:${h.color}">
          <div class="horse-head"><div class="horse-name"><strong>[${h.gateNum}] ${h.nameZh}</strong><span class="muted">${h.nameEn}</span></div><div class="odds">${h.odds.toFixed(1)}x</div></div>
          <div class="muted">騎師：${h.race.jockeyGrade}級　負磅：${h.race.weight}kg</div>
          <div class="bars">
            ${bar("速度",h.stats.speed,h.color)}
            ${bar("耐力",h.stats.stamina,h.color)}
            ${bar("爆發",h.stats.burst,h.color)}
          </div>
          <div class="tag">${h.race.statusTag}</div>
          <div class="bet-controls">
            <select data-type="${h.id}"><option>獨贏</option><option>位置</option></select>
            <input data-amount="${h.id}" inputmode="numeric" placeholder="金額">
            <button class="btn" data-add="${h.id}">加入下注單</button>
          </div>
        </article>`).join("");
        this.renderSlip();
      },
      renderSlip(){
        slipSummary.textContent=`下注單 [${Game.bets.length}注]`;
        slipTotal.textContent=`合計：${Utils.money(Game.bets.reduce((s,b)=>s+b.amount,0))}`;
        slipItems.innerHTML=Game.bets.map((b,i)=>`<div class="slip-item"><span>${b.type} ${b.name} ${Utils.money(b.amount)}</span><button class="chip" data-remove="${i}">刪除</button></div>`).join("");
      },
      updateRace(){
        const lead=Math.max(...Game.horses.map(h=>h.live.x));
        distanceText.textContent=`距離：已跑 ${Math.round(lead*Game.race.distance)}m / ${Game.race.distance}m`;
        raceProgress.style.width=`${lead*100}%`;
        ranking.innerHTML=[...Game.horses].sort((a,b)=>a.live.rank-b.live.rank).slice(0,3).map(h=>`<div class="card">${h.live.rank}. ${h.nameZh}</div>`).join("");
      },
      event(text){ eventFeed.textContent=`▶ ${text}`; },
      result(settlement){
        podium.innerHTML=settlement.order.map((h,i)=>`${["🥇","🥈","🥉"][i]||`${i+1}.`} ${h.nameZh}　${h.live.finishTime.toFixed(2)} 秒`).join("<br>");
        betResults.innerHTML=settlement.rows.map(r=>`${r.won?"✅":"❌"} ${r.type} ${r.name} ${Utils.money(r.amount)} → ${r.won?`贏得 ${Utils.money(r.payout)}`:"損失 "+Utils.money(r.amount)}`).join("<br>")+`<hr><strong>本場盈虧：${Utils.money(settlement.payout-Game.stake)}</strong><br>累積籌碼：${Utils.money(GameState.data.chips)}`;
        resultTip.textContent=Utils.pick(Knowledge)[3];
      }
    };
    function bar(label,val){ return `<div class="bar-line"><span>${label}</span><div class="bar"><span style="width:${val*10}%"></span></div></div>`; }
