const q=new URLSearchParams(location.search),mode=q.get('mode')||'new',sel=document.querySelector('#mode');sel.value=mode;const modes={new:{title:'新增採購請購單（尚未產生單號）',status:'草稿',no:'尚未產生',date:'送出簽核後由系統回寫'},edit:{title:'編輯採購請購單（CBS-FPU-2026-00105）',status:'草稿',no:'CBS-FPU-2026-00105',date:'2026/09/18'},view:{title:'查看採購請購單（CBS-FPU-2026-00102）',status:'簽核中',no:'CBS-FPU-2026-00102',date:'2026/09/16'},approve:{title:'簽核採購請購單（CBS-FPU-2026-00102）',status:'簽核中',no:'CBS-FPU-2026-00102',date:'2026/09/16'},approveUnit:{title:'簽核採購請購單（CBS-FPU-2026-00102）',status:'簽核中',no:'CBS-FPU-2026-00102',date:'2026/09/16'}};
function updateRouteForMode(m){const s3=document.querySelector('#stage3'),s4=document.querySelector('#stage4'),s5=document.querySelector('#stage5');if(!s3||!s4||!s5)return;if(m==='approveUnit'){s3.className='approval-stage approved';s3.querySelector('.stage-status').className='stage-status approved';s3.querySelector('.stage-status').textContent='已核准';s3.querySelector('.stage-person').textContent='簽核者：陳志明 (A008)';s3.querySelector('time').textContent='簽核日期：2026/09/19 09:10';s4.className='approval-stage approved';s4.querySelector('.stage-status').className='stage-status approved';s4.querySelector('.stage-status').textContent='已核准';s4.querySelector('.stage-person').textContent='簽核者：游明哲 (G001)';s4.querySelector('time').textContent='簽核日期：2026/09/19 14:20';s5.className='approval-stage pending';s5.querySelector('.stage-status').className='stage-status pending';s5.querySelector('.stage-status').textContent='待簽核';s5.querySelector('.stage-person').textContent='待簽核者：蔡明宏 (P015)'}else{s3.className='approval-stage pending';s3.querySelector('.stage-status').className='stage-status pending';s3.querySelector('.stage-status').textContent='待簽核';s3.querySelector('.stage-person').textContent='待簽核者：陳志明 (A008)';s3.querySelector('time').textContent='簽核日期：—';s4.className='approval-stage pending';s4.querySelector('.stage-status').className='stage-status pending';s4.querySelector('.stage-status').textContent='待前序完成';s4.querySelector('.stage-person').textContent='';s4.querySelector('time').textContent='簽核日期：—';s5.className='approval-stage pending';s5.querySelector('.stage-status').className='stage-status pending';s5.querySelector('.stage-status').textContent='待前序完成';s5.querySelector('.stage-person').textContent='依表單所選採購單位'}}
function setMode(m){const d=modes[m];document.querySelector('#pageTitle').textContent=d.title;document.querySelector('#applyDate').textContent='申請日期：'+d.date;['newActions','editActions','approveActions','viewActions'].forEach(id=>document.querySelector('#'+id).hidden=true);document.querySelector('#'+(m==='new'?'newActions':m==='edit'?'editActions':(m==='approve'||m==='approveUnit')?'approveActions':'viewActions')).hidden=false;const returnCurrentBtn=document.querySelector('#returnCurrentBtn');if(returnCurrentBtn)returnCurrentBtn.hidden=m!=='approveUnit';document.querySelector('#routePanel').hidden=m==='new';document.querySelector('#opinionPanel').hidden=!(m==='view'||m==='approve'||m==='approveUnit');updateRouteForMode(m);const locked=m==='view'||m==='approve'||m==='approveUnit';document.querySelectorAll('.content-main input,.content-main select,.content-main textarea').forEach(x=>x.disabled=locked);document.querySelectorAll('.content-main .mini,.content-main .upload-btn,.content-main .link-button,.content-main .file-remove').forEach(x=>x.hidden=locked);document.body.classList.toggle('readonly',locked);const descEditor=document.getElementById('description');if(descEditor)descEditor.contentEditable=String(!locked);const descToolbar=document.querySelector('.editor-toolbar');if(descToolbar)descToolbar.hidden=locked}
setMode(mode);sel.onchange=e=>{location.search='?mode='+e.target.value};document.querySelector('#routeToggle').onclick=e=>{const b=document.querySelector('#routeBody');const opening=b.classList.contains('route-collapsed');b.classList.toggle('route-collapsed');e.target.textContent=opening?'收合':'查看'};document.querySelector('#otherPurpose').onchange=e=>document.querySelector('#otherPurposeText').hidden=!e.target.checked;
document.addEventListener('click',event=>{const command=event.target.closest('[data-command]');if(!command)return;let value=null;if(command.dataset.command==='createLink')value=prompt('請輸入連結網址');if(command.dataset.command!=='createLink'||value)document.execCommand(command.dataset.command,false,value);document.getElementById('description').focus()});
document.getElementById('editorSize').onchange=event=>{document.execCommand('fontSize',false,event.target.value);document.getElementById('description').focus()};
document.getElementById('editorColor').oninput=event=>{document.execCommand('foreColor',false,event.target.value);document.getElementById('description').focus()};
const procureUnit=document.querySelector('#procureUnit'),procureUnitManager=document.querySelector('#procureUnitManager'),unitManagers={'後勤支援部／人事總務課':'羅弘奕 (B019)','代標代購事業本部／代購部':'蔡明宏 (P015)'};function updateUnitManager(){if(!procureUnit||!procureUnitManager)return;procureUnitManager.textContent='單位主管：'+(unitManagers[procureUnit.value]||'待補齊組織資料')}if(procureUnit){procureUnit.onchange=updateUnitManager;updateUnitManager()}
const quoteTotal=document.querySelector('#quoteTotal'),quoteApprovalHint=document.querySelector('#quoteApprovalHint');function updateQuoteHint(){if(!quoteTotal||!quoteApprovalHint)return;const amount=Number(quoteTotal.value.replaceAll(',','')||0);quoteApprovalHint.classList.add('require-approval');quoteApprovalHint.textContent=amount>100000?'目前金額需依序經副總經理、總經理批示。':'目前金額需依序經副總經理批示。'}function formatQuoteTotal(value){
  const clean=value.replace(/[^\d.]/g,'');
  const dot=clean.indexOf('.');
  const whole=(dot<0?clean:clean.slice(0,dot)).replace(/^0+(?=\d)/,'');
  const fraction=dot<0?'':clean.slice(dot+1).replace(/\./g,'').slice(0,2);
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g,',')+(dot>=0?'.'+fraction:'');
}
if(quoteTotal){
  quoteTotal.value=formatQuoteTotal(quoteTotal.value);
  quoteTotal.addEventListener('input',()=>{
    const cursor=quoteTotal.selectionStart;
    const before=quoteTotal.value.slice(0,cursor).replace(/,/g,'').length;
    const formatted=formatQuoteTotal(quoteTotal.value);
    quoteTotal.value=formatted;
    let position=0,seen=0;
    while(position<formatted.length&&seen<before){if(formatted[position]!==',')seen++;position++}
    quoteTotal.setSelectionRange(position,position);
    updateQuoteHint();
  });
  updateQuoteHint();
}
const modal=document.querySelector('#decisionModal'),title=document.querySelector('#decisionTitle'),confirm=document.querySelector('#decisionConfirm'),error=document.querySelector('#decisionError'),opinion=document.querySelector('#decisionOpinion');document.querySelectorAll('[data-decision]').forEach(b=>b.onclick=()=>{const type=b.dataset.decision,isApprove=type==='approve';modal.hidden=false;modal.dataset.type=type;title.textContent=isApprove?'核准並批示':type==='current'?'退回補正（僅本關重審）':'退回原因';confirm.textContent=isApprove?'確認核准':'確認退回';confirm.className='btn '+(isApprove?'approve':'reject');opinion.placeholder=isApprove?'可填寫批示意見（選填）':'請填寫退回原因（必填）';error.hidden=true;opinion.value=''});document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>modal.hidden=true);confirm.onclick=()=>{if(modal.dataset.type!=='approve'&&!opinion.value.trim()){error.hidden=false;return}modal.hidden=true;alert('Demo：操作已確認')};


function purchaseCellValue(cell){
  const field=cell.querySelector('input,textarea,select');
  return field?(field.tagName==='SELECT'?field.selectedOptions[0]?.textContent:field.value).trim():cell.textContent.trim();
}
function purchaseRows(tableSelector,columnCount){
  return [...document.querySelectorAll(tableSelector+' tbody tr')].map((row,index)=>{
    const values=[...row.children].slice(0,columnCount).map(purchaseCellValue);
    values[0]=String(index+1);
    if(tableSelector==='.quote-table'){[2,3].forEach(column=>{if(values[column])values[column]='NT$ '+values[column].replace(/^NT\$\s*/,'')})}
    return '<tr>'+values.map(value=>'<td>'+value+'</td>').join('')+'</tr>';
  }).join('');
}
function purchaseStageInfo(stage){
  return {
    level:(stage.querySelector('.stage-title')?.childNodes[0]?.textContent||'').replace(/^[①-⑩]\s*/,'').trim(),
    signer:(stage.querySelector('.stage-person')?.textContent||'—').replace(/^(簽核者|待簽核者)：/,'').trim()||'—',
    status:stage.querySelector('.stage-status')?.textContent.trim()||'—',
    date:(stage.querySelector('time')?.textContent||'—').replace(/^簽核日期：/,'').trim()
  };
}
function purchaseOpinion(level){
  const item=[...document.querySelectorAll('#opinionPanel article')].find(article=>article.querySelector('b')?.textContent.trim()===level);
  return item?.querySelector('p')?.textContent.trim()||'—';
}
function buildPurchasePrintView(){
  const current=modes[sel.value]||modes.new;
  document.getElementById('printCompany').textContent=document.getElementById('company').selectedOptions[0].textContent;
  document.getElementById('printDocNo').textContent=current.no;
  document.getElementById('printApplicant').textContent=document.getElementById('applicant').selectedOptions[0].textContent;
  document.getElementById('printApplicantUnit').textContent=document.getElementById('applicantUnit').textContent.trim();
  document.getElementById('printApplyDate').textContent=current.date;
  document.getElementById('printNeedDate').textContent=document.getElementById('needDate').value||'—';
  document.getElementById('printProcureUnit').textContent=document.getElementById('procureUnit').selectedOptions[0].textContent;
  document.getElementById('printPurpose').textContent=[...document.querySelectorAll('.purpose input[type="checkbox"]:checked')].map(x=>x.parentElement.textContent.trim()).join('、')||'—';
  document.getElementById('printProductRows').innerHTML=purchaseRows('.detail-table:not(.quote-table)',5)||'<tr><td colspan="5">無資料</td></tr>';
  document.getElementById('printQuoteRows').innerHTML=purchaseRows('.quote-table',5)||'<tr><td colspan="5">無資料</td></tr>';
  const description=document.getElementById('description');
  document.getElementById('printVendorDescription').innerHTML=description.innerHTML.trim()||'—';
  const quoteAmount=Number(document.getElementById('quoteTotal').value.replaceAll(',',''));
  document.getElementById('printQuoteTotal').textContent=Number.isFinite(quoteAmount)&&quoteAmount>0?'NT$ '+quoteAmount.toLocaleString('zh-TW'):'—';
  const attachments=[...document.querySelectorAll('.quote-attachment .file-card')].filter(file=>!file.hidden);
  document.getElementById('printQuoteAttachments').textContent=`已付 ${attachments.length} 份`;
  const stages=[...document.querySelectorAll('.approval-stage')].map(purchaseStageInfo);
  document.getElementById('printApprovalRows').innerHTML=stages.map(row=>'<tr><td>'+row.level+'</td><td>'+row.signer+'</td><td>'+row.status+'</td><td>'+row.date+'</td><td>'+purchaseOpinion(row.level)+'</td></tr>').join('')||'<tr><td colspan="5">尚未送出簽核</td></tr>';
}
window.addEventListener('beforeprint',buildPurchasePrintView);
