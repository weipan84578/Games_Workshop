(function(BB){
'use strict';
var BASE_BGM_VOLUME=.1,BGM_VOLUME_MULTIPLIER=10,GAIN_HARD_CAP=3;
function rawGain(userVolume){return Number(userVolume)*BGM_VOLUME_MULTIPLIER;}
function finalGain(userVolume){return Math.min(rawGain(userVolume),GAIN_HARD_CAP);}

function AudioManager(){
  this.ctx=null;this.master=null;this.bgm=null;this.sfx=null;
  this.bgmVolume=.3;this.sfxVolume=.7;this.muted=false;
  this.timer=null;this.beat=0;this.mode='menu';
}

AudioManager.prototype.init=function(){
  if(this.ctx)return;
  var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  this.ctx=new AC();
  this.master=this.ctx.createDynamicsCompressor();
  this.master.threshold.value=-12;this.master.knee.value=14;this.master.ratio.value=5;this.master.attack.value=.003;this.master.release.value=.18;
  this.bgm=this.ctx.createGain();this.sfx=this.ctx.createGain();
  this.bgm.connect(this.master);this.sfx.connect(this.master);this.master.connect(this.ctx.destination);this.apply();
};
AudioManager.prototype.resume=function(){this.init();if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume();};
AudioManager.prototype.apply=function(){if(!this.ctx)return;this.bgm.gain.value=this.muted?0:Math.min(BASE_BGM_VOLUME*rawGain(this.bgmVolume),GAIN_HARD_CAP);this.sfx.gain.value=this.muted?0:this.sfxVolume;};
AudioManager.prototype.setVolumes=function(bgm,sfx){this.bgmVolume=BB.MathUtils.clamp(bgm,0,1);this.sfxVolume=BB.MathUtils.clamp(sfx,0,1);this.apply();};

AudioManager.prototype.pulse=function(frequency,duration,volume,type,destination,delay){
  if(!this.ctx)return;var now=this.ctx.currentTime+(delay||0),osc=this.ctx.createOscillator(),gain=this.ctx.createGain();
  osc.type=type||'square';osc.frequency.setValueAtTime(frequency,now);
  gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(volume,now+.008);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
  osc.connect(gain);gain.connect(destination||this.sfx);osc.start(now);osc.stop(now+duration+.02);
};

AudioManager.prototype.tone=function(type,combo){
  if(!this.ctx||this.muted)return;
  var f={click:720,shoot:220,rim:390,score:880,count:760,end:520,start:440}[type]||550;
  if(type==='shoot'){this.pulse(115,.09,.16,'sawtooth');this.pulse(260,.12,.09,'triangle',this.sfx,.035);return;}
  if(type==='score'){f+=(combo||0)*42;this.pulse(f,.18,.2,'triangle');this.pulse(f*1.25,.23,.17,'sine',this.sfx,.07);this.pulse(f*1.5,.28,.14,'triangle',this.sfx,.14);return;}
  if(type==='start'){this.pulse(440,.12,.18,'square');this.pulse(660,.16,.17,'square',this.sfx,.1);this.pulse(880,.22,.16,'triangle',this.sfx,.2);return;}
  this.pulse(f,type==='end'?.55:.16,.18,type==='rim'?'square':'triangle');
};

AudioManager.prototype.startBgm=function(mode){
  var self=this;this.resume();this.stopBgm();this.mode=mode||'menu';this.beat=0;
  var intervals={menu:176,game:122,victory:150},speed=intervals[this.mode]||176;
  function tick(){
    if(!self.ctx||self.muted)return;
    var tracks=BB.SoundLibrary.tracks,track=self.mode==='game'?tracks[1]:self.mode==='victory'?tracks[3]:tracks[0],notes=track.notes;
    var index=self.beat%notes.length,f=notes[index],accent=self.beat%4===0;
    self.pulse(f,.12,accent?.052:.038,self.mode==='game'?'square':'triangle',self.bgm);
    if(self.beat%2===0)self.pulse(f/2,.16,.04,'sine',self.bgm);
    if(self.mode==='game'){
      self.pulse(accent?82:118,.045,accent?.045:.025,'square',self.bgm);
      if(self.beat%8===7)self.pulse(f*2,.08,.035,'triangle',self.bgm);
    }
    self.beat++;
  }
  tick();this.timer=setInterval(tick,speed);
};
AudioManager.prototype.stopBgm=function(){if(this.timer){clearInterval(this.timer);this.timer=null;}};

BB.AudioManager=AudioManager;
BB.AudioMath={BASE_BGM_VOLUME:BASE_BGM_VOLUME,BGM_VOLUME_MULTIPLIER:BGM_VOLUME_MULTIPLIER,GAIN_HARD_CAP:GAIN_HARD_CAP,getRawGain:rawGain,getFinalGain:finalGain};
})(window.BB=window.BB||{});
