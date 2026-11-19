(async()=>{
const app=document.getElementById('app');
const tb=D.topbar('סדרות','<span id="prog"></span>');
const COACH=[['grom','גרום'],['ferna','פרנה']];
await D.preload(COACH.map(c=>`../../assets/heroes/${c[0]}_face.webp`));D.music('comic');
const SH=['circle','square','triangle','star','heart','diamond'];
const COL=['#ff3d3d','#2f7bff','#1fb85a','#ffb300','#a54bff','#ff7a1f'];
const CN={'#ff3d3d':'אדום','#2f7bff':'כחול','#1fb85a':'ירוק','#ffb300':'צהוב','#a54bff':'סגול','#ff7a1f':'כתום'};
const PATH={circle:'<circle cx="50" cy="50" r="40"/>',square:'<rect x="12" y="12" width="76" height="76" rx="10"/>',triangle:'<path d="M50 8 94 88H6z" stroke-linejoin="round"/>',star:'<path d="m50 6 12 28 30 3-23 20 7 30-26-16-26 16 7-30L8 37l30-3z" stroke-linejoin="round"/>',heart:'<path d="M50 90S8 62 8 34a22 22 0 0 1 42-8 22 22 0 0 1 42 8c0 28-42 56-42 56z"/>',diamond:'<path d="M50 4 92 50 50 96 8 50z" stroke-linejoin="round"/>'};
function svg(it){if(it.q)return'';let inner;
 if(it.arrow)inner=`<g transform="rotate(${it.r} 50 50)" fill="${it.c}" stroke="#000" stroke-width="6"><path d="M50 10 82 48H62V90H38V48H18z" stroke-linejoin="round"/></g>`;
 else if(it.dots!=null){const n=it.dots,pos=[[50,50],[30,30],[70,70],[70,30],[30,70],[50,20],[50,80],[20,50],[80,50]];inner=`<g fill="${it.c}" stroke="#000" stroke-width="6"><circle cx="50" cy="50" r="44"/></g>`+pos.slice(0,n).map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="7" fill="#fff" stroke="#000" stroke-width="3"/>`).join('')}
 else inner=`<g fill="${it.c}" stroke="#000" stroke-width="6" transform="translate(50 50) scale(${it.z||1}) translate(-50 -50)">${PATH[it.s]}</g>`;
 return`<svg viewBox="0 0 100 100">${inner}</svg>`}
const key=i=>JSON.stringify([i.s,i.c,i.z,i.r,i.dots]);
const base=()=>({s:'circle',c:COL[0],z:1});
function mk(round){const L=6;const A=D.shuffle(SH),C=D.shuffle(COL);let seq=[],hint='';
 const rule=[['shape2'],['col2'],['shape3a'],['grow'],['dots'],['col3'],['rot'],['shape3'],['comb'],['comb2']][round];
 const pat=(p,vals)=>Array.from({length:L},(_,i)=>vals[p[i%p.length]]);
 switch(rule[0]){
 case'shape2':seq=pat([0,1],A).map(s=>({...base(),s,c:C[0]}));hint='שני צורות שחוזרות שוב ושוב';break;
 case'col2':seq=pat([0,1],C).map(c=>({...base(),s:A[0],c}));hint='שני צבעים מתחלפים';break;
 case'shape3a':seq=pat([0,0,1],A).map(s=>({...base(),s,c:C[0]}));hint='שימו לב כמה פעמים חוזרת כל צורה';break;
 case'grow':seq=Array.from({length:L},(_,i)=>({...base(),s:A[0],c:C[0],z:+(.5+i*.1).toFixed(1)}));hint='הצורה גדלה בכל פעם';break;
 case'dots':seq=Array.from({length:L},(_,i)=>({s:'circle',c:C[0],dots:i+1}));hint='ספרו את הנקודות';break;
 case'col3':seq=pat([0,1,2],C).map(c=>({...base(),s:A[0],c}));hint='שלושה צבעים בסדר קבוע';break;
 case'rot':seq=Array.from({length:L},(_,i)=>({s:'arrow',arrow:true,c:C[0],r:(i*90)%360,z:1}));hint='החץ מסתובב';break;
 case'shape3':seq=pat([0,1,2],A).map(s=>({...base(),s,c:C[0]}));hint='שלוש צורות בסדר קבוע';break;
 case'comb':seq=Array.from({length:L},(_,i)=>({...base(),s:A[i%2],c:C[i%3]}));hint='גם הצורה וגם הצבע משתנים';break;
 default:seq=Array.from({length:L},(_,i)=>({...base(),s:A[i%3],c:C[i%2]}));hint='שני כללים יחד. מה בא עכשיו?'}
 const ans=seq[L-1];const opts=[ans];let guard=0;
 while(opts.length<3&&guard++<60){const v={...ans};const r=Math.random();
  if(v.arrow)v.r=D.pick([0,90,180,270]);else if(v.dots!=null)v.dots=Math.max(1,v.dots+D.pick([-2,-1,1,2]));else if(rule[0]==='grow')v.z=+(ans.z+D.pick([-.3,-.2,.2,.3])).toFixed(1);
  else if(rule[0]==='col2'||rule[0]==='col3')v.c=D.pick(C.slice(0,4));else if(rule[0]==='comb'||rule[0]==='comb2'){if(r<.5)v.s=D.pick(A.slice(0,3));else v.c=D.pick(C.slice(0,3))}else v.s=D.pick(A.slice(0,4));
  if(v.z<.4||v.z>1.3)continue;if(!opts.some(o=>key(o)===key(v)))opts.push(v)}
 return{seq,ans,opts:D.shuffle(opts),hint}}
let round,mist,ci;
function newGame(){round=0;mist=0;ci=D.ri(0,1);next()}
function pr(){tb.querySelector('#prog').innerHTML=Array.from({length:10},(_,i)=>`<i class="${i<round?'on':''}"></i>`).join('')}
function next(){
 if(round>=10)return fin();pr();const q=mk(round);const co=COACH[ci%2];ci++;
 app.innerHTML=`<div id="coach"><img id="face" src="../../assets/heroes/${co[0]}_face.webp" alt="${co[1]}"><div id="say"><b>${co[1]}:</b> ${q.hint}</div></div><div id="seq"></div><div id="opts"></div>`;
 const seq=app.querySelector('#seq'),opts=app.querySelector('#opts'),say=app.querySelector('#say');
 q.seq.forEach((it,i)=>{const d=document.createElement('div');d.className='slot'+(i===5?' q':'');d.style.animationDelay=i*80+'ms';d.innerHTML=i===5?'?':svg(it);seq.appendChild(d)});
 const slot=seq.lastChild;let busy=false;
 q.opts.forEach(o=>{const b=document.createElement('button');b.className='op noselect';b.innerHTML=svg(o);b.onclick=async()=>{if(busy)return;
  if(key(o)===key(q.ans)){busy=true;D.sfx('ok');slot.classList.add('ok');slot.innerHTML=svg(o);const bm=document.createElement('div');bm.id='boom';bm.textContent='בום!';document.body.appendChild(bm);setTimeout(()=>bm.remove(),950);D.sfx('boom');const r=slot.getBoundingClientRect();D.burst(r.left+r.width/2,r.top+r.height/2,null,26);say.innerHTML=`<b>${co[1]}:</b> ${D.pick(['מצוין! בדיוק ככה','יפה מאוד!','אתם גאונים!','הבנתם את הכלל!'])}`;round++;pr();await D.sleep(1500);next()}
  else{D.sfx('bad');mist++;b.classList.add('no');setTimeout(()=>b.classList.remove('no'),420);say.innerHTML=`<b>${co[1]}:</b> כמעט! הסתכלו שוב על הכלל`}};opts.appendChild(b)});
}
async function fin(){const s=mist<=2?3:mist<=6?2:1;D.stars.set('sequence',s);D.sfx('win');D.confetti(160);
 await D.dialog({title:'בום! סיימתם!',stars:s,text:'גרום ופרנה גאים בכם. אתם מומחי סדרות!',buttons:[{label:D.icon('replay')+' שוב',cls:'alt',onClick:newGame},{label:'לדף הבית',cls:'green',onClick:()=>location.href='/'}]})}
newGame();
})();
