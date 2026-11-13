const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],params=new URLSearchParams(location.search),mode=$('#mode');
function need(){return $('input[name=need]:checked').value}
function syncNeed(){const borrow=need()==='borrow';$('#borrowFields').hidden=!borrow;$('#printNeed').textContent=borrow?'借用':'蓋用';renderHandling()}
// 借出／歸還紀錄（保管者回壓）：借用＝待借出→已借出→已歸還；蓋用＝待用印→已用印。
let handlingStep={borrow:0,stamp:0},paramStepUsed=false;
// 畫面情境：執行回報＝已核准、尚未回壓；執行人員—文件蓋印完成／印鑑未歸還／印鑑已歸還＝已有回壓紀錄（印鑑未歸還仍可回壓「已歸還」）。
const DONE={'done-stamp':{need:'stamp',step:1},'done-lent':{need:'borrow',step:1},'done-return':{need:'borrow',step:2}},isDone=m=>m in DONE;
// 執行回報分兩種情境，依單據的用印需求：蓋用單＝執行人員—印鑑蓋印（按「確認已蓋印」）；借用單＝執行人員—印鑑借出（按「確認已借出」，回壓後按鈕接著變「確認已歸還」）。
const EXEC={'execute-stamp':'stamp','execute-borrow':'borrow'},isExec=m=>m in EXEC;
function nowText(){const d=new Date(),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}/${p(d.getMonth()+1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`}
const KEEPER='呂金蓮 (B218)',fmt=v=>v?v.replace(/-/g,'/'):'—';let rec={};  // Demo：執行者＝登入帳號，以印章保管者示意
function resetHandling(){const m=mode.value;if(isDone(m))$(`input[name=need][value=${DONE[m].need}]`).checked=true;else if(isExec(m))$(`input[name=need][value=${EXEC[m]}]`).checked=true;
  const key=need()==='borrow'?'borrow':'stamp';let st=0;if(isDone(m))st=DONE[m].step;else if(!isExec(m)&&!paramStepUsed)st=+params.get('step')||0;
  if(m==='view'||m==='approve'||isExec(m)||isDone(m))paramStepUsed=true;
  handlingStep={borrow:0,stamp:0};handlingStep[key]=st;rec={lend:'',lendBy:'',ret:'',retBy:'',stamp:'',stampBy:''};$('#handlingTime').textContent='最後更新時間：—';
  if(st>0){$('#handlingTime').textContent='最後更新時間：2026/09/26 10:20:00';
    if(key==='borrow'){rec.lend='2026/09/25 09:30';rec.lendBy=KEEPER;if(st>=2){rec.ret='2026/09/30 16:00';rec.retBy=KEEPER}}else{rec.stamp='2026/09/25 14:30';rec.stampBy=KEEPER}}}
function renderHandling(){const m=mode.value,borrow=need()==='borrow',key=borrow?'borrow':'stamp',step=handlingStep[key],read=m!=='new'&&m!=='edit',acting=isExec(m)||m==='done-lent';
  $('#handlingPanel').hidden=!(read&&(isExec(m)||step>0));$('#editHandling').hidden=!(isDone(m)&&step>0&&!$('#handlingPanel').hidden);
  $('#borrowRecord').hidden=!borrow;$('#stampRecord').hidden=borrow;
  $('#hLendDate').textContent=rec.lend||'—';$('#hLendBy').textContent=rec.lendBy||'—';$('#hReturnDate').textContent=rec.ret||'—';$('#hReturnBy').textContent=rec.retBy||'—';$('#hStampDate').textContent=fmt(rec.stamp);$('#hStampBy').textContent=rec.stampBy||'—';
  const btn=$('#completeAction'),next=borrow?['確認已借出','確認已歸還']:['確認已蓋印'];btn.hidden=!acting||step>=next.length;btn.textContent=next[step]||''}
function syncNeed(){const borrow=need()==='borrow';$('#borrowFields').hidden=!borrow;$('#printNeed').textContent=borrow?'借用':'蓋用';renderHandling()}
function applyMode(){const m=mode.value,read=m!=='new'&&m!=='edit',no=params.get('no')||'CBS-CSI-2026-00003';
  const box={new:'newActions',edit:'editActions',view:'viewActions',approve:'approveActions','execute-stamp':'manageActions','execute-borrow':'manageActions','done-lent':'manageActions','done-stamp':'doneActions','done-return':'doneActions'}[m];
  $$('#newActions,#editActions,#approveActions,#viewActions,#manageActions,#doneActions').forEach(x=>x.hidden=x.id!==box);
  $('#routePanel').hidden=m==='new';$('#returnAlert').hidden=m!=='edit';$('#opinionSummary').hidden=!read;
  document.body.classList.toggle('readonly',read);document.body.classList.toggle('show-approval-details',read);
  $('#pageTitle').textContent=m==='new'?'新增公司印鑑申請（尚未產生單號）':isExec(m)?`執行回報公司印鑑申請（${no}）`:isDone(m)?`執行完成公司印鑑申請（${no}）`:`${m==='approve'?'簽核':m==='edit'?'編輯':'查看'}公司印鑑申請（${no}）`;
  $('#applyDate').textContent=m==='new'?'申請日期：送出簽核後由系統回寫':'申請日期：2026/09/23';
  $$('input,select,textarea').forEach(el=>{if(el===mode||el.closest('#execModal,#decisionModal'))return;if(el.name==='need'){el.disabled=isDone(m)||isExec(m);return}el.disabled=read});syncSealOther();syncNeed()}
// 舊連結 mode=execute／manage 依 need 參數轉成對應的執行回報情境
// 新增情境用印類別預設不選（其他情境保留範例資料的勾選）
function clearSealTypes(){$$('input[name=sealType]').forEach(x=>x.checked=false);$$('#borrowFields input[type=date]').forEach(x=>x.value='');planMin()}
// 預計借出／歸還日檢核（GSE-029）：預計借出日不得早於今天；預計歸還日不得早於預計借出日
const todayStr=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`};
const planInputs=()=>$$('#borrowFields input[type=date]');
function planMin(){const[b,r]=planInputs();b.min=todayStr();r.min=b.value||todayStr()}
function planCheck(){const[b,r]=planInputs();
  if(b.value&&b.value<todayStr())return '預計借出日不得早於今天。';
  if(b.value&&r.value&&r.value<b.value)return '預計歸還日不得早於預計借出日。';return ''}
planInputs()[0].addEventListener('change',e=>{const b=e.target,r=planInputs()[1];
  if(b.value&&b.value<todayStr()){alert('預計借出日不得早於今天。');b.value='';planMin();return}
  if(b.value&&r.value&&r.value<b.value){alert('預計歸還日不得早於預計借出日，已清除預計歸還日，請重新選擇。');r.value=''}planMin()});
planInputs()[1].addEventListener('change',e=>{const b=planInputs()[0],r=e.target;
  if(b.value&&r.value&&r.value<b.value){alert('預計歸還日不得早於預計借出日。');r.value=''}});
planMin();
$$('#newActions .btn.primary,#editActions .btn.primary').forEach(x=>x.addEventListener('click',()=>{if(need()!=='borrow')return;const[b,r]=planInputs();
  if(!b.value||!r.value){alert('請填寫預計借出日與預計歸還日。');return}const m=planCheck();if(m)alert(m)}));
let startMode=params.get('mode')==='manage'?'execute':params.get('mode')||'new';if(startMode==='execute')startMode=params.get('need')==='borrow'?'execute-borrow':'execute-stamp';mode.value=startMode;if(mode.value!==startMode)mode.value='new';if(mode.value==='new')clearSealTypes();if(params.get('need')==='borrow')$('input[name=need][value=borrow]').checked=true;mode.onchange=()=>{if(mode.value==='new')clearSealTypes();resetHandling();history.replaceState(null,'',`?mode=${mode.value}&need=${need()}`);applyMode()};$$('input[name=need]').forEach(x=>x.onchange=()=>{if(isExec(mode.value))resetHandling();syncNeed()});$('#routeToggle').onclick=()=>{const open=$('#routeBody').classList.toggle('route-collapsed');$('#routeToggle').textContent=open?'查看':'收合'};$('#historyLink').onclick=()=>$('#historyModal').hidden=false;$$('[data-close-history]').forEach(x=>x.onclick=()=>$('#historyModal').hidden=true);
function openDecision(type){$('#decisionTitle').textContent=type==='approve'?'核准並批示':'退回原因';$('#decisionOpinion').placeholder=type==='approve'?'可填寫簽核意見（選填），留空可直接核准':'請輸入退回原因（必填）';$('#decisionModal').dataset.type=type;$('#decisionModal').hidden=false}$('#approveBtn').onclick=()=>openDecision('approve');$('#rejectBtn').onclick=()=>openDecision('reject');$$('[data-close-modal]').forEach(x=>x.onclick=()=>$('#decisionModal').hidden=true);$('#decisionConfirm').onclick=()=>{if($('#decisionModal').dataset.type==='reject'&&!$('#decisionOpinion').value.trim()){alert('請輸入退回原因');return}alert($('#decisionModal').dataset.type==='reject'?'已退回申請':'本關已核准');$('#decisionModal').hidden=true};
const docTable=$('.document-table');
// 用印類別：「其他」勾選後才可輸入文字
function syncSealOther(){const on=$('#sealOther').checked,t=$('#sealOtherText');t.hidden=!on;t.disabled=!on||mode.value!=='new'&&mode.value!=='edit';if(!on)t.value=''}
$('#sealOther').onchange=()=>{syncSealOther();if($('#sealOther').checked)$('#sealOtherText').focus()};
function sealTypes(){return $$('input[name=sealType]:checked').map(x=>x.value==='其他'?'其他：'+($('#sealOtherText').value.trim()||'（未填）'):x.value)}
const escH=v=>String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function buildPrint(){$('#printSealType').textContent=sealTypes().join('、')||'—';
  $('#printDocRows').innerHTML=$$('.document-row').map((r,i)=>`<tr><td>${i+1}</td><td>${escH(r.querySelector('.doc-name').value.trim()||'—')}</td><td>${escH(r.querySelector('.doc-copies').value||'—')}</td><td>${r.querySelector('.row-file b')?escH(r.querySelector('.row-file b').textContent):'—'}</td></tr>`).join('')}
// 列印「借出／歸還記錄」：列印當下已有值才帶入，沒有值留空白（借用單＝借出記錄＋歸還記錄；蓋用單＝蓋用記錄）
function buildPrintRecords(){const borrow=need()==='borrow',v=x=>escH(x||''),plan=(($$('#borrowFields input[type=date]')[1]||{}).value||'').replace(/-/g,'/');
  $('#printRecords').innerHTML=borrow
   ?`<tbody><tr><th class="rec-title" colspan="3">借 出 記 錄</th></tr><tr class="rec-head"><th>借出日期</th><th>預計歸還日</th><th>借出人簽名</th></tr><tr class="rec-val"><td>${v(rec.lend)}</td><td>${v(plan)}</td><td>${v(rec.lendBy)}</td></tr><tr><th class="rec-title" colspan="3">歸 還 記 錄</th></tr><tr class="rec-head"><th>預計歸還日</th><th>實際歸還日</th><th>保管人簽名</th></tr><tr class="rec-val"><td>${v(plan)}</td><td>${v(rec.ret)}</td><td>${v(rec.retBy)}</td></tr></tbody>`
   :`<tbody><tr><th class="rec-title" colspan="2">蓋 用 記 錄</th></tr><tr class="rec-head"><th>實際蓋用時間</th><th>保管人簽名</th></tr><tr class="rec-val"><td>${v(fmt(rec.stamp)==='—'?'':fmt(rec.stamp))}</td><td>${v(rec.stampBy)}</td></tr></tbody>`}
window.addEventListener('beforeprint',()=>{buildPrint();buildPrintRecords()});
function renumberDocs(){$$('.document-row .row-no').forEach((el,i)=>el.textContent=i+1)}
function syncRowAttach(row){const has=!!row.querySelector('.row-file');row.querySelector('.upload-btn').hidden=has}
function newDocRow(){const row=document.createElement('div');row.className='document-row';row.innerHTML='<span class="row-no"></span><span class="m-label req">用印文件名稱</span><input class="control doc-name" type="text" maxlength="50" placeholder="請輸入用印文件名稱" aria-label="用印文件名稱"><span class="m-label req">用印份數</span><input class="control doc-copies" type="number" min="1" placeholder="份數" aria-label="用印份數" value="1"><span class="m-label">附件檔案</span><div class="row-attach"><button class="upload-btn" type="button">📎 選擇上傳附件</button></div><button class="link-btn" type="button">刪除</button>';return row}
docTable.addEventListener('click',e=>{const t=e.target;
  if(t.classList.contains('add-document')){docTable.insertBefore(newDocRow(),t);renumberDocs();return}
  if(t.classList.contains('link-btn')){const rows=$$('.document-row');if(rows.length<=1){alert('至少需保留一列用印文件。');return}t.closest('.document-row').remove();renumberDocs();return}
  if(t.classList.contains('row-file-remove')){const row=t.closest('.document-row');row.querySelector('.row-file').remove();row.querySelector('.upload-btn').hidden=false;return}
  if(t.classList.contains('upload-btn')){const row=t.closest('.document-row'),box=row.querySelector('.row-attach');if(!row.querySelector('.row-file')){const f=document.createElement('div');f.className='row-file';f.innerHTML='<span class="file-thumb">PDF</span><b title="用印文件.pdf">用印文件.pdf</b><button class="row-file-remove" type="button" title="移除附件">×</button>';box.prepend(f);t.hidden=true}}});
$('.add-unit').onclick=()=>alert('已新增一筆會簽單位輸入列。');
// 回填執行紀錄／編輯：彈窗，執行者固定帶登入帳號
let execKind='';
// 實際借出／歸還／蓋印時間：YYYY/MM/DD HH:MM（文字輸入，輸入數字自動補斜線、空白與冒號；「現在」帶入目前時間）
const DT_RE=/^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2})$/;
function maskDt(v){const d=v.replace(/\D/g,'').slice(0,12);let o=d.slice(0,4);if(d.length>4)o+='/'+d.slice(4,6);if(d.length>6)o+='/'+d.slice(6,8);if(d.length>8)o+=' '+d.slice(8,10);if(d.length>10)o+=':'+d.slice(10,12);return o}
function validDt(v){const m=DT_RE.exec(v);if(!m)return false;const[,y,mo,da,h,mi]=m.map(Number),d=new Date(y,mo-1,da,h,mi);return d.getFullYear()===y&&d.getMonth()===mo-1&&d.getDate()===da&&h<24&&mi<60}
function nowDt(){return nowText().slice(0,16)}
['#execDt','#execDt2'].forEach(id=>$(id).addEventListener('input',e=>{e.target.value=maskDt(e.target.value)}));
$$('[data-now]').forEach(b=>b.onclick=()=>{$('#'+b.dataset.now).value=nowDt()});
const slashToDash=v=>v?v.replace(/\//g,'-'):'';
function openExec(kind){execKind=kind;const borrow=need()==='borrow',step=handlingStep[borrow?'borrow':'stamp'],edit=kind==='edit';
  const lbl={lend:'實際借出時間',return:'實際歸還時間',stamp:'實際蓋印時間'},useDt=true;
  $('#execTitle').textContent=edit?'編輯借出／歸還紀錄':'回填執行紀錄';
  $('#execDateLabel').textContent=edit?(borrow?'實際借出時間':'實際蓋印時間'):lbl[kind];
  $('#execDate').hidden=useDt;$('#execDtBox').hidden=!useDt;
  $('#execDate').value=useDt?'':slashToDash(edit?rec.stamp:'');$('#execDt').value=edit?(borrow?rec.lend:rec.stamp):'';;
  $('#execField2').hidden=!(edit&&borrow&&step>=2);$('#execDt2').value=edit&&borrow?rec.ret:'';
  $('#execBy').value=KEEPER;$('#execConfirm').textContent=edit?'儲存':'確認執行完成';$('#execModal').hidden=false;requestAnimationFrame(()=>(useDt?$('#execDt'):$('#execDate')).focus())}
$$('[data-close-exec]').forEach(x=>x.onclick=()=>$('#execModal').hidden=true);
$('#completeAction').onclick=()=>{const borrow=need()==='borrow',step=handlingStep[borrow?'borrow':'stamp'];openExec(borrow?(step===0?'lend':'return'):'stamp')};
$('#editHandling').onclick=()=>openExec('edit');
$('#execConfirm').onclick=()=>{const borrow=need()==='borrow',key=borrow?'borrow':'stamp',edit=execKind==='edit',useDt=true;
  const name=edit?(borrow?'實際借出時間':'實際蓋印時間'):{lend:'實際借出時間',return:'實際歸還時間',stamp:'實際蓋印時間'}[execKind];
  const v1=useDt?$('#execDt').value.trim():$('#execDate').value,v2=$('#execDt2').value.trim(),need2=edit&&!$('#execField2').hidden;
  if(!v1){alert(`請填寫${name}。`);return}
  if(useDt&&!validDt(v1)){alert(`${name}格式須為 YYYY/MM/DD HH:MM，請輸入正確的日期與時間。`);return}
  if(useDt&&validDt(v1)&&v1>nowDt()){alert(`${name}不得晚於目前時間。`);return}
  if(need2&&!v2){alert('請填寫實際歸還時間。');return}
  if(need2&&!validDt(v2)){alert('實際歸還時間格式須為 YYYY/MM/DD HH:MM，請輸入正確的日期與時間。');return}
  if(need2&&v2>nowDt()){alert('實際歸還時間不得晚於目前時間。');return}
  if(need2&&v2<v1){alert('實際歸還時間不得早於實際借出時間。');return}
  if(execKind==='return'&&rec.lend&&v1<rec.lend){alert('實際歸還時間不得早於實際借出時間。');return}
  if(edit){if(borrow){rec.lend=v1;rec.lendBy=KEEPER;if(rec.ret){rec.ret=v2;rec.retBy=KEEPER}}else{rec.stamp=v1;rec.stampBy=KEEPER}}
  else if(execKind==='lend'){rec.lend=v1;rec.lendBy=KEEPER}else if(execKind==='return'){rec.ret=v1;rec.retBy=KEEPER}else{rec.stamp=v1;rec.stampBy=KEEPER}
  if(!edit)handlingStep[key]++;$('#handlingTime').textContent='最後更新時間：'+nowText();$('#execModal').hidden=true;renderHandling();
  alert(edit?'已更新借出／歸還紀錄。':execKind==='lend'?'已記錄印鑑借出，並通知申請人與印章保管者。':execKind==='return'?'已記錄印鑑歸還，並通知申請人與印章保管者。':'已記錄蓋印，並通知申請人與印章保管者。')};
resetHandling();
applyMode();
const applicantUnits={T037:'總經理室／後勤支援部／人事總務課',T021:'代標代購事業本部／客服部'};$('#applicant').onchange=e=>{$('#applicantUnit').textContent=applicantUnits[e.target.value]||'未設定所屬部門';$('#printApplicantUnit').textContent=$('#applicantUnit').textContent;$('#printApplicant').textContent=e.target.selectedOptions[0].textContent};
