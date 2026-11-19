/* A fictional cohort. Every random draw has a stable key so moving an application
   or opening a report cannot change a semester, another applicant, or the exam. */
const Game = (() => {
  const subjects = ['국어','영어','수학','통합사회','통합과학'];
  const mockSubjects = [...subjects,'한국사'];
  const types = ['꾸준히 쌓는 형','실전 집중형','탐구 몰입형'];
  const typesText = ['수업 복습의 효과가 큽니다.','시간을 재고 푸는 연습에 강합니다.','질문을 탐구 기록으로 발전시키기 쉽습니다.'];
  const terms = ['고1 1학기','고1 2학기','고2 1학기','고2 2학기','고3 1학기','고3 2학기'];
  const tasks = ['교과 공부','모의고사 연습','교과 탐구','글쓰기·면접'];
  const events = [
    ['첫 수행평가를 준비하는 날','자료의 출처가 서로 다릅니다. 무엇부터 할까요?','두 자료의 차이 설명하기','친구 앞에서 근거 말하기','출처를 비교한 첫 탐구 노트','친구 질문에 근거를 들어 답한 발표'],
    ['선택과목 신청 주간','희망 과목에서 어떤 질문을 이어갈까요?','통학 시간 차이 조사하기','교실 온도 변화 측정하기','사회와 문화 수업으로 이어갈 통학 설문','물리학 수업으로 이어갈 온도 관찰'],
    ['탐구 결과가 예상과 다릅니다','발표일까지 일주일이 남았습니다.','조건을 바꿔 다시 측정하기','반론을 담아 보고서 고치기','두 조건을 비교한 후속 실험','반론을 검토한 수정 보고서'],
    ['학교 발표회에 초대받았습니다','지난 학기 탐구를 누구에게 어떻게 설명할까요?','질의응답 발표 맡기','근거를 묶어 글로 내기','청중 질문을 받아 설명한 경험','여러 근거를 연결한 논증문'],
    ['마지막 수시 학생부를 정리하는 날','선생님이 활동의 변화를 물어봅니다.','처음 질문과 결론 연결하기','모의 면접으로 과정 설명하기','세 학기의 질문과 결론을 연결한 기록','탐구의 한계를 설명한 모의 면접'],
    ['수능 전 마지막 자습 시간','연습 시험이 끝났습니다. 남은 시간을 어디에 쓸까요?','오답 원인을 다시 쓰기','제한 시간에 한 세트 더 풀기','틀린 이유와 수정 과정을 쓴 오답장','시간 배분을 조절한 마지막 실전 연습']
  ];
  const effects = [[['record',4],['speak',5]],[['record',4],['record',4]],[['record',5],['write',5]],[['speak',6],['write',6]],[['record',5],['speak',5]],[['write',3],['mock',2]]];
  const bound=(v,lo=0,hi=100)=>Math.max(lo,Math.min(hi,v));
  const mean=a=>a.reduce((s,v)=>s+v,0)/a.length;
  const clone=v=>JSON.parse(JSON.stringify(v));
  function noise(seed,key) {
    let h=2166136261;
    for (const c of seed+'|'+key) h=Math.imul(h^c.charCodeAt(0),16777619);
    h=Math.imul(h^(h>>>16),0x85ebca6b); h=Math.imul(h^(h>>>13),0xc2b2ae35);
    return ((h^(h>>>16))>>>0)/4294967296;
  }
const EARLY_LIMIT = 5;
  const category = c => ({교과:'학생부교과',서류:'학생부종합',면접:'학생부종합',논술:'논술'})[c.kind];
  function fastPlan(r,i){
    const draw=(key,count)=>Math.floor(noise(r.seed,'quick-'+i+'-'+key)*count);
    const tokens=[0,0,0,0];
    for(let j=0;j<6;j++)tokens[draw('time'+j,4)]++;
    return {tokens,focus:draw('school',5),mockFocus:draw('mock',5),event:draw('event',2)};
  }
  function quickStart(r){
    if(r.phase!=='setup')return;
    r.quick=true;
    for(let i=0;i<5;i++){
      r.plan=fastPlan(r,i);r.phase='plan';finishTerm(r);
    }
  }
  function addEarly(r,id){
    if(r.phase!=='early'||r.early.length>=EARLY_LIMIT||r.early.includes(id))return;
    const c=EarlyCases.find(c=>c.id===id);
    if(!c||(c.name==='경희대'&&!r.referred))return;
    r.early.push(id);
  }
  function removeEarly(r,id){
    if(r.phase==='early')r.early=r.early.filter(item=>item!==id);
  }
  function fresh(seed=crypto.getRandomValues(new Uint32Array(1))[0]) {
    return {version:3,balanceVersion:2,seed,phase:'setup',type:0,start:[72,72,72,72,72],history:[],plan:blank(),early:[],late:[],referred:false,replay:false,checkpoint:null};
  }
  function blank(){return {tokens:[2,2,1,1],focus:0,mockFocus:2,event:0};}
  const relative=(p,cuts)=>1+cuts.filter(c=>p<c).length;
  const achievement=v=>'ABCDE'[v>=90?0:v>=80?1:v>=70?2:v>=60?3:4];
  const percentile=score=>bound(100/(1+Math.exp(-(score-64)/10.5)),0,100);
  const schoolGrade=v=>relative(percentile(v),[90,66,34,10]);
  function mockGrade(v,i){
    if(i===1)return bound(1+Math.ceil((90-v)/10),1,9);
    if(i===5)return bound(1+Math.ceil((40-Math.round(v/2))/5),1,9);
    return relative(percentile(v),[96,89,77,60,40,23,11,4]);
  }
// Roll once per school term, on the activity in which the student invested most.
  function termEvent(run,plan,index){
    const most=Math.max(...plan.tokens);
    const leaders=plan.tokens.flatMap((n,j)=>n===most?[j]:[]);
    const task=leaders[Math.floor(noise(run.seed,'event-task-'+index)*leaders.length)];
    const roll=noise(run.seed,'effort-return-'+index);
    const level=roll<.2?'low':roll<.8?'normal':'high';
    const multiplier={low:.6,normal:1,high:1.5}[level];
    return {task,level,multiplier,invested:most};
  }
  function termReport(run,plan){
    const i=run.history.length, prev=run.history.at(-1);
    const a=prev?prev.learned:run.start, b=prev?prev.practice:run.start;
    const effortEvent=termEvent(run,plan,i);
    const [study,practice,research,expression]=plan.tokens.map((n,j)=>j===effortEvent.task?n*effortEvent.multiplier:n);
    const rand=(tag,s)=>noise(run.seed,i+'-'+tag+'-'+s)*2-1;
    function improve(old,effort,focus,kind,index){
      const diminishing=.35+(100-old)/75;
      const rate=1.15*effort+(focus===index?.85*effort:0)+(kind===run.type?.65:0);
      return bound(old+(rate-1.9)*diminishing+rand(kind?'practice':'school',index)*1.6);
    }
    const learned=a.map((v,j)=>improve(v,study,plan.focus,0,j));
    const practiceScores=b.map((v,j)=>improve(v,practice,plan.mockFocus,1,j));
    const [effect,gain]=effects[i][plan.event];
    // A course choice in year one establishes a thread that can continue into year two.
    if(i===1)learned[plan.event===0?3:4]=bound(learned[plan.event===0?3:4]+2);
    if(i===2&&research>0){
      const chosen=run.history[1].plan.event===0?3:4;
      learned[chosen]=bound(learned[chosen]+Math.min(2,research));
    }
    const school=learned.map((v,j)=>Math.round(bound(v+rand('class-test',j)*2.6)));
    const mock=practiceScores.map((v,j)=>Math.round(bound(v+rand('mock-test',j)*3.8+(effect==='mock'?gain:0))));
    mock.push(Math.round(bound((mean(learned)+learned[3])/2+rand('history',5)*5)));
    const hidden={...(prev?.hidden||{record:43,speak:46,write:46})};
    hidden.record=bound(hidden.record+research*(run.type===2?3.7:3.1));
    hidden.speak=bound(hidden.speak+expression*2.6);
    hidden.write=bound(hidden.write+expression*2.8+(run.balanceVersion===2?practice*.7:0));
    if(effect!=='mock')hidden[effect]=bound(hidden[effect]+gain);
    const record=[events[i][4+plan.event]];
    if(i===2&&research>0)record.push(run.history[1].plan.event===0?'지난 학기 통학 설문 자료를 다시 분석함':'지난 학기 온도 측정 자료와 비교함');
    if(plan.tokens[2]>=2)record.push('추가 자료를 찾아 탐구 질문을 구체화함');
    if(plan.tokens[3]>=2)record.push('답변을 녹음하고 글의 근거를 다시 다듬음');
    return {i,effortEvent,plan:clone(plan),learned,practice:practiceScores,school,mock,grades:school.map(schoolGrade),levels:school.map(achievement),mockGrades:mock.map(mockGrade),hidden,record};
  }
  function finishTerm(r){
    if(r.phase!=='plan'||r.history.length>=6||r.plan.tokens.reduce((a,b)=>a+b,0)!==6)return;
    r.history.push(termReport(r,r.plan));r.phase='report';
  }
  function nextReport(r){
    if(r.phase!=='report')return;
    if(r.history.length===5){
      r.checkpoint={history:clone(r.history),referred:r.referred};
      r.phase='early';
    }else if(r.history.length===6){
      r.exam=finalExam(r);r.phase='exam';
      r.lastTerm=clone(r.history[5]);
    }else{r.plan=clone(r.plan);r.phase='plan';}
  }
  function finalExam(r){
    const last=r.history[5];
    const rehearsal=mean(r.history.map(term=>term.plan.tokens[1]));
    const examPressure=r.balanceVersion===2?Math.max(0,4.4-.75*rehearsal):0;
    const scores=last.practice.map((v,i)=>Math.round(bound(v+(noise(r.seed,'csat'+i)-.5)*9+(last.plan.event===1?1:0)-examPressure)));
    scores.push(Math.round(bound(last.mock[5]+(noise(r.seed,'csat-history')-.5)*7)));
    return {scores,grades:scores.map(mockGrade)};
  }
  function minMet(c,g){
    const [k,e,m,s,p,h]=g, t=Math.min(s,p), v=[k,m,e,t].sort((a,b)=>a-b);
    switch(c.id){
      case 'inha-essay':
      case '아주대':return v[0]+v[1]<=6;
      case 'knu-grades':
      case 'knu-essay':return v[0]+v[1]<=5;
      case 'gachon-grades':{
        const best=[k,e,m,s,p].sort((a,b)=>a-b);
        return best[0]+best[1]<=6;
      }
      case 'donga-grades':return v[0]<=4;
      case 'yonsei-essay':return k+m+t<=6&&e<=3&&h<=4;
      case 'korea-essay':return k+m+e+t<=8&&h<=4;
    }
    switch(c.name){
      case '경희대':return v[0]+v[1]<=5&&h<=5;
      case '경북대':return v[0]+v[1]<=6;
      case '부산대':return v[0]+v[1]+v[2]<=7;
      case '건국대':return [...v,h].sort((a,b)=>a-b).slice(0,3).reduce((a,b)=>a+b,0)<=8;
      case '연세대':return Math.min(k+Math.min(m,s,p),m+Math.min(s,p))<=4&&e<=3&&h<=4;
      default:return true;
    }
  }
  function earlyScore(c,hist,modern){
    const academic=mean(hist.map(t=>mean(t.school))), {record,speak,write}=hist.at(-1).hidden;
    if(c.name==='부산대'||c.id==='knu-grades')return .80*academic+.20*(.65*academic+.35*record);
    if(c.name==='경희대')return .70*academic+.30*(.65*academic+.35*record);
    if(c.kind==='교과')return academic;
    if(c.kind==='논술'){
      const exam=.42*academic+.58*write;
      const weight=c.essayWeight??(modern&&c.id==='inha-essay' ? .9 : 1);
      return weight*exam+(1-weight)*academic;
    }
    const document=.70*academic+.30*record;
    if(c.kind!=='면접')return document;
    const share=({'아주대':.3,'동아대':.4,'서울대':.5,'연세대':.3,'가천대':.5,'인천대':.4,'충남대':1/3,'국립공주대':.3,'전북대':.2,'인하대':.3,'전남대':.3})[c.name]??.3;
    return (1-share)*document+share*speak;
  }
  function lateScore(c,scores,hist){
    const [k,e,m,s,p]=scores;
    if(c.name==='조선대')return .25*k+.15*e+.35*m+.25*p;
    const academic=mean(hist.map(t=>mean(t.school)));
    const field=c.lateField||c.field;
    const exam=field==='공학'||field==='자연'?.20*k+.15*e+.35*m+.10*s+.20*p:.30*k+.18*e+.24*m+.18*s+.10*p;
    const schoolShare=({'서울대':.4,'연세대':.1,'경북대':.1,'부산대':.2,'충남대':.15})[c.name]||0;
    if(c.name==='충남대')return .8*exam+.15*academic+5;
    return exam*(1-schoolShare)+academic*schoolShare;
  }
  function toggleLate(r,id){
    const c=Admissions.find(u=>u.name===id),list=r.late;
    if(!c||r.phase!=='late')return;
    if(list.includes(id)){list.splice(list.indexOf(id),1);return;}
    if(list.some(n=>Admissions.find(u=>u.name===n).group===c.group))return;
    list.push(id);
  }
  function editApplications(r){
    if(r.phase!=='ending')return;
    r.lastTerm=clone(r.history[5]);
    r.history=clone(r.checkpoint.history);
    r.referred=r.checkpoint.referred;
    r.registered=null;
    r.replay=true;
    r.phase='early';
  }
  function submitEarly(r){
    if(r.phase!=='early'||r.early.length>EARLY_LIMIT)return;
    if(r.replay){
      r.history.push(clone(r.lastTerm));
      r.exam??=finalExam(r);
      // An early offer closes regular admission, including any drafts retained on return.
      if(results(r).some(row=>row.accepted))r.late=[];
      r.phase='exam';
    }
    else if(r.quick){
      r.plan=fastPlan(r,5);r.phase='plan';finishTerm(r);nextReport(r);
    }else{r.plan=clone(r.history[4].plan);r.phase='plan';}
  }
  function outcome(r,c,late){
    const hist=r.checkpoint.history, baseline=late?(c.lateTarget||c.target):c.target;
    const key=late?c.name:c.id;
    const calibration=(late?AdmissionCalibration.late:AdmissionCalibration.early)[key];
    const modern=r.balanceVersion===2;
    const target=modern&&calibration?calibration.target:baseline;
    const score=late?lateScore(c,r.exam.scores,hist):earlyScore(c,hist,modern);
    const draw=key+(late?'정시':'수시');
    // Selective pools share part of the same cohort. Drawing each in isolation
    // would inflate the chance that at least one of three schools offers a place.
    const selective=modern&&['서울대','연세대','고려대'].includes(c.name);
    const localPool=noise(r.seed,draw+'pool');
    const pool=selective ? .55*noise(r.seed,'selective-cohort')+.45*localPool : localPool;
    const cutoff=target+(pool-.5)*10;
    const margin=score-cutoff;
    const passes=late||minMet(c,r.exam.grades);
    const waiting=passes&&margin<0&&margin>=-6;
    const moved=1+Math.floor(noise(r.seed,draw+'moves')*(selective?2:5)),position=Math.max(1,Math.ceil(-margin));
    const status=!passes?'최저 미충족':margin>=0?'최초합격':waiting&&position<=moved?'충원합격':waiting?'예비 종료':'불합격';
    const reason=!late&&c.kind==='논술'&&!['최초합격','충원합격'].includes(status)?(!passes?'수능최저 미충족':(c.minimum.includes('없음')?'수능최저 없음':'수능최저 충족')+' · 논술전형 총점 부족'):'';
    return {reason,name:c.name,major:late?(c.lateMajor||c.major):c.major,kind:late?c.group+'군 '+c.late:c.early,status,wait:waiting,position,moved,accepted:['최초합격','충원합격'].includes(status)};
  }
  const results=(r,late=false)=>(late?r.late:r.early).map(id=>outcome(r,late?Admissions.find(c=>c.name===id):EarlyCases.find(c=>c.id===id),late));
  function saveEnding(r,name){
    r.registered=name;r.phase='ending';
  }
function compareStrategies(r){
    // Each case draws its own competitors. A single early application, or skipping
    // early admissions and filing one regular application, makes each offer reachable.
    const scenarios=[];
    function evaluate(c,late){
      const row=outcome(r,c,late);
      const applied=late?r.late.includes(c.name):r.early.includes(c.id);
      scenarios.push({c,row,late,applied,route:late?'정시':category(c)});
    }
    EarlyCases.filter(c=>c.name!=='경희대'||r.checkpoint.referred).forEach(c=>evaluate(c,false));
    Admissions.forEach(c=>evaluate(c,true));
    const offers=scenarios.filter(x=>x.row.accepted).sort((a,b)=>
      compareAdmissionOrder(a.c,b.c) || Number(b.applied)-Number(a.applied) ||
      Number(b.row.status==='최초합격')-Number(a.row.status==='최초합격'));
    const best=offers[0];
    const actual=offers.find(x=>x.applied);
    return {best,actual,equivalent:best?.c.order!=null?offers.filter(x=>x.c.order===best.c.order):[],
      routes:['학생부교과','학생부종합','논술','정시'].map(route=>({
        route,top:offers.find(x=>x.route===route),tested:scenarios.filter(x=>x.route===route).length
      }))};
  }
  return {subjects,mockSubjects,types,typesText,terms,tasks,events,blank,fresh,finishTerm,nextReport,submitEarly,saveEnding,compareStrategies,results,toggleLate,editApplications,category,quickStart,addEarly,removeEarly,EARLY_LIMIT,minMet,mean,bound};
})();
