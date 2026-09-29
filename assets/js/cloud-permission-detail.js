const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],params=new URLSearchParams(location.search),mode=$('#mode'),form=$('#form'),routePanel=$('#routePanel'),routeBody=$('#routeBody'),routeToggle=$('#routeToggle'),historyModal=$('#historyModal'),returnAlert=$('#returnAlert'),roundSummary=$('#roundSummary'),roundBadge=$('#roundBadge'),executionModal=$('#executionModal'),executionPanel=$('#executionPanel'),executionSummary=$('#executionSummary'),editExecutionBtn=$('#editExecutionBtn'),copyBtn=$('#copyBtn'),editPrintBtn=$('#editPrintBtn'),viewActions=$('#viewActions'),opinionSummary=$('#opinionSummary');
const people={T037:{unit:'總經理室／後勤支援部／人事總務課',companies:['網家跨境服務股份有限公司','空中補給股份有限公司','比比昂株式會社']},T021:{unit:'營運本部／客戶服務部',companies:['網家跨境服務股份有限公司']},T038:{unit:'技術本部／資訊部／SRE',companies:['網家跨境服務股份有限公司','比比昂株式會社']}};
const unitEmployeeDept={T037:'人事總務課',T021:'客戶服務部',T038:'資訊部／SRE',B019:'代購部',A008:'資訊部／SRE'};
function syncUnitDept(select){const cell=select.closest('tr')?.querySelector('.dept-display');if(!cell)return;cell.textContent=unitEmployeeDept[select.value]||'—'}
$$('.unit-panel .employee-select').forEach(x=>{x.addEventListener('change',()=>syncUnitDept(x));syncUnitDept(x)});
let executionRecord={executor:'林家筠 (T038)',date:'2026/09/16',note:'已完成權限設定並通知申請人，請於下次登入時確認可正常使用。'};
function fillPersonInfo(){const person=people[$('#applicant').value],company=$('#companySelect'),current=company.value;$('#applicantUnit').textContent=person?.unit||'';company.innerHTML=(person?.companies||[]).map(name=>'<option>'+name+'</option>').join('');if((person?.companies||[]).includes(current))company.value=current}
$('#applicant').onchange=fillPersonInfo;
function renderExecutionSummary(record){$('#executorView').textContent=record.executor;$('#executionDateView').textContent=record.date;$('#executionNoteView').textContent=record.note}
const approvalOpinions=[{stage:'部級主管',person:'羅弘奕 (B019)',status:'approved',statusText:'已核准',opinion:''},{stage:'處級主管',person:'陳志明 (A008)',status:'approved',statusText:'已核准',opinion:'請 SRE 確認資源存取範圍是否符合最小權限原則。'}];
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
  $('#docNo').textContent=v==='new'?'尚未產生單號':no||'CBS-ICP-2026-00006';
  $('#submitDate').textContent=v==='new'?'申請日期：送出簽核後由系統回寫':'申請日期：2026/09/17';
  routePanel.hidden=v==='new';
  returnAlert.hidden=!wasReturned;
  roundSummary.hidden=!wasReturned;
  roundBadge.textContent='目前送審輪次：1';
  if(v!=='new'){routeBody.classList.add('route-collapsed');routeToggle.textContent='查看'}
}
mode.onchange=applyMode;mode.value=params.get('mode')||'new';if(![...mode.options].some(x=>x.value===mode.value))mode.value='new';fillPersonInfo();applyMode();
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
$$('.other-toggle').forEach(x=>{x.addEventListener('change',syncOtherFields);if(x.type==='radio'&&x.name)$$(`input[name="${x.name}"]`).forEach(sib=>sib.addEventListener('change',syncOtherFields))});syncOtherFields();
function syncConditionalFields(){$$('.conditional-toggle').forEach(x=>{const t=document.getElementById(x.dataset.target);const show=x.checked;t.classList.toggle('hidden',!show);t.disabled=!show;if(!show)t.value=''})}
$$('.conditional-toggle').forEach(x=>x.addEventListener('change',syncConditionalFields));syncConditionalFields();
function syncExpiry(){const show=$$('input[name=duration]:checked').some(x=>x.value==='limited'),field=$('#expiry');field.classList.toggle('hidden',!show);field.disabled=!show;if(!show)field.value=''}
$$('input[name=duration]').forEach(x=>x.addEventListener('change',syncExpiry));syncExpiry();
routeToggle.onclick=()=>{const opening=routeBody.classList.contains('route-collapsed');routeBody.classList.toggle('route-collapsed');routeToggle.textContent=opening?'收合':'查看'};
$('#submitBtn').onclick=e=>{e.preventDefault();if(!form.reportValidity())return;$('#docNo').textContent='CBS-ICP-2026-00007';$('#submitDate').textContent='申請日期：'+new Date().toLocaleDateString('zh-TW');alert('已送出簽核，系統已回寫申請日期與申請單號。')};
if(params.get('copy')){mode.value='new';applyMode();$('#docNo').textContent='尚未產生單號';$('#submitDate').textContent='申請日期：送出簽核後由系統回寫'}


function printText(value){const text=(value??'').toString().trim();return text||'—'}
function printEscape(value){return printText(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function selectedLabel(selector){const input=$(selector);return input?printText(input.closest('label')?.childNodes[1]?.textContent||input.closest('label')?.textContent):'—'}
function buildPermissionPrintView(){
  const company=$('#companySelect').selectedOptions[0]?.textContent;
  const applicant=$('#applicant').selectedOptions[0]?.textContent;
  const dateText=$('#submitDate').textContent.replace(/^申請日期：\s*/,'');
  $('#permissionPrintCompany').textContent=printText(company);
  $('#permissionPrintDocNo').textContent=printText($('#docNo').textContent);
  $('#permissionPrintApplicant').textContent=printText(applicant);
  $('#permissionPrintDate').textContent=dateText.includes('系統回寫')?'—':printText(dateText);
  $('#permissionPrintApplicantUnit').textContent=printText($('#applicantUnit').textContent);

  const platformInput=$('input[name="platform"]:checked');
  let platform=selectedLabel('input[name="platform"]:checked');
  if(platformInput?.classList.contains('other-toggle')&&$('#platformOther').value.trim())platform=`其他（${$('#platformOther').value.trim()}）`;
  $('#permissionPrintPlatform').textContent=platform;

  const environments=$$('.environment-list input[type="checkbox"]:checked').map(input=>{
    const base=(input.closest('label')?.childNodes[1]?.textContent||'').trim();
    const target=input.dataset.target&&document.getElementById(input.dataset.target);
    return target?.value.trim()?`${base}（${target.value.trim()}）`:base;
  }).filter(Boolean);
  $('#permissionPrintEnvironment').textContent=environments.length?environments.join('、'):'—';
  $('#permissionPrintPlannedDate').textContent=$('#plannedDate').value?$('#plannedDate').value.replace(/-/g,'/'):'—';
  const duration=$('input[name="duration"]:checked');
  $('#permissionPrintDuration').textContent=duration?.value==='limited'?`限期（至 ${$('#expiry').value?$('#expiry').value.replace(/-/g,'/'):'未填寫'}）`:duration?'長期':'—';
  $('#permissionPrintReason').textContent=printText($('#applicationReason').value);

  const accessRows=$$('#accessRequirementRows tr').map(row=>{
    const fields=[...row.querySelectorAll('select,input')],values=fields.map(field=>field.tagName==='SELECT'?field.selectedOptions[0]?.textContent:field.value);
    return`<tr>${values.slice(0,4).map(value=>`<td>${printEscape(value)}</td>`).join('')}</tr>`;
  });
  $('#permissionPrintAccessRows').innerHTML=accessRows.join('')||'<tr><td colspan="4">—</td></tr>';

  const userRows=$$('#permissionUserRows tr').map(row=>{
    const dept=row.querySelector('.dept-display')?.textContent,user=row.querySelector('.employee-select')?.selectedOptions[0]?.textContent;
    if(!user||user.includes('請選擇'))return'';
    return`<tr><td>${printEscape(dept)}</td><td>${printEscape(user.replace(/\(([^)]+)\)$/,' ($1)'))}</td></tr>`;
  }).filter(Boolean);
  $('#permissionPrintUserRows').innerHTML=userRows.join('')||'<tr><td colspan="2">—</td></tr>';

  const approvedDates={'部級主管':'2026/09/17','處級主管':'2026/09/17'};
  const opinionByStage=Object.fromEntries(approvalOpinions.map(item=>[item.stage,item.opinion]));
  const approvalRows=$$('.approval-stage').map(stage=>{
    const level=stage.querySelector('.stage-title').textContent.replace(/^[①-⑩]\s*/,''),person=stage.querySelector('.stage-person').textContent.replace(/^簽核者：/,'').trim(),status=stage.querySelector('.stage-status').textContent.trim();
    return`<tr><td>${printEscape(level)}</td><td>${printEscape(person)}</td><td>${printEscape(status)}</td><td>${printEscape(approvedDates[level])}</td><td>${printEscape(opinionByStage[level])}</td></tr>`;
  });
  $('#permissionPrintApprovalRows').innerHTML=approvalRows.join('')||'<tr><td colspan="5">尚未送出簽核</td></tr>';

  const showExecution=['view','done'].includes(mode.value);
  $('#permissionPrintExecutionDate').textContent=showExecution?printText(executionRecord.date):'—';
  $('#permissionPrintExecutor').textContent=showExecution?printText(executionRecord.executor):'—';
  $('#permissionPrintExecutionNote').textContent=showExecution?printText(executionRecord.note):'—';
}
window.addEventListener('beforeprint',buildPermissionPrintView);


