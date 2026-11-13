/* 系統需求單管理（Demo）：頁籤 我的申請單／待簽核表單／已簽核表單／全部表單／執行管理。
   執行管理只列已核准的單據，欄位精簡為：簽核狀態｜執行狀態｜操作｜申請單號｜需求標題｜期望完成日｜核准日期｜指派PM｜關聯工單。
   執行狀態：未開工單、已開工單、工單已結案、確認停案（未核准的單據顯示「—」）。 */
const rows=[
{status:'草稿',execution:'—',signer:'',no:'尚未產生單號',title:'客服回覆範本管理',type:'新功能開發',systems:['EIP'],applicant:'陳庭瑋(T037)',dept:'人事總務課',expect:'2027/01/31',pm:'',ticket:'',date:'—',approved:'—'},
{status:'申請中',execution:'—',signer:'林家筠(T038)',no:'CBS-ISR-2026-00007',title:'ERP 請款單匯出欄位調整',type:'既有功能調整',systems:['ERP'],applicant:'陳庭瑋(T037)',dept:'人事總務課',expect:'2026/12/20',pm:'',ticket:'',date:'2026/11/10',approved:'—'},
{status:'簽核中',execution:'—',signer:'陳庭瑋(T037)',no:'CBS-ISR-2026-00006',title:'186 商品頁載入過慢',type:'問題修復',systems:['186'],applicant:'王曉明(T021)',dept:'客戶服務部',expect:'2026/11/30',pm:'',ticket:'',date:'2026/11/06',approved:'—'},
{status:'已退回',execution:'—',signer:'',no:'CBS-ISR-2026-00005',title:'會員點數到期提醒',type:'新功能開發',systems:['185','186'],applicant:'陳庭瑋(T037)',dept:'人事總務課',expect:'2027/02/15',pm:'',ticket:'',date:'2026/11/02',approved:'—'},
{status:'已核准',execution:'未開工單',signer:'',no:'CBS-ISR-2026-00004',title:'EIP 公告管理功能',type:'新功能開發',systems:['EIP'],applicant:'陳庭瑋(T037)',dept:'人事總務課',expect:'2026/12/31',pm:'張雅婷(B231)',ticket:'',date:'2026/10/28',approved:'2026/11/05'},
{status:'已核准',execution:'已開工單',signer:'',no:'CBS-ISR-2026-00001',title:'行銷活動抽獎功能',type:'新功能開發',systems:['185','EIP'],applicant:'陳庭瑋(T037)',dept:'人事總務課',expect:'2026/12/15',pm:'王俊凱(B204)',ticket:'CBS-IWO-2026-00012',date:'2026/11/03',approved:'2026/11/08'},
{status:'已核准',execution:'工單已結案',signer:'',no:'CBS-ISR-2026-00002',title:'ERP 庫存報表新增倉別篩選',type:'既有功能調整',systems:['ERP'],applicant:'王曉明(T021)',dept:'客戶服務部',expect:'2026/10/31',pm:'陳志豪(B188)',ticket:'CBS-IWO-2026-00008',date:'2026/09/22',approved:'2026/09/30'},
{status:'已核准',execution:'確認停案',signer:'',no:'CBS-ISR-2026-00003',title:'舊版會員中心改版',type:'其他',systems:['185'],applicant:'林家筠(T038)',dept:'資訊部／SRE',expect:'2026/12/01',pm:'王俊凱(B204)',ticket:'',date:'2026/10/01',approved:'2026/10/12'}];
rows.forEach(x=>{if(!x.creator)x.creator=x.applicant});
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],me='陳庭瑋(T037)';let tab='mine',view=[];
const FINAL=['工單已結案','確認停案'];
function mine(x){return x.applicant===me||x.creator===me}
function ymd(v){return(v||'').replace(/\D/g,'').slice(0,8)}
function rowDate(v){return(v||'').slice(0,10).replace(/\D/g,'')}
function inRange(v,from,to){if(!from&&!to)return true;const d=rowDate(v);if(!d)return false;if(from&&d<from)return false;if(to&&d>to)return false;return true}
function personName(v){return String(v||'').replace(/\([^)]*\)\s*$/,'').trim()}
function personId(v){const m=String(v||'').match(/\(([^)]*)\)\s*$/);return m?m[1]:''}
function selectedStatuses(){return $$('#statusFilter input:checked').map(x=>x.value)}
function keywordMatch(x,q){if(!q)return true;const type=$('#keywordType').value;const values={no:x.no,title:x.title,applicantName:personName(x.applicant),applicantId:personId(x.applicant),dept:x.dept,pm:x.pm,ticket:x.ticket};const value=type==='all'?Object.values(values).join(' '):values[type];return String(value||'').toLowerCase().includes(q.toLowerCase())}
function filtered(){const q=$('#keyword').value.trim(),statuses=selectedStatuses();const af=ymd($('#applyFrom').value),at=ymd($('#applyTo').value),pf=ymd($('#approveFrom').value),pt=ymd($('#approveTo').value),ex=$('#execution').value,ty=$('#reqType').value,sy=$('#reqSystem').value,pmv=tab==='execution'?$('#pmFilter').value:'';
  return rows.filter(x=>(tab!=='mine'||mine(x))&&(tab!=='todo'||x.signer===me)&&(tab!=='signed'||x.status==='已核准')&&(tab!=='execution'||x.status==='已核准')&&(!statuses.length||statuses.includes(x.status))&&(!ex||x.execution===ex)&&(!ty||x.type===ty)&&(!sy||x.systems.includes(sy))&&(!pmv||(pmv==='__none'?!x.pm:x.pm===pmv))&&keywordMatch(x,q)&&inRange(x.date,af,at)&&inRange(x.approved,pf,pt))}
function pageMode(x){if(x.status==='草稿'||x.status==='已退回')return'edit';if(x.signer===me)return'approve';if(tab==='execution'&&x.status==='已核准'&&!FINAL.includes(x.execution))return'execute';return'view'}
function actionText(x){const m=pageMode(x);return{edit:'編輯',approve:'簽核',execute:'執行',view:'查看'}[m]}
function tone(x){return x.status==='草稿'?'draft':x.status==='已退回'?'rejected':x.status==='已核准'?'approved':x.status==='簽核中'?'signing':'applying'}
function execTone(x){return x.execution==='工單已結案'?'exec-done':x.execution==='確認停案'?'rejected':x.execution==='—'?'draft':'exec-pending'}
function execTag(x){return x.execution==='—'?'—':`<span class="status ${execTone(x)}">${x.execution}</span>`}
function truncate(s,n){s=String(s??'');return s.length>n?s.slice(0,n)+'...':s}
function actionsCell(x,i){
  if(tab==='todo'||tab==='signed'||!mine(x))return'<td class="col-req-std"></td><td class="col-req-std"></td>';
  return`<td class="col-req-std"><button class="icon-action" type="button" title="列印" data-print-i="${i}">🖨</button></td><td class="col-req-std"><a class="icon-action" href="detail.html?mode=new&copy=${encodeURIComponent(x.no)}" title="複製為新申請">📋</a></td>`;
}
const link=x=>`detail.html?mode=${pageMode(x)}&no=${encodeURIComponent(x.no)}`;
function syncPmFilter(){const on=tab==='execution';$('#pmField').hidden=!on;if(!on)$('#pmFilter').value=''}
function render(){syncPmFilter();view=filtered();$('.table-wrap').classList.toggle('is-exec',tab==='execution');$('#count').textContent=view.length;
  $('#rows').innerHTML=view.map((x,i)=>`<tr><td class="col-req-std"><input class="pick" data-i="${i}" type="checkbox"></td><td><span class="status ${tone(x)}">${x.status}</span></td><td>${execTag(x)}</td><td><a class="row-action" href="${link(x)}">${actionText(x)}</a></td><td>${x.no}</td><td title="${x.title}">${truncate(x.title,18)}</td><td class="col-req-std">${x.type}</td><td class="col-req-std">${x.applicant}</td><td class="col-req-std">${x.dept}</td><td>${x.expect}</td><td class="col-req-exec">${x.approved}</td><td>${x.pm||'—'}</td><td class="col-req-exec">${x.ticket||'—'}</td><td class="col-req-std">${x.date}</td><td class="col-req-std">${x.approved}</td>${actionsCell(x,i)}</tr>`).join('');
  $('#mobileCards').innerHTML=view.map(x=>`<a class="mobile-claim-card" href="${link(x)}"><div class="mobile-claim-head"><span class="mobile-status ${tone(x)}">${x.status}</span></div><strong class="mobile-claim-no">${x.no}</strong><div class="mobile-company" title="${x.title}">${truncate(x.title,18)}</div><div class="mobile-claim-meta">${tab==='execution'?'':`<span>申請人：${x.applicant}</span><span>申請日期：${x.date}</span>`}<span class="full">執行狀態：${x.execution==='—'?'—':`<span class="mobile-status ${execTone(x)}">${x.execution}</span>`}</span><span>期望完成日：${x.expect}</span>${tab==='execution'?`<span>核准日期：${x.approved}</span>`:''}<span>指派PM：${x.pm||'—'}</span>${tab==='execution'?`<span class="full">關聯工單：${x.ticket||'—'}</span>`:''}</div><div class="mobile-claim-foot"><strong>${x.type}</strong><span>${actionText(x)} <b aria-hidden="true">›</b></span></div></a>`).join('');
  $('#empty').hidden=!!view.length;$('#mobileEmpty').hidden=!!view.length;$('#selectAll').checked=false;selected()}
function selected(){const a=$$('.pick:checked').map(x=>view[+x.dataset.i]);$('#selected').textContent=a.length;$('#withdraw').disabled=!a.some(x=>mine(x)&&x.status==='申請中');$('#remove').disabled=!a.some(x=>mine(x)&&x.status==='草稿');return a}
$$('.tab').forEach(x=>x.onclick=()=>{$$('.tab').forEach(y=>y.classList.remove('active'));x.classList.add('active');tab=x.dataset.tab;$('#mobileTab').value=tab;render()});
$('#mobileTab').onchange=e=>{tab=e.target.value;$$('.tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));render()};
$('#search').onclick=render;$('#keyword').addEventListener('keydown',e=>{if(e.key==='Enter')render()});
$('#clear').onclick=()=>{$$('.filters select,.filters input').forEach(x=>x.value='');$$('#statusFilter input').forEach(x=>x.checked=false);$('#statusSummary').textContent='全部';$('#keywordType').value='all';render()};
$$('#statusFilter input').forEach(x=>x.onchange=()=>{const v=selectedStatuses();$('#statusSummary').textContent=v.length?v.join('、'):'全部'});
$('#selectAll').onchange=e=>{$$('.pick').forEach(x=>x.checked=e.target.checked);selected()};$('#rows').onchange=selected;
$('#withdraw').onclick=()=>{const sel=selected(),ok=sel.filter(x=>mine(x)&&x.status==='申請中');ok.forEach(x=>{x.status='草稿';x.signer='';x.no='尚未產生單號';x.date='—'});alert(`撤回完成：成功 ${ok.length} 筆，未處理 ${sel.length-ok.length} 筆。`);render()};
$('#remove').onclick=()=>{const sel=selected(),ok=sel.filter(x=>mine(x)&&x.status==='草稿');if(!confirm(`確定刪除符合條件的 ${ok.length} 筆草稿？`))return;ok.forEach(x=>rows.splice(rows.indexOf(x),1));alert(`刪除完成：成功 ${ok.length} 筆，未處理 ${sel.length-ok.length} 筆。`);render()};
$('#rows').addEventListener('click',e=>{if(e.target.closest('[data-print-i]'))alert('列印示意畫面請至「內容頁」使用列印功能查看。')});
render();
