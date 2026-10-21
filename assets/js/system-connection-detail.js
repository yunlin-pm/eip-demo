const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],params=new URLSearchParams(location.search),mode=$('#mode'),form=$('#form'),routePanel=$('#routePanel'),routeBody=$('#routeBody'),routeToggle=$('#routeToggle'),historyModal=$('#historyModal'),returnAlert=$('#returnAlert'),roundSummary=$('#roundSummary'),roundBadge=$('#roundBadge'),executionModal=$('#executionModal'),executionPanel=$('#executionPanel'),executionSummary=$('#executionSummary'),editExecutionBtn=$('#editExecutionBtn'),copyBtn=$('#copyBtn'),editPrintBtn=$('#editPrintBtn'),viewActions=$('#viewActions'),opinionSummary=$('#opinionSummary');
const loginUser=document.body.dataset.eipUser||'—';
// 申請人（可選公司與所屬單位）、權責人（部門、Email）範例資料
const people={T037:{unit:'總經理室／後勤支援部／人事總務課',companies:['網家跨境服務股份有限公司','空中補給股份有限公司','比比昂株式會社']},T021:{unit:'營運本部／客戶服務部',companies:['網家跨境服務股份有限公司']},T038:{unit:'技術本部／資訊部／SRE',companies:['網家跨境服務股份有限公司','比比昂株式會社']}};
const directory={T037:{name:'陳庭瑋',dept:'人事總務課',email:'user02@japan-import.com.tw'},T021:{name:'王曉明',dept:'客戶服務部',email:'user04@japan-import.com.tw'},T038:{name:'林家筠',dept:'資訊部／SRE',email:'user05@japan-import.com.tw'},B019:{name:'羅弘奕',dept:'代購部',email:'user03@japan-import.com.tw'},A008:{name:'陳志明',dept:'資訊部／SRE',email:'user06@japan-import.com.tw'}};
let executionRecord={executor:'林家筠 (T038)',date:'2026/09/25'};
function fillPersonInfo(){const person=people[$('#applicant').value],company=$('#companySelect'),current=company.value;$('#applicantUnit').textContent=person?.unit||'';company.innerHTML=(person?.companies||[]).map(name=>'<option>'+name+'</option>').join('');if((person?.companies||[]).includes(current))company.value=current}
$('#applicant').onchange=fillPersonInfo;
// 需求權責人：選員工後，部門與 Email 由系統帶出（唯讀文字）
function syncOwner(){const d=directory[$('#owner').value];$('#ownerInfo').innerHTML=d?d.dept+'<br>'+d.email:'—'}
$('#owner').onchange=syncOwner;
function renderExecutionSummary(record){$('#executorView').textContent=record.executor;$('#executionDateView').textContent=record.date}
const approvalOpinions=[{stage:'直屬主管',person:'羅弘奕 (B019)',status:'approved',statusText:'已核准',opinion:'請 SRE 確認來源端與目的端範圍是否符合最小開放原則。'}];
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

// ===== 連線需求資訊（可新增／刪除列）=====
const connBody=$('#connectionRows');
const connSample=[
  {type:'新增',src:'cbs-app-prod（10.10.1.0/24）',dst:'cbs-db-prod（10.20.3.15）',port:'5432',proto:'TCP',note:'應用程式讀寫訂單資料庫，新增來源網段連線。'},
  {type:'移除',src:'office-vpn（203.0.113.10）',dst:'cbs-bastion-prod（10.20.0.5）',port:'22',proto:'TCP',note:'目前允許辦公室固定 IP 連線 TCP 22；因辦公室搬遷，請移除此連線。'}
];
function connRow(d){const tr=document.createElement('tr');tr.innerHTML=`<td class="row-no"></td><td><select class="control conn-type" required><option value="">請選擇</option><option>新增</option><option>移除</option></select></td><td><input class="control conn-src" placeholder="系統／主機／IP" required></td><td><input class="control conn-dst" placeholder="系統／主機／IP" required></td><td><input class="control conn-port" placeholder="例如 443" pattern="[0-9]{1,5}([,\\-][0-9]{1,5})*" title="請輸入 Port；多個以逗號分隔、範圍以連字號表示，例如 443、80,443、8000-8080"></td><td><input class="control conn-proto" list="protocolList" placeholder="TCP／UDP…"></td><td><textarea class="control conn-note" rows="1" placeholder="使用用途；變更／移除請填目前設定及調整內容" required></textarea></td><td><button class="link-button row-delete" type="button">刪除</button></td>`;
  if(d){tr.querySelector('.conn-type').value=d.type;tr.querySelector('.conn-src').value=d.src;tr.querySelector('.conn-dst').value=d.dst;tr.querySelector('.conn-port').value=d.port;tr.querySelector('.conn-proto').value=d.proto;tr.querySelector('.conn-note').value=d.note}
  return tr}
function renumberConn(){$$('#connectionRows .row-no').forEach((el,i)=>el.textContent=i+1)}
function setConnRows(list){connBody.replaceChildren(...list.map(connRow));renumberConn()}
$('#addConnRow').onclick=()=>{connBody.appendChild(connRow());renumberConn()};
connBody.addEventListener('click',e=>{const b=e.target.closest('.row-delete');if(!b)return;if($$('#connectionRows tr').length<=1){alert('至少需保留一列連線需求。');return}b.closest('tr').remove();renumberConn()});

// ===== 範例內容：新增（非複製）時整張表單空白；其他情境帶入一筆範例申請 =====
let sampleLoaded=null;
function setChecked(sel,on){$$(sel).forEach(x=>x.checked=false);if(on)on.forEach(v=>{const el=typeof v==='string'?$(v):v;if(el)el.checked=true})}
function loadForm(filled){
  if(filled===sampleLoaded)return;sampleLoaded=filled;
  $('#owner').value=filled?'T021':'';syncOwner();
  $$('input[name=platform]').forEach(x=>x.checked=filled&&x.value==='GCP');
  $$('#envList input[type=checkbox]').forEach(x=>x.checked=false);$$('#scopeList input[type=checkbox]').forEach(x=>x.checked=false);
  if(filled){$('#envList .conditional-toggle[data-target=prodProject]').checked=true;$('#envList .conditional-toggle[data-target=testProject]').checked=true;$('#scopeList input[value=internal]').checked=true}
  syncOtherFields();syncConditionalFields();
  if(filled){$('#prodProject').value='cbs-core-prod';$('#testProject').value='cbs-core-test'}
  $('#plannedDate').value=filled?'2026-10-12':'';
  $$('input[name=duration]').forEach(x=>x.checked=filled&&x.value==='limited');syncExpiry();
  if(filled)$('#expiry').value='2027-10-11';
  $('#applicationReason').value=filled?'訂單系統上線後，應用程式需連線至正式資料庫；同時移除已搬遷辦公室的舊連線。':'';
  setConnRows(filled?connSample:[null]);
}
function applyMode(){
  const v=mode.value,readonly=['view','approve','execute','done'].includes(v),done=v==='done',executed=['view','done'].includes(v),wasReturned=v==='edit';
  loadForm(!(v==='new'&&!params.get('copy')));
  $$('.control').forEach(x=>{if(x!==mode&&!x.closest('#executionModal'))x.disabled=readonly});
  syncOtherFields();syncConditionalFields();syncExpiry();
  form.classList.toggle('is-readonly',readonly);
  $('#editActions').classList.toggle('view-only',readonly);
  copyBtn.hidden=v!=='edit';
  editPrintBtn.hidden=v!=='edit';
  opinionSummary.hidden=v==='new';
  $('#approveActions').classList.toggle('view-only',v!=='approve');
  $('#executeActions').classList.toggle('view-only',v!=='execute');
  $('#doneActions').classList.toggle('view-only',v!=='done');
  viewActions.classList.toggle('view-only',v!=='view');
  executionPanel.classList.toggle('view-only',!executed);
  // 已核准後（查看／執行／執行完成）關卡全部顯示為已核准；簽核中情境維持範例的簽核進度
  const allApproved=['view','execute','done'].includes(v);
  $$('.approval-stage').forEach((st,i)=>{if(!allApproved)return;st.classList.remove('pending');st.classList.add('approved');const b=st.querySelector('.stage-status');b.classList.remove('pending');b.classList.add('approved');b.textContent='已核准'});
  executionSummary.hidden=!executed;
  editExecutionBtn.hidden=!done;
  if(executed)renderExecutionSummary(executionRecord);
  const no=params.get('no');
  $('#docNo').textContent=v==='new'?'尚未產生單號':no||'CBS-ISC-2026-00006';
  $('#submitDate').textContent=v==='new'?'申請日期：送出簽核後由系統回寫':'申請日期：2026/09/17';
  routePanel.hidden=v==='new';
  returnAlert.hidden=!wasReturned;
  roundSummary.hidden=!wasReturned;
  roundBadge.textContent='目前送審輪次：1';
  if(v!=='new'){routeBody.classList.add('route-collapsed');routeToggle.textContent='查看'}
}
function syncOtherFields(){$$('.other-toggle').forEach(x=>{const t=document.getElementById(x.dataset.target);if(!t)return;const show=x.checked;t.classList.toggle('hidden',!show);t.disabled=!show||mode.value&&['view','approve','execute','done'].includes(mode.value);if(!show)t.value=''})}
$$('.other-toggle').forEach(x=>{x.addEventListener('change',syncOtherFields);if(x.type==='radio'&&x.name)$$(`input[name="${x.name}"]`).forEach(sib=>sib.addEventListener('change',syncOtherFields))});
function syncConditionalFields(){$$('.conditional-toggle').forEach(x=>{const t=document.getElementById(x.dataset.target);const show=x.checked;t.classList.toggle('hidden',!show);t.disabled=!show||['view','approve','execute','done'].includes(mode.value);if(!show)t.value=''})}
$$('.conditional-toggle').forEach(x=>x.addEventListener('change',syncConditionalFields));
function syncExpiry(){const show=$$('input[name=duration]:checked').some(x=>x.value==='limited'),box=$('#expiryField'),field=$('#expiry');box.classList.toggle('hidden',!show);field.disabled=!show||['view','approve','execute','done'].includes(mode.value);field.required=show;if(!show)field.value=''}
$$('input[name=duration]').forEach(x=>x.addEventListener('change',syncExpiry));
mode.onchange=applyMode;mode.value=params.get('mode')||'new';if(![...mode.options].some(x=>x.value===mode.value))mode.value='new';fillPersonInfo();syncOwner();applyMode();
$('#historyLink').onclick=()=>{historyModal.hidden=false};
$$('[data-close-history]').forEach(x=>x.onclick=()=>{historyModal.hidden=true});

// ===== 執行紀錄：回填／編輯 Popup（執行日期＋執行者；執行者固定帶登入帳號）=====
function openExecutionModal(prefill){
  $('#executorInput').value=loginUser;
  $('#executionDateInput').value=prefill?prefill.date.replace(/\//g,'-'):'';
  $('#executionModalTitle').textContent=prefill?'編輯執行紀錄':'回填執行紀錄';
  $('#executionConfirm').textContent=prefill?'儲存':'確認執行完成';
  executionModal.hidden=false;
  requestAnimationFrame(()=>$('#executionDateInput').focus());
}
function closeExecutionModal(){executionModal.hidden=true}
$('#completeBtn').onclick=e=>{e.preventDefault();openExecutionModal(null)};
editExecutionBtn.onclick=()=>openExecutionModal(executionRecord);
$$('[data-close-execution]').forEach(x=>x.onclick=closeExecutionModal);
$('#executionConfirm').onclick=()=>{
  const dateValue=$('#executionDateInput').value;
  if(!dateValue){alert('請填寫執行日期。');return}
  const wasExecuting=mode.value==='execute';
  executionRecord={executor:loginUser,date:dateValue.replace(/-/g,'/')};
  closeExecutionModal();
  alert(wasExecuting?'已回壓執行完成，執行狀態更新為「已執行」。':'已更新執行紀錄。');
  if(!wasExecuting)renderExecutionSummary(executionRecord);
};
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!historyModal.hidden)historyModal.hidden=true;if(!executionModal.hidden)executionModal.hidden=true});
routeToggle.onclick=()=>{const opening=routeBody.classList.contains('route-collapsed');routeBody.classList.toggle('route-collapsed');routeToggle.textContent=opening?'收合':'查看'};

// ===== 送出簽核 =====
// 使用環境的專案代號為選填；僅在送出簽核時，若已勾選的環境未填專案代號，先請使用者確認（儲存草稿不檢查）
$('#submitBtn').onclick=e=>{e.preventDefault();
// 申請人本人是 SRE 審核、技術副部長或技術部長的簽核人時，阻擋送出（Demo 以範例路線的簽核人對應）
const selfStage=({T038:'SRE 審核',D012:'技術副部長',D020:'技術部長'})[$('#applicant').value];if(selfStage){alert(`您是本單「${selfStage}」的簽核人，無法以自己的名義送出系統連線申請，請由其他同仁擔任申請人送出。`);return}
if(!form.reportValidity())return;
if(!$$('#envList input[type=checkbox]:checked').length){alert('請至少勾選一項使用環境。');return}
if(!$$('#scopeList input[type=checkbox]:checked').length){alert('請至少勾選一項連線範圍。');return}
const noProject=$$('.conditional-toggle:checked').filter(x=>!document.getElementById(x.dataset.target).value.trim()).map(x=>x.closest('label').textContent.trim());if(noProject.length&&!confirm(`${noProject.join('、')}尚未填寫專案代號，確認要送出簽核？`))return;$('#docNo').textContent='CBS-ISC-2026-00007';$('#submitDate').textContent='申請日期：'+new Date().toLocaleDateString('zh-TW');alert('已送出簽核，系統已回寫申請日期與申請單號。')};
if(params.get('copy')){mode.value='new';sampleLoaded=null;applyMode();$('#docNo').textContent='尚未產生單號';$('#submitDate').textContent='申請日期：送出簽核後由系統回寫'}

// ===== 列印（beforeprint 時即時帶入畫面欄位值）=====
function printText(value){const text=(value??'').toString().trim();return text||'—'}
function printEscape(value){return printText(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function labelText(input){return (input.closest('label')?.childNodes[1]?.textContent||input.closest('label')?.textContent||'').trim()}
function buildConnectionPrintView(){
  const applicantCode=$('#applicant').value,dir=directory[applicantCode]||{};
  $('#connectionPrintCompany').textContent=printText($('#companySelect').selectedOptions[0]?.textContent);
  $('#connectionPrintDocNo').textContent=printText($('#docNo').textContent);
  $('#connectionPrintApplicant').textContent=printText($('#applicant').selectedOptions[0]?.textContent);
  $('#connectionPrintApplicantUnit').textContent=printText($('#applicantUnit').textContent);
  const ownerCode=$('#owner').value,owner=directory[ownerCode]||{};
  $('#connectionPrintOwner').textContent=printText($('#owner').selectedOptions[0]?.value?$('#owner').selectedOptions[0].textContent:'');
  $('#connectionPrintOwnerDept').textContent=printText(owner.dept);

  const platformInput=$('input[name="platform"]:checked');
  let platform=platformInput?labelText(platformInput):'—';
  if(platformInput?.classList.contains('other-toggle')&&$('#platformOther').value.trim())platform=`其他（${$('#platformOther').value.trim()}）`;
  $('#connectionPrintPlatform').textContent=platform;
  const withDetail=input=>{const base=labelText(input),target=input.dataset.target&&document.getElementById(input.dataset.target),v=target?.value.trim();return v?`${base}（${v}）`:base};
  const envs=$$('#envList input[type="checkbox"]:checked').map(withDetail).filter(Boolean);
  $('#connectionPrintEnvironment').textContent=envs.length?envs.join('、'):'—';
  const scopes=$$('#scopeList input[type="checkbox"]:checked').map(withDetail).filter(Boolean);
  $('#connectionPrintScope').textContent=scopes.length?scopes.join('、'):'—';
  $('#connectionPrintPlannedDate').textContent=$('#plannedDate').value?$('#plannedDate').value.replace(/-/g,'/'):'—';
  const duration=$('input[name="duration"]:checked');
  $('#connectionPrintDuration').textContent=duration?.value==='limited'?`限期（至 ${$('#expiry').value?$('#expiry').value.replace(/-/g,'/'):'未填寫'}）`:duration?'長期':'—';
  $('#connectionPrintReason').textContent=printText($('#applicationReason').value);

  const rows=$$('#connectionRows tr').map((row,i)=>{
    const v=[row.querySelector('.conn-type').value,row.querySelector('.conn-src').value,row.querySelector('.conn-dst').value,row.querySelector('.conn-port').value,row.querySelector('.conn-proto').value,row.querySelector('.conn-note').value];
    return`<tr><td>${i+1}</td>${v.map(x=>`<td>${printEscape(x)}</td>`).join('')}</tr>`;
  });
  $('#connectionPrintRows').innerHTML=rows.join('')||'<tr><td colspan="7">—</td></tr>';

  const approvedDates={'直屬主管':'2026/09/17','SRE 審核':'2026/09/18','技術副部長':'2026/09/19','技術部長':'2026/09/20'};
  const opinionByStage=Object.fromEntries(approvalOpinions.map(item=>[item.stage,item.opinion]));
  const approvalRows=$$('.approval-stage').map(stage=>{
    const level=stage.querySelector('.stage-title').textContent.replace(/^[①-⑩]\s*/,''),person=stage.querySelector('.stage-person').textContent.replace(/^簽核者：/,'').trim(),status=stage.querySelector('.stage-status').textContent.trim();
    return`<tr><td>${printEscape(level)}</td><td>${printEscape(person)}</td><td>${printEscape(status)}</td><td>${status==='已核准'?printEscape(approvedDates[level]):'—'}</td><td>${printEscape(opinionByStage[level])}</td></tr>`;
  });
  $('#connectionPrintApprovalRows').innerHTML=approvalRows.join('')||'<tr><td colspan="5">尚未送出簽核</td></tr>';

  const showExecution=['view','done'].includes(mode.value);
  $('#connectionPrintExecutionDate').textContent=showExecution?printText(executionRecord.date):'—';
  $('#connectionPrintExecutor').textContent=showExecution?printText(executionRecord.executor):'—';
}
window.addEventListener('beforeprint',buildConnectionPrintView);
