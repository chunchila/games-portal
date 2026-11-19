(async()=>{
const app=document.getElementById('app');
const tb=D.topbar('מבוך הקריסטלים','<span class="hud" id="hud"></span>');
const HEROES={grom:'גרום',ferna:'פרנה'};
const IM=await D.loadImgs({grom:'../../assets/heroes/grom_face.webp',ferna:'../../assets/heroes/ferna_face.webp',crystal:'../../assets/props/crystal.webp',egg:'../../assets/props/dragonegg.webp'});
D.music('maze');
const LV=[5,6,7,8,9];let hero='grom',lvl=0,total=0;
function pick(){app.innerHTML=`<div id="pick"><h2>בחרו גיבור</h2><p>עזרו לו להגיע לביצת הדרקון ולאסוף קריסטלים בדרך. גררו עם האצבע כדי לזוז.</p><div class="heroes">${Object.keys(HEROES).map(k=>`<button class="hp" data-k="${k}"><img src="../../assets/heroes/${k}_face.webp" alt=""><div>${HEROES[k]}</div></button>`).join('')}</div></div>`;
 app.querySelectorAll('.hp').forEach(b=>b.onclick=()=>{hero=b.dataset.k;D.sfx('pop');lvl=0;total=0;level()})}
let raf=0;
function gen(c,r){const cell=[];for(let y=0;y<r;y++){cell.push([]);for(let x=0;x<c;x++)cell[y].push({x,y,w:{n:1,s:1,e:1,w:1},v:0})}
 const st=[cell[0][0]];cell[0][0].v=1;while(st.length){const a=st[st.length-1];const nb=[[0,-1,'n','s'],[0,1,'s','n'],[1,0,'e','w'],[-1,0,'w','e']].map(d=>({d,c:cell[a.y+d[1]]&&cell[a.y+d[1]][a.x+d[0]]})).filter(o=>o.c&&!o.c.v);
  if(!nb.length){st.pop();continue}const o=D.pick(nb);a.w[o.d[2]]=0;o.c.w[o.d[3]]=0;o.c.v=1;st.push(o.c)}
 // braid a few walls for loops
 for(let i=0;i<c*r*.06;i++){const x=D.ri(0,c-2),y=D.ri(0,r-1);cell[y][x].w.e=0;cell[y][x+1].w.w=0}
 return cell}
function bfs(cell,c,r){const d=Array.from({length:r},()=>Array(c).fill(-1));d[0][0]=0;const q=[[0,0]];while(q.length){const[x,y]=q.shift();const w=cell[y][x].w;[[0,-1,'n'],[0,1,'s'],[1,0,'e'],[-1,0,'w']].forEach(([dx,dy,k])=>{const nx=x+dx,ny=y+dy;if(!w[k]&&d[ny]&&d[ny][nx]===-1){d[ny][nx]=d[y][x]+1;q.push([nx,ny])}})}return d}
function level(){cancelAnimationFrame(raf);const c=LV[lvl];const aw=Math.min(innerWidth-20,520),ah=innerHeight-150;const cs0=aw/c;const r=Math.max(c,Math.min(Math.floor(ah/cs0),c+5));const cs=Math.min(cs0,ah/r);
 const cell=gen(c,r),dist=bfs(cell,c,r);let far=[0,0],fd=0;const mn=(c+r)*.6;dist.forEach((row,y)=>row.forEach((v,x)=>{if(x+y>=mn&&v>fd){fd=v;far=[x,y]}}));
 const cry=[];const cand=[];dist.forEach((row,y)=>row.forEach((v,x)=>{if(v>3&&!(x===far[0]&&y===far[1]))cand.push([x,y,v])}));D.shuffle(cand).slice(0,3).forEach(p=>cry.push({x:p[0]+.5,y:p[1]+.5,got:false}));
 app.innerHTML='<canvas id="cv"></canvas>';const cv=document.getElementById('cv'),dpr=Math.min(devicePixelRatio||1,2);cv.style.width=c*cs+'px';cv.style.height=r*cs+'px';cv.width=c*cs*dpr;cv.height=r*cs*dpr;const g=cv.getContext('2d');g.scale(dpr,dpr);
 const T=Math.max(5,cs*.11),R=cs*.27;const walls=[];
 for(const row of cell)for(const a of row){const x=a.x*cs,y=a.y*cs;if(a.w.n)walls.push([x-T/2,y-T/2,cs+T,T]);if(a.w.w)walls.push([x-T/2,y-T/2,T,cs+T]);if(a.y===r-1&&a.w.s)walls.push([x-T/2,y+cs-T/2,cs+T,T]);if(a.x===c-1&&a.w.e)walls.push([x+cs-T/2,y-T/2,T,cs+T])}
 const me={x:cs/2,y:cs/2};window.__maze={me,walls,cs,R};let got=0,done=false,vx=0,vy=0;const keys={};
 const hud=()=>tb.querySelector('#hud').innerHTML=`<span>שלב ${lvl+1}/5</span><span>${D.icon('star')} ${got}/3</span>`;hud();
 const hit=(px,py)=>walls.some(([x,y,w,h])=>{const cx=Math.max(x,Math.min(px,x+w)),cy=Math.max(y,Math.min(py,y+h));return(px-cx)**2+(py-cy)**2<R*R});
 // input
 let ts=null,tv=[0,0];cv.addEventListener('pointerdown',e=>{ts=[e.clientX,e.clientY];cv.setPointerCapture(e.pointerId);D.unlock()});
 cv.addEventListener('pointermove',e=>{if(!ts)return;let dx=e.clientX-ts[0],dy=e.clientY-ts[1];const m=Math.hypot(dx,dy);if(m>8){const k=Math.min(1,m/50)/m;tv=[dx*k,dy*k]}else tv=[0,0]});
 const up=()=>{ts=null;tv=[0,0]};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 const kd=e=>{keys[e.code]=1;if(e.code.startsWith('Arrow'))e.preventDefault()},ku=e=>{keys[e.code]=0};addEventListener('keydown',kd);addEventListener('keyup',ku);
 let last=performance.now(),t=0;const stop=()=>{removeEventListener('keydown',kd);removeEventListener('keyup',ku)};
 function frame(now){const dt=Math.min(.04,(now-last)/1000);last=now;t+=dt;
  let ix=tv[0]+(keys.ArrowRight||keys.KeyD?1:0)-(keys.ArrowLeft||keys.KeyA?1:0),iy=tv[1]+(keys.ArrowDown||keys.KeyS?1:0)-(keys.ArrowUp||keys.KeyW?1:0);const m=Math.hypot(ix,iy);if(m>1){ix/=m;iy/=m}
  if(!done){const sp=cs*3.6*dt;const nx=me.x+ix*sp;if(!hit(nx,me.y))me.x=nx;const ny=me.y+iy*sp;if(!hit(me.x,ny))me.y=ny;
   cry.forEach(k=>{if(!k.got&&Math.hypot(k.x*cs-me.x,k.y*cs-me.y)<cs*.4){k.got=true;got++;hud();D.sfx('coin');const b=cv.getBoundingClientRect();D.burst(b.left+k.x*cs,b.top+k.y*cs,'#5ce1ff',14)}});
   if(Math.hypot((far[0]+.5)*cs-me.x,(far[1]+.5)*cs-me.y)<cs*.38){done=true;stop();win()}}
  // draw
  g.clearRect(0,0,c*cs,r*cs);const bg=g.createLinearGradient(0,0,0,r*cs);bg.addColorStop(0,'#16314f');bg.addColorStop(1,'#0c1a2e');g.fillStyle=bg;g.fillRect(0,0,c*cs,r*cs);
  g.fillStyle='rgba(255,255,255,.04)';for(let y=0;y<r;y++)for(let x=0;x<c;x++)if((x+y)%2)g.fillRect(x*cs,y*cs,cs,cs);
  g.save();g.shadowColor='#19e0ff';g.shadowBlur=10;g.fillStyle='#3b7fb8';walls.forEach(([x,y,w,h])=>{g.beginPath();g.roundRect(x,y,w,h,T/2);g.fill()});g.restore();
  g.fillStyle='#8fd6ff';walls.forEach(([x,y,w,h])=>{g.fillRect(x+1,y+1,Math.max(1,w-2),Math.max(1,h*.3))});
  const gx=(far[0]+.5)*cs,gy=(far[1]+.5)*cs;g.save();g.shadowColor='#ffd23c';g.shadowBlur=22+Math.sin(t*4)*8;g.drawImage(IM.egg,gx-cs*.22,gy-cs*.3,cs*.44,cs*.6);g.restore();
  cry.forEach(k=>{if(k.got)return;const bob=Math.sin(t*3+k.x)*cs*.03;g.save();g.shadowColor='#37e6ff';g.shadowBlur=14;g.drawImage(IM.crystal,k.x*cs-cs*.2,k.y*cs-cs*.22+bob,cs*.4,cs*.44);g.restore()});
  g.save();g.shadowColor='#000';g.shadowBlur=8;g.beginPath();g.arc(me.x,me.y,R,0,7);g.fillStyle='#fff';g.fill();g.clip();const im=IM[hero];const sz=R*2.3;g.drawImage(im,0,0,im.width,im.width*.9,me.x-R*1.05,me.y-R*1.05,R*2.1,R*2.1);g.restore();g.beginPath();g.arc(me.x,me.y,R,0,7);g.strokeStyle='#ffd23c';g.lineWidth=3;g.stroke();
  if(!done)raf=requestAnimationFrame(frame)}
 raf=requestAnimationFrame(frame);
 async function win(){D.sfx('win');D.confetti(120);total+=got;const last=lvl===LV.length-1;
  if(last){const s=total>=13?3:total>=9?2:1;D.stars.set('maze',s);await D.dialog({title:'סיימתם את כל המבוכים!',stars:s,text:`אספתם ${total} קריסטלים מתוך 15 והצלתם את ביצת הדרקון.`,buttons:[{label:D.icon('replay')+' שוב',cls:'alt',onClick:pick},{label:'לדף הבית',cls:'green',onClick:()=>location.href='/'}]})}
  else await D.dialog({title:'הגעתם לביצה!',stars:got===3?3:got===2?2:1,text:`אספתם ${got} קריסטלים`,buttons:[{label:'לשלב הבא',cls:'green',onClick:()=>{lvl++;level()}}]})}
}
pick();
})();
