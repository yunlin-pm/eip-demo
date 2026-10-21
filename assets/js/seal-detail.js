const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],params=new URLSearchParams(location.search),mode=$('#mode');
function need(){return $('input[name=need]:checked').value}
function syncNeed(){const borrow=need()==='borrow';$('#borrowFields').hidden=!borrow;$('#printNeed').textContent=borrow?'借用':'蓋用';renderHandling()}
// 借出／歸還紀錄（保管者回壓）：借用＝待借出→已借出→已歸還；蓋用＝待用印→已用印。
let handlingStep={borrow:0,stamp:0},paramStepUsed=false;
// 畫面情境：執行回報＝已核准、尚未回壓；執行完成—印鑑蓋用／已借出／已歸還＝已有回壓紀錄（已借出仍可回壓「已歸還」）。
const DONE={'done-stamp':{need:'stamp',step:1},'done-lent':{need:'borrow',step:1},'done-return':{need:'borrow',step:2}},isDone=m=>m in DONE;
function nowText(){const d=new Date(),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}/${p(d.getMonth()+1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`}
const KEEPER='呂金蓮 (B218)',fmt=v=>v?v.replace(/-/g,'/'):'—';let rec={};  // Demo：執行者＝登入帳號，以印章保管者示意
function resetHandling(){const m=mode.value;if(isDone(m))$(`input[name=need][value=${DONE[m].need}]`).checked=true;
  const key=need()==='borrow'?'borrow':'stamp';let st=0;if(isDone(m))st=DONE[m].step;else if(m!=='execute'&&!paramStepUsed)st=+params.get('step')||0;
  if(m==='view'||m==='approve'||m==='execute'||isDone(m))paramStepUsed=true;
  handlingStep={borrow:0,stamp:0};handlingStep[key]=st;rec={lend:'',lendBy:'',ret:'',retBy:'',stamp:'',stampBy:''};$('#handlingTime').textContent='最後更新時間：—';
  if(st>0){$('#handlingTime').textContent='最後更新時間：2026/09/26 10:20:00';
    if(key==='borrow'){rec.lend='2026-09-25';rec.lendBy=KEEPER;if(st>=2){rec.ret='2026-09-30';rec.retBy=KEEPER}}else{rec.stamp='2026-09-25';rec.stampBy=KEEPER}}}
function renderHandling(){const m=mode.value,borrow=need()==='borrow',key=borrow?'borrow':'stamp',step=handlingStep[key],read=m!=='new'&&m!=='edit',acting=m==='execute'||m==='done-lent';
  $('#handlingPanel').hidden=!(read&&(m==='execute'||step>0));$('#editHandling').hidden=!(isDone(m)&&step>0&&!$('#handlingPanel').hidden);
  $('#borrowRecord').hidden=!borrow;$('#stampRecord').hidden=borrow;
  $('#hLendDate').textContent=fmt(rec.lend);$('#hLendBy').textContent=rec.lendBy||'—';$('#hReturnDate').textContent=fmt(rec.ret);$('#hReturnBy').textContent=rec.retBy||'—';$('#hStampDate').textContent=fmt(rec.stamp);$('#hStampBy').textContent=rec.stampBy||'—';
  const btn=$('#completeAction'),next=borrow?['確認已借出','確認已歸還']:['確認已蓋印'];btn.hidden=!acting||step>=next.length;btn.textContent=next[step]||''}
function syncNeed(){const borrow=need()==='borrow';$('#borrowFields').hidden=!borrow;$('#printNeed').textContent=borrow?'借用':'蓋用';renderHandling()}
function applyMode(){const m=mode.value,read=m!=='new'&&m!=='edit',no=params.get('no')||'CBS-CSI-2026-00003';
  const box={new:'newActions',edit:'editActions',view:'viewActions',approve:'approveActions',execute:'manageActions','done-lent':'manageActions','done-stamp':'doneActions','done-return':'doneActions'}[m];
  $$('#newActions,#editActions,#approveActions,#viewActions,#manageActions,#doneActions').forEach(x=>x.hidden=x.id!==box);
  $('#routePanel').hidden=m==='new';$('#returnAlert').hidden=m!=='edit';$('#opinionSummary').hidden=!read;
  document.body.classList.toggle('readonly',read);document.body.classList.toggle('show-approval-details',read);
  $('#pageTitle').textContent=m==='new'?'新增公司印鑑申請（尚未產生單號）':m==='execute'?`執行回報公司印鑑申請（${no}）`:isDone(m)?`執行完成公司印鑑申請（${no}）`:`${m==='approve'?'簽核':m==='edit'?'編輯':'查看'}公司印鑑申請（${no}）`;
  $('#applyDate').textContent=m==='new'?'申請日期：送出簽核後由系統回寫':'申請日期：2026/09/23';
  $$('input,select,textarea').forEach(el=>{if(el===mode||el.closest('#execModal,#decisionModal'))return;if(el.name==='need'){el.disabled=isDone(m);return}el.disabled=read});syncNeed()}
const startMode=params.get('mode')==='manage'?'execute':params.get('mode')||'new';mode.value=startMode;if(mode.value!==startMode)mode.value='new';if(params.get('need')==='borrow')$('input[name=need][value=borrow]').checked=true;mode.onchange=()=>{resetHandling();history.replaceState(null,'',`?mode=${mode.value}&need=${need()}`);applyMode()};$$('input[name=need]').forEach(x=>x.onchange=()=>{if(mode.value==='execute')resetHandling();syncNeed()});$('#routeToggle').onclick=()=>{const open=$('#routeBody').classList.toggle('route-collapsed');$('#routeToggle').textContent=open?'查看':'收合'};$('#historyLink').onclick=()=>$('#historyModal').hidden=false;$$('[data-close-history]').forEach(x=>x.onclick=()=>$('#historyModal').hidden=true);
function openDecision(type){$('#decisionTitle').textContent=type==='approve'?'核准並批示':'退回原因';$('#decisionOpinion').placeholder=type==='approve'?'可填寫簽核意見（選填），留空可直接核准':'請輸入退回原因（必填）';$('#decisionModal').dataset.type=type;$('#decisionModal').hidden=false}$('#approveBtn').onclick=()=>openDecision('approve');$('#rejectBtn').onclick=()=>openDecision('reject');$$('[data-close-modal]').forEach(x=>x.onclick=()=>$('#decisionModal').hidden=true);$('#decisionConfirm').onclick=()=>{if($('#decisionModal').dataset.type==='reject'&&!$('#decisionOpinion').value.trim()){alert('請輸入退回原因');return}alert($('#decisionModal').dataset.type==='reject'?'已退回申請':'本關已核准');$('#decisionModal').hidden=true};
const docTable=$('.document-table');
function renumberDocs(){$$('.document-row .row-no').forEach((el,i)=>el.textContent=i+1)}
function syncRowAttach(row){const has=!!row.querySelector('.row-file');row.querySelector('.upload-btn').hidden=has}
function newDocRow(){const row=document.createElement('div');row.className='document-row';row.innerHTML='<span class="row-no"></span><input class="control" type="number" min="1" value="1"><input class="control" placeholder="選填"><div class="row-attach"><button class="upload-btn" type="button">📎 選擇上傳附件</button></div><button class="link-btn" type="button">刪除</button>';return row}
docTable.addEventListener('click',e=>{const t=e.target;
  if(t.classList.contains('add-document')){docTable.insertBefore(newDocRow(),t);renumberDocs();return}
  if(t.classList.contains('link-btn')){const rows=$$('.document-row');if(rows.length<=1){alert('至少需保留一列用印文件。');return}t.closest('.document-row').remove();renumberDocs();return}
  if(t.classList.contains('row-file-remove')){const row=t.closest('.document-row');row.querySelector('.row-file').remove();row.querySelector('.upload-btn').hidden=false;return}
  if(t.classList.contains('upload-btn')){const row=t.closest('.document-row'),box=row.querySelector('.row-attach');if(!row.querySelector('.row-file')){const f=document.createElement('div');f.className='row-file';f.innerHTML='<span class="file-thumb">PDF</span><b title="用印文件.pdf">用印文件.pdf</b><button class="row-file-remove" type="button" title="移除附件">×</button>';box.prepend(f);t.hidden=true}}});
$('.add-unit').onclick=()=>alert('已新增一筆會簽單位輸入列。');
// 回填執行紀錄／編輯：彈窗，執行者固定帶登入帳號
let execKind='';
function openExec(kind){execKind=kind;const borrow=need()==='borrow',step=handlingStep[borrow?'borrow':'stamp'],edit=kind==='edit';
  const lbl={lend:'實際借出日期',return:'實際歸還日期',stamp:'實際蓋印日期'};
  $('#execTitle').textContent=edit?'編輯借出／歸還紀錄':'回填執行紀錄';
  $('#execDateLabel').textContent=edit?(borrow?'實際借出日期':'實際蓋印日期'):lbl[kind];
  $('#execDate').value=edit?(borrow?rec.lend:rec.stamp):'';
  $('#execField2').hidden=!(edit&&borrow&&step>=2);$('#execDate2').value=edit&&borrow?rec.ret:'';
  $('#execBy').value=KEEPER;$('#execConfirm').textContent=edit?'儲存':'確認執行完成';$('#execModal').hidden=false;requestAnimationFrame(()=>$('#execDate').focus())}
$$('[data-close-exec]').forEach(x=>x.onclick=()=>$('#execModal').hidden=true);
$('#completeAction').onclick=()=>{const borrow=need()==='borrow',step=handlingStep[borrow?'borrow':'stamp'];openExec(borrow?(step===0?'lend':'return'):'stamp')};
$('#editHandling').onclick=()=>openExec('edit');
$('#execConfirm').onclick=()=>{const borrow=need()==='borrow',key=borrow?'borrow':'stamp',v1=$('#execDate').value,v2=$('#execDate2').value,edit=execKind==='edit';
  const name=edit?(borrow?'實際借出日期':'實際蓋印日期'):{lend:'實際借出日期',return:'實際歸還日期',stamp:'實際蓋印日期'}[execKind];
  if(!v1){alert(`請填寫${name}。`);return}
  if(edit&&!$('#execField2').hidden&&!v2){alert('請填寫實際歸還日期。');return}
  if(edit){if(borrow){rec.lend=v1;rec.lendBy=KEEPER;if(rec.ret){rec.ret=v2;rec.retBy=KEEPER}}else{rec.stamp=v1;rec.stampBy=KEEPER}}
  else if(execKind==='lend'){rec.lend=v1;rec.lendBy=KEEPER}else if(execKind==='return'){rec.ret=v1;rec.retBy=KEEPER}else{rec.stamp=v1;rec.stampBy=KEEPER}
  if(!edit)handlingStep[key]++;$('#handlingTime').textContent='最後更新時間：'+nowText();$('#execModal').hidden=true;renderHandling();
  alert(edit?'已更新借出／歸還紀錄。':execKind==='lend'?'已記錄印鑑借出，並通知申請人與印章保管者。':execKind==='return'?'已記錄印鑑歸還，並通知申請人與印章保管者。':'已記錄蓋印，並通知申請人與印章保管者。')};
resetHandling();
applyMode();
const applicantUnits={T037:'總經理室／後勤支援部／人事總務課',T021:'代標代購事業本部／客服部'};$('#applicant').onchange=e=>{$('#applicantUnit').textContent=applicantUnits[e.target.value]||'未設定所屬部門';$('#printApplicantUnit').textContent=$('#applicantUnit').textContent;$('#printApplicant').textContent=e.target.selectedOptions[0].textContent};
