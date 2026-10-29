const invoiceLabel=[...document.querySelectorAll('.label')].find(el=>el.textContent.trim()==='發票號碼');if(invoiceLabel){const box=invoiceLabel.parentElement;box.classList.add('invoice-column');const invoiceRow=v=>`<tr><td><input class="control invoice-input" placeholder="請輸入發票號碼" value="${v||''}"></td><td class="invoice-del"><button class="invoice-remove" type="button" title="刪除發票號碼" aria-label="刪除發票號碼">🗑</button></td></tr>`;box.innerHTML='<table class="invoice-table"><thead><tr><th>發票號碼</th><th class="invoice-del">刪除</th></tr></thead><tbody id="invoiceRows">'+invoiceRow('TW10138891')+invoiceRow('AB12345678')+'</tbody></table><button class="add invoice-add-row" type="button">＋ 加入一筆發票號碼</button><div class="help">請款金額 5,000 元以上需填寫；可加入多筆發票號碼。</div>';const invoiceRows=box.querySelector('#invoiceRows');const addInvoice=()=>{invoiceRows.insertAdjacentHTML('beforeend',invoiceRow(''));const inputs=invoiceRows.querySelectorAll('.invoice-input');inputs[inputs.length-1].focus()};box.querySelector('.invoice-add-row').addEventListener('click',addInvoice);invoiceRows.addEventListener('click',e=>{const btn=e.target.closest('.invoice-remove');if(!btn)return;const tr=btn.closest('tr');if(invoiceRows.children.length===1){tr.querySelector('.invoice-input').value='';return}tr.remove()});invoiceRows.addEventListener('keydown',e=>{if(e.key!=='Enter')return;e.preventDefault();const inputs=[...invoiceRows.querySelectorAll('.invoice-input')],last=inputs[inputs.length-1];if(e.target===last&&last.value.trim())addInvoice();else{const n=inputs[inputs.indexOf(e.target)+1];if(n)n.focus()}})}const attachmentArea=document.querySelector('.attachment-area');if(attachmentArea){const box=attachmentArea.parentElement;box.classList.add('attachment-column');const note=box.querySelector('.help');if(note){note.className='help attachment-notes';note.innerHTML='<div>※ 如有需於簽核時一併審閱之資料，請於此處檢附。</div><div>※ 單據請確認載有公司全銜、統一編號，並加蓋對方之統一發票專用章或免用統一發票專用章。</div>'}}

const paymentTerm=document.querySelector('#paymentTerm'),specifiedDate=document.querySelector('#specifiedDate');function term(){specifiedDate.classList.toggle('hidden',paymentTerm.value!=='specified')}paymentTerm.onchange=term;term();const company=document.querySelector('#company'),employee=document.querySelector('#employee'),cf=document.querySelector('#companyFields'),ef=document.querySelector('#employeeFields');function account(){cf.classList.toggle('hidden',!company.checked);ef.classList.toggle('hidden',!employee.checked)}company.onchange=employee.onchange=account;const existingPayee=document.querySelector('#existingPayee'),newPayee=document.querySelector('#newPayee'),existingFields=document.querySelector('#existingPayeeFields'),newFields=document.querySelector('#newPayeeFields');function payeeMode(){existingFields.classList.toggle('hidden',!existingPayee.checked);newFields.classList.toggle('hidden',!newPayee.checked)}existingPayee.onchange=newPayee.onchange=payeeMode;const role=document.querySelector('#roleSelect');function mode(){const v=role.value,returned=v.startsWith('returned-'),fullReturn=v==='returned-full',approve=v==='manager'||v==='finance',finance=v==='finance';document.querySelector('#editTop').classList.toggle('view-only',approve);document.querySelector('#approvalTop').classList.toggle('view-only',!approve);document.querySelector('#returnAlert').classList.toggle('view-only',!returned);document.querySelector('#approvalDetail').classList.toggle('view-only',!(approve||returned));document.querySelector('#currentTop').classList.toggle('view-only',!finance);document.querySelector('#reviewText').textContent=fullReturn?'需重新簽核（從第一關開始）':'僅需財務重審';document.querySelectorAll('.control').forEach(x=>{if(x!==role)x.disabled=approve});document.querySelector('.add').classList.toggle('view-only',approve);document.querySelector('#pageTitle').textContent=approve?'簽核請款單（CBS-FRE-2026-00100）':returned?'編輯請款單（CBS-FRE-2026-00099）':'編輯請款單（尚未產生單號）';document.querySelector('#summaryNo').textContent=(approve||returned)?(returned?'CBS-FRE-2026-00099':'CBS-FRE-2026-00100'):'尚未產生';document.querySelector('#summaryStatus').textContent=returned?'已退回':approve?(finance?'待財務簽核':'待主管簽核'):'草稿';document.querySelector('#summaryDate').textContent=(approve||returned)?'2026-09-03 12:48':'尚未送出';const managerStepEl=document.querySelector('#managerStep');if(managerStepEl)managerStepEl.className=v==='manager'?'now':(approve||returned)?'done':'';const financeStepEl=document.querySelector('#financeStep');if(financeStepEl)financeStepEl.className=finance?'now':returned?'returned':''}role.onchange=mode;


const sourcePanel=document.querySelector('#pageTitle').closest('.panel'),sourceBody=sourcePanel.querySelector('.body');sourceBody.classList.add('v2-basic-grid');const sourceItems=[...sourceBody.children],paymentItems=sourceItems.slice(3);const paymentPanel=document.createElement('section');paymentPanel.className='panel v2-payment';paymentPanel.innerHTML='<h2>付款與匯款資料</h2><div class="body"></div>';paymentItems.forEach(item=>paymentPanel.querySelector('.body').appendChild(item));const detailPanel=[...document.querySelectorAll('.panel')].find(p=>p.querySelector('h2')?.textContent.trim()==='請款明細'),invoicePanel=[...document.querySelectorAll('.panel')].find(p=>p.querySelector('h2')?.textContent.trim()==='發票資訊'),attachmentPanel=[...document.querySelectorAll('.panel')].find(p=>p.querySelector('h2')?.textContent.trim()==='附件與關聯單據'),workbench=document.createElement('div');workbench.className='v2-workbench';const left=document.createElement('div');left.className='v2-left';left.append(sourcePanel,detailPanel,attachmentPanel,...[...document.querySelectorAll('.panel')].filter(p=>p.querySelector('h2')?.textContent.trim()==='關聯單據'));invoicePanel?.querySelector('.body')?.classList.add('invoice-body');const right=document.createElement('div');right.className='v2-right';right.append(paymentPanel,invoicePanel);workbench.append(left,right);const outerLayout=document.querySelector('.layout'),mainColumn=outerLayout.querySelector(':scope > .main'),summary=outerLayout.querySelector(':scope > .side');summary.classList.add('v2-summary','view-only');mainColumn.prepend(summary);summary.after(workbench);const toolbar=document.querySelector('.toolbar'),roleBox=toolbar.querySelector('.role'),editActionsTop=document.querySelector('#editTop'),approvalActionsTop=document.querySelector('#approvalTop'),topTools=document.createElement('div');topTools.className='v2-top-tools';[...editActionsTop.querySelectorAll('.action-divider,.tool-action')].forEach(item=>topTools.appendChild(item));toolbar.insertBefore(topTools,roleBox);const actionBar=document.createElement('section');actionBar.className='panel v2-form-actions';actionBar.append(editActionsTop,approvalActionsTop);workbench.after(actionBar);const actionMedia=window.matchMedia('(max-width: 900px)');const syncActionPlacement=()=>{if(actionMedia.matches){actionBar.append(editActionsTop,approvalActionsTop);actionBar.classList.add('mobile-actions');toolbar.after(routePanel)}else{toolbar.insertBefore(editActionsTop,topTools);toolbar.insertBefore(approvalActionsTop,topTools);actionBar.classList.remove('mobile-actions');toolbar.after(routePanel)}};actionMedia.addEventListener?.('change',syncActionPlacement);const routePanel=summary.querySelectorAll(':scope > .panel')[1];routePanel.classList.add('v2-route-wide');routePanel.querySelector('h2').innerHTML='<span class="route-heading"><span>簽核路線與關卡</span><span class="round-badge">目前送審輪次：3</span></span><span class="route-actions"><button class="route-toggle" type="button">查看</button><button class="history-link" type="button">簽核歷程</button></span>';routePanel.querySelector('.body').innerHTML=`<div class="round-summary"><div class="return-record"><b>第 2 次退回</b><span>時間：2026-09-03 12:59:10</span><span>退回者：<b>⑤ 財務</b>　張淑芬 (F015)</span><span>退回原因：附件發票統編錯誤</span></div><div class="return-record"><b>第 1 次退回</b><span>時間：2026-09-02 16:35:42</span><span>退回者：<b>② 部級主管</b>　陳大華 (B123)</span><span>退回原因：請款明細看不出來要申請什麼</span></div></div><div class="approval-stage approved"><div class="stage-title">① 課級主管</div><span class="stage-status approved">已核准</span><div class="stage-person">簽核者：測－林家筠 (T038)</div><time>簽核日期：2026-09-03 12:56:58</time><div class="stage-opinion">意　見：同意</div></div><div class="approval-stage approved"><div class="stage-title">② 部級主管</div><span class="stage-status approved">已核准</span><div class="stage-person">簽核者：陳大華 (B123)（代理王曉明 (B122)）</div><time>簽核日期：2026-09-03 12:58:20</time><details class="stage-opinion"><summary>意　見：確認符合預算規範… 詳情</summary><span>確認符合本年度部門預算規範，同意送交後續關卡審核。</span></details></div><div class="approval-stage skipped"><div class="stage-title">③ 副總經理<span class="route-threshold">NT$ 10,000 起需簽核</span></div><span class="stage-status">不需簽核</span></div><div class="approval-stage skipped"><div class="stage-title">④ 總經理<span class="route-threshold">NT$ 100,000 起需簽核</span></div><span class="stage-status">不需簽核</span></div><div class="approval-stage pending"><div class="stage-title">⑤ 財務</div><span class="stage-status pending">待簽核</span><div class="stage-person">待簽核者：張淑芬 (F015)</div><time>簽核日期：—</time></div>`;actionBar.after(routePanel);syncActionPlacement();summary.style.display='none';const pageApplicationDate=document.createElement('div');pageApplicationDate.className='page-application-date';pageApplicationDate.textContent='申請日期：2026-09-03 12:48';sourcePanel.querySelector('h2').after(pageApplicationDate);const approvalTablePanel=document.querySelector('#approvalDetail > .panel');if(approvalTablePanel)approvalTablePanel.remove();const historySource=document.querySelector('#approvalDetail');historySource.classList.add('v2-history-source');const auditModal=document.createElement('div');auditModal.className='audit-modal view-only';auditModal.innerHTML='<div class="audit-backdrop"></div><section class="audit-dialog" role="dialog" aria-modal="true" aria-labelledby="auditTitle"><header><h2 id="auditTitle">簽核歷程（系統紀錄）</h2><button class="audit-close" type="button" aria-label="關閉">×</button></header><div class="audit-content">'+historySource.innerHTML+'</div></section>';document.body.appendChild(auditModal);const closeAudit=()=>auditModal.classList.add('view-only');const historyLink=routePanel.querySelector('.history-link'),routeToggle=routePanel.querySelector('.route-toggle'),routeBody=routePanel.querySelector('.body');routeBody.classList.add('route-collapsed');routeToggle.onclick=()=>{const willOpen=routeBody.classList.contains('route-collapsed');routeBody.classList.toggle('route-collapsed');routeToggle.textContent=willOpen?'收合':'查看'};historyLink.onclick=()=>auditModal.classList.remove('view-only');auditModal.querySelector('.audit-close').onclick=closeAudit;auditModal.querySelector('.audit-backdrop').onclick=closeAudit;outerLayout.style.gridTemplateColumns='minmax(0,1fr)';outerLayout.appendChild(mainColumn);const syncV2Summary=()=>{const isNew=role.value==='new',isEdit=role.value==='edit',roundBadge=routePanel.querySelector('.round-badge'),roundSummary=routePanel.querySelector('.round-summary');roundBadge.textContent='目前送審輪次：'+(isEdit?'1':'3');roundSummary.classList.toggle('view-only',isEdit);routePanel.classList.toggle('view-only',isNew);routePanel.style.display=isNew?'none':'block';pageApplicationDate.classList.toggle('view-only',isNew);if(isNew)document.querySelector('#pageTitle').textContent='新增請款單（尚未產生單號）';else if(isEdit)document.querySelector('#pageTitle').textContent='編輯請款單（CBS-FRE-2026-00099）'};const originalRoleChange=role.onchange;role.onchange=()=>{originalRoleChange();syncV2Summary()};role.addEventListener('change',syncV2Summary);syncV2Summary();


const claimTotal=document.querySelector("#claimTotal"),approvalLevelHint=document.querySelector("#approvalLevelHint");
function refreshApprovalHint(){if(!(claimTotal&&approvalLevelHint))return;const amount=Number(claimTotal.dataset.amount||0);approvalLevelHint.classList.remove("require-approval");if(amount>=100000){approvalLevelHint.textContent="目前金額需依序經副總經理、總經理批示。";approvalLevelHint.classList.add("require-approval")}else if(amount>=10000){approvalLevelHint.textContent="目前金額需簽核至副總經理。";approvalLevelHint.classList.add("require-approval")}else{approvalLevelHint.textContent="目前金額未達加簽門檻，無須副總經理及總經理批示。"}}
refreshApprovalHint();

// 請款明細：可新增、複製（金額不複製）、刪除；請款金額即時加總。
const detailRows=document.querySelector('#detailRows');
if(detailRows){
  const copyIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';
  const esc=v=>String(v||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  const detailRow=(desc,amount)=>`<tr><td><input class="control detail-desc" placeholder="請輸入摘要" value="${esc(desc)}"></td><td class="money"><span class="money-wrap"><span>NT$</span><input class="control detail-amount" inputmode="numeric" placeholder="請輸入金額" value="${amount?Number(amount).toLocaleString('en-US'):''}"></span></td><td class="detail-act"><button class="detail-copy" type="button" title="複製此筆明細（金額不複製）" aria-label="複製此筆明細">${copyIcon}</button></td><td class="detail-act"><button class="detail-remove" type="button" title="刪除此筆明細" aria-label="刪除此筆明細">🗑</button></td></tr>`;
  const amountOf=tr=>Number(String(tr.querySelector('.detail-amount').value).replace(/\D/g,''))||0;
  const refreshTotal=()=>{const total=[...detailRows.children].reduce((sum,tr)=>sum+amountOf(tr),0);claimTotal.dataset.amount=total;claimTotal.textContent='NT$ '+total.toLocaleString('en-US');refreshApprovalHint()};
  const addDetail=(desc,amount,focusSel)=>{detailRows.insertAdjacentHTML('beforeend',detailRow(desc,amount));const tr=detailRows.lastElementChild;tr.querySelector(focusSel||'.detail-desc').focus();refreshTotal()};
  detailRows.innerHTML=detailRow('員工獎金',100000);
  document.querySelector('#addDetail').addEventListener('click',()=>addDetail('',0));
  detailRows.addEventListener('click',e=>{
    const copyBtn=e.target.closest('.detail-copy'),removeBtn=e.target.closest('.detail-remove');
    if(copyBtn){addDetail(copyBtn.closest('tr').querySelector('.detail-desc').value,0,'.detail-amount')}
    else if(removeBtn){const tr=removeBtn.closest('tr');if(detailRows.children.length===1){tr.querySelector('.detail-desc').value='';tr.querySelector('.detail-amount').value=''}else tr.remove();refreshTotal()}
  });
  detailRows.addEventListener('input',e=>{if(!e.target.classList.contains('detail-amount'))return;const digits=e.target.value.replace(/\D/g,'').slice(0,9);e.target.value=digits?Number(digits).toLocaleString('en-US'):'';refreshTotal()});
}
// 選擇既有廠商：下拉最上方為「最近使用」（目前登入者＝新增人，含草稿，依請款公司分開，依新增時間新到舊，匯款戶名／廠商不重複，最多 10 個），下方為完整廠商清單，兩區皆可搜尋。
// Demo 以範例資料示意；正式版由請款單資料即時查詢（不另建資料表），已停用或非信任廠商不列入。
const vendorMaster=[
  {id:'V01',co:'網家跨境服務股份有限公司',name:'健檢－內湖101（公司負擔）',acct:'內湖101健康管理診所',bank:'第一商業銀行 和平分行　****96666'},
  {id:'V02',co:'網家跨境服務股份有限公司',name:'台灣雲端服務股份有限公司',acct:'台灣雲端服務股份有限公司',bank:'國泰世華銀行 信義分行　****12345'},
  {id:'V03',co:'網家跨境服務股份有限公司',name:'大安文具行',acct:'大安文具行',bank:'台北富邦銀行 大安分行　****33221'},
  {id:'V04',co:'網家跨境服務股份有限公司',name:'順豐快遞台灣分公司',acct:'順豐速運（台灣）有限公司',bank:'中國信託 南港分行　****55871'},
  {id:'V05',co:'網家跨境服務股份有限公司',name:'中華電信企業客戶',acct:'中華電信股份有限公司',bank:'臺灣銀行 營業部　****70012'},
  {id:'V06',co:'網家跨境服務股份有限公司',name:'愛上咖啡館（下午茶）',acct:'愛上咖啡有限公司',bank:'玉山銀行 內湖分行　****18830'},
  {id:'V07',co:'網家跨境服務股份有限公司',name:'好運計程車隊',acct:'好運交通股份有限公司',bank:'合作金庫 松山分行　****44109'},
  {id:'V08',co:'網家跨境服務股份有限公司',name:'宏達影印設備',acct:'宏達事務機器有限公司',bank:'兆豐銀行 忠孝分行　****61924'},
  {id:'V09',co:'網家跨境服務股份有限公司',name:'舊合作印刷廠（已停止信任）',acct:'舊合作印刷有限公司',bank:'—',trusted:false},
  {id:'V10',co:'網家跨境服務股份有限公司',name:'光速網路',acct:'光速網路科技股份有限公司',bank:'永豐銀行 民生分行　****90357'},
  {id:'V11',co:'網家跨境服務股份有限公司',name:'綠葉清潔',acct:'綠葉清潔服務有限公司',bank:'華南銀行 內湖分行　****27716'},
  {id:'V12',co:'網家跨境服務股份有限公司',name:'新竹物流',acct:'新竹貨運股份有限公司',bank:'第一商業銀行 新竹分行　****38092'},
  {id:'V13',co:'網家跨境服務股份有限公司',name:'東區停車場',acct:'東區停車管理股份有限公司',bank:'國泰世華銀行 忠孝分行　****84420'},
  {id:'V14',co:'網家跨境服務股份有限公司',name:'王小明（個人）',acct:'王小明',bank:'中華郵政 台北郵局　****10553'},
  {id:'V21',co:'空中補給股份有限公司',name:'桃園機場貨運站',acct:'桃園國際機場貨運股份有限公司',bank:'中國信託 桃園分行　****31208'},
  {id:'V22',co:'空中補給股份有限公司',name:'飛達報關行',acct:'飛達報關股份有限公司',bank:'玉山銀行 南京東路分行　****66741'},
  {id:'V23',co:'空中補給股份有限公司',name:'航空保險經紀',acct:'安航保險經紀人股份有限公司',bank:'台新銀行 敦南分行　****50972'},
  {id:'V31',co:'比比昂株式會社',name:'東京辦公室租賃',acct:'東京オフィス賃貸株式会社',bank:'三菱UFJ銀行 新宿支店　****2208'},
  {id:'V32',co:'比比昂株式會社',name:'日本郵便',acct:'日本郵便株式会社',bank:'ゆうちょ銀行 東京　****7731'}
];
// 登入者（陳庭瑋）自己新增的請款單（含草稿），已依新增時間由新到舊排列。
const vendorHistory=[
  {co:'網家跨境服務股份有限公司',v:'V07',at:'2026-10-27 18:20',status:'申請中'},
  {co:'網家跨境服務股份有限公司',v:'V02',at:'2026-10-26 10:05',status:'簽核中'},
  {co:'網家跨境服務股份有限公司',v:'V07',at:'2026-10-24 09:12',status:'草稿'},
  {co:'網家跨境服務股份有限公司',v:'V03',at:'2026-10-22 15:40',status:'已核准'},
  {co:'網家跨境服務股份有限公司',v:'V05',at:'2026-10-20 11:03',status:'已核准'},
  {co:'網家跨境服務股份有限公司',v:'V09',at:'2026-10-19 16:30',status:'已核准'},
  {co:'網家跨境服務股份有限公司',v:'V01',at:'2026-10-18 13:22',status:'已核准'},
  {co:'網家跨境服務股份有限公司',v:'V04',at:'2026-10-15 10:48',status:'已退回'},
  {co:'網家跨境服務股份有限公司',v:'V06',at:'2026-10-12 17:15',status:'已核准'},
  {co:'網家跨境服務股份有限公司',v:'V02',at:'2026-10-10 09:30',status:'已核准'},
  {co:'網家跨境服務股份有限公司',v:'V10',at:'2026-10-08 14:00',status:'已核准'},
  {co:'網家跨境服務股份有限公司',v:'V08',at:'2026-10-05 11:11',status:'已核准'},
  {co:'網家跨境服務股份有限公司',v:'V11',at:'2026-10-03 16:45',status:'已核准'},
  {co:'網家跨境服務股份有限公司',v:'V12',at:'2026-09-29 10:20',status:'已核准'},
  {co:'網家跨境服務股份有限公司',v:'V13',at:'2026-09-25 09:05',status:'已核准'},
  {co:'網家跨境服務股份有限公司',v:'V14',at:'2026-09-20 15:50',status:'已核准'},
  {co:'空中補給股份有限公司',v:'V22',at:'2026-10-21 10:10',status:'已核准'},
  {co:'空中補給股份有限公司',v:'V21',at:'2026-10-09 13:35',status:'草稿'}
];
(function(){
  const combo=document.querySelector('#vendorCombo'),input=document.querySelector('#vendorInput'),list=document.querySelector('#vendorList'),companySel=document.querySelector('#claimCompany'),acctEl=document.querySelector('#vendorAccountName'),bankEl=document.querySelector('#vendorBank');
  if(!(combo&&input&&list&&companySel))return;
  const RECENT_MAX=10;let selected=vendorMaster[0],activeIdx=-1,items=[];
  const usable=co=>vendorMaster.filter(v=>v.co===co&&v.trusted!==false);
  const recentFor=co=>{const seen=new Set(),out=[];for(const h of vendorHistory.filter(h=>h.co===co).sort((a,b)=>b.at.localeCompare(a.at))){const v=vendorMaster.find(x=>x.id===h.v);if(!v||v.trusted===false||seen.has(v.id))continue;seen.add(v.id);out.push(v);if(out.length>=RECENT_MAX)break}return out};
  const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  const fill=v=>{selected=v;input.value=v?v.name:'';acctEl.textContent=v?v.acct:'—';bankEl.textContent=v?v.bank:'—'};
  function render(query){
    const q=(query||'').trim().toLowerCase(),co=companySel.value,match=v=>!q||v.name.toLowerCase().includes(q)||v.acct.toLowerCase().includes(q);
    const recent=recentFor(co).filter(match),all=usable(co).filter(match);items=[];let html='';
    if(recent.length){html+='<div class="vendor-group">最近使用</div>';recent.forEach(v=>{items.push(v);html+=`<div class="vendor-item" role="option" data-i="${items.length-1}"><span class="vendor-main">${esc(v.acct)}</span><span class="vendor-sub">${esc(v.name)}</span></div>`})}
    else if(!q&&!recentFor(co).length)html+='<div class="vendor-group">最近使用</div><div class="vendor-empty">尚無最近使用紀錄</div>';
    if(all.length){html+='<div class="vendor-group">全部廠商</div>';all.forEach(v=>{items.push(v);html+=`<div class="vendor-item" role="option" data-i="${items.length-1}"><span class="vendor-main">${esc(v.name)}</span><span class="vendor-sub">${esc(v.acct)}</span></div>`})}
    if(!recent.length&&!all.length)html='<div class="vendor-empty">查無符合的廠商</div>';
    list.innerHTML=html;activeIdx=-1}
  const open=q=>{if(input.disabled)return;render(q);list.hidden=false;input.setAttribute('aria-expanded','true')};
  const close=()=>{list.hidden=true;input.setAttribute('aria-expanded','false');input.value=selected?selected.name:''};
  const pick=i=>{if(items[i]){fill(items[i]);list.hidden=true;input.setAttribute('aria-expanded','false')}};
  const setActive=i=>{const els=list.querySelectorAll('.vendor-item');if(!els.length)return;activeIdx=(i+els.length)%els.length;els.forEach((e,n)=>e.classList.toggle('active',n===activeIdx));els[activeIdx].scrollIntoView({block:'nearest'})};
  input.addEventListener('focus',()=>{input.select();open('')});
  input.addEventListener('click',()=>{if(list.hidden)open('')});
  input.addEventListener('input',()=>open(input.value));
  input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();if(list.hidden)open('');else setActive(activeIdx+1)}else if(e.key==='ArrowUp'){e.preventDefault();setActive(activeIdx-1)}else if(e.key==='Enter'){if(!list.hidden){e.preventDefault();pick(activeIdx>=0?activeIdx:0)}}else if(e.key==='Escape'||e.key==='Tab'){if(!list.hidden)close()}});
  list.addEventListener('mousedown',e=>{const it=e.target.closest('.vendor-item');if(it){e.preventDefault();pick(Number(it.dataset.i))}});
  document.addEventListener('mousedown',e=>{if(!list.hidden&&!combo.contains(e.target))close()});
  // 換請款公司：廠商清單與最近使用依公司分開，原選擇清空，須重新選擇。
  companySel.addEventListener('change',()=>{fill(null);list.hidden=true});
  window.__recentVendors=recentFor;
})();

// 關聯單據：申請人從彈窗勾選「已核准」的單據，可一次加入多筆。
// 可引用的表單類型，以及各類型要拿哪個欄位當「識別資訊」，都由系統設定決定（Demo 設為：簽呈單＝主旨、採購請購單＝申請用途、合約送審申請＝簽約公司名稱）。
// 彈窗預設列出自己申請或新增的已核准單據；他人的單據須輸入完整單號，且編輯時不顯示其識別資訊。簽核人可由連結唯讀查看（不受原單權限範圍限制）。
const LINKABLE_CONFIG={簽呈單:'主旨',採購請購單:'申請用途',合約送審申請:'簽約公司名稱'};
const LINKABLE_TYPES=Object.keys(LINKABLE_CONFIG);
const FORM_TYPE_BY_CODE={GSI:'簽呈單',FPU:'採購請購單',GCN:'合約送審申請',GSE:'公司印鑑申請'};
const FORM_PAGE={簽呈單:'memos',採購請購單:'purchases',合約送審申請:'contracts',公司印鑑申請:'seals'};
const linkableDocs=[
  {no:'CBS-GSI-2026-00001',status:'已核准',applicant:'陳庭瑋 (T037)',mine:true,approved:'2026/09/12',title:'台北辦公室搬遷與裝修預算簽呈'},
  {no:'CBS-GCN-2026-00002',status:'已核准',applicant:'陳庭瑋 (T037)',mine:true,approved:'2026/09/16',title:'宏達資訊股份有限公司'},
  {no:'CBS-FPU-2026-00091',status:'已核准',applicant:'陳庭瑋 (T037)',mine:true,approved:'2026/08/28',title:'新進同仁筆電採購'},
  {no:'CBS-GCN-2026-00003',status:'已核准',applicant:'陳庭瑋 (T037)',mine:true,approved:'2026/08/05',title:'全球科技股份有限公司'},
  {no:'CBS-GSI-2026-00004',status:'已核准',applicant:'陳庭瑋 (T037)',mine:true,approved:'2026/07/30',title:'2026 年員工旅遊活動簽呈'},
  {no:'CBS-FPU-2026-00077',status:'已核准',applicant:'陳庭瑋 (T037)',mine:true,approved:'2026/07/15',title:'會議室視訊設備汰換'},
  {no:'CBS-GSI-2026-00007',status:'已核准',applicant:'王曉明 (T021)',mine:false,approved:'2026/09/17',title:'年度教育訓練預算簽呈'},
  {no:'CBS-FPU-2026-00098',status:'已核准',applicant:'林家筠 (T038)',mine:false,approved:'2026/09/17',title:'茶水間設備採購'},
  {no:'CBS-GCN-2026-00001',status:'已核准',applicant:'王曉明 (T021)',mine:false,approved:'2026/09/12',title:'星展資訊有限公司'},
  {no:'CBS-GSI-2026-00009',status:'簽核中',applicant:'王曉明 (T021)',mine:false,approved:'—',title:'年度教育訓練預算簽呈'},
  {no:'CBS-GSE-2026-00003',status:'已核准',applicant:'陳庭瑋 (T037)',mine:true,approved:'2026/09/20',title:''}
];
const docType=no=>FORM_TYPE_BY_CODE[(String(no).split('-')[1]||'')]||'';
const docUrl=no=>{const t=docType(no),pg=FORM_PAGE[t];return pg?`../${pg}/detail.html?mode=view&no=${encodeURIComponent(no)}`:'#'};
(function(){
  const rows=document.querySelector('#linkedRows'),empty=document.querySelector('#linkedEmpty'),table=document.querySelector('#linkedTable'),addBtn=document.querySelector('#addLinked');
  if(!(rows&&addBtn))return;
  const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const taken=()=>[...rows.querySelectorAll('tr')].map(r=>r.dataset.no).filter(Boolean);
  const sync=()=>{const n=rows.children.length;table.hidden=n===0;empty.hidden=n!==0};
  const okDoc=d=>d.status==='已核准'&&LINKABLE_TYPES.includes(docType(d.no));
  // 識別資訊：本人的單據直接顯示；他人的單據於編輯時以「—」遮蔽（簽核／查看時才顯示，見 CSS）。
  const rowHtml=d=>`<tr data-no="${esc(d.no)}"${d.mine?'':' data-foreign="1"'}><td><div class="linked-cell"><a class="linked-no" href="${esc(docUrl(d.no))}" target="_blank" rel="noopener" title="唯讀查看此單據">${esc(d.no)}</a></div></td><td class="linked-type">${esc(docType(d.no))}</td><td class="linked-title"><span class="lt-real">${esc(d.title||'—')}</span><span class="lt-mask" title="他人的單據於編輯時不顯示識別資訊">—</span></td><td class="linked-date">${esc(d.approved)}</td><td class="detail-act"><button class="detail-remove" type="button" title="移除此關聯單據" aria-label="移除此關聯單據">🗑</button></td></tr>`;
  const addRow=d=>{rows.insertAdjacentHTML('beforeend',rowHtml(d));sync()};
  rows.addEventListener('click',e=>{const rm=e.target.closest('.detail-remove');if(rm){rm.closest('tr').remove();sync()}});

  function openPicker(){
    const used=new Set(taken()),sel=new Map();
    const ov=document.createElement('div');ov.className='linkpick-ov';
    ov.innerHTML=`<div class="linkpick" role="dialog" aria-modal="true" aria-labelledby="lpTitle"><div class="linkpick-head"><h3 id="lpTitle">引用已核准單據</h3><button class="linkpick-x" type="button" aria-label="關閉">×</button></div><div class="linkpick-filter"><select class="control lp-type" aria-label="表單類型"><option value="">全部表單類型</option>${LINKABLE_TYPES.map(t=>`<option>${esc(t)}</option>`).join('')}</select><input class="control lp-q" placeholder="搜尋單號或識別資訊；他人的單據請輸入完整單號" autocomplete="off" aria-label="搜尋"></div><div class="linkpick-body" role="group"></div><div class="linkpick-foot"><span class="lp-count">已選 0 筆</span><span class="lp-spacer"></span><button class="btn lp-cancel" type="button">取消</button><button class="btn primary lp-ok" type="button" disabled>加入所選單據</button></div></div>`;
    document.body.appendChild(ov);const prevOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
    const $=s=>ov.querySelector(s),typeSel=$('.lp-type'),q=$('.lp-q'),body=$('.linkpick-body'),count=$('.lp-count'),ok=$('.lp-ok');
    const item=(d,foreign)=>{const u=used.has(d.no);return `<label class="lp-item${u?' used':''}"><input type="checkbox" data-no="${esc(d.no)}"${u?' disabled checked':sel.has(d.no)?' checked':''}><span class="lp-no">${esc(d.no)}</span><span class="lp-kind">${esc(docType(d.no))}</span><span class="lp-title">${foreign?'<i>—</i>':esc(d.title||'—')}</span><span class="lp-date">${u?'<em>已加入</em>':'核准 '+esc(d.approved)}</span></label>`};
    function render(){
      const ty=typeSel.value,t=q.value.trim().toLowerCase();
      const own=linkableDocs.filter(d=>d.mine&&okDoc(d)&&(!ty||docType(d.no)===ty)&&(!t||d.no.toLowerCase().includes(t)||(d.title||'').toLowerCase().includes(t))).sort((a,b)=>b.approved.localeCompare(a.approved));
      const any=t?linkableDocs.find(d=>d.no.toLowerCase()===t):null;
      const foreign=any&&!any.mine&&okDoc(any)?any:null;
      let msg='';
      if(any&&!okDoc(any))msg=any.status!=='已核准'?'此單據尚未核准，不可引用':'此類表單不可作為關聯單據';
      else if(t&&!own.length&&!foreign)msg='查無符合的已核准單據；他人的單據請輸入完整單號';
      else if(!t&&!own.length)msg='沒有可引用的已核准單據；他人的單據請輸入完整單號搜尋';
      let h='';
      if(own.length)h+=`<div class="lp-group"><span>${t?'符合的單據':'我的已核准單據'}（${own.length}）</span><label class="lp-all"><input type="checkbox"> 全選</label></div><div class="lp-cols"><span></span><span>單號</span><span>表單類型</span><span>識別資訊</span><span>核准日期</span></div>`+own.map(d=>item(d,false)).join('');
      if(foreign)h+=`<div class="lp-group"><span>他人的單據（完整單號符合）</span></div>`+item(foreign,true);
      if(msg)h+=`<div class="lp-empty">${esc(msg)}</div>`;
      body.innerHTML=h;
      const all=body.querySelector('.lp-all input');if(all){const boxes=[...body.querySelectorAll('.lp-item input:not(:disabled)')];all.disabled=!boxes.length;all.checked=boxes.length>0&&boxes.every(b=>b.checked)}
    }
    const refresh=()=>{count.textContent=`已選 ${sel.size} 筆`;ok.disabled=sel.size===0;ok.textContent=sel.size?`加入所選單據（${sel.size}）`:'加入所選單據'};
    const toggle=(cb,on)=>{const d=linkableDocs.find(x=>x.no===cb.dataset.no);if(!d)return;cb.checked=on;if(on)sel.set(d.no,d);else sel.delete(d.no)};
    body.addEventListener('change',e=>{const cb=e.target;if(cb.closest('.lp-all')){body.querySelectorAll('.lp-item input:not(:disabled)').forEach(b=>toggle(b,cb.checked))}else if(cb.dataset.no){toggle(cb,cb.checked);const all=body.querySelector('.lp-all input');if(all){const boxes=[...body.querySelectorAll('.lp-item input:not(:disabled)')];all.checked=boxes.length>0&&boxes.every(b=>b.checked)}}refresh()});
    typeSel.addEventListener('change',render);q.addEventListener('input',render);
    const close=()=>{document.removeEventListener('keydown',onKey,true);ov.remove();document.body.style.overflow=prevOverflow;addBtn.focus()};
    const onKey=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close()}else if(e.key==='Tab'){const f=[...ov.querySelectorAll('input:not(:disabled),select,button:not(:disabled)')].filter(x=>x.offsetParent!==null);if(!f.length)return;const first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};
    document.addEventListener('keydown',onKey,true);
    $('.linkpick-x').addEventListener('click',close);$('.lp-cancel').addEventListener('click',close);
    ov.addEventListener('mousedown',e=>{if(e.target===ov)close()});
    ok.addEventListener('click',()=>{if(!sel.size)return;sel.forEach(d=>{if(!taken().includes(d.no))addRow(d)});close()});
    render();refresh();q.focus();
  }
  addBtn.addEventListener('click',openPicker);
  window.__openLinkPicker=openPicker;
  // Demo：新增情境預設沒有關聯單據；其他情境示範兩筆已引用的單據（一筆本人、一筆他人）。
  const demoRows=()=>{rows.innerHTML='';if(typeof role!=='undefined'&&role.value!=='new'){addRow(linkableDocs[0]);addRow(linkableDocs[7])}sync()};
  window.__linkedDemoRows=demoRows;demoRows();role.addEventListener('change',demoRows);
})();

// 接收請款單管理清單傳入的畫面情境。
const claimParams = new URLSearchParams(location.search);
const requestedMode = claimParams.get('mode');
if (requestedMode && [...role.options].some(option => option.value === requestedMode)) {
  role.value = requestedMode;
  mode();
  if (window.__linkedDemoRows) window.__linkedDemoRows();
}

function applyReadonlyClaimView() {
  if (role.value !== 'view') return;
  document.querySelector('#editTop')?.classList.add('view-only');
  document.querySelector('#approvalTop')?.classList.add('view-only');
  document.querySelector('#editActions')?.classList.add('view-only');
  document.querySelector('#approvalActions')?.classList.add('view-only');
  document.querySelector('#returnAlert')?.classList.add('view-only');
  document.querySelector('#approvalDetail')?.classList.remove('view-only');
  document.querySelectorAll('.control').forEach(control => { if (control !== role) control.disabled = true; });
  document.querySelector('.add')?.classList.add('view-only');document.querySelector('#detailRows')?.closest('.panel')?.classList.add('detail-readonly');document.querySelector('#linkedRows')?.closest('.linked-sec')?.classList.add('detail-readonly');
  document.querySelector('.invoice-add-row')?.classList.add('view-only');document.querySelector('.invoice-table')?.classList.add('invoice-readonly');
  const no = claimParams.get('no') || 'CBS-FRE-2026-00100';
  document.querySelector('#pageTitle').textContent = `查看請款單（${no}）`;
  document.querySelector('#summaryNo').textContent = no;
  document.querySelector('#summaryStatus').textContent = '已送出';
}
if (requestedMode === 'view') applyReadonlyClaimView();
role.addEventListener('change', applyReadonlyClaimView);

// 新增、主管簽核、財務簽核情境不顯示列印、複製（列印、複製僅限與本人相關情境使用）
function syncClaimTopTools() {
  const hide = role.value === 'new' || role.value === 'manager' || role.value === 'finance';
  topTools.classList.toggle('view-only', hide);
}
role.addEventListener('change', syncClaimTopTools);
syncClaimTopTools();

