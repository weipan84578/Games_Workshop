const UncertaintySystem = {
      weather(){
        const r=Math.random();
        if(r<.4) return {name:"晴天",icon:"☀️",speed:1,track:"草地",trackBonus:.05,condition:"良好 (Good)",softness:1};
        if(r<.7) return {name:"多雲",icon:"⛅",speed:1,track:"草地",trackBonus:0,condition:"良好 (Good)",softness:1};
        if(r<.9) return {name:"小雨",icon:"🌧",speed:.97,track:"泥地",trackBonus:.1,condition:"稍軟 (Good to Soft)",softness:1.1};
        return {name:"大雨",icon:"⛈",speed:.92,track:"泥地",trackBonus:.2,condition:"軟地 (Soft)",softness:1.25};
      },
      event(horse){
        const events=[
          ["失蹄",-0.25,30,"出現失蹄！",false,.04],
          ["受阻",-0.15,20,"遭到阻擋！",false,.06],
          ["意外加速",.20,15,"突然發力！",true,.05],
          ["換跑道",-0.05,10,"偏出跑道",false,.08],
          ["受嚇",-0.30,40,"受驚慢下！",false,.03],
          ["第二風",.15,25,"後勁發力！",true,.04]
        ];
        for(const e of events){
          const chance=e[5]*(e[4]?1:(1-horse.stats.stability/20));
          if(Math.random()<chance) return {name:e[0],mod:e[1],frames:e[2],text:`${horse.nameZh} ${e[3]}`,good:e[4]};
        }
        return null;
      }
    };
