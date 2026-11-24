const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],params=new URLSearchParams(location.search),mode=$('#mode'),form=$('#form'),routePanel=$('#routePanel'),routeBody=$('#routeBody'),routeToggle=$('#routeToggle'),historyModal=$('#historyModal'),returnAlert=$('#returnAlert'),roundSummary=$('#roundSummary'),roundBadge=$('#roundBadge'),executionModal=$('#executionModal'),executionPanel=$('#executionPanel'),executionSummary=$('#executionSummary'),editExecutionBtn=$('#editExecutionBtn'),copyBtn=$('#copyBtn'),editPrintBtn=$('#editPrintBtn'),viewActions=$('#viewActions'),opinionSummary=$('#opinionSummary');
const people={T037:{unit:'總經理室／後勤支援部／人事總務課',email:'t037@cbs-gss.com.tw'},T021:{unit:'營運本部／客戶服務部',email:'t021@cbs-gss.com.tw'},T038:{unit:'技術本部／資訊部／SRE',email:'t038@cbs-gss.com.tw'}};
const loginUser=document.body.dataset.eipUser||'—';
let executionRecord={executor:'林家筠 (T038)',date:'2026/09/16',note:'已完成雲端資源建立與權限設定，並通知申請人。\n服務已部署至 asia-east1，防火牆規則已同步開通。'};

const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function isReadonlyMode(){return['view','viewOwn','voided','approve','execute','done'].includes(mode.value)}
/* 資源規格詳情：必填，僅限填寫連結（http:// 或 https://） */
let specSampleLoaded=false;
/* Demo 範例：非新增情境（編輯／查看／簽核／執行）預設帶入範例規格文件連結 */
function loadSampleSpec(){
  if(specSampleLoaded||mode.value==='new')return;
  specSampleLoaded=true;
  $('#specLink').value='https://docs.google.com/spreadsheets/d/1cbs-order-spec/edit?usp=sharing';
}

function fillPersonUnit(selectId,unitId){const person=people[$(selectId).value];$(unitId).textContent=person?.unit||''}
$('#applicant').onchange=()=>fillPersonUnit('#applicant','#applicantUnit');$('#owner').onchange=()=>fillPersonUnit('#owner','#ownerUnit');
function renderExecutionSummary(record){
  $('#executorView').textContent=record.executor;$('#executionDateView').textContent=record.date;$('#executionNoteView').textContent=record.note;$('#disableDateView').textContent=record.disable||'—';
}
const approvalOpinions=[{stage:'課級主管',person:'林家筠 (T038)',status:'approved',statusText:'已核准',opinion:'已確認申請內容合理，同意受理。'},{stage:'部級主管',person:'王曉明 (B122)',status:'approved',statusText:'已核准',opinion:'請留意雲端資源到期後的續約與資料保存規範，執行前請再次確認申請人已知悉相關政策。'}];
function renderOpinionSummary(){
  const withOpinion=approvalOpinions.filter(o=>o.opinion&&o.opinion.trim()),rows=$('#opinionRows'),empty=$('#opinionEmpty');
  if(withOpinion.length){
    rows.hidden=false;empty.hidden=true;
    rows.innerHTML=withOpinion.map(o=>`<article><div><b>${o.stage}</b><span>${o.person}</span><span class="stage-status ${o.status}">${o.statusText}</span></div><p>${o.opinion}</p></article>`).join('');
  }else{
    rows.hidden=true;empty.hidden=false;
  }
}
renderOpinionSummary();
function applyMode(){
  loadSampleSpec();
  const v=mode.value,readonly=['view','viewOwn','voided','approve','execute','done'].includes(v),done=v==='done',executed=['view','done'].includes(v),wasReturned=v==='edit';
  $$('.control').forEach(x=>{if(x!==mode&&!x.closest('#executionModal'))x.disabled=readonly});
  $('#editActions').classList.toggle('view-only',readonly);
  copyBtn.hidden=v!=='edit';
  editPrintBtn.hidden=v!=='edit';
  opinionSummary.hidden=!readonly;
  $('#approveActions').classList.toggle('view-only',v!=='approve');
  $('#executeActions').classList.toggle('view-only',v!=='execute');
  $('#doneActions').classList.toggle('view-only',v!=='done');
  viewActions.classList.toggle('view-only',!['view','viewOwn','voided'].includes(v));
  executionPanel.classList.toggle('view-only',!executed);
  executionSummary.hidden=!executed;
  editExecutionBtn.hidden=!done;
  if(executed)renderExecutionSummary(executionRecord);
  const no=params.get('no');
  $('#docNo').textContent=v==='new'?'尚未產生單號':no||'CBS-ICS-2026-00003';
  $('#submitDate').textContent=v==='new'?'申請日期：送出簽核後由系統回寫':'申請日期：2026/09/15';
  routePanel.hidden=v==='new';
  returnAlert.hidden=!wasReturned;
  roundSummary.hidden=!wasReturned;
  roundBadge.textContent='目前送審輪次：3';
  if(v!=='new'){routeBody.classList.add('route-collapsed');routeToggle.textContent='查看'}
}
mode.onchange=applyMode;mode.value=params.get('mode')||'new';if(![...mode.options].some(x=>x.value===mode.value))mode.value='new';fillPersonUnit('#applicant','#applicantUnit');fillPersonUnit('#owner','#ownerUnit');applyMode();
$('#historyLink').onclick=()=>{historyModal.hidden=false};
$$('[data-close-history]').forEach(x=>x.onclick=()=>{historyModal.hidden=true});
function openExecutionModal(prefill){
  $('#executorInput').value=loginUser;
  $('#executionDateInput').value=prefill?prefill.date.replace(/\//g,'-'):'';
  $('#executionNoteInput').value=prefill?prefill.note:'';
  $('#disableDateInput').value=prefill&&prefill.disable?prefill.disable.replace(/\//g,'-'):'';
  executionModal.hidden=false;
  requestAnimationFrame(()=>$('#executionDateInput').focus());
}
function closeExecutionModal(){executionModal.hidden=true}
$('#completeBtn').onclick=e=>{e.preventDefault();openExecutionModal(null)};
editExecutionBtn.onclick=()=>openExecutionModal(executionRecord);
$$('[data-close-execution]').forEach(x=>x.onclick=closeExecutionModal);
$('#executionConfirm').onclick=()=>{
  const executor=loginUser,dateValue=$('#executionDateInput').value,note=$('#executionNoteInput').value.trim();
  if(!executor||!dateValue||!note){alert('請填寫執行時間、執行內容與執行者。');return}
  const disableValue=$('#disableDateInput').value;
  if(disableValue&&disableValue<dateValue){alert('到期停用日期不可早於執行時間。');return}
  if(params.get('voided')==='1'){closeExecutionModal();alert('此單已作廢，無法回填執行完成。');return}
  const wasExecuting=mode.value==='execute';
  executionRecord={executor,date:dateValue.replace(/-/g,'/'),note,disable:disableValue?disableValue.replace(/-/g,'/'):''};
  closeExecutionModal();
  alert(wasExecuting?'已回壓執行完成，執行狀態更新為「已執行」。':'已更新執行紀錄。');
  if(!wasExecuting)renderExecutionSummary(executionRecord);
};
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!historyModal.hidden)historyModal.hidden=true;if(!executionModal.hidden)executionModal.hidden=true});
function syncOtherFields(){$$('.other-toggle').forEach(x=>{const t=document.getElementById(x.dataset.target);if(!t)return;const show=x.checked;t.classList.toggle('hidden',!show);t.disabled=!show;if(!show)t.value=''})}
$$('.other-toggle').forEach(x=>{x.addEventListener('change',syncOtherFields);if(x.type==='radio'&&x.name)$$(`input[name="${x.name}"]`).forEach(sib=>sib.addEventListener('change',syncOtherFields))});syncOtherFields();function syncConditionalFields(){$$('.conditional-toggle').forEach(x=>{const t=document.getElementById(x.dataset.target);const show=x.checked;t.classList.toggle('hidden',!show);t.disabled=!show;if(!show)t.value=''})}$$('.conditional-toggle').forEach(x=>x.addEventListener('change',syncConditionalFields));syncConditionalFields();function syncExpiry(){const show=$$('input[name=duration]:checked').some(x=>x.value==='limited'),field=$('#expiry');field.classList.toggle('hidden',!show);field.disabled=!show;if(!show)field.value=''}$$('input[name=duration]').forEach(x=>x.addEventListener('change',syncExpiry));syncExpiry();
function syncRiskDescription(){const show=$$('input.risk-trigger:checked').some(x=>x.value==='yes'),field=$('#riskDescription'),input=field.querySelector('textarea');field.classList.toggle('hidden',!show);input.disabled=!show;if(!show)input.value=''}
$$('.risk-trigger').forEach(x=>x.addEventListener('change',syncRiskDescription));syncRiskDescription();

/* 「預估費用」三選一：產生額外費用（搭配 NT$ 金額輸入框）／預期不產生額外費用／無法預估。
   金額輸入框僅於選「產生額外費用」時顯示（比照既有條件式欄位慣例：隱藏＋disabled＋清空）。
   「說明」欄位改為三種情況下都固定顯示（可用於備註原始幣別非台幣等情形），僅在選「預期不
   產生額外費用」或「無法預估」時才於送出簽核時檢核為必填，選「產生額外費用」時為選填、不
   清空既有內容，切換選項不影響已填寫的說明文字。 */
function syncCostFields(){
  const type=$$('input.cost-trigger:checked')[0]?.value||'amount',
        amountShow=type==='amount',noteRequired=type==='none'||type==='unknown',
        amountWrap=$('#costAmount').closest('.cost-amount'),amount=$('#costAmount'),
        note=$('#costNote');
  amountWrap.classList.toggle('hidden',!amountShow);
  amount.disabled=!amountShow;amount.required=amountShow;
  if(!amountShow)amount.value='';
  note.required=noteRequired;
}
$$('.cost-trigger').forEach(x=>x.addEventListener('change',syncCostFields));syncCostFields();
routeToggle.onclick=()=>{const opening=routeBody.classList.contains('route-collapsed');routeBody.classList.toggle('route-collapsed');routeToggle.textContent=opening?'收合':'查看'};
$('#submitBtn').onclick=e=>{e.preventDefault();if(!form.reportValidity())return;$('#docNo').textContent='CBS-ICS-2026-00006';$('#submitDate').textContent='申請日期：'+new Date().toLocaleDateString('zh-TW');alert('已送出簽核，系統已回寫申請日期與申請單號。')};
if(params.get('copy')==='1'){mode.value='new';applyMode();$('#docNo').textContent='尚未產生單號';$('#submitDate').textContent='申請日期：送出簽核後由系統回寫'}

function radioLabelText(name){
  const checked=document.querySelector(`input[name="${name}"]:checked`);
  if(!checked)return'—';
  let text=checked.closest('label').textContent.trim();
  if(checked.classList.contains('other-toggle')){
    const other=document.getElementById(checked.dataset.target);
    if(other&&other.value.trim())text=`其他（${other.value.trim()}）`;
  }
  return text;
}
function environmentText(){
  const labels=[...document.querySelectorAll('.environment-list label')];
  const parts=labels.map(label=>{
    const checkbox=label.querySelector('input[type=checkbox]');
    if(!checkbox||!checkbox.checked)return null;
    let text=label.textContent.trim();
    const target=checkbox.dataset.target&&document.getElementById(checkbox.dataset.target);
    if(target&&target.value.trim())text+=`（${checkbox.classList.contains('other-toggle')?'說明':'專案代號'}：${target.value.trim()}）`;
    return text;
  }).filter(Boolean);
  return parts.length?parts.join('、'):'—';
}
function durationText(){
  const checked=document.querySelector('input[name="duration"]:checked');
  if(!checked)return'—';
  if(checked.value==='limited'){
    const expiry=$('#expiry').value;
    return`限期（預計到期日：${expiry?expiry.replace(/-/g,'/'):'未填寫'}）`;
  }
  return'長期';
}
function textOrDash(el){const v=el&&el.value!==undefined?el.value:el&&el.textContent;return v&&v.trim()?v.trim():'—'}
function costText(){
  const type=$$('input.cost-trigger:checked')[0]?.value||'amount',note=textOrDash($('#costNote'));
  if(type==='amount'){
    const amt=$('#costAmount').value,base=amt?`產生額外費用 NT$${Number(amt).toLocaleString('zh-TW')}`:'產生額外費用（金額未填寫）';
    return note==='—'?base:`${base}（${note}）`;
  }
  const label=type==='none'?'預期不產生額外費用':'無法預估';
  return note==='—'?label:`${label}（${note}）`;
}
function stagePersonText(el){return(el.textContent||'').replace(/^簽核者：/,'').trim()||'—'}
function buildPrintView(){
  const applicantOption=$('#applicant').selectedOptions[0],ownerOption=$('#owner').selectedOptions[0];
  $('#printCompany').textContent=$('#companySelect').selectedOptions[0].text;
  $('#printDocNo').textContent=$('#docNo').textContent;
  $('#printApplicantName').textContent=applicantOption.text.trim();
  $('#printApplicantUnit').textContent=textOrDash($('#applicantUnit'));
  $('#printOwnerName').textContent=ownerOption.text.trim();
  $('#printOwnerUnit').textContent=textOrDash($('#ownerUnit'));
  $('#printRequestType').textContent=radioLabelText('request');
  $('#printPlatform').textContent=radioLabelText('platform');
  $('#printSpecLink').textContent=textOrDash($('#specLink'));
  $('#printEnvironment').textContent=environmentText();
  $('#printScope').textContent=radioLabelText('scope');
  const planned=$('#plannedDate').value;
  $('#printPlannedDate').textContent=planned?planned.replace(/-/g,'/'):'—';
  $('#printDuration').textContent=durationText();
  $('#printReason').textContent=textOrDash(form.querySelector('.demand-reason textarea'));
  $('#printCost').textContent=costText();
  $('#printPersonalData').textContent=radioLabelText('personal');
  $('#printSensitiveData').textContent=radioLabelText('sensitive');
  const riskField=$('#riskDescription');
  $('#printRiskNote').textContent=riskField.classList.contains('hidden')?'—':textOrDash(riskField.querySelector('textarea'));
  const stages=[...document.querySelectorAll('.approval-stage')];
  $('#printApprovalRows').innerHTML=stages.map(el=>{
    const title=(el.querySelector('.stage-title').textContent||'').replace(/^[①-⑩]\s*/,'');
    const status=el.querySelector('.stage-status').textContent.trim();
    const person=stagePersonText(el.querySelector('.stage-person'));
    return`<tr><td>${title}</td><td>${person}</td><td>${status}</td><td>—</td></tr>`;
  }).join('')||'<tr><td colspan="4">尚未送出簽核</td></tr>';
  const executed=['view','done'].includes(mode.value);
  $('#printExecDate').textContent=executed?executionRecord.date:'—';
  $('#printExecNote').textContent=executed?executionRecord.note:'—';
  $('#printExecDisable').textContent=executed&&executionRecord.disable?executionRecord.disable:'—';
  $('#printExecutor').textContent=executed?executionRecord.executor:'—';
}
window.addEventListener('beforeprint',buildPrintView);
// 作廢（比照請款單、簽呈單、採購請購單、公司印鑑、合約送審）：申請人可在「申請中、簽核中、已退回、已核准且 SRE 尚未執行」時作廢；已執行不可作廢。
(function(){
  if(!window.ClaimVoid)return;
  const ME='陳庭瑋 (T037)',viewBox=$('#viewActions'),editBox=$('#editActions'),routeHead=$('#roundBadge');
  const st=()=>params.get('st')||'簽核中',docNo=()=>params.get('no')||'CBS-ICS-2026-00003';
  const mk=()=>{const b=document.createElement('button');b.type='button';b.className='btn tool-action void-action';b.hidden=true;b.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>作廢';return b};
  const btn=mk(),btn2=mk();viewBox.appendChild(btn);editBox.appendChild(btn2);
  const copyLink=viewBox.querySelector('a.tool-action');
  const docTitle=document.querySelector('.cloud-basic-title>span');
  const routeOrig=[...document.querySelectorAll('#routeBody .approval-stage')].map(el=>[el,el.className,el.innerHTML]);
  let info=null;
  const nowTxt=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return d.getFullYear()+'/'+p(d.getMonth()+1)+'/'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes())};
  function sync(){
    const v=mode.value,voided=v==='voided',own=v==='viewOwn';
    routeOrig.forEach(([el,c,h])=>{el.className=c;el.innerHTML=h});
    $('#voidAlert').hidden=!voided;
    btn.hidden=!own;btn2.hidden=!(v==='edit'&&params.get('st')!=='草稿');
    if(copyLink)copyLink.hidden=voided&&params.get('copy')==='0';
    document.querySelectorAll('.void-badge').forEach(x=>x.remove());
    if(!voided)return;
    const i=info||{reason:params.get('reason')||'專案取消，不再需要此資源。',time:params.get('at')||'2026/09/25 11:20',by:ME,from:params.get('from')||'簽核中'};
    if(docTitle)docTitle.insertAdjacentHTML('beforeend','<span class="void-badge">已作廢</span>');
    $('#voidReasonText').textContent=i.reason;$('#voidWhoText').textContent=i.by+'　'+i.time;
    routeHead.textContent='狀態：已作廢';
    const stages=[...document.querySelectorAll('#routeBody .approval-stage')];
    // 作廢前已核准：全部必經關卡視為已核准（⑦總經理為條件式關卡，維持略過）；其餘待簽核關卡標示已作廢
    if(i.from==='已核准')stages.forEach(el=>{if(el.classList.contains('skipped'))return;el.className='approval-stage approved';const s=el.querySelector('.stage-status');s.className='stage-status approved';s.textContent='已核准'});
    stages.forEach(el=>{if(el.classList.contains('skipped')||el.classList.contains('approved'))return;el.className='approval-stage voided';
      const s=el.querySelector('.stage-status');s.className='stage-status voided';s.textContent='已作廢';
      el.querySelector('.stage-person').textContent='申請人已作廢，流程終止'});
    routePanel.hidden=false;
  }
  function openVoid(){
    const raw=mode.value==='edit'?'已退回':st(),no=docNo(),approved=/^已核准|^尚未執行/.test(raw)||raw==='尚未執行';
    const s=approved?'已核准':raw;
    ClaimVoid.open({no,status:s,statusText:approved?'已核准（尚未執行）':s,label:'雲端服務與資源申請',blockers:ClaimVoid.blockersOf(no),
      warn:'此單已核准，作廢前請先與 SRE 確認尚未開始建立或異動資源。',
      extraNote:approved?'具執行權限的 SRE 人員在「執行管理」會看到此單標示為「已作廢」，無法再回報執行完成。':'',
      onConfirm(reason){
        info={reason,time:nowTxt(),by:ME,from:s};
        params.set('no',no);mode.value='voided';history.replaceState(null,'','?mode=voided&no='+encodeURIComponent(no));
        applyMode();sync();ClaimVoid.toast('雲端服務與資源申請 '+no+' 已作廢。');
      }});
  }
  btn.addEventListener('click',openVoid);btn2.addEventListener('click',openVoid);
  mode.addEventListener('change',()=>{info=null;sync()});
  sync();
})();
