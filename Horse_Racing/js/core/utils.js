const Utils = {
      money:n=>"$ " + Math.round(n).toLocaleString("en-US"),
      clamp:(v,min,max)=>Math.min(max,Math.max(min,v)),
      rand:(min,max)=>Math.random()*(max-min)+min,
      pick:arr=>arr[Math.floor(Math.random()*arr.length)],
      shuffle:arr=>[...arr].sort(()=>Math.random()-.5),
    };
