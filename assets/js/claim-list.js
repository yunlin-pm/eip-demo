const data=[
{status:'草稿',signer:'',no:'尚未產生單號',company:'網家跨境服務股份有限公司',subject:'租金支出',amount:0,applicant:'陳庭瑋',apply:'2026/08/14',approved:'—'},
{status:'已退回',signer:'',no:'CBS-FRE-2026-00033',company:'網家跨境服務股份有限公司',subject:'文具用品',amount:100,applicant:'陳庭瑋',apply:'2026/08/13',approved:'—'},
{status:'已核准',signer:'',no:'CBS-FRE-2026-00030',company:'網家跨境服務股份有限公司',subject:'郵資',amount:10000000,applicant:'陳庭瑋',apply:'2026/08/12',approved:'2026/08/14 15:20'},
{status:'已退回',signer:'',no:'CBS-FRE-2026-00029',company:'網家跨境服務股份有限公司',subject:'郵電費',amount:68000,applicant:'陳庭瑋',apply:'2026/08/12',approved:'—'},
{status:'已退回',signer:'',no:'CBS-FRE-2026-00028',company:'網家跨境服務股份有限公司',subject:'旅費',amount:579,applicant:'陳庭瑋',apply:'2026/08/12',approved:'—'},
{status:'申請中',signer:'陳庭瑋',no:'CBS-FRE-2026-00016',company:'網家跨境服務股份有限公司',subject:'修繕費',amount:2300,applicant:'王曉明',creator:'陳庭瑋',apply:'2026/08/03',approved:'—'},
{status:'申請中',signer:'羅弘奕',no:'CBS-FRE-2026-00015',company:'網家跨境服務股份有限公司',subject:'廣告費',amount:100,applicant:'陳庭瑋',apply:'2026/07/31',approved:'—'},
{status:'草稿',signer:'',no:'尚未產生單號',company:'網家跨境服務股份有限公司',subject:'保險費',amount:0,applicant:'陳庭瑋',apply:'2026/07/29',approved:'—'},
{status:'申請中',signer:'羅弘奕',no:'CBS-FRE-2026-00014',company:'網家跨境服務股份有限公司',subject:'交際費',amount:100,applicant:'陳庭瑋',apply:'2026/07/29',approved:'—'},
{status:'申請中',signer:'羅弘奕',no:'CBS-FRE-2026-00013',company:'網家跨境服務股份有限公司',subject:'職工福利',amount:100,applicant:'陳庭瑋',apply:'2026/07/29',approved:'—'},
{status:'申請中',signer:'羅弘奕',no:'CBS-FRE-2026-00012',company:'網家跨境服務股份有限公司',subject:'交通費',amount:150,applicant:'陳庭瑋',apply:'2026/07/29',approved:'—'},
{status:'申請中',signer:'羅弘奕',no:'CBS-FRE-2026-00006',company:'網家跨境服務股份有限公司',subject:'雜項費用',amount:100,applicant:'陳庭瑋',apply:'2026/07/27',approved:'—'},
{status:'申請中',signer:'羅弘奕',no:'CBS-FRE-2026-00005',company:'網家跨境服務股份有限公司',subject:'租金支出',amount:150,applicant:'陳庭瑋',apply:'2026/07/27',approved:'—'},
{status:'已核准',signer:'',no:'CBS-FRE-2026-00004',company:'網家跨境服務股份有限公司',subject:'文具用品',amount:300,applicant:'陳庭瑋',apply:'2026/07/23',approved:'2026/07/25 10:08'},
{status:'簽核中',signer:'Carlson',no:'CBS-FRE-2026-00003',company:'網家跨境服務股份有限公司',subject:'郵資',amount:200000,applicant:'陳庭瑋',apply:'2026/07/23',approved:'—'}
];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];const currentUser='陳庭瑋';let tab='mine',shown=[];
const personIds={'陳庭瑋':'T037','王曉明':'T021','羅弘奕':'B019','Carlson':'B136'};
data.forEach((r,i)=>{if(!r.creator)r.creator=r.applicant;r.applicantId=personIds[r.applicant]||'';r.payee=i%3===0?'網家跨境服務股份有限公司':i%3===1?'王小明':'台灣雲端服務股份有限公司';r.signedByCurrentUser=['已核准','簽核中'].includes(r.status)&&r.signer!==currentUser;if(r.status==='草稿')r.apply='—';if(r.subject==='旅費')r.subject='旅費（不含海外出差）';if(r.subject==='雜項費用')r.subject='雜項購置'});
function mine(r){return r.applicant===currentUser||r.creator===currentUser}
function ymd(v){return(v||'').replace(/\D/g,'').slice(0,8)}function rowDate(v){return(v||'').slice(0,10).replace(/\D/g,'')}
function modeFor(r){if(r.status==='草稿')return'edit';if(r.status==='已退回')return'returned-full';if(r.signer===currentUser)return'manager';return'view'}
function selectedStatuses(){return $$('#statusFilter input:checked').map(x=>x.value)}
function filtered(){const statuses=selectedStatuses(),sub=$('#subject').value,co=$('#company').value,key=$('#keyword').value.trim().toLowerCase(),keyType=$('#keywordType').value||'all',af=ymd($('#applyFrom').value),at=ymd($('#applyTo').value),pf=ymd($('#approveFrom').value),pt=ymd($('#approveTo').value);return data.filter(r=>{if(tab==='mine'&&!mine(r))return false;if(tab==='todo'&&r.signer!==currentUser)return false;if(tab==='signed'&&!r.signedByCurrentUser)return false;if(statuses.length&&!statuses.includes(r.status))return false;if(sub&&r.subject!==sub)return false;if(co&&r.company!==co)return false;if(key){const values={applicantName:r.applicant,applicantId:r.applicantId,no:r.no,payee:r.payee};const target=keyType==='all'?Object.values(values).join(' '):values[keyType];if(!String(target||'').toLowerCase().includes(key))return false}const ad=rowDate(r.apply),pd=rowDate(r.approved);if(af&&ad<af||at&&ad>at||pf&&(!pd||pd<pf)||pt&&(!pd||pd>pt))return false;return true})}
function statusTone(r){return r.status==='已退回'?'rejected':r.status==='已核准'?'approved':r.status==='草稿'?'draft':r.status==='簽核中'?'signing':'applying'}
function actionText(r){return r.status==='草稿'?'繼續編輯':r.status==='已退回'?'編輯':r.signer===currentUser?'簽核':'查看'}
function displayPerson(name){return name&&personIds[name]?`${name}(${personIds[name]})`:name}
function actionsCell(r){if(!mine(r))return'<td></td><td></td>';return`<td><button class="icon-action" title="列印" onclick="window.print()">🖨</button></td><td><a class="icon-action" title="複製為新單" href="../forms/claim-detail.html?mode=new&copy=${encodeURIComponent(r.no)}">📋</a></td>`}
function render(){
shown=filtered();
$('#count').textContent=shown.length;
$('#rows').innerHTML=shown.map((r,i)=>`<tr><td><input class="pick" type="checkbox" data-i="${i}" aria-label="選取 ${r.no}"></td><td><span class="status ${statusTone(r)}">${r.status}</span></td><td>${r.signer?displayPerson(r.signer):'—'}</td><td><a class="row-action" href="../forms/claim-detail.html?mode=${modeFor(r)}&no=${encodeURIComponent(r.no)}">${actionText(r)}</a></td><td>${r.no}</td><td class="company" title="${r.company}">${r.company}</td><td>${r.subject}</td><td class="right">NT$ ${r.amount.toLocaleString('zh-TW')}</td><td>${displayPerson(r.applicant)}</td><td>${r.apply}</td><td>${r.approved}</td>${actionsCell(r)}</tr>`).join('');
const cards=$('#mobileCards');
if(cards)cards.innerHTML=shown.map(r=>`<a class="mobile-claim-card" href="../forms/claim-detail.html?mode=${modeFor(r)}&no=${encodeURIComponent(r.no)}"><div class="mobile-claim-head"><span class="mobile-status ${statusTone(r)}">${r.status}</span>${r.signer?`<span class="mobile-signer">待簽核：${displayPerson(r.signer)}</span>`:''}</div><strong class="mobile-claim-no">${r.no}</strong><div class="mobile-company">${r.company}</div><div class="mobile-claim-meta ${r.status==='草稿'?'is-draft':''}"><span>申請人：${displayPerson(r.applicant)}</span>${r.status==='草稿'?'':`<span>申請日期：${r.apply}</span>`}</div><div class="mobile-claim-foot"><strong>NT$ ${r.amount.toLocaleString('zh-TW')}</strong><span>${actionText(r)} <b aria-hidden="true">›</b></span></div></a>`).join('');
$('#empty').hidden=shown.length>0;
if($('#mobileEmpty'))$('#mobileEmpty').hidden=shown.length>0;
$('#selectAll').checked=false;
selection()
}
function selectedRows(){return $$('.pick:checked').map(x=>shown[Number(x.dataset.i)])}
function selection(){const rows=selectedRows(),n=rows.length;$('#selected').textContent=n;$('#withdraw').disabled=!rows.some(r=>mine(r)&&r.status==='申請中');$('#remove').disabled=!rows.some(r=>mine(r)&&r.status==='草稿')}
$$('.tab').forEach(b=>b.onclick=()=>{$$('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');tab=b.dataset.tab;if($('#mobileTab'))$('#mobileTab').value=tab;render()});
if($('#mobileTab'))$('#mobileTab').onchange=e=>{tab=e.target.value;$$('.tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));render()};
$('#search').onclick=render;
$('#clear').onclick=()=>{$('#subject').value='';$('#company').value='';$('#keywordType').value='all';$('#keyword').value='';$('#applyFrom').value='';$('#applyTo').value='';$('#approveFrom').value='';$('#approveTo').value='';$$('#statusFilter input').forEach(x=>x.checked=false);$('#statusSummary').textContent='全部';render()};
$('#selectAll').onchange=e=>{$$('.pick').forEach(x=>x.checked=e.target.checked);selection()};
$('#rows').onchange=e=>{if(e.target.classList.contains('pick'))selection()};
$$('#statusFilter input').forEach(x=>x.onchange=()=>{const values=selectedStatuses();$('#statusSummary').textContent=values.length?values.join('、'):'全部'});
$('#withdraw').onclick=()=>{const selected=selectedRows(),eligible=selected.filter(r=>mine(r)&&r.status==='申請中'),skipped=selected.length-eligible.length;eligible.forEach(r=>{r.status='草稿';r.signer='';r.no='尚未產生單號';r.apply='—'});alert(`撤回完成：成功 ${eligible.length} 筆，未處理 ${skipped} 筆。`);render()};
$('#remove').onclick=()=>{const selected=selectedRows(),eligible=selected.filter(r=>mine(r)&&r.status==='草稿'),skipped=selected.length-eligible.length;if(!confirm(`確定刪除符合條件的 ${eligible.length} 筆草稿？刪除後前台將不再顯示。`))return;eligible.forEach(r=>data.splice(data.indexOf(r),1));alert(`刪除完成：成功 ${eligible.length} 筆，未處理 ${skipped} 筆。`);render()};
render();
