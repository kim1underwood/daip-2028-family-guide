(() => {
  const $=id=>document.getElementById(id);
  const key='pandong.semesters.v3';
  let r,storeOK=true,expanded=false,reportIndex=null;
  let draftCategory='',draftSchool='',draftId='';
  try { const saved=JSON.parse(localStorage.getItem(key)); r=saved?.version===3&&Array.isArray(saved.history)?saved:Game.fresh(); }
  catch { r=Game.fresh(); }
  const save=()=>{try{localStorage.setItem(key,JSON.stringify(r));}catch{storeOK=false;}};
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const btn=(label,act,cls='',value='',disabled=false)=>'<button type="button" class="'+cls+'" data-act="'+act+'" data-v="'+esc(value)+'" '+(disabled?'disabled':'')+'>'+label+'</button>';
  const next=(label,act,disabled=false)=>'<div class="actionbar">'+btn(label+'　→',act,'primary','',disabled)+'</div>';
  const head=(k,title,desc='')=>'<div class="eyebrow">'+k+'</div><h1 id="stageTitle" tabindex="-1">'+title+'</h1>'+(desc?'<p class="lead">'+desc+'</p>':'');
  const select=(name,label,vs,current)=>'<label class="select">'+label+'<select data-select="'+name+'">'+vs.map(([id,text])=>'<option value="'+esc(id)+'" '+(String(current)===String(id)?'selected':'')+'>'+esc(text)+'</option>').join('')+'</select></label>';
  const pairs=a=>a.map((x,i)=>[i,x]);
  const sceneId=()=>r.phase==='ending'||r.phase==='register'?8:r.phase==='setup'?3:Math.min(7,3+Math.max(0,r.history.length-(r.phase==='report'?1:0)));
  function art(id,cl=''){return '<div aria-hidden="true" class="art '+cl+'" style="--ax:'+(id%3*50)+'%;--ay:'+Math.floor(id/3)*50+'%"></div>';}
  function map(){
    const where=r.phase==='ending'?r.registered||'미등록':r.phase==='early'?'수시 원서 작성':r.phase==='late'?'정시 원서 작성':'';
    const current=r.history.at(-1);
    const stamp=current?'<div class="mapstats"><b>'+Game.terms[current.i]+'</b> 내신 평균 '+Game.mean(current.grades).toFixed(1)+' · 모의 평균 '+Game.mean(current.mockGrades).toFixed(1)+'</div>':'';
    const rows=['중3 겨울',...Game.terms.slice(0,5),'수시 지원',Game.terms[5],'수능·합격 발표','대학 등록'];
    let pos=r.phase==='setup'?0:r.phase==='early'?6:r.phase==='exam'||['initial','fill','late','lateResults'].includes(r.phase)?8:r.phase==='register'||r.phase==='ending'?9:r.phase==='report'?(r.history.length===6?7:r.history.length):(r.history.length===5?7:r.history.length+1);
    $('atlas').innerHTML='<div class="scene">'+art(sceneId(),'landscape')+'<span class="scene-stamp">'+(pos===0?'2026 · 겨울':pos<7?(2027+Math.floor(Math.min(pos-1,4)/2))+' · 학교생활':pos===7?'2029 · 가을':'2030학년도 · 대입')+'</span></div><div class="maphead">'+art(r.avatar,'face')+'<div><small>나의 입시 여정</small><strong>'+Game.names[r.avatar]+'의 진학 지도</strong></div><div class="mapActions">'+btn(expanded?'접기 ▴':'펼치기 ▾','map','maptoggle')+btn('처음부터','restart','resetmap')+'</div></div><div class="road '+(expanded?'expanded':'')+'"><ol>'+rows.map((t,i)=>'<li class="'+(i===pos?'here':i<pos?'done':'')+'"><i></i><span>'+t+'</span>'+(i===pos?'<b>현재</b>':'')+'</li>').join('')+'</ol>'+stamp+(where?'<div class="destination">'+esc(where)+'</div>':'')+(r.history.length?btn('학기별 성적표 열기','journal','thin'):'')+'</div>';
    const b=$('atlas').querySelector('.maptoggle');b.setAttribute('aria-expanded',String(expanded));b.setAttribute('aria-controls','journeyRoad');$('atlas').querySelector('.road').id='journeyRoad';
  }
  function setup(){
    return head('중3 겨울　/　출발 준비','어떤 학생으로 시작할까요?','출발 성적과 학습 습관을 정하세요. 고등학교 여섯 학기를 보내고, 같은 성적표로 두 번의 입시를 경험합니다.')+
    '<section class="fastlane"><div><strong>입시만 체험하기</strong><p>아래 출발 성적으로 다섯 학기를 무작위 진행하고, 고3 1학기 성적표를 받습니다.</p></div>'+btn('입시 선택으로 바로가기 →','quick','primary')+'</section>'+
    '<fieldset><legend>학생 선택</legend><div class="avatars">'+Game.names.map((n,i)=>'<label><input type="radio" name="avatar" value="'+i+'" '+(r.avatar===i?'checked':'')+'>'+art(i,'portrait')+'<b>'+n+'</b></label>').join('')+'</div></fieldset>'+
    '<fieldset><legend>학습 습관</legend><div class="radios">'+Game.types.map((t,i)=>'<label><input type="radio" name="type" value="'+i+'" '+(r.type===i?'checked':'')+'><span>'+t+'</span></label>').join('')+'</div><p id="typehint" class="muted">'+Game.typesText[r.type]+'</p></fieldset>'+
    '<fieldset><legend>출발 성적 <small>중3 가상 진단 · 100점 만점</small></legend><div class="sliders">'+Game.subjects.map((s,i)=>'<div><label for="s'+i+'">'+['국어','영어','수학','사회','과학'][i]+'</label><input id="s'+i+'" type="range" min="0" max="100" value="'+r.start[i]+'" data-score="'+i+'"><input aria-label="'+s+' 점수 직접 입력" type="number" inputmode="numeric" min="0" max="100" value="'+r.start[i]+'" data-num="'+i+'"></div>').join('')+'</div></fieldset>'+next('고1 첫 학기 시작','start');
  }
  function plan(){
    const i=r.history.length,p=r.plan,remaining=6-p.tokens.reduce((s,v)=>s+v,0),event=Game.events[i];
    return head((2027+Math.floor(i/2))+'년　/　'+Game.terms[i],i===0?'첫 학기의 시간을 나눠 보세요.':'이번 학기에는 어디에 힘을 쓸까요?','매주 반복할 자습 시간은 여섯 칸입니다. 한 활동을 줄이면 다른 활동에 시간을 더 쓸 수 있습니다.')+
    '<div class="sectionhead"><h2>시간 배분</h2><b id="balance">남은 시간 '+remaining+'칸</b></div><div class="alloc">'+Game.tasks.map((t,j)=>'<div><div><strong>'+t+'</strong><div class="pips" aria-hidden="true">'+Array.from({length:6},(_,k)=>'<i class="'+(k<p.tokens[j]?'on':'')+'"></i>').join('')+'</div></div><div class="stepper">'+btn('−','minus','step',j,p.tokens[j]===0)+'<output>'+p.tokens[j]+'</output>'+btn('+','plus','step',j,remaining===0)+'</div></div>').join('')+'</div>'+
    '<div class="selectrow">'+select('focus','교과 집중 과목',pairs(Game.subjects),p.focus)+select('mockFocus','모의고사 집중 과목',pairs(Game.subjects),p.mockFocus)+'</div>'+
    '<fieldset class="event"><legend>학기 중 갈림길</legend><h2>'+event[0]+'</h2><p>'+event[1]+'</p><div class="radios">'+[0,1].map(j=>'<label><input type="radio" name="event" value="'+j+'" '+(p.event===j?'checked':'')+'>'+event[2+j]+'</label>').join('')+'</div></fieldset>'+next(Game.terms[i]+' 성적표 받기','finishTerm',remaining!==0);
  }
const eventCopy={
    high:['복습한 개념이 여러 단원에서 이어졌습니다.','연습한 풀이 순서가 실전에서도 잘 맞았습니다.','다시 살펴본 자료에서 질문을 풀 단서를 찾았습니다.','여러 번 고친 설명이 짧고 분명해졌습니다.'],
    normal:['정한 분량을 꾸준히 복습했습니다.','연습한 시간 배분을 시험에서도 지켰습니다.','계획한 자료를 모아 질문과 연결했습니다.','계획한 만큼 답안을 쓰고 발표를 연습했습니다.'],
    low:['어려운 단원을 다시 익히는 데 시간이 들었습니다.','낯선 문제에서 연습한 풀이 순서를 조정해야 했습니다.','자료의 조건이 달라 일부를 다시 모아야 했습니다.','질문을 새로 해석하느라 답변을 다시 구성했습니다.']
  };
  function eventCard(h){
    const ev=h.effortEvent;
    if(!ev)return '';
    const label={high:'기대 이상',normal:'예상대로',low:'기대 이하'}[ev.level];
    const subject=ev.task===0?Game.subjects[h.plan.focus]+' · ':ev.task===1?Game.subjects[h.plan.mockFocus]+' · ':'';
    return '<section class="eventCard '+ev.level+'"><div><small>이번 학기 투자 성과</small><h2>'+label+'</h2><p>'+eventCopy[ev.level][ev.task]+'</p></div><div class="eventTicket"><b>'+subject+Game.tasks[ev.task]+' '+ev.invested+'칸</b><span>학습 효과 ×'+ev.multiplier.toFixed(1)+'</span></div></section>';
  }
  function report(h){
    const prev=r.history[h.i-1];
    const delta=(a,b)=>b===undefined?'':a===b?' <small>유지</small>':' <small class="'+(a<b?'better':'')+'">'+(a<b?'↑':'↓')+Math.abs(b-a)+'</small>';
    const strongest=h.school.indexOf(Math.max(...h.school));
    const evidence=[
      ['면접',h.hidden.speak>=74?'후속 질문에도 구체적인 사례를 들어 답합니다.':h.hidden.speak>=58?'탐구 과정을 순서대로 설명합니다.':'답변에 자신의 사례를 붙이는 연습이 필요합니다.'],
      ['논술',h.hidden.write>=74?'반론을 검토하고 결론을 고쳐 씁니다.':h.hidden.write>=58?'주장과 근거가 이어지는 글을 씁니다.':'주장의 근거를 문장으로 정리하는 단계입니다.'],
      ['탐구 기록',h.hidden.record>=74?'여러 학기에 걸쳐 질문을 발전시킨 흔적이 있습니다.':h.hidden.record>=55?'수업에서 생긴 질문을 자료로 확인했습니다.':'질문과 관찰을 처음 기록하고 있습니다.']
    ];
    const trail=r.history.slice(0,h.i+1);
    const growth=trail.length>1?'<div class="trend"><b>교과 평균등급 추이</b><div>'+trail.map(t=>{const avg=Game.mean(t.grades);return '<span><i style="height:'+Math.round(8+(5-avg)*9)+'px"></i><strong>'+avg.toFixed(1)+'</strong><small>'+['1–1','1–2','2–1','2–2','3–1','3–2'][t.i]+'</small></span>';}).join('')+'</div></div>':'';
    const comments=growth+'<details class="feedback"><summary>담임 상담 기록 · 면접, 논술, 탐구</summary>'+evidence.map(([label,comment])=>'<p><b>'+label+'</b>　'+comment+'</p>').join('')+'</details>';
    return eventCard(h)+'<div class="reportSummary"><div><small>교과 평균등급</small><strong>'+Game.mean(h.grades).toFixed(1)+'</strong></div><div><small>모의고사 평균등급</small><strong>'+Game.mean(h.mockGrades).toFixed(1)+'</strong></div></div><table><caption>학기 성적표 · 화살표는 직전 학기 대비 등급 변화</caption><thead><tr><th>과목</th><th>성취도</th><th>내신<br><small>5등급</small></th><th>모의고사<br><small>9등급</small></th></tr></thead><tbody>'+Game.mockSubjects.map((s,i)=>'<tr><th scope="row">'+s+'</th><td>'+(h.levels[i]||'—')+'</td><td>'+(i<5?h.grades[i]+delta(h.grades[i],prev?.grades[i]):'—')+'</td><td>'+h.mockGrades[i]+delta(h.mockGrades[i],prev?.mockGrades[i])+'</td></tr>').join('')+'</tbody></table><p class="fine">국어·수학·탐구는 가상 응시집단의 상대등급입니다. 영어·한국사 모의고사는 절대평가입니다. 사회·과학 행은 교과군의 대표 과목입니다. 사회·과학 융합선택 과목은 석차등급을 산출하지 않아 평균에서 제외합니다.</p>'+
    '<div class="journal"><b>이번 학기에 남긴 기록</b><p>'+h.record.join(' · ')+'</p><p>'+Game.subjects[h.plan.focus]+' 교과 공부 '+h.plan.tokens[0]+'칸, '+Game.subjects[h.plan.mockFocus]+' 실전 연습 '+h.plan.tokens[1]+'칸. 탐구 '+h.plan.tokens[2]+'칸과 표현 연습 '+h.plan.tokens[3]+'칸을 배분했습니다. 이번 교과 성적이 가장 높았던 과목은 '+Game.subjects[strongest]+'입니다.</p></div>'+comments;
  }
  function reportPage(){
    const h=r.history.at(-1);
    return head((2027+Math.floor(h.i/2))+'년　/　학기 결산',Game.terms[h.i]+' 성적표',r.quick&&h.i===4?'다섯 학기를 자동으로 진행했습니다. 이 성적표로 수시 원서를 고르세요.':'')+report(h)+next(h.i===4?'고3 1학기 저장하고 수시 지원':h.i===5?'수능 성적 확인':'다음 학기 계획 세우기','nextReport');
  }
  function src(c,late){
    const pages=late?c.latePages:c.pages;
    const link=c.name==='조선대'?c.url:c.url+'#page='+parseInt(pages,10);
    if(c.name==='조선대') return '<a href="'+esc(link)+'" target="_blank" rel="noopener">한글 시행계획 '+(late?'20~21':'15')+'쪽 · 모집인원표 30쪽부터 ↗</a>';
    return '<a href="'+esc(link)+'" target="_blank" rel="noopener">시행계획 '+(c.name==='조선대'?'본문 ':'PDF ')+pages+'쪽 ↗</a>'+(c.quotaUrl?' · <a target="_blank" rel="noopener" href="'+esc(c.quotaUrl)+'">모집단위별 인원표 ↗</a>':'');
  }
  function advice(late){
    if(!r.replay)return '';
    const options=Game.advice(r,late);
    return '<section class="advice"><small>두 번째 지원 · 전략 상담</small><h2>고3 1학기 기록으로 고른 후보</h2><p>관심 분야와 지원 성향, 당시 내신·모의고사를 함께 봤습니다. 당시 모의고사를 바탕으로 시험 점수와 경쟁자를 바꿔 100회 가상 실험했습니다. 횟수는 게임 안에서의 결과입니다.</p><div class="selectrow">'+select('interest','관심 분야',['모두','사회','인문','공학','자연'].map(v=>[v,v]),r.interest)+select('risk','지원 성향',['도전','균형','안정'].map(v=>[v,v]),r.risk)+'</div>'+options.map(({c,gap,gate,offers})=>'<div class="tip"><b>'+c.name+' '+(late?(c.lateMajor||c.major):c.major)+'</b><span>'+(!gate?'당시 모의고사는 수능최저 미달':gap<0?'가상 경쟁선에 도전하는 선택':gap<5?'가상 경쟁선에 근접한 선택':'가상 경쟁선에 여유가 있는 선택')+' · '+(late?c.group+'군':c.early)+' · 가상 100회 중 '+offers+'회 합격</span></div>').join('')+'</section>';
  }
const earlyCase=id=>EarlyCases.find(c=>c.id===id);
  const bands={'상향':'reach','적정':'match','하향':'safe'};
  const badge=label=>'<span class="band '+bands[label]+'">'+label+'</span>';
  const caseTitle=(c,late)=>late?(c.lateMajor||c.major):c.major;
  const caseTrack=(c,late)=>late?c.group+'군 · '+c.late:c.early;
  function availableCases(late){
    return late?Admissions.filter(c=>c.group===draftCategory):EarlyCases.filter(c=>Game.category(c)===draftCategory);
  }
  function schoolRows(search=''){
    const late=r.phase==='late', cases=availableCases(late);
    const names=[...new Set(cases.map(c=>c.name))].sort((a,b)=>a.localeCompare(b,'ko'));
    return names.map(name=>{
      const tracks=cases.filter(c=>c.name===name), first=tracks[0], major=caseTitle(first,late);
      if(!(name+major+first.campus).includes(search.trim()))return '';
      const used=late?r.late.includes(name):tracks.every(c=>r.early.includes(c.id));
      const ratings=[...new Set(tracks.map(c=>Game.band(r,c,late)))];
      return '<button class="schoolRow" data-act="chooseSchool" data-v="'+esc(name)+'" '+(used?'disabled':'')+'><span><b>'+name+'</b><small>'+major+' · '+first.campus+'</small></span><span>'+(used?'담음':ratings.length===1?badge(ratings[0]):'세부전형 '+tracks.length+'개')+'</span></button>';
    }).join('')||'<p class="muted">검색 결과가 없습니다.</p>';
  }
  function openSchools(){
    if(!draftCategory)return;
    $('drawer').classList.add('schoolSheet');
    dialog(draftCategory+(r.phase==='late'?'군':'')+' 대학 선택','<label class="sheetSearch">대학·학과·지역 검색<input type="search" id="schoolSearch" autocomplete="off" placeholder="예: 인천, 기계공학"></label><div class="schoolRows" id="schoolRows">'+schoolRows()+'</div>');
    if(!matchMedia('(max-width:800px)').matches)$('schoolSearch').focus();
  }
  function applications(late){
    const limit=late?3:Game.EARLY_LIMIT;
    const picked=late?r.late.map(n=>Admissions.find(c=>c.name===n)):r.early.map(earlyCase);
    const categories=late?['가','나','다']:['학생부교과','학생부종합','논술'];
    const choices=availableCases(late).filter(c=>c.name===draftSchool);
    const multi=choices.length>1;
    const c=multi?choices.find(c=>c.id===draftId):choices[0];
    const summary=late?head('2030학년도　/　정시 지원','정시 원서함','모집군과 대학을 고르세요. 가·나·다군에 한 장씩 담고, 제출 전까지 바꿀 수 있습니다.'):head('고3 1학기 이후　/　수시 지원','수시 원서함','전형과 대학을 골라 최대 다섯 장을 담으세요. 제출 전까지 원서를 바꿀 수 있습니다.');
    let picker='';
    if(picked.length<limit){
      picker='<div class="wizard"><h2>'+(late?'모집군 선택':'전형 선택')+'</h2><div class="routes">'+categories.map(t=>{
        const used=late&&picked.some(c=>c.group===t);
        return '<button data-act="category" data-v="'+t+'" aria-pressed="'+(t===draftCategory)+'" '+(used?'disabled':'')+'>'+t+(late?'군':'')+(used?' · 담음':'')+'</button>';
      }).join('')+'</div>';
      if(draftCategory)picker+='<button id="schoolPicker" class="schoolTrigger" aria-haspopup="dialog" data-act="schools"><span>학교 선택</span><b>'+esc(draftSchool||'대학을 선택하세요')+'　⌄</b></button>';
      if(multi)picker+='<fieldset><legend>세부전형 선택</legend><div class="trackButtons">'+choices.map(track=>'<button data-act="track" data-v="'+esc(track.id)+'" aria-pressed="'+(draftId===track.id)+'" '+(r.early.includes(track.id)?'disabled':'')+'>'+track.early+' '+badge(Game.band(r,track))+'</button>').join('')+'</div></fieldset>';
      if(c){
        const needsRef=!late&&c.name==='경희대'&&!r.referred;
        picker+='<div class="candidate"><div><b>'+c.name+' '+caseTitle(c,late)+'</b>'+badge(Game.band(r,c,late))+'<small>'+caseTrack(c,late)+'</small></div>'+btn('원서 담기','addCase','primary',late?c.name:c.id,needsRef)+'</div>';
        if(needsRef)picker+=r.replay?'<p class="fine">이 학생의 첫 지원 당시 학교장 추천이 없어 담을 수 없습니다.</p>':'<label class="check"><input id="allowReferral" type="checkbox"> 학교장 추천을 받은 학생으로 진행</label>';
      }
      picker+='</div>';
    }
    const basket='<section class="basket"><div class="sectionhead"><h2>내 원서</h2><b>'+picked.length+' / '+limit+'장</b></div>'+
      (picked.length?picked.map(c=>'<div class="basketline"><div><strong>'+c.name+' '+caseTitle(c,late)+'</strong> '+badge(Game.band(r,c,late))+'<small>'+caseTrack(c,late)+'</small></div><div>'+btn('상세','caseDetails','quiet',late?c.name:c.id)+btn('삭제','removeCase','quiet',late?c.name:c.id)+'</div></div>').join(''):'<p class="muted">담은 원서가 없습니다.</p>')+'</section>';
    const consult=r.replay?'<details class="consult"><summary>다시 지원하기 · 상담 추천 보기</summary>'+advice(late)+'</details>':'';
    return summary+consult+picker+basket+(picked.length>limit?'<p>이전 버전에서 담은 원서를 다섯 장 이하로 정리하면 제출할 수 있습니다.</p>':'')+next(picked.length?(late?'정시':'수시')+' 원서 '+picked.length+'장 제출':late?'정시 지원 건너뛰기':'수시 없이 정시 준비하기',late?'submitLate':'submitEarly',picked.length>limit);
  }
  function caseDetails(id){
    const late=r.phase==='late',c=late?Admissions.find(c=>c.name===id):earlyCase(id);
    if(!c)return;
    const description=late?c.lateRule||'대학별 수능 반영 영역과 환산 방법은 시행계획을 확인하세요.':c.rule;
    dialog(c.name+' '+caseTitle(c,late),'<h3>'+caseTrack(c,late)+'</h3><p>'+description+'</p><p>'+(late?'고교 졸업예정 및 해당 수능 응시':c.minimum)+'</p><p>'+src(c,late)+'</p><p class="fine">'+(late?'정시 지원 수준은 이 학생의 수능 성적과 대학별 가상 경쟁선을 비교해 표시합니다.':'수시 지원 수준은 고3 1학기까지의 기록과 모의고사로 판단합니다.')+'</p>');
  }
  function notices(rows,first=false){
    return rows.length?rows.map(x=>'<div class="notice"><div><b>'+x.name+' '+x.major+'</b><small>'+x.kind+'</small></div><strong class="'+((first?x.status==='최초합격':x.accepted)?'success':'')+'">'+(first&&x.wait?'예비 '+x.position+'번':x.status)+'</strong>'+(!first&&x.wait?'<p>예비 '+x.position+'번 · '+x.moved+'번까지 충원</p>':'')+'</div>').join(''):'<p class="muted">제출한 원서가 없습니다.</p>';
  }
  function exam(){
    return head('2029년 11월　/　대학수학능력시험','수능 성적이 도착했습니다.',r.replay?'첫 지원과 같은 고3 2학기·수능 결과입니다.':'여섯 학기가 끝났습니다. 이제 수능최저 충족 여부와 원서 결과를 확인하세요.')+'<div class="exam">'+Game.mockSubjects.map((s,i)=>'<div><small>'+s+'</small><strong>'+r.exam.grades[i]+'<em>등급</em></strong></div>').join('')+'</div>'+next('수시 최초 발표 열기','initial');
  }
  function outcomePage(){
    const late=r.phase==='lateResults',first=r.phase==='initial',rows=Game.results(r,late),accepted=rows.some(x=>x.accepted);
    return head('2030학년도　/　합격 발표',late?'정시 결과가 나왔습니다.':first?'수시 최초합격 발표':'수시 충원까지 마감됐습니다.',first?'예비번호를 받았다면 충원 발표까지 확인하세요.':late?'가상 지원자들의 성적과 충원 이동을 반영한 결과입니다.':accepted?'수시 최초·충원 합격자는 등록 여부와 관계없이 정시에 지원할 수 없습니다.':'수시 합격이 없어 정시 원서함으로 이동할 수 있습니다.')+notices(rows,first)+next(first?'충원 발표 확인':late||accepted?'등록 선택하기':'정시 원서함 열기',first?'fill':late||accepted?'register':'late');
  }
  function register(){
    const accepted=[...Game.results(r),...Game.results(r,true)].filter(x=>x.accepted);
    const offers=[...new Map(accepted.map(x=>[x.name+' '+x.major,x])).values()];
    return head('2030학년도　/　최종 등록',offers.length?'등록할 대학을 선택하세요.':'이번 원서 접수가 끝났습니다.',offers.length?'합격한 모집단위 중 한 곳에 등록할 수 있습니다.':'이번 회차의 기록을 남기고 같은 학생으로 다시 지원할 수 있습니다.')+
    '<div class="offers">'+offers.map(x=>btn(x.name+' '+x.major+'　등록 →','enroll','offer',x.name+' '+x.major)).join('')+btn(offers.length?'등록 포기':'결과 정리하기','enroll','thin','')+'</div>';
  }
  function ending(){
    const current={early:Game.results(r),late:Game.results(r,true),registered:r.registered};
    const count=a=>[...a.early,...a.late].filter(x=>x.accepted).length;
    const summary=x=>'<div><b>'+esc(x.registered||'미등록')+'</b><span>수시 '+x.early.length+'장 · 정시 '+x.late.length+'장 · 합격 '+count(x)+'곳</span></div>';
    return head('2030학년도　/　'+(r.replay?'지원 비교':'첫 번째 결과'),r.registered?esc(r.registered)+' 등록':'이번 여정은 미등록으로 끝났습니다.',r.replay?'같은 학생, 같은 수능, 같은 경쟁 조건으로 비교한 결과입니다.':'고3 1학기 원서 접수 직전이 저장되어 있습니다. 지원을 다시 하면 그때의 성적표로 상담을 받을 수 있습니다.')+
    (r.replay?'<div class="comparison"><section><small>첫 지원</small>'+summary(r.first)+'</section><section><small>이번 지원</small>'+summary(current)+'</section></div><details><summary>첫 지원의 원서별 결과</summary>'+notices([...r.first.early,...r.first.late])+'</details>':'')+
    notices([...current.early,...current.late])+next('입시 선택 다시하기','replay');
  }
  function render(focus=false,award=false){
    map();const fn={setup,plan,report:reportPage,early:()=>applications(false),exam,initial:outcomePage,fill:outcomePage,late:()=>applications(true),lateResults:outcomePage,register,ending};
    $('desk').classList.toggle('reportArrival',award&&r.phase==='report');
    $('desk').innerHTML=fn[r.phase]();save();
    $('persist').textContent=storeOK?'이 기기에 자동 저장':'이 브라우저는 자동 저장을 지원하지 않습니다.';
    document.querySelectorAll('.stepper').forEach((el,j)=>{el.firstElementChild.setAttribute('aria-label',Game.tasks[j]+' 한 칸 줄이기');el.lastElementChild.setAttribute('aria-label',Game.tasks[j]+' 한 칸 늘리기');});
    if(focus){window.scrollTo(0,0);$('stageTitle')?.focus({preventScroll:true});}
  }
  function dialog(title,html){$('dialogTitle').textContent=title;$('dialogBody').innerHTML=html;if(!$('drawer').open)$('drawer').showModal();}
  function journal(){
    if(!r.history.length)return;
    reportIndex=reportIndex===null?r.history.length-1:Math.min(reportIndex,r.history.length-1);
    const tabs='<div class="termTabs" role="group" aria-label="학기 선택">'+r.history.map((h,i)=>'<button data-act="term" data-v="'+i+'" aria-pressed="'+(i===reportIndex)+'">'+Game.terms[i]+'</button>').join('')+'</div>';
    dialog('학기별 성적표',tabs+'<h3 class="journalTerm">'+Game.terms[reportIndex]+'</h3>'+report(r.history[reportIndex]));
  }
  function sources(){
    dialog('공식 전형과 게임의 가정','<p>2026년 중3 학생이 2030학년도에 지원하는 가상 상황입니다. 대학 사례는 2028학년도 시행계획을 사용합니다. 2030학년도 실제 전형은 해당 연도 모집요강을 확인하세요.</p><p>학생은 국내 일반고 전 과정을 이수하고 수능 6개 과목에 응시합니다. 수시는 학생부교과·학생부종합·논술 사례에서 게임용 원서 5장을 고릅니다. 실제 일반대학 수시 지원 한도는 원칙적으로 6회입니다. 같은 대학의 복수지원 가능 여부는 해당 연도 모집요강을 확인하세요. 수시는 고3 1학기까지의 모의고사와 학생부, 정시는 게임에서 응시한 수능 성적으로 지원 수준을 표시합니다.</p><p>학기 점수·경쟁선·지원자·예비 이동은 게임에서 생성합니다. 게임의 선발 점수는 실제 대학의 환산식이나 실측 합격 확률을 재현하지 않습니다. 학생부는 교과와 탐구 과정, 면접과 논술은 설명과 글쓰기 연습을 반영합니다.</p><p><a href="https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&amp;boardSeq=97551&amp;lev=0" target="_blank" rel="noopener">교육부 2028 대입 개편 확정안 ↗</a>　<a href="https://www.kcue.or.kr/_upload/news/2026/10/20/application_ab1942705812e69b5fd5bd8277987ab3.pdf" target="_blank" rel="noopener">대교협 기본사항 ↗</a></p>'+Admissions.map(c=>'<p><b>'+c.name+'</b>　'+src(c,false)+' · '+src(c,true)+'</p>').join(''));
  }
  function navigate(phase,award=false){draftCategory='';draftSchool='';draftId='';reportIndex=null;r.phase=phase;render(true,award);}
  document.addEventListener('click',e=>{
    const el=e.target.closest('[data-act]');if(!el)return;
    const act=el.dataset.act,v=el.dataset.v,phase=r.phase;
    if(act==='map'){expanded=!expanded;map();return;}
    if(act==='category'){
      draftCategory=v;draftSchool='';draftId='';render();openSchools();return;
    }
    if(act==='schools'){openSchools();return;}
    if(act==='chooseSchool'){
      draftSchool=v;draftId='';$('drawer').close();render();
      ($('desk').querySelector('[data-act="track"]:not(:disabled)')||$('desk').querySelector('[data-act="addCase"]:not(:disabled)')||$('schoolPicker'))?.focus({preventScroll:true});return;
    }
    if(act==='track'){draftId=v;render();$('desk').querySelector('[data-act="addCase"]')?.focus({preventScroll:true});return;}
    if(act==='term'){reportIndex=Number(v);journal();$('drawer').querySelector('[aria-pressed="true"]').focus({preventScroll:true});return;}
    if(act==='caseDetails'){caseDetails(v);return;}
    if(act==='addCase'||act==='removeCase'){
      if(phase==='late'){
        if((act==='addCase')!==r.late.includes(v))Game.toggleLate(r,v);
        draftCategory='';
      }else if(act==='addCase')Game.addEarly(r,v);else Game.removeEarly(r,v);
      draftSchool='';draftId='';render();return;
    }
    if(act==='journal'){journal();return;} if(act==='sources'){sources();return;} if(act==='close'){$('drawer').close();return;}
    if(act==='restart'){dialog('새 학생으로 시작할까요?','<p>이 기기의 현재 성적표와 지원 비교 기록을 새 학생의 기록으로 교체합니다.</p>'+btn('현재 학생 유지','close','thin')+' '+btn('새 학생 만들기','confirmRestart','primary'));return;}
    if(act==='confirmRestart'){$('drawer').close();r=Game.fresh();expanded=false;navigate('setup');return;}
    if(act==='plus'||act==='minus'){
      const j=Number(v),t=r.plan.tokens;
      if((act==='plus'&&t.reduce((a,b)=>a+b,0)<6)||(act==='minus'&&t[j]>0))t[j]+=act==='plus'?1:-1;
      render();document.querySelector('[data-act="'+act+'"][data-v="'+j+'"]:not(:disabled)')?.focus({preventScroll:true});return;
    }
    switch(act){
      case 'quick':Game.quickStart(r);break;
      case 'start':navigate('plan');return;
      case 'finishTerm':Game.finishTerm(r);break;
      case 'nextReport':Game.nextReport(r);break;
      case 'submitEarly':Game.submitEarly(r);break;
      case 'submitLate':navigate('lateResults');return;
      case 'enroll':Game.saveEnding(r,v);break;
      case 'replay':Game.replay(r);break;
      case 'initial':case 'fill':case 'register':case 'late':navigate(act);return;
      default:return;
    }
    navigate(r.phase,act==='finishTerm'||act==='quick');
  });
  document.addEventListener('input',e=>{
    const t=e.target;
    if(t.id==='schoolSearch'){$('schoolRows').innerHTML=schoolRows(t.value);return;}
    if(t.dataset.score!==undefined||t.dataset.num!==undefined){
      if(t.value==='')return;
      const i=Number(t.dataset.score??t.dataset.num),v=Game.bound(Math.round(Number(t.value))||0);
      r.start[i]=v;document.querySelector('[data-score="'+i+'"]').value=v;document.querySelector('[data-num="'+i+'"]').value=v;save();
    }
  });
  document.addEventListener('change',e=>{
    const t=e.target,s=t.dataset.select;
    if(t.dataset.num!==undefined){t.value=r.start[Number(t.dataset.num)];return;}
    if(t.name==='avatar'){r.avatar=+t.value;map();}
    else if(t.name==='type'){r.type=+t.value;$('typehint').textContent=Game.typesText[r.type];}
    else if(t.name==='event')r.plan.event=+t.value;
    else if(s==='focus'||s==='mockFocus')r.plan[s]=+t.value;
    else if(s==='interest'||s==='risk'){r[s]=t.value;render();}
    else if(t.id==='allowReferral'&&!r.replay){r.referred=t.checked;r.checkpoint.referred=t.checked;render();}
    save();
  });
  $('drawer').addEventListener('close',()=>{
    if($('drawer').classList.contains('schoolSheet')){
      $('drawer').classList.remove('schoolSheet');
      if(!draftSchool)$('schoolPicker')?.focus({preventScroll:true});
    }
  });
  render();
})();
