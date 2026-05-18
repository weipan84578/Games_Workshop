const Renderer = {
      canvas:null,ctx:null,
      init(){ this.canvas=document.getElementById("raceCanvas"); this.ctx=this.canvas.getContext("2d"); this.resize(); addEventListener("resize",()=>this.resize()); },
      resize(){ this.canvas.width=Math.min(innerWidth-40,760); this.canvas.height=innerWidth<480?280:innerWidth<768?340:420; },
      draw(){
        const c=this.ctx,w=this.canvas.width,h=this.canvas.height;
        c.clearRect(0,0,w,h);
        c.fillStyle="#1e6b36"; c.fillRect(0,0,w,h);
        const laneCount=Game.horses.length || 10;
        const laneHeight=(h-56)/laneCount;
        for(let i=0;i<laneCount;i++){ const y=28+i*laneHeight; c.fillStyle=i%2?"rgba(255,255,255,.05)":"rgba(0,0,0,.08)"; c.fillRect(0,y,w,laneHeight); c.strokeStyle="rgba(255,255,255,.22)"; c.strokeRect(0,y,w,laneHeight); }
        c.strokeStyle="#fff"; c.lineWidth=4; c.beginPath(); c.moveTo(w-28,18); c.lineTo(w-28,h-18); c.stroke();
        Game.horses.slice().sort((a,b)=>a.live.rank-b.live.rank).forEach((horse,i)=>{
          const laneY=28+(horse.gateNum-1)*laneHeight+(laneHeight/2);
          const x=18+horse.live.x*(w-56);
          const bob=Math.sin(horse.live.bobPhase)*4;
          c.fillStyle=horse.color; c.font=`${Math.max(16, Math.min(24, laneHeight*.8))}px serif`; c.fillText("🐎",x,laneY+bob);
          c.fillStyle="#fff"; c.font=`${Math.max(9, Math.min(12, laneHeight*.38))}px sans-serif`; c.fillText(horse.nameZh,x-2,laneY+Math.min(16,laneHeight*.62)+bob);
        });
      }
    };
