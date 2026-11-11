const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],params=new URLSearchParams(location.search),mode=$('#mode'),form=$('#form'),routePanel=$('#routePanel'),routeBody=$('#routeBody'),routeToggle=$('#routeToggle'),historyModal=$('#historyModal'),returnAlert=$('#returnAlert'),roundSummary=$('#roundSummary'),roundBadge=$('#roundBadge'),executionModal=$('#executionModal'),executionPanel=$('#executionPanel'),executionSummary=$('#executionSummary'),editExecutionBtn=$('#editExecutionBtn'),copyBtn=$('#copyBtn'),editPrintBtn=$('#editPrintBtn'),viewActions=$('#viewActions'),opinionSummary=$('#opinionSummary');
const people={T037:{unit:'總經理室／後勤支援部／人事總務課',email:'t037@cbs-gss.com.tw'},T021:{unit:'營運本部／客戶服務部',email:'t021@cbs-gss.com.tw'},T038:{unit:'技術本部／資訊部／SRE',email:'t038@cbs-gss.com.tw'}};
const loginUser=document.body.dataset.eipUser||'—';
let executionRecord={executor:'林家筠 (T038)',date:'2026/09/16',note:'已完成雲端資源建立與權限設定，並通知申請人。\n服務已部署至 asia-east1，防火牆規則已同步開通。',resources:[{name:'Cloud Run',id:'run-svc-order-api-prod'},{name:'Cloud SQL',id:'sql-inst-orders-01'},{name:'Cloud Storage',id:'gs://cbs-order-assets'}]};

/* 雲端資源項目：選擇雲端平台 GCP／AWS 後顯示，依平台列出常用服務供複選（範例資料；正式清單由資訊單位維護，見規格 ICS-026） */
const RESOURCE_ITEMS={
  GCP:['Cloud Run','Compute Engine','Cloud SQL','Cloud Storage','BigQuery','GKE（Kubernetes）','Cloud Functions','Pub/Sub'],
  AWS:['EC2','RDS','S3','Lambda','ECS／EKS','CloudFront','DynamoDB','SQS']
};
let resourceItemPlatform='',sampleLoaded=false;
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function isReadonlyMode(){return['view','approve','execute','done'].includes(mode.value)}
function customRowHtml(v){return`<div class="custom-item-row"><input class="control resource-item-custom" placeholder="請輸入雲端資源項目" value="${esc(v||'')}"><button class="btn compact custom-item-del" type="button">刪除</button></div>`}
function syncCustomRows(){
  const rows=$$('.custom-item-row'),ro=isReadonlyMode();
  rows.forEach(r=>{const d=r.querySelector('.custom-item-del');d.hidden=ro||rows.length<2});
  const add=$('#addCustomItem');if(add)add.hidden=ro;
}
function syncResourceItems(){
  const checked=document.querySelector('input[name="platform"]:checked'),pf=checked?checked.value:'',isOther=pf==='other',list=RESOURCE_ITEMS[pf],group=$('#resourceItemGroup'),box=$('#resourceItemChoices');
  group.classList.toggle('hidden',!list&&!isOther);
  if(!list&&!isOther){box.innerHTML='';resourceItemPlatform='';return}
  if(resourceItemPlatform===pf)return;
  resourceItemPlatform=pf;
  if(isOther){
    /* 雲端平台選「其他」：沒有預設清單，改為自行輸入項目名稱，可新增／刪除列 */
    box.innerHTML='<div class="custom-item-list" id="customItemList">'+customRowHtml('')+'</div><button class="btn compact" id="addCustomItem" type="button">增加項目</button>';
    $('#addCustomItem').onclick=()=>{$('#customItemList').insertAdjacentHTML('beforeend',customRowHtml(''));syncCustomRows();const ins=$$('.resource-item-custom');ins[ins.length-1].focus()};
    $('#customItemList').addEventListener('click',e=>{const b=e.target.closest('.custom-item-del');if(!b)return;b.closest('.custom-item-row').remove();syncCustomRows()});
    $$('.resource-item-custom').forEach(x=>x.disabled=isReadonlyMode());syncCustomRows();
    return;
  }
  box.innerHTML=list.map(n=>`<label><input class="control resource-item" type="checkbox" value="${esc(n)}"> ${esc(n)}</label>`).join('')+'<label><input class="control resource-item-other-toggle" type="checkbox"> 其他</label><input id="resourceItemOther" class="control inline-text hidden" placeholder="資源項目名稱" disabled>';
  box.querySelector('.resource-item-other-toggle').addEventListener('change',e=>{const t=$('#resourceItemOther');t.classList.toggle('hidden',!e.target.checked);t.disabled=!e.target.checked;if(!e.target.checked)t.value=''});
  $$('.resource-item,.resource-item-other-toggle').forEach(x=>x.disabled=isReadonlyMode());
}
function selectedResourceItems(){
  if($('#customItemList'))return $$('.resource-item-custom').map(x=>x.value.trim()).filter(Boolean);
  const names=$$('.resource-item:checked').map(x=>x.value),other=document.querySelector('.resource-item-other-toggle:checked');
  if(other){const t=$('#resourceItemOther').value.trim();names.push(t?`其他（${t}）`:'其他')}
  return names;
}
function validateResourceItems(){
  if($('#resourceItemGroup').classList.contains('hidden'))return true;
  if($('#customItemList')){
    const vals=$$('.resource-item-custom').map(x=>x.value.trim());
    if(!vals.some(Boolean)){alert('請至少填寫一項雲端資源項目。');return false}
    if(vals.some(v=>!v)){alert('請填寫雲端資源項目，或刪除空白的項目。');return false}
    return true;
  }
  if(!selectedResourceItems().length){alert('請至少選擇一項雲端資源項目。');return false}
  const other=document.querySelector('.resource-item-other-toggle:checked');
  if(other&&!$('#resourceItemOther').value.trim()){alert('選擇「其他」時，請填寫資源項目名稱。');return false}
  return true;
}
/* Demo 範例：非新增情境（編輯／查看／簽核／執行）預設帶入 GCP 與三項雲端資源項目，方便展示執行回報 */
function loadSampleResourceItems(){
  if(sampleLoaded||mode.value==='new')return;
  sampleLoaded=true;
  const gcp=document.querySelector('input[name="platform"][value="GCP"]');gcp.checked=true;syncResourceItems();
  $$('.resource-item').forEach(x=>{x.checked=['Cloud Run','Cloud SQL','Cloud Storage'].includes(x.value)});
}
$$('input[name="platform"]').forEach(x=>x.addEventListener('change',syncResourceItems));

function fillPersonUnit(selectId,unitId){const person=people[$(selectId).value];$(unitId).textContent=person?.unit||''}
$('#applicant').onchange=()=>fillPersonUnit('#applicant','#applicantUnit');$('#owner').onchange=()=>fillPersonUnit('#owner','#ownerUnit');
function renderExecutionSummary(record){
  $('#executorView').textContent=record.executor;$('#executionDateView').textContent=record.date;$('#executionNoteView').textContent=record.note;$('#disableDateView').textContent=record.disable||'—';
  const res=record.resources||[];$('#resourceIdViewField').hidden=!res.length;
  $('#resourceIdView').innerHTML=res.map(r=>`${esc(r.name)}，資源編號：${esc(r.id)}`).join('<br>');
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
  loadSampleResourceItems();
  const v=mode.value,readonly=['view','approve','execute','done'].includes(v),done=v==='done',executed=['view','done'].includes(v),wasReturned=v==='edit';
  $$('.control').forEach(x=>{if(x!==mode&&!x.closest('#executionModal'))x.disabled=readonly});
  $$('.resource-item-custom').forEach(x=>x.disabled=readonly);syncCustomRows();
  const otherT=$('#resourceItemOther');if(otherT&&!readonly)otherT.disabled=otherT.classList.contains('hidden');
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
  const items=selectedResourceItems(),old=(prefill&&prefill.resources)||[];
  $('#resourceIdBlock').hidden=!items.length;
  $('#resourceIdRows').innerHTML=items.map((n,i)=>{const hit=old.find(r=>r.name===n);return`<label class="resource-id-row"><span class="resource-id-name">${esc(n)}，資源編號 <b class="req-star">*</b>：</span><input class="control resource-id-input" data-name="${esc(n)}" value="${esc(hit?hit.id:'')}" placeholder="請輸入資源編號" autocomplete="off"></label>`}).join('');
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
  const resources=$$('.resource-id-input').map(x=>({name:x.dataset.name,id:x.value.trim()}));
  if(resources.some(r=>!r.id)){alert('請填寫所有雲端資源項目的資源編號。');return}
  if(!executor||!dateValue||!note){alert('請填寫執行時間、執行內容與執行者。');return}
  const disableValue=$('#disableDateInput').value;
  if(disableValue&&disableValue<dateValue){alert('到期停用日期不可早於執行時間。');return}
  const wasExecuting=mode.value==='execute';
  executionRecord={executor,date:dateValue.replace(/-/g,'/'),note,resources,disable:disableValue?disableValue.replace(/-/g,'/'):''};
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
$('#submitBtn').onclick=e=>{e.preventDefault();if(!form.reportValidity())return;if(!validateResourceItems())return;$('#docNo').textContent='CBS-ICS-2026-00006';$('#submitDate').textContent='申請日期：'+new Date().toLocaleDateString('zh-TW');alert('已送出簽核，系統已回寫申請日期與申請單號。')};
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
  $('#printResourceType').textContent=resourceTypeText();
  $('#printPlatform').textContent=radioLabelText('platform');
  $('#printResourceItems').textContent=$('#resourceItemGroup').classList.contains('hidden')?'—':(selectedResourceItems().join('、')||'—');
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
  $('#printExecResources').textContent=executed&&(executionRecord.resources||[]).length?executionRecord.resources.map(r=>`${r.name}：${r.id}`).join('\n'):'—';
  $('#printExecDate').textContent=executed?executionRecord.date:'—';
  $('#printExecNote').textContent=executed?executionRecord.note:'—';
  $('#printExecDisable').textContent=executed&&executionRecord.disable?executionRecord.disable:'—';
  $('#printExecutor').textContent=executed?executionRecord.executor:'—';
}
window.addEventListener('beforeprint',buildPrintView);

