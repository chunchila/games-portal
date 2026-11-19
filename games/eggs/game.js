(async()=>{
const app=document.getElementById('app');
document.body.insertAdjacentHTML('afterbegin','<div class="sun"></div><div class="cloud" style="top:90px;animation-delay:-10s"></div><div class="cloud" style="top:150px;transform:scale(.7);animation-duration:55s;animation-delay:-30s"></div><div class="hill h2"></div><div class="hill h1"></div>');
const tb=D.topbar('ספירת ביצים','<span class="hearts" id="hr"></span>');
const KIDS=['tri','stego','trex','bra','rap','anky','spino'];
const COLS=[{n:'כחולות',h:170,c:'#3d8bff'},{n:'ירוקות',h:85,c:'#2fb55a'},{n:'ורודות',h:300,c:'#ff5fa8'}];
await D.preload(['../../assets/props/egg.webp',...KIDS.map(k=>`../../assets/dino/${k}.webp`)]);
D.music('meadow');
let round,hearts,mist;const R=8;
function setHearts(){tb.querySelector('#hr').innerHTML=[0,1,2].map(i=>D.icon('heart').replace('<svg','<svg class="'+(i>=hearts?'lost':'')+'"')).join('')}
function newGame(){round=0;hearts=3;mist=0;setHearts();next()}
function place(n){const pts=[];let tries=0;const minD=.24;
 while(pts.length<n&&tries<4000){tries++;const p={x:D.rnd(.12,.88),y:D.rnd(.14,.86)};if(pts.every(q=>Math.hypot((q.x-p.x),(q.y-p.y)*1.1)>minD*(tries>2500?.7:1)))pts.push(p)}
 return pts}
async function next(){
 round++;if(round>R)return fin();
 const mixed=round>=5;let n=round<=2?D.ri(2,5):round<=4?D.ri(4,7):D.ri(3,5);
 let col=null,total=n,colorsArr=[];
 if(mixed){col=D.pick(COLS);const others=COLS.filter(c=>c!==col);const extra=D.ri(2,4);total=n+extra;colorsArr=D.shuffle([...Array(n).fill(col),...Array.from({length:extra},()=>D.pick(others))])}
 app.innerHTML=`<div id="q">${mixed?`כמה ביצים <b style="background:${col.c}">${col.n}</b> יש?`:'כמה ביצים יש?'}</div><div id="field"></div><div id="hint">${mixed?'ספרו רק את הצבע המבוקש':'לחצו על כל ביצה כדי לספור'}</div><div id="ans"></div>`;
 let opts=new Set([n]);while(opts.size<3+(round>4?1:0)){const v=Math.max(1,n+D.ri(-2,2));if(v!==n||opts.size===0)opts.add(v);if(opts.size<3&&Math.random()<.2)opts.add(n+D.ri(1,3))}
 opts=D.shuffle([...opts]).slice(0,3+(round>4?1:0));if(!opts.includes(n))opts[0]=n;opts=D.shuffle(opts);
 const ans=app.querySelector('#ans');ans.innerHTML=opts.map(v=>`<button>${v}</button>`).join('');
 const field=app.querySelector('#field');const pts=place(total);let cnt=0;const eggs=[];
 pts.forEach((p,i)=>{const e=document.createElement('div');e.className='egg noselect';e.style.left=p.x*100+'%';e.style.top=p.y*100+'%';e.style.zIndex=Math.round(p.y*100);
  const c=mixed?colorsArr[i]:null;const f=mixed?`hue-rotate(${c.h}deg) saturate(1.7)`:'none';e.dataset.col=c?c.n:'';
  e.innerHTML=`<img src="../../assets/props/egg.webp" style="filter:${f} drop-shadow(0 8px 5px rgba(0,0,0,.28));animation-delay:${i*70}ms"><span class="n"></span>`;
  e.onclick=()=>{if(e.classList.contains('c'))return;e.classList.add('c');cnt++;e.querySelector('.n').textContent=cnt;D.sfx('tap')};
  field.appendChild(e);eggs.push(e)});
 ans.querySelectorAll('button').forEach(b=>b.onclick=async()=>{
  const v=+b.textContent;if(ans.dataset.lock)return;
  if(v===n){ans.dataset.lock=1;D.sfx('ok');
   eggs.forEach(e=>{e.classList.add('c');});let k=0;eggs.forEach((e,i)=>{if(mixed&&e.dataset.col!==col.n)return;e.querySelector('.n').textContent=++k});
   await D.sleep(500);D.sfx('hatch');
   const hatching=eggs.filter(e=>!mixed||e.dataset.col===col.n);hatching.forEach(e=>e.classList.add('hatch'));await D.sleep(650);
   hatching.forEach(e=>{const d=document.createElement('img');d.className='dino';d.src=`../../assets/dino/${D.pick(KIDS)}.webp`;d.style.left=e.style.left;d.style.top=e.style.top;d.style.zIndex=e.style.zIndex;const r=e.getBoundingClientRect();field.appendChild(d);e.remove();D.burst(r.left+r.width/2,r.top+r.height/2,null,10)});
   D.confetti(50);await D.sleep(1500);next()}
  else{D.sfx('bad');b.classList.add('no');mist++;hearts--;setHearts();b.disabled=true;
   if(hearts<=0){D.sfx('lose');await D.sleep(500);await D.dialog({title:'אוי, כמעט!',text:'ננסה שוב? תספרו לאט ובזהירות.',buttons:[{label:D.icon('replay')+' שוב',cls:'alt',onClick:newGame}]})}}
 })}
async function fin(){const st=hearts>=3?3:hearts===2?2:1;D.stars.set('eggs',st);D.sfx('win');D.confetti(160);
 await D.dialog({title:'ספרתם נפלא!',stars:st,text:'כל הביצים בקעו ותינוקות הדינוזאורים שמחים.',buttons:[{label:D.icon('replay')+' שוב',cls:'alt',onClick:newGame},{label:'לדף הבית',cls:'green',onClick:()=>location.href='/'}]})}
newGame();
})();
