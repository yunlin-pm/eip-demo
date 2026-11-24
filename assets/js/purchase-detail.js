const q=new URLSearchParams(location.search),mode=q.get('mode')||'new',sel=document.querySelector('#mode');sel.value=mode;const modes={new:{title:'新增採購請購單（尚未產生單號）',status:'草稿',no:'尚未產生',date:'送出簽核後由系統回寫'},edit:{title:'編輯採購請購單（CBS-FPU-2026-00105）',status:'草稿',no:'CBS-FPU-2026-00105',date:'2026/09/18'},view:{title:'查看採購請購單（CBS-FPU-2026-00102）',status:'簽核中',no:'CBS-FPU-2026-00102',date:'2026/09/16'},approve:{title:'簽核採購請購單（CBS-FPU-2026-00102）',status:'簽核中',no:'CBS-FPU-2026-00102',date:'2026/09/16'},approveUnit:{title:'簽核採購請購單（CBS-FPU-2026-00102）',status:'簽核中',no:'CBS-FPU-2026-00102',date:'2026/09/16'},execute:{title:'執行回報採購請購單（CBS-FPU-2026-00110）',status:'已核准',no:'CBS-FPU-2026-00110',date:'2026/09/20'},done:{title:'執行完成採購請購單（CBS-FPU-2026-00098）',status:'已核准',no:'CBS-FPU-2026-00098',date:'2026/09/12'},unable:{title:'查看採購請購單（CBS-FPU-2026-00104，不予採購）',status:'已核准',no:'CBS-FPU-2026-00104',date:'2026/09/14'},editReturned:{title:'編輯採購請購單（CBS-FPU-2026-00099）',status:'已退回',no:'CBS-FPU-2026-00099',date:'2026/09/09'},execView:{title:'查看採購請購單（CBS-FPU-2026-00112）',status:'已核准',no:'CBS-FPU-2026-00112',date:'2026/09/17'},execManager:{title:'採購請購單（CBS-FPU-2026-00110）',status:'已核准',no:'CBS-FPU-2026-00110',date:'2026/09/15'},viewOwn:{title:'查看採購請購單（CBS-FPU-2026-00101）',status:'簽核中',no:'CBS-FPU-2026-00101',date:'2026/09/14'},voided:{title:'查看採購請購單（CBS-FPU-2026-00093）',status:'已作廢',no:'CBS-FPU-2026-00093',date:'2026/09/05'}};
function updateRouteForMode(m){const s3=document.querySelector('#stage3'),s4=document.querySelector('#stage4'),s5=document.querySelector('#stage5');if(!s3||!s4||!s5)return;if(m==='execute'||m==='done'||m==='unable'||m==='execView'||m==='execManager'){const ap=(el,person,time)=>{el.className='approval-stage approved';el.querySelector('.stage-status').className='stage-status approved';el.querySelector('.stage-status').textContent='已核准';el.querySelector('.stage-person').textContent='簽核者：'+person;el.querySelector('time').textContent='簽核日期：'+time};ap(s3,'陳志明 (A008)','2026/09/19 09:10');ap(s4,'游明哲 (G001)','2026/09/19 14:20');ap(s5,'蔡明宏 (P015)','2026/09/20 10:05');return}if(m==='approveUnit'){s3.className='approval-stage approved';s3.querySelector('.stage-status').className='stage-status approved';s3.querySelector('.stage-status').textContent='已核准';s3.querySelector('.stage-person').textContent='簽核者：陳志明 (A008)';s3.querySelector('time').textContent='簽核日期：2026/09/19 09:10';s4.className='approval-stage approved';s4.querySelector('.stage-status').className='stage-status approved';s4.querySelector('.stage-status').textContent='已核准';s4.querySelector('.stage-person').textContent='簽核者：游明哲 (G001)';s4.querySelector('time').textContent='簽核日期：2026/09/19 14:20';s5.className='approval-stage pending';s5.querySelector('.stage-status').className='stage-status pending';s5.querySelector('.stage-status').textContent='待簽核';s5.querySelector('.stage-person').textContent='待簽核者：蔡明宏 (P015)'}else{s3.className='approval-stage pending';s3.querySelector('.stage-status').className='stage-status pending';s3.querySelector('.stage-status').textContent='待簽核';s3.querySelector('.stage-person').textContent='待簽核者：陳志明 (A008)';s3.querySelector('time').textContent='簽核日期：—';s4.className='approval-stage pending';s4.querySelector('.stage-status').className='stage-status pending';s4.querySelector('.stage-status').textContent='待前序完成';s4.querySelector('.stage-person').textContent='';s4.querySelector('time').textContent='簽核日期：—';s5.className='approval-stage pending';s5.querySelector('.stage-status').className='stage-status pending';s5.querySelector('.stage-status').textContent='待前序完成';s5.querySelector('.stage-person').textContent='依表單所選採購單位'}}
function setMode(m){const d=modes[m];document.querySelector('#pageTitle').textContent=d.title;document.querySelector('#applyDate').textContent='申請日期：'+d.date;['newActions','editActions','approveActions','executeActions','viewActions'].forEach(id=>document.querySelector('#'+id).hidden=true);document.querySelector('#'+(m==='new'?'newActions':(m==='edit'||m==='editReturned')?'editActions':(m==='approve'||m==='approveUnit')?'approveActions':m==='execute'?'executeActions':'viewActions')).hidden=false;document.querySelector('#executionPanel').hidden=m!=='done';const ra=document.querySelector('#returnAlert');if(ra)ra.hidden=m!=='editReturned';document.querySelector('#unablePanel').hidden=m!=='unable';const returnCurrentBtn=document.querySelector('#returnCurrentBtn');if(returnCurrentBtn)returnCurrentBtn.hidden=m!=='approveUnit';document.querySelector('#routePanel').hidden=m==='new';document.querySelector('#opinionPanel').hidden=!(m==='view'||m==='viewOwn'||m==='voided'||m==='execView'||m==='execManager'||m==='approve'||m==='approveUnit'||m==='execute'||m==='done'||m==='unable');updateRouteForMode(m);const locked=m==='view'||m==='viewOwn'||m==='voided'||m==='execView'||m==='execManager'||m==='approve'||m==='approveUnit'||m==='execute'||m==='done'||m==='unable';document.querySelectorAll('.content-main input,.content-main select,.content-main textarea').forEach(x=>x.disabled=locked);document.querySelectorAll('.content-main .mini,.content-main .upload-btn,.content-main .link-button:not(#editExecution),.content-main .file-remove').forEach(x=>x.hidden=locked);document.body.classList.toggle('readonly',locked);}
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
  const iqList=readInquiries();document.getElementById('printInquiryRows').innerHTML=iqList.length?inquiryRowsHtml(iqList):'<tr><td colspan="5">無資料</td></tr>';
  const isDone=sel.value==='done';document.getElementById('printExecTable').hidden=!isDone;
  if(isDone){const g=id=>document.getElementById(id).textContent;document.getElementById('printBuyDate').textContent=g('viewBuyDate');document.getElementById('printBuyer').textContent=g('viewBuyer');document.getElementById('printBuyAmount').textContent=g('viewBuyAmount');document.getElementById('printBuyVendor').textContent=g('viewBuyVendor');document.getElementById('printBuyNote').textContent=g('viewBuyNote');document.getElementById('printBuyBy').textContent=g('viewBuyBy');document.getElementById('printBuyAt').textContent=g('viewBuyAt')}
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
// 詢價過程由申請人在申請內容頁填寫（不在回填執行紀錄填寫）；非新增情境帶入示意資料
const INQ_SAMPLE=[{vendor:'聯強國際股份有限公司',price:'35,000',amount:'105,000',note:'含稅報價，含三年保固。'},{vendor:'博客來企業購',price:'36,167',amount:'108,500',note:'交期 7 天，無議價空間。'},{vendor:'聯強國際股份有限公司',price:'34,333',amount:'103,000',note:'議價後成交價。'}];
const BUY={log:[],date:'2026-09-19',amount:'103,000',vendor:'聯強國際股份有限公司',note:'含三年保固，預計 9/25 到貨。',by:'陳庭瑋 (T037)',at:'2026/09/19 16:40'};
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
(mode==='new'?[{}]:INQ_SAMPLE).forEach(r=>inquiryRows.appendChild(inquiryRowEl(r)));renumberInquiry();
// 內容頁唯讀情境（查看、簽核、執行、已作廢）：詢價列不可編輯（setMode 在列建立前已執行，這裡補套用）
if(document.body.classList.contains('readonly'))inquiryRows.querySelectorAll('input').forEach(x=>x.disabled=true);
// 送出簽核檢核：詢價的單價、金額如有填寫，須為大於 0 的數字（詢價整區非必填）
window.inquiryError=()=>readInquiries().some(r=>[r.price,r.amount].some(v=>v&&!(Number(v.replaceAll(',',''))>0)))?'詢價的單價、金額如有填寫，須為大於 0 的數字。':'';
function renderExecutionRecord(){
  const set=(id,v)=>document.getElementById(id).textContent=v||'—';
  set('viewBuyDate',slashDate(BUY.date));set('viewBuyAmount',BUY.amount?'NT$ '+BUY.amount:'');set('viewBuyVendor',BUY.vendor);set('viewBuyNote',BUY.note);set('viewBuyer',DESIGNATED);set('viewBuyBy',BUY.by);set('viewBuyAt',BUY.at);document.getElementById('viewLogWrap').hidden=!BUY.log.length;document.getElementById('viewLog').innerHTML=BUY.log.map(l=>'<li>'+esc(l.at)+'　'+esc(l.by)+'：'+esc(l.items.join('；'))+'</li>').join('');
}
const execWarn=document.getElementById('execWarn'),execConfirmBtn=document.getElementById('execConfirm');let overAsked=false;
function todayStr(){const d=new Date(),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`}
function resetOverWarn(){overAsked=false;execWarn.hidden=true;execConfirmBtn.textContent='確認採購完成'}
function openExecutionModal(){
  document.getElementById('buyDate').max=todayStr();document.getElementById('buyDate').value=BUY.date||'';buyAmountInput.value=BUY.amount||'';document.getElementById('buyVendor').value=BUY.vendor||'';document.getElementById('buyNote').value=BUY.note||'';
  document.getElementById('execRefBuyer').textContent=DESIGNATED;document.getElementById('execRefAmount').textContent='NT$ '+(document.getElementById('quoteTotal').value.trim()||'—');resetOverWarn();execError.hidden=true;execModal.hidden=false;
}
if(mode==='done')renderExecutionRecord();
if(mode==='execute'){BUY.date=BUY.amount=BUY.vendor=BUY.note=''}
document.getElementById('executeBtn').onclick=openExecutionModal;
document.getElementById('editExecution').onclick=openExecutionModal;
buyAmountInput.addEventListener('input',()=>{buyAmountInput.value=formatQuoteTotal(buyAmountInput.value);resetOverWarn()});
document.querySelectorAll('[data-exec-close]').forEach(b=>b.onclick=()=>execModal.hidden=true);
document.getElementById('execConfirm').onclick=()=>{
  // Demo：網址加 &voided=1 可模擬「採購人員回填時，申請人已將單據作廢」，送出前再檢查一次狀態並擋下
  if(q.get('voided')==='1'){execError.textContent='此單已作廢，無法回填。';execError.hidden=false;return}
  if(q.get('reassigned')==='1'){execError.textContent='此單已改派給其他採購人員，無法回填。';execError.hidden=false;return}
  const date=document.getElementById('buyDate').value,amount=buyAmountInput.value.trim(),vendor=document.getElementById('buyVendor').value.trim();
  const amountNumber=Number(amount.replaceAll(',',''));
  const message=!date?'請填寫實際購買日期。':date>todayStr()?'實際購買日期不可為未來日期。':!amount||!(amountNumber>0)?'請填寫實際購買金額。':!vendor?'請填寫實際購買廠商。':'';
  if(message){execError.textContent=message;execError.hidden=false;return}
  const quoteNumber=Number(document.getElementById('quoteTotal').value.replaceAll(',',''));
  if(quoteNumber>0&&amountNumber>quoteNumber&&!overAsked){overAsked=true;execWarn.textContent='實際購買金額 NT$ '+amount+' 高於預計採購金額(含稅) NT$ '+document.getElementById('quoteTotal').value.trim()+'，請確認是否仍要送出？確認無誤請再按「仍要送出」，如需修正請直接修改金額。';execWarn.hidden=false;execConfirmBtn.textContent='仍要送出';return}
  const now=new Date(),pad=n=>String(n).padStart(2,'0');
  const prev={date:BUY.date,amount:BUY.amount,vendor:BUY.vendor,note:BUY.note},newNote=document.getElementById('buyNote').value.trim(),stamp=`${now.getFullYear()}/${pad(now.getMonth()+1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  if(sel.value==='done'){const items=[];if(prev.date!==date)items.push('實際購買日期 '+slashDate(prev.date)+' → '+slashDate(date));if(prev.amount!==amount)items.push('實際購買金額 NT$ '+prev.amount+' → NT$ '+amount);if(prev.vendor!==vendor)items.push('實際購買廠商 '+prev.vendor+' → '+vendor);if(prev.note!==newNote)items.push('備註已修改');if(items.length)BUY.log.push({at:stamp,by:DESIGNATED,items})}
  Object.assign(BUY,{date,amount,vendor,note:document.getElementById('buyNote').value.trim(),by:'陳庭瑋 (T037)',at:`${now.getFullYear()}/${pad(now.getMonth()+1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`});
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
  if(q.get('voided')==='1'){unableError.textContent='此單已作廢，無法回填。';unableError.hidden=false;return}
  if(q.get('reassigned')==='1'){unableError.textContent='此單已改派給其他採購人員，無法回填。';unableError.hidden=false;return}
  const reason=unableReason.value.trim();
  if(!reason){unableError.textContent='請填寫不予採購原因。';unableError.hidden=false;return}
  const now=new Date(),pad=n=>String(n).padStart(2,'0');
  Object.assign(UNABLE,{reason,by:DESIGNATED,at:`${now.getFullYear()}/${pad(now.getMonth()+1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`});
  renderUnableRecord();unableModal.hidden=true;
  alert('Demo：此單據已結案為「不予採購」，並通知申請人。如仍需採購，請重新填寫新的採購請購單。');
  sel.value='unable';history.replaceState(null,'','?mode=unable');setMode('unable')
};

// 作廢（比照請款單、簽呈單）：申請人可在「申請中、簽核中、已核准（尚未執行）、已退回」作廢；採購人員已回填「採購完成」或「不予採購」者不可作廢。
(function(){
  if(!window.ClaimVoid)return;
  const ME='陳庭瑋 (T037)',$=s=>document.querySelector(s);
  const viewBox=$('#viewActions'),titleEl=$('#pageTitle'),routeHead=$('#routePanel .round-badge');
  const mkBtn=(txt,html)=>{const b=document.createElement('button');b.type='button';b.className='btn tool-action void-action';b.hidden=true;b.innerHTML=html+txt;return b};
  const copyLink=document.createElement('a');copyLink.className='btn tool-action';copyLink.textContent='複製';copyLink.hidden=true;viewBox.appendChild(copyLink);
  const btn=mkBtn('作廢','<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>');
  viewBox.appendChild(btn);
  // 申請人查看的情境：st＝申請中／簽核中／尚未執行（已核准）／採購完成／不予採購
  const ST_DEFAULT={'申請中':{no:'CBS-FPU-2026-00105',date:'2026/09/18'},'簽核中':{no:'CBS-FPU-2026-00101',date:'2026/09/14'},'尚未執行':{no:'CBS-FPU-2026-00108',date:'2026/09/13'},'採購完成':{no:'CBS-FPU-2026-00096',date:'2026/09/08'},'不予採購':{no:'CBS-FPU-2026-00104',date:'2026/09/10'}};
  const APPROVED=['尚未執行','採購完成','不予採購'];
  const st=()=>q.get('st')&&ST_DEFAULT[q.get('st')]?q.get('st'):'簽核中';
  const routeOrig=[...document.querySelectorAll('#routeBody .approval-stage')].map(el=>[el,el.className,el.innerHTML]);
  let info=null,wasVoid=false;
  const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const nowText=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return d.getFullYear()+'/'+p(d.getMonth()+1)+'/'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes())};
  const docNo=()=>q.get('no')||(sel.value==='viewOwn'?ST_DEFAULT[st()].no:sel.value==='editReturned'?'CBS-FPU-2026-00099':'CBS-FPU-2026-00093');
  function applyRoute(m){
    routeOrig.forEach(([el,c,h])=>{el.className=c;el.innerHTML=h});
    document.querySelectorAll('.void-badge').forEach(x=>x.remove());
    routeHead.textContent='目前送審輪次：1';
    if(m==='viewOwn'){
      updateRouteForMode(APPROVED.includes(st())?'execute':'view');
      if(st()==='申請中'){ // 第一關尚未審核：①待簽核、②待前序完成
        const L=[...document.querySelectorAll('#routeBody .approval-stage')],pend=(el,text,person)=>{el.className='approval-stage pending';const t=el.querySelector('.stage-status');t.className='stage-status pending';t.textContent=text;el.querySelector('.stage-person').textContent=person;el.querySelector('time').textContent='簽核日期：—'};
        pend(L[0],'待簽核','待簽核者：林家筠 (T038)');pend(L[1],'待前序完成','');
      }
    }
  }
  function sync(){
    const v=sel.value,voided=v==='voided',own=v==='viewOwn';
    if(v==='editReturned'){const t=document.querySelector('#stage3');if(t){t.className='approval-stage returned';const ss=t.querySelector('.stage-status');ss.className='stage-status returned';ss.textContent='已退回';t.querySelector('.stage-person').textContent='簽核者：陳志明 (A008)';t.querySelector('time').textContent='簽核日期：2026/09/10 15:20'}}
    const no=docNo();
    if(own||voided){modes[v].no=no}
    const from=info?info.from:(q.get('from')||'簽核中');
    btn.hidden=!own;copyLink.hidden=!(own||voided&&q.get('copy')!=='0');copyLink.href='detail.html?mode=new&copy='+encodeURIComponent(no);
    $('#voidAlert').hidden=!voided;
    if(own){
      titleEl.textContent='查看採購請購單（'+no+'）';$('#applyDate').textContent='申請日期：'+((ST_DEFAULT[st()]||{}).date||'');modes.viewOwn.status=APPROVED.includes(st())?'已核准':st();
      applyRoute('viewOwn');
    }
    if(voided){
      applyRoute('voided');
      titleEl.textContent='查看採購請購單（'+no+'）';
      titleEl.insertAdjacentHTML('beforeend','<span class="void-badge">已作廢</span>');
      const i=info||{reason:q.get('reason')||'改由供應商直送，不需再採購。',time:q.get('at')||'2026/09/19 14:05',by:ME,from};
      $('#voidReasonText').textContent=i.reason;$('#voidWhoText').textContent=i.by+'　'+i.time;
      routeHead.textContent='狀態：已作廢';
      // 原作廢前已完成全部簽核（已核准）：關卡全為已核准；否則待簽核關卡標示已作廢
      if(i.from==='已核准'){updateRouteForMode('execute')}
      document.querySelectorAll('#routeBody .approval-stage').forEach(el=>{
        if(!el.classList.contains('pending'))return;
        el.className='approval-stage voided';
        const s=el.querySelector('.stage-status');if(s){s.className='stage-status voided';s.textContent='已作廢'}
        const pe=el.querySelector('.stage-person');if(pe)pe.textContent='申請人已作廢，流程終止';
        const tm=el.querySelector('time');if(tm)tm.textContent='作廢日期：'+i.time;
      });
      $('#routePanel').hidden=false;
    }
  }
  function openVoid(){
    const no=docNo(),s=sel.value==='editReturned'?'已退回':st();
    const blockMessage=s==='採購完成'?'採購人員已回填「採購完成」，無法作廢。':s==='不予採購'?'採購人員已標示「不予採購」（已結案），無法作廢。':'';
    const approved=APPROVED.includes(s);
    ClaimVoid.open({no,status:approved?'已核准':s,statusText:approved?'已核准（'+s+'）':s,label:'採購請購單',blockers:ClaimVoid.blockersOf(no),blockMessage,
      warn:'此單已核准，作廢前請先與指定採購人員確認尚未向廠商下單。',extraNote:approved?'指定採購人員在「執行管理」會看到此單標示為「已作廢」，無法再回填執行。':'',
      onConfirm(reason){
        info={reason,time:nowText(),by:ME,from:approved?'已核准':s};
        sel.value='voided';history.replaceState(null,'','?mode=voided&no='+encodeURIComponent(no));
        setMode('voided');sync();
        ClaimVoid.toast('採購請購單已作廢。');
      }});
  }
  btn.addEventListener('click',openVoid);
  // 已退回的編輯情境（工具列順序：列印、複製、作廢）：申請人可作廢，不需重新送審
  const editBox=$('#editActions');
  if(editBox&&mode==='editReturned'){const b2=mkBtn('作廢',btn.innerHTML.replace(/作廢$/,''));b2.hidden=false;b2.addEventListener('click',openVoid);editBox.appendChild(b2)}
  sync();
})();


// 執行管理角色與改派（2026-11-23）：採購主管可在「尚未執行」時變更採購人員；採購人員只能處理自己的單據，同事的單只能查看
(function(){
  const $=s=>document.querySelector(s),UNIT='後勤支援部／人事總務課',ME='羅弘奕 (B019)';
  if(q.get('own')==='0'){const e=$('#editExecution');if(e)e.hidden=true}
  if(!['execute','execView','execManager'].includes(mode))return;
  const isMgr=mode==='execManager';
  let buyer=q.get('buyer')||'陳庭瑋 (T037)';
  const no=q.get('no')||modes[mode].no;
  if(mode!=='execute'){modes[mode].no=no;$('#pageTitle').textContent=(isMgr?'採購請購單（':'查看採購請購單（')+no+'）'}
  const note=()=>mode==='execute'?'此單指定給您處理，可回填執行紀錄或標示不予採購。':isMgr?'您是此採購單位的主管，可變更採購人員；不可代為回填執行紀錄。':'此單由 '+buyer+' 負責，您是同採購單位的採購人員，只能查看。';
  const bar=document.createElement('section');bar.className='panel buyer-bar';bar.id='buyerBar';
  const paint=()=>{bar.innerHTML='<div class="bb-row"><span>採購單位：<b>'+UNIT+'</b></span><span>執行狀態：<b>尚未執行</b></span><span>指定採購人員：<b id="bbBuyer">'+buyer+'</b></span></div><p class="bb-note">'+note()+'</p>'};
  paint();$('#routePanel').before(bar);
  if(!isMgr)return;
  // 工具列：變更採購人員
  const btn=document.createElement('button');btn.type='button';btn.className='btn primary';btn.id='reassignBtn';btn.textContent='變更採購人員';
  $('#viewActions').prepend(btn);
  // 異動紀錄
  const logPanel=document.createElement('section');logPanel.className='panel';logPanel.id='reassignLog';logPanel.hidden=true;
  logPanel.innerHTML='<h2>指定採購人員異動紀錄</h2><div class="panel-body"><div class="table-scroll"><table class="inquiry-table log-table"><thead><tr><th>時間</th><th>原採購人員</th><th>新採購人員</th><th>變更者</th><th>變更原因</th></tr></thead><tbody></tbody></table></div></div>';
  bar.after(logPanel);
  // Popup
  const m=document.createElement('div');m.className='decision-modal';m.id='reassignModal';m.hidden=true;
  m.innerHTML='<div class="decision-backdrop" data-rs-close></div><section><header><h2>變更採購人員</h2><button type="button" data-rs-close>×</button></header><div class="decision-body"><p class="decision-hint">確認後，此單將改由新的採購人員處理，原採購人員不能再回填；系統會通知新、原採購人員。不需要重新簽核。</p><dl class="rs-ref"><div><dt>單號</dt><dd id="rsNo"></dd></div><div><dt>採購單位</dt><dd>'+UNIT+'</dd></div><div><dt>目前指定採購人員</dt><dd id="rsCur"></dd></div></dl><label class="buyer-pick"><span class="label req">新指定採購人員</span><input class="control" id="rsNew" list="rsList" placeholder="請輸入姓名或員編搜尋" autocomplete="off"><datalist id="rsList"></datalist><small>僅可選擇採購單位「'+UNIT+'」（含下層單位）的在職員工。</small></label><label class="unable-field"><span class="label">變更原因（選填）</span><textarea id="rsReason" maxlength="200" placeholder="例如：原採購人員請假、調職"></textarea><small class="char-count"><span id="rsCount">0</span> / 200</small></label><p class="exec-error" id="rsError" hidden></p></div><footer><button class="btn" type="button" data-rs-close>取消</button><button class="btn primary" type="button" id="rsConfirm">確認變更</button></footer></section>';
  document.body.appendChild(m);
  const el=id=>m.querySelector('#'+id),pad=n=>String(n).padStart(2,'0'),now=()=>{const d=new Date();return d.getFullYear()+'/'+pad(d.getMonth()+1)+'/'+pad(d.getDate())+' '+pad(d.getHours())+':'+pad(d.getMinutes())};
  btn.onclick=()=>{el('rsNo').textContent=no;el('rsCur').textContent=buyer;el('rsNew').value='';el('rsReason').value='';el('rsCount').textContent='0';el('rsError').hidden=true;el('rsList').innerHTML=UNIT_MEMBERS[UNIT].filter(n=>n!==buyer).map(n=>'<option value="'+n+'">').join('');m.hidden=false};
  m.querySelectorAll('[data-rs-close]').forEach(b=>b.onclick=()=>m.hidden=true);
  el('rsReason').addEventListener('input',()=>el('rsCount').textContent=el('rsReason').value.length);
  const fail=t=>{el('rsError').textContent=t;el('rsError').hidden=false};
  el('rsConfirm').onclick=()=>{
    // 送出前再檢查一次單據狀態（Demo：網址加 &voided=1 模擬單據已被申請人作廢）
    if(q.get('voided')==='1')return fail('此單已作廢，無法變更採購人員。');
    const v=el('rsNew').value.trim();
    if(!v)return fail('請選擇新的指定採購人員。');
    if(v===buyer)return fail('新指定採購人員不可與目前相同。');
    if(!UNIT_MEMBERS[UNIT].includes(v))return fail('請從採購單位「'+UNIT+'」的員工中選擇新的指定採購人員。');
    const reason=el('rsReason').value.trim(),old=buyer;buyer=v;
    const tr=document.createElement('tr');tr.innerHTML='<td>'+now()+'</td><td>'+esc(old)+'</td><td>'+esc(v)+'</td><td>'+ME+'</td><td style="white-space:pre-wrap">'+(esc(reason)||'—')+'</td>';
    logPanel.querySelector('tbody').appendChild(tr);logPanel.hidden=false;paint();m.hidden=true;
    if(window.ClaimVoid)ClaimVoid.toast('已變更指定採購人員，並通知新採購人員（'+v+'）與原採購人員（'+old+'）。');
  };
})();
