// 國外出差申請內容頁（HTR）
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],params=new URLSearchParams(location.search),mode=$('#mode');
const PEOPLE={T037:{name:'陳庭瑋 (T037)',unit:'總經理室／後勤支援部／人事總務課'},T021:{name:'王曉明 (T021)',unit:'代標代購事業本部／客服部'},T038:{name:'林家筠 (T038)',unit:'總經理室／後勤支援部／人事總務課'}};
const ME='陳庭瑋 (T037)';
const DOC_NO={view:'CBS-HTR-2026-00012',viewOwn:'CBS-HTR-2026-00012',approve:'CBS-HTR-2026-00008',approveHR:'CBS-HTR-2026-00012',approved:'CBS-HTR-2026-00011',edit:'CBS-HTR-2026-00009',voided:'CBS-HTR-2026-00005'};
// 範例資料：新增為空白；其他情境載入範例；複製（?copy=1）帶入範例但清除單號、日期與簽核資料
const SAMPLE={applicant:'T037',agent:'T021',reason:'拜訪日本合作倉儲，確認 2027 年度跨境集運流程與作業 SLA，並與當地物流業者洽談旺季加開班次。',place:'日本 東京、大阪',start:'2026-12-07',end:'2026-12-11',
 advance:'yes',cur:['新台幣','其他'],curOther:'日幣',amounts:{'新台幣':'5000','其他':'150000'},
 traffic:'company',ticket:['飛機票'],ticketOther:'',trafficNote:'去程 12/07 桃園→成田（上午班機），回程 12/11 關西→桃園；東京往大阪新幹線自行購買。',
 hotel:'company',hotelNote:'東京 12/07～12/09 共 2 晚、大阪 12/09～12/11 共 2 晚，希望靠近車站。',
 itinerary:'12/07 抵達東京，下午拜訪合作倉儲\n12/08 倉儲作業流程盤點與 SLA 會議\n12/09 移動至大阪，拜訪關西物流業者\n12/10 旺季班次洽談\n12/11 返台',remark:''};
const APPROVED_SAMPLE=Object.assign({},SAMPLE,{reason:'參加東京國際電子商務展，蒐集日本跨境電商與物流服務資訊。',place:'日本 東京',start:'2026-10-14',end:'2026-10-18',advance:'no',cur:[],amounts:{},hotelNote:'東京 10/14～10/18 共 4 晚，展館附近。',itinerary:'10/14 抵達東京\n10/15～10/17 參展與廠商拜訪\n10/18 返台'});
const STAGE_DEF=[{lv:'直屬主管',person:'林家筠 (T038)',time:'2026/11/20 14:10',op:'同意出差，請留意預支費用幣別。'},{lv:'財務',person:'財務會計部　羅薇琳 (B207)',time:'2026/11/21 10:05',op:'已確認預支金額。'},{lv:'人事',person:'後勤支援部　朱驥瑋 (B136)',time:'2026/11/21 16:30',op:''},{lv:'總經理',person:'總經理（簽核資格群組成員）',time:'2026/11/23 09:20',op:'同意。'}];
const RETURN_OP='預支費用請改列日幣，並補充住宿需求說明。';
let amounts={};
const isRead=m=>!['new','edit'].includes(m);
const ymdSlash=v=>v?v.replace(/-/g,'/'):'—';
function days(){const s=$('#startDate').value,e=$('#endDate').value;if(!s||!e)return 0;const d=Math.round((new Date(e)-new Date(s))/864e5)+1;return d>0?d:-1}
function stages(){const d=days();return STAGE_DEF.filter(s=>s.lv!=='總經理'||d>=3)}
// 各情境的關卡狀態：approved 已核准、pending 目前待簽核、waiting 待前序關卡完成、returned 已退回（比照簽呈單：後續關卡亦顯示「待簽核」）
function stageStates(m,n){
  if(m==='approved')return Array(n).fill('approved');
  if(m==='approveHR')return['approved','approved','pending','waiting'].slice(0,n);
  if(m==='edit')return['resubmit','waiting','waiting','waiting'].slice(0,n);
  return['approved','pending','waiting','waiting'].slice(0,n);
}
const LABEL={approved:'已核准',pending:'待簽核',waiting:'待簽核',returned:'已退回',voided:'已作廢'};
const CIRCLE='①②③④⑤';
// 簽核路線與關卡、簽核意見彙整：比照簽呈單呈現
function stageHtml(s,i,k){
  const cls=k==='returned'?'returned':k==='approved'?'approved':'pending',stCls=k==='returned'?'rejected-stage':k==='approved'?'approved':'pending';
  const who=k==='approved'||k==='returned'?'簽核者：'+s.person:k==='pending'?'待簽核者：'+s.person:k==='resubmit'?'重新送出後由此關開始簽核':'待前序關卡完成';
  return`<div class="approval-stage ${cls}"><div class="stage-title">${CIRCLE[i]} ${s.lv}</div><span class="stage-status ${stCls}">${LABEL[k]||'待簽核'}</span><div class="stage-person">${who}</div><time>簽核日期：${k==='approved'||k==='returned'?s.time:'—'}</time></div>`;
}
function renderRoute(){
  const m=mode.value,list=stages(),st=stageStates(m,list.length);
  const summary=m==='edit'?`<div class="round-summary"><div class="return-record"><b>第 1 次退回</b><span>時間：${STAGE_DEF[1].time}</span><span>退回者：<b>${STAGE_DEF[1].lv}</b>　${STAGE_DEF[1].person.replace(/^.*　/,'')}</span><span>退回原因：${RETURN_OP}</span></div></div>`:'';
  $('#routeBody').innerHTML=summary+list.map((s,i)=>stageHtml(s,i,st[i])).join('');
  $('#routeBody').style.setProperty('--route-cols',list.length);
  $('#routePanel .round-badge').textContent=m==='edit'?'目前送審輪次：2':'目前送審輪次：1';
  // 簽核意見彙整：列出已簽核的關卡；未填意見顯示「無簽核意見」
  const done=list.map((s,i)=>({s,k:st[i]})).filter(x=>x.k==='approved'||x.k==='returned');
  $('#opinionList').innerHTML=done.length?done.map(x=>{const op=x.k==='returned'?RETURN_OP:x.s.op;return`<article><div><b>${x.s.lv}</b><span>${x.s.person.replace(/^.*　/,'')}</span><span class="stage-status ${x.k==='returned'?'rejected-stage':'approved'}">${LABEL[x.k]}</span></div><p class="${x.k==='returned'?'rejected-opinion':op?'':'muted-opinion'}">${op||'無簽核意見'}</p></article>`}).join(''):'<p class="opinion-empty">目前尚無簽核意見。</p>';
  const hist=[['2026/11/20 09:00','送出簽核',$('#applicant').selectedOptions[0].textContent]].concat(list.map((s,i)=>st[i]==='approved'?[s.time,`核准（${s.lv}）`,s.person.replace(/^.*　/,'')]:null).filter(Boolean));
  if(m==='edit')hist.push([STAGE_DEF[0].time,`核准（${STAGE_DEF[0].lv}）`,STAGE_DEF[0].person],[STAGE_DEF[1].time,`退回（${STAGE_DEF[1].lv}）`,STAGE_DEF[1].person.replace(/^.*　/,'')+'：'+RETURN_OP]);
  $('#historyBody').innerHTML=hist.map(h=>`<div class="history-row"><time>${h[0]}</time><div><strong>${h[1]}</strong>　${h[2]}</div></div>`).join('');
}
function syncDays(){
  const d=days(),h=$('#daysHint');
  h.classList.toggle('gm',d>=3);h.classList.toggle('error',d<0);
  h.innerHTML=d<0?'結束日不可早於開始日':d?`共 <b>${d}</b> 日（${d>=3?'<strong>三日（含）以上需總經理核准</strong>':'二日（含）以內由主管核准'}）`:'共 — 日（三日（含）以上需總經理核准）';
  renderRoute();
}
function syncAdvance(){
  const ro=isRead(mode.value),yes=$('input[name=advance][value=yes]').checked;
  $$('#currencyChoices input').forEach(x=>x.disabled=ro||!yes);
  if(!yes)$$('input[name=cur]').forEach(x=>x.checked=false);
  const otherOn=$('#curOtherChk').checked;$('#curOther').hidden=!otherOn;if(!otherOn)$('#curOther').value='';
  $('#currencyChoices').classList.toggle('off',!yes);
  const cur=$$('input[name=cur]:checked').map(x=>x.value);
  $('#advanceAmounts').innerHTML=cur.map(c=>{const name=c==='其他'?($('#curOther').value.trim()||'其他幣別'):c;return`<label class="amount-item"><span>${name}</span><input class="control money" type="text" inputmode="numeric" data-cur="${c}" value="${amounts[c]?Number(amounts[c]).toLocaleString('en-US'):''}" placeholder="金額"${ro?' disabled':''}><em>元</em></label>`}).join('');
  $('#advanceAmounts').hidden=!cur.length;
  $('#advanceLabel').classList.toggle('req',yes);
  $('#advanceHelp').hidden=ro||!!cur.length;$('#advanceHelp').textContent=yes?'請勾選幣別，並依幣別填寫預支金額（必填）。':'選擇「需要預支費用」並勾選幣別後，依幣別填寫預支金額（必填）。';
  $('#advanceRow').hidden=ro&&!yes;
}
function syncTraffic(){
  const ro=isRead(mode.value),on=$('input[name=traffic][value=company]').checked;
  $$('#ticketChoices input').forEach(x=>x.disabled=ro||!on);if(!on)$$('input[name=ticket]').forEach(x=>x.checked=false);
  const o=$('#ticketOtherChk').checked;$('#ticketOther').hidden=!o;if(!o)$('#ticketOther').value='';
  $('#ticketChoices').classList.toggle('off',!on);
}
function setForm(d){
  $('#applicant').value=d.applicant||'T037';$('#agent').value=d.agent||'';
  $('#reason').value=d.reason||'';$('#place').value=d.place||'';$('#startDate').value=d.start||'';$('#endDate').value=d.end||'';
  $$('input[name=advance]').forEach(x=>x.checked=x.value===d.advance);
  $$('input[name=cur]').forEach(x=>x.checked=(d.cur||[]).includes(x.value));$('#curOther').value=d.curOther||'';amounts=Object.assign({},d.amounts||{});
  $$('input[name=traffic]').forEach(x=>x.checked=x.value===d.traffic);
  $$('input[name=ticket]').forEach(x=>x.checked=(d.ticket||[]).includes(x.value));$('#ticketOther').value=d.ticketOther||'';
  $('#trafficNote').value=d.trafficNote||'';$$('input[name=hotel]').forEach(x=>x.checked=x.value===d.hotel);$('#hotelNote').value=d.hotelNote||'';
  $('#itinerary').value=d.itinerary||'';$('#remark').value=d.remark||'';
  syncPeople();
}
function syncPeople(){
  $('#applicantUnit').textContent=(PEOPLE[$('#applicant').value]||{}).unit||'未設定所屬部門';
  $('#agentUnit').textContent=(PEOPLE[$('#agent').value]||{}).unit||'—';
}
function docNo(){return params.get('no')||DOC_NO[mode.value]||DOC_NO.view}
function applyMode(){
  const m=mode.value,read=isRead(m),copy=!!params.get('copy');
  const box={new:'newActions',edit:'editActions',approve:'approveActions',approveHR:'approveActions'}[m]||'viewActions';
  $$('#newActions,#editActions,#approveActions,#viewActions').forEach(x=>x.hidden=x.id!==box);
  $('#currentBtn').hidden=m!=='approveHR';
  $('#toExpense').hidden=m!=='approved';$('#toExpense').href='../travel-expenses/detail.html?mode=new&htr='+encodeURIComponent(docNo());
  $('#routePanel').hidden=m==='new';$('#returnAlert').hidden=m!=='edit';
  $('#opinionSummary').hidden=!read;$('.detail-grid').classList.toggle('no-side',!read);
  document.body.classList.toggle('readonly',read);
  $('#pageTitle').textContent=m==='new'?'新增國外出差申請（尚未產生單號）':`${m==='approve'||m==='approveHR'?'簽核':m==='edit'?'編輯':'查看'}國外出差申請（${docNo()}）`;
  $('#applyDate').textContent=m==='new'?'申請日期：送出簽核後由系統回寫':m==='approved'?'申請日期：2026/09/25':'申請日期：2026/11/20';
  setForm(m==='new'&&!copy?{}:m==='approved'?APPROVED_SAMPLE:SAMPLE);
  if(m==='approve'){$('#applicant').value='T021';$('#agent').value='T038';syncPeople()}
  $$('input,select,textarea').forEach(el=>{if(el===mode||el.closest('#decisionModal,.cv-modal'))return;el.disabled=read});
  syncDays();syncAdvance();syncTraffic();renderRoute();
}
mode.value=params.get('mode')||'new';if(!mode.value)mode.value='new';
mode.onchange=()=>{history.replaceState(null,'',`?mode=${mode.value}`);params.delete('copy');params.delete('no');applyMode()};
$('#applicant').onchange=syncPeople;$('#agent').onchange=syncPeople;
['#startDate','#endDate'].forEach(s=>$(s).addEventListener('change',syncDays));
$$('input[name=advance]').forEach(x=>x.onchange=syncAdvance);$('#currencyChoices').addEventListener('change',syncAdvance);$('#curOther').addEventListener('input',()=>{$$('#advanceAmounts .amount-item span')[$$('input[name=cur]:checked').map(x=>x.value).indexOf('其他')].textContent=$('#curOther').value.trim()||'其他幣別'});
$('#advanceAmounts').addEventListener('input',e=>{const el=e.target;if(!el.dataset.cur)return;const raw=el.value.replace(/[^\d]/g,'');amounts[el.dataset.cur]=raw;el.value=raw?Number(raw).toLocaleString('en-US'):''});
$$('input[name=traffic]').forEach(x=>x.onchange=syncTraffic);$('#ticketChoices').addEventListener('change',syncTraffic);
$('#routeToggle').onclick=()=>{const closed=$('#routeBody').classList.toggle('route-collapsed');$('#routeToggle').textContent=closed?'查看':'收合'};
$('#historyLink').onclick=()=>$('#historyModal').hidden=false;$$('[data-close-history]').forEach(x=>x.onclick=()=>$('#historyModal').hidden=true);
// 簽核視窗：核准（意見選填）、退回重新簽核、退回僅本關重審（人事關才有）
const DECISION={approve:['核准並批示','可填寫簽核意見（選填），留空可直接核准','確認核准'],reject:['退回（重新簽核）','請輸入退回原因（必填）；申請人修改後重新送出，將從第一關重新簽核','確認退回'],current:['退回補正（僅本關重審）','請輸入退回原因（必填）；申請人修改後重新送出，直接回到人事關重審','確認退回']};
function openDecision(type){const d=DECISION[type];$('#decisionTitle').textContent=d[0];$('#decisionOpinion').placeholder=d[1];$('#decisionConfirm').textContent=d[2];$('#decisionOpinion').value='';$('#decisionModal').dataset.type=type;$('#decisionModal').hidden=false}
$('#approveBtn').onclick=()=>openDecision('approve');$('#rejectBtn').onclick=()=>openDecision('reject');$('#currentBtn').onclick=()=>openDecision('current');$$('[data-close-modal]').forEach(x=>x.onclick=()=>$('#decisionModal').hidden=true);
$('#decisionConfirm').onclick=()=>{const t=$('#decisionModal').dataset.type;if(t!=='approve'&&!$('#decisionOpinion').value.trim()){alert('請輸入退回原因');return}
 const last=stages().length-1,curIdx=mode.value==='approveHR'?2:1;
 alert(t==='approve'?(curIdx===last?'本關已核准，國外出差申請已核准，系統將通知申請人、人事與財務。':'本關已核准，已通知下一關簽核者。'):t==='current'?'已退回（僅本關重審）：申請人修改後重新送出，將直接回到人事關。':'已退回申請：申請人修改後重新送出，將從第一關重新簽核。');$('#decisionModal').hidden=true};
// 送出簽核檢核
function validate(){
  if(!$('#agent').value)return'請選擇代理人。';
  if($('#agent').value===$('#applicant').value)return'代理人不可為申請人本人，請重新選擇。';
  if(!$('#reason').value.trim())return'請填寫出差事由。';
  if(!$('#place').value.trim())return'請填寫出差地點。';
  if(!$('#startDate').value)return'請選擇預計開始日。';
  if(!$('#endDate').value)return'請選擇預計結束日。';
  if(days()<0)return'預計結束日不可早於預計開始日。';
  const adv=$('input[name=advance]:checked');if(!adv)return'請選擇是否需要預支費用。';
  if(adv.value==='yes'){const cur=$$('input[name=cur]:checked').map(x=>x.value);if(!cur.length)return'需要預支費用時，請至少勾選一種幣別。';if(cur.includes('其他')&&!$('#curOther').value.trim())return'請輸入其他幣別名稱。';for(const c of cur)if(!(Number(amounts[c])>0))return`請填寫「${c==='其他'?$('#curOther').value.trim():c}」的預支金額。`}
  const tr=$('input[name=traffic]:checked');if(!tr)return'請選擇交通需求。';
  if(tr.value==='company'){const t=$$('input[name=ticket]:checked').map(x=>x.value);if(!t.length)return'公司協助訂票時，請至少勾選一種票券。';if(t.includes('其他')&&!$('#ticketOther').value.trim())return'請輸入其他票券種類。'}
  if(!$('input[name=hotel]:checked'))return'請選擇住宿需求。';
  return'';
}
function submit(){const err=validate();if(err){alert(err);return}
  const lead=Math.round((new Date($('#startDate').value)-new Date(new Date().toDateString()))/864e5);
  if(lead<14&&!confirm(`出差開始日距今僅 ${Math.max(lead,0)} 天，國外出差請於二周前提出。確認要送出簽核？`))return;
  $('#pageTitle').textContent='國外出差申請（CBS-HTR-2026-00013）';$('#applyDate').textContent='申請日期：'+new Date().toLocaleDateString('zh-TW',{year:'numeric',month:'2-digit',day:'2-digit'});
  alert(`已送出簽核（出差共 ${days()} 日${days()>=3?'，需總經理核准':''}），系統已回寫申請日期與申請單號。`)}
['#submitBtn','#submitBtn2'].forEach(s=>$(s).onclick=submit);['#saveDraft','#saveDraft2'].forEach(s=>$(s).onclick=()=>alert('已儲存草稿。'));
// 列印版：依目前畫面資料產生
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dash=v=>String(v||'').trim()||'—',br=v=>esc(dash(v)).replace(/\n/g,'<br>');
function advanceText(){const a=$('input[name=advance]:checked');if(!a)return'—';if(a.value==='no')return'不需要預支費用';return'需要預支費用：'+($$('input[name=cur]:checked').map(x=>{const n=x.value==='其他'?($('#curOther').value||'其他'):x.value;return n+' '+(amounts[x.value]?Number(amounts[x.value]).toLocaleString('en-US'):'—')+' 元'}).join('；')||'—')}
function trafficText(){const a=$('input[name=traffic]:checked');if(!a)return'—';if(a.value==='self')return'自行安排';return'公司協助訂票：'+($$('input[name=ticket]:checked').map(x=>x.value==='其他'?'其他：'+($('#ticketOther').value||'—'):x.value).join('、')||'—')}
function buildPrint(){
  const m=mode.value,mm=$('#pageTitle').textContent.match(/（(CBS-[^）]+)）/);
  $('#pCompany').textContent=$('#company').value;$('#pDocNo').textContent=mm?mm[1]:'—';
  $('#pApplicant').textContent=$('#applicant').selectedOptions[0].textContent;$('#pUnit').textContent=dash($('#applicantUnit').textContent);
  $('#pAgent').textContent=$('#agent').value?$('#agent').selectedOptions[0].textContent:'—';
  $('#pDate').textContent=/回寫/.test($('#applyDate').textContent)?'—':$('#applyDate').textContent.replace('申請日期：','');
  $('#pReason').innerHTML=br($('#reason').value);$('#pPlace').textContent=dash($('#place').value);
  const d=days();$('#pPeriod').textContent=$('#startDate').value&&$('#endDate').value?`${ymdSlash($('#startDate').value)} ～ ${ymdSlash($('#endDate').value)}（共 ${d} 日）`:'—';
  $('#pAdvance').textContent=advanceText();$('#pTraffic').textContent=trafficText();$('#pTrafficNote').innerHTML=br($('#trafficNote').value);
  const h=$('input[name=hotel]:checked');$('#pHotel').textContent=h?(h.value==='self'?'自行安排':'公司協助安排住宿'):'—';$('#pHotelNote').innerHTML=br($('#hotelNote').value);
  $('#pItinerary').innerHTML=br($('#itinerary').value);$('#pRemark').innerHTML=br($('#remark').value);
  const list=stages(),st=stageStates(m,list.length);
  $('#pApproval').innerHTML=m==='new'?'<tr><td colspan="5">尚未送出簽核</td></tr>':list.map((s,i)=>{const k=st[i],done=k==='approved'||k==='returned';return`<tr><td>${esc(s.lv)}</td><td>${esc(s.person)}</td><td>${LABEL[k]||'待簽核'}</td><td>${done?s.time.slice(0,10):'—'}</td><td>${esc(done&&s.op?s.op:'—')}</td></tr>`}).join('');
  const items=[];const a=$('input[name=advance]:checked');if(a&&a.value==='yes')items.push('預支費用（'+advanceText().replace('需要預支費用：','')+'）');const t=$('input[name=traffic]:checked');if(t&&t.value==='company')items.push('代訂票券（'+trafficText().replace('公司協助訂票：','')+'）');const ht=$('input[name=hotel]:checked');if(ht&&ht.value==='company')items.push('代訂住宿');
  $('#pSignItems').textContent=items.join('；')||'無（不需預支費用、未請公司代訂）';
}
window.addEventListener('beforeprint',buildPrint);
applyMode();
// 作廢（比照其他行政表單）：申請人可在申請中、簽核中、已退回、已核准作廢；已被國外出差請款單引用者不可作廢（doc-refs.js）。
(function(){
  if(!window.ClaimVoid)return;
  const viewBox=$('#viewActions'),editBox=$('#editActions'),titleEl=$('#pageTitle'),routeHead=$('#routePanel .round-badge');
  const mk=()=>{const b=document.createElement('button');b.type='button';b.className='btn tool-action void-action';b.hidden=true;b.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>作廢';return b};
  const btn=mk(),btn2=mk();viewBox.appendChild(btn);editBox.appendChild(btn2);
  const copyLink=viewBox.querySelector('a.tool-action:not(#toExpense)');
  let info=null;
  const nowTxt=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return d.getFullYear()+'/'+p(d.getMonth()+1)+'/'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes())};
  function sync(){
    const v=mode.value,voided=v==='voided';
    $('#voidAlert').hidden=!voided;routeHead.textContent=v==='edit'?'目前送審輪次：2':'目前送審輪次：1';
    btn.hidden=!(v==='viewOwn'||v==='approved');btn2.hidden=v!=='edit';
    if(copyLink)copyLink.hidden=voided&&params.get('copy')==='0';
    if(!voided)return;
    const i=info||{reason:params.get('reason')||'合作夥伴改為線上會議，取消出差。',time:params.get('at')||'2026/10/28 15:40',by:ME};
    titleEl.textContent='查看國外出差申請（'+docNo()+'）';titleEl.insertAdjacentHTML('beforeend','<span class="void-badge">已作廢</span>');
    $('#voidReasonText').textContent=i.reason;$('#voidWhoText').textContent=i.by+'　'+i.time;routeHead.textContent='狀態：已作廢';
    $$('#routeBody .approval-stage').forEach(el=>{if(!el.classList.contains('pending'))return;el.className='approval-stage voided';const s=el.querySelector('.stage-status');s.className='stage-status voided';s.textContent='已作廢';el.querySelector('.stage-person').textContent='申請人已作廢，流程終止';el.querySelector('time').textContent=i.time});
  }
  function openVoid(){
    const s=mode.value==='edit'?'已退回':mode.value==='approved'?'已核准':'簽核中',no=docNo();
    ClaimVoid.open({no,status:s,label:'國外出差申請',blockers:ClaimVoid.blockersOf(no),
      warn:'此單已核准，作廢前請先確認已繳回預支費用，並取消公司代訂的票券與住宿。',
      onConfirm(reason){info={reason,time:nowTxt(),by:ME};params.set('no',no);mode.value='voided';history.replaceState(null,'','?mode=voided&no='+encodeURIComponent(no));applyMode();sync();ClaimVoid.toast('國外出差申請已作廢。')}});
  }
  btn.addEventListener('click',openVoid);btn2.addEventListener('click',openVoid);
  mode.addEventListener('change',()=>{info=null;sync()});
  sync();
})();
