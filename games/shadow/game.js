(async()=>{
const app=document.getElementById('app');
document.body.insertAdjacentHTML('afterbegin','<div class="hall"></div><div class="beam"></div><div class="floor"></div>');
const tb=D.topbar('של מי הצל?','<span class="dots" id="dt"></span>');
const ALL=[['trex','טירנוזאורוס רקס'],['tri','טריצרטופס'],['stego','סטגוזאורוס'],['bra','ברכיאוזאורוס'],['rap','ולוסירפטור'],['anky','אנקילוזאורוס'],['spino','ספינוזאורוס'],['ptero','פטרודקטיל']];
await D.preload(ALL.map(a=>`../../assets/dino/${a[0]}.webp`));D.music('museum');
let order,i,mist;
function dots(){tb.querySelector('#dt').innerHTML=ALL.map((_,k)=>`<i class="${k<i?'on':''}"></i>`).join('')}
function newGame(){order=D.shuffle(ALL);i=0;mist=0;next()}
function next(){
 if(i>=order.length)return fin();dots();
 const cur=order[i];const others=D.shuffle(ALL.filter(a=>a!==cur)).slice(0,2);const opts=D.shuffle([cur,...others]);
 app.innerHTML=`<div id="title">של מי הצל הזה?</div><div id="sub">גררו את הדינוזאור אל הצל</div><div id="stage"><div id="plate"></div><img id="sil" src="../../assets/dino/${cur[0]}.webp" alt=""></div><div id="tray"></div>`;
 const sil=app.querySelector('#sil'),tray=app.querySelector('#tray');let busy=false;
 opts.forEach(o=>{const el=document.createElement('div');el.className='opt noselect';el.innerHTML=`<img src="../../assets/dino/${o[0]}.webp" alt="">`;tray.appendChild(el);
  const check=async(el)=>{busy=true;
   if(o===cur){D.sfx('ok');el.classList.add('used');sil.classList.add('rev');app.querySelector('#title').textContent=o[1];const r=sil.getBoundingClientRect();D.burst(r.left+r.width/2,r.top+r.height/2,'#ffd54a',28);D.sfx('match');D.confetti(40);i++;dots();await D.sleep(1900);next();return true}
   D.sfx('bad');mist++;el.classList.add('bad');busy=false;setTimeout(()=>el.classList.remove('bad'),420);return false};
  D.draggable(el,{onDrop:async(x,y,moved)=>{if(busy)return false;const r=sil.getBoundingClientRect();const hit=x>r.left-20&&x<r.right+20&&y>r.top-20&&y<r.bottom+20;if(!moved||hit){const ok=await check(el);if(ok)return true;return false}return false}})});
}
async function fin(){const st=mist<=2?3:mist<=5?2:1;D.stars.set('shadow',st);D.sfx('win');D.confetti(160);
 await D.dialog({title:'גיליתם את כולם!',stars:st,text:'אתם בלשי דינוזאורים אמיתיים.',buttons:[{label:D.icon('replay')+' שוב',cls:'alt',onClick:newGame},{label:'לדף הבית',cls:'green',onClick:()=>location.href='/'}]})}
newGame();
})();
