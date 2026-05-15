class MusicEngine{
  constructor(){this.started=false;this.timer=null;this.step=0}
  start(){
    if(this.started||!save.data.settings.musicVolume)return;
    audio.ensure();this.started=true;this.schedule()
  }
  stop(){clearTimeout(this.timer);this.timer=null;this.started=false}
  schedule(){
    if(!this.started)return;
    const progression=[
      ['C4','E4','G4','B4'],['A3','C4','E4','G4'],
      ['F3','A3','C4','E4'],['G3','B3','D4','F4']
    ];
    const notes={C4:261.63,E4:329.63,G4:392,B4:493.88,A3:220,F3:174.61,G3:196,B3:246.94,D4:293.66,F4:349.23};
    const chord=progression[Math.floor(this.step/8)%progression.length];
    const arp=chord[this.step%chord.length];
    this.pad(chord.map(n=>notes[n]),1.9);
    this.note(notes[arp],.72,.035,'triangle');
    if(this.step%8===0)this.note(notes[chord[0]]/2,1.4,.025,'sine');
    this.step++;
    this.timer=setTimeout(()=>this.schedule(),520)
  }
  note(freq,dur,gain,type){
    if(!save.data.settings.musicVolume)return;
    audio.ensure();
    const ctx=audio.ctx,o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();
    o.type=type;o.frequency.value=freq;f.type='lowpass';f.frequency.value=1200;
    const volume=gain*(save.data.settings.musicVolume/100);
    g.gain.setValueAtTime(.0001,ctx.currentTime);
    g.gain.linearRampToValueAtTime(volume,ctx.currentTime+.08);
    g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+dur);
    o.connect(f).connect(g).connect(ctx.destination);o.start();o.stop(ctx.currentTime+dur)
  }
  pad(freqs,dur){
    if(this.step%8!==0)return;
    freqs.forEach((freq,i)=>this.note(freq,dur,.012-i*.0015,'sine'))
  }
}
