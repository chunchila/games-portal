(async()=>{
const app=document.getElementById('app');
document.body.insertAdjacentHTML('afterbegin','<div class="bgb"></div><div class="shade"></div>');
const tb=D.topbar('האכילו את הדינוזאור','<span id="cnt"></span>');
const FOOD={leaf:'עלים',meat:'בשר',fruit:'פירות',fish:'דגים'};
const DINOS=[['tri','טריצרטופס','leaf'],['trex','טירנוזאורוס רקס','meat'],['stego','סטגוזאורוס','fruit'],['spino','ספינוזאורוס','fish']];
const GREET={leaf:'אני רעב! בא לי עלים ירוקים',meat:'גררררר! אני רוצה בשר',fruit:'אני רוצה פירות מתוקים',fish:'מי יביא לי דג טעים?'};
await D.preload([...DINOS.map(d=>`../../assets/dino/${d[0]}.webp`),...Object.keys(FOOD).map(f=>`../../assets/props/food_${f}.webp`)]);D.music('home');
let order,idx,mist;
function newGame(){order=D.shuffle(DINOS);idx=0;mist=0;next()}
async function next(){
 if(idx>=order.length)return fin();
 const [id,name,want]=order[idx];tb.querySelector('#cnt').textContent=(idx+1)+'/4';let eaten=0,busy=false;
 app.innerHTML=`<div id="name">${name}</div><div id="stage"><div id="bubble"><img src="../../assets/props/food_${want}.webp"><span>${GREET[want]}</span></div><img id="dino" src="../../assets/dino/${id}.webp" alt="${name}"></div><div id="belly"><i></i><i></i><i></i></div><div id="tray"></div>`;
 D.sfx('roar');
 const dino=app.querySelector('#dino'),bub=app.querySelector('#bubble'),pips=[...app.querySelectorAll('#belly i')],tray=app.querySelector('#tray');
 const say=t=>{bub.querySelector('span').textContent=t};
 const foods=D.shuffle(Object.keys(FOOD));
 foods.forEach(f=>{const el=document.createElement('div');el.className='food noselect';el.innerHTML=`<img src="../../assets/props/food_${f}.webp" alt="${FOOD[f]}">`;tray.appendChild(el);
  D.draggable(el,{onDrop:async(x,y,moved)=>{if(busy)return false;const r=dino.getBoundingClientRect();const hit=x>r.left&&x<r.right&&y>r.top-10&&y<r.bottom;if(!hit&&moved)return false;if(!moved&&!hit){return false}
   busy=true;
   if(f===want){D.sfx('munch');el.style.transition='all .35s';el.style.transform=`translate(${r.left+r.width*.7-el.getBoundingClientRect().left-el.offsetWidth/2}px,${r.top+r.height*.4-el.getBoundingClientRect().top-el.offsetHeight/2}px) scale(.2)`;el.style.opacity=0;
     dino.classList.remove('munch','no');void dino.offsetWidth;dino.classList.add('munch');D.burst(r.left+r.width*.7,r.top+r.height*.4,'#ff9a5c',14);
     pips[eaten].classList.add('on');eaten++;await D.sleep(500);
     el.style.transition='none';el.style.transform='';el.style.opacity=1;el.style.zIndex='';
     if(eaten>=3){D.sfx('win');say('אמממ... שבעתי! תודה רבה!');dino.classList.remove('munch');dino.classList.add('happy');D.confetti(80);await D.sleep(1700);idx++;next()}else{say(['עוד קצת!','טעים! ועוד אחד בבקשה','כמעט שבעתי!'][eaten-1]);busy=false}
     return true}
   else{D.sfx('bad');mist++;dino.classList.remove('munch','no');void dino.offsetWidth;dino.classList.add('no');say('לא, זה לא מתאים לי');await D.sleep(900);say(GREET[want]);busy=false;return false}}})});
}
async function fin(){const st=mist<=1?3:mist<=4?2:1;D.stars.set('feed',st);D.sfx('win');D.confetti(160);
 await D.dialog({title:'כולם שבעים!',stars:st,text:'האכלתם את כל הדינוזאורים בדיוק מה שהם אוהבים.',buttons:[{label:D.icon('replay')+' שוב',cls:'alt',onClick:newGame},{label:'לדף הבית',cls:'green',onClick:()=>location.href='/'}]})}
newGame();
})();
