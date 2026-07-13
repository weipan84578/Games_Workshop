describe('Arcade Mode',function(){
  it('keeps exactly five physical balls in the machine',function(){assertEqual(BB.Constants.BALL_COUNT,5);});
  it('uses a visible slow-return duration',function(){assert(BB.Constants.RETURN_DURATION>=1.2&&BB.Constants.RETURN_DURATION<=2.5);});
  it('uses high-energy gravity',function(){assert(BB.Constants.GRAVITY>=1700);});
  it('provides at least four BGM arrangements',function(){assert(BB.SoundLibrary.tracks.length>=4);});
  it('defines exactly three increasing score gates',function(){var levels=BB.Constants.LEVELS;assertEqual(levels.length,3);assert(levels[0].target<levels[1].target&&levels[1].target<levels[2].target);});
  it('keeps stage one still and accelerates later stages',function(){var levels=BB.Constants.LEVELS;assertEqual(levels[0].hoopSpeed,0);assert(levels[1].hoopSpeed>0);assert(levels[2].hoopSpeed>levels[1].hoopSpeed);});
  it('activates double scoring for the final ten seconds',function(){assertEqual(BB.Constants.DOUBLE_TIME,10);});
  it('keeps a forgiving playable hoop opening',function(){var opening=BB.Constants.HOOP_WIDTH-2*(BB.Constants.BALL_RADIUS+BB.Constants.RIM_COLLISION_RADIUS);assert(opening>=95);});
});
