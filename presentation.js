const journey = [
 {title:'고교 생활에서 등록까지',kicker:'대입 과정 한눈에 보기',steps:['고교 생활','고3 일정','합격·등록'],copy:[
 ['고1·2','어떤 과목을 배우고 있나요?','관심 분야에 맞춰 과목을 선택하고 수업·평가에 참여합니다. 학생부는 이 시간 동안 쌓입니다.'],
 ['고3','9월 원서와 11월 수능이 한 달력에 들어옵니다.','수시는 9월에 먼저 지원합니다. 수능최저학력기준과 대학별 고사 일정도 함께 확인합니다.'],
 ['등록','수시 결과를 확인한 뒤 다음 길이 정해집니다.','수시 최초·충원 합격자는 등록 여부와 관계없이 일반대 정시·추가모집 지원이 제한됩니다.']],focus:['school','senior','register']},
 {title:'한 번의 수능, 두 가지 역할',kicker:'2027년 11월 18일',steps:['수시에서','정시에서'],copy:[
 ['수능최저학력기준','수시에서는 합격에 필요한 기준이 될 수 있습니다.','예를 들어 ‘2개 영역 등급 합 5 이내’라면 2등급과 3등급으로 충족합니다. 대학마다 반영 영역과 조건이 다릅니다. 최저를 적용하지 않는 전형도 있습니다.'],
 ['수능위주전형','정시에서는 수능 성적이 선발 점수가 됩니다.','대학이 영역별 성적을 정해진 방식으로 환산합니다. 같은 성적표라도 반영 비율과 학생부 평가 여부에 따라 결과가 달라집니다.']],focus:['examA','examB']},
 {title:'네 전형은 무엇을 읽을까요?',kicker:'평가 자료 비교',steps:['학생부교과','학생부종합','논술','수능위주'],copy:[
 ['학생부교과','이수한 과목과 교과성적','대학이 정한 반영 교과와 산출 방식으로 성적을 평가합니다. 서류·출결·면접이나 수능최저를 함께 보는 대학도 있습니다.'],
 ['학생부종합','학생부에 기록된 학업과 성장 과정','과목 선택, 수업 활동, 성취 등을 맥락 속에서 평가합니다. 면접과 수능최저 적용 여부는 전형마다 다릅니다.'],
 ['논술','대학별 논술고사 답안','문제를 해석하고 근거를 제시하는 과정을 답안으로 보여 줍니다. 논술 비중과 수능최저를 함께 확인합니다.'],
 ['수능위주','수능 성적표와 대학별 환산점수','국어·수학·탐구 등을 대학별 방식으로 환산합니다. 일부 대학은 학생부도 함께 평가합니다.']],focus:['early','early','early','late']},
 {title:'서윤이가 서울대 인문대학을 준비한다면',kicker:'가상 학생 · 실제 2028학년도 서울대 정시 일반전형',steps:['고교 생활','1단계','2단계'],copy:[
 ['고교 생활','서윤이는 역사에 관심이 많은 고등학생입니다.','수업에서 자료를 읽고 해석한 경험을 쌓습니다. 지원할 때는 인문대학의 수능 응시영역기준을 먼저 확인합니다.'],
 ['1단계','정시 나군에서 수능으로 3배수를 선발합니다.','서윤이가 수시에 최종 합격하지 않아 정시에 지원한다고 가정합니다. 서울대 인문대학 일반전형은 1단계에서 수능 100%를 반영합니다.'],
 ['2단계','수능 60점과 교과역량평가 40점을 합산합니다.','교과역량평가에서 두 평가자가 각각 등급을 부여하고 점수를 평균합니다. A+는 40점, A는 39점, B+는 38점, B는 37점, C+는 36점, C는 35점입니다.']],focus:['school','late','register']},
 {title:'서윤이의 수시 결과를 바꿔 보세요',kicker:'최초 발표부터 충원 마감까지',steps:['최초합격','예비순위','충원합격','최종 불합격'],copy:[
 ['최초합격','수시 등록 절차를 확인합니다.','최초합격 사실로 일반대 정시·추가모집 지원이 제한됩니다. 등록을 포기해도 같습니다.'],
 ['예비순위','충원 발표를 기다립니다.','예비순위를 받은 시점에는 최종 결과가 정해지지 않았습니다. 대학이 안내한 발표·연락 일정을 확인하고 충원합격과 최종 불합격을 구분합니다.'],
 ['충원합격','충원 등록 기한을 확인합니다.','충원합격도 수시 합격입니다. 등록 의사와 관계없이 일반대 정시·추가모집 지원이 제한됩니다.'],
 ['최종 불합격','정시 지원 일정으로 넘어갑니다.','지원한 모든 수시 전형에서 최종 합격하지 않았다면 정시에 지원할 수 있습니다. 서윤이는 서울대 인문대학 나군 지원 조건과 일정을 확인합니다.']],focus:['admit','wait','admit','late']},
 {title:'우리 집 달력에 옮길 다섯 날짜',kicker:'2028학년도 일반대 모집 일정',steps:['날짜 확인','우리 가족의 확인 항목'],copy:[
 ['지원 달력','원서접수와 등록을 따로 표시합니다.','접수는 대교협 공통 기간 안에서 대학이 3일 이상 운영합니다. 실제 접수일과 마감 시각, 대학별 고사와 충원 일정은 지원 대학의 모집요강에서 확인하세요.'],
 ['학부모와 학생','대학 한 곳과 모집단위 한 곳을 골라 보세요.','전형명과 모집군, 평가 요소와 배점, 수능최저, 면접 유무를 찾아보세요. 대학별 날짜 옆에 근거가 된 모집요강 쪽수를 적으면 다시 확인하기 쉽습니다.']],focus:['all','all']}
];
const stations={school:[55,96,'고교 생활'],senior:[166,96,'고3'],early:[272,45,'9월 수시'],exam:[384,96,'11월 수능'],admit:[483,45,'수시 결과'],late:[487,149,'1월 정시'],register:[610,96,'등록']};
function mapSVG(focus) {
 const mode=focus==='late'||focus==='examB'?'late':focus==='early'||focus==='examA'||focus==='admit'||focus==='wait'?'early':'all';
 const key=focus.startsWith('exam')?'exam':focus==='wait'?'admit':focus==='all'?'register':focus;
 const [cx,cy]=stations[key]||stations.school;
 const nodes=Object.entries(stations).map(([id,[x,y,label]])=>{
 const active=id===key;const ty=y===45?y-17:y===149?y+28:y+31;
 return '<g class="station '+(active?'selected':'')+'"><circle cx="'+x+'" cy="'+y+'" r="'+(active?8:5)+'"/><text x="'+x+'" y="'+ty+'">'+label+'</text></g>'}).join('');
 return '<svg class="transit '+mode+'" viewBox="0 0 665 190" role="img" aria-label="고교 생활과 고3에서 수시와 정시로 갈라져 수능을 거쳐 등록으로 이어지는 지도"><path class="base" d="M55 96H166"/><path class="earlyline" d="M166 96C212 96 217 45 272 45H306C340 45 345 96 384 96S438 45 483 45H520C558 45 573 96 610 96"/><path class="lateline" d="M166 96C239 96 246 149 293 149S351 96 384 96S444 149 487 149H517C554 149 568 96 610 96"/><circle class="ripple" cx="'+cx+'" cy="'+cy+'" r="15"/>'+nodes+'</svg>';
}
function extraVisual(scene,step){
 if(scene===0&&step===1)return '<div class="months"><b>고3</b><span>9월　수시 접수</span><span>11월　수능</span><span>12월　수시 등록</span></div>';
 if(scene===1)return '<div class="equation">'+(step===0?'<b>2</b><i>+</i><b>3</b><i>=</i><strong>5</strong><small>등급 합 예시</small>':'<b>영역별 성적</b><i>×</i><b>반영 비율</b><i>→</i><strong>환산점수</strong>')+'</div>';
 if(scene===2)return '<div class="materials">'+['교과성적','학교생활기록부','논술 답안','수능 성적표'].map((s,i)=>'<span class="'+(i===step?'on':'')+'">'+s+'</span>').join('')+'</div>';
 if(scene===3)return '<div class="equation">'+['<b>과목 이수</b><i>→</i><strong>학업 과정</strong>','<b>수능 100%</b><i>→</i><strong>3배수</strong>','<b>수능 60</b><i>+</i><strong>교과역량 40</strong>'][step]+'</div>';
 if(scene===4)return '<div class="forkbox"><b>서윤이의 다음 경로</b><span>수시 결과</span><i>→</i><strong>'+['수시 등록','충원 발표 확인','충원 등록','정시 지원 가능'][step]+'</strong></div>';
 if(scene===5)return '<div class="calendar">'+[['2027.09','20–23','수시 원서접수'],['2027.11','18','수능'],['2027.12','22–24','수시 최초 등록'],['2028.01','03–06','정시 원서접수'],['2028.02','11–14','정시 최초 등록']].map(([m,d,t])=>'<div><small>'+m+'</small><b>'+d+'</b><span>'+t+'</span></div>').join('')+'</div>';
 return '';
}
function sceneHTML(scene,step) {
 const d=journey[scene], [label,title,copy]=d.copy[step];
 return '<div class="scene"><div class="scenehead"><small>'+d.kicker+'</small><h1>'+d.title+'</h1></div><div class="mapbox">'+mapSVG(d.focus[step])+'</div><div class="steptabs" role="group" aria-label="장면 선택">'+d.steps.map((s,i)=>'<button data-step="'+i+'" aria-pressed="'+(i===step)+'">'+s+'</button>').join('')+'</div><div class="story" aria-live="polite"><div><small>'+label+'</small><h2>'+title+'</h2><p>'+copy+'</p></div>'+sceneDetail(scene,step)+'</div></div>';
}


const reducedMotion=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
const segment={
 start:'M55 96H166',
 early:'M166 96C212 96 217 45 272 45',
 examA:'M272 45H306C340 45 345 96 384 96',
 examB:'M166 96C239 96 246 149 293 149S351 96 384 96',
 admit:'M384 96C423 96 438 45 483 45',
 late:'M384 96C420 96 444 149 487 149',
 register:'M483 45H520C558 45 573 96 610 96',
 endLate:'M487 149H517C554 149 568 96 610 96'
};
function drawRoute(svg,scene,step,previous){
 const focus=journey[scene].focus[step],ns='http://www.w3.org/2000/svg';
 const codes={school:[],senior:['start'],early:['start','early'],examA:['start','early','examA'],examB:['start','examB'],admit:['admit'],wait:['admit'],late:['late'],register:scene===3?['late','endLate']:['admit','register'],all:['start','early','examA','admit','register']};
 const path=(codes[focus]||[]).map(k=>segment[k]).join(' ');
 if(path){
  const line=document.createElementNS(ns,'path');line.setAttribute('d',path);line.setAttribute('class','trail');line.setAttribute('pathLength','1');svg.insertBefore(line,svg.querySelector('.ripple'));
  if(!reducedMotion()){
   const reversed=previous!==null&&previous>step;
   line.animate(reversed?[{strokeDashoffset:-1},{strokeDashoffset:0}]:[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:780,easing:'ease-in-out'});
  }
 }
 if(scene===0&&step===1){
  svg.setAttribute('viewBox','104 3 435 178');
  if(!reducedMotion()){
   const cam=document.createElementNS(ns,'animate');cam.setAttribute('attributeName','viewBox');cam.setAttribute('from','0 0 665 190');cam.setAttribute('to','104 3 435 178');cam.setAttribute('dur','.55s');cam.setAttribute('fill','freeze');svg.append(cam);cam.beginElement();
  }
 }
}
function sceneDetail(scene,step){
 if(scene===2){
  const entries=[['교과','교과성적','반영 교과·산출식'],['종합','학교생활기록부','평가 항목·면접'],['논술','대학별 논술 답안','문항 유형·수능최저'],['수능','영역별 수능 성적','영역 비율·학생부 반영']];
  return '<div class="typegrid">'+entries.map(([a,b,c],i)=>'<div class="'+(i===step?'active':'')+'"><span>'+a+'</span><b>'+b+'</b><small>'+c+'</small></div>').join('')+'</div>';
 }
 if(scene===3&&step===2)return '<div class="scoreSplit"><div><b>60</b><span>수능</span></div><div><b>40</b><span>교과역량평가</span></div></div>';
 if(scene===4)return '<div class="branchrail" aria-label="선택한 결과에 따른 다음 단계"><b>'+['최초합격','예비순위','충원합격','최종 불합격'][step]+'</b><i></i><div>'+[step===2?'충원 등록':'수시 등록','충원 발표 확인','정시 지원 가능'].map((s,i)=>'<span class="'+(i===[0,1,0,2][step]?'lit':'')+'">'+s+'</span>').join('')+'</div></div>';
 return extraVisual(scene,step);
}


const slides=[...document.querySelectorAll('.slide')];
const labels=JSON.parse(document.getElementById('labels').textContent);
const proofs=JSON.parse(document.getElementById('proofs').textContent);
const refs=JSON.parse(document.getElementById('refs').textContent);
const assets=JSON.parse(document.getElementById('assets').textContent);
const main=document.querySelector('main'), dialog=document.getElementById('panel');
const byId=id=>document.getElementById(id);
let page=0,step=0,opener=null;
const total=slides.length;
const firstMap=slides.findIndex(slide=>slide.classList.contains('mapSlide'))+1;
const guidePage=slides.findIndex(slide=>slide.classList.contains('family-guide'))+1;
const guidePanels=[...slides[guidePage-1].querySelectorAll('.family-panel')];
const chapterStarts=[1,4,10,38,43,57,76,firstMap];
const chapterLabels=['표지와 목차','2028 인원 분석','5등급제 실시에 따른 변화','논서술형 평가 역량 변화','통합형 수능에 따른 변화','지역의사제','마무리','학부모 대입 지도'];
function route(){
 const m=location.hash.match(/^#(\d+)(?:\.(\d+))?$/);
 const n=Math.max(1,Math.min(total,m?Number(m[1]):1));
 const steps=n===guidePage?guidePanels.length:n>=firstMap?journey[n-firstMap].steps.length:1;
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
 const prevPage=page,oldCenter=prevPage>=firstMap?slides[prevPage-1].querySelector('.station.selected circle'):null;
 const xy=oldCenter&&[Number(oldCenter.getAttribute('cx')),Number(oldCenter.getAttribute('cy'))];
 if(page&&page!==n)slides[page-1].hidden=true;
 page=n;step=s;const slide=slides[n-1];slide.hidden=false;
 if(n===guidePage){
  guidePanels.forEach((panel,i)=>{panel.hidden=i!==s});
  slide.querySelectorAll('[data-step]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===s)));
 }
 if(n>=firstMap){
  slide.innerHTML=sceneHTML(n-firstMap,s);
  drawRoute(slide.querySelector("svg"),n-firstMap,s,prevPage===n?previousStep:null);
  if(xy&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
   const marker=slide.querySelector('.station.selected circle'),cx=Number(marker.getAttribute('cx')),cy=Number(marker.getAttribute('cy'));
   marker.animate([{transform:'translate('+(xy[0]-cx)+'px,'+(xy[1]-cy)+'px)'},{transform:'translate(0,0)'}],{duration:540,easing:'cubic-bezier(.2,.8,.2,1)'});
  }
 }
 slide.querySelectorAll('[data-asset]').forEach(im=>{im.src=assets[im.dataset.asset]});
 byId('count').textContent=n+' / '+total;byId('progress').style.width=(n/total*100)+'%';
 byId('part').textContent=n<firstMap?'1부　대교협 설명회':'2부　학부모 대입 지도';
 byId('source').hidden=n>=firstMap||n===guidePage||n===1;byId('prev').disabled=n===1;byId('next').disabled=n===total;
 byId('zoom').hidden=n>=firstMap;byId('zoom').setAttribute('aria-pressed',main.classList.contains('zoom')&&n<firstMap?'true':'false');
 if(n>=firstMap)main.classList.remove('zoom');
 byId('zoom').textContent=main.classList.contains('zoom')?'축소':'확대';
 byId('announce').textContent=n+'장. '+labels[n-1];
 document.title=labels[n-1]+' · 2028 대입 설명회';
 if(prevPage!==n){main.scrollTo(0,0);slide.querySelector('.content')?.scrollTo(0,0)}
 if(dialog.open)dialog.close();
}
function toggleZoom(){
 if(page>=firstMap)return;
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
  const jumps=document.createElement('div');jumps.className='jumpParts';
  [[1,'1부 처음'],[firstMap,'2부 대입 지도']].forEach(([num,label])=>{let a=document.createElement('a');a.href='#'+num;a.textContent=label;jumps.append(a)});inside.append(jumps);
  const chapters=document.createElement('select');chapters.setAttribute('aria-label','장별 바로 이동');
  chapterLabels.forEach((label,i)=>chapters.add(new Option(label,chapterStarts[i])));
  chapters.value=chapterStarts.filter(k=>k<=page).at(-1);
  chapters.onchange=()=>go(Number(chapters.value));inside.append(chapters);
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
 if(page===guidePage+1&&direction<0){go(guidePage,guidePanels.length-1);return}
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
 else if(page>=firstMap&&['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();go(page,Math.max(0,Math.min(journey[page-firstMap].steps.length-1,step+(e.key==='ArrowDown'?1:-1))))}
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

