(()=>{
const t=D.stars.total();document.getElementById('total').innerHTML=D.icon('star')+' '+t+' מתוך 21';
document.querySelectorAll('.fs').forEach(e=>{const n=D.stars.get(e.dataset.g);e.innerHTML=[0,1,2].map(i=>i<n?D.icon('star'):D.icon('starOff')).join('')});
const m=document.getElementById('mute');const ic=()=>m.innerHTML=D.isMuted()?D.icon('off'):D.icon('on');ic();m.onclick=()=>{D.setMuted(!D.isMuted());ic()};
document.getElementById('share').onclick=async()=>{const d={title:'ארץ הדינו',text:'משחקי דינוזאורים ודרקונים לילדים, בעברית ובחינם!',url:location.origin+'/'};
 try{if(navigator.share){await navigator.share(d);return}await navigator.clipboard.writeText(d.url);D.dialog({title:'הקישור הועתק!',text:'אפשר להדביק ולשלוח לחברים.'})}catch(e){}};
})();
