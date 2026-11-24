// 國外出差申請管理列表（資料見 travel-data.js）
const data=window.TRAVEL_APPS;
data.forEach(r=>{if(!r.creator)r.creator=r.applicant});
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const me='陳庭瑋 (T037)',pageSize=20;let tab='mine',page=1,shown=[];
const tripDays=r=>Math.round((new Date(r.end)-new Date(r.start))/864e5)+1;
function mine(r){return r.applicant===me||r.creator===me}
const ymd=v=>(v||'').replace(/\D/g,'').slice(0,8),rowDate=v=>v==='—'?'':ymd(v);
function selectedStatuses(){return $$('#statusFilter input:checked').map(x=>x.value)}
function person(v){const m=String(v||'').match(/^(.*?)\s*\(([^)]+)\)$/);return{name:m?m[1]:v,id:m?m[2]:''}}
function tone(s){return s==='已作廢'?'voided':s==='草稿'?'draft':s==='已核准'?'approved':s==='已退回'?'rejected':s==='申請中'?'applying':'signing'}
// 作廢：僅申請人本人可作廢申請中、簽核中、已核准、已退回的單據（新增人、主管不可作廢）；草稿請用「刪除」
const VOIDABLE=['申請中','簽核中','已核准','已退回'];
const canVoid=r=>r.applicant===me&&VOIDABLE.includes(r.status);
const voidQS=r=>'&reason='+encodeURIComponent(r.voidReason||'')+'&at='+encodeURIComponent(r.voidAt||'')+'&from='+encodeURIComponent(r.voidedFrom||'');
function mode(r){return r.status==='已作廢'?'voided':r.status==='草稿'||r.status==='已退回'?'edit':r.signer===me?'approve':r.status==='已核准'&&mine(r)?'approved':canVoid(r)?'viewOwn':'view'}
function action(r){const m=mode(r);return m==='edit'?'修改':m==='approve'?'簽核':'查看'}
// 已核准且為本人的單據，操作欄另提供「請款」：開新的國外出差請款單並帶入此出差申請
function claimLink(r){return r.status==='已核准'&&mine(r)?` <span class="op-sep">｜</span><a class="row-action" href="../travel-expenses/detail.html?mode=new&htr=${encodeURIComponent(r.no)}">請款</a>`:''}
function link(r){const m=mode(r),b=`detail.html?mode=${m}&no=${encodeURIComponent(r.no)}`;return m==='voided'?b+voidQS(r)+(mine(r)?'':'&copy=0'):m==='edit'?b+'&st='+encodeURIComponent(r.status):m==='viewOwn'?b+'&st='+encodeURIComponent(r.status):b}
function filtered(){
 const statuses=selectedStatuses(),co=$('#company').value,tf=ymd($('#tripFrom').value),tt=ymd($('#tripTo').value),key=$('#keyword').value.trim().toLowerCase(),type=$('#keywordType').value,af=ymd($('#applyFrom').value),at=ymd($('#applyTo').value),pf=ymd($('#approveFrom').value),pt=ymd($('#approveTo').value);
 return data.filter(r=>{
  if(tab==='mine'&&!mine(r)||tab==='todo'&&r.signer!==me||tab==='signed'&&!r.signedByMe)return false;
  if(statuses.length&&!statuses.includes(r.status)||co&&r.company!==co)return false;
  if(tf&&ymd(r.end)<tf||tt&&ymd(r.start)>tt)return false;
  if(key){const p=person(r.applicant),values={no:r.no,place:r.place,reason:r.reason,applicantName:p.name,applicantId:p.id},target=type==='all'?Object.values(values).join(' '):values[type];if(!String(target||'').toLowerCase().includes(key))return false}
  const ad=rowDate(r.apply),pd=rowDate(r.approved);if(af&&(!ad||ad<af)||at&&(!ad||ad>at)||pf&&(!pd||pd<pf)||pt&&(!pd||pd>pt))return false;
  return true
 }).sort((a,b)=>rowDate(b.apply).localeCompare(rowDate(a.apply)))
}
function render(){
 const all=filtered(),pages=Math.max(1,Math.ceil(all.length/pageSize));page=Math.min(page,pages);shown=all.slice((page-1)*pageSize,page*pageSize);
 $('#count').textContent=all.length;$('#pageText').textContent=`${page} / ${pages}`;$('#prevPage').disabled=page===1;$('#nextPage').disabled=page===pages;
 $('#rows').innerHTML=shown.map((r,i)=>`<tr><td><input class="pick" type="checkbox" data-i="${i}" aria-label="選取 ${r.no}"></td><td><span class="status ${tone(r.status)}">${r.status}</span></td><td>${r.signer||'—'}</td><td><a class="row-action" href="${link(r)}">${action(r)}</a>${claimLink(r)}</td><td>${r.no}</td><td class="place" title="${r.place}">${r.place}</td><td class="trip">${r.start} ～ ${r.end}</td><td class="num">${tripDays(r)}</td><td>${r.advance}</td><td class="company" title="${r.company}">${r.company}</td><td>${r.unit}</td><td>${r.applicant}</td><td>${r.apply}</td><td>${r.approved}</td>${actionsCell(r,i)}</tr>`).join('');
 $('#cards').innerHTML=shown.map(r=>`<a class="mobile-claim-card" href="${link(r)}"><div class="mobile-claim-head"><span class="mobile-status ${tone(r.status)}">${r.status}</span>${r.signer?`<span class="mobile-signer">待簽核：${r.signer}</span>`:''}</div><strong class="mobile-claim-no">${r.no}</strong><div class="mobile-company">${r.place}　${r.start} ～ ${r.end}（${tripDays(r)} 日）</div><div class="mobile-claim-meta"><span>申請人：${r.applicant}</span><span>申請日期：${r.apply}</span><span class="full">預支費用：${r.advance}　申請單位：${r.unit}</span></div><div class="mobile-claim-foot"><span>${r.company}</span><span>${action(r)} <b>›</b></span></div></a>`).join('');
 $('#empty').hidden=shown.length>0;$('#mobileEmpty').hidden=shown.length>0;$('#selectAll').checked=false;selection()
}
function printGuide(r){
 alert(`此清單列印僅為 Demo 示意，尚未提供清單摘要列印。\n請至國外出差申請「${r.no}」的內容頁使用列印功能，查看完整簽核歷程。`);
}
function actionsCell(r,i){
 if(!mine(r))return'<td></td><td></td>';
 return`<td><button class="icon-action" type="button" title="列印" data-print-i="${i}">🖨</button></td><td><a class="icon-action" title="複製為新單" href="detail.html?mode=new&copy=${encodeURIComponent(r.no)}">📋</a></td>`;
}
$('#rows').addEventListener('click',e=>{const btn=e.target.closest('[data-print-i]');if(btn)printGuide(shown[Number(btn.dataset.printI)])});
function selectedRows(){return $$('.pick:checked').map(x=>shown[Number(x.dataset.i)])}
function selection(){const rows=selectedRows();$('#selected').textContent=rows.length;$('#withdraw').disabled=!rows.some(r=>mine(r)&&r.status==='申請中');$('#remove').disabled=!rows.some(r=>mine(r)&&r.status==='草稿');$('#voidRow').disabled=!(rows.length===1&&canVoid(rows[0]))}
$$('.tab').forEach(b=>b.onclick=()=>{$$('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');tab=b.dataset.tab;$('#mobileTab').value=tab;page=1;render()});
$('#mobileTab').onchange=e=>{tab=e.target.value;$$('.tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));page=1;render()};
$('#search').onclick=()=>{page=1;render()};
$('#clear').onclick=()=>{$('#company').value='';$('#tripFrom').value='';$('#tripTo').value='';$('#keywordType').value='all';$('#keyword').value='';$('#applyFrom').value='';$('#applyTo').value='';$('#approveFrom').value='';$('#approveTo').value='';$$('#statusFilter input').forEach(x=>x.checked=false);$('#statusSummary').textContent='全部';page=1;render()};
$$('#statusFilter input').forEach(x=>x.onchange=()=>{const values=selectedStatuses();$('#statusSummary').textContent=values.length?values.join('、'):'全部'});
$('#selectAll').onchange=e=>{$$('.pick').forEach(x=>x.checked=e.target.checked);selection()};$('#rows').onchange=e=>{if(e.target.classList.contains('pick'))selection()};
$('#prevPage').onclick=()=>{if(page>1){page--;render()}};$('#nextPage').onclick=()=>{page++;render()};
$('#withdraw').onclick=()=>{const rows=selectedRows(),eligible=rows.filter(r=>mine(r)&&r.status==='申請中'),skipped=rows.length-eligible.length;eligible.forEach(r=>{r.status='草稿';r.signer='';r.no='尚未產生單號';r.apply='—'});alert(`撤回完成：成功 ${eligible.length} 筆，未處理 ${skipped} 筆。`);render()};
$('#remove').onclick=()=>{const rows=selectedRows(),eligible=rows.filter(r=>mine(r)&&r.status==='草稿'),skipped=rows.length-eligible.length;if(!confirm(`確定刪除符合條件的 ${eligible.length} 筆草稿？刪除後前台將不再顯示。`))return;eligible.forEach(r=>data.splice(data.indexOf(r),1));alert(`刪除完成：成功 ${eligible.length} 筆，未處理 ${skipped} 筆。`);render()};
$('#voidRow').onclick=()=>{const rows=selectedRows();if(rows.length!==1||!canVoid(rows[0]))return;const r=rows[0];
 ClaimVoid.open({no:r.no,status:r.status,label:'國外出差申請',blockers:ClaimVoid.blockersOf(r.no),
  warn:'此單已核准，作廢前請先確認已繳回預支費用，並取消公司代訂的票券與住宿。',
  onConfirm(reason){const d=new Date(),p=n=>String(n).padStart(2,'0');r.voidedFrom=r.status;r.voidReason=reason;r.voidAt=d.getFullYear()+'/'+p(d.getMonth()+1)+'/'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes());r.status='已作廢';r.signer='';render();ClaimVoid.toast('國外出差申請 '+r.no+' 已作廢。')}})};
render();
