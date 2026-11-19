(() => {
  'use strict';
  const {people,subjects,stages,cases,sources,profile,preview,results,late,suggest}=Game;
  const $=id=>document.getElementById(id);
  const desk=$('desk'),atlas=$('atlas'),drawer=$('drawer'),guide=$('guideDialog');
  const fresh=()=>({person:0,seed:crypto.getRandomValues(new Uint32Array(1))[0],page:0,choices:[],apps:[],rec:false,lateId:null,registered:null,reference:null});
  let run=fresh(),pick=0,expanded=false,editing=null;
  const link=(key)=>'<a href="'+sources[key][1]+'" target="_blank" rel="noopener">'+sources[key][0]+' ↗</a>';
  const btn=(action,title,value='',cls='')=>'<button class="'+cls+'" data-action="'+action+'" data-value="'+value+'">'+title+'</button>';
  const next=(title='다음으로')=>btn('next',title+'　→','','primary');
  const note=t=>'<p class="note">'+t+'</p>';
  const number=n=>n.toLocaleString('ko-KR');
  function head(kicker,title,intro=''){return '<div class="kicker">'+kicker+'</div><h1 tabindex="-1">'+title+'</h1>'+(intro?'<p class="lede">'+intro+'</p>':'')}
  function panel(title,html){$('dialogTitle').textContent=title;$('dialogBody').innerHTML=html;if(!drawer.open)drawer.showModal();drawer.scrollTop=0}
  function journal(){
    const s=profile(run.person,run.choices),p=run.page;
    let html='<p>'+s.type+' · 관심 분야 '+s.area+' · 강점 '+s.strength+'</p>';
    if(p<=1)html+='<h3>중3의 출발점</h3><p>“'+s.quote+'”</p><p>고등학교 성적은 입학한 뒤 생성됩니다.</p>';
    else{
      const earlyYear=p===2;
      html+='<h3>현재 학습 상태</h3><div class="reportstats">'+[['모형 내신',s.school.toFixed(1)+' / 5등급'],['탐구 경험',s.record+' / 100'],['설명력',s.speak+' / 100'],['논술 연습',s.write+' / 100']].map(([k,v])=>'<div><small>'+k+'</small><b>'+v+'</b></div>').join('')+'</div>';
      const rows=Game.mocks(s,run.seed);
      html+='<h3>최근 세 번의 모의 연습</h3><p>현재 준비 상태로 모의 수능을 세 번 연습한 가상 성적입니다. 영역별 중심과 편차는 최저 충족 모의 시행에도 공통으로 쓰입니다.</p><table class="reporttable"><thead><tr><th>영역</th><th>1회</th><th>2회</th><th>3회</th></tr></thead><tbody>'+subjects.map((sub,i)=>'<tr><th>'+sub+'</th>'+rows.map(g=>'<td>'+g[i]+'등급</td>').join('')+'</tr>').join('')+'</tbody></table>';
      if(!earlyYear&&s.evidence.length)html+='<h3>수업에서 해 본 일</h3><p>'+s.evidence.join(' · ')+'</p>';
    }
    panel(s.name+'의 학생 기록표',html);
  }
  function stopLabel(i){return ['중3 출발','고1 과목 선택','고2 수업 탐구','겨울방학','수시 원서','수능','수시 발표','충원','정시','등록'][i]}
  function mapIndex(){return [0,0,1,2,3,4,5,6,7,run.page===9&&results(run).offers.length?9:8,8,9][run.page]}
  function renderMap(){
    const p=run.page,idx=mapIndex(),s=people[run.person],a=run.choices;
    const past=(i)=>a[i]===undefined?'':stages[i].opts[a[i]][0];
    const earlyWins=p>=9&&results(run).offers.length>0;
    const labels=[past(0),past(1),past(2),past(3),run.apps.map(k=>cases[k].name.split(' ')[0]).join(' · ')||(p>=6?'정시 집중':''),p>=6?'수능 성적 확인':'',p>=7&&run.apps.length?'최초 결과 확인':'',p>=8&&run.apps.length&&results(run).rows.some(r=>r.wait)?'충원 마감':'',p>=10&&run.lateId?cases[run.lateId].name:'',p===11?(run.registered?cases[run.registered].name:'미등록'):''];
    const coords=[[34,27],[70,79],[70,128],[70,177],[34,229],[34,282],[34,333],[34,386],[196,386],[115,450]];
    const spine='M34 27 C34 52 70 55 70 79 V177 C70 206 34 201 34 229 V386';
    const paths='<path class="railbase" d="'+spine+'"/><path class="railbase" d="M34 386 Q34 448 115 450"/><path class="railbase late" d="M34 386 C78 340 158 340 196 386 Q196 433 115 450"/>';
    const skippedEarly=p>=6&&!run.apps.length;
    const waiting=run.apps.length&&p>=7&&results(run).rows.some(r=>r.wait);
    let trace='';
    if(p){
      const segments=['M34 27','C34 52 70 55 70 79','V128','V177','C70 206 34 201 34 229','V282','V333','V386'];
      const last=skippedEarly?5:!waiting&&idx>=7?6:7;
      trace='<path class="traced" d="'+segments.slice(0,Math.min(idx,last)+1).join(' ')+'"/>';
      if(idx>=8&&!earlyWins){
        const y=skippedEarly?282:waiting?386:333;
        trace+='<path class="traced late" d="M34 '+y+' C115 '+y+' 164 345 196 386'+(idx===9?' Q196 433 115 450':'')+'"/>';
      }
      if(idx===9&&earlyWins)trace+='<path class="traced" d="M34 '+(waiting?386:333)+' Q34 448 115 450"/>';
    }
    const nodes=coords.map(([x,y],i)=>{
      const active=p>0&&i===idx,done=p>0&&i<idx&&!(i===8&&earlyWins)&&!(i===6&&skippedEarly)&&!(i===7&&!waiting),small=labels[i];
      let short=small.length>19?small.slice(0,18)+'…':small;
      return '<g class="station '+(active?'now':done?'done':'')+'"><title>'+stopLabel(i)+(small?' · '+small:'')+'</title>'+(active?'<circle class="halo" cx="'+x+'" cy="'+y+'" r="12"/>':'')+'<circle cx="'+x+'" cy="'+y+'" r="5"/><text x="'+(x+14)+'" y="'+(y+4)+'">'+stopLabel(i)+'</text>'+(short?'<text class="station-detail" x="'+(x+14)+'" y="'+(y+19)+'">'+short+'</text>':'')+'</g>';
    }).join('');
    atlas.className=expanded?'expanded':'';
    atlas.innerHTML='<div class="maphead"><span class="route-tag">진학 경로</span><h2>'+(p?s.name+'의 입시 지도':'중3에서 대학까지')+'</h2><p>'+(p?(stopLabel(idx)+'　·　'+(labels.slice(0,idx).filter(Boolean).at(-1)||'첫 선택 전')):'수시와 정시, 한 학생의 두 갈림길')+'</p></div>'+btn('expand',expanded?'경로 접기 −':'전체 경로 +','','mobiletoggle')+
    '<svg class="route" viewBox="0 0 320 475" role="img" aria-label="중3부터 수시와 정시를 거쳐 등록하는 경로, 현재 '+stopLabel(idx)+'">'+paths+trace+nodes+'</svg><div class="mapkey"><span>수시 경로</span><span>정시 경로</span></div>'+(p?btn('journal','학생 기록표 열기','','journalBtn'):'');
  }
  function choices(items,selected,rec,act){
    return '<div class="opts">'+items.map((o,i)=>'<button class="choice '+(i===selected?'chosen':'')+'" data-action="'+act+'" data-value="'+i+'" aria-pressed="'+(i===selected)+'"><span class="radio"></span><span><b>'+o[0]+'</b>'+(i===rec?'<em>추천</em>':'')+'<small>'+o[1]+'</small></span></button>').join('')+'</div>';
  }
  function start(){
    const s=people[run.person];
    return head('학부모 전략 시뮬레이션','입시의 갈림길','한 학생을 골라 고교 3년의 선택을 함께 해보세요. 같은 학생으로 다른 길도 걸어볼 수 있습니다.')+
      '<div class="cast">'+people.map((x,i)=>'<button data-action="person" data-value="'+i+'" aria-pressed="'+(i===run.person)+'"><span class="castmark m'+i+'" aria-hidden="true">'+['○','△','◇'][i]+'</span><b>'+x.name+'</b><small>'+x.type+'</small></button>').join('')+'</div>'+
      '<div class="quote"><p>“'+s.quote+'”</p><span>강점　<b>'+s.strength+'</b>　·　보완　<b>'+s.weak+'</b></span></div>'+
      '<div class="actions">'+next(s.name+'의 중3 겨울 시작')+'<small>예상 8~10분 · 선택 1개로 재도전 가능</small></div>'+note('2026년 중3이 2028 개편 체제로 진학한다고 가정합니다. 대학 사례는 2028학년도 시행계획을 참고합니다.');
  }
  function recommendWhy(i,s,r){
    if(i===0)return ['국어 시험의 변동 폭이 커 시간 연습의 효과를 살릴 수 있어요.','수학 풀이를 설명하며 기초와 말하기를 함께 다질 수 있어요.','현재 수행 준비에 비해 시험 기초가 탄탄해요. 복습 습관이 균형을 잡아줘요.'][r];
    if(i===1)return s.interest+'에 관심을 보인 학생이 수업에서 직접 확인할 기회예요.';
    if(i===2)return ['스스로 세운 결론을 검증한 과정이 탐구 기록에 남아요.','현재 설명력이 약해요. 질문에 답한 경험이 면접 준비와 이어져요.','현재 내신에서 보완할 여지가 커요. 다음 평가에 바로 활용할 수 있어요.'][r];
    return ['현재 모의 성적의 편차가 있어요. 국어 등급이 안정되면 교과전형의 최저를 넘길 가능성이 커져요.','현재 실전 성적을 바탕으로 탐구·면접 사례를 깊게 준비할 여유가 있어요.','자료를 분석한 경험을 논술 답안으로 옮기는 연습이 목표에 잘 맞아요.'][r];
  }
  function skillLine(before,after){
    const delta=(a,b)=>Math.round((b-a)*10)/10;
    const lines=[];
    if(after.school<before.school)lines.push('모형 내신 '+before.school.toFixed(1)+' → '+after.school.toFixed(1));
    for(let i=0;i<5;i++)if(delta(before.means[i],after.means[i])<0)lines.push(subjects[i]+' 예상 등급 중심 '+before.means[i].toFixed(1)+' → '+after.means[i].toFixed(1));
    if(after.speak>before.speak)lines.push('설명력 +'+(after.speak-before.speak));if(after.write>before.write)lines.push('논술 연습 +'+(after.write-before.write));
    if(after.record>before.record)lines.push('탐구 경험 +'+(after.record-before.record));
    return lines.slice(0,3).join('　·　');
  }
  function outlook(before,after){
    const from=preview(before,run.seed),to=preview(after,run.seed);
    return '<div class="miniForecast"><b>이 방학 계획의 최저 충족 전망</b><small>같은 모의 수능 1,000회 · 학습 전 → 학습 후</small><span>경희대　'+number(from.kh)+' → <strong>'+number(to.kh)+'회</strong>　 /　 건국대　'+number(from.ku)+' → <strong>'+number(to.ku)+'회</strong></span></div>';
  }
  function lesson(){
    const i=run.page-1,st=stages[i],s=profile(run.person,run.choices.slice(0,i));
    const rec=suggest(i,s,preview(s,run.seed)),opt=st.opts[pick],after=profile(run.person,[...run.choices.slice(0,i),pick]);
    return head(st.time,st.title,st.note)+
      '<div class="status">'+(i?'모형 내신 <b>'+s.school.toFixed(1)+'등급</b> · 설명력 <b>'+s.speak+'/100</b> · 논술 <b>'+s.write+'/100</b>':'현재 강점 <b>'+s.strength+'</b> · 보완할 점 <b>'+s.weak+'</b>')+'</div>'+
      choices(st.opts,pick,rec,'option')+'<div class="coach"><b>추천 이유</b> '+recommendWhy(i,s,rec)+'</div>'+
      '<div class="trade"><b>선택 효과</b> '+opt[2]+'　·　'+opt[3]+'<small>'+skillLine(s,after)+'</small></div>'+(i===3?outlook(s,after):'')+next('이 선택으로 진행');
  }
  function infoCard(id,extra=''){
    const c=cases[id];
    return '<div class="resultrow"><div><b>'+c.name+'</b><small>'+c.type+'</small></div>'+extra+'</div>';
  }
  function forecast(counts){return '<div class="forecast"><b>모의 수능 1,000회 중 최저 충족</b><div>경희대 <strong>'+number(counts.kh)+'회</strong>　건국대 <strong>'+number(counts.ku)+'회</strong></div><small>이 학생의 예상 영역별 등급과 시험 편차로 계산한 게임 내 횟수</small></div>'}
  function recommendedApp(s,c){
    const scores={kh:run.rec?100-s.school*12+c.kh/50:-1,ih:s.record*.6+s.speak*.4+(s.area==='공학'?12:0),ku:s.write+c.ku/100+(s.area==='융합'?5:0)};
    return Object.keys(scores).sort((a,b)=>scores[b]-scores[a])[0];
  }
  function applications(){
    const s=profile(run.person,run.choices),c=preview(s,run.seed),best=recommendedApp(s,c);
    return head('고3 · 2029년 9월','어디에 수시 원서를 쓸까요?','실제 수능 성적은 아직 모릅니다. 이번 게임에서는 두 곳까지 선택하거나 수시를 건너뛸 수 있습니다.')+
      forecast(c)+'<label class="check"><input type="checkbox" id="rec" '+(run.rec?'checked':'')+'> 담임 상담 후 학교장 추천을 확보한 상황으로 진행</label>'+
      '<div class="apps">'+['kh','ih','ku'].map(id=>'<button class="app '+(run.apps.includes(id)?'chosen':'')+'" data-action="app" data-value="'+id+'" aria-pressed="'+run.apps.includes(id)+'" '+((id==='kh'&&!run.rec)||(!run.apps.includes(id)&&run.apps.length>=2)?'disabled':'')+'><b>'+cases[id].name+'</b>'+(best===id?'<em>추천</em>':'')+'<small>'+cases[id].type+' · '+(id==='kh'?(run.rec?'추천 확인':'추천 필요'):id==='ih'?'수능최저 없음':'3합 8')+'</small></button>').join('')+'</div>'+
      '<div class="coach"><b>추천 이유</b> '+({kh:'내신과 현재 최저 충족 전망을 함께 살릴 수 있어요.',ih:'이수 과목과 수업 탐구를 서류·면접에서 설명할 기회가 있어요.',ku:'논술 답안 연습과 현재 최저 충족 전망이 이 전형에 어울려요.'}[best])+'</div>'+
      '<div class="actions">'+next(run.apps.length?run.apps.length+'곳 지원 확정':'수시 없이 정시 준비')+btn('sources','전형 조건 확인')+'</div>';
  }
  function examPage(){
    const {s,ex}=results(run);
    return head('고3 · 2029년 수능 성적 발표','수능 성적표가 나왔습니다','수시에서 최저를 판단하고 정시에서 환산할 때 이 성적표 한 장을 함께 씁니다.')+
      '<div class="grades">'+subjects.map((k,i)=>'<div><small>'+k+'</small><b>'+ex.grades[i]+'<i>등급</i></b></div>').join('')+'</div>'+forecast(preview(s,run.seed))+
      (s.evidence.length?'<div class="quote"><span>학생부에 담을 수 있는 수업 경험</span><p>'+s.evidence.join(' · ')+'</p></div>':'')+next(run.apps.length?'수시 최초 결과 확인':'정시 원서 고르기');
  }
  const status=(row,final)=>row.first?'최초합격':row.wait?(final?(row.fill?'충원합격':'충원 마감 · 불합격'):'예비 '+(row.pos-10)+'번'):'불합격';
  function earlyResults(final){
    const r=results(run);
    return head(final?'고3 · 충원 마감':'고3 · 수시 최초 발표',final?'충원 결과가 정해졌습니다':'지원한 전형의 결과를 열어봅니다',final?'최초·충원 합격이 한 곳이라도 있으면 일반대 정시 지원은 제한됩니다.':'예비순위는 대기 상태입니다. 충원이 끝나야 정시로 갈 수 있는지 확정됩니다.')+
      (r.rows.length?r.rows.map(row=>infoCard(row.id,'<div class="outcome"><b>'+status(row,final)+'</b><small>'+row.reason+'</small><small>'+officialResult(row.id,r.ex)+'</small></div>')).join(''):note('제출한 수시 원서가 없습니다. 정시로 진행합니다.'))+
      note('지원 자격과 최저는 2028 사례 기준으로 판정합니다. 선발 순위와 충원 인원은 가상 경쟁집단에서 생성합니다.')+next(final?(r.offers.length?'등록처 고르기':'정시 원서 고르기'):r.rows.some(row=>row.wait)?'충원 마감까지 보기':r.offers.length?'등록처 고르기':'정시 원서 고르기');
  }
  function officialResult(id,ex){
    if(id==='ih')return '기계공학과 수능최저 미적용';
    const g=ex.grades,science=g[4]<g[3]?4:3;
    const best=[0,1,2,science,...(id==='ku'?[5]:[])].sort((a,b)=>g[a]-g[b]).slice(0,id==='ku'?3:2);
    return best.map(i=>subjects[i]+' '+g[i]).join(' + ')+' = '+best.reduce((sum,i)=>sum+g[i],0)+(id==='kh'?' · 한국사 '+g[5]:'')+' → 최저 '+(Game.minimum(id,g)?'충족':'미충족');
  }
  function latePick(){
    const {s,ex,offers}=results(run);
    if(offers.length)return head('수시 등록','어느 대학에 등록할까요?','가상 합격 결과에서 최종 등록처 한 곳을 선택하세요. 등록을 포기해도 일반대 정시 지원은 제한됩니다.')+
      offers.map(id=>btn('register',cases[id].name+' 등록',id,'reg')).join('')+btn('register','등록 포기','none','muted');
    const ids=['eng','hum'];
    const best=[...ids].sort((a,b)=>late(b,ex,run.seed).total-late(a,ex,run.seed).total)[0];
    return head('고3 · 정시 원서','같은 성적표로 어느 학과에 지원할까요?','아주대 두 사례가 모두 다군이므로 한 곳만 선택합니다.')+
      '<div class="opts">'+ids.map(id=>{const c=cases[id];return '<button class="choice" data-action="late" data-value="'+id+'"><span><b>'+c.name+'</b>'+(id===best?'<em>환산 유리</em>':'')+'<small>국어·수학·영어·사회·과학　'+c.weights.join(' / ')+'%</small><small>모형 환산 '+late(id,ex,run.seed).total.toFixed(1)+' / 1,000점 · '+c.type+'</small></span></button>'}).join('')+'</div><div class="coach"><b>추천 이유</b> '+cases[best].name+'의 영역별 비율에서 이 성적표의 모형 환산점수가 더 높습니다. 관심 분야는 '+s.area+'입니다.</div>'+note('국어·수학·탐구는 가상 표준점수 비율을 사용합니다. 영어는 등급별 환산, 한국사는 등급별 감점을 적용합니다.');
  }
  function latePage(){
    const {ex}=results(run),row=late(run.lateId,ex,run.seed),ok=row.first||row.fill;
    return head('정시 · 등록 마감','정시 지원 결과',cases[run.lateId].type)+infoCard(run.lateId,'<div class="outcome"><b>'+status(row,true)+'</b><small>'+row.reason+'</small><small>모형 환산 '+row.total.toFixed(1)+'점</small></div>')+
      (ok?btn('register','이 대학에 등록',run.lateId,'primary'):'')+btn('register',ok?'등록 포기':'최종 경로 확인','none',ok?'muted':'primary');
  }
  function finish(){
    const {ex,s,offers}=results(run),ref=run.reference,win=run.registered?cases[run.registered].name:'미등록';
    return head('2030학년도 · 모의 결과',run.registered?win+' 등록':'이번 경로는 미등록으로 마칩니다',people[run.person].name+' 학생이 중3 겨울부터 걸어온 경로입니다.')+
      '<div class="debrief"><h3>결과를 설명하는 두 선택</h3><p><b>'+s.course+' 이수</b>　'+s.evidence[0]+'. '+(run.apps.includes('ih')?'서류와 면접 평가에 연결됐습니다.':'선택 과목의 탐구 경험으로 남았습니다.')+'</p><p><b>'+stages[3].opts[run.choices[3]][0]+'</b>　'+skillLine(profile(run.person,run.choices.slice(0,3)),s)+'. '+(offers.length?'수시 합격으로 정시 경로가 닫혔습니다.':'수시 합격이 없어 정시 지원이 가능했습니다.')+'</p></div>'+
      (ref?'<div class="comparison"><h3>한 선택을 바꾼 두 경로</h3><table><tr><th></th><th>처음</th><th>다시 선택</th></tr>'+[[stages[ref.changed].time,stages[ref.changed].opts[ref.choice][0],stages[ref.changed].opts[run.choices[ref.changed]][0]],['경희대 최저 / 1,000회',ref.count,preview(s,run.seed).kh],['국어 수능',ref.ko+'등급',ex.grades[0]+'등급'],...run.apps.map(id=>[cases[id].name,ref.admits[id],status(results(run).rows.find(r=>r.id===id),true)]),['최종 결과',ref.end,win]].map(v=>'<tr>'+v.map(t=>'<td>'+t+'</td>').join('')+'</tr>').join('')+'</table></div>':'')+
      '<div class="actions">'+btn('replay','한 선택만 바꿔 보기　↶','','primary')+btn('restart','새 게임')+'</div>';
  }
  function enter(page){
    run.page=page;
    if(page>=1&&page<=4){
      const s=profile(run.person,run.choices.slice(0,page-1));
      pick=run.choices[page-1]??suggest(page-1,s,preview(s,run.seed));
    }
    expanded=false;render();desk.querySelector('h1')?.focus({preventScroll:true});window.scrollTo(0,0);
  }
  function render(){
    renderMap();const p=run.page;
    desk.innerHTML=p===0?start():p<=4?lesson():p===5?applications():p===6?examPage():p<=8?earlyResults(p===8):p===9?latePick():p===10?latePage():finish();
    document.title=(p?people[run.person].name+'의 진학 경로':'입시의 갈림길')+' · 판동샘수학학원';
  }
  function sourcePanel(){
    panel('전형 출처와 게임 가정','<h3>2028 전형을 참고한 2030학년도 가상 사례</h3><p>세 학생은 국내 일반고 졸업예정자, 5학기 성적 보유, 전 영역 응시, 학교폭력 처분 이력 없음으로 설정했습니다. 경희대 추천은 원서 단계에서 별도로 확인합니다.</p>'+
      Object.keys(cases).map(id=>{let c=cases[id];return '<article><b>'+c.name+' · '+c.type+'</b><p>'+(c.rule||'수능 100%. 국·수·영·사·과 반영 비율 '+c.weights.join(' / ')+'%. 한국사 등급별 감점.')+'</p>'+link(c.weights?'aj':id)+'</article>'}).join('')+
      '<h3>실제 과거 입결</h3><p>2025학년도 인하대 인하미래인재 기계공학과는 40명 모집, 경쟁률 11.7 대 1이었습니다. 최종등록자 교과성적 70% 컷은 당시 9등급제에서 2.86등급입니다. 두 수치는 배경 자료로만 제시합니다.</p>'+link('history')+
      '<h3>게임이 정한 값</h3><p>학업 습관과 선택으로 움직이는 5등급제 내신 평균, 탐구·설명·논술 지수(100점), 영역별 예상 등급은 가상 학생의 설정값입니다. 모의 수능은 학생별 평균 등급에 공통 시험 변동과 영역별 정규분포 변동을 더해 1~9로 반올림합니다. 국어의 편차는 준비에 따라 달라집니다. 1,000회 중 조건을 만족한 횟수가 최저 충족 전망입니다.</p><p>실제 수능 한 번은 별도로 뽑습니다. 모형 표준점수 비율은 연속 등급 중심 1부터 한 등급당 7%p씩 낮춰 생성합니다. 가상 지원자 60명 중 10명이 최초 합격하고 예비 1~14번 가운데 2~10명이 순서대로 충원됩니다. 인하대는 먼저 서류로 35명을 남깁니다. 실제 모집인원·경쟁률을 재현한 합격 예측치는 아닙니다.</p><p>한 선택만 바꾸면 시험 당일 변동과 경쟁자, 원서 조합이 고정됩니다. 새 게임에서는 다시 추첨합니다.</p>'+link('rules')+'<br>'+link('reform'));
  }
  function replay(i){
    editing=i;
    panel('다른 선택으로 비교',i===null?'<p>바꿀 지점을 고르세요. 그 뒤의 학습 선택과 수시 원서, 시험 당일 조건을 그대로 두고 다시 계산합니다.</p>'+stages.map((st,j)=>btn('edit',st.time+' · '+st.opts[run.choices[j]][0],j,'reg')).join(''):
      '<p>'+stages[i].title+'</p>'+stages[i].opts.map((o,j)=>j===run.choices[i]?note('현재 선택 · '+o[0]):btn('replace',o[0],j,'reg')).join(''));
  }
  function change(choice){
    const old=results(run),i=editing;
    run.reference={changed:i,choice:run.choices[i],count:preview(old.s,run.seed).kh,ko:old.ex.grades[0],end:run.registered?cases[run.registered].name:'미등록',admits:Object.fromEntries(old.rows.map(r=>[r.id,status(r,true)]))};
    run.choices[i]=choice;drawer.close();
    const r=results(run);
    if(r.offers.length&&old.offers.length&&(r.offers.includes(run.registered)||run.registered===null))return enter(11);
    if(!r.offers.length&&run.lateId){const row=late(run.lateId,r.ex,run.seed);const prev=late(run.lateId,old.ex,run.seed),wasOffered=prev.first||prev.fill;
      if(!row.first&&!row.fill){run.registered=null;return enter(11)}
      if(wasOffered)return enter(11);
      run.registered=null;return enter(10)}
    run.registered=null;run.lateId=null;enter(9);
  }
  function openGuide(hash='#1'){
    $('guideFrame').src=$('guideFrame').dataset.url+hash;if(!guide.open)guide.showModal();
  }
  function route(){if(/^#[1-6](?:\.[1-9]\d*)?$/.test(location.hash))openGuide(location.hash)}
  function redrawChoice(action,value){
    render();document.querySelector('button[data-action="'+action+'"][data-value="'+value+'"]')?.focus({preventScroll:true});
  }
  document.addEventListener('change',e=>{if(e.target.id==='rec'){run.rec=e.target.checked;if(!run.rec)run.apps=run.apps.filter(id=>id!=='kh');render();$('rec').focus({preventScroll:true})}});
  document.addEventListener('click',e=>{
    const button=e.target.closest('[data-action]');if(!button)return;
    const {action,value}=button.dataset;
    switch(action){
      case 'person':run.person=Number(value);redrawChoice(action,value);break;
      case 'next':if(run.page>=1&&run.page<=4)run.choices[run.page-1]=pick;if(run.page===6&&!run.apps.length)enter(9);
        else if(run.page===7&&!results(run).rows.some(row=>row.wait))enter(9);
        else enter(run.page+1);
        break;
      case 'option':pick=Number(value);redrawChoice(action,value);break;
      case 'app':run.apps=run.apps.includes(value)?run.apps.filter(v=>v!==value):[...run.apps,value];redrawChoice(action,value);break;
      case 'late':run.lateId=value;enter(10);break;
      case 'register':run.registered=value==='none'?null:value;enter(11);break;
      case 'replay':replay(null);break;
      case 'edit':replay(Number(value));break;
      case 'replace':change(Number(value));break;
      case 'restart':run=fresh();enter(0);break;
      case 'sources':sourcePanel();break;
      case 'journal':journal();break;
      case 'close':drawer.close();break;
      case 'guide':openGuide();break;
      case 'closeguide':guide.close();break;
      case 'expand':expanded=!expanded;renderMap();break;
    }
  });
  guide.addEventListener('close',()=>{if(location.hash)history.replaceState(null,'',location.href.split('#')[0])});
  window.addEventListener('hashchange',route);render();route();
})();
