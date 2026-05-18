const GameState = {
      saveKey:"hrg_save",
      data:null,
      defaults(){
        return {version:"1.0",chips:10000,stats:{totalRaces:0,wins:0,losses:0,bigWins:0,totalWon:0,totalLost:0,bestWin:0},
          settings:{bgmVolume:60,sfxVolume:80,bgmOn:true,sfxOn:true,raceSpeed:"normal",quality:"high",initChips:10000,difficulty:"normal",lang:"zh-TW"},
          raceHistory:[]};
      },
      load(){ try{ this.data=JSON.parse(localStorage.getItem(this.saveKey)) || this.defaults(); }catch{ this.data=this.defaults(); } },
      save(){ localStorage.setItem(this.saveKey, JSON.stringify(this.data)); },
    };
