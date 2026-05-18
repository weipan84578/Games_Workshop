const HorseEngine = {
      zh:["閃電王","黑旋風","追風者","天馬行空","神速","虎豹騰空","金風玉露","銀河快車","雷霆萬鈞","烈火戰駒","流星追月","驚雷破風","滄海一粟","萬馬奔騰","疾風驟雨"],
      en:["Lightning King","Storm Runner","Wind Chaser","Sky Dancer","Thunder Bolt","Golden Arrow","Silver Flash","Iron Hooves","Wild Spirit","Red Phoenix","Brave Heart","Midnight Star","Royal Dash","Desert Storm","Ocean Wave"],
      colors:["#e24b4a","#4aa3ff","#f5c76a","#9b7bff","#69d08d","#ff8f5a","#ff6fae","#72e0d1","#c7ef5f","#f29d49"],
      generate(){
        const picks=Utils.shuffle(this.zh.map((z,i)=>[z,this.en[i]])).slice(0,10);
        return picks.map((pair,i)=>{
          const tier=i===0?"strong":i===9?"weak":"mid";
          const base=tier==="strong"?[7,10]:tier==="weak"?[3,6]:[5,9];
          const s=()=>Math.round(Utils.rand(...base));
          const age=Math.round(Utils.rand(2,8));
          const grade=Utils.pick(["A","A","B","B","C"]);
          const horse={id:i+1,nameZh:pair[0],nameEn:pair[1],age,gateNum:i+1,color:this.colors[i],
            stats:{speed:s(),stamina:s(),burst:s(),stability:s(),turfAffinity:s(),dirtAffinity:s(),shortDist:s(),medDist:s(),longDist:s()},
            race:{mood:Utils.clamp(Utils.rand(.82,1.12),.7,1.15),fitness:Utils.rand(.82,1.1),jockeyGrade:grade,jockeyBonus:grade==="A"?.08:grade==="B"?.03:-.05,weight:Math.round(Utils.rand(53,59)),strategy:Utils.pick(["frontrun","balanced","closer"]),statusTag:Utils.pick(["狀態極佳","狀態不穩","初次參賽","遠征適應","傷後復出"])},
            live:{x:0,speed:0,energy:100,rank:i+1,events:[],bobPhase:0,finished:false,finishTime:null,eventFrames:0,eventMod:0}
          };
          return horse;
        });
      },
      score(h, race){
        const affinity=race.track==="草地"?h.stats.turfAffinity:h.stats.dirtAffinity;
        const distance=race.distance<=1200?h.stats.shortDist:h.stats.medDist;
        return h.stats.speed*4+h.stats.stamina*3+h.stats.burst*3+affinity*2+distance*2+h.race.fitness*10+h.race.mood*10+h.race.jockeyBonus*100;
      }
    };
