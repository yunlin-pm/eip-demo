function showToast(message){const el=document.getElementById('orgToast');if(!el)return;el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)}
function renderDepartments(){const body=document.getElementById('orgRows');if(!body)return;const field=document.getElementById('keywordField').value;const key=document.getElementById('keyword').value.trim().toLowerCase();const company=document.getElementById('companyFilter').value;const rows=departments.filter(d=>{const companyOk=!company||d.company===company;if(!key)return companyOk;const target=field==='name'?d.name:field==='manager'?d.manager:`${d.name} ${d.manager}`;return companyOk&&target.toLowerCase().includes(key)});document.getElementById('resultCount').textContent=rows.length;body.innerHTML=rows.length?rows.map(d=>`<tr><td>${d.id}</td><td>${d.company}</td><td>${d.path}</td><td>${d.name}</td><td>${d.manager}</td><td><a href="detail.html?id=${d.id}">編輯</a>　<a href="#" onclick="openMembers('${d.id}');return false">查看成員</a></td><td>${d.editor}</td><td>${d.edited}</td><td>${d.creator}</td><td>${d.created}</td><td><a href="#" onclick="deleteDepartment('${d.id}');return false">刪除</a></td></tr>`).join(''):`<tr><td colspan="11" class="empty">查無符合條件的部門</td></tr>`}
function clearFilters(){document.getElementById('keywordField').value='all';document.getElementById('keyword').value='';document.getElementById('companyFilter').value='';renderDepartments()}
function orgFullPath(d){return d.path==='—'?d.name:`${d.path} / ${d.name}`}
function buildOrgTree(company){
  const list=departments.filter(d=>d.company===company);
  if(!list.length)return '<p class="org-tree-empty">此公司尚無部門資料</p>';
  const byFullPath={};list.forEach(d=>{byFullPath[orgFullPath(d)]=d.id});
  const byId={};const children={};list.forEach(d=>{byId[d.id]=d;children[d.id]=[]});
  const roots=[];
  list.forEach(d=>{
    if(d.path==='—'){roots.push(d.id);return}
    const parentId=byFullPath[d.path];
    if(parentId){children[parentId].push(d.id)}else{roots.push(d.id)}
  });
  function renderNode(id){
    const d=byId[id];const kids=children[id];
    let html=`<span class="node">${d.name}　<span class="manager">${d.manager}</span></span>`;
    if(kids.length)html+='<ul>'+kids.map(k=>`<li>${renderNode(k)}</li>`).join('')+'</ul>';
    return html
  }
  return '<ul>'+roots.map(r=>`<li>${renderNode(r)}</li>`).join('')+'</ul>'
}
function renderOrgTreeFor(company){document.getElementById('orgTreeBody').innerHTML=buildOrgTree(company)}
function openTree(){
  const select=document.getElementById('treeCompanySelect');
  select.value='網家跨境服務股份有限公司';
  renderOrgTreeFor(select.value);
  document.getElementById('orgTreeModal').hidden=false
}
function closeTree(){document.getElementById('orgTreeModal').hidden=true}
// 部門成員：帳號「對應公司組織」的公司與完整部門路徑等於此部門者（僅直屬，不含下層部門）。
function departmentMembers(d){const full=orgFullPath(d);return (typeof employees==='undefined'?[]:employees).filter(e=>e.status==='啟用'&&e.orgs.some(o=>o.company===d.company&&o.path===full))}
function escapeHtml(v){return String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}
function openMembers(id){
  const d=departments.find(x=>x.id===id);if(!d)return;
  const list=departmentMembers(d);
  document.getElementById('memberIdentity').innerHTML=`<div><span class="member-label">公司：</span>${escapeHtml(d.company)}</div><div><span class="member-label">部門：</span>${escapeHtml(orgFullPath(d))} (共 ${list.length} 人)</div>`;
  document.getElementById('memberRows').innerHTML=list.length?list.map(e=>`<tr><td>${escapeHtml(e.id)}</td><td>${escapeHtml(e.code)}</td><td>${escapeHtml(e.name)}</td><td>${escapeHtml(e.nickname||'—')}</td><td>${escapeHtml(e.login)}</td></tr>`).join(''):'<tr><td colspan="5" class="empty">此部門目前沒有成員</td></tr>';
  document.getElementById('memberModal').hidden=false
}
function closeMembers(){document.getElementById('memberModal').hidden=true}
// ---- 組織異動紀錄（Demo 範例資料）：新增／修改／刪除各為一筆；修改的每個欄位列出「變更前 → 變更後」；
// 部門欄位保存異動當下的完整部門路徑，之後部門改名或搬移也不影響舊紀錄的呈現。
const ORG_LOG_MANAGER_POOL=['羅弘奕 (B019)','黃少佑 (B206)','韓蕙蓮 (B209)','程弘瑋 (B208)','王彥偉 (B210)'];
const ORG_LOG_SPECIAL={
  '26DEP0006':{create:{name:'活動組'},mods:[['部門名稱','活動組','活動企劃課']]},
  '26DEP0007':{create:{path:'總經理 / 代標代購事業本部 / 代標部'},mods:[['上級部門','總經理 / 代標代購事業本部 / 代標部','總經理 / 代標代購事業本部']]},
  '26DEP0012':{create:{name:'跨境業務課',manager:'邱筱妤 (B212)'},mods:[['部門名稱','跨境業務課','跨境課'],['部門主管','邱筱妤 (B212)','溫浩文 (B211)']]}
};
let orgLogCache=null;
function orgLogs(){
  if(orgLogCache)return orgLogCache;
  const logs=[];
  departments.forEach((d,i)=>{
    const sp=ORG_LOG_SPECIAL[d.id];
    let prev=ORG_LOG_MANAGER_POOL[i%ORG_LOG_MANAGER_POOL.length];if(prev===d.manager)prev=ORG_LOG_MANAGER_POOL[(i+1)%ORG_LOG_MANAGER_POOL.length];
    const init={name:d.name,path:d.path,manager:sp?d.manager:prev};if(sp&&sp.create)Object.assign(init,sp.create);
    const initPath=init.path==='—'?init.name:`${init.path} / ${init.name}`;
    logs.push({time:d.created,actor:d.creator,type:'新增',id:d.id,company:d.company,path:initPath,changes:[['部門名稱','',init.name],['上級部門','',init.path],['部門主管','',init.manager]]});
    logs.push({time:d.edited,actor:d.editor,type:'修改',id:d.id,company:d.company,path:orgFullPath(d),changes:sp?sp.mods:[['部門主管',prev,d.manager]]});
  });
  [['26DEP0034','測試課','總經理 / 後勤支援部','朱驥瑋 (B136)','2026/09/24 15:10:00','陳庭瑋','2026/09/25 16:40:12','洪榆瑄'],
   ['26DEP0035','臨時專案組','總經理 / 技術系統開發部','陳贊元 (B201)','2026/09/24 15:12:00','陳庭瑋','2026/09/25 11:20:45','陳庭瑋']].forEach(([id,name,path,mgr,ct,ca,dt,da])=>{
    const full=`${path} / ${name}`;
    logs.push({time:ct,actor:ca,type:'新增',id,company:'網家跨境服務股份有限公司',path:full,changes:[['部門名稱','',name],['上級部門','',path],['部門主管','',mgr]]});
    logs.push({time:dt,actor:da,type:'刪除',id,company:'網家跨境服務股份有限公司',path:full,changes:[['部門名稱',name,''],['上級部門',path,''],['部門主管',mgr,'']]});
  });
  logs.sort((a,b)=>a.time<b.time?1:a.time>b.time?-1:0);
  return orgLogCache=logs;
}
function logChangeText(c){const [f,from,to]=c;return `<div><b>${escapeHtml(f)}</b>：${from&&to?`${escapeHtml(from)} → ${escapeHtml(to)}`:to?escapeHtml(to):`${escapeHtml(from)}（刪除前）`}</div>`}
function renderLog(){
  const company=document.getElementById('logCompany').value,type=document.getElementById('logType').value,key=document.getElementById('logKeyword').value.trim().toLowerCase();
  const rows=orgLogs().filter(l=>l.company===company&&(!type||l.type===type)&&(!key||`${l.path} ${l.id} ${l.actor} ${l.changes.map(c=>c.join(' ')).join(' ')}`.toLowerCase().includes(key)));
  document.getElementById('logCount').textContent=rows.length;
  document.getElementById('logRows').innerHTML=rows.length?rows.map(l=>`<tr><td class="nowrap">${l.time}</td><td class="nowrap">${escapeHtml(l.actor)}</td><td class="nowrap"><span class="log-type log-${l.type==='新增'?'add':l.type==='修改'?'edit':'del'}">${l.type}</span></td><td>${escapeHtml(l.path)}<div class="log-id">${l.id}</div></td><td>${l.changes.map(logChangeText).join('')}</td></tr>`).join(''):'<tr><td colspan="5" class="empty">查無符合條件的異動紀錄</td></tr>'
}
function openLog(){document.getElementById('logCompany').value='網家跨境服務股份有限公司';document.getElementById('logType').value='';document.getElementById('logKeyword').value='';renderLog();document.getElementById('logModal').hidden=false}
function closeLog(){document.getElementById('logModal').hidden=true}
// 刪除檢核：有下級部門不可刪；有「啟用中」的員工歸屬不可刪（已停用帳號的歸屬不列入，與查看成員一致）。
function deleteDepartment(id){
  const d=departments.find(x=>x.id===id);if(!d)return;
  const full=orgFullPath(d);
  if(departments.some(x=>x.company===d.company&&(x.path===full||x.path.startsWith(full+' / ')))){showToast('部門仍有下級部門，不可刪除');return}
  if(departmentMembers(d).length){showToast('部門仍有啟用中的員工歸屬，不可刪除（已停用帳號不列入檢核）');return}
  // 通過檢核後：部門若已被表單引用（Demo 假設現有部門皆已被引用），先提示再刪除；不因被引用而阻擋。
  pendingDeleteId=id;
  document.getElementById('deleteConfirmName').textContent=`${d.company}　${orgFullPath(d)}`;
  document.getElementById('deleteConfirmModal').hidden=false
}
let pendingDeleteId=null;
function cancelDelete(){document.getElementById('deleteConfirmModal').hidden=true;pendingDeleteId=null}
function confirmDelete(){
  const d=departments.find(x=>x.id===pendingDeleteId);
  document.getElementById('deleteConfirmModal').hidden=true;pendingDeleteId=null;
  if(d)showToast(`Demo：${d.name} 已刪除（示意不實際刪除，並記入異動紀錄）`)
}
// 部門主管候選：帳號「對應公司組織」已歸屬於所選公司、且帳號狀態為啟用的員工；另含該公司現有部門已指派的主管
// （依定義已歸屬該公司），但若該帳號已停用則排除。只需同公司即可，不限本部門。
function employeeLabel(e){return `${e.name} (${e.code})`}
function managerCandidates(company){
  const all=typeof employees==='undefined'?[]:employees;
  const disabled=new Set(all.filter(e=>e.status!=='啟用').map(employeeLabel));
  const set=new Set();
  all.filter(e=>e.status==='啟用'&&e.orgs.some(o=>o.company===company)).forEach(e=>set.add(employeeLabel(e)));
  departments.filter(d=>d.company===company&&!disabled.has(d.manager)).forEach(d=>set.add(d.manager));
  return [...set];
}
function renderManagerOptions(keep){
  const company=document.getElementById('company').value;const sel=document.getElementById('manager');
  const list=company?managerCandidates(company):[];
  const hint=!company?'請先選擇公司':list.length?'請選擇部門主管':'此公司尚無已設定組織歸屬的員工帳號';
  sel.innerHTML=`<option value="">${hint}</option>`+list.map(m=>`<option>${escapeHtml(m)}</option>`).join('');
  if(keep){if(list.includes(keep))sel.value=keep;else sel.insertAdjacentHTML('beforeend',`<option value="${escapeHtml(keep)}">${escapeHtml(keep)}（已停用或非該公司成員）</option>`),sel.value=keep}
}
let originalState=null;
function initDetail(){
  const params=new URLSearchParams(location.search);const editing=params.has('id');
  document.getElementById('detailTitle').textContent=editing?'編輯組織':'新增組織';
  document.getElementById('company').addEventListener('change',()=>renderManagerOptions());
  renderManagerOptions();
  const d=editing?departments.find(x=>x.id===params.get('id')):null;
  if(d){
    document.getElementById('deptIdView').textContent=d.id;
    document.getElementById('deptName').value=d.name;
    document.getElementById('company').value=d.company;document.getElementById('company').disabled=true;
    renderManagerOptions(d.manager);
    const parent=departments.find(x=>x.company===d.company&&orgFullPath(x)===d.path);
    document.getElementById('parent').value=parent?parent.id:'';
    originalState={manager:d.manager,parent:d.path==='—'?'':(parent?parent.id:'')}
  }
}
// 儲存時檢查：必填、上級部門須與所選公司相同、上級部門不可是本身或本身的下級部門（避免循環）。
function saveDepartment(){
  const required=['deptName','company','manager'];
  if(required.some(id=>!document.getElementById(id).value)){showToast('請完成所有必填欄位');return}
  const company=document.getElementById('company').value;
  if(!managerCandidates(company).includes(document.getElementById('manager').value)){showToast('部門主管須為該公司啟用中的員工帳號，請重新選擇');return}
  const parent=departments.find(x=>x.id===document.getElementById('parent').value);
  if(parent){
    if(parent.company!==company){showToast('上級部門必須與所選公司相同');return}
    const selfId=new URLSearchParams(location.search).get('id');
    const self=selfId&&departments.find(x=>x.id===selfId);
    if(self){const selfPath=orgFullPath(self);const parentPath=orgFullPath(parent);
      if(parent.id===self.id||parentPath===selfPath||parentPath.startsWith(selfPath+' / ')){showToast('上級部門不可選擇部門本身或其下級部門');return}}
  }
  // 同一上級部門（含都沒有上級的最上層）底下，部門名稱不可重複。
  const name=document.getElementById('deptName').value.trim();
  const parentPath=parent?orgFullPath(parent):'—';
  const editId=new URLSearchParams(location.search).get('id');
  if(departments.some(x=>x.company===company&&x.path===parentPath&&x.name===name&&x.id!==editId)){showToast('同一上級部門下已有相同的部門名稱');return}
  // 編輯既有部門且變更了部門主管或上級部門：儲存前須確認（已送出或簽核中的表單不受影響）。
  const cur={manager:document.getElementById('manager').value,parent:document.getElementById('parent').value};
  if(originalState&&(cur.manager!==originalState.manager||cur.parent!==originalState.parent)){
    const parentLabel=id=>{const x=departments.find(y=>y.id===id);return x?orgFullPath(x):'（無）'};
    const lines=[];
    if(cur.manager!==originalState.manager)lines.push(`部門主管：${originalState.manager} → ${cur.manager}`);
    if(cur.parent!==originalState.parent)lines.push(`上級部門：${parentLabel(originalState.parent)} → ${parentLabel(cur.parent)}`);
    document.getElementById('managerConfirmChange').innerHTML=lines.map(l=>`<div>${escapeHtml(l)}</div>`).join('');
    document.getElementById('managerConfirmModal').hidden=false;return
  }
  showToast('Demo：組織資料已儲存')
}
function cancelManagerChange(){document.getElementById('managerConfirmModal').hidden=true}
function confirmManagerChange(){document.getElementById('managerConfirmModal').hidden=true;originalState={manager:document.getElementById('manager').value,parent:document.getElementById('parent').value};showToast('Demo：組織資料已儲存')}
document.addEventListener('DOMContentLoaded',()=>{renderDepartments();if(document.getElementById('detailTitle'))initDetail();document.querySelectorAll('[data-close-tree]').forEach(el=>el.addEventListener('click',closeTree));document.querySelectorAll('[data-cancel-manager]').forEach(el=>el.addEventListener('click',cancelManagerChange));document.querySelectorAll('[data-cancel-delete]').forEach(el=>el.addEventListener('click',cancelDelete));const dcOk=document.getElementById('deleteConfirmOk');if(dcOk)dcOk.addEventListener('click',confirmDelete);const mcOk=document.getElementById('managerConfirmOk');if(mcOk)mcOk.addEventListener('click',confirmManagerChange);document.querySelectorAll('[data-close-log]').forEach(el=>el.addEventListener('click',closeLog));['logCompany','logType'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('change',renderLog)});const logKey=document.getElementById('logKeyword');if(logKey)logKey.addEventListener('input',renderLog);document.querySelectorAll('[data-close-members]').forEach(el=>el.addEventListener('click',closeMembers));document.addEventListener('keydown',e=>{if(e.key==='Escape')['memberModal','orgTreeModal','logModal','managerConfirmModal','deleteConfirmModal'].forEach(id=>{const el=document.getElementById(id);if(el)el.hidden=true})});const treeSelect=document.getElementById('treeCompanySelect');if(treeSelect)treeSelect.addEventListener('change',()=>renderOrgTreeFor(treeSelect.value))});
