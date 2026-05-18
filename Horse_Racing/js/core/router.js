const Router = {
      current:"home", history:["home"],
      go(id){
        document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active",s.id===id));
        if(this.current!==id){ this.current=id; this.history.push(id); }
        if(id==="home") UI.renderHome();
        if(id==="betting") Game.prepareRace();
        if(id==="knowledge") UI.renderKnowledge();
        AudioEngine.scene(id);
      },
      back(){
        this.history.pop();
        const id=this.history.pop() || "home";
        this.go(id);
      }
    };
