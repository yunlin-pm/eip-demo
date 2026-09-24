const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],params=new URLSearchParams(location.search),mode=$('#mode'),form=$('#form'),routePanel=$('#routePanel'),routeBody=$('#routeBody'),routeToggle=$('#routeToggle'),historyModal=$('#historyModal'),returnAlert=$('#returnAlert'),roundSummary=$('#roundSummary'),roundBadge=$('#roundBadge'),executionModal=$('#executionModal'),executionPanel=$('#executionPanel'),executionSummary=$('#executionSummary'),editExecutionBtn=$('#editExecutionBtn'),copyBtn=$('#copyBtn'),editPrintBtn=$('#editPrintBtn'),viewActions=$('#viewActions'),opinionSummary=$('#opinionSummary');
const people={T037:{id:'T037',unit:'總經理室／後勤支援部／人事總務課',email:'t037@cbs-gss.com.tw'},T021:{id:'T021',unit:'營運本部／客戶服務部',email:'t021@cbs-gss.com.tw'},T038:{id:'T038',unit:'技術本部／資訊部／SRE',email:'t038@cbs-gss.com.tw'}};
function fillPersonInfo(){const p=people[$('#applicant').value];if(!p)return;$('#applicantUnit').textContent=p.unit;$('#applicantEmailNote').textContent=p.email}
$('#applicant').onchange=fillPersonInfo;

/* 換算新臺幣僅供 Demo 示意路線門檻用途，匯率待確認（見專案記錄待辦） */
const NTD_RATE=31;
function planMonthlyFee(){const checked=$$('.plan-option:checked')[0];if(!checked)return 0;if(checked.value==='other')return Number($('#planOtherPrice').value||0);return Number(checked.value)}
function syncEstimate(){
  const fee=planMonthlyFee(),months=Number($('#duration').value||0),total=fee*months;
  $('#estimateCost').textContent='USD '+(total?String(total):'0');
  const ntd=Math.round(total*NTD_RATE);
  $('#estimateHint').textContent=`換算新臺幣約 NT$${ntd.toLocaleString('zh-TW')}（僅供 Demo 示意）`;
}
function syncPlanOther(){const other=$$('.plan-option:checked')[0]?.value==='other';$('#planOtherFields').classList.toggle('hidden',!other)}
$$('input[name=plan]').forEach(x=>x.addEventListener('change',()=>{syncPlanOther();syncEstimate()}));
$('#planOtherPrice').addEventListener('input',syncEstimate);
$('#duration').addEventListener('input',syncEstimate);
syncPlanOther();syncEstimate();

/* 「預計節省工時」共節省計算：頻率下拉選單（每週／每月／依專案）文字帶入結果列，
   目前工時／預期導入後工時任一未填時顯示「—」佔位，避免顯示 0 或 NaN 造成誤解。 */
const hoursFreqLabel={week:'每週',month:'每月',project:'依專案'};
function syncHoursSaved(){
  $('#hoursSavedFreq').textContent=hoursFreqLabel[$('#saveFreq').value]||'每週';
  const before=$('#hoursBefore').value,after=$('#hoursAfter').value;
  $('#hoursSaved').textContent=(before===''||after==='')?'—':String(Number(before)-Number(after));
}
$('#saveFreq').addEventListener('change',syncHoursSaved);
$('#hoursBefore').addEventListener('input',syncHoursSaved);
$('#hoursAfter').addEventListener('input',syncHoursSaved);
syncHoursSaved();

function syncRiskNote(){
  const anyYes=$$('input[name=risk1]:checked,input[name=risk2]:checked').some(x=>x.value==='yes'),field=$('#riskNoteField'),textarea=$('#riskNote');
  field.classList.toggle('hidden',!anyYes);
  textarea.required=anyYes;
  if(!anyYes)textarea.value='';
}
$$('input[name=risk1],input[name=risk2]').forEach(x=>x.addEventListener('change',syncRiskNote));syncRiskNote();

let executionRecord={executor:'蘇柏宇 (M010)',date:'2026/09/22'};
function renderExecutionSummary(record){$('#executorView').textContent=record.executor;$('#executionDateView').textContent=record.date}

const approvalOpinions=[{stage:'課級主管',person:'林于婷 (T045)',status:'approved',statusText:'已核准',opinion:''},{stage:'部級主管',person:'陳大華 (B123)',status:'approved',statusText:'已核准',opinion:'請確認資料使用範圍是否涉及客戶個資。'}];
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
  $('#docNo').textContent=v==='new'?'尚未產生單號':no||'CBS-IAI-2026-00006';
  $('#submitDate').textContent=v==='new'?'申請日期：送出簽核後由系統回寫':'申請日期：2026/09/19';
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
  $('#executorInput').value=prefill?prefill.executor:'蘇柏宇 (M010)';
  $('#executionDateInput').value=prefill?prefill.date.replace(/\//g,'-'):'';
  executionModal.hidden=false;
  requestAnimationFrame(()=>$('#executorInput').focus());
}
function closeExecutionModal(){executionModal.hidden=true}
$('#completeBtn').onclick=e=>{e.preventDefault();openExecutionModal(null)};
editExecutionBtn.onclick=()=>openExecutionModal(executionRecord);
$$('[data-close-execution]').forEach(x=>x.onclick=closeExecutionModal);
$('#executionConfirm').onclick=()=>{
  const executor=$('#executorInput').value.trim(),dateValue=$('#executionDateInput').value;
  if(!executor||!dateValue){alert('請填寫執行人員與執行日期。');return}
  const wasExecuting=mode.value==='execute';
  executionRecord={executor,date:dateValue.replace(/-/g,'/')};
  closeExecutionModal();
  alert(wasExecuting?'已回填執行完成，執行狀態更新為「已執行」。':'已更新執行紀錄。');
  if(!wasExecuting)renderExecutionSummary(executionRecord);
};
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!historyModal.hidden)historyModal.hidden=true;if(!executionModal.hidden)executionModal.hidden=true});
routeToggle.onclick=()=>{const opening=routeBody.classList.contains('route-collapsed');routeBody.classList.toggle('route-collapsed');routeToggle.textContent=opening?'收合':'查看'};
$('#submitBtn').onclick=e=>{e.preventDefault();if(!form.reportValidity())return;$('#docNo').textContent='CBS-IAI-2026-00007';$('#submitDate').textContent='申請日期：'+new Date().toLocaleDateString('zh-TW');alert('已送出簽核，系統已回寫申請日期與申請單號。')};
if(params.get('copy')){mode.value='new';applyMode();$('#docNo').textContent='尚未產生單號';$('#submitDate').textContent='申請日期：送出簽核後由系統回寫'}
