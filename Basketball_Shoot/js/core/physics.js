(function(BB){
  'use strict';
  var C=BB.Constants,M=BB.MathUtils;
  function step(body,dt){var drag=Math.max(0,1-C.AIR_DRAG*dt);body.vx*=drag;body.vy=body.vy*drag+C.GRAVITY*dt;body.x+=body.vx*dt;body.y+=body.vy*dt;body.rotation+=(Math.abs(body.vx)+Math.abs(body.vy)*.18)/body.radius*dt;return body;}
  function trajectory(start,velocity,time){return{x:start.x+velocity.x*time,y:start.y+velocity.y*time+.5*C.GRAVITY*time*time};}
  function reflect(velocity,normal,restitution){var dot=velocity.x*normal.x+velocity.y*normal.y,r=typeof restitution==='number'?restitution:.72;return{x:(velocity.x-2*dot*normal.x)*r,y:(velocity.y-2*dot*normal.y)*r};}
  function circleCollision(ball,point,radius,restitution){var dx=ball.x-point.x,dy=ball.y-point.y,dist=Math.hypot(dx,dy),min=ball.radius+radius;if(dist>=min||!dist)return false;var nx=dx/dist,ny=dy/dist,v=reflect({x:ball.vx,y:ball.vy},{x:nx,y:ny},typeof restitution==='number'?restitution:.72);ball.x=point.x+nx*min;ball.y=point.y+ny*min;ball.vx=v.x;ball.vy=v.y;return true;}
  function dragToShot(start,end){var dx=end.x-start.x,dy=end.y-start.y,d=Math.hypot(dx,dy),up=-dy/d;if(d<35||dy>=0||up<.35)return{x:0,y:0,power:0};var power=M.clamp(d*6.6,0,1950);return{x:dx/d*power*.72,y:-up*power*1.1,power:power};}
  BB.Physics={step:step,trajectory:trajectory,reflect:reflect,circleCollision:circleCollision,dragToShot:dragToShot};
})(window.BB=window.BB||{});
