(async()=>{
const CARDS=[['trex','טירנוזאורוס רקס','dino/trex'],['tri','טריצרטופס','dino/tri'],['stego','סטגוזאורוס','dino/stego'],['bra','ברכיאוזאורוס','dino/bra'],['rap','ולוסירפטור','dino/rap'],['anky','אנקילוזאורוס','dino/anky'],['spino','ספינוזאורוס','dino/spino'],['ptero','פטרודקטיל','dino/ptero'],['baby','הדרקון הקטן','dragons/baby'],['ember','דרקון הלהבות','dragons/ember']];
const LV=[{pairs:6,cols:3,pool:[0,1,2,3,4,5,6,7]},{pairs:8,cols:4,pool:[0,1,2,3,4,5,6,7]},{pairs:10,cols:4,pool:[0,1,2,3,4,5,6,7,8,9]}];
const board=document.getElementById('board');
const tb=D.topbar('משחק הזיכרון','<span id="lv"></span>');
const toast=document.createElement('div');toast.id='toast';document.body.appendChild(toast);
let lvl=0;D.music('jungle');
await D.preload(CARDS.map(c=>`../../assets/${c[2]}.webp`));
function say(t){toast.textContent=t;toast.classList.add('show');clearTimeout(say.t);say.t=setTimeout(()=>toast.classList.remove('show'),1500)}
function start(){
 const L=LV[lvl];tb.querySelector('#lv').textContent='שלב '+(lvl+1);
 let pick=D.shuffle(L.pool).slice(0,L.pairs);
 if(lvl==2){pick=D.shuffle([8,9,...D.shuffle([0,1,2,3,4,5,6,7]).slice(0,8)])}
 const deck=D.shuffle([...pick,...pick]);
 const rows=Math.ceil(deck.length/L.cols);
 board.style.gridTemplateColumns=`repeat(${L.cols},1fr)`;board.style.setProperty('--ar',(L.cols*3)/(rows*4)*0.98);
 board.innerHTML='';let first=null,lock=false,tries=0,found=0;
 deck.forEach((id,i)=>{const c=document.createElement('div');c.className='mc noselect';c.style.animationDelay=i*50+'ms';
  c.innerHTML=`<div class="f back"></div><div class="f front"><img src="../../assets/${CARDS[id][2]}.webp" alt="${CARDS[id][1]}"></div>`;
  c.onclick=async()=>{if(lock||c.classList.contains('up'))return;D.sfx('flip');c.classList.add('up');
   if(!first){first=c;return}
   tries++;const a=first,b=c;first=null;lock=true;
   if(a.dataset.id===String(id)){} 
   if(deck[+a.dataset.i]===id){await D.sleep(450);a.classList.add('done');b.classList.add('done');D.sfx('match');
     const r=b.getBoundingClientRect();D.burst(r.left+r.width/2,r.top+r.height/2,null,22);say(CARDS[id][1]);found++;lock=false;
     if(found===L.pairs){await D.sleep(900);fin()}}
   else{await D.sleep(850);a.classList.add('wrong');b.classList.add('wrong');D.sfx('bad');await D.sleep(300);a.classList.remove('up','wrong');b.classList.remove('up','wrong');lock=false}};
  c.dataset.i=i;board.appendChild(c)});
 async function fin(){const par=L.pairs;const st=tries<=par+2?3:tries<=par*1.7?2:1;D.stars.set('memory',st);D.sfx('win');D.confetti(160);
  const last=lvl===LV.length-1;
  await D.dialog({title:last?'אלופי הזיכרון!':'כל הכבוד!',stars:st,text:`מצאתם את כל הזוגות ב-${tries} ניסיונות`,buttons:[{label:D.icon('replay')+' שוב',cls:'alt',onClick:()=>start()},last?{label:'לדף הבית',cls:'green',onClick:()=>location.href='/'}:{label:'לשלב הבא',cls:'green',onClick:()=>{lvl++;start()}}]})}
}
start();
})();
