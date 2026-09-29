const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],params=new URLSearchParams(location.search),mode=$('#mode'),form=$('#form'),routePanel=$('#routePanel'),routeBody=$('#routeBody'),routeToggle=$('#routeToggle'),historyModal=$('#historyModal'),returnAlert=$('#returnAlert'),roundSummary=$('#roundSummary'),roundBadge=$('#roundBadge'),executionModal=$('#executionModal'),executionPanel=$('#executionPanel'),executionSummary=$('#executionSummary'),editExecutionBtn=$('#editExecutionBtn'),copyBtn=$('#copyBtn'),editPrintBtn=$('#editPrintBtn'),viewActions=$('#viewActions'),opinionSummary=$('#opinionSummary');
const people={T037:{id:'T037',unit:'總經理室／後勤支援部／人事總務課',email:'t037@cbs-gss.com.tw'},T021:{id:'T021',unit:'營運本部／客戶服務部',email:'t021@cbs-gss.com.tw'},T038:{id:'T038',unit:'技術本部／資訊部／SRE',email:'t038@cbs-gss.com.tw'}};
function fillPersonInfo(){const p=people[$('#applicant').value];if(!p)return;$('#applicantUnit').textContent=p.unit;$('#applicantEmailNote').textContent=p.email}
$('#applicant').onchange=fillPersonInfo;

/* 新臺幣換算暫以 1 USD = NT$31 計算，實際匯率作法待確認。 */
const NTD_RATE=31;
function planMonthlyFee(){const checked=$$('.plan-option:checked')[0];if(!checked)return 0;if(checked.value==='other')return Number($('#planOtherPrice').value||0);return Number(checked.value)}
function syncGeneralManagerStage(ntd){
  const stage=$('#generalManagerStage');
  if(!stage)return;
  const required=ntd>=100001;
  stage.className='approval-stage '+(required?'pending':'skipped');
  stage.querySelector('.stage-status').className='stage-status'+(required?' pending':'');
  stage.querySelector('.stage-status').textContent=required?'待前序完成':'不需簽核';
  stage.querySelector('.stage-person').textContent=required?'簽核者：總經理':'';
}
function syncEstimate(){
  const fee=planMonthlyFee(),months=Number($('#duration').value||0),total=fee*months;
  $('#estimateCost').textContent='USD '+(total?String(total):'0');
  const ntd=Math.round(total*NTD_RATE);
  syncGeneralManagerStage(ntd);
  $('#estimateHint').textContent=`換算新臺幣約 NT$${ntd.toLocaleString('zh-TW')}（目前以 1 USD = NT$31 計算，待確認實際作法）`;
}
function syncPlanOther(){const other=$$('.plan-option:checked')[0]?.value==='other';$('#planOtherFields').classList.toggle('hidden',!other)}
$$('input[name=plan]').forEach(x=>x.addEventListener('change',()=>{syncPlanOther();syncEstimate()}));
$('#planOtherPrice').addEventListener('input',syncEstimate);
$('#duration').addEventListener('input',syncEstimate);
syncPlanOther();syncEstimate();

function syncApplyItemFields(){
  const isStop=selectedApplyItem()==='stop';
  $('#durationField').classList.toggle('hidden',isStop);
  $('#estimateField').classList.toggle('hidden',isStop);
  $('#benefitPanel').classList.toggle('hidden',isStop);
  $('#riskPanel').classList.toggle('hidden',isStop);
  $('#duration').required=!isStop;
  $('#benefitRequirement').textContent=isStop?'停用時，預計節省工時與預計產生成效皆為非必填。':'新增或續用時，「預計節省工時」與「預計產生成效」至少擇一填寫。';
  validateExpectedBenefit();
}
$$('input[name=applyItem]').forEach(x=>x.addEventListener('change',syncApplyItemFields));

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

function validateExpectedBenefit(){
  const stop=selectedApplyItem()==='stop',before=$('#hoursBefore').value,after=$('#hoursAfter').value,benefit=$('#benefit').value.trim();
  const hoursComplete=before!==''&&after!=='';
  const hoursValid=hoursComplete&&Number(before)>=Number(after);
  const negative=hoursComplete&&Number(before)<Number(after);
  const valid=stop||(!negative&&(hoursValid||benefit!==''));
  $('#benefit').setCustomValidity(valid?'':negative?'預計導入後工時不得大於目前工時。':'新增或續用時，請完整填寫預計節省工時，或填寫預計產生成效。');
  return valid;
}
['hoursBefore','hoursAfter','benefit'].forEach(id=>$('#'+id).addEventListener('input',validateExpectedBenefit));

function syncRiskNote(){
  const anyYes=$$('input[name=risk1]:checked,input[name=risk2]:checked').some(x=>x.value==='yes'),field=$('#riskNoteField'),textarea=$('#riskNote');
  field.classList.toggle('hidden',!anyYes);
  textarea.required=anyYes;
  if(!anyYes)textarea.value='';
}
$$('input[name=risk1],input[name=risk2]').forEach(x=>x.addEventListener('change',syncRiskNote));syncRiskNote();

const loginUser=document.body.dataset.eipUser||'—';
let executionRecord={executor:loginUser,date:'2026/09/22',cancelDate:'2026/12/22',note:'已完成 AI 工具帳號開通，並通知申請人。'};
function renderExecutionSummary(record){$('#executorView').textContent=record.executor;$('#executionDateView').textContent=record.date;$('#cancelDateView').textContent=record.cancelDate||'—';$('#executionNoteView').textContent=record.note}

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
mode.onchange=applyMode;mode.value=params.get('mode')||'new';if(![...mode.options].some(x=>x.value===mode.value))mode.value='new';fillPersonInfo();applyMode();syncApplyItemFields();
$('#historyLink').onclick=()=>{historyModal.hidden=false};
$$('[data-close-history]').forEach(x=>x.onclick=()=>{historyModal.hidden=true});
function addCalendarMonths(dateValue,months){
  if(!dateValue||!months)return'';
  const [year,month,day]=dateValue.split('-').map(Number),baseMonth=month-1+Number(months),targetYear=year+Math.floor(baseMonth/12),targetMonth=((baseMonth%12)+12)%12,lastDay=new Date(targetYear,targetMonth+1,0).getDate();
  return`${targetYear}-${String(targetMonth+1).padStart(2,'0')}-${String(Math.min(day,lastDay)).padStart(2,'0')}`;
}
function selectedApplyItem(){return $('input[name=applyItem]:checked')?.value||'new'}
function syncCancelDate(force=true){
  const stop=selectedApplyItem()==='stop',field=$('#cancelDateField'),input=$('#cancelDateInput');
  field.hidden=stop;input.required=!stop;
  if(stop){input.value='';return}
  if(force)input.value=addCalendarMonths($('#executionDateInput').value,Number($('#duration').value||0));
}
$('#executionDateInput').addEventListener('change',()=>syncCancelDate(true));
function openExecutionModal(prefill){
  const checkedPlan=$('.plan-option:checked');
  $('#executionAiAccount').textContent=$('#applicantEmailNote').textContent.trim()||'—';
  $('#executionPlan').textContent=checkedPlan?.value==='other'?`其他（${$('#planOtherNote').value.trim()||'未填寫'}）`:checkedPlan?.dataset.label||'—';
  $('#executionDuration').textContent=`${$('#duration').value||'—'} 個月`;
  $('#executorInput').value=loginUser;
  $('#executionDateInput').value=prefill?prefill.date.replace(/\//g,'-'):'';
  $('#cancelDateInput').value=prefill?.cancelDate?prefill.cancelDate.replace(/\//g,'-'):'';
  $('#executionNoteInput').value=prefill?prefill.note:'';
  syncCancelDate(!prefill?.cancelDate);
  executionModal.hidden=false;
  requestAnimationFrame(()=>$('#executionDateInput').focus());
}
function closeExecutionModal(){executionModal.hidden=true}
$('#completeBtn').onclick=e=>{e.preventDefault();openExecutionModal(null)};
editExecutionBtn.onclick=()=>openExecutionModal(executionRecord);
$$('[data-close-execution]').forEach(x=>x.onclick=closeExecutionModal);
$('#executionConfirm').onclick=()=>{
  const executor=loginUser,dateValue=$('#executionDateInput').value,cancelDateValue=$('#cancelDateInput').value,note=$('#executionNoteInput').value.trim(),needsCancelDate=selectedApplyItem()!=='stop';
  if(!dateValue||!note||(needsCancelDate&&!cancelDateValue)){alert('請填寫執行日期、預計取消日與執行內容。');return}
  const wasExecuting=mode.value==='execute';
  executionRecord={executor,date:dateValue.replace(/-/g,'/'),cancelDate:needsCancelDate?cancelDateValue.replace(/-/g,'/'):'—',note};
  closeExecutionModal();
  alert(wasExecuting?'已回填執行完成，執行狀態更新為「已執行」。':'已更新執行紀錄。');
  if(!wasExecuting)renderExecutionSummary(executionRecord);
};
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!historyModal.hidden)historyModal.hidden=true;if(!executionModal.hidden)executionModal.hidden=true});
routeToggle.onclick=()=>{const opening=routeBody.classList.contains('route-collapsed');routeBody.classList.toggle('route-collapsed');routeToggle.textContent=opening?'收合':'查看'};
$('#submitBtn').onclick=e=>{e.preventDefault();if(!form.reportValidity())return;$('#docNo').textContent='CBS-IAI-2026-00007';$('#submitDate').textContent='申請日期：'+new Date().toLocaleDateString('zh-TW');alert('已送出簽核，系統已回寫申請日期與申請單號。')};
if(params.get('copy')){mode.value='new';applyMode();$('#docNo').textContent='尚未產生單號';$('#submitDate').textContent='申請日期：送出簽核後由系統回寫'}

/* 內容頁列印：比照《雲端服務與資源申請》cloud-resource-detail.js 的 buildPrintView() 既有作法，
   於 beforeprint 時把畫面上目前的欄位值帶入畫面外的 #printSheet（定義在 ai-tool-print.css，
   僅列印時顯示），輸出單欄報表版面；版面依使用者提供之《AI工具使用申請表》（表單編號 ITF-4）
   列印樣式參考製作。不含表單附件及簽核意見彙整，比照雲端服務與資源申請 ICS-019 的既有決定
   （使用者確認「簽核意見」與「簽核意見彙整」是同一件事，列印本就不含）。「執行紀錄」已比照
   雲端服務與資源申請 ICS-014 的「執行時間／執行內容／執行者」三欄慣例調整資料模型（見下方
   executionRecord／executionModal），故列印表格三欄皆有實際資料可帶入，不再是固定「—」。 */
function radioLabelText(name){
  const checked=document.querySelector(`input[name="${name}"]:checked`);
  return checked?checked.closest('label').textContent.trim():'—';
}
function textOrDash(el){const v=el&&el.value!==undefined?el.value:el&&el.textContent;return v&&v.trim()?v.trim():'—'}
function planText(){
  const checked=$$('.plan-option:checked')[0];
  if(!checked)return'—';
  if(checked.value==='other'){
    const note=textOrDash($('#planOtherNote')),price=$('#planOtherPrice').value;
    return`其他（${note}），每月費用：${price?`USD ${price}／月`:'未填寫'}`;
  }
  return`${checked.dataset.label}，每月花費：USD ${checked.value}／月`;
}
function hoursSavedText(){
  const freq=hoursFreqLabel[$('#saveFreq').value]||'每週',before=$('#hoursBefore').value,after=$('#hoursAfter').value;
  if(before===''&&after==='')return`${freq}；尚未填寫工時`;
  return`${freq}；目前工時 ${before||'—'} 小時，預計導入後 ${after||'—'} 小時，共節省 ${$('#hoursSaved').textContent} 小時`;
}
function buildPrintView(){
  $('#printCompany').textContent=$('#companySelect').selectedOptions[0].text;
  $('#printDocNo').textContent=$('#docNo').textContent;
  $('#printApplicantName').textContent=$('#applicant').selectedOptions[0].text.trim();
  $('#printApplyDate').textContent=$('#submitDate').textContent.replace(/^申請日期：/,'');
  $('#printApplicantUnit').textContent=textOrDash($('#applicantUnit'));
  $('#printAiAccount').textContent=textOrDash($('#applicantEmailNote'));
  $('#printApplyItem').textContent=radioLabelText('applyItem');
  $('#printPlan').textContent=planText();
  const isStop=selectedApplyItem()==='stop';
  $('#printBenefitTable').hidden=isStop;
  $('#printRiskTable').hidden=isStop;
  $('#printDuration').textContent=isStop?'—':`${$('#duration').value} 個月`;
  $('#printCost').textContent=isStop?'—':textOrDash($('#estimateCost'));
  $('#printReason').textContent=textOrDash($('#reason'));
  $('#printHoursSaved').textContent=hoursSavedText();
  $('#printBenefit').textContent=textOrDash($('#benefit'));
  $('#printRisk1').textContent=radioLabelText('risk1');
  $('#printRisk2').textContent=radioLabelText('risk2');
  const riskField=$('#riskNoteField');
  $('#printRiskNote').textContent=riskField.classList.contains('hidden')?'—':textOrDash($('#riskNote'));
  const stages=[...document.querySelectorAll('.approval-stage')];
  $('#printApprovalRows').innerHTML=stages.map(el=>{
    const title=(el.querySelector('.stage-title').textContent||'').replace(/^[①-⑩]\s*/,'');
    const status=el.querySelector('.stage-status').textContent.trim();
    const person=(el.querySelector('.stage-person').textContent||'').replace(/^簽核者：/,'').trim()||'—';
    return`<tr><td>${title}</td><td>${person}</td><td>${status}</td><td>—</td></tr>`;
  }).join('')||'<tr><td colspan="4">尚未送出簽核</td></tr>';
  const executed=['view','done'].includes(mode.value);
  $('#printExecDate').textContent=executed?executionRecord.date:'—';
  $('#printCancelDate').textContent=executed?(executionRecord.cancelDate||'—'):'—';
  $('#printExecutor').textContent=executed?executionRecord.executor:'—';
  $('#printExecNote').textContent=executed?executionRecord.note:'—';
}
window.addEventListener('beforeprint',buildPrintView);





