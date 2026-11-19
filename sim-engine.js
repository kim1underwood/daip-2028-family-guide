/* Shared, deterministic rules for the family seminar. Student scores and competitors are fictional. */
const Game = (() => {
  const people = [
    {name:'서윤',type:'내신 강점형',quote:'수업을 정리하는 건 좋은데, 시험에서는 마지막 지문을 자주 놓쳐요.',base:[3.6,3.1,3.0,2.7,3.6,3.8],spread:1.02,school:2.0,record:60,speak:58,write:59,interest:'사회',strength:'수업 정리',weak:'시간 안배'},
    {name:'민재',type:'시험 강점형',quote:'수학은 금방 풀어요. 왜 그렇게 풀었는지 설명하려면 막힐 때가 있어요.',base:[3.2,2.0,2.9,3.4,2.6,4.0],spread:.69,school:3.0,record:50,speak:47,write:67,interest:'공학',strength:'수학 실전',weak:'풀이 설명'},
    {name:'지우',type:'진로 탐색형',quote:'교통 문제도, 친환경 기술도 재밌어요. 어떤 수업부터 들어볼까요?',base:[3.3,3.2,3.2,2.9,3.0,3.6],spread:.83,school:2.6,record:67,speak:64,write:55,interest:'융합',strength:'질문과 탐구',weak:'과목 선택'}
  ];
  const subjects=['국어','수학','영어','통합사회','통합과학','한국사'];
  const stages=[
    {time:'중3 겨울',title:'고등학교에 가기 전, 어떤 습관을 만들까요?',note:'2026년 겨울입니다. 40분의 자습 시간을 어떻게 쓸지 정해 보세요.',opts:[
      ['독해 시간을 재기','지문에 근거를 표시하고 제한 시간 안에 다시 풉니다.','국어 실전 안정','수학 연습 시간 감소'],
      ['수학 풀이 설명하기','같은 문제를 두 방식으로 풀고 친구에게 설명합니다.','수학·설명력 향상','독해 보완이 늦어짐'],
      ['주간 복습표 쓰기','틀린 개념과 수행 일정을 매주 한 번씩 정리합니다.','학업 습관 향상','실전 연습 시간 감소']]},
    {time:'고1 · 2027',title:'다음 학년의 선택과목을 정해 볼까요?',note:'공통과목을 배운 뒤 학교가 개설한 과목을 살펴봅니다. 선택한 수업은 이후의 탐구 기록으로 이어집니다.',opts:[
      ['물리학','움직임과 힘을 배우고 작은 구조물의 하중을 비교합니다.','기계공학 탐구','사회 현상 탐구 기회 감소'],
      ['사회와 문화','통학 시간 설문을 설계하고 지역 교통 정책을 비교합니다.','정책·사회 탐구','물리 실험 기회 감소'],
      ['확률과 통계','상점 방문객 자료로 예측 모형을 만들고 오차를 살핍니다.','자료 분석 탐구','한 주제의 심화 시간 감소']]},
    {time:'고2 · 2028',title:'수업을 마친 뒤, 무엇을 더 남길까요?',note:'수행평가 제출까지 2주. 활동을 학생부에 어떻게 기록할지는 교사가 결정합니다. 학생은 실제로 한 일과 배운 내용을 쌓습니다.',opts:[
      ['오차를 다시 검토하기','자료를 다시 모아 처음 결론이 달라지는지 확인합니다.','탐구 근거 보강','말하기 연습 시간 감소'],
      ['친구 질문에 답하기','발표 뒤 받은 질문에 근거를 들어 답해 봅니다.','면접 설명력 향상','자료 추가 수집 시간 감소'],
      ['교과 개념 다지기','수행에서 놓친 개념을 복습해 다음 지필평가를 준비합니다.','내신 보완','탐구 확장 시간 감소']]},
    {time:'고2 겨울',title:'겨울방학 여섯 칸을 어디에 쓸까요?',note:'한 칸은 일주일에 반복할 자습 한 묶음입니다. 합계는 모두 6칸입니다.',opts:[
      ['국어 실전 4 · 탐구 1 · 논술 1','시간을 재고 오답의 원인을 분류합니다.','국어 편차 감소','면접 사례 보강이 적음'],
      ['국어 실전 1 · 탐구 4 · 논술 1','선택과목 보고서를 다듬고 꼬리 질문을 연습합니다.','서류·면접 보강','국어 편차가 남음'],
      ['국어 실전 1 · 탐구 1 · 논술 4','제시문을 비교해 답안을 쓰고 근거와 반론을 고칩니다.','논술 답안 향상','국어·면접 연습이 적음']]}
  ];
  const sources={
    kh:['경희대 입학처 · 인쇄 9~14, 20~21쪽','https://iphak.khu.ac.kr/detail.do?board_seq=17147&menuurl=wvOt10B5et6zMa%2FM59G%2BxQ%3D%3D'],
    ku:['건국대 입학처 · 인쇄 10~14, 24~25쪽','https://enter.konkuk.ac.kr/file/pdfDown.pdf?ofn=2028입학전형시행계획_260330.pdf&sfn=20260430101618182_1292.pdf'],
    ih:['인하대 입학처 · 인쇄 5, 10쪽 (교육청 게시본)','https://use.go.kr/component/file/ND_fileDownload.do?q_fileSn=876433&q_fileId=5b884140-e638-4389-bb96-f6aa543c8171'],
    aj:['아주대 입학처 · 인쇄 2, 7쪽','https://www.iajou.ac.kr/notice/view.php?bn=78459&m_type=ALL'],
    history:['대입정보포털 어디가 · 인하대 2025학년도 결과','https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2026&unvCd=0000169'],
    rules:['대교협 · 2028학년도 대학입학전형기본사항','https://www.kcue.or.kr/_upload/news/2026/10/20/application_ab1942705812e69b5fd5bd8277987ab3.pdf'],
    reform:['교육부 · 2028 대입 개편 확정안','https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=97551&lev=0']
  };
  const cases={
    kh:{name:'경희대 행정학과',type:'학생부교과 · 지역균형',area:'사회',rule:'학교장 추천과 3학기 이상 교과 성적 필요. 국·수·영·탐구(상위 1) 중 2합 5, 한국사 5 이내. 학생부 교과·비교과 70%와 교과종합평가 30%.'},
    ih:{name:'인하대 기계공학과',type:'학생부종합 · 인하미래인재(면접형)',area:'공학',rule:'기계공학과는 수능최저 미적용. 1단계 서류 100%로 3.5배수, 2단계는 1단계 성적 70%와 면접 30%.'},
    ku:{name:'건국대 경영학과',type:'논술 · KU논술',area:'융합',rule:'논술 100%. 한국사·국·수·영·탐구(상위 1) 중 3개 영역 등급 합 8 이내.'},
    eng:{name:'아주대 기계공학과',type:'정시 다군 · 일반전형',area:'공학',weights:[20,40,10,5,25]},
    hum:{name:'아주대 행정학과',type:'정시 다군 · 일반전형',area:'사회',weights:[35,20,15,25,5]}
  };
  const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
  function random(seed){
    let x=seed>>>0;
    return ()=>{x=(Math.imul(1664525,x)+1013904223)>>>0;return (x+.5)/4294967296};
  }
  function normal(r){return Math.sqrt(-2*Math.log(r()))*Math.cos(2*Math.PI*r())}
  function profile(person, choices){
    const p=people[person], s={...p,means:[...p.base],evidence:[],course:'',area:p.interest};
    const [habit,course,project,winter]=choices;
    if(habit===0){s.means[0]-=.48;s.spread-=.13}
    if(habit===1){s.means[1]-=.35;s.speak+=9}
    if(habit===2){s.school-=.38;s.record+=4}
    if(course!==undefined){
      s.course=stages[1].opts[course][0];s.area=['공학','사회','융합'][course];
      s.means[[4,3,1][course]]-=.38;s.record+=5;
      s.evidence.push(['구조물의 하중을 비교한 물리 실험','통학 시간 설문과 교통정책 비교','방문객 수 예측과 오차 분석'][course]);
    }
    if(project===0){s.record+=13;s.evidence.push('추가 자료로 첫 결론을 다시 검토함')}
    if(project===1){s.speak+=17;s.record+=5;s.evidence.push('친구의 질문을 받고 근거를 들어 답함')}
    if(project===2){s.school-=.4;s.means[1]-=.18}
    if(winter===0){s.means[0]-=.85;s.spread-=.21;s.write+=3}
    if(winter===1){s.record+=11;s.speak+=14;s.evidence.push('탐구 한계와 후속 질문을 정리함')}
    if(winter===2){s.write+=22;s.means[0]-=.2}
    s.school=clamp(s.school,1,5);s.spread=clamp(s.spread,.35,1.25);
    return s;
  }
  function exam(s,r){
    const shared=normal(r)*.32;
    const values=s.means.map((m,i)=>clamp(m+shared+normal(r)*(i===0?s.spread:.61),1,9));
    return {grades:values.map(Math.round),values};
  }
  function minimum(id,g){
    const [ko,ma,en,so,sc,hi]=g;
    const best=[ko,ma,en,Math.min(so,sc)];
    if(id==='ku')best.push(hi);
    best.sort((a,b)=>a-b);
    if(id==='kh')return best[0]+best[1]<=5&&hi<=5;
    if(id==='ku')return best[0]+best[1]+best[2]<=8;
    return true;
  }
  function mocks(s,seed){
    const r=random(seed^0x2671);
    const exams=[[],[],[]];
    s.means.forEach((mean,i)=>{
      const raw=exams.map(()=>normal(r)),avg=raw.reduce((a,b)=>a+b,0)/raw.length;
      exams.forEach((g,j)=>g.push(Math.round(clamp(mean+(raw[j]-avg)*(i===0?s.spread:.61),1,9))));
    });
    return exams;
  }
  function preview(s,seed){
    const r=random(seed^0x22d733),counts={kh:0,ku:0};
    for(let i=0;i<1000;i++){const g=exam(s,r).grades;for(const id of ['kh','ku'])counts[id]+=Number(minimum(id,g))}
    return counts;
  }
  function rank(score,field){return 1+field.filter(v=>v>score).length}
  function field(seed,center){const r=random(seed);return Array.from({length:59},()=>center+normal(r)*11)}
  function rated(id,score,seed,center,competitors=null){
    const salt={kh:1047,ih:2017,ku:5433,eng:7733,hum:8567}[id];
    const pos=rank(score,competitors||field(seed^salt,center));
    const more=2+Math.floor(random(seed^Math.imul(salt,7757))()*9);
    return {pos,score,first:pos<=10,wait:pos>10&&pos<=24,fill:pos>10&&pos<=10+more,reason:'가상 '+(competitors?'2단계 35명':'경쟁집단 60명')+' 중 '+pos+'위'};
  }
  function early(id,s,examResult,seed,rec){
    if(id==='kh'&&!rec)return {reason:'학교장 추천 미확인'};
    if(!minimum(id,examResult.grades))return {reason:'수능최저 미충족'};
    const fit=s.area===cases[id].area?6:0;
    const school=100-(s.school-1)*15;
    if(id==='kh')return rated(id,school*.7+(s.record+fit)*.3,seed,68);
    if(id==='ku')return rated(id,s.write,seed,65);
    const doc=school*.32+s.record*.68+fit;
    const interviewRng=random(seed^42822);
    const peers=field(seed^2341,70).map(paper=>({paper,talk:65+normal(interviewRng)*14})).sort((a,b)=>b.paper-a.paper);
    if(rank(doc,peers.map(p=>p.paper))>35)return {reason:'가상 서류 1단계에서 미선발'};
    const finalists=peers.slice(0,34).map(p=>p.paper*.7+p.talk*.3);
    return rated(id,doc*.7+s.speak*.3,seed,65,finalists);
  }
  function late(id,ex,seed){
    const w=cases[id].weights;
    const english=w[2]===10?[100,98,96,84,60,40,20,10,0]:[150,147,144,126,90,60,30,15,0];
    const parts=w.map((weight,i)=>i===2?english[ex.grades[2]-1]:weight*10*clamp(1-(ex.values[i]-1)*.07,.36,1));
    const score=parts.reduce((a,b)=>a+b,0)-[0,0,0,0,5,10,20,30,40][ex.grades[5]-1];
    return {...rated(id,score/10,seed,78),total:score};
  }
  function results(run){
    const s=profile(run.person,run.choices),ex=exam(s,random(run.seed^0x326787));
    const rows=run.apps.map(id=>({id,...early(id,s,ex,run.seed,run.rec)}));
    return {s,ex,rows,offers:rows.filter(row=>row.first||row.fill).map(row=>row.id)};
  }
  function suggest(stage,s,counts){
    if(stage===0)return s.spread>.9?0:s.school>=2.9?2:1;
    if(stage===1)return ['공학','사회','융합'].indexOf(s.interest);
    if(stage===2)return s.school>=2.8?2:s.speak<60?1:0;
    if(stage===3)return s.area==='융합'&&s.write<80?2:counts.kh<610?0:1;
  }
  return {people,subjects,stages,cases,sources,profile,mocks,preview,minimum,results,late,suggest};
})();
