document.addEventListener("DOMContentLoaded",()=>{
      GameState.load(); AudioEngine.init(); Renderer.init(); UI.renderHome(); UI.renderKnowledge();
      document.body.addEventListener("click",e=>{
        const go=e.target.dataset.go, back=e.target.hasAttribute("data-back");
        if(go){ AudioEngine.sfxPlay("click"); Router.go(go); }
        if(back){ AudioEngine.sfxPlay("click"); Router.back(); }
        if(e.target.dataset.filter) UI.renderKnowledge(e.target.dataset.filter);
        if(e.target.dataset.add){
          const id=+e.target.dataset.add;
          const amount=+document.querySelector(`[data-amount="${id}"]`).value;
          const type=document.querySelector(`[data-type="${id}"]`).value;
          Game.addBet(id,type,amount);
        }
        if(e.target.dataset.remove){ Game.bets.splice(+e.target.dataset.remove,1); UI.renderSlip(); }
      });
      heroLogo.onclick=()=>AudioEngine.sfxPlay("neigh");
      toggleSlip.onclick=()=>slipItems.classList.toggle("open");
      confirmBet.onclick=()=>Game.confirm();
      nextRace.onclick=()=>Router.go("betting");
      randomKnowledge.onclick=()=>{ const k=Utils.pick(Knowledge); UI.renderKnowledge(k[0]); UI.toast(`抽到：${k[1]}`); };
      muteRace.onclick=()=>{ GameState.data.settings.sfxOn=!GameState.data.settings.sfxOn; AudioEngine.apply(); muteRace.textContent=GameState.data.settings.sfxOn?"靜音":"取消靜音"; };
      ["bgmVolume","sfxVolume","raceSpeed","quality","initChips","difficulty"].forEach(id=>{
        const el=document.getElementById(id); el.value=GameState.data.settings[id];
        el.oninput=()=>{ GameState.data.settings[id]=["bgmVolume","sfxVolume","initChips"].includes(id)?+el.value:el.value; AudioEngine.apply(); GameState.save(); };
      });
      ["bgmOn","sfxOn"].forEach(id=>{ const el=document.getElementById(id); el.checked=GameState.data.settings[id]; el.oninput=()=>{ GameState.data.settings[id]=el.checked; AudioEngine.apply(); GameState.save(); }; });
      resetChips.onclick=()=>{ if(confirm("確認將籌碼重置？")){ GameState.data.chips=GameState.data.settings.initChips; GameState.save(); UI.renderHome(); UI.toast("籌碼已重置"); } };
      clearRecord.onclick=()=>{ GameState.data.stats=GameState.defaults().stats; GameState.data.raceHistory=[]; GameState.save(); UI.renderHome(); UI.toast("紀錄已清除"); };
      document.addEventListener("visibilitychange",()=>{ if(document.hidden) GameState.save(); });
      document.addEventListener("touchstart",()=>{ if(AudioEngine.ctx?.state==="suspended") AudioEngine.ctx.resume(); },{once:true});
      document.addEventListener("click",()=>{ if(AudioEngine.ctx?.state==="suspended") AudioEngine.ctx.resume(); },{once:true});
    });
