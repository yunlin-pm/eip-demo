const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],params=new URLSearchParams(location.search),mode=$('#mode'),form=$('#form'),routePanel=$('#routePanel'),routeBody=$('#routeBody'),routeToggle=$('#routeToggle'),historyModal=$('#historyModal'),returnAlert=$('#returnAlert'),roundSummary=$('#roundSummary'),roundBadge=$('#roundBadge'),executionModal=$('#executionModal'),executionPanel=$('#executionPanel'),executionSummary=$('#executionSummary'),editExecutionBtn=$('#editExecutionBtn'),copyBtn=$('#copyBtn'),editPrintBtn=$('#editPrintBtn'),viewActions=$('#viewActions'),opinionSummary=$('#opinionSummary');
const people={T037:{unit:'總經理室／後勤支援部／人事總務課',companies:['網家跨境服務股份有限公司','空中補給股份有限公司','比比昂株式會社']},T021:{unit:'營運本部／客戶服務部',companies:['網家跨境服務股份有限公司']},T038:{unit:'技術本部／資訊部／SRE',companies:['網家跨境服務股份有限公司','比比昂株式會社']}};
const unitEmployeeDept={T037:'人事總務課',T021:'客戶服務部',T038:'資訊部／SRE',B019:'代購部',A008:'資訊部／SRE'};
function syncUnitDept(select){const cell=select.closest('tr')?.querySelector('.dept-display');if(!cell)return;cell.textContent=unitEmployeeDept[select.value]||'—'}
$$('.unit-panel .employee-select').forEach(x=>{x.addEventListener('change',()=>syncUnitDept(x));syncUnitDept(x)});
let executionRecord={executor:'林家筠 (T038)',date:'2026/09/16',note:'已完成權限設定並通知申請人，請於下次登入時確認可正常使用。'};
function fillPersonInfo(){const person=people[$('#applicant').value],company=$('#companySelect'),current=company.value;$('#applicantUnit').textContent=person?.unit||'';company.innerHTML=(person?.companies||[]).map(name=>'<option>'+name+'</option>').join('');if((person?.companies||[]).includes(current))company.value=current}
$('#applicant').onchange=fillPersonInfo;
function renderExecutionSummary(record){$('#executorView').textContent=record.executor;$('#executionDateView').textContent=record.date;$('#executionNoteView').textContent=record.note;$('#disableDateView').textContent=record.disable||'—'}
const approvalOpinions=[{stage:'上級主管',person:'羅弘奕 (B019)',status:'approved',statusText:'已核准',opinion:'請 SRE 確認資源存取範圍是否符合最小權限原則。'}];
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
const accessBody=$('#accessRequirementRows'),accessSample=[...accessBody.children].map(r=>r.cloneNode(true));let accessBlank=false;
// 新增（非複製）時存取權限需求只有一列空白列：申請類型預設「請選擇」，其餘欄位為空白、顯示 placeholder；其他情境維持範例資料
function syncAccessRows(){const blank=mode.value==='new'&&!params.get('copy');if(blank===accessBlank)return;accessBlank=blank;accessBody.replaceChildren(...(blank?[(()=>{const r=accessSample[0].cloneNode(true);r.querySelector('select').value='';r.querySelectorAll('input').forEach(i=>i.value='');return r})()]:accessSample.map(r=>r.cloneNode(true))))}
function applyMode(){
  syncAccessRows();
  const v=mode.value,readonly=['view','viewOwn','voided','approve','execute','done'].includes(v),done=v==='done',executed=['view','done'].includes(v),wasReturned=v==='edit';
  $$('.control').forEach(x=>{if(x!==mode&&!x.closest('#executionModal'))x.disabled=readonly});
  $('#editActions').classList.toggle('view-only',readonly);
  copyBtn.hidden=v!=='edit';
  editPrintBtn.hidden=v!=='edit';
  opinionSummary.hidden=v==='new';
  $('#approveActions').classList.toggle('view-only',v!=='approve');
  $('#executeActions').classList.toggle('view-only',v!=='execute');
  $('#doneActions').classList.toggle('view-only',v!=='done');
  viewActions.classList.toggle('view-only',!['view','viewOwn','voided'].includes(v));
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
  $('#disableDateInput').value=prefill&&prefill.disable?prefill.disable.replace(/\//g,'-'):'';
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
$$('.other-toggle').forEach(x=>{x.addEventListener('change',syncOtherFields);if(x.type==='radio'&&x.name)$$(`input[name="${x.name}"]`).forEach(sib=>sib.addEventListener('change',syncOtherFields))});syncOtherFields();
function syncConditionalFields(){$$('.conditional-toggle').forEach(x=>{const t=document.getElementById(x.dataset.target);const show=x.checked;t.classList.toggle('hidden',!show);t.disabled=!show;if(!show)t.value=''})}
$$('.conditional-toggle').forEach(x=>x.addEventListener('change',syncConditionalFields));syncConditionalFields();
function syncExpiry(){const show=$$('input[name=duration]:checked').some(x=>x.value==='limited'),box=$('#expiryField'),field=$('#expiry');box.classList.toggle('hidden',!show);field.disabled=!show;field.required=show;if(!show)field.value=''}
$$('input[name=duration]').forEach(x=>x.addEventListener('change',syncExpiry));syncExpiry();
routeToggle.onclick=()=>{const opening=routeBody.classList.contains('route-collapsed');routeBody.classList.toggle('route-collapsed');routeToggle.textContent=opening?'收合':'查看'};
// 使用環境的專案代號為選填；僅在送出簽核時，若已勾選的環境未填專案代號，先請使用者確認（儲存草稿不檢查）
$('#submitBtn').onclick=e=>{e.preventDefault();
// 申請人本人是 SRE 審核、技術副部長或技術部長的簽核人時，阻擋送出（Demo 以範例路線的簽核人對應）
const selfStage=({T038:'SRE 審核',D012:'技術副部長',D020:'技術部長'})[$('#applicant').value];if(selfStage){alert(`您是本單「${selfStage}」的簽核人，無法以自己的名義送出雲端權限申請，請由其他同仁擔任申請人送出（您可列為權限使用者）。`);return}
if(!form.reportValidity())return;const noProject=$$('.conditional-toggle:checked').filter(x=>!document.getElementById(x.dataset.target).value.trim()).map(x=>x.closest('label').textContent.trim());if(noProject.length&&!confirm(`${noProject.join('、')}尚未填寫專案代號，確認要送出簽核？`))return;$('#docNo').textContent='CBS-ICP-2026-00007';$('#submitDate').textContent='申請日期：'+new Date().toLocaleDateString('zh-TW');alert('已送出簽核，系統已回寫申請日期與申請單號。')};
if(params.get('copy')&&params.get('copy')!=='0'){mode.value='new';applyMode();$('#docNo').textContent='尚未產生單號';$('#submitDate').textContent='申請日期：送出簽核後由系統回寫'}


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
    const fields=[...row.querySelectorAll('select,input')],values=fields.map(field=>field.tagName==='SELECT'?(field.value?field.selectedOptions[0]?.textContent:''):field.value);
    return`<tr>${values.slice(0,4).map(value=>`<td>${printEscape(printText(value))}</td>`).join('')}</tr>`;
  });
  $('#permissionPrintAccessRows').innerHTML=accessRows.join('')||'<tr><td colspan="4">—</td></tr>';

  const userRows=$$('#permissionUserRows tr').map(row=>{
    const dept=row.querySelector('.dept-display')?.textContent,user=row.querySelector('.employee-select')?.selectedOptions[0]?.textContent;
    if(!user||user.includes('請選擇'))return'';
    return`<tr><td>${printEscape(dept)}</td><td>${printEscape(user.replace(/\(([^)]+)\)$/,' ($1)'))}</td></tr>`;
  }).filter(Boolean);
  $('#permissionPrintUserRows').innerHTML=userRows.join('')||'<tr><td colspan="2">—</td></tr>';

  const approvedDates={'上級主管':'2026/09/17'};
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
  $('#permissionPrintDisableDate').textContent=showExecution&&executionRecord.disable?executionRecord.disable:'—';
}
window.addEventListener('beforeprint',buildPermissionPrintView);
// 作廢（比照雲端服務與資源申請）：申請人可在「申請中、簽核中、已退回、已核准且 SRE 尚未執行」時作廢；已執行不可作廢。
(function(){
  if(!window.ClaimVoid)return;
  const ME='陳庭瑋 (T037)',viewBox=$('#viewActions'),editBox=$('#editActions'),routeHead=$('#roundBadge');
  const st=()=>params.get('st')||'簽核中',docNo=()=>params.get('no')||'CBS-ICP-2026-00006';
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
    const i=info||{reason:params.get('reason')||'改由其他方式處理，不需要此權限。',time:params.get('at')||'2026/09/25 11:20',by:ME,from:params.get('from')||'簽核中'};
    if(docTitle)docTitle.insertAdjacentHTML('beforeend','<span class="void-badge">已作廢</span>');
    $('#voidReasonText').textContent=i.reason;$('#voidWhoText').textContent=i.by+'　'+i.time;
    routeHead.textContent='狀態：已作廢';
    const stages=[...document.querySelectorAll('#routeBody .approval-stage')];
    // 作廢前已核准：全部關卡視為已核准；其餘未完成關卡標示已作廢
    if(i.from==='已核准')stages.forEach(el=>{if(el.classList.contains('skipped'))return;el.className='approval-stage approved';const s=el.querySelector('.stage-status');s.className='stage-status approved';s.textContent='已核准'});
    stages.forEach(el=>{if(el.classList.contains('skipped')||el.classList.contains('approved'))return;el.className='approval-stage voided';
      const s=el.querySelector('.stage-status');s.className='stage-status voided';s.textContent='已作廢';
      el.querySelector('.stage-person').textContent='申請人已作廢，流程終止'});
    routePanel.hidden=false;
  }
  function openVoid(){
    const raw=mode.value==='edit'?'已退回':st(),no=docNo(),approved=raw==='尚未執行'||raw==='已核准';
    const s=approved?'已核准':raw;
    ClaimVoid.open({no,status:s,statusText:approved?'已核准（尚未執行）':s,label:'雲端權限申請',blockers:ClaimVoid.blockersOf(no),
      warn:'此單已核准，作廢前請先與 SRE 確認尚未開始設定或異動權限。',
      extraNote:approved?'具執行權限的 SRE 人員在「執行管理」會看到此單標示為「已作廢」，無法再回報執行完成。':'',
      onConfirm(reason){
        info={reason,time:nowTxt(),by:ME,from:s};
        params.set('no',no);mode.value='voided';history.replaceState(null,'','?mode=voided&no='+encodeURIComponent(no));
        applyMode();sync();ClaimVoid.toast('雲端權限申請 '+no+' 已作廢。');
      }});
  }
  btn.addEventListener('click',openVoid);btn2.addEventListener('click',openVoid);
  mode.addEventListener('change',()=>{info=null;sync()});
  sync();
})();
