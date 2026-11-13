const q=new URLSearchParams(location.search),mode=q.get('mode')||'new',sel=document.querySelector('#mode');sel.value=mode;const modes={new:{title:'新增採購請購單（尚未產生單號）',status:'草稿',no:'尚未產生',date:'送出簽核後由系統回寫'},edit:{title:'編輯採購請購單（CBS-FPU-2026-00105）',status:'草稿',no:'CBS-FPU-2026-00105',date:'2026/09/18'},view:{title:'查看採購請購單（CBS-FPU-2026-00102）',status:'簽核中',no:'CBS-FPU-2026-00102',date:'2026/09/16'},approve:{title:'簽核採購請購單（CBS-FPU-2026-00102）',status:'簽核中',no:'CBS-FPU-2026-00102',date:'2026/09/16'},approveUnit:{title:'簽核採購請購單（CBS-FPU-2026-00102）',status:'簽核中',no:'CBS-FPU-2026-00102',date:'2026/09/16'},execute:{title:'執行回報採購請購單（CBS-FPU-2026-00110）',status:'已核准',no:'CBS-FPU-2026-00110',date:'2026/09/20'},done:{title:'執行完成採購請購單（CBS-FPU-2026-00098）',status:'已核准',no:'CBS-FPU-2026-00098',date:'2026/09/12'},unable:{title:'查看採購請購單（CBS-FPU-2026-00104，不予採購）',status:'已核准',no:'CBS-FPU-2026-00104',date:'2026/09/14'}};
function updateRouteForMode(m){const s3=document.querySelector('#stage3'),s4=document.querySelector('#stage4'),s5=document.querySelector('#stage5');if(!s3||!s4||!s5)return;if(m==='execute'||m==='done'||m==='unable'){const ap=(el,person,time)=>{el.className='approval-stage approved';el.querySelector('.stage-status').className='stage-status approved';el.querySelector('.stage-status').textContent='已核准';el.querySelector('.stage-person').textContent='簽核者：'+person;el.querySelector('time').textContent='簽核日期：'+time};ap(s3,'陳志明 (A008)','2026/09/19 09:10');ap(s4,'游明哲 (G001)','2026/09/19 14:20');ap(s5,'蔡明宏 (P015)','2026/09/20 10:05');return}if(m==='approveUnit'){s3.className='approval-stage approved';s3.querySelector('.stage-status').className='stage-status approved';s3.querySelector('.stage-status').textContent='已核准';s3.querySelector('.stage-person').textContent='簽核者：陳志明 (A008)';s3.querySelector('time').textContent='簽核日期：2026/09/19 09:10';s4.className='approval-stage approved';s4.querySelector('.stage-status').className='stage-status approved';s4.querySelector('.stage-status').textContent='已核准';s4.querySelector('.stage-person').textContent='簽核者：游明哲 (G001)';s4.querySelector('time').textContent='簽核日期：2026/09/19 14:20';s5.className='approval-stage pending';s5.querySelector('.stage-status').className='stage-status pending';s5.querySelector('.stage-status').textContent='待簽核';s5.querySelector('.stage-person').textContent='待簽核者：蔡明宏 (P015)'}else{s3.className='approval-stage pending';s3.querySelector('.stage-status').className='stage-status pending';s3.querySelector('.stage-status').textContent='待簽核';s3.querySelector('.stage-person').textContent='待簽核者：陳志明 (A008)';s3.querySelector('time').textContent='簽核日期：—';s4.className='approval-stage pending';s4.querySelector('.stage-status').className='stage-status pending';s4.querySelector('.stage-status').textContent='待前序完成';s4.querySelector('.stage-person').textContent='';s4.querySelector('time').textContent='簽核日期：—';s5.className='approval-stage pending';s5.querySelector('.stage-status').className='stage-status pending';s5.querySelector('.stage-status').textContent='待前序完成';s5.querySelector('.stage-person').textContent='依表單所選採購單位'}}
function setMode(m){const d=modes[m];document.querySelector('#pageTitle').textContent=d.title;document.querySelector('#applyDate').textContent='申請日期：'+d.date;['newActions','editActions','approveActions','executeActions','viewActions'].forEach(id=>document.querySelector('#'+id).hidden=true);document.querySelector('#'+(m==='new'?'newActions':m==='edit'?'editActions':(m==='approve'||m==='approveUnit')?'approveActions':m==='execute'?'executeActions':'viewActions')).hidden=false;document.querySelector('#executionPanel').hidden=m!=='done';document.querySelector('#unablePanel').hidden=m!=='unable';const returnCurrentBtn=document.querySelector('#returnCurrentBtn');if(returnCurrentBtn)returnCurrentBtn.hidden=m!=='approveUnit';document.querySelector('#routePanel').hidden=m==='new';document.querySelector('#opinionPanel').hidden=!(m==='view'||m==='approve'||m==='approveUnit'||m==='execute'||m==='done'||m==='unable');updateRouteForMode(m);const locked=m==='view'||m==='approve'||m==='approveUnit'||m==='execute'||m==='done'||m==='unable';document.querySelectorAll('.content-main input,.content-main select,.content-main textarea').forEach(x=>x.disabled=locked);document.querySelectorAll('.content-main .mini,.content-main .upload-btn,.content-main .link-button:not(#editExecution),.content-main .file-remove').forEach(x=>x.hidden=locked);document.body.classList.toggle('readonly',locked);}
setMode(mode);sel.onchange=e=>{location.search='?mode='+e.target.value};document.querySelector('#routeToggle').onclick=e=>{const b=document.querySelector('#routeBody');const opening=b.classList.contains('route-collapsed');b.classList.toggle('route-collapsed');e.target.textContent=opening?'收合':'查看'};document.querySelector('#otherPurpose').onchange=e=>document.querySelector('#otherPurposeText').hidden=!e.target.checked;
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
const UNIT_MEMBERS={'後勤支援部／人事總務課':['陳庭瑋 (T037)','林家筠 (T038)','羅弘奕 (B019)'],'代標代購事業本部／代購部':['蔡明宏 (P015)','李佩珊 (T046)']};
function fillBuyerOptions(){const u=document.querySelector('#procureUnit').value,list=UNIT_MEMBERS[u]||[];document.querySelector('#buyerList').innerHTML=list.map(n=>'<option value="'+n+'">').join('');document.querySelector('#buyerNote').textContent='僅可選擇採購單位「'+u+'」（含下層單位）的員工，不需另外設定權限；被指定者會收到「等待採購」通知，並於「執行管理」回填執行紀錄。'}
const buyerBox=document.querySelector('#buyerPick'),buyerSelect=document.querySelector('#buyerSelect'),modal=document.querySelector('#decisionModal'),title=document.querySelector('#decisionTitle'),confirm=document.querySelector('#decisionConfirm'),error=document.querySelector('#decisionError'),opinion=document.querySelector('#decisionOpinion');document.querySelectorAll('[data-decision]').forEach(b=>b.onclick=()=>{const type=b.dataset.decision,isApprove=type==='approve';modal.hidden=false;modal.dataset.type=type;title.textContent=isApprove?'核准並批示':type==='current'?'退回（非負責採購單位）':'退回原因';const hint=document.querySelector('#decisionHint');hint.hidden=type!=='current';hint.textContent=type==='current'?'此單據的採購單位並非由您負責。退回後，申請人須修正採購單位；修正並重新送出後，單據將直接回到新選擇的採購單位主管審核，已核准的主管關卡不會重跑。':'';confirm.textContent=isApprove?'確認核准':'確認退回';confirm.className='btn '+(isApprove?'approve':'reject');opinion.placeholder=isApprove?'可填寫批示意見':type==='current'?'請說明退回原因，例如建議的負責採購單位（必填）':'請填寫退回原因（必填）';error.hidden=true;error.textContent='請填寫退回原因。';opinion.value='';buyerBox.hidden=!(isApprove&&sel.value==='approveUnit');buyerSelect.value='';fillBuyerOptions()});document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>modal.hidden=true);confirm.onclick=()=>{const needBuyer=modal.dataset.type==='approve'&&sel.value==='approveUnit';if(needBuyer&&![...document.querySelectorAll('#buyerList option')].some(o=>o.value===buyerSelect.value.trim())){error.textContent='請從採購單位「'+document.querySelector('#procureUnit').value+'」的員工中選擇指定採購人員。';error.hidden=false;return}if(modal.dataset.type!=='approve'&&!opinion.value.trim()){error.textContent='請填寫退回原因。';error.hidden=false;return}modal.hidden=true;alert('Demo：操作已確認'+(needBuyer?'（已核准，指定採購人員：'+buyerSelect.value.trim()+'）':''))};


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
  document.getElementById('printReason').textContent=document.getElementById('applyReason').value.trim()||'—';
  document.getElementById('printPurpose').textContent=[...document.querySelectorAll('.purpose input[type="checkbox"]:checked')].map(x=>x.parentElement.textContent.trim()).join('、')||'—';
  document.getElementById('printProductRows').innerHTML=purchaseRows('.detail-table:not(.quote-table)',6)||'<tr><td colspan="6">無資料</td></tr>';
  const isDone=sel.value==='done';document.getElementById('printExecTable').hidden=!isDone;
  if(isDone){const g=id=>document.getElementById(id).textContent;document.getElementById('printBuyDate').textContent=g('viewBuyDate');document.getElementById('printBuyer').textContent=g('viewBuyer');document.getElementById('printBuyAmount').textContent=g('viewBuyAmount');document.getElementById('printBuyVendor').textContent=g('viewBuyVendor');document.getElementById('printBuyInquiry').innerHTML=BUY.inquiries.length?'<table class="print-table print-inner"><thead><tr><th>項次</th><th>廠商</th><th>單價</th><th>金額</th><th>詢價過程</th></tr></thead><tbody>'+inquiryRowsHtml(BUY.inquiries)+'</tbody></table>':'—';document.getElementById('printBuyNote').textContent=g('viewBuyNote');document.getElementById('printBuyBy').textContent=g('viewBuyBy');document.getElementById('printBuyAt').textContent=g('viewBuyAt')}
  const isUnable=sel.value==='unable';document.getElementById('printUnableTable').hidden=!isUnable;
  if(isUnable){const g=id=>document.getElementById(id).textContent;document.getElementById('printUnableReason').textContent=g('viewUnableReason');document.getElementById('printUnableBuyer').textContent=g('viewUnableBuyer');document.getElementById('printUnableBy').textContent=g('viewUnableBy');document.getElementById('printUnableAt').textContent=g('viewUnableAt')}
  const description=document.getElementById('description');
  document.getElementById('printVendorDescription').textContent=description.value.trim()||'—';
  const quoteAmount=Number(document.getElementById('quoteTotal').value.replaceAll(',',''));
  document.getElementById('printQuoteTotal').textContent=Number.isFinite(quoteAmount)&&quoteAmount>0?'NT$ '+quoteAmount.toLocaleString('zh-TW'):'—';
  const attachments=[...document.querySelectorAll('.quote-attachment .file-card')].filter(file=>!file.hidden);
  document.getElementById('printQuoteAttachments').textContent=`已付 ${attachments.length} 份`;
  const stages=[...document.querySelectorAll('.approval-stage')].map(purchaseStageInfo);
  document.getElementById('printApprovalRows').innerHTML=stages.map(row=>'<tr><td>'+row.level+'</td><td>'+row.signer+'</td><td>'+row.status+'</td><td>'+row.date+'</td><td>'+purchaseOpinion(row.level)+'</td></tr>').join('')||'<tr><td colspan="5">尚未送出簽核</td></tr>';
}
window.addEventListener('beforeprint',buildPurchasePrintView);

// ===== 執行管理：回填執行紀錄（採購人員） =====
const DESIGNATED='陳庭瑋 (T037)';
const BUY={log:[],date:'2026-09-19',amount:'103,000',vendor:'聯強國際股份有限公司',inquiries:[{vendor:'聯強國際股份有限公司',price:'35,000',amount:'105,000',note:'含稅報價，含三年保固。'},{vendor:'博客來企業購',price:'36,167',amount:'108,500',note:'交期 7 天，無議價空間。'},{vendor:'聯強國際股份有限公司',price:'34,333',amount:'103,000',note:'議價後成交價。'}],note:'含三年保固，預計 9/25 到貨。',by:'陳庭瑋 (T037)',at:'2026/09/19 16:40'};
const execModal=document.getElementById('executionModal'),execError=document.getElementById('execError'),buyAmountInput=document.getElementById('buyAmount');
const slashDate=v=>v?v.replace(/-/g,'/'):'—';
const esc=v=>String(v||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const money=v=>v?'NT$ '+esc(v):'—';
function inquiryRowsHtml(list){return list.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r.vendor)||'—'}</td><td>${money(r.price)}</td><td>${money(r.amount)}</td><td style="white-space:pre-wrap">${esc(r.note)||'—'}</td></tr>`).join('')}
const inquiryRows=document.getElementById('inquiryRows');
function inquiryRowEl(r={}){const tr=document.createElement('tr');tr.innerHTML=`<td class="iq-no"></td><td data-label="廠商"><input class="control iq-vendor" type="text" placeholder="廠商名稱" value="${esc(r.vendor)}"></td><td data-label="單價"><div class="currency-field"><span>NT$</span><input class="control iq-price" type="text" inputmode="decimal" value="${esc(r.price)}" aria-label="單價（新台幣）"></div></td><td data-label="金額"><div class="currency-field"><span>NT$</span><input class="control iq-amount" type="text" inputmode="decimal" value="${esc(r.amount)}" aria-label="金額（新台幣）"></div></td><td data-label="詢價過程"><input class="control iq-note" type="text" placeholder="詢價日期、條件、保固或議價資訊" value="${esc(r.note)}"></td><td data-label="刪除"><button class="mini" type="button" data-iq-del>刪除</button></td>`;return tr}
function renumberInquiry(){[...inquiryRows.children].forEach((tr,i)=>tr.querySelector('.iq-no').textContent=i+1)}
function readInquiries(){return [...inquiryRows.children].map(tr=>({vendor:tr.querySelector('.iq-vendor').value.trim(),price:tr.querySelector('.iq-price').value.trim(),amount:tr.querySelector('.iq-amount').value.trim(),note:tr.querySelector('.iq-note').value.trim()})).filter(r=>r.vendor||r.price||r.amount||r.note)}
document.getElementById('addInquiry').onclick=()=>{inquiryRows.appendChild(inquiryRowEl());renumberInquiry()};
inquiryRows.addEventListener('click',e=>{if(e.target.matches('[data-iq-del]')){e.target.closest('tr').remove();if(!inquiryRows.children.length)inquiryRows.appendChild(inquiryRowEl());renumberInquiry()}});
inquiryRows.addEventListener('input',e=>{if(e.target.matches('.iq-price,.iq-amount'))e.target.value=formatQuoteTotal(e.target.value)});
function renderExecutionRecord(){
  const set=(id,v)=>document.getElementById(id).textContent=v||'—';
  set('viewBuyDate',slashDate(BUY.date));set('viewBuyAmount',BUY.amount?'NT$ '+BUY.amount:'');set('viewBuyVendor',BUY.vendor);document.getElementById('viewInquiryRows').innerHTML=inquiryRowsHtml(BUY.inquiries);document.getElementById('viewInquiryTable').hidden=!BUY.inquiries.length;document.getElementById('viewInquiryEmpty').hidden=BUY.inquiries.length>0;set('viewBuyNote',BUY.note);set('viewBuyer',DESIGNATED);set('viewBuyBy',BUY.by);set('viewBuyAt',BUY.at);document.getElementById('viewLogWrap').hidden=!BUY.log.length;document.getElementById('viewLog').innerHTML=BUY.log.map(l=>'<li>'+esc(l.at)+'　'+esc(l.by)+'：'+esc(l.items.join('；'))+'</li>').join('');
}
const execWarn=document.getElementById('execWarn'),execConfirmBtn=document.getElementById('execConfirm');let overAsked=false;
function todayStr(){const d=new Date(),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`}
function resetOverWarn(){overAsked=false;execWarn.hidden=true;execConfirmBtn.textContent='確認採購完成'}
function openExecutionModal(){
  document.getElementById('buyDate').max=todayStr();document.getElementById('buyDate').value=BUY.date||'';buyAmountInput.value=BUY.amount||'';document.getElementById('buyVendor').value=BUY.vendor||'';inquiryRows.innerHTML='';(BUY.inquiries.length?BUY.inquiries:[{}]).forEach(r=>inquiryRows.appendChild(inquiryRowEl(r)));renumberInquiry();document.getElementById('buyNote').value=BUY.note||'';
  document.getElementById('execRefBuyer').textContent=DESIGNATED;document.getElementById('execRefAmount').textContent='NT$ '+(document.getElementById('quoteTotal').value.trim()||'—');resetOverWarn();execError.hidden=true;execModal.hidden=false;
}
if(mode==='done')renderExecutionRecord();
if(mode==='execute'){BUY.date=BUY.amount=BUY.vendor=BUY.note='';BUY.inquiries=[]}
document.getElementById('executeBtn').onclick=openExecutionModal;
document.getElementById('editExecution').onclick=openExecutionModal;
buyAmountInput.addEventListener('input',()=>{buyAmountInput.value=formatQuoteTotal(buyAmountInput.value);resetOverWarn()});
document.querySelectorAll('[data-exec-close]').forEach(b=>b.onclick=()=>execModal.hidden=true);
document.getElementById('execConfirm').onclick=()=>{
  const date=document.getElementById('buyDate').value,amount=buyAmountInput.value.trim(),vendor=document.getElementById('buyVendor').value.trim();
  const amountNumber=Number(amount.replaceAll(',',''));
  const message=!date?'請填寫實際購買日期。':date>todayStr()?'實際購買日期不可為未來日期。':!amount||!(amountNumber>0)?'請填寫實際購買金額。':!vendor?'請填寫實際購買廠商。':'';
  const inquiries=readInquiries(),badIq=inquiries.some(r=>[r.price,r.amount].some(v=>v&&!(Number(v.replaceAll(',',''))>0)));
  const message2=message||(badIq?'詢價的單價、金額如有填寫，須為大於 0 的數字。':'');
  if(message2){execError.textContent=message2;execError.hidden=false;return}
  const quoteNumber=Number(document.getElementById('quoteTotal').value.replaceAll(',',''));
  if(quoteNumber>0&&amountNumber>quoteNumber&&!overAsked){overAsked=true;execWarn.textContent='實際購買金額 NT$ '+amount+' 高於預計採購金額(含稅) NT$ '+document.getElementById('quoteTotal').value.trim()+'，請確認是否仍要送出？確認無誤請再按「仍要送出」，如需修正請直接修改金額。';execWarn.hidden=false;execConfirmBtn.textContent='仍要送出';return}
  const now=new Date(),pad=n=>String(n).padStart(2,'0');
  const prev={date:BUY.date,amount:BUY.amount,vendor:BUY.vendor,note:BUY.note,inq:JSON.stringify(BUY.inquiries)},newNote=document.getElementById('buyNote').value.trim(),stamp=`${now.getFullYear()}/${pad(now.getMonth()+1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  if(sel.value==='done'){const items=[];if(prev.date!==date)items.push('實際購買日期 '+slashDate(prev.date)+' → '+slashDate(date));if(prev.amount!==amount)items.push('實際購買金額 NT$ '+prev.amount+' → NT$ '+amount);if(prev.vendor!==vendor)items.push('實際購買廠商 '+prev.vendor+' → '+vendor);if(prev.note!==newNote)items.push('備註已修改');if(prev.inq!==JSON.stringify(inquiries))items.push('詢價過程已修改');if(items.length)BUY.log.push({at:stamp,by:DESIGNATED,items})}
  Object.assign(BUY,{date,amount,vendor,inquiries,note:document.getElementById('buyNote').value.trim(),by:'陳庭瑋 (T037)',at:`${now.getFullYear()}/${pad(now.getMonth()+1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`});
  renderExecutionRecord();resetOverWarn();execModal.hidden=true;
  if(sel.value!=='done'){sel.value='done';history.replaceState(null,'','?mode=done');setMode('done')}
};

// ===== 執行管理：不予採購（終結狀態） =====
const UNABLE={reason:'廠商回覆原指定機型已停產，替代機型報價高出預計採購金額約 40%，無法在預算內採購。如仍有需求，請重新評估規格與預算後另行填單。',by:'陳庭瑋 (T037)',at:'2026/09/16 11:20'};
const unableModal=document.getElementById('unableModal'),unableReason=document.getElementById('unableReason'),unableError=document.getElementById('unableError'),unableCount=document.getElementById('unableCount');
function renderUnableRecord(){const set=(id,v)=>document.getElementById(id).textContent=v||'—';set('viewUnableReason',UNABLE.reason);set('viewUnableBuyer',DESIGNATED);set('viewUnableBy',UNABLE.by);set('viewUnableAt',UNABLE.at)}
if(mode==='unable')renderUnableRecord();
document.getElementById('unableBtn').onclick=()=>{unableReason.value='';unableCount.textContent='0';unableError.hidden=true;unableModal.hidden=false};
unableReason.addEventListener('input',()=>{unableCount.textContent=unableReason.value.length;unableError.hidden=true});
document.querySelectorAll('[data-unable-close]').forEach(b=>b.onclick=()=>unableModal.hidden=true);
document.getElementById('unableConfirm').onclick=()=>{
  const reason=unableReason.value.trim();
  if(!reason){unableError.textContent='請填寫不予採購原因。';unableError.hidden=false;return}
  const now=new Date(),pad=n=>String(n).padStart(2,'0');
  Object.assign(UNABLE,{reason,by:DESIGNATED,at:`${now.getFullYear()}/${pad(now.getMonth()+1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`});
  renderUnableRecord();unableModal.hidden=true;
  alert('Demo：此單據已結案為「不予採購」，並通知申請人。如仍需採購，請重新填寫新的採購請購單。');
  sel.value='unable';history.replaceState(null,'','?mode=unable');setMode('unable')
};
