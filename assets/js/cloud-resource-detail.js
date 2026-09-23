const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],params=new URLSearchParams(location.search),mode=$('#mode'),form=$('#form'),routePanel=$('#routePanel'),routeBody=$('#routeBody'),routeToggle=$('#routeToggle'),historyModal=$('#historyModal'),returnAlert=$('#returnAlert'),roundSummary=$('#roundSummary'),roundBadge=$('#roundBadge'),executionModal=$('#executionModal'),executionPanel=$('#executionPanel'),executionSummary=$('#executionSummary'),editExecutionBtn=$('#editExecutionBtn'),copyBtn=$('#copyBtn'),editPrintBtn=$('#editPrintBtn'),viewActions=$('#viewActions'),opinionSummary=$('#opinionSummary');
const people={T037:{unit:'總經理室／後勤支援部／人事總務課',email:'t037@cbs-gss.com.tw'},T021:{unit:'營運本部／客戶服務部',email:'t021@cbs-gss.com.tw'},T038:{unit:'技術本部／資訊部／SRE',email:'t038@cbs-gss.com.tw'}};
let executionRecord={executor:'林家筠 (T038)',date:'2026/09/16',note:'已完成雲端資源建立與權限設定，並通知申請人。'};
function fillPersonUnit(selectId,unitId){const person=people[$(selectId).value];$(unitId).textContent=person?.unit||''}
$('#applicant').onchange=()=>fillPersonUnit('#applicant','#applicantUnit');$('#owner').onchange=()=>fillPersonUnit('#owner','#ownerUnit');
function renderExecutionSummary(record){$('#executorView').textContent=record.executor;$('#executionDateView').textContent=record.date;$('#executionNoteView').textContent=record.note}
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
  const v=mode.value,readonly=['view','approve','execute','done'].includes(v),done=v==='done',executed=['view','done'].includes(v),wasReturned=v==='edit';
  $$('.control').forEach(x=>{if(x!==mode&&!x.closest('#executionModal'))x.disabled=readonly});
  $('#editActions').classList.toggle('view-only',readonly);
  copyBtn.hidden=v!=='edit';
  editPrintBtn.hidden=v!=='edit';
  opinionSummary.hidden=!readonly;
  $('#approveActions').classList.toggle('view-only',v!=='approve');
  $('#executeActions').classList.toggle('view-only',v!=='execute');
  $('#doneActions').classList.toggle('view-only',v!=='done');
  viewActions.classList.toggle('view-only',v!=='view');
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
  $('#executorInput').value=prefill?prefill.executor:'林家筠 (T038)';
  $('#executionDateInput').value=prefill?prefill.date.replace(/\//g,'-'):'';
  $('#executionNoteInput').value=prefill?prefill.note:'';
  executionModal.hidden=false;
  requestAnimationFrame(()=>$('#executorInput').focus());
}
function closeExecutionModal(){executionModal.hidden=true}
$('#completeBtn').onclick=e=>{e.preventDefault();openExecutionModal(null)};
editExecutionBtn.onclick=()=>openExecutionModal(executionRecord);
$$('[data-close-execution]').forEach(x=>x.onclick=closeExecutionModal);
$('#executionConfirm').onclick=()=>{
  const executor=$('#executorInput').value.trim(),dateValue=$('#executionDateInput').value,note=$('#executionNoteInput').value.trim();
  if(!executor||!dateValue||!note){alert('請填寫執行時間、執行內容與執行者。');return}
  const wasExecuting=mode.value==='execute';
  executionRecord={executor,date:dateValue.replace(/-/g,'/'),note};
  closeExecutionModal();
  alert(wasExecuting?'已回壓執行完成，執行狀態更新為「已執行」。':'已更新執行紀錄。');
  if(!wasExecuting)renderExecutionSummary(executionRecord);
};
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!historyModal.hidden)historyModal.hidden=true;if(!executionModal.hidden)executionModal.hidden=true});
function syncOtherFields(){$$('.other-toggle').forEach(x=>{const t=document.getElementById(x.dataset.target);if(!t)return;const show=x.checked;t.classList.toggle('hidden',!show);t.disabled=!show;if(!show)t.value=''})}
$$('.other-toggle').forEach(x=>{x.addEventListener('change',syncOtherFields);if(x.type==='radio'&&x.name)$$(`input[name="${x.name}"]`).forEach(sib=>sib.addEventListener('change',syncOtherFields))});syncOtherFields();function syncConditionalFields(){$$('.conditional-toggle').forEach(x=>{const t=document.getElementById(x.dataset.target);const show=x.checked;t.classList.toggle('hidden',!show);t.disabled=!show;if(!show)t.value=''})}$$('.conditional-toggle').forEach(x=>x.addEventListener('change',syncConditionalFields));syncConditionalFields();function syncExpiry(){const show=$$('input[name=duration]:checked').some(x=>x.value==='limited'),field=$('#expiry');field.classList.toggle('hidden',!show);field.disabled=!show;if(!show)field.value=''}$$('input[name=duration]').forEach(x=>x.addEventListener('change',syncExpiry));syncExpiry();
function syncRiskDescription(){const show=$$('input.risk-trigger:checked').some(x=>x.value==='yes'),field=$('#riskDescription'),input=field.querySelector('textarea');field.classList.toggle('hidden',!show);input.disabled=!show;if(!show)input.value=''}
$$('.risk-trigger').forEach(x=>x.addEventListener('change',syncRiskDescription));syncRiskDescription();
routeToggle.onclick=()=>{const opening=routeBody.classList.contains('route-collapsed');routeBody.classList.toggle('route-collapsed');routeToggle.textContent=opening?'收合':'查看'};
$('#submitBtn').onclick=e=>{e.preventDefault();if(!form.reportValidity())return;$('#docNo').textContent='CBS-ICS-2026-00006';$('#submitDate').textContent='申請日期：'+new Date().toLocaleDateString('zh-TW');alert('已送出簽核，系統已回寫申請日期與申請單號。')};
if(params.get('copy')){mode.value='new';applyMode();$('#docNo').textContent='尚未產生單號';$('#submitDate').textContent='申請日期：送出簽核後由系統回寫'}

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
function resourceTypeText(){
  const boxes=[...$('#resourceTypeChoices').querySelectorAll('input[type=checkbox]')];
  const parts=boxes.filter(cb=>cb.checked).map(cb=>{
    let text=cb.closest('label').textContent.trim();
    if(cb.classList.contains('other-toggle')){
      const other=document.getElementById(cb.dataset.target);
      if(other&&other.value.trim())text=`其他（${other.value.trim()}）`;
    }
    return text;
  });
  return parts.length?parts.join('、'):'—';
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
  $('#printResourceType').textContent=resourceTypeText();
  $('#printPlatform').textContent=radioLabelText('platform');
  $('#printEnvironment').textContent=environmentText();
  $('#printScope').textContent=radioLabelText('scope');
  const planned=$('#plannedDate').value;
  $('#printPlannedDate').textContent=planned?planned.replace(/-/g,'/'):'—';
  $('#printDuration').textContent=durationText();
  $('#printReason').textContent=textOrDash(form.querySelector('.demand-reason textarea'));
  $('#printCost').textContent=textOrDash(form.querySelector('.demand-cost textarea'));
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
  $('#printExecutor').textContent=executed?executionRecord.executor:'—';
}
window.addEventListener('beforeprint',buildPrintView);

