(function(){
const D=window.D={};
const ls=(()=>{try{ArcadiaStorage.setItem('_t','1');ArcadiaStorage.removeItem('_t');return ArcadiaStorage}catch(e){const m={};return{getItem:k=>m[k]??null,setItem:(k,v)=>m[k]=String(v)}}})();
D.shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
D.sleep=ms=>new Promise(r=>setTimeout(r,ms));
D.ri=(a,b)=>a+(Math.random()*(b-a+1)|0);
D.rnd=(a,b)=>a+Math.random()*(b-a);
D.pick=a=>a[Math.random()*a.length|0];
D.preload=urls=>Promise.all(urls.map(u=>new Promise(r=>{const i=new Image();i.onload=i.onerror=()=>r(i);i.src=u;})));
D.loadImgs=async o=>{const out={};await Promise.all(Object.entries(o).map(([k,u])=>new Promise(r=>{const i=new Image();i.onload=()=>{out[k]=i;r()};i.onerror=()=>r();i.src=u;})));return out};
// stars
D.stars={get:g=>+(ls.getItem('dino:stars:'+g)||0),set:(g,n)=>{if(n>D.stars.get(g))ls.setItem('dino:stars:'+g,n)},total:()=>['memory','eggs','shadow','feed','sequence','maze','adventure'].reduce((s,g)=>s+D.stars.get(g),0)};
// audio
let ac=null,master=null,muted=ls.getItem('dino:muted')==='1';
function ctx(){if(!ac){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ac=new C();master=ac.createGain();master.gain.value=muted?0:.7;master.connect(ac.destination)}if(ac.state==='suspended')ac.resume();return ac}
D.unlock=()=>ctx();
['pointerdown','keydown','touchstart'].forEach(e=>addEventListener(e,()=>ctx(),{passive:true}));
function tone(f,t0,d,type='sine',v=.25,slide){const a=ctx();if(!a)return;const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,a.currentTime+t0);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,slide),a.currentTime+t0+d);g.gain.setValueAtTime(0,a.currentTime+t0);g.gain.linearRampToValueAtTime(v,a.currentTime+t0+.01);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+t0+d);o.connect(g);g.connect(master);o.start(a.currentTime+t0);o.stop(a.currentTime+t0+d+.05)}
function noise(t0,d,v=.2,fq=1200){const a=ctx();if(!a)return;const n=a.sampleRate*d|0,b=a.createBuffer(1,n,a.sampleRate),x=b.getChannelData(0);for(let i=0;i<n;i++)x[i]=(Math.random()*2-1)*(1-i/n);const s=a.createBufferSource();s.buffer=b;const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=fq;const g=a.createGain();g.gain.value=v;s.connect(f);f.connect(g);g.connect(master);s.start(a.currentTime+t0)}
const S={
pop:()=>tone(520,0,.1,'sine',.3,900),
tap:()=>tone(380,0,.07,'triangle',.25),
flip:()=>{tone(300,0,.08,'triangle',.2,600)},
ok:()=>{tone(660,0,.12,'triangle',.3);tone(880,.1,.18,'triangle',.3)},
match:()=>{[523,659,784].forEach((f,i)=>tone(f,i*.08,.2,'triangle',.3))},
bad:()=>{tone(220,0,.2,'sawtooth',.18,120)},
win:()=>{[523,659,784,1047,784,1047,1319].forEach((f,i)=>tone(f,i*.11,.28,'triangle',.3))},
lose:()=>{[392,330,262,196].forEach((f,i)=>tone(f,i*.18,.3,'triangle',.25))},
coin:()=>{tone(988,0,.07,'square',.12);tone(1319,.07,.25,'square',.12)},
jump:()=>tone(300,0,.18,'sine',.3,720),
shoot:()=>{tone(900,0,.15,'sawtooth',.12,200);noise(0,.1,.1,3000)},
hit:()=>{noise(0,.3,.35,700);tone(120,0,.25,'sawtooth',.25,50)},
roar:()=>{noise(0,.7,.3,500);tone(110,0,.7,'sawtooth',.25,60)},
munch:()=>{noise(0,.08,.3,2000);noise(.12,.08,.3,2000)},
hatch:()=>{noise(0,.15,.3,3000);[700,900,1200].forEach((f,i)=>tone(f,.1+i*.08,.15,'triangle',.25))},
whoosh:()=>noise(0,.25,.2,1500),
boom:()=>{noise(0,.5,.4,400);tone(90,0,.4,'sine',.4,40)}
};
D.sfx=n=>{if(muted)return;try{ctx();S[n]&&S[n]()}catch(e){}};
// music: simple looped arpeggios per theme
const THEMES={
jungle:{bpm:96,wave:'triangle',notes:[0,4,7,4,9,7,4,2],root:196,v:.07},
meadow:{bpm:110,wave:'sine',notes:[0,2,4,7,4,2,4,0],root:262,v:.07},
museum:{bpm:70,wave:'sine',notes:[0,7,3,7,5,7,3,0],root:147,v:.08},
comic:{bpm:128,wave:'square',notes:[0,0,7,0,5,5,3,2],root:196,v:.035},
maze:{bpm:92,wave:'triangle',notes:[0,3,7,10,7,3,0,-2],root:175,v:.07},
hero:{bpm:140,wave:'sawtooth',notes:[0,0,3,0,7,5,3,0,0,0,10,8,7,5,3,5],root:110,v:.045},
home:{bpm:104,wave:'triangle',notes:[0,4,7,12,7,4,9,5],root:220,v:.06}};
let mt=null,mname=null;
D.music=name=>{D.stopMusic();mname=name;if(muted)return;const th=THEMES[name];if(!th)return;const a=ctx();if(!a)return;let i=0;const step=60/th.bpm/2;mt=setInterval(()=>{if(muted||document.hidden)return;const n=th.notes[i++%th.notes.length];tone(th.root*Math.pow(2,n/12),0,step*1.6,th.wave,th.v);if(i%8===1)tone(th.root/2,0,step*6,'sine',th.v*1.4)},step*1000)};
D.stopMusic=()=>{if(mt)clearInterval(mt);mt=null};
D.isMuted=()=>muted;
D.setMuted=m=>{muted=m;ls.setItem('dino:muted',m?'1':'0');if(master)master.gain.value=m?0:.7;if(m)D.stopMusic();else if(mname)D.music(mname)};
// icons
const IC={
home:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 2 12h3v8h5v-5h4v5h5v-8h3z"/></svg>',
on:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 4V5L7 9zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>',
off:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 4V5L7 9zm13.6 3 2.4-2.4-1.4-1.4L15.2 10.6 12.8 8.2l-1.4 1.4L13.8 12l-2.4 2.4 1.4 1.4 2.4-2.4 2.4 2.4 1.4-1.4z"/></svg>',
pause:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>',
heart:'<svg viewBox="0 0 24 24" fill="#ff4d5e" stroke="#fff" stroke-width="1.2"><path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.800-8 11-8 11z"/></svg>',
star:'<svg viewBox="0 0 24 24"><path d="m12 2 2.9 6.6 7.1.7-5.400 4.700 1.600 7-6.200-3.700L5.800 21l1.600-7L2 9.300l7.100-.7z" fill="#ffc93c" stroke="#e59a00" stroke-width="1.2" stroke-linejoin="round"/></svg>',
starOff:'<svg viewBox="0 0 24 24"><path d="m12 2 2.9 6.6 7.1.7-5.400 4.700 1.600 7-6.200-3.700L5.800 21l1.600-7L2 9.300l7.100-.7z" fill="#d8d8e4" stroke="#b6b6c8" stroke-width="1.2" stroke-linejoin="round"/></svg>',
replay:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z"/></svg>'};
D.icon=n=>IC[n]||'';
D.stars_html=(n,max=3)=>'<div class="stars">'+Array.from({length:max},(_,i)=>i<n?IC.star.replace('<svg','<svg class="on"'):IC.starOff).join('')+'</div>';
D.topbar=(title,extraHTML='')=>{const t=document.createElement('div');t.className='topbar noselect';
t.innerHTML=`<a class="tb-btn" href="/" aria-label="בית">${IC.home}</a><div class="tb-title">${title||''}</div><div class="tb-extra">${extraHTML}</div><button class="tb-btn" id="tb-mute" aria-label="צליל">${muted?IC.off:IC.on}</button>`;
document.body.appendChild(t);const b=t.querySelector('#tb-mute');b.onclick=()=>{D.setMuted(!muted);b.innerHTML=muted?IC.off:IC.on;D.sfx('pop')};return t};
D.dialog=({title,text,stars,buttons})=>new Promise(res=>{const o=document.createElement('div');o.className='overlay';const c=document.createElement('div');c.className='card';
c.innerHTML=`<h2>${title||''}</h2>${stars!=null?D.stars_html(stars):''}<p>${text||''}</p><div class="row"></div>`;const row=c.querySelector('.row');
(buttons||[{label:'המשיכו'}]).forEach((b,i)=>{const x=document.createElement('button');x.className='btn '+(b.cls||'');x.innerHTML=b.label;x.onclick=()=>{o.remove();b.onClick&&b.onClick();res(i)};row.appendChild(x)});
o.appendChild(c);document.body.appendChild(o);return o});
// confetti
let cv=null,cx=null,parts=[],raf=0;
function ensure(){if(cv)return;cv=document.createElement('canvas');cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:200;pointer-events:none';document.body.appendChild(cv);cx=cv.getContext('2d');const rs=()=>{cv.width=innerWidth*devicePixelRatio;cv.height=innerHeight*devicePixelRatio};rs();addEventListener('resize',rs)}
function loop(){cx.clearRect(0,0,cv.width,cv.height);const k=devicePixelRatio;parts=parts.filter(p=>p.life>0);for(const p of parts){p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;p.life--;cx.save();cx.translate(p.x*k,p.y*k);cx.rotate(p.rot);cx.globalAlpha=Math.min(1,p.life/20);cx.fillStyle=p.c;if(p.round){cx.beginPath();cx.arc(0,0,p.s*k/2,0,7);cx.fill()}else cx.fillRect(-p.s*k/2,-p.s*k/4,p.s*k,p.s*k/2);cx.restore()}
if(parts.length)raf=requestAnimationFrame(loop);else{raf=0;cx.clearRect(0,0,cv.width,cv.height)}}
const COL=['#ff4d5e','#ffc93c','#3ecf7a','#3d8bff','#8b5cf6','#ff8a3d','#19c2c9'];
D.confetti=(n=120)=>{ensure();for(let i=0;i<n;i++)parts.push({x:innerWidth/2+D.rnd(-60,60),y:innerHeight*.35,vx:D.rnd(-7,7),vy:D.rnd(-13,-3),g:.28,rot:D.rnd(0,6),vr:D.rnd(-.3,.3),s:D.rnd(8,15),c:D.pick(COL),life:D.ri(70,130)});if(!raf)raf=requestAnimationFrame(loop)};
D.burst=(x,y,color,n=18)=>{ensure();for(let i=0;i<n;i++){const a=D.rnd(0,6.28),s=D.rnd(2,7);parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-2,g:.15,rot:0,vr:0,s:D.rnd(5,10),c:color||D.pick(COL),life:D.ri(25,50),round:true})}if(!raf)raf=requestAnimationFrame(loop)};

D.draggable=(el,o)=>{el.style.touchAction='none';let sx,sy,act=false,moved=false,id;
el.addEventListener('pointerdown',e=>{if(el.dataset.lock)return;act=true;moved=false;sx=e.clientX;sy=e.clientY;id=e.pointerId;el.setPointerCapture(id);el.style.transition='none';el.style.zIndex=90;o.onStart&&o.onStart(e);e.preventDefault()});
el.addEventListener('pointermove',e=>{if(!act)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)+Math.abs(dy)>6)moved=true;el.style.transform=`translate(${dx}px,${dy}px) scale(1.12)`});
const end=async e=>{if(!act)return;act=false;const ok=await o.onDrop(e.clientX,e.clientY,moved,e);if(ok!==true){el.style.transition='transform .35s cubic-bezier(.3,1.5,.5,1)';el.style.transform='';setTimeout(()=>{el.style.zIndex='';el.style.transition=''},360)}};
el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end)};
D.vh=()=>{const f=()=>document.documentElement.style.setProperty('--vh',innerHeight*.01+'px');f();addEventListener('resize',f)};D.vh();
})();
