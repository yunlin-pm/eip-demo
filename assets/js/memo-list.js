const data=[
{status:'申請中',signer:'陳庭瑋 (T037)',no:'CBS-GSI-2026-00006',subject:'2027 年度員工健康檢查方案',company:'網家跨境服務股份有限公司',unit:'人事總務課',applicant:'林家筠 (T038)',apply:'2026/09/17',approved:'—',signedByMe:false},
{status:'簽核中',signer:'陳庭瑋 (T037)',no:'CBS-GSI-2026-00005',subject:'客服設備汰換申請',company:'網家跨境服務股份有限公司',unit:'客服部',applicant:'王曉明 (T021)',apply:'2026/09/17',approved:'—',signedByMe:false},
{status:'草稿',signer:'',no:'尚未產生單號',subject:'辦公空間調整提案',company:'網家跨境服務股份有限公司',unit:'人事總務課',applicant:'陳庭瑋 (T037)',apply:'—',approved:'—',signedByMe:false},
{status:'申請中',signer:'羅弘奕 (B019)',no:'CBS-GSI-2026-00003',subject:'年度教育訓練計畫',company:'網家跨境服務股份有限公司',unit:'人事總務課',applicant:'陳庭瑋 (T037)',apply:'2026/09/16',approved:'—',signedByMe:false},
{status:'簽核中',signer:'黃少佑 (B136)',no:'CBS-GSI-2026-00002',subject:'跨部門作業流程調整',company:'網家跨境服務股份有限公司',unit:'訂單服務課',applicant:'王曉明 (T021)',creator:'陳庭瑋 (T037)',apply:'2026/09/15',approved:'—',signedByMe:true},
{status:'已核准',signer:'',no:'CBS-GSI-2026-00007',subject:'客服品質改善方案',company:'網家跨境服務股份有限公司',unit:'客服部',applicant:'王曉明 (T021)',apply:'2026/09/11',approved:'2026/09/17',signedByMe:false,notifiedTo:['陳庭瑋 (T037)']},
{status:'已核准',signer:'',no:'CBS-GSI-2026-00001',subject:'員工活動辦理',company:'網家跨境服務股份有限公司',unit:'人事總務課',applicant:'陳庭瑋 (T037)',apply:'2026/09/10',approved:'2026/09/12',signedByMe:true,notifiedTo:[]},
{status:'已退回',signer:'',no:'CBS-GSI-2026-00004',subject:'辦公設備配置調整',company:'網家跨境服務股份有限公司',unit:'人事總務課',applicant:'陳庭瑋 (T037)',apply:'2026/09/16',approved:'—',signedByMe:false}
];
data.forEach(r=>{if(!r.creator)r.creator=r.applicant});
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const me='陳庭瑋 (T037)',pageSize=20;let tab='mine',page=1,shown=[];
function mine(r){return r.applicant===me||r.creator===me}
const ymd=v=>(v||'').replace(/\D/g,'').slice(0,8),rowDate=v=>v==='—'?'':ymd(v);
function selectedStatuses(){return $$('#statusFilter input:checked').map(x=>x.value)}
function person(v){const m=String(v||'').match(/^(.*?)\s*\(([^)]+)\)$/);return{name:m?m[1]:v,id:m?m[2]:''}}
function tone(s){return s==='草稿'?'draft':s==='已核准'?'approved':s==='已退回'?'rejected':s==='申請中'?'applying':'signing'}
function mode(r){return r.status==='草稿'||r.status==='已退回'?'edit':r.signer===me?'approve':'view'}
function action(r){return mode(r)==='edit'?'修改':mode(r)==='approve'?'簽核':'查看'}
function filtered(){
 const statuses=selectedStatuses(),co=$('#company').value,key=$('#keyword').value.trim().toLowerCase(),type=$('#keywordType').value,af=ymd($('#applyFrom').value),at=ymd($('#applyTo').value),pf=ymd($('#approveFrom').value),pt=ymd($('#approveTo').value);
 return data.filter(r=>{
  if(tab==='mine'&&!mine(r)||tab==='todo'&&r.signer!==me||tab==='signed'&&!r.signedByMe||tab==='notified'&&!(r.status==='已核准'&&(r.notifiedTo||[]).includes(me)))return false;
  if(statuses.length&&!statuses.includes(r.status)||co&&r.company!==co)return false;
  if(key){const p=person(r.applicant),values={no:r.no,subject:r.subject,applicantName:p.name,applicantId:p.id},target=type==='all'?Object.values(values).join(' '):values[type];if(!String(target||'').toLowerCase().includes(key))return false}
  const ad=rowDate(r.apply),pd=rowDate(r.approved);if(af&&(!ad||ad<af)||at&&(!ad||ad>at)||pf&&(!pd||pd<pf)||pt&&(!pd||pd>pt))return false;
  return true
 }).sort((a,b)=>rowDate(b.apply).localeCompare(rowDate(a.apply)))
}
function render(){
 const all=filtered(),pages=Math.max(1,Math.ceil(all.length/pageSize));page=Math.min(page,pages);shown=all.slice((page-1)*pageSize,page*pageSize);
 $('#count').textContent=all.length;$('#pageText').textContent=`${page} / ${pages}`;$('#prevPage').disabled=page===1;$('#nextPage').disabled=page===pages;
 $('#rows').innerHTML=shown.map((r,i)=>`<tr><td><input class="pick" type="checkbox" data-i="${i}" aria-label="選取 ${r.no}"></td><td><span class="status ${tone(r.status)}">${r.status}</span></td><td>${r.signer||'—'}</td><td><a class="row-action" href="detail.html?mode=${mode(r)}&no=${encodeURIComponent(r.no)}">${action(r)}</a></td><td>${r.no}</td><td>${r.subject}</td><td class="company" title="${r.company}">${r.company}</td><td>${r.unit}</td><td>${r.applicant}</td><td>${r.apply}</td><td>${r.approved}</td>${actionsCell(r,i)}</tr>`).join('');
 $('#cards').innerHTML=shown.map(r=>`<a class="mobile-claim-card" href="detail.html?mode=${mode(r)}&no=${encodeURIComponent(r.no)}"><div class="mobile-claim-head"><span class="mobile-status ${tone(r.status)}">${r.status}</span>${r.signer?`<span class="mobile-signer">待簽核：${r.signer}</span>`:''}</div><strong class="mobile-claim-no">${r.no}</strong><div class="mobile-company">${r.subject}</div><div class="mobile-claim-meta"><span>申請人：${r.applicant}</span><span>申請日期：${r.apply}</span><span class="full">申請單位：${r.unit}</span></div><div class="mobile-claim-foot"><span>${r.company}</span><span>${action(r)} <b>›</b></span></div></a>`).join('');
 $('#empty').hidden=shown.length>0;$('#mobileEmpty').hidden=shown.length>0;$('#selectAll').checked=false;selection()
}
function printGuide(r){
 alert('列印示意畫面請至「內容頁」使用列印功能查看。');
}
function actionsCell(r,i){
 if(!mine(r))return'<td></td><td></td>';
 return`<td><button class="icon-action" type="button" title="列印" data-print-i="${i}">🖨</button></td><td><a class="icon-action" title="複製為新單" href="detail.html?mode=new&copy=${encodeURIComponent(r.no)}">📋</a></td>`;
}
$('#rows').addEventListener('click',e=>{const btn=e.target.closest('[data-print-i]');if(btn)printGuide(shown[Number(btn.dataset.printI)])});
function selectedRows(){return $$('.pick:checked').map(x=>shown[Number(x.dataset.i)])}
function selection(){const rows=selectedRows();$('#selected').textContent=rows.length;$('#withdraw').disabled=!rows.some(r=>mine(r)&&r.status==='申請中');$('#remove').disabled=!rows.some(r=>mine(r)&&r.status==='草稿')}
$$('.tab').forEach(b=>b.onclick=()=>{$$('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');tab=b.dataset.tab;$('#mobileTab').value=tab;page=1;render()});
$('#mobileTab').onchange=e=>{tab=e.target.value;$$('.tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));page=1;render()};
$('#search').onclick=()=>{page=1;render()};
$('#clear').onclick=()=>{$('#company').value='';$('#keywordType').value='all';$('#keyword').value='';$('#applyFrom').value='';$('#applyTo').value='';$('#approveFrom').value='';$('#approveTo').value='';$$('#statusFilter input').forEach(x=>x.checked=false);$('#statusSummary').textContent='全部';page=1;render()};
$$('#statusFilter input').forEach(x=>x.onchange=()=>{const values=selectedStatuses();$('#statusSummary').textContent=values.length?values.join('、'):'全部'});
$('#selectAll').onchange=e=>{$$('.pick').forEach(x=>x.checked=e.target.checked);selection()};$('#rows').onchange=e=>{if(e.target.classList.contains('pick'))selection()};
$('#prevPage').onclick=()=>{if(page>1){page--;render()}};$('#nextPage').onclick=()=>{page++;render()};
$('#withdraw').onclick=()=>{const rows=selectedRows(),eligible=rows.filter(r=>mine(r)&&r.status==='申請中'),skipped=rows.length-eligible.length;eligible.forEach(r=>{r.status='草稿';r.signer='';r.no='尚未產生單號';r.apply='—'});alert(`撤回完成：成功 ${eligible.length} 筆，未處理 ${skipped} 筆。`);render()};
$('#remove').onclick=()=>{const rows=selectedRows(),eligible=rows.filter(r=>mine(r)&&r.status==='草稿'),skipped=rows.length-eligible.length;if(!confirm(`確定刪除符合條件的 ${eligible.length} 筆草稿？刪除後前台將不再顯示。`))return;eligible.forEach(r=>data.splice(data.indexOf(r),1));alert(`刪除完成：成功 ${eligible.length} 筆，未處理 ${skipped} 筆。`);render()};
render();
