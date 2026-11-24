const data=[
{status:'草稿',wait:'—',no:'尚未產生單號',company:'網家跨境服務股份有限公司',applicantUnit:'後勤支援部／人事總務課',unit:'後勤支援部／人事總務課',purpose:'訂單出貨',product:'辦公文具',reason:'部門辦公文具庫存不足，補充日常使用',applicant:'陳庭瑋 (T037)',need:'2026/10/15',apply:'—',approve:'—',mode:'edit'},
{status:'申請中',wait:'林家筠 (T038)',no:'CBS-FPU-2026-00105',company:'網家跨境服務股份有限公司',applicantUnit:'後勤支援部／人事總務課',unit:'後勤支援部／人事總務課',purpose:'測試',product:'測試治具',reason:'新品測試需採購測試治具以驗證相容性',applicant:'陳庭瑋 (T037)',need:'2026/10/10',apply:'2026/09/18',approve:'—',mode:'view'},
{status:'簽核中',wait:'陳志明 (A008)',no:'CBS-FPU-2026-00102',company:'網家跨境服務股份有限公司',applicantUnit:'客服部',unit:'代標代購事業本部／代購部',purpose:'訂單出貨',product:'筆記型電腦',reason:'新進人員到職，需配置筆記型電腦',applicant:'王曉明 (T021)',creator:'陳庭瑋 (T037)',need:'2026/10/03',apply:'2026/09/16',approve:'—',mode:'approve'},
{status:'已退回',wait:'—',no:'CBS-FPU-2026-00099',company:'網家跨境服務股份有限公司',applicantUnit:'後勤支援部／人事總務課',unit:'後勤支援部／人事總務課',purpose:'訂單出貨',product:'印表機碳粉匣',reason:'印表機碳粉匣庫存不足，補充後勤部門使用',applicant:'陳庭瑋 (T037)',need:'2026/10/12',apply:'2026/09/09',approve:'—',mode:'edit'},
{status:'簽核中',wait:'陳志明 (A008)',no:'CBS-FPU-2026-00101',company:'網家跨境服務股份有限公司',applicantUnit:'後勤支援部／人事總務課',unit:'後勤支援部／人事總務課',purpose:'參展',product:'展場佈置耗材',reason:'年底商展需採購展場佈置耗材',applicant:'陳庭瑋 (T037)',need:'2026/10/18',apply:'2026/09/14',approve:'—',mode:'view'},
{status:'已核准',wait:'—',no:'CBS-FPU-2026-00108',company:'網家跨境服務股份有限公司',applicantUnit:'後勤支援部／人事總務課',unit:'後勤支援部／人事總務課',purpose:'個人領用',product:'人體工學椅',reason:'後勤同仁座椅老舊，需汰換人體工學椅',applicant:'陳庭瑋 (T037)',need:'2026/10/22',apply:'2026/09/13',approve:'2026/09/16',mode:'view',exec:'pending',buyer:'林家筠 (T038)'},
{status:'已核准',wait:'—',no:'CBS-FPU-2026-00096',company:'網家跨境服務股份有限公司',applicantUnit:'後勤支援部／人事總務課',unit:'後勤支援部／人事總務課',purpose:'測試',product:'測試用行動電源',reason:'新品測試需採購行動電源',applicant:'陳庭瑋 (T037)',need:'2026/09/20',apply:'2026/09/08',approve:'2026/09/12',mode:'view',exec:'done',buyDate:'2026/09/18',buyer:'林家筠 (T038)'},
{status:'已作廢',wait:'—',no:'CBS-FPU-2026-00093',company:'網家跨境服務股份有限公司',applicantUnit:'後勤支援部／人事總務課',unit:'後勤支援部／人事總務課',purpose:'訂單出貨',product:'包裝紙箱',reason:'出貨包材補貨，後改由供應商直送',applicant:'陳庭瑋 (T037)',need:'2026/09/28',apply:'2026/09/05',approve:'—',mode:'voided',voidedFrom:'簽核中',voidReason:'改由供應商直送，不需再採購。',voidAt:'2026/09/19 14:05'},
{status:'已作廢',wait:'—',no:'CBS-FPU-2026-00095',company:'網家跨境服務股份有限公司',applicantUnit:'後勤支援部／人事總務課',unit:'後勤支援部／人事總務課',purpose:'個人領用',product:'辦公室盆栽',reason:'辦公室綠化採購',applicant:'陳庭瑋 (T037)',need:'2026/09/30',apply:'2026/09/06',approve:'2026/09/10',mode:'voided',voidedFrom:'已核准',buyer:'陳庭瑋 (T037)',voidReason:'部門預算凍結，暫緩採購。',voidAt:'2026/09/21 10:20'},
{status:'已核准',wait:'—',no:'CBS-FPU-2026-00098',company:'網家跨境服務股份有限公司',applicantUnit:'後勤支援部／人事總務課',unit:'後勤支援部／人事總務課',purpose:'個人領用',product:'辦公耗材',reason:'月度辦公耗材補貨，供部門日常使用',applicant:'林家筠 (T038)',need:'2026/09/30',apply:'2026/09/12',approve:'2026/09/17',mode:'view',signedByMe:true,exec:'done',buyDate:'2026/09/19',buyer:'陳庭瑋 (T037)'},
{status:'已核准',wait:'—',no:'CBS-FPU-2026-00110',company:'網家跨境服務股份有限公司',applicantUnit:'客服部',unit:'後勤支援部／人事總務課',purpose:'訂單出貨',product:'筆記型電腦',reason:'客服部新進人員到職，需配置筆記型電腦',applicant:'王曉明 (T021)',need:'2026/10/20',apply:'2026/09/15',approve:'2026/09/20',mode:'view',exec:'pending',buyer:'陳庭瑋 (T037)'},
{status:'已核准',wait:'—',no:'CBS-FPU-2026-00112',company:'網家跨境服務股份有限公司',applicantUnit:'客服部',unit:'後勤支援部／人事總務課',purpose:'測試',product:'測試螢幕',reason:'客服部新品測試需採購螢幕',applicant:'王曉明 (T021)',need:'2026/10/25',apply:'2026/09/17',approve:'2026/09/21',mode:'view',exec:'pending',buyer:'林家筠 (T038)'},
{status:'已核准',wait:'—',no:'CBS-FPU-2026-00114',company:'網家跨境服務股份有限公司',applicantUnit:'客服部',unit:'代標代購事業本部／代購部',purpose:'測試',product:'測試手機',reason:'代購部新品測試需採購測試手機',applicant:'王曉明 (T021)',need:'2026/10/28',apply:'2026/09/19',approve:'2026/09/23',mode:'view',exec:'pending',buyer:'蔡明宏 (P015)'},
{status:'已核准',wait:'—',no:'CBS-FPU-2026-00104',company:'網家跨境服務股份有限公司',applicantUnit:'客服部',unit:'後勤支援部／人事總務課',purpose:'訂單出貨',product:'會議室投影機',reason:'會議室投影機故障，需採購替換機種',applicant:'王曉明 (T021)',need:'2026/09/25',apply:'2026/09/10',approve:'2026/09/14',mode:'view',exec:'unable',buyer:'陳庭瑋 (T037)'}
];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const me='陳庭瑋 (T037)',pageSize=20,MY_UNIT='後勤支援部／人事總務課';let role='buyer';let tab='mine',page=1,shown=[];
data.forEach(r=>{if(!r.creator)r.creator=r.applicant});
function mine(r){return r.applicant===me||r.creator===me}
const ymd=v=>(v||'').replace(/\D/g,'').slice(0,8),rowDate=v=>v==='—'?'':ymd(v);
function person(v){const m=String(v||'').match(/^(.*?)\s*\(([^)]+)\)$/);return{name:m?m[1]:v,id:m?m[2]:''}}
function reasonText(v){v=String(v||'');return v.length>20?v.slice(0,20)+'…':v}
function dept(v){return String(v||'').split('／').pop()}
function cls(s){return s==='已作廢'?'voided':s==='草稿'?'draft':s==='申請中'?'applying':s==='簽核中'?'signing':s==='已核准'?'approved':s==='已退回'?'rejected':''}
const EXEC_LABEL={pending:'尚未執行',done:'採購完成',unable:'不予採購'},EXEC_TONE={'尚未執行':'gray','採購完成':'green','不予採購':'red'};
const execLabel=r=>r.status==='已核准'?EXEC_LABEL[r.exec]||'尚未執行':'—';
function execCell(r){const t=execLabel(r);return EXEC_TONE[t]?`<span class="exec-tag ${EXEC_TONE[t]}">${t}</span>`:t}
const VOIDABLE=['申請中','簽核中','已核准','已退回'];
function canVoid(r){return r.applicant===me&&VOIDABLE.includes(r.status)}
// 申請人查看時帶入的狀態：已核准依執行狀態區分（尚未執行／採購完成／不予採購）
function stText(r){return r.status==='已核准'?execLabel(r):r.status}
function voidQS(r){return '&no='+encodeURIComponent(r.no)+'&reason='+encodeURIComponent(r.voidReason||'')+'&at='+encodeURIComponent(r.voidAt||'')+'&from='+encodeURIComponent(r.voidedFrom||'')}
// 執行管理（2026-11-23 起依角色顯示）：採購主管與該採購單位的指定採購人員，看到歸屬該採購單位的全部已核准單據；採購人員只能處理指定給自己的單據
function execVisible(r){return (r.status==='已核准'||r.status==='已作廢'&&r.voidedFrom==='已核准')&&r.unit===MY_UNIT}
function execMode(r){const qs='&no='+encodeURIComponent(r.no)+'&buyer='+encodeURIComponent(r.buyer||'');
  if(r.status==='已作廢')return 'voided'+voidQS(r)+(mine(r)?'':'&copy=0');
  const own=role==='buyer'&&r.buyer===me;
  if(r.exec==='done')return 'done'+(own?'':'&own=0');
  if(r.exec==='unable')return 'unable';
  return role==='manager'?'execManager'+qs:own?'execute':'execView'+qs}
function rowMode(r){if(tab==='exec')return execMode(r);if(r.status==='已作廢')return 'voided'+voidQS(r);if(r.status==='已退回'&&r.applicant===me)return 'editReturned&no='+encodeURIComponent(r.no);if(!(tab==='exec'&&r.status==='已核准')&&r.mode==='view'&&canVoid(r))return 'viewOwn&no='+encodeURIComponent(r.no)+'&st='+encodeURIComponent(stText(r));return tab==='exec'&&r.status==='已核准'?(r.exec==='done'?'done':r.exec==='unable'?'unable':r.buyer===me?'execute':'view'):r.mode}
function act(r){const m=rowMode(r).split('&')[0];return m==='edit'||m==='editReturned'?'編輯':m==='approve'?'簽核':m==='execute'?'回填執行':m==='execManager'?'變更採購人員':'查看'}
function printNotice(){alert('列印示意畫面請至「內容頁」使用列印功能查看。')}
function actionsCell(r){if(tab==='exec')return'';if(tab==='todo'||tab==='signed'||!mine(r))return'<td></td><td></td>';return`<td><button class="icon-action" title="列印" onclick="printNotice('${r.no}')">🖨</button></td><td><a class="icon-action" title="複製為新單" href="detail.html?mode=new">📋</a></td>`}
function selectedStatuses(){return $$('#statusFilter input:checked').map(x=>x.value)}
function filtered(){
 const statuses=selectedStatuses(),co=$('#company').value,key=$('#keyword').value.trim().toLowerCase(),type=$('#keywordType').value,af=ymd($('#applyFrom').value),at=ymd($('#applyTo').value),pf=ymd($('#approveFrom').value),pt=ymd($('#approveTo').value);
 return data.filter(r=>{
  if(tab==='mine'&&!mine(r)||tab==='todo'&&r.mode!=='approve'||tab==='signed'&&!r.signedByMe||tab==='exec'&&!execVisible(r))return false;
  if(tab==='exec'&&$('#execFilter').value&&execLabel(r)!==$('#execFilter').value)return false;
  if(statuses.length&&!statuses.includes(r.status)||co&&r.company!==co)return false;
  if(key){const p=person(r.applicant),values={no:r.no,product:r.product,applicantName:p.name,applicantId:p.id,purpose:r.purpose,reason:r.reason,applicantUnit:r.applicantUnit,unit:r.unit,buyer:r.buyer},target=type==='all'?Object.values(values).join(' '):values[type];if(!String(target||'').toLowerCase().includes(key))return false}
  const ad=rowDate(r.apply),pd=rowDate(r.approve);if(af&&(!ad||ad<af)||at&&(!ad||ad>at)||pf&&(!pd||pd<pf)||pt&&(!pd||pd>pt))return false;
  return true
 }).sort((a,b)=>rowDate(b.apply).localeCompare(rowDate(a.apply)))
}
const EXEC_ORDER=[1,2,4,5,6,7,10,11,8,9,13,14];
function arrangeColumns(){const ex=tab==='exec';$$('.col-need,.col-buyer').forEach(e=>e.style.display=ex?'':'none');$$('.table-wrap tr').forEach(tr=>{const cells=[...tr.children];cells.forEach((c,i)=>{if(c.dataset.ci===undefined)c.dataset.ci=i});const key=c=>{const ci=+c.dataset.ci;if(!ex)return ci;const k=EXEC_ORDER.indexOf(ci);return k<0?100+ci:k};cells.sort((a,b)=>key(a)-key(b)).forEach(c=>tr.appendChild(c))})}
function render(){
 $('.table-wrap').classList.toggle('is-exec',tab==='exec');$('#execFilterField').hidden=tab!=='exec';$('#roleField').hidden=tab!=='exec';$('.resultbar>div').hidden=tab==='exec';$('#selectedText').hidden=tab==='exec';
 const all=filtered(),pages=Math.max(1,Math.ceil(all.length/pageSize));page=Math.min(page,pages);shown=all.slice((page-1)*pageSize,page*pageSize);
 $('#count').textContent=all.length;$('#pageText').textContent=`${page} / ${pages}`;$('#prevPage').disabled=page===1;$('#nextPage').disabled=page===pages;
 $('#rows').innerHTML=shown.map((r,i)=>`<tr><td class="col-pick"><input class="pick" type="checkbox" data-i="${i}" aria-label="選取 ${r.no}"></td><td><span class="status ${cls(r.status)}">${r.status}</span></td><td>${execCell(r)}</td><td class="col-wait">${r.wait}</td><td><a class="row-action" href="detail.html?mode=${rowMode(r)}">${act(r)}</a></td><td>${r.no}</td><td>${r.company}</td><td title="${r.reason}">${reasonText(r.reason)}</td><td>${dept(r.unit)}</td><td class="col-buyer">${r.buyer||'—'}</td><td>${r.applicant}</td><td class="col-need">${r.need}</td><td class="col-apply">${r.apply}</td><td>${r.approve}</td><td class="col-buy">${r.buyDate||'—'}</td>${actionsCell(r)}</tr>`).join('');arrangeColumns();
 $('#cards').innerHTML=shown.map(r=>`<a class="mobile-claim-card" href="detail.html?mode=${rowMode(r)}"><div class="mobile-claim-head"><span class="mobile-status ${cls(r.status)}">${r.status}</span>${execLabel(r)!=='—'?execCell(r):''}${r.wait&&r.wait!=='—'?`<span class="mobile-signer">待簽核：${r.wait}</span>`:''}</div><strong class="mobile-claim-no">${r.no}</strong><div class="mobile-claim-meta"><span>申請人：${r.applicant}</span>${tab==='exec'?`<span>需用日期：${r.need}</span>`:''}<span class="full">採購單位：${dept(r.unit)}</span>${tab==='exec'?`<span class="full">指定採購人員：${r.buyer||'—'}</span>`:''}<span class="full">申請說明：${reasonText(r.reason)}</span></div><div class="mobile-claim-foot"><span>${r.company}</span><span>${act(r)} <b>›</b></span></div></a>`).join('');
 $('#empty').hidden=shown.length>0;$('#mobileEmpty').hidden=shown.length>0;$('#selectAll').checked=false;selection()
}
function selectedRows(){return $$('.pick:checked').map(x=>shown[Number(x.dataset.i)])}
function selection(){const rows=selectedRows();$('#selected').textContent=rows.length;$('#withdraw').disabled=!rows.some(r=>mine(r)&&r.status==='申請中');$('#remove').disabled=!rows.some(r=>mine(r)&&r.status==='草稿');$('#voidRow').disabled=!(rows.length===1&&canVoid(rows[0]))}
$$('.tab').forEach(b=>b.onclick=()=>{$$('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');tab=b.dataset.tab;$('#mobileTab').value=tab;page=1;$('#execFilter').value='';render()});
$('#roleSel').onchange=e=>{role=e.target.value;page=1;render()};
$('#mobileTab').onchange=e=>{tab=e.target.value;$('#execFilter').value='';$$('.tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));page=1;render()};
$('#search').onclick=()=>{page=1;render()};
$('#clear').onclick=()=>{$$('.filters select,.filters input:not(#statusFilter input)').forEach(x=>x.value='');$$('#statusFilter input').forEach(x=>x.checked=false);$('#statusSummary').textContent='全部';page=1;render()};
$$('#statusFilter input').forEach(x=>x.onchange=()=>{const values=selectedStatuses();$('#statusSummary').textContent=values.length?values.join('、'):'全部'});
$('#selectAll').onchange=e=>{$$('.pick').forEach(x=>x.checked=e.target.checked);selection()};$('#rows').onchange=e=>{if(e.target.classList.contains('pick'))selection()};
$('#prevPage').onclick=()=>{if(page>1){page--;render()}};$('#nextPage').onclick=()=>{page++;render()};
$('#withdraw').onclick=()=>{const rows=selectedRows(),eligible=rows.filter(r=>mine(r)&&r.status==='申請中'),skipped=rows.length-eligible.length;eligible.forEach(r=>{r.status='草稿';r.wait='—';r.no='尚未產生單號';r.apply='—';r.mode='edit'});alert(`撤回完成：成功 ${eligible.length} 筆，未處理 ${skipped} 筆。`);render()};
$('#remove').onclick=()=>{const rows=selectedRows(),eligible=rows.filter(r=>mine(r)&&r.status==='草稿'),skipped=rows.length-eligible.length;if(!confirm(`確定刪除符合條件的 ${eligible.length} 筆草稿？刪除後前台將不再顯示。`))return;eligible.forEach(r=>data.splice(data.indexOf(r),1));alert(`刪除完成：成功 ${eligible.length} 筆，未處理 ${skipped} 筆。`);render()};
$('#voidRow').onclick=()=>{
 const rows=selectedRows();if(rows.length!==1||!canVoid(rows[0]))return;const r=rows[0];
 // 已核准：採購人員已回填「採購完成」或標示「不予採購」者不可作廢；尚未執行者可作廢（警語提醒先確認尚未下單）
 const blockMessage=r.status==='已核准'&&r.exec==='done'?'採購人員已回填「採購完成」，無法作廢。':r.status==='已核准'&&r.exec==='unable'?'採購人員已標示「不予採購」（已結案），無法作廢。':'';
 ClaimVoid.open({no:r.no,status:r.status,statusText:r.status==='已核准'?'已核准（'+execLabel(r)+'）':r.status,label:'採購請購單',blockers:ClaimVoid.blockersOf(r.no),blockMessage,
  warn:'此單已核准，作廢前請先與指定採購人員確認尚未向廠商下單。',extraNote:r.status==='已核准'?'指定採購人員在「執行管理」會看到此單標示為「已作廢」，無法再回填執行。':'',
  onConfirm(reason){const d=new Date(),p=n=>String(n).padStart(2,'0');r.voidedFrom=r.status;r.voidReason=reason;r.voidAt=d.getFullYear()+'/'+p(d.getMonth()+1)+'/'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes());r.status='已作廢';r.wait='—';r.mode='voided';render();ClaimVoid.toast('採購請購單 '+r.no+' 已作廢。')}})
};
render();
