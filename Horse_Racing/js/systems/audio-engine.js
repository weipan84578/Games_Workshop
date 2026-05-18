const AudioEngine = {
      ctx:null, master:null, bgm:null, sfx:null, interval:null,
      init(){
        const C=window.AudioContext||window.webkitAudioContext;
        if(!C) return;
        this.ctx=new C(); this.master=this.ctx.createGain(); this.bgm=this.ctx.createGain(); this.sfx=this.ctx.createGain();
        this.bgm.connect(this.master); this.sfx.connect(this.master); this.master.connect(this.ctx.destination); this.apply();
      },
      apply(){ if(!this.master) return; this.bgm.gain.value=GameState.data.settings.bgmOn?GameState.data.settings.bgmVolume/100:0; this.sfx.gain.value=GameState.data.settings.sfxOn?GameState.data.settings.sfxVolume/100:0; },
      tone(freq,dur=.12,type="sine",gain=.08,target=this.sfx){
        if(!this.ctx||!target) return;
        const o=this.ctx.createOscillator(), g=this.ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.value=gain; o.connect(g).connect(target); o.start(); g.gain.exponentialRampToValueAtTime(.0001,this.ctx.currentTime+dur); o.stop(this.ctx.currentTime+dur);
      },
      sfxPlay(id){
        if(!GameState.data.settings.sfxOn) return;
        const map={click:[420,.06],neigh:[520,.2],bet:[300,.12],good:[740,.14],bad:[110,.18],win:[660,.12],lose:[180,.18],rankup:[620,.08],rankdown:[240,.08],start:[180,.16]};
        const [f,d]=map[id]||map.click; this.tone(f,d,id==="bad"||id==="lose"?"sawtooth":"triangle");
      },
      scene(id){
        if(!this.ctx) return;
        clearInterval(this.interval);
        if(!GameState.data.settings.bgmOn) return;
        const scenes={home:[220,330],betting:[196,294],race:[247,370],result:[262,392],knowledge:[233,349],guide:[233,349],settings:[220,330]};
        const notes=scenes[id]||scenes.home;
        let i=0;
        this.interval=setInterval(()=>this.tone(notes[i++%notes.length],.45,"sine",.025,this.bgm),600);
      }
    };
