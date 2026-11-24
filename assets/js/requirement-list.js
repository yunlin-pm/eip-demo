/* 系統需求單管理（Demo）：頁籤 我的申請單／待簽核表單／已簽核表單／知會我的／全部表單（沒有執行管理）。 */
const rows=[
{status:'草稿',signer:'',no:'尚未產生單號',title:'客服回覆範本管理',type:'新功能開發',systems:['EIP'],applicant:'陳庭瑋(T037)',dept:'人事總務課',expect:'2027/01/31',hours:16,date:'—',approved:'—'},
{status:'申請中',signer:'林家筠(T038)',no:'CBS-ISR-2026-00007',title:'ERP 請款單匯出欄位調整',type:'既有功能調整',systems:['ERP'],applicant:'陳庭瑋(T037)',dept:'人事總務課',expect:'2026/12/20',hours:8,date:'2026/11/10',approved:'—'},
{status:'簽核中',signer:'陳庭瑋(T037)',no:'CBS-ISR-2026-00006',title:'186 商品頁載入過慢',type:'問題修復',systems:['186'],applicant:'王曉明(T021)',dept:'客戶服務部',expect:'2026/11/30',hours:4,date:'2026/11/06',approved:'—'},
{status:'已退回',signer:'',no:'CBS-ISR-2026-00005',title:'會員點數到期提醒',type:'新功能開發',systems:['185','186'],applicant:'陳庭瑋(T037)',dept:'人事總務課',expect:'2027/02/15',hours:null,date:'2026/11/02',approved:'—'},
{status:'已作廢',signer:'',no:'CBS-ISR-2026-00008',title:'客服工單自動分派',type:'新功能開發',systems:['EIP'],applicant:'陳庭瑋(T037)',dept:'人事總務課',expect:'2027/01/15',hours:null,date:'2026/11/12',approved:'—',voidedFrom:'簽核中',voidReason:'改列入明年度專案整體規劃，不單獨申請。',voidAt:'2026/11/13 14:20'},
{status:'已作廢',signer:'',no:'CBS-ISR-2026-00009',title:'ERP 採購單簽核通知',type:'既有功能調整',systems:['ERP'],applicant:'王曉明(T021)',dept:'客戶服務部',expect:'2026/12/10',hours:24,date:'2026/10/20',approved:'2026/10/27',voidedFrom:'已核准',voidReason:'此需求已由其他專案一併處理。',voidAt:'2026/11/04 09:50'},
{status:'已核准',signer:'',no:'CBS-ISR-2026-00004',title:'EIP 公告管理功能',type:'新功能開發',systems:['EIP'],applicant:'陳庭瑋(T037)',dept:'人事總務課',expect:'2026/12/31',hours:120,date:'2026/10/28',approved:'2026/11/05'},
{status:'已核准',signer:'',no:'CBS-ISR-2026-00001',title:'行銷活動抽獎功能',type:'新功能開發',systems:['185','EIP'],applicant:'陳庭瑋(T037)',dept:'人事總務課',expect:'2026/12/15',hours:40,date:'2026/11/03',approved:'2026/11/08'},
{status:'已核准',signer:'',no:'CBS-ISR-2026-00002',title:'ERP 庫存報表新增倉別篩選',type:'既有功能調整',systems:['ERP'],applicant:'王曉明(T021)',dept:'客戶服務部',expect:'2026/10/31',hours:16,date:'2026/09/22',approved:'2026/09/30',notifiedTo:['陳庭瑋(T037)']},
{status:'已核准',signer:'',no:'CBS-ISR-2026-00003',title:'舊版會員中心改版',type:'其他',systems:['185'],applicant:'林家筠(T038)',dept:'資訊部／SRE',expect:'2026/12/01',hours:null,date:'2026/10/01',approved:'2026/10/12',notifiedTo:['陳庭瑋(T037)']}];
rows.forEach(x=>{if(!x.creator)x.creator=x.applicant});
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],me='陳庭瑋(T037)';let tab='mine',view=[];
function mine(x){return x.applicant===me||x.creator===me}
function ymd(v){return(v||'').replace(/\D/g,'').slice(0,8)}
function rowDate(v){return(v||'').slice(0,10).replace(/\D/g,'')}
function inRange(v,from,to){if(!from&&!to)return true;const d=rowDate(v);if(!d)return false;if(from&&d<from)return false;if(to&&d>to)return false;return true}
function personName(v){return String(v||'').replace(/\([^)]*\)\s*$/,'').trim()}
function personId(v){const m=String(v||'').match(/\(([^)]*)\)\s*$/);return m?m[1]:''}
function selectedStatuses(){return $$('#statusFilter input:checked').map(x=>x.value)}
function keywordMatch(x,q){if(!q)return true;const type=$('#keywordType').value;const values={no:x.no,title:x.title,applicantName:personName(x.applicant),applicantId:personId(x.applicant),dept:x.dept};const value=type==='all'?Object.values(values).join(' '):values[type];return String(value||'').toLowerCase().includes(q.toLowerCase())}
function filtered(){const q=$('#keyword').value.trim(),statuses=selectedStatuses();const af=ymd($('#applyFrom').value),at=ymd($('#applyTo').value),pf=ymd($('#approveFrom').value),pt=ymd($('#approveTo').value),ty=$('#reqType').value,sy=$('#reqSystem').value;
  return rows.filter(x=>(tab!=='mine'||mine(x))&&(tab!=='todo'||x.signer===me)&&(tab!=='signed'||x.status==='已核准')&&(tab!=='notified'||x.status==='已核准'&&(x.notifiedTo||[]).includes(me))&&(!statuses.length||statuses.includes(x.status))&&(!ty||x.type===ty)&&(!sy||x.systems.includes(sy))&&keywordMatch(x,q)&&inRange(x.date,af,at)&&inRange(x.approved,pf,pt))}
// 作廢（Demo，規則尚未寫入規格）：僅申請人本人可作廢申請中、簽核中、已退回、已核准的單據（沒有執行階段，已核准也可作廢）；草稿請用「刪除」
const VOIDABLE=['申請中','簽核中','已核准','已退回'];
const canVoid=x=>x.applicant===me&&VOIDABLE.includes(x.status);
const voidQS=x=>'&reason='+encodeURIComponent(x.voidReason||'')+'&at='+encodeURIComponent(x.voidAt||'')+'&from='+encodeURIComponent(x.voidedFrom||'');
function pageMode(x){if(x.status==='已作廢')return'voided'+voidQS(x)+(mine(x)?'':'&copy=0');if(x.status==='草稿'||x.status==='已退回')return'edit&st='+encodeURIComponent(x.status);if(x.signer===me)return'approve';if(canVoid(x))return'viewOwn&st='+encodeURIComponent(x.status);return'view'}
function actionText(x){const m=pageMode(x).split('&')[0];return{edit:'編輯',approve:'簽核',view:'查看',viewOwn:'查看',voided:'查看'}[m]}
function tone(x){return x.status==='已作廢'?'voided':x.status==='草稿'?'draft':x.status==='已退回'?'rejected':x.status==='已核准'?'approved':x.status==='簽核中'?'signing':'applying'}
const hoursText=x=>x.hours==null?'無法預估':'預估 '+x.hours+' 小時';
function truncate(s,n){s=String(s??'');return s.length>n?s.slice(0,n)+'...':s}
function actionsCell(x,i){
  if(tab==='todo'||tab==='signed'||tab==='notified'||!mine(x))return'<td class="col-req-std"></td><td class="col-req-std"></td>';
  return`<td class="col-req-std"><button class="icon-action" type="button" title="列印" data-print-i="${i}">🖨</button></td><td class="col-req-std"><a class="icon-action" href="detail.html?mode=new&copy=${encodeURIComponent(x.no)}" title="複製為新申請">📋</a></td>`;
}
const link=x=>`detail.html?mode=${pageMode(x)}&no=${encodeURIComponent(x.no)}`;
function render(){view=filtered();$('#count').textContent=view.length;
  $('#rows').innerHTML=view.map((x,i)=>`<tr><td class="col-req-std"><input class="pick" data-i="${i}" type="checkbox"></td><td><span class="status ${tone(x)}">${x.status}</span></td><td><a class="row-action" href="${link(x)}">${actionText(x)}</a></td><td>${x.no}</td><td title="${x.title}">${truncate(x.title,18)}</td><td class="col-req-std">${x.type}</td><td class="col-req-std">${x.applicant}</td><td class="col-req-std">${hoursText(x)}</td><td>${x.expect}</td><td class="col-req-std">${x.date}</td><td class="col-req-std">${x.approved}</td>${actionsCell(x,i)}</tr>`).join('');
  $('#mobileCards').innerHTML=view.map(x=>`<a class="mobile-claim-card" href="${link(x)}"><div class="mobile-claim-head"><span class="mobile-status ${tone(x)}">${x.status}</span></div><strong class="mobile-claim-no">${x.no}</strong><div class="mobile-company" title="${x.title}">${truncate(x.title,18)}</div><div class="mobile-claim-meta"><span>申請人：${x.applicant}</span><span>預期工時：${hoursText(x)}</span><span>申請日期：${x.date}</span><span>期望完成日：${x.expect}</span></div><div class="mobile-claim-foot"><strong>${x.type}</strong><span>${actionText(x)} <b aria-hidden="true">›</b></span></div></a>`).join('');
  $('#empty').hidden=!!view.length;$('#mobileEmpty').hidden=!!view.length;$('#selectAll').checked=false;selected()}
function selected(){const a=$$('.pick:checked').map(x=>view[+x.dataset.i]);$('#selected').textContent=a.length;$('#withdraw').disabled=!a.some(x=>mine(x)&&x.status==='申請中');$('#remove').disabled=!a.some(x=>mine(x)&&x.status==='草稿');$('#voidRow').disabled=!(a.length===1&&canVoid(a[0]));return a}
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
$('#voidRow').onclick=()=>{const a=selected();if(a.length!==1||!canVoid(a[0]))return;const x=a[0],approved=x.status==='已核准';
 ClaimVoid.open({no:x.no,status:x.status,statusText:x.status,label:'系統需求單',blockers:ClaimVoid.blockersOf(x.no),
  warn:'此單已核准，作廢前請先確認尚未開始評估或排程。',
  onConfirm(reason){const d=new Date(),p=n=>String(n).padStart(2,'0');x.voidedFrom=x.status;x.voidReason=reason;x.voidAt=d.getFullYear()+'/'+p(d.getMonth()+1)+'/'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes());x.status='已作廢';x.signer='';render();ClaimVoid.toast('系統需求單 '+x.no+' 已作廢。')}})};
