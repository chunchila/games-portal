(async()=>{
const app=document.getElementById('app');
const cv=document.createElement('canvas');cv.id='cv';app.appendChild(cv);const g=cv.getContext('2d');
const tb=D.topbar('אוניקס והדרקונים','<span id="hr" style="display:flex;gap:2px"></span><button class="tb-btn" id="ps" aria-label="הפסקה">'+D.icon('pause')+'</button>');
const IM=await D.loadImgs({jungle:'../../assets/bg/jungle.webp',volcano:'../../assets/bg/volcano.webp',sky:'../../assets/bg/sky.webp',run:'../../assets/heroes/onyx_run.webp',jump:'../../assets/heroes/onyx_jump.webp',attack:'../../assets/heroes/onyx_attack.webp',idle:'../../assets/heroes/onyx_idle.webp',rock:'../../assets/props/rock.webp',thorn:'../../assets/props/thorn.webp',crystal:'../../assets/props/crystal.webp',egg:'../../assets/props/dragonegg.webp',rap:'../../assets/dino/rap.webp',ptero:'../../assets/dino/ptero.webp',storm:'../../assets/dragons/storm.webp',ember:'../../assets/dragons/ember.webp',baby:'../../assets/dragons/baby.webp'});
let W,H,LW,LH,S,GY,PH=96;
function rs(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;if(H>W){LW=420;S=W*d/LW;LH=H*d/S}else{LH=360;S=H*d/LH;LW=W*d/S}GY=LH*(H>W?.78:.8);PH=H>W?112:96}
rs();addEventListener('resize',rs);
const STAGES=[{bg:'jungle',t:26,bosses:['storm'],name:'שלב 1: יער הדינוזאורים'},{bg:'volcano',t:28,bosses:['ember'],name:'שלב 2: הר הגעש'},{bg:'sky',t:30,bosses:['storm','ember'],name:'שלב 3: ממלכת השמיים'}];
const BOSS={storm:{hp:8,w:190,col:'#bfe9ff',glow:'#3ab4ff'},ember:{hp:10,w:200,col:'#ffd27a',glow:'#ff5a1f'}};
let mode='title',st,stage,time,hearts,hits,score,scroll,P,obs,orbs,eps,parts,boss,bi,inv,spawnT,pausedMode,bossShots;

function pw(img){return PH*img.width/img.height}
function reset(){stage=0;hearts=3;hits=0;score=0;startStage()}
function startStage(){st=STAGES[stage];time=0;scroll=0;obs=[];orbs=[];eps=[];parts=parts||[];boss=null;bi=0;inv=0;spawnT=1.5;P={x:LW*.2,y:GY-PH,vy:0,j:0,cd:0,atk:0};mode='play';sethr();banner(st.name)}
function sethr(){tb.querySelector('#hr').innerHTML=[0,1,2].map(i=>D.icon('heart').replace('<svg','<svg style="width:26px;height:26px;'+(i>=hearts?'filter:grayscale(1) opacity(.45)':'')+'"')).join('')}
const bn=document.createElement('div');bn.id='banner';document.body.appendChild(bn);
function banner(t){bn.textContent=t;bn.classList.remove('show');void bn.offsetWidth;bn.classList.add('show')}
// controls
const bj=document.createElement('button'),bs=document.createElement('button');bj.id='bj';bs.id='bs';bj.className=bs.className='ctl noselect';
bj.innerHTML='<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 3 4 12h5v9h6v-9h5z"/></svg>';bs.innerHTML='<svg viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="9" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/></svg>';
bj.setAttribute('aria-label','קפיצה');bs.setAttribute('aria-label','ירי צל');document.body.append(bj,bs);
function jump(){if(mode!=='play'&&mode!=='boss')return;if(P.j<2){P.vy=-LH*(P.j?1.55:1.75);P.j++;D.sfx('jump');for(let i=0;i<8;i++)parts.push({x:P.x+30,y:P.y+PH,vx:D.rnd(-60,20),vy:D.rnd(-80,-10),l:.5,m:.5,r:D.rnd(2,5)})}}
function shoot(){if(mode!=='play'&&mode!=='boss')return;if(P.cd>0)return;P.cd=.35;P.atk=.25;orbs.push({x:P.x+pw(IM.attack)*.6,y:P.y+PH*.42,vx:LW*1.1});D.sfx('shoot')}
['pointerdown'].forEach(e=>{bj.addEventListener(e,ev=>{ev.preventDefault();jump()});bs.addEventListener(e,ev=>{ev.preventDefault();shoot()})});
cv.addEventListener('pointerdown',e=>{e.preventDefault();jump()});
addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='ArrowUp'||e.code==='KeyW'){e.preventDefault();jump()}if(e.code==='KeyX'||e.code==='KeyF'||e.code==='ArrowRight'||e.code==='KeyD'){shoot()}if(e.code==='KeyP')pause()});
function pause(){if(mode==='play'||mode==='boss'){pausedMode=mode;mode='pause';D.dialog({title:'הפסקה',text:'מוכנים להמשיך?',buttons:[{label:'המשיכו',cls:'green',onClick:()=>{mode=pausedMode;last=performance.now()}},{label:'התחילו מחדש',cls:'alt',onClick:()=>reset()}]})}}
tb.querySelector('#ps').onclick=pause;document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
// title
const ti=document.createElement('div');ti.id='title';ti.innerHTML='<div class="bgi"></div><img class="hero" src="../../assets/heroes/onyx_idle.webp" alt=""><h1>אוניקס והדרקונים</h1><p>אוניקס, גיבור הצל הנוזלי, חייב להציל את ביצת הדרקון! קפצו מעל מכשולים, ירו כדורי צל והביסו את הדרקונים.</p><div class="how"><span>קפיצה: הכפתור הימני (אפשר פעמיים!)</span></div><button class="btn" id="go">התחילו את ההרפתקה</button>';
document.body.appendChild(ti);ti.querySelector('#go').onclick=()=>{ti.remove();D.unlock();D.music('hero');reset()};
// spawn
function spawn(){const r=Math.random(),x=LW+60;
 if(r<.28)obs.push({k:'rock',x,w:54,h:44,y:GY-44});
 else if(r<.46)obs.push({k:'thorn',x,w:56,h:42,y:GY-42});
 else if(r<.66)obs.push({k:'rap',x,w:80,h:60,y:GY-60,v:90+stage*30,hp:1});
 else if(r<.82)obs.push({k:'ptero',x,w:90,h:50,y:GY-D.rnd(100,150),v:60,hp:1,ph:D.rnd(0,6)});
 else if(r<.97){const y=GY-D.rnd(40,170);for(let i=0;i<3;i++)obs.push({k:'crystal',x:x+i*44,w:30,h:36,y:y-(i===1?14:0)})}
 else obs.push({k:'egg',x,w:34,h:44,y:GY-120})}
function hurt(){if(inv>0||window.__god)return;hearts--;hits++;inv=1.6;sethr();D.sfx('hit');D.burst(...sc(P.x+30,P.y+40),'#19e0ff',16);
 if(hearts<=0){mode='over';D.stopMusic();D.sfx('lose');D.dialog({title:'אוי! ננסה שוב?',text:'אוניקס לא מוותר. עוד ניסיון ואתם מצילים את הביצה!',buttons:[{label:D.icon('replay')+' שוב',cls:'alt',onClick:()=>{D.music('hero');reset()}},{label:'לדף הבית',cls:'green',onClick:()=>location.href='/'}]})}}
function hit(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function startBoss(){const k=st.bosses[bi];const b=BOSS[k];boss={k,hp:b.hp,max:b.hp,x:LW+250,tx:LW-b.w*.75,w:b.w,h:b.w*IM[k].height/IM[k].width,t:0,shot:1.2,flash:0};mode='boss';obs=obs.filter(o=>o.x<LW);D.sfx('roar');banner(k==='storm'?'דרקון הברק!':'דרקון הלהבות!')}
async function clear(){mode='clear';D.sfx('win');D.confetti(100);
 if(stage<2){banner('השלב הושלם!');await D.sleep(2400);stage++;startStage()}
 else fin()}
async function fin(){const s=hits<=1?3:hits<=4?2:1;D.stars.set('adventure',s);D.stopMusic();D.sfx('win');D.confetti(200);
 await D.dialog({title:'הצלתם את הביצה!',stars:s,text:`<img src="../../assets/dragons/baby.webp" style="height:110px"><br>דרקון קטן בקע מהביצה ואומר תודה לאוניקס! אספתם ${score} קריסטלים.`,buttons:[{label:D.icon('replay')+' שוב',cls:'alt',onClick:()=>{D.music('hero');reset()}},{label:'לדף הבית',cls:'green',onClick:()=>location.href='/'}]})}
// update
function upd(dt){
 const sp=LW*.42;scroll+=sp*dt;
 P.vy+=LH*4.6*dt;P.y+=P.vy*dt;if(P.y>=GY-PH){P.y=GY-PH;P.vy=0;P.j=0}P.cd-=dt;P.atk-=dt;inv-=dt;
 if(Math.random()<dt*40)parts.push({x:P.x+10,y:P.y+PH*D.rnd(.2,.9),vx:D.rnd(-90,-30),vy:D.rnd(-20,20),l:.6,m:.6,r:D.rnd(1.5,4)});
 if(mode==='play'){time+=dt;spawnT-=dt;if(spawnT<=0){spawn();spawnT=D.rnd(.9,1.7)-stage*.12}
  if(time>=st.t&&obs.every(o=>o.x<LW))startBoss()}
 for(const o of obs){o.x-=(sp+(o.v||0))*dt;if(o.k==='ptero')o.y+=Math.sin((scroll/60)+o.ph)*20*dt}
 obs=obs.filter(o=>o.x>-140);
 for(const o of orbs)o.x+=o.vx*dt;
 for(const o of orbs){for(const b of obs){if(b.dead||b.k==='rock'||b.k==='crystal'||b.k==='egg')continue;if(hit({x:o.x-9,y:o.y-9,w:18,h:18},b)){b.dead=true;o.dead=true;D.sfx('pop');D.burst(...sc(b.x+b.w/2,b.y+b.h/2),'#8b5cf6',14)}}
  if(boss&&hit({x:o.x-9,y:o.y-9,w:18,h:18},{x:boss.x+boss.w*.15,y:GY-boss.h-30+boss.t*0,w:boss.w*.7,h:boss.h})){o.dead=true;boss.hp--;boss.flash=.15;D.sfx('hit');D.burst(...sc(boss.x+boss.w/2,GY-boss.h*.6),BOSS[boss.k].glow,12);
   if(boss.hp<=0){D.sfx('boom');D.burst(...sc(boss.x+boss.w/2,GY-boss.h*.6),'#ffd23c',60);boss=null;eps=[];bi++;if(bi>=st.bosses.length)clear();else{mode='play';time=st.t;banner('עוד דרקון!');setTimeout(()=>{if(mode==='play')startBoss()},1800)}}}}
 orbs=orbs.filter(o=>!o.dead&&o.x<LW+40);obs=obs.filter(o=>!o.dead);
 const pr={x:P.x+22,y:P.y+14,w:pw(IM.run)-44,h:PH-22};
 for(const o of obs){if(!hit(pr,{x:o.x+6,y:o.y+6,w:o.w-12,h:o.h-12}))continue;
  if(o.k==='crystal'){o.dead=true;score++;D.sfx('coin');D.burst(...sc(o.x+15,o.y+18),'#5ce1ff',8)}
  else if(o.k==='egg'){o.dead=true;if(hearts<3){hearts++;sethr()}D.sfx('match');D.confetti(30);score+=3}
  else hurt()}
 obs=obs.filter(o=>!o.dead);
 if(boss){boss.t+=dt;if(boss.x>boss.tx)boss.x-=LW*.3*dt;boss.flash-=dt;boss.shot-=dt;
  if(boss.shot<=0&&boss.x<=boss.tx+4){boss.shot=D.rnd(1.2,1.9);const hi=Math.random()<.5;eps.push({x:boss.x+boss.w*.1,y:hi?GY-140:GY-18,r:hi?14:13,vx:-LW*.55,hi});D.sfx('shoot')}}
 for(const e of eps){e.x+=e.vx*dt;if(hit(pr,{x:e.x-e.r,y:e.y-e.r,w:e.r*2,h:e.r*2}))hurt()}
 eps=eps.filter(e=>e.x>-30);
 for(const p of parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt}parts=parts.filter(p=>p.l>0)}
function sc(x,y){const d=Math.min(devicePixelRatio||1,2);return[x*S/d,y*S/d]}
// draw
function tile(img,sp,y,h){const w=h*img.width/img.height;const pos=(scroll*sp)%(2*w);for(let k=0;k*w-pos<LW;k++){const x=k*w-pos;g.save();if(k%2){g.translate(x+w,y);g.scale(-1,1);g.drawImage(img,0,0,w+1,h)}else g.drawImage(img,x,y,w+1,h);g.restore()}}
function draw(){
 g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,cv.width,cv.height);g.setTransform(S,0,0,S,0,0);
 const bg=IM[st?st.bg:'sky'];if(bg){tile(bg,.12,0,GY+40);}
 const gr=g.createLinearGradient(0,GY,0,LH);gr.addColorStop(0,st&&st.bg==='volcano'?'#3a1c1c':st&&st.bg==='sky'?'#1a2350':'#1f3a1f');gr.addColorStop(1,'#07080f');g.globalAlpha=.92;g.fillStyle=gr;g.fillRect(0,GY,LW,LH-GY);g.globalAlpha=1;
 g.fillStyle='rgba(120,255,255,.35)';g.fillRect(0,GY,LW,2);
 for(let i=0;i<14;i++){const x=((i*70-scroll*1.0)%(LW+70)+LW+70)%(LW+70)-20;g.fillStyle='rgba(255,255,255,.07)';g.fillRect(x,GY+8+(i%3)*14,26,3)}
 if(!st||mode==='title')return;
 for(const o of obs){const im=IM[o.k==='crystal'?'crystal':o.k];if(o.k==='crystal'||o.k==='egg'){g.save();g.shadowColor=o.k==='egg'?'#ffd23c':'#37e6ff';g.shadowBlur=14;g.drawImage(im,o.x,o.y+Math.sin(scroll/30+o.x)*3,o.w,o.h);g.restore()}
  else if(o.k==='rap'||o.k==='ptero'){g.save();g.translate(o.x+o.w,o.y);g.scale(-1,1);g.drawImage(im,0,0,o.w,o.w*im.height/im.width);g.restore()}
  else g.drawImage(im,o.x,o.y,o.w+10,o.h+6)}
 if(boss){const b=IM[boss.k];const by=GY-boss.h-30+Math.sin(boss.t*2.4)*10;g.save();if(boss.flash>0)g.filter='brightness(2.2)';g.shadowColor=BOSS[boss.k].glow;g.shadowBlur=26;g.drawImage(b,boss.x,by,boss.w,boss.h);g.restore();
  const bw=LW*.4,bx=LW-bw-16,byy=LH>500?76:58;g.fillStyle='rgba(0,0,0,.6)';g.fillRect(bx-3,byy-3,bw+6,14);g.fillStyle=BOSS[boss.k].glow;g.fillRect(bx,byy,bw*boss.hp/boss.max,8)}
 for(const e of eps){g.save();g.shadowColor=e.hi?'#37b6ff':'#ff5a1f';g.shadowBlur=20;const gg=g.createRadialGradient(e.x,e.y,1,e.x,e.y,e.r);gg.addColorStop(0,'#fff');gg.addColorStop(1,e.hi?'#37b6ff':'#ff7a1f');g.fillStyle=gg;g.beginPath();g.arc(e.x,e.y,e.r,0,7);g.fill();g.restore()}
 for(const o of orbs){g.save();g.shadowColor='#19e0ff';g.shadowBlur=18;g.fillStyle='#14061f';g.beginPath();g.arc(o.x,o.y,9,0,7);g.fill();g.strokeStyle='#37e6ff';g.lineWidth=2;g.stroke();g.restore()}
 g.save();g.globalCompositeOperation='lighter';for(const p of parts){g.globalAlpha=Math.max(0,p.l/p.m);g.fillStyle='#19e0ff';g.beginPath();g.arc(p.x,p.y,p.r,0,7);g.fill()}g.restore();
 if(mode!=='over'){const air=P.y<GY-PH-2;const im=P.atk>0?IM.attack:air?IM.jump:IM.run;const w=pw(im);g.save();if(inv>0&&Math.floor(inv*12)%2)g.globalAlpha=.35;g.shadowColor='#19e0ff';g.shadowBlur=16;const bob=air?0:Math.abs(Math.sin(scroll/14))*-4;
  g.drawImage(im,P.x,P.y+bob,w,PH);g.restore();g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(P.x+w/2,GY+4,w*.35*(air?.6:1),6,0,0,7);g.fill()}
 // hud
 if(mode==='play'){g.fillStyle='rgba(0,0,0,.45)';g.fillRect(16,LH>500?64:54,LW*.3,6);g.fillStyle='#19e0ff';g.fillRect(16,LH>500?64:54,LW*.3*Math.min(1,time/st.t),6)}
 g.fillStyle='#fff';g.font='700 15px Rubik';g.textAlign='right';g.fillText('קריסטלים: '+score,LW-16,LH>500?110:100)}
let last=performance.now();
function loop(t){const dt=Math.min(.05,(t-last)/1000);last=t;if(mode==='play'||mode==='boss'||mode==='clear')upd(dt);draw();requestAnimationFrame(loop)}
window.__adv={get s(){return{mode,stage,hearts,time,hits,boss:boss&&boss.hp}},set(k,v){eval(k+'='+v)},go(n){stage=n;startStage()}};
requestAnimationFrame(loop);
})();
