class AudioEngine{
  constructor(){this.ctx=null}
  ensure(){if(!this.ctx)this.ctx=new (window.AudioContext||window.webkitAudioContext)()}
  tone(freq,dur=.08,type='sine',gain=.03){
    if(!save.data.settings.sfxVolume)return;
    this.ensure();
    const o=this.ctx.createOscillator(),g=this.ctx.createGain();
    o.type=type;o.frequency.value=freq;g.gain.value=gain*(save.data.settings.sfxVolume/100);
    o.connect(g).connect(this.ctx.destination);o.start();
    g.gain.exponentialRampToValueAtTime(.0001,this.ctx.currentTime+dur);o.stop(this.ctx.currentTime+dur)
  }
  paddleHit(){
    this.tone(420,.05,'square',.025);
    setTimeout(()=>this.tone(560,.07,'triangle',.02),24)
  }
  brickBreak(){
    this.tone(520,.045,'triangle',.028);
    setTimeout(()=>this.tone(760,.08,'sawtooth',.018),18)
  }
  loseBall(){
    this.tone(220,.12,'sine',.03);
    setTimeout(()=>this.tone(165,.16,'triangle',.026),90);
    setTimeout(()=>this.tone(110,.22,'sine',.022),190)
  }
}
