const permissionGroups=[
 {id:'26PMG0001',name:'行政人員',desc:'可代他人申請行政相關表單。',perms:PERM_GROUP_GRANTS['行政人員'],editor:'陳庭瑋',edited:'2026/09/20 10:12:00',creator:'陳庭瑋',created:'2026/09/01 09:00:00'},
 {id:'26PMG0002',name:'部門主管',desc:'可代部門同仁申請行政與資訊相關表單。',perms:PERM_GROUP_GRANTS['部門主管'],editor:'陳庭瑋',edited:'2026/09/18 14:00:00',creator:'陳庭瑋',created:'2026/09/01 09:00:00'},
 {id:'26PMG0003',name:'系統管理員',desc:'組織／員工等系統主檔與人員代理設定的查看編輯權限。',perms:PERM_GROUP_GRANTS['系統管理員'],editor:'陳庭瑋',edited:'2026/09/10 09:30:00',creator:'陳庭瑋',created:'2026/09/01 09:00:00'}
];
function showToast(message){const el=document.getElementById('pgToast');if(!el)return;el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)}
// 說明在列表最多顯示 15 字，超過的以「...」截斷，完整內容以滑入提示查看。
function descShort(v){return v.length>15?v.slice(0,15)+'...':v}
function renderGroups(){
  const body=document.getElementById('pgRows');if(!body)return;
  const key=document.getElementById('keyword').value.trim().toLowerCase();
  const field=document.getElementById('keywordField').value;
  const rows=permissionGroups.filter(g=>{
    if(!key)return true;
    const target=field==='name'?g.name:field==='desc'?g.desc:field==='id'?g.id:`${g.id} ${g.name} ${g.desc}`;
    return target.toLowerCase().includes(key)
  });
  document.getElementById('resultCount').textContent=rows.length;
  body.innerHTML=rows.length?rows.map(g=>`<tr><td>${g.id}</td><td>${g.name}</td><td${g.desc.length>15?` title="${g.desc}"`:''}>${descShort(g.desc)}</td><td>${groupMembers(g).length}</td><td><a href="detail.html?id=${g.id}">編輯</a></td><td>${g.editor}</td><td>${g.edited}</td><td>${g.creator}</td><td>${g.created}</td><td><a href="#" onclick="deleteGroup('${g.id}');return false">刪除</a></td></tr>`).join(''):`<tr><td colspan="10" class="empty">查無符合條件的群組</td></tr>`
}
function clearFilters(){document.getElementById('keywordField').value='all';document.getElementById('keyword').value='';renderGroups()}
// 刪除檢核：只檢查「啟用中」的員工帳號是否使用此群組；已停用帳號不列入。
function deleteGroup(id){
  const g=permissionGroups.find(x=>x.id===id);if(!g)return;
  const users=(typeof employees==='undefined'?[]:employees).filter(e=>e.status==='啟用'&&e.permMode==='group'&&e.permGroup===g.name);
  if(users.length){showToast(`「${g.name}」仍有啟用中的帳號使用，請先解除或改派群組後再刪除`);return}
  showToast(`Demo：「${g.name}」已通過刪除檢核（僅有已停用帳號使用時可刪除，示意不實際刪除）`)
}
// 成員只在員工管理指定：啟用中、系統權限為「指定系統權限群組」且選了本群組的帳號；已停用帳號不列入。
function groupMembers(g){return (typeof employees==='undefined'?[]:employees).filter(e=>e.status==='啟用'&&e.permMode==='group'&&e.permGroup===g.name)}
function escapeHtml(v){return String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}
function renderMembers(g){
  const body=document.getElementById('pgMemberRows');if(!body)return;
  const list=g?groupMembers(g):[];
  body.innerHTML=list.length?list.map(e=>`<tr><td>${e.id}</td><td>${escapeHtml(e.code)}</td><td>${escapeHtml(e.name)}</td><td>${escapeHtml(e.nickname)}</td><td>${escapeHtml(e.login)}</td><td>${e.orgs.map(o=>`<div>${escapeHtml(o.company)}／${escapeHtml(o.path)}</div>`).join('')}</td></tr>`).join(''):'<tr><td colspan="6" class="empty">此群組目前沒有成員</td></tr>';
}
function initDetail(){
  const params=new URLSearchParams(location.search);
  const editing=params.has('id');
  document.getElementById('detailTitle').textContent=editing?'編輯群組':'新增群組';
  if(editing){
    const g=permissionGroups.find(x=>x.id===params.get('id'))||permissionGroups[0];
    document.getElementById('pgIdView').textContent=g.id;
    document.getElementById('pgName').value=g.name;
    document.getElementById('pgDesc').value=g.desc;
    renderMembers(g);
    renderPermMatrix(document.getElementById('pgPermMatrix'),g.perms);
  }else{
    renderMembers(null);
    renderPermMatrix(document.getElementById('pgPermMatrix'),[]);
  }
}
function saveGroup(){
  const name=document.getElementById('pgName').value.trim();
  if(!name){showToast('請完成所有必填欄位');return}
  // 群組名稱全系統不可重複（修改時排除自己）
  const editId=new URLSearchParams(location.search).get('id');
  if(permissionGroups.some(x=>x.name===name&&x.id!==editId)){showToast('群組名稱已存在');return}
  showToast('Demo：群組資料已儲存')
}
document.addEventListener('DOMContentLoaded',()=>{
  renderGroups();
  if(document.getElementById('detailTitle'))initDetail();
});
