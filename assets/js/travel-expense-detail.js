// 國外出差請款單內容頁（HTE）
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],params=new URLSearchParams(location.search),mode=$('#mode');
const PEOPLE={T037:{name:'陳庭瑋 (T037)',unit:'總經理室／後勤支援部／人事總務課'},T021:{name:'王曉明 (T021)',unit:'代標代購事業本部／客服部'}};
const ME='陳庭瑋 (T037)';
const DOC_NO={view:'CBS-HTE-2026-00006',viewOwn:'CBS-HTE-2026-00006',approveHR:'CBS-HTE-2026-00006',approve:'CBS-HTE-2026-00004',approved:'CBS-HTE-2026-00003',edit:'CBS-HTE-2026-00005',voided:'CBS-HTE-2026-00001'};
const TYPES=['住宿費','膳雜費','交通費','機票費用','其他費用'],DAY_TYPES=['住宿費','膳雜費','交通費'];
// Demo 示意匯率（正式版依出差日前一日臺灣銀行即期賣出匯率，可修改）
const RATES={'新台幣':1,'日幣':0.2085,'美金':32.45,'人民幣':4.52,'韓元':0.0235,'港幣':4.16,'歐元':35.1,'泰銖':0.95};
const TOKYO={htr:'CBS-HTR-2026-00002',applicant:'T037',reason:'拜訪日本合作倉儲，盤點跨境集運作業流程。',place:'日本 東京',start:'2026-08-17',end:'2026-08-21',voucher:'9',remark:'',
 rows:[['住宿費','東京','日幣',4,18000],['膳雜費','東京','日幣',5,6000],['交通費','東京','日幣',5,1500],['機票費用','台北－東京（來回）','新台幣','',18600],['其他費用','eSIM 漫遊','新台幣','',450],['其他費用','伴手禮（合作倉儲）','日幣','',3240]],
 summary:'1. 盤點合作倉儲入庫、檢貨、包裝與出庫流程，確認每日處理量與尖峰時段。\n2. 與倉儲主管討論 2027 年度 SLA：出庫時效 24 小時內、異常件回報 4 小時內。\n3. 實地查看退貨處理區，確認退貨件的拍照與標記流程。',
 advice:'建議 Q1 導入出庫異常即時通報機制，並與客服部共用異常件清單，縮短客訴回覆時間。',attach:true};
const SEOUL={htr:'CBS-HTR-2026-00010',applicant:'T037',reason:'與韓國合作夥伴洽談代購服務合作方案。',place:'韓國 首爾',start:'2026-11-03',end:'2026-11-04',voucher:'5',remark:'',
 rows:[['住宿費','首爾','韓元',1,150000],['膳雜費','首爾','韓元',2,60000],['交通費','首爾','韓元',2,20000],['機票費用','台北－首爾（來回）','新台幣','',12800],['其他費用','eSIM 漫遊','新台幣','',300]],
 summary:'與韓國合作夥伴確認代購服務合作範圍、報價方式與上線時程。',advice:'建議先以美妝類商品試行 3 個月，再評估擴大品類。',attach:false};
const STAGE_DEF=[{lv:'直屬主管',person:'林家筠 (T038)',time:'2026/08/25 10:20',op:''},{lv:'人事',person:'後勤支援部　朱驥瑋 (B136)',time:'2026/08/26 14:05',op:'出差報告已確認。'},{lv:'財務',person:'財務會計部　羅薇琳 (B207)',time:'2026/08/27 11:30',op:'憑證已核對，依最近付款日匯款。'}];
const RETURN_OP='住宿費天數與實際出差天數不符，請修正並補附住宿收據。';
const LABEL={approved:'已核准',pending:'待簽核',waiting:'待簽核',returned:'已退回',voided:'已作廢'};
const isRead=m=>!['new','edit'].includes(m);
const fmt=n=>Number(n||0).toLocaleString('en-US',{maximumFractionDigits:2});
const ymdSlash=v=>v?v.replace(/-/g,'/'):'—';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function days(){const s=$('#startDate').value,e=$('#endDate').value;if(!s||!e)return 0;const d=Math.round((new Date(e)-new Date(s))/864e5)+1;return d>0?d:-1}
function stageStates(m){return m==='approved'?['approved','approved','approved']:m==='approveHR'||m==='view'||m==='viewOwn'||m==='voided'?['approved','pending','waiting']:m==='edit'?['resubmit','waiting','waiting']:['pending','waiting','waiting']}
// ===== 出差申請單號：輸入或選擇後帶入原申請內容（可修改） =====
const claimed=no=>Object.entries(window.DOC_REFS||{}).some(([k,v])=>k===no&&v.some(x=>x.type==='國外出差請款單'&&x.status!=='已作廢'&&x.status!=='已刪除'));
const appOf=no=>(window.TRAVEL_APPS||[]).find(a=>a.no===no);
function htrOptions(){
  const who=(PEOPLE[$('#applicant').value]||{}).name;
  $('#htrOptions').innerHTML=(window.TRAVEL_APPS||[]).filter(a=>a.status==='已核准'&&a.applicant===who&&!claimed(a.no)).map(a=>`<option value="${a.no}">${a.place}　${a.start}～${a.end}</option>`).join('');
}
function renderHtrSummary(){
  const a=appOf($('#htrNo').value.trim());
  $('#htrLink').hidden=!a;if(a)$('#htrLink').href='../travels/detail.html?mode='+(a.applicant===ME?'approved':'view')+'&no='+encodeURIComponent(a.no);
  $('#htrSummaryBody').innerHTML=a?`<dl class="htr-dl"><dt>出差申請單號</dt><dd>${a.no}</dd><dt>預計出差期間</dt><dd>${a.start} ～ ${a.end}</dd><dt>出差地點</dt><dd>${esc(a.place)}</dd><dt>預支費用</dt><dd>${esc(a.advance)}</dd><dt>代理人</dt><dd>${a.agent}</dd></dl>`:'<p class="help">輸入出差申請單號後，這裡會顯示原申請的出差期間與預支費用，方便核對。</p>';
}
function pickHtr(fill){
  const no=$('#htrNo').value.trim();if(!no){renderHtrSummary();return}
  const a=appOf(no),d=(window.TRAVEL_APP_DETAIL||{})[no],who=(PEOPLE[$('#applicant').value]||{}).name;
  if(fill){
    if(!a||a.status!=='已核准'){alert('查無此單號的已核准國外出差申請，請重新輸入。');$('#htrNo').value='';renderHtrSummary();return}
    if(a.applicant!==who){alert('只能選擇申請人本人已核准的國外出差申請。');$('#htrNo').value='';renderHtrSummary();return}
    if(claimed(no)){alert(`出差申請 ${no} 已建立國外出差請款單，不可重複請款。`);$('#htrNo').value='';renderHtrSummary();return}
    if(d){$('#reason').value=d.reason;$('#place').value=d.place;$('#startDate').value=d.start;$('#endDate').value=d.end;syncDays();}
  }
  renderHtrSummary();
}
// ===== 出差旅費明細 =====
function rowHtml(r){
  const [type,desc,cur,dd,unit]=r||['','','新台幣','',''];
  return `<tr><td><select class="control f-type"><option value="">請選擇</option>${TYPES.map(t=>`<option${t===type?' selected':''}>${t}</option>`).join('')}</select></td><td><input class="control f-desc" value="${esc(desc)}" placeholder="停留地點／起訖地點／支出項目"></td><td><select class="control f-cur">${Object.keys(RATES).map(c=>`<option${c===cur?' selected':''}>${c}</option>`).join('')}</select></td><td><input class="control f-days num" type="number" min="1" value="${dd}"></td><td><input class="control f-unit num" inputmode="decimal" value="${unit?fmt(unit):''}" placeholder="金額"></td><td class="f-fx"></td><td><input class="control f-rate num" inputmode="decimal" value=""></td><td><input class="control f-twd num" inputmode="numeric" placeholder="台幣金額"></td><td><span class="row-act"><button type="button" class="copy">複製</button>|<button type="button" class="del">刪除</button></span></td></tr>`;
}
const num=v=>Number(String(v||'').replace(/,/g,''))||0;
function calcRow(tr,resetRate){
  const ro=isRead(mode.value),type=tr.querySelector('.f-type').value,cur=tr.querySelector('.f-cur').value,dEl=tr.querySelector('.f-days'),rEl=tr.querySelector('.f-rate'),tEl=tr.querySelector('.f-twd');
  const needDays=DAY_TYPES.includes(type);dEl.disabled=ro||!needDays;if(!needDays)dEl.value='';dEl.placeholder=needDays?'天數':'—';
  const twd=cur==='新台幣';if(resetRate||!rEl.value)rEl.value=twd?'':String(RATES[cur]||'');rEl.disabled=ro||twd;rEl.placeholder=twd?'—':'匯率';
  const unit=num(tr.querySelector('.f-unit').value),fx=(needDays?num(dEl.value):1)*unit;
  tr.querySelector('.f-fx').innerHTML=twd?'<span class="na">—</span>':`<span class="calc">${unit?fmt(fx):'—'}</span>`;
  if(!tEl.dataset.manual)tEl.value=unit?fmt(Math.round(twd?fx:fx*num(rEl.value))):'';
}
function calcTotal(){let t=0;$$('#expenseRows tr').forEach(tr=>t+=num(tr.querySelector('.f-twd').value));$('#expenseTotal').textContent='NT$ '+fmt(t);return t}
function addRow(r,after){const tb=$('#expenseRows'),tmp=document.createElement('tbody');tmp.innerHTML=rowHtml(r);const tr=tmp.firstElementChild;after?after.after(tr):tb.appendChild(tr);calcRow(tr,true);return tr}
$('#expenseRows').addEventListener('input',e=>{const tr=e.target.closest('tr');if(!tr)return;if(e.target.matches('.f-twd'))e.target.dataset.manual='1';if(e.target.matches('.f-unit,.f-twd')){const raw=e.target.value.replace(/[^\d.]/g,'');e.target.value=raw?fmt(raw):''}calcRow(tr,false);calcTotal()});
$('#expenseRows').addEventListener('change',e=>{const tr=e.target.closest('tr');if(!tr)return;if(e.target.matches('.f-cur')){delete tr.querySelector('.f-twd').dataset.manual;calcRow(tr,true)}else calcRow(tr,false);calcTotal()});
$('#expenseRows').addEventListener('click',e=>{const tr=e.target.closest('tr');if(!tr)return;
  if(e.target.matches('.copy')){const v=[tr.querySelector('.f-type').value,tr.querySelector('.f-desc').value,tr.querySelector('.f-cur').value,tr.querySelector('.f-days').value,num(tr.querySelector('.f-unit').value)];addRow(v,tr);calcTotal()}
  if(e.target.matches('.del')){if($$('#expenseRows tr').length<=1){tr.querySelectorAll('input').forEach(i=>{i.value='';delete i.dataset.manual});tr.querySelector('.f-type').value='';tr.querySelector('.f-cur').value='新台幣';calcRow(tr,true)}else tr.remove();calcTotal()}});
$('#addRow').onclick=()=>{addRow();calcTotal()};
// ===== 表單資料 =====
function setForm(d){
  $('#applicant').value=d.applicant||'T037';syncPeople();
  $('#htrNo').value=d.htr||'';$('#reason').value=d.reason||'';$('#place').value=d.place||'';$('#startDate').value=d.start||'';$('#endDate').value=d.end||'';
  $('#voucher').value=d.voucher||'';$('#remark').value=d.remark||'';$('#summary').value=d.summary||'';$('#advice').value=d.advice||'';
  $('#expenseRows').innerHTML='';(d.rows&&d.rows.length?d.rows:[null]).forEach(r=>addRow(r));
  $('#sampleFile').hidden=!d.attach;
  renderHtrSummary();
}
function syncPeople(){$('#applicantUnit').textContent=(PEOPLE[$('#applicant').value]||{}).unit||'未設定所屬部門';htrOptions()}
function syncDays(){const d=days(),h=$('#daysHint');h.classList.toggle('error',d<0);h.innerHTML=d<0?'結束日不可早於開始日':d?`共 <b>${d}</b> 天`:'共 — 天'}
// 簽核路線與關卡、簽核意見彙整：比照簽呈單呈現
function renderRoute(){
  const m=mode.value,st=stageStates(m);
  const stage=(s,i,k)=>{const cls=k==='returned'?'returned':k==='approved'?'approved':'pending',stCls=k==='returned'?'rejected-stage':k==='approved'?'approved':'pending';
    const who=k==='approved'||k==='returned'?'簽核者：'+s.person:k==='pending'?'待簽核者：'+s.person:k==='resubmit'?'重新送出後由此關開始簽核':'待前序關卡完成';
    return`<div class="approval-stage ${cls}"><div class="stage-title">${'①②③'[i]} ${s.lv}</div><span class="stage-status ${stCls}">${LABEL[k]||'待簽核'}</span><div class="stage-person">${who}</div><time>簽核日期：${k==='approved'||k==='returned'?s.time:'—'}</time></div>`};
  const summary=m==='edit'?`<div class="round-summary"><div class="return-record"><b>第 1 次退回</b><span>時間：${STAGE_DEF[1].time}</span><span>退回者：<b>${STAGE_DEF[1].lv}</b>　${STAGE_DEF[1].person.replace(/^.*　/,'')}</span><span>退回原因：${RETURN_OP}</span></div></div>`:'';
  $('#routeBody').style.setProperty('--route-cols',3);
  $('#routeBody').innerHTML=summary+STAGE_DEF.map((s,i)=>stage(s,i,st[i])).join('');
  $('#routePanel .round-badge').textContent=m==='edit'?'目前送審輪次：2':'目前送審輪次：1';
  const done=STAGE_DEF.map((s,i)=>({s,k:st[i]})).filter(x=>x.k==='approved'||x.k==='returned');
  $('#opinionList').innerHTML=done.length?done.map(x=>{const op=x.k==='returned'?RETURN_OP:x.s.op;return`<article><div><b>${x.s.lv}</b><span>${x.s.person.replace(/^.*　/,'')}</span><span class="stage-status ${x.k==='returned'?'rejected-stage':'approved'}">${LABEL[x.k]}</span></div><p class="${x.k==='returned'?'rejected-opinion':op?'':'muted-opinion'}">${op||'無簽核意見'}</p></article>`}).join(''):'<p class="opinion-empty">目前尚無簽核意見。</p>';
  const hist=[['2026/08/24 17:40','送出簽核',$('#applicant').selectedOptions[0].textContent]].concat(STAGE_DEF.map((s,i)=>st[i]==='approved'?[s.time,`核准（${s.lv}）`,s.person.replace(/^.*　/,'')]:null).filter(Boolean));
  if(m==='edit')hist.push([STAGE_DEF[0].time,`核准（${STAGE_DEF[0].lv}）`,STAGE_DEF[0].person],[STAGE_DEF[1].time,`退回（${STAGE_DEF[1].lv}）`,STAGE_DEF[1].person.replace(/^.*　/,'')+'：'+RETURN_OP]);
  $('#historyBody').innerHTML=hist.map(h=>`<div class="history-row"><time>${h[0]}</time><div><strong>${h[1]}</strong>　${h[2]}</div></div>`).join('');
}
function docNo(){return params.get('no')||DOC_NO[mode.value]||DOC_NO.view}
function applyMode(){
  const m=mode.value,read=isRead(m),copy=!!params.get('copy');
  const box={new:'newActions',edit:'editActions',approve:'approveActions',approveHR:'approveActions'}[m]||'viewActions';
  $$('#newActions,#editActions,#approveActions,#viewActions').forEach(x=>x.hidden=x.id!==box);
  $('#currentBtn').hidden=m!=='approveHR';
  $('#routePanel').hidden=m==='new';$('#returnAlert').hidden=m!=='edit';
  $('#opinionSummary').hidden=!read;
  document.body.classList.toggle('readonly',read);
  $('#pageTitle').textContent=m==='new'?'新增國外出差請款單（尚未產生單號）':`${m==='approve'||m==='approveHR'?'簽核':m==='edit'?'編輯':'查看'}國外出差請款單（${docNo()}）`;
  $('#applyDate').textContent=m==='new'?'申請日期：送出簽核後由系統回寫':m==='approved'?'申請日期：2026/11/10':'申請日期：2026/08/24';
  const sample=m==='approved'?SEOUL:Object.assign({},TOKYO,m==='approve'?{applicant:'T021',htr:'CBS-HTR-2026-00004',reason:'日本客服外包廠商季度檢討與流程稽核。',start:'2026-09-08',end:'2026-09-12'}:{});
  // 新增：空白；從出差申請「建立請款單」進入（?htr=）時直接帶入該出差申請；複製：帶入範例但出差申請單號需重新選擇
  setForm(m==='new'?(copy?Object.assign({},TOKYO,{htr:''}):{}):sample);
  $$('input,select,textarea').forEach(el=>{if(el===mode||el.closest('#decisionModal,.cv-modal'))return;el.disabled=read});
  $$('#expenseRows tr').forEach(tr=>calcRow(tr,false));calcTotal();
  $('#htrNote').hidden=read;
  syncDays();renderRoute();
  if(m==='new'&&params.get('htr')){$('#htrNo').value=params.get('htr');pickHtr(true)}
}
mode.value=params.get('mode')||'new';if(!mode.value)mode.value='new';
mode.onchange=()=>{history.replaceState(null,'',`?mode=${mode.value}`);params.delete('copy');params.delete('no');params.delete('htr');applyMode()};
$('#applicant').onchange=()=>{syncPeople();if($('#htrNo').value){$('#htrNo').value='';renderHtrSummary()}};
$('#htrNo').addEventListener('change',()=>pickHtr(true));
['#startDate','#endDate'].forEach(s=>$(s).addEventListener('change',syncDays));
$('#uploadBtn').onclick=()=>{$('#sampleFile').hidden=false};
$$('.file-remove').forEach(b=>b.onclick=()=>{$('#sampleFile').hidden=true});
$('#routeToggle').onclick=()=>{const closed=$('#routeBody').classList.toggle('route-collapsed');$('#routeToggle').textContent=closed?'查看':'收合'};
$('#historyLink').onclick=()=>$('#historyModal').hidden=false;$$('[data-close-history]').forEach(x=>x.onclick=()=>$('#historyModal').hidden=true);
const DECISION={approve:['核准並批示','可填寫簽核意見（選填），留空可直接核准','確認核准'],reject:['退回（重新簽核）','請輸入退回原因（必填）；申請人修改後重新送出，將從第一關重新簽核','確認退回'],current:['退回補正（僅本關重審）','請輸入退回原因（必填）；申請人修改後重新送出，直接回到人事關重審','確認退回']};
function openDecision(type){const d=DECISION[type];$('#decisionTitle').textContent=d[0];$('#decisionOpinion').placeholder=d[1];$('#decisionConfirm').textContent=d[2];$('#decisionOpinion').value='';$('#decisionModal').dataset.type=type;$('#decisionModal').hidden=false}
$('#approveBtn').onclick=()=>openDecision('approve');$('#rejectBtn').onclick=()=>openDecision('reject');$('#currentBtn').onclick=()=>openDecision('current');$$('[data-close-modal]').forEach(x=>x.onclick=()=>$('#decisionModal').hidden=true);
$('#decisionConfirm').onclick=()=>{const t=$('#decisionModal').dataset.type;if(t!=='approve'&&!$('#decisionOpinion').value.trim()){alert('請輸入退回原因');return}
 alert(t==='approve'?'本關已核准，已通知下一關簽核者。（財務核准後通知申請人，並依最近付款日匯款至員工帳戶）':t==='current'?'已退回（僅本關重審）：申請人修改後重新送出，將直接回到人事關。':'已退回申請：申請人修改後重新送出，將從第一關重新簽核。');$('#decisionModal').hidden=true};
// ===== 送出簽核檢核 =====
function validate(){
  const no=$('#htrNo').value.trim();if(!no)return'請輸入出差申請單號。';
  const a=appOf(no);if(!a||a.status!=='已核准')return'出差申請單號必須是申請人本人已核准的國外出差申請。';
  if(!$('#reason').value.trim())return'請填寫出差事由。';
  if(!$('#place').value.trim())return'請填寫出差地點。';
  if(!$('#startDate').value||!$('#endDate').value)return'請選擇實際開始日與實際結束日。';
  const d=days();if(d<0)return'實際結束日不可早於實際開始日。';
  const rows=$$('#expenseRows tr');
  for(const [i,tr] of rows.entries()){const n=`第 ${i+1} 筆明細`,type=tr.querySelector('.f-type').value;
    if(!type)return n+'：請選擇費用類別。';
    if(!tr.querySelector('.f-desc').value.trim())return n+'：請填寫費用說明。';
    if(DAY_TYPES.includes(type)){const dd=num(tr.querySelector('.f-days').value);if(!(dd>=1))return n+`：${type}須填寫實際天數。`;if(dd>d)return n+`：${type}天數（${dd}）不可超過實際出差天數（${d} 天）。`}
    if(tr.querySelector('.f-cur').value!=='新台幣'&&!(num(tr.querySelector('.f-rate').value)>0))return n+'：請填寫匯率。';
    if(!(num(tr.querySelector('.f-twd').value)>0))return n+'：台幣合計須大於 0。';}
  if(!(Number($('#voucher').value)>=1))return'請填寫憑證單數。';
  if(!$('#summary').value.trim())return'請填寫出差摘要。';
  if(!$('#advice').value.trim())return'請填寫心得建議。';
  return'';
}
function submit(){const err=validate();if(err){alert(err);return}
  $('#pageTitle').textContent='國外出差請款單（CBS-HTE-2026-00007）';$('#applyDate').textContent='申請日期：'+new Date().toLocaleDateString('zh-TW',{year:'numeric',month:'2-digit',day:'2-digit'});
  alert(`已送出簽核（台幣合計 NT$ ${fmt(calcTotal())}），系統已回寫申請日期與申請單號。`)}
['#submitBtn','#submitBtn2'].forEach(s=>$(s).onclick=submit);['#saveDraft','#saveDraft2'].forEach(s=>$(s).onclick=()=>alert('已儲存草稿。'));
// ===== 列印 =====
const dash=v=>String(v||'').trim()||'—',br=v=>esc(dash(v)).replace(/\n/g,'<br>');
function buildPrint(){
  const m=mode.value,mm=$('#pageTitle').textContent.match(/（(CBS-[^）]+)）/);
  $('#pCompany').textContent=$('#company').value;$('#pDocNo').textContent=mm?mm[1]:'—';
  $('#pApplicant').textContent=$('#applicant').selectedOptions[0].textContent;$('#pUnit').textContent=dash($('#applicantUnit').textContent);
  $('#pHtr').textContent=dash($('#htrNo').value);$('#pDate').textContent=/回寫/.test($('#applyDate').textContent)?'—':$('#applyDate').textContent.replace('申請日期：','');
  $('#pReason').innerHTML=br($('#reason').value);$('#pPlace').textContent=dash($('#place').value);
  $('#pPeriod').textContent=$('#startDate').value&&$('#endDate').value?`${ymdSlash($('#startDate').value)} ～ ${ymdSlash($('#endDate').value)}（共 ${days()} 天）`:'—';
  $('#pRows').innerHTML=$$('#expenseRows tr').map(tr=>{const g=s=>tr.querySelector(s),cur=g('.f-cur').value;return`<tr><td>${esc(dash(g('.f-type').value))}</td><td>${esc(dash(g('.f-desc').value))}</td><td>${esc(cur)}</td><td class="num">${dash(g('.f-days').value)}</td><td class="num">${dash(g('.f-unit').value)}</td><td class="num">${esc(g('.f-fx').textContent.trim()||'—')}</td><td class="num">${cur==='新台幣'?'—':dash(g('.f-rate').value)}</td><td class="num">${dash(g('.f-twd').value)}</td></tr>`}).join('')+`<tr><th colspan="7" style="text-align:right">台幣合計</th><th class="num">${$('#expenseTotal').textContent}</th></tr>`;
  $('#pVoucher').textContent=$('#voucher').value?$('#voucher').value+' 張':'—';$('#pRemark').innerHTML=br($('#remark').value);
  $('#pSummary').innerHTML=br($('#summary').value);$('#pAdvice').innerHTML=br($('#advice').value);$('#pAttach').textContent=$('#sampleFile').hidden?'未附資料':'已附 1 份：'+$('#sampleFile .file-name').textContent;
  const st=stageStates(m);
  $('#pApproval').innerHTML=m==='new'?'<tr><td colspan="5">尚未送出簽核</td></tr>':STAGE_DEF.map((s,i)=>{const k=st[i],done=k==='approved'||k==='returned';return`<tr><td>${s.lv}</td><td>${esc(s.person)}</td><td>${LABEL[k]||'待簽核'}</td><td>${done?s.time.slice(0,10):'—'}</td><td>${esc(done&&s.op?s.op:'—')}</td></tr>`}).join('');
}
window.addEventListener('beforeprint',buildPrint);
applyMode();
// 作廢（比照請款單）：申請人可在申請中、簽核中、已退回、已核准作廢；作廢後原出差申請可重新建立請款單
(function(){
  if(!window.ClaimVoid)return;
  const viewBox=$('#viewActions'),editBox=$('#editActions'),titleEl=$('#pageTitle'),routeHead=$('#routePanel .round-badge');
  const mk=()=>{const b=document.createElement('button');b.type='button';b.className='btn tool-action void-action';b.hidden=true;b.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>作廢';return b};
  const btn=mk(),btn2=mk();viewBox.appendChild(btn);editBox.appendChild(btn2);
  const copyLink=viewBox.querySelector('a.tool-action');let info=null;
  const nowTxt=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return d.getFullYear()+'/'+p(d.getMonth()+1)+'/'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes())};
  function sync(){
    const v=mode.value,voided=v==='voided';$('#voidAlert').hidden=!voided;routeHead.textContent=v==='edit'?'目前送審輪次：2':'目前送審輪次：1';
    btn.hidden=!(v==='viewOwn'||v==='approved');btn2.hidden=v!=='edit';if(copyLink)copyLink.hidden=voided&&params.get('copy')==='0';
    if(!voided)return;
    const i=info||{reason:params.get('reason')||'出差申請單號選錯，作廢後重新建立。',time:params.get('at')||'2026/08/20 09:15',by:ME};
    titleEl.textContent='查看國外出差請款單（'+docNo()+'）';titleEl.insertAdjacentHTML('beforeend','<span class="void-badge">已作廢</span>');
    $('#voidReasonText').textContent=i.reason;$('#voidWhoText').textContent=i.by+'　'+i.time;routeHead.textContent='狀態：已作廢';
    $$('#routeBody .approval-stage').forEach(el=>{if(!el.classList.contains('pending'))return;el.className='approval-stage voided';const s=el.querySelector('.stage-status');s.className='stage-status voided';s.textContent='已作廢';el.querySelector('.stage-person').textContent='申請人已作廢，流程終止';el.querySelector('time').textContent=i.time});
  }
  function openVoid(){
    const s=mode.value==='edit'?'已退回':mode.value==='approved'?'已核准':'簽核中',no=docNo();
    ClaimVoid.open({no,status:s,label:'國外出差請款單',blockers:[],extraNote:'作廢後，原出差申請可重新建立國外出差請款單。',
      onConfirm(reason){info={reason,time:nowTxt(),by:ME};params.set('no',no);mode.value='voided';history.replaceState(null,'','?mode=voided&no='+encodeURIComponent(no));applyMode();sync();ClaimVoid.toast('國外出差請款單已作廢。')}});
  }
  btn.addEventListener('click',openVoid);btn2.addEventListener('click',openVoid);
  mode.addEventListener('change',()=>{info=null;sync()});sync();
})();
