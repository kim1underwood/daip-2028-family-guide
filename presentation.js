const slides=[...document.querySelectorAll('.slide')];
const labels=JSON.parse(document.getElementById('labels').textContent);
const proofs=JSON.parse(document.getElementById('proofs').textContent);
const refs=JSON.parse(document.getElementById('refs').textContent);
const assets=JSON.parse(document.getElementById('assets').textContent);
const main=document.querySelector('main'), dialog=document.getElementById('panel');
const byId=id=>document.getElementById(id);
let page=0,step=0,opener=null;
const total=slides.length;
const isMapDeck=slides[0].classList.contains('mapSlide');
const guidePage=slides.findIndex(slide=>slide.classList.contains('family-guide'))+1;
const guidePanels=[...document.querySelectorAll('.family-guide .family-panel')];
const chapterStarts=[1,4,10,38,43,57,76];
const chapterLabels=['표지와 목차','2028 인원 분석','5등급제 실시에 따른 변화','논서술형 평가 역량 변화','통합형 수능에 따른 변화','지역의사제','마무리'];
function route(){
 const m=location.hash.match(/^#(\d+)(?:\.(\d+))?$/);
 const formerMapPage=m&&Number(m[1])-total;
 if(!isMapDeck&&formerMapPage>=1&&formerMapPage<=Number(document.body.dataset.formerMapCount)){
  const target=new URL(document.body.dataset.mapUrl,location.href);
  target.hash=String(formerMapPage)+(m[2]?'.'+m[2]:'');
  location.replace(target.href);return;
 }
 const n=Math.max(1,Math.min(total,m?Number(m[1]):1));
 const steps=n===guidePage?guidePanels.length:isMapDeck?journey[n-1].steps.length:1;
 const s=Math.max(0,Math.min(steps-1,m?Number(m[2]||1)-1:0));
 show(n,s);
}
function go(n,s=0){
 if(n<1||n>total)return;
 const hash='#'+n+(s?'.'+(s+1):'');
 if(location.hash===hash)route();else location.hash=hash;
}
function show(n,s){
 const previousStep=step;
 const prevPage=page,oldCenter=isMapDeck&&prevPage>0?slides[prevPage-1].querySelector('.station.selected circle'):null;
 const xy=oldCenter&&[Number(oldCenter.getAttribute('cx')),Number(oldCenter.getAttribute('cy'))];
 if(!page)slides.forEach((item,i)=>{item.hidden=i!==n-1});
 else if(page!==n)slides[page-1].hidden=true;
 page=n;step=s;const slide=slides[n-1];slide.hidden=false;
 if(n===guidePage){
  guidePanels.forEach((panel,i)=>{panel.hidden=i!==s});
  slide.querySelectorAll('[data-step]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===s)));
 }
 if(isMapDeck){
  slide.innerHTML=sceneHTML(n-1,s);
  drawRoute(slide.querySelector("svg"),n-1,s,prevPage===n?previousStep:null);
  if(xy&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
   const marker=slide.querySelector('.station.selected circle'),cx=Number(marker.getAttribute('cx')),cy=Number(marker.getAttribute('cy'));
   marker.animate([{transform:'translate('+(xy[0]-cx)+'px,'+(xy[1]-cy)+'px)'},{transform:'translate(0,0)'}],{duration:540,easing:'cubic-bezier(.2,.8,.2,1)'});
  }
 }
 slide.querySelectorAll('[data-asset]').forEach(im=>{im.src=assets[im.dataset.asset]});
 byId('count').textContent=n+' / '+total;byId('progress').style.width=(n/total*100)+'%';
 byId('part').textContent=!isMapDeck?'1부　대교협 설명회':'2부　학부모 대입 지도';
 byId('source').hidden=isMapDeck||n===guidePage||n===1;byId('prev').disabled=n===1;byId('next').disabled=n===total;
 byId('zoom').hidden=isMapDeck;byId('zoom').setAttribute('aria-pressed',main.classList.contains('zoom')&&!isMapDeck?'true':'false');
 if(isMapDeck)main.classList.remove('zoom');
 byId('zoom').textContent=main.classList.contains('zoom')?'축소':'확대';
 byId('announce').textContent=n+'장. '+labels[n-1];
 document.title=labels[n-1]+(isMapDeck?' · 2부 학부모 대입 지도':' · 2028 대입 설명회');
 if(prevPage!==n){main.scrollTo(0,0);slide.querySelector('.content')?.scrollTo(0,0)}
 if(dialog.open)dialog.close();
}
function toggleZoom(){
 if(isMapDeck)return;
 const on=main.classList.toggle('zoom');byId('zoom').setAttribute('aria-pressed',String(on));byId('zoom').textContent=on?'축소':'확대';
}
function showPanel(kind){
 opener=document.activeElement;dialog.className=kind;
 const original=Number(slides[page-1].dataset.n);
 const name=kind==='original'?'원본 '+original+'장 · 자료집 '+(27+Math.floor((original-1)/2))+'쪽 '+(original%2?'위':'아래'):kind==='toc'?'발표 목차':'검증 메모와 출처';
 byId('paneltitle').textContent=name;
 const inside=byId('panelbody');inside.replaceChildren();
 if(kind==='original'){
  const im=new Image();im.src=assets.originals[original-1];im.alt=labels[page-1]+' 원본';inside.append(im);
 }else if(kind==='toc'){
  if(!isMapDeck){
   const chapters=document.createElement('select');chapters.setAttribute('aria-label','장별 바로 이동');
   chapterLabels.forEach((label,i)=>chapters.add(new Option(label,chapterStarts[i])));
   chapters.value=chapterStarts.filter(k=>k<=page).at(-1);
   chapters.onchange=()=>go(Number(chapters.value));inside.append(chapters);
  }
  const list=document.createElement('div');list.className='tocLinks';
  labels.forEach((label,i)=>{let a=document.createElement('a');a.href='#'+(i+1);a.innerHTML='<b>'+String(i+1).padStart(2,'0')+'</b>';a.append(document.createTextNode(label));if(i+1===page)a.setAttribute('aria-current','page');list.append(a)});inside.append(list);
 }else{
  const info=proofs[page-1];let p=document.createElement('p');p.textContent=info[0];inside.append(p);
  let list=document.createElement('ul');list.className='proofList';
  info[1].forEach(key=>{const [org,title,sub,url]=refs[key],li=document.createElement('li'),a=document.createElement('a'),small=document.createElement('small');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=title;small.textContent=org+' · '+sub;li.append(a,small);list.append(li)});inside.append(list);
 }
 dialog.showModal();dialog.scrollTop=0;
}
function advance(direction){
 if(page===guidePage&&step+direction>=0&&step+direction<guidePanels.length){go(page,step+direction);return}
 if(guidePage&&page===guidePage+1&&direction<0){go(guidePage,guidePanels.length-1);return}
 go(page+direction);
}
byId('prev').onclick=()=>advance(-1);byId('next').onclick=()=>advance(1);
byId('zoom').onclick=toggleZoom;byId('toc').onclick=()=>showPanel('toc');
byId('source').onclick=()=>showPanel('original');byId('proof').onclick=()=>showPanel('proof');
byId('closepanel').onclick=()=>dialog.close();dialog.addEventListener('close',()=>opener?.focus());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();if(e.target.closest('.tocLinks a,.jumpParts a'))dialog.close()});
main.addEventListener('click',e=>{const b=e.target.closest('[data-step]');if(b)go(page,Number(b.dataset.step))});
window.addEventListener('hashchange',route);
window.addEventListener('keydown',e=>{
 if(dialog.open||e.altKey||e.metaKey||e.ctrlKey||e.target.matches('input,select,textarea'))return;
 const next=e.key==='ArrowRight'||e.key==='PageDown'||(e.key===' '&&!e.target.closest('button,a'));
 if(next){e.preventDefault();advance(1)}
 else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();advance(-1)}
 else if(isMapDeck&&['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();go(page,Math.max(0,Math.min(journey[page-1].steps.length-1,step+(e.key==='ArrowDown'?1:-1))))}
 else if(e.key==='Home'||e.key==='End'){e.preventDefault();go(e.key==='Home'?1:total)}
 else if(e.key.toLowerCase()==='m'){showPanel('toc')}
});
let touch=null;
main.addEventListener('touchstart',e=>{
 const t=e.touches[0],p=e.target.closest('.content');
 touch=e.touches.length===1&&!main.classList.contains('zoom')&&!(p&&p.scrollWidth>p.clientWidth+3)?[t.clientX,t.clientY]:null;
},{passive:true});
main.addEventListener('touchend',e=>{if(!touch||e.changedTouches.length!==1)return;const t=e.changedTouches[0],dx=t.clientX-touch[0],dy=t.clientY-touch[1];touch=null;if(Math.abs(dx)>75&&Math.abs(dx)>Math.abs(dy)*1.8)advance(dx<0?1:-1)},{passive:true});
route();
