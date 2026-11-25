/* AI工具帳號管理（Demo）：內容頁（新增／編輯／查看）。
   帳號主檔（帳號、使用者、部門、使用方式、備註）＋使用紀錄（多筆，管理人員手動維護）。
   狀態、目前使用工具／方案、預計結束日期、最後一次停用日由使用紀錄推算，不可編輯。
   申請單只是使用紀錄的「來源」：輸入單號可帶入建議值，帶入後與申請單沒有連動。 */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const params=new URLSearchParams(location.search);
let mode=params.get('mode')||'new';if(!['new','edit','view'].includes(mode))mode='new';
const src=AIA_ACCOUNTS.find(a=>a.id===params.get('id'))||(mode==='new'?null:AIA_ACCOUNTS[0]);
const cur=src?{...src,records:src.records.map(r=>({...r}))}:{id:'',account:'',user:'',dept:'',usage:'',remark:'',records:[]};
const toIso=v=>(v||'').replace(/\//g,'-'),fromIso=v=>(v||'').replace(/-/g,'/');
function addMonths(dateStr,months){if(!dateStr||!months)return'';const[y,m,d]=dateStr.split('/').map(Number),base=m-1+months,ty=y+Math.floor(base/12),tm=((base%12)+12)%12,last=new Date(ty,tm+1,0).getDate();return`${ty}/${String(tm+1).padStart(2,'0')}/${String(Math.min(d,last)).padStart(2,'0')}`}
function msg(box,type,html){$(box).innerHTML=html?`<p class="acct-msg ${type}">${html}</p>`:''}
/* 選項 */
$('#user').innerHTML+=AIA_EMPLOYEES.map(e=>`<option value="${e.name}(${e.code})">${e.name} (${e.code})</option>`).join('');
$('#rfPlan').innerHTML+=AIA_PLANS.map(p=>`<option>${p}</option>`).join('');
/* 部門：選擇使用者後自動帶出、不可編輯；該員工有 2 個以上所屬部門時才出現下拉選擇 */
const empOf=v=>AIA_EMPLOYEES.find(x=>`${x.name}(${x.code})`===v);
function setDept(preferred){const e=empOf($('#user').value),list=e?e.depts:[],multi=list.length>1;
  $('#deptSel').hidden=!multi;$('#dept').hidden=multi;
  if(multi){$('#deptSel').innerHTML=list.map(x=>`<option>${x}</option>`).join('');$('#deptSel').value=list.includes(preferred)?preferred:list[0];$('#deptNote').textContent='此員工有多個所屬部門，請選擇本帳號對應的部門'}
  else{$('#dept').value=list[0]||'';$('#deptNote').textContent='選擇使用者後自動帶出，不可編輯'}}
const deptVal=()=>$('#deptSel').hidden?$('#dept').value.trim():$('#deptSel').value;
/* 主檔 ⇄ 表單 */
function fill(){$('#account').value=cur.account;$('#user').value=cur.user;setDept(cur.dept);$$('input[name=usage]').forEach(r=>r.checked=r.value===cur.usage);$('#remark').value=cur.remark;renderAll()}
function read(){const u=$('input[name=usage]:checked');return{account:$('#account').value.trim(),user:$('#user').value,dept:deptVal(),usage:u?u.value:'',remark:$('#remark').value.trim()}}
$('#user').onchange=()=>setDept('');
/* 目前狀況（唯讀，由使用紀錄推算） */
function renderCurrent(){const c=aiaCurrent(cur),over=aiaIsOverdue(cur);
  $('#curState').innerHTML=c.has?`<span class="acct-status ${c.stopped?'stopped':'using'}">${c.stopped?'已停用':'使用中'}</span>`:'<span class="acct-dim">尚無使用紀錄</span>';
  $('#curPlan').textContent=c.plan||'—';
  $('#curEnd').innerHTML=c.end?`<span class="acct-expire${over?' over':''}">${c.end}</span>${over?'<span class="acct-overdue">已逾期</span>':''}`:'—';
  $('#curStop').textContent=c.lastStop||'—'}
/* 使用紀錄表（新到舊） */
let editing=null;
function renderRecords(){const list=aiaSorted(cur.records).reverse();$('#recCount').textContent=list.length?`共 ${list.length} 筆`:'';
  if(!list.length){$('#recWrap').innerHTML='<p class="acct-empty">尚無使用紀錄。</p>';return}
  const rows=list.map(r=>{const stop=r.type==='停用',idx=cur.records.indexOf(r);
    const form=r.formNo?`<a href="../ai-tools/detail.html?mode=view&no=${encodeURIComponent(r.formNo)}" target="_blank" rel="noopener">${r.formNo}</a>`:'—';
    return`<tr><td><span class="acct-type t-${stop?'stop':'use'}">${r.type}</span></td><td>${stop?'—':aiaRecPlan(r)}</td><td>${r.start}</td><td>${stop?'—':(r.end||'—')}</td><td>${form}</td><td>${r.note||'—'}</td><td class="acct-rec-edit"><button class="acct-link-btn" data-edit="${idx}" type="button">編輯</button></td></tr>`}).join('');
  $('#recWrap').innerHTML=`<table class="acct-link-table"><thead><tr><th>類型</th><th>工具／方案</th><th>起日／停用日期</th><th>迄日</th><th>來源申請單號</th><th>備註</th><th class="acct-rec-edit"></th></tr></thead><tbody>${rows}</tbody></table>`;
  $$('[data-edit]').forEach(b=>b.onclick=()=>openForm(cur.records[+b.dataset.edit]))}
function renderAll(){renderCurrent();renderRecords()}
/* 查單：帶入共用的檢查 */
function checkForm(no,ignoreRec){
  if(!no)return{type:'err',text:'請輸入申請單號。'};
  const f=aiaFormByNo(no);if(!f)return{type:'err',text:'查無此申請單號。'};
  if(f.status!=='已核准')return{type:'err',text:`此單簽核狀態為「${f.status}」，尚未核准或已作廢，無法帶入。`};
  if(f.execution!=='已執行')return{type:'err',text:'此單已核准但尚未回報執行完成（帳號尚未開通或異動），無法帶入。'};
  const mine=cur.records.find(r=>r!==ignoreRec&&r.formNo===no);if(mine)return{type:'err',text:'此單已記入本帳號的使用紀錄，一張申請單只能對應一筆使用紀錄。'};
  const other=AIA_ACCOUNTS.find(a=>a.id!==cur.id&&a.records.some(r=>r.formNo===no));if(other)return{type:'err',text:`此單已記入帳號 ${other.account} 的使用紀錄，一張申請單只能對應一筆使用紀錄。`};
  return{form:f}}
/* 使用紀錄表單 */
const defaultType=()=>{const c=aiaCurrent(cur);return!c.has||c.stopped?'首次使用':'續用'};
function syncFormType(){const stop=$('#rfType').value==='停用';$('#rfPlanRow').hidden=stop;$('#rfEndRow').hidden=stop;
  $('#rfStartLabel').textContent=stop?'停用日期':'起日';$('#rfStartNote').textContent=stop?'實際停用帳號的日期，由執行人員填寫':'實際開始使用的日期，由執行人員填寫';
  const c=aiaCurrent(cur);$('#rfTypeNote').textContent=c.has&&!c.stopped?'目前使用中：可新增續用、升級或停用':(c.stopped?'目前已停用：只能新增「首次使用」（重新啟用）':'第一筆通常為「首次使用」')}
function setForm(o){$('#rfNo').value=o.formNo||'';$('#rfType').value=o.type;$('#rfPlan').value=o.plan||'';$('#rfPlanNote').value=o.planNote||'';$('#rfPlanNote').hidden=o.plan!=='其他';$('#rfStart').value=toIso(o.start);$('#rfEnd').value=toIso(o.end);$('#rfNote').value=o.note||'';syncFormType()}
function openForm(rec,prefill){editing=rec||null;msg('#rfMsg','','');msg('#recMsg','','');
  $('#recFormTitle').textContent=rec?'編輯使用紀錄':'新增使用紀錄';$('#rfSave').textContent=rec?'更新紀錄':'新增紀錄';
  setForm(rec||prefill||{type:defaultType(),plan:'',planNote:'',start:'',end:'',formNo:'',note:''});
  $('#recForm').hidden=false;$('#recForm').scrollIntoView({block:'nearest'})}
function closeForm(){editing=null;$('#recForm').hidden=true}
$('#recAddBtn').onclick=()=>openForm(null);
$('#rfCancel').onclick=closeForm;
$('#rfType').onchange=syncFormType;
$('#rfPlan').onchange=()=>{$('#rfPlanNote').hidden=$('#rfPlan').value!=='其他';if($('#rfPlan').value!=='其他')$('#rfPlanNote').value=''};
/* 由單據組出表單預設值（帶入共用）；起日不帶入，迄日為建議值 */
function prefillOf(f,no){const stop=f.item==='停用',std=AIA_PLANS.includes(f.plan);
  return{type:f.item,plan:stop?'':(std?f.plan:'其他'),planNote:stop?'':(std?'':f.plan),start:'',end:stop?'':addMonths(f.completed,f.months),formNo:no,note:''}}
function fetchHint(f,p){return f.item==='停用'?'這是停用單，請填寫停用日期。':`起日請由執行人員填寫；${p.end?`迄日 ${p.end} 是依「執行完成日期加申請使用期間」算出的建議值，可修改或清空。`:'此單沒有申請使用期間，迄日未帶入。'}`}
/* 使用紀錄表單內的「帶入」（新增、編輯帳號皆可） */
$('#rfFetch').onclick=()=>{const no=$('#rfNo').value.trim(),r=checkForm(no,editing);if(!r.form){msg('#rfMsg',r.type,r.text);return}
  const f=r.form,p=prefillOf(f,no),note=$('#rfNote').value,start=$('#rfStart').value;setForm({...p,note});$('#rfStart').value=start;
  const acc=$('#account').value.trim(),diff=acc&&f.account!==acc?` 提醒：此單上的 AI 工具帳號為 ${f.account}，與本帳號不同，請確認。`:'';
  msg('#rfMsg',diff?'warn':'ok',`已帶入申請單 ${no}（${f.item}）。${fetchHint(f,p)}${diff}`)};
/* 儲存使用紀錄 */
$('#rfSave').onclick=()=>{const type=$('#rfType').value,stop=type==='停用',plan=$('#rfPlan').value,planNote=$('#rfPlanNote').value.trim(),start=fromIso($('#rfStart').value),end=fromIso($('#rfEnd').value),no=$('#rfNo').value.trim(),note=$('#rfNote').value.trim();
  if(!start){alert(stop?'請填寫停用日期。':'請填寫起日。');return}
  if(!stop){if(!plan){alert('請選擇工具／方案。');return}if(plan==='其他'&&!planNote){alert('工具／方案選「其他」時，請說明方案名稱。');return}if(end&&end<start){alert('迄日不可早於起日。');return}}
  if(no){const r=checkForm(no,editing);if(!r.form){alert(r.text);return}if(r.form.item!==type){alert(`此單申請項目為「${r.form.item}」，與所選類型「${type}」不符。`);return}}
  const rec={type,plan:stop?'':plan,planNote:stop?'':planNote,start,end:stop?'':end,formNo:no,note};
  const list=editing?cur.records.map(x=>x===editing?rec:x):[...cur.records,rec];
  const err=aiaCheckRecords(list);if(err){alert(err);return}
  const wasEdit=!!editing;cur.records=list;closeForm();renderAll();msg('#recMsg','ok',wasEdit?'已更新使用紀錄。':'已新增使用紀錄。')};
/* 新增帳號：由申請單帶入（帳號資料＋開啟使用紀錄表單） */
$('#fetchBtn').onclick=()=>{const no=$('#fetchNo').value.trim(),r=checkForm(no,null);if(!r.form){msg('#fetchMsg',r.type,r.text);return}
  const f=r.form;
  if(f.item==='停用'){msg('#fetchMsg','err','停用單無法用來新增帳號。請到該帳號的內容頁，用「新增使用紀錄」輸入停用單號帶入，並填寫停用日期。');return}
  const ex=AIA_ACCOUNTS.find(a=>a.account===f.account);
  if(ex){msg('#fetchMsg','warn',`帳號 ${f.account} 已在清冊中，不可重複建立。請到<a href="detail.html?mode=edit&id=${ex.id}">該筆帳號</a>，用「新增使用紀錄」輸入此單號帶入。`);return}
  const emp=empOf(f.applicant);
  cur.account=f.account;cur.user=f.applicant;cur.dept=emp?(emp.depts.includes(f.dept)?f.dept:emp.depts[0]):f.dept;cur.usage=f.shared?'多人共用':'個人使用';cur.remark=$('#remark').value.trim();cur.records=[];
  fill();const p=prefillOf(f,no);openForm(null,p);
  msg('#fetchMsg','ok',`已帶入申請單 ${no} 的帳號資料，並開啟下方「使用紀錄」表單（類型：${f.item}）。${fetchHint(f,p)}填妥後按「新增紀錄」。`);
  $('#fetchNo').disabled=true;$('#fetchBtn').disabled=true};
/* 儲存帳號 */
function validate(){const v=read();
  if(!v.account||!v.user||!v.dept||!v.usage){alert('請填寫 AI 工具帳號、使用者、部門與使用方式。');return null}
  if(/[,;，；、\s]/.test(v.account)||(v.account.match(/@/g)||[]).length>1){alert('AI 工具帳號僅能填寫一個，請勿輸入多個帳號。');return null}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.account)){alert('AI 工具帳號請輸入正確的 Email 格式。');return null}
  if(AIA_ACCOUNTS.some(a=>a.account.toLowerCase()===v.account.toLowerCase()&&a.id!==cur.id)){alert('此 AI 工具帳號已在清冊中，不可重複建立。');return null}
  if(!$('#recForm').hidden){alert('使用紀錄表單尚未完成，請按「新增紀錄／更新紀錄」或「取消」。');return null}
  if(!cur.records.length){alert('請至少新增一筆使用紀錄。');return null}
  const err=aiaCheckRecords(cur.records);if(err){alert(err);return null}
  return v}
$('#saveBtn').onclick=()=>{const v=validate();if(!v)return;Object.assign(cur,v);
  alert(mode==='new'?'已新增帳號（Demo 不保存資料）。':'已儲存（Demo 不保存資料）。')};
/* 情境 */
function applyMode(){const view=mode==='view',isNew=mode==='new';document.body.classList.toggle('readonly',view);
  $('#mode').value=mode;$('#fetchPanel').hidden=!isNew;$('#editActions').hidden=view;$('#viewActions').hidden=!view;
  $$('.acct-page input,.acct-page select,.acct-page textarea,.acct-page button.btn').forEach(x=>{if(x.id==='saveBtn')return;else if(!['mode'].includes(x.id))x.disabled=view});
  $('#panelTitle').textContent=isNew?'新增帳號':'帳號資料';$('#crumbLast').textContent=isNew?'新增帳號':(cur.account||'');
  $('#toEdit').href=`detail.html?mode=edit&id=${cur.id}`}
$('#mode').onchange=()=>{const m=$('#mode').value;location.search=m==='new'?'?mode=new':`?mode=${m}&id=${(src&&src.id)||AIA_ACCOUNTS[0].id}`};
fill();applyMode();
