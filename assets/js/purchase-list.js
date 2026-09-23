const data=[
{status:'草稿',wait:'—',no:'尚未產生單號',company:'網家跨境服務股份有限公司',applicantUnit:'後勤支援部／人事總務課',unit:'後勤支援部／人事總務課',purpose:'訂單出貨',product:'辦公文具',applicant:'陳庭瑋 (T037)',need:'2026/10/15',apply:'—',approve:'—',mode:'edit'},
{status:'申請中',wait:'林家筠 (T038)',no:'CBS-FPU-2026-00105',company:'網家跨境服務股份有限公司',applicantUnit:'後勤支援部／人事總務課',unit:'後勤支援部／人事總務課',purpose:'測試',product:'測試治具',applicant:'陳庭瑋 (T037)',need:'2026/10/10',apply:'2026/09/18',approve:'—',mode:'view'},
{status:'簽核中',wait:'陳志明 (A008)',no:'CBS-FPU-2026-00102',company:'網家跨境服務股份有限公司',applicantUnit:'客服部',unit:'代標代購事業本部／代購部',purpose:'訂單出貨',product:'筆記型電腦',applicant:'王曉明 (T021)',creator:'陳庭瑋 (T037)',need:'2026/10/03',apply:'2026/09/16',approve:'—',mode:'approve'},
{status:'已核准',wait:'—',no:'CBS-FPU-2026-00098',company:'網家跨境服務股份有限公司',applicantUnit:'後勤支援部／人事總務課',unit:'後勤支援部／人事總務課',purpose:'個人領用',product:'辦公耗材',applicant:'林家筠 (T038)',need:'2026/09/30',apply:'2026/09/12',approve:'2026/09/17',mode:'view',signedByMe:true}
];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const me='陳庭瑋 (T037)',pageSize=20;let tab='mine',page=1,shown=[];
data.forEach(r=>{if(!r.creator)r.creator=r.applicant});
function mine(r){return r.applicant===me||r.creator===me}
const ymd=v=>(v||'').replace(/\D/g,'').slice(0,8),rowDate=v=>v==='—'?'':ymd(v);
function person(v){const m=String(v||'').match(/^(.*?)\s*\(([^)]+)\)$/);return{name:m?m[1]:v,id:m?m[2]:''}}
function dept(v){return String(v||'').split('／').pop()}
function cls(s){return s==='草稿'?'draft':s==='申請中'?'applying':s==='簽核中'?'signing':s==='已核准'?'approved':s==='已退回'?'rejected':''}
function act(r){return r.mode==='edit'?'編輯':r.mode==='approve'?'簽核':'查看'}
function printNotice(){alert('列印示意畫面請至「內容頁」使用列印功能查看。')}
function actionsCell(r){if(tab==='todo'||tab==='signed'||!mine(r))return'<td></td><td></td>';return`<td><button class="icon-action" title="列印" onclick="printNotice('${r.no}')">🖨</button></td><td><a class="icon-action" title="複製為新單" href="detail.html?mode=new">📋</a></td>`}
function selectedStatuses(){return $$('#statusFilter input:checked').map(x=>x.value)}
function filtered(){
 const statuses=selectedStatuses(),co=$('#company').value,key=$('#keyword').value.trim().toLowerCase(),type=$('#keywordType').value,af=ymd($('#applyFrom').value),at=ymd($('#applyTo').value),pf=ymd($('#approveFrom').value),pt=ymd($('#approveTo').value);
 return data.filter(r=>{
  if(tab==='mine'&&!mine(r)||tab==='todo'&&r.mode!=='approve'||tab==='signed'&&!r.signedByMe)return false;
  if(statuses.length&&!statuses.includes(r.status)||co&&r.company!==co)return false;
  if(key){const p=person(r.applicant),values={no:r.no,product:r.product,applicantName:p.name,applicantId:p.id,purpose:r.purpose,applicantUnit:r.applicantUnit,unit:r.unit},target=type==='all'?Object.values(values).join(' '):values[type];if(!String(target||'').toLowerCase().includes(key))return false}
  const ad=rowDate(r.apply),pd=rowDate(r.approve);if(af&&(!ad||ad<af)||at&&(!ad||ad>at)||pf&&(!pd||pd<pf)||pt&&(!pd||pd>pt))return false;
  return true
 }).sort((a,b)=>rowDate(b.apply).localeCompare(rowDate(a.apply)))
}
function render(){
 const all=filtered(),pages=Math.max(1,Math.ceil(all.length/pageSize));page=Math.min(page,pages);shown=all.slice((page-1)*pageSize,page*pageSize);
 $('#count').textContent=all.length;$('#pageText').textContent=`${page} / ${pages}`;$('#prevPage').disabled=page===1;$('#nextPage').disabled=page===pages;
 $('#rows').innerHTML=shown.map((r,i)=>`<tr><td><input class="pick" type="checkbox" data-i="${i}" aria-label="選取 ${r.no}"></td><td><span class="status ${cls(r.status)}">${r.status}</span></td><td>${r.wait}</td><td><a class="row-action" href="detail.html?mode=${r.mode}">${act(r)}</a></td><td>${r.no}</td><td>${r.company}</td><td>${dept(r.applicantUnit)}</td><td>${dept(r.unit)}</td><td>${r.applicant}</td><td>${r.need}</td><td>${r.apply}</td><td>${r.approve}</td>${actionsCell(r)}</tr>`).join('');
 $('#cards').innerHTML=shown.map(r=>`<a class="mobile-claim-card" href="detail.html?mode=${r.mode}"><div class="mobile-claim-head"><span class="mobile-status ${cls(r.status)}">${r.status}</span>${r.wait&&r.wait!=='—'?`<span class="mobile-signer">待簽核：${r.wait}</span>`:''}</div><strong class="mobile-claim-no">${r.no}</strong><div class="mobile-claim-meta"><span>申請人：${r.applicant}</span><span>需用日期：${r.need}</span><span class="full">採購單位：${dept(r.unit)}</span></div><div class="mobile-claim-foot"><span>${r.company}</span><span>${act(r)} <b>›</b></span></div></a>`).join('');
 $('#empty').hidden=shown.length>0;$('#mobileEmpty').hidden=shown.length>0;$('#selectAll').checked=false;selection()
}
function selectedRows(){return $$('.pick:checked').map(x=>shown[Number(x.dataset.i)])}
function selection(){const rows=selectedRows();$('#selected').textContent=rows.length;$('#withdraw').disabled=!rows.some(r=>mine(r)&&r.status==='申請中');$('#remove').disabled=!rows.some(r=>mine(r)&&r.status==='草稿')}
$$('.tab').forEach(b=>b.onclick=()=>{$$('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');tab=b.dataset.tab;$('#mobileTab').value=tab;page=1;render()});
$('#mobileTab').onchange=e=>{tab=e.target.value;$$('.tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));page=1;render()};
$('#search').onclick=()=>{page=1;render()};
$('#clear').onclick=()=>{$$('.filters select,.filters input:not(#statusFilter input)').forEach(x=>x.value='');$$('#statusFilter input').forEach(x=>x.checked=false);$('#statusSummary').textContent='全部';page=1;render()};
$$('#statusFilter input').forEach(x=>x.onchange=()=>{const values=selectedStatuses();$('#statusSummary').textContent=values.length?values.join('、'):'全部'});
$('#selectAll').onchange=e=>{$$('.pick').forEach(x=>x.checked=e.target.checked);selection()};$('#rows').onchange=e=>{if(e.target.classList.contains('pick'))selection()};
$('#prevPage').onclick=()=>{if(page>1){page--;render()}};$('#nextPage').onclick=()=>{page++;render()};
$('#withdraw').onclick=()=>{const rows=selectedRows(),eligible=rows.filter(r=>mine(r)&&r.status==='申請中'),skipped=rows.length-eligible.length;eligible.forEach(r=>{r.status='草稿';r.wait='—';r.no='尚未產生單號';r.apply='—';r.mode='edit'});alert(`撤回完成：成功 ${eligible.length} 筆，未處理 ${skipped} 筆。`);render()};
$('#remove').onclick=()=>{const rows=selectedRows(),eligible=rows.filter(r=>mine(r)&&r.status==='草稿'),skipped=rows.length-eligible.length;if(!confirm(`確定刪除符合條件的 ${eligible.length} 筆草稿？刪除後前台將不再顯示。`))return;eligible.forEach(r=>data.splice(data.indexOf(r),1));alert(`刪除完成：成功 ${eligible.length} 筆，未處理 ${skipped} 筆。`);render()};
render();
