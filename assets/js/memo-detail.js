const params=new URLSearchParams(location.search),mode=document.getElementById('mode'),routePanel=document.getElementById('routePanel'),routeBody=document.getElementById('routeBody'),routeToggle=document.getElementById('routeToggle'),historyModal=document.getElementById('historyModal'),returnAlert=document.getElementById('returnAlert'),roundSummary=document.getElementById('roundSummary'),roundBadge=document.getElementById('roundBadge');
function applyMode(){
  const m=mode.value,isRead=m==='view'||m==='approve',isCopy=m==='new'&&params.has('copy'),formNo=params.get('no'),wasReturned=m==='edit';
  document.body.classList.toggle('readonly',isRead);
  document.body.classList.toggle('show-approval-details',m==='view'||m==='approve');
  document.getElementById('newActions').hidden=m!=='new';
  document.getElementById('editActions').hidden=m!=='edit';
  document.getElementById('approveActions').hidden=m!=='approve';
  document.getElementById('viewActions').hidden=m!=='view';
  document.querySelector('.opinion-summary').hidden=!(m==='view'||m==='approve');
  returnAlert.hidden=!wasReturned;
  roundSummary.hidden=!wasReturned;
  roundBadge.textContent=wasReturned?'目前送審輪次：2':'目前送審輪次：1';
  routePanel.hidden=m==='new';
  if(m!=='new'){routeBody.classList.add('route-collapsed');routeToggle.textContent='查看'}
  document.querySelectorAll('.panel .control').forEach(x=>x.disabled=isRead);
  const editor=document.getElementById('description');editor.contentEditable=String(!isRead);
  document.querySelector('.editor-toolbar').hidden=isRead;
  document.getElementById('pageTitle').textContent=m==='new'?'新增簽呈單（尚未產生單號）':m==='edit'?`修改簽呈單（${formNo||'CBS-GSI-2026-00003'}）`:m==='approve'?`簽核簽呈單（${formNo||'CBS-GSI-2026-00002'}）`:`查看簽呈單（${formNo||'CBS-GSI-2026-00001'}）`;
  document.getElementById('applyDate').textContent=m==='new'?'申請日期：送出簽核後由系統回寫':'申請日期：2026/09/16';
  document.getElementById('subject').value=isCopy?'年度教育訓練計畫－複製':formNo==='CBS-GSI-2026-00007'?'客服品質改善方案':m==='new'?'':'年度教育訓練計畫';
  if(m!=='new'&&!editor.innerHTML)editor.innerHTML=formNo==='CBS-GSI-2026-00007'?'<p>為提升客服回覆品質與處理效率，擬調整客服作業流程並建立案件追蹤機制，請核示。</p><ul><li>統一回覆與升級處理原則</li><li>建立每月品質檢視機制</li></ul>':'<p>為提升同仁專業能力，擬辦理年度教育訓練，請核示。</p><ul><li>課程日期：2026/10/15</li><li>參加對象：全體同仁</li></ul>';
  if(m==='new')editor.innerHTML=isCopy?'<p>為提升服務品質，擬推動客服流程改善方案，請核示。</p>':'';
  document.getElementById('sampleFile').hidden=m==='new';
}
routeToggle.onclick=()=>{const opening=routeBody.classList.contains('route-collapsed');routeBody.classList.toggle('route-collapsed');routeToggle.textContent=opening?'收合':'查看'};
document.getElementById('historyLink').onclick=()=>{historyModal.hidden=false};
document.querySelectorAll('[data-close-history]').forEach(x=>x.onclick=()=>{historyModal.hidden=true});
mode.value=params.get('mode')||'new';mode.onchange=applyMode;
const applicantUnits={T037:'總經理室／後勤支援部／人事總務課',T021:'代標代購事業本部／客服部',T038:'總經理室／後勤支援部／人事總務課'};
document.getElementById('applicant').onchange=event=>{document.getElementById('applicantUnit').textContent=applicantUnits[event.target.value]||'未設定所屬部門'};
/* 部門單位選擇：選完後主要顯示末層，上層路徑以灰色小字放下方；原生 select 保留為資料來源（隱藏） */
function splitUnit(text){const p=(text||'').split('／');return{leaf:p[p.length-1]||'',parent:p.slice(0,-1).join('／')}}
function escapeHtml(t){return String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function unitHtml(text,placeholder){
  if(!text)return`<span class="unit-leaf unit-placeholder">${placeholder||'請選擇部門單位'}</span>`;
  const u=splitUnit(text);
  return`<span class="unit-leaf">${escapeHtml(u.leaf)}</span>${u.parent?`<span class="unit-parent">${escapeHtml(u.parent)}</span>`:''}`;
}
function refreshUnit(select){
  const trigger=select.nextElementSibling;if(!trigger||!trigger.classList.contains('unit-trigger'))return;
  const opt=select.selectedOptions[0],text=select.value&&opt?opt.text:'';
  trigger.querySelector('.unit-text').innerHTML=unitHtml(text);
  trigger.title=text;
}
function enhanceUnit(select){
  if(select.dataset.enhanced)return;select.dataset.enhanced='1';select.classList.add('unit-native');select.tabIndex=-1;
  const trigger=document.createElement('button');trigger.type='button';trigger.className='unit-trigger';trigger.setAttribute('aria-haspopup','listbox');
  trigger.innerHTML='<span class="unit-text"></span><span class="unit-caret" aria-hidden="true"></span>';
  select.after(trigger);refreshUnit(select);
  trigger.onclick=()=>openUnitPop(select,trigger);
}
let unitPop=null,unitPopCtx=null;
function closeUnitPop(){if(!unitPop)return;unitPop.remove();unitPop=null;if(unitPopCtx&&unitPopCtx.trigger)unitPopCtx.trigger.setAttribute('aria-expanded','false');unitPopCtx=null}
function openUnitPop(select,trigger){
  if(document.body.classList.contains('readonly'))return;
  const reopen=unitPopCtx&&unitPopCtx.trigger===trigger;closeUnitPop();if(reopen)return;
  const options=[...select.options].filter(o=>o.value);
  unitPop=document.createElement('div');unitPop.className='unit-pop';unitPop.setAttribute('role','dialog');
  unitPop.innerHTML='<div class="unit-pop-head"><input type="search" class="unit-search" placeholder="搜尋部門單位" aria-label="搜尋部門單位"><button type="button" class="unit-pop-close" aria-label="關閉">×</button></div><ul class="unit-list" role="listbox"></ul><div class="unit-empty" hidden>找不到符合的部門單位</div>';
  const list=unitPop.querySelector('.unit-list'),search=unitPop.querySelector('.unit-search'),empty=unitPop.querySelector('.unit-empty');
  const render=q=>{
    const kw=q.trim().toLowerCase(),shown=options.filter(o=>!kw||o.text.toLowerCase().includes(kw));
    list.innerHTML=shown.map(o=>`<li role="option" tabindex="-1" data-value="${escapeHtml(o.value)}" class="${o.value===select.value?'is-selected':''}" aria-selected="${o.value===select.value}">${unitHtml(o.text)}</li>`).join('');
    empty.hidden=shown.length>0;
  };
  render('');document.body.appendChild(unitPop);
  trigger.setAttribute('aria-expanded','true');unitPopCtx={select,trigger};
  const place=()=>{
    if(!unitPop)return;
    if(window.matchMedia('(max-width:700px)').matches){unitPop.classList.add('is-sheet');unitPop.style.cssText='';return}
    unitPop.classList.remove('is-sheet');
    const r=trigger.getBoundingClientRect(),w=Math.max(r.width,340),left=Math.min(Math.max(8,r.left),window.innerWidth-w-8);
    unitPop.style.width=w+'px';unitPop.style.left=left+'px';
    const h=unitPop.offsetHeight,below=window.innerHeight-r.bottom-8;
    unitPop.style.top=(below>=Math.min(h,260)||r.top<h?r.bottom+4:Math.max(8,r.top-h-4))+'px';
  };
  place();unitPopCtx.place=place;
  const pick=li=>{select.value=li.dataset.value;refreshUnit(select);select.dispatchEvent(new Event('change',{bubbles:true}));closeUnitPop();trigger.focus()};
  list.onclick=e=>{const li=e.target.closest('li');if(li)pick(li)};
  search.oninput=()=>render(search.value);
  unitPop.querySelector('.unit-pop-close').onclick=()=>{closeUnitPop();trigger.focus()};
  unitPop.onkeydown=e=>{
    const items=[...list.querySelectorAll('li')],i=items.indexOf(document.activeElement);
    if(e.key==='ArrowDown'){e.preventDefault();(items[i+1]||items[0])?.focus()}
    else if(e.key==='ArrowUp'){e.preventDefault();(i<=0?search:items[i-1]).focus()}
    else if(e.key==='Enter'&&document.activeElement.tagName==='LI'){e.preventDefault();pick(document.activeElement)}
    else if(e.key==='Enter'&&document.activeElement===search){e.preventDefault();items[0]&&pick(items[0])}
    else if(e.key==='Escape'){e.stopPropagation();closeUnitPop();trigger.focus()}
  };
  search.focus({preventScroll:true});
}
document.addEventListener('mousedown',e=>{if(unitPop&&!unitPop.contains(e.target)&&!e.target.closest('.unit-trigger'))closeUnitPop()});
window.addEventListener('resize',()=>{if(unitPopCtx&&unitPopCtx.place)unitPopCtx.place()});
window.addEventListener('scroll',e=>{if(unitPop&&!unitPop.contains(e.target)&&!unitPop.classList.contains('is-sheet'))closeUnitPop()},true);
const managerMap={'部':'羅弘奕 (B019)','課':'黃少佑 (B136)','活動課':'羅弘奕 (B019)'};
const unitOptions='<option value="">請選擇部門單位</option><option value="部">代標代購事業本部／代購部</option><option value="課">代標代購事業本部／代購部／訂單服務課</option><option value="活動課">代標代購事業本部／代購部／活動企劃課</option>';
document.querySelectorAll('.add-unit').forEach(button=>button.onclick=()=>{const body=document.getElementById(button.dataset.target),row=document.createElement('tr'),approval=button.dataset.target==='countersignRows';row.innerHTML='<td><select class="control department-select">'+unitOptions+'</select></td><td class="manager-cell">請選擇部門後帶入</td>'+(approval?'<td class="approval-only"><span class="stage-status pending">尚未送出</span></td>':'')+'<td><button class="link-btn" type="button">刪除</button></td>';body.appendChild(row);enhanceUnit(row.querySelector('.department-select'))});
document.addEventListener('change',event=>{if(!event.target.classList.contains('department-select'))return;event.target.closest('tr').querySelector('.manager-cell').textContent=managerMap[event.target.value]||'請選擇部門後帶入'});
document.addEventListener('click',event=>{const command=event.target.closest('[data-command]');if(command){let value=null;if(command.dataset.command==='createLink')value=prompt('請輸入連結網址');if(command.dataset.command!=='createLink'||value)document.execCommand(command.dataset.command,false,value);document.getElementById('description').focus();return}if(event.target.classList.contains('link-btn'))event.target.closest('tr').remove()});
document.getElementById('editorSize').onchange=event=>{document.execCommand('fontSize',false,event.target.value);document.getElementById('description').focus()};
document.getElementById('editorColor').oninput=event=>{document.execCommand('foreColor',false,event.target.value);document.getElementById('description').focus()};
document.getElementById('importCountersign').onclick=()=>{
  const notifyBody=document.getElementById('notifyRows'),existing=new Set([...notifyBody.querySelectorAll('.department-select')].map(x=>x.value));let added=0;
  [...document.querySelectorAll('#countersignRows .department-select')].forEach(select=>{if(!select.value||existing.has(select.value))return;const row=document.createElement('tr');row.innerHTML=`<td><select class="control department-select">${unitOptions}</select></td><td class="manager-cell">${managerMap[select.value]||'未設定主管'}</td><td><button class="link-btn" type="button">刪除</button></td>`;row.querySelector('select').value=select.value;notifyBody.appendChild(row);enhanceUnit(row.querySelector('select'));existing.add(select.value);added++});
  alert(added?`已帶入 ${added} 個會簽單位。`:'沒有可新增的會簽單位。');
};

const decisionModal=document.getElementById('decisionModal'),decisionTitle=document.getElementById('decisionTitle'),decisionOpinion=document.getElementById('decisionOpinion'),decisionConfirm=document.getElementById('decisionConfirm');
let decisionType='approve';
function isCountersignStage(){return params.get('no')==='CBS-GSI-2026-00005'}
function openDecision(type){
  decisionType=type;
  const approving=type==='approve',required=!approving||isCountersignStage(),label=decisionOpinion.closest('label').querySelector('.label');
  decisionTitle.textContent=approving?'核准本關':'退回（重新簽核）';
  decisionConfirm.textContent=approving?'確認核准':'確認退回';
  decisionConfirm.className='btn '+(approving?'success':'danger-filled');
  label.classList.toggle('req',required);
  decisionOpinion.placeholder=required?(approving?'請輸入簽核意見（必填）':'請輸入退回原因（必填）'):'可填寫簽核意見（選填），留空可直接核准';
  decisionOpinion.value='';
  decisionModal.hidden=false;
  requestAnimationFrame(()=>decisionOpinion.focus());
}
function closeDecision(){decisionModal.hidden=true;decisionOpinion.value=''}
document.getElementById('approveBtn').onclick=()=>openDecision('approve');
document.getElementById('rejectBtn').onclick=()=>openDecision('reject');
document.querySelectorAll('[data-close-modal]').forEach(button=>button.onclick=closeDecision);
decisionConfirm.onclick=()=>{
  const opinion=decisionOpinion.value.trim();
  const approved=decisionType==='approve',countersign=isCountersignStage(),status=countersign?document.getElementById('currentUnitStatus'):document.querySelector('.approval-stage.pending .stage-status');
  if(!opinion&&(!approved||isCountersignStage())){decisionOpinion.setCustomValidity(approved?'請填寫簽核意見':'請填寫退回原因');decisionOpinion.reportValidity();decisionOpinion.setCustomValidity('');return}
  status.textContent=approved?'已核准':'已退回';
  status.className='stage-status '+(approved?'approved':'rejected-stage');
  if(countersign){
    const row=status.closest('tr');
    const deptSelect=row.querySelector('.department-select');
    const deptText=deptSelect?deptSelect.selectedOptions[0].text:'';
    const deptLabel='會簽：'+(deptText.split('／').pop()||'目前單位');
    const signerName=(row.querySelector('.manager-cell')&&row.querySelector('.manager-cell').textContent.trim())||'未指定簽核人';
    row.classList.remove('unit-pending','unit-approved');if(approved)row.classList.add('unit-approved');
    const article=document.createElement('article');
    article.innerHTML=`<div><b>${deptLabel}</b><span>${signerName}</span><span class="stage-status ${approved?'approved':'rejected-stage'}">${approved?'已核准':'已退回'}</span></div><p${approved?'':' class="rejected-opinion"'}>${opinion}</p>`;
    document.getElementById('opinionRows').appendChild(article);
  }
  closeDecision();
};
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!decisionModal.hidden)closeDecision();if(event.key==='Escape'&&!historyModal.hidden)historyModal.hidden=true});

function stageInfo(el){
  return {
    title:(el.querySelector('.stage-title').textContent||'').replace(/^[①-⑩]\s*/,''),
    status:el.querySelector('.stage-status').textContent,
    person:(el.querySelector('.stage-person')?.textContent||'').replace(/^簽核者：/,''),
    date:(el.querySelector('time')?.textContent||'').replace(/^簽核日期：/,'')||'—'
  };
}
function opinionFor(label,status){
  if(status&&status.includes('待'))return'';
  const article=[...document.querySelectorAll('#opinionRows article')].find(a=>a.querySelector('b').textContent===label);
  return article?article.querySelector('p').textContent:'';
}
function unitRowsText(bodyId){
  const rows=[...document.querySelectorAll('#'+bodyId+' tr')];
  if(!rows.length)return'無';
  return rows.map(row=>{
    const select=row.querySelector('.department-select'),mgr=row.querySelector('.manager-cell');
    return`部門單位：${select&&select.selectedOptions[0]?select.selectedOptions[0].text:'—'}，主管：${mgr?mgr.textContent.trim():'—'}`;
  }).join('<br>');
}
function buildPrintView(){
  const m=mode.value,formNo=params.get('no')||{new:'尚未產生單號',edit:'CBS-GSI-2026-00003',approve:'CBS-GSI-2026-00002',view:'CBS-GSI-2026-00001'}[m];
  document.getElementById('printDocNo').textContent=formNo;
  const companySelect=document.querySelector('.memo-basic-panel select.control');
  document.getElementById('printCompany').textContent=companySelect?companySelect.selectedOptions[0].text:'';
  const applicantSelect=document.getElementById('applicant');
  document.getElementById('printApplicant').textContent=applicantSelect.selectedOptions[0].text;
  document.getElementById('printApplicantUnit').textContent=document.getElementById('applicantUnit').textContent;
  document.getElementById('printApplyDate').textContent=document.getElementById('applyDate').textContent.replace('申請日期：','');
  document.getElementById('printSubject').textContent=document.getElementById('subject').value;
  document.getElementById('printDescription').innerHTML=document.getElementById('description').innerHTML||'（無）';
  const fileEl=document.getElementById('sampleFile');
  document.getElementById('printAttachment').textContent=fileEl.hidden?'未附附件':'已附 1 份';
  document.getElementById('printCountersign').innerHTML=unitRowsText('countersignRows');
  document.getElementById('printNotify').innerHTML=unitRowsText('notifyRows');
  const stages=[...document.querySelectorAll('.approval-stage')],rows=[];
  if(stages.length){
    const first=stageInfo(stages[0]);rows.push({level:first.title,signer:first.person,status:first.status,date:first.date,opinion:opinionFor(first.title,first.status)});
    const second=stageInfo(stages[1]);rows.push({level:second.title,signer:second.person,status:second.status,date:second.date,opinion:opinionFor(second.title,second.status)});
    [...document.querySelectorAll('#countersignRows tr')].forEach(row=>{
      const select=row.querySelector('.department-select'),deptText=select&&select.selectedOptions[0]?select.selectedOptions[0].text:'',label='會簽：'+(deptText.split('／').pop()||deptText||'未指定'),mgr=row.querySelector('.manager-cell');
      const statusEl=row.querySelector('.approval-only .stage-status'),status=statusEl?statusEl.textContent:'尚未送出';
      rows.push({level:label,signer:mgr?mgr.textContent.trim():'—',status,date:'—',opinion:opinionFor(label,status)});
    });
    const last=stageInfo(stages[stages.length-1]);rows.push({level:last.title,signer:last.person,status:last.status,date:last.date,opinion:opinionFor(last.title,last.status)});
  }
  document.getElementById('printApprovalRows').innerHTML=rows.map(r=>`<tr><td>${r.level}</td><td>${r.signer}</td><td>${r.status}</td><td>${r.date}</td><td>${r.opinion||'—'}</td></tr>`).join('')||'<tr><td colspan="5">尚未送出簽核</td></tr>';
}
window.addEventListener('beforeprint',buildPrintView);
document.querySelectorAll('.department-select').forEach(enhanceUnit);
applyMode();
