const companies=['網家跨境服務股份有限公司','比比昂株式會社','空中補給股份有限公司'];
const deptOptions=['總經理','總經理 / 代標代購事業本部 / 代購部','總經理 / 代標代購事業本部 / 代購部 / 活動企劃課'];
// 簽核資格群組摘要：員工內容頁僅供查看，實際成員關係由「簽核資格群組管理」維護。
const signoffGroupCatalog={
  'CBS-總經理':{id:'26SQG0001',desc:'公司層級最終決行，對應各表單的總經理／代表關卡。'},
  'CBS-財務會簽':{id:'26SQG0002',desc:'請購單、請款單等單據勾選會簽時的財務關卡。'},
  'CBS-印鑑保管組':{id:'26SQG0003',desc:'公司印鑑申請單的保管人核決關卡。'}
};
function showToast(message){const el=document.getElementById('empToast');if(!el)return;el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)}
// 帳號狀態以標籤（Tag）呈現：啟用＝綠色、停用＝灰色，沿用列表共用的 .status 標籤樣式。
function statusTag(status){return `<span class="status ${status==='啟用'?'approved':'draft'}">${status}</span>`}
function permLabel(e){return e.permMode==='group'?`群組：${e.permGroup||'未命名群組'}`:e.permMode==='custom'?'自訂':'尚未設定'}
function signoffLabel(e){return (e.signoffGroups&&e.signoffGroups.length)?e.signoffGroups.join('、'):'—'}
function signoffCell(e){return (e.signoffGroups&&e.signoffGroups.length)?`<a href="#" onclick="openSignoff('${e.id}');return false">查看簽核資格</a>`:'—'}
function renderEmployees(){
  const body=document.getElementById('empRows');if(!body)return;
  const field=document.getElementById('keywordField').value;
  const key=document.getElementById('keyword').value.trim().toLowerCase();
  const company=document.getElementById('companyFilter').value;
  const status=document.getElementById('statusFilter').value;
  const rows=employees.filter(e=>{
    const companyOk=(!company||e.orgs.some(o=>o.company===company))&&(!status||e.status===status);
    if(!key)return companyOk;
    const keywordTargets={
      code:e.code,
      name:e.name,
      nickname:e.nickname,
      login:e.login,
      email:e.email
    };
    const target=field==='all'?Object.values(keywordTargets).join(' '):(keywordTargets[field]||'');
    return companyOk&&target.toLowerCase().includes(key)
  });
  document.getElementById('resultCount').textContent=rows.length;
  body.innerHTML=rows.length?rows.map(e=>`<tr><td>${e.id}</td><td>${statusTag(e.status)}</td><td><a href="detail.html?id=${e.id}">編輯</a></td><td>${e.code}</td><td>${e.name}</td><td>${e.nickname}</td><td>${permLabel(e)}</td><td>${signoffCell(e)}</td><td>${e.editor}</td><td>${e.edited}</td><td>${e.creator}</td><td>${e.created}</td><td>${e.status==='啟用'?`<a href="#" onclick="toggleStatus('${e.id}');return false">停用</a>`:'—'}</td></tr>`).join(''):`<tr><td colspan="13" class="empty">查無符合條件的員工</td></tr>`
}
function clearFilters(){document.getElementById('keywordField').value='all';document.getElementById('keyword').value='';document.getElementById('companyFilter').value='';document.getElementById('statusFilter').value='';renderEmployees()}
// 停用帳號：先檢查是否為部門主管、再檢查是否為簽核資格群組成員（任一是則不可停用）；通過後再提醒「不會轉移未完成的工作」並由使用者確認。
function memberSignoffGroups(e){const label=`${e.name} (${e.code})`;return (typeof signoffGroups==='undefined'?[]:signoffGroups).filter(g=>g.members.includes(label))}
function managedDepartments(e){const label=`${e.name} (${e.code})`;return (typeof departments==='undefined'?[]:departments).filter(d=>d.manager===label)}
function deptFullPath(d){return d.path==='—'?d.name:`${d.path} / ${d.name}`}
function escapeHtml(v){return String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}
function openDeactivate(title,bodyHtml,buttonsHtml){
  document.getElementById('deactivateTitle').textContent=title;
  document.getElementById('deactivateBody').innerHTML=bodyHtml;
  document.getElementById('deactivateActions').innerHTML=buttonsHtml;
  document.getElementById('deactivateModal').hidden=false;
}
function closeDeactivate(){document.getElementById('deactivateModal').hidden=true}
function toggleStatus(id){
  const e=employees.find(x=>x.id===id);if(!e||e.status!=='啟用')return;
  const managed=managedDepartments(e);
  if(managed.length){
    openDeactivate('無法停用帳號',
      `<p class="confirm-text">「${escapeHtml(e.name)}（${escapeHtml(e.code)}）」目前是以下部門的部門主管，不可停用。請先到「組織管理」更換部門主管後，再停用帳號：</p><ul class="confirm-list">${managed.map(d=>`<li>${escapeHtml(d.company)}／${escapeHtml(deptFullPath(d))}</li>`).join('')}</ul>`,
      '<button class="btn primary" type="button" data-close-deactivate>我知道了</button>');
    return;
  }
  const inGroups=memberSignoffGroups(e);
  if(inGroups.length){
    openDeactivate('無法停用帳號',
      `<p class="confirm-text">「${escapeHtml(e.name)}（${escapeHtml(e.code)}）」目前是以下簽核資格群組的成員，不可停用。請先到「簽核資格群組管理」將該帳號移出群組後，再停用帳號：</p><ul class="confirm-list">${inGroups.map(g=>`<li>${escapeHtml(g.company)}／${escapeHtml(g.name)}</li>`).join('')}</ul>`,
      '<button class="btn primary" type="button" data-close-deactivate>我知道了</button>');
    return;
  }
  openDeactivate('確認停用帳號',
    `<p class="confirm-text">此人可能有待簽單據。停用帳號不會轉移該帳號有未完成簽核、代理及執行的工作，請先確認工作已處理完成，或請他先設定代理人代為簽核。<br>確認要停用帳號？</p>`,
    `<button class="btn" type="button" data-close-deactivate>取消</button><button class="btn primary" type="button" id="deactivateOk">確認停用</button>`);
  document.getElementById('deactivateOk').addEventListener('click',()=>{
    e.status='停用';closeDeactivate();renderEmployees();showToast(`帳號 ${e.id} 已停用`);
  });
}

function orgRowHtml(company,path){
  return `<tr data-org-row data-company="${company}" data-path="${path}"><td>${company}</td><td>${path}</td><td><button class="link-button" type="button" onclick="deleteOrgRow(this)">刪除</button></td></tr>`;
}
function emptyOrgRowHtml(){return '<tr data-org-empty><td colspan="3" class="empty">尚未新增公司組織</td></tr>'}
function renderOrgRows(rows){document.getElementById('empOrgEditRows').innerHTML=rows.length?rows.map(o=>orgRowHtml(o.company,o.path)).join(''):emptyOrgRowHtml()}
function deleteOrgRow(button){button.closest('tr').remove();const body=document.getElementById('empOrgEditRows');if(!body.querySelector('[data-org-row]'))body.innerHTML=emptyOrgRowHtml()}
function openOrgAddPanel(){
  const panel=document.getElementById('empOrgAddPanel');
  document.getElementById('empOrgAddCompany').innerHTML=companies.map(c=>`<option>${c}</option>`).join('');
  document.getElementById('empOrgAddDepartment').innerHTML=deptOptions.map(d=>`<option>${d}</option>`).join('');
  panel.hidden=false;
}
function closeOrgAddPanel(){document.getElementById('empOrgAddPanel').hidden=true}
function confirmOrgRow(){
  const company=document.getElementById('empOrgAddCompany').value;
  const path=document.getElementById('empOrgAddDepartment').value;
  const body=document.getElementById('empOrgEditRows');
  // 一個帳號在同一家公司只能有一個歸屬部門（跨公司可多筆；貼近 RD 每人每公司一個部門，日後可解除）。
  const sameCompany=Array.from(body.querySelectorAll('[data-org-row]')).some(row=>row.dataset.company===company);
  if(sameCompany){showToast(`此帳號在「${company}」已有歸屬部門，同一家公司只能有一個歸屬部門，請先刪除原資料再新增`);return}
  body.querySelector('[data-org-empty]')?.remove();
  body.insertAdjacentHTML('beforeend',orgRowHtml(company,path));
  closeOrgAddPanel();
}

function renderGroupPreview(){
  const box=document.getElementById('permGroupPreview');if(!box)return;
  const name=document.getElementById('permGroupSelect').value;
  if(!name){box.className='';box.innerHTML='<p class="field-note">請先選擇系統權限群組。</p>';return}
  renderPermMatrix(box,PERM_GROUP_GRANTS[name]||[],{readonly:true,onlyGranted:true});
}
function syncPermMode(){
  const mode=document.querySelector('input[name=permMode]:checked')?.value;
  document.querySelectorAll('.perm-block').forEach(el=>{el.hidden=el.dataset.permBlock!==mode});
  const groupSelect=document.getElementById('permGroupSelect');
  if(groupSelect)groupSelect.disabled=mode!=='group';
  renderGroupPreview()
}
// 頭像：僅接受 JPG、PNG，檔案上限 2 MB，其他不限。Demo 只做檢核，不實際上傳。
function uploadAvatar(){
  const inp=document.createElement('input');inp.type='file';inp.accept='.jpg,.jpeg,.png,image/jpeg,image/png';
  inp.onchange=()=>{const f=inp.files[0];if(!f)return;
    if(!['image/jpeg','image/png'].includes(f.type)){showToast('僅支援 JPG、PNG 格式');return}
    if(f.size>2*1024*1024){showToast('圖片不可超過 2 MB');return}
    showToast('Demo：頭像檔案檢核通過（僅示意，不實際上傳）')};
  inp.click()
}
function deleteAvatar(){showToast('Demo：頭像刪除僅示意')}

function renderSignoffQualifications(list){
  const body=document.getElementById('signoffQualificationRows');if(!body)return;
  body.innerHTML=list.length?list.map(name=>{
    const group=signoffGroupCatalog[name]||{id:'—',desc:'—'};
    return `<tr><td>${group.id}</td><td>${name}</td><td>${group.desc}</td></tr>`;
  }).join(''):'<tr><td colspan="3" class="empty">尚未指定簽核資格</td></tr>';
}
function openSignoff(id){
  const e=employees.find(x=>x.id===id);if(!e)return;
  document.getElementById('signoffIdentity').textContent=`${e.name} (${e.code})`;
  renderSignoffQualifications(e.signoffGroups||[]);
  document.getElementById('signoffModal').hidden=false;
}
function closeSignoff(){document.getElementById('signoffModal').hidden=true}

function initDetail(){
  const params=new URLSearchParams(location.search);
  const editing=params.has('id');
  document.getElementById('detailTitle').textContent=editing?'編輯員工':'新增員工';
  if(editing){
    const e=employees.find(x=>x.id===params.get('id'))||employees[0];
    document.getElementById('empIdView').textContent=e.id;
    document.getElementById('empName').value=e.name;
    document.getElementById('empCode').value=e.code;
    document.getElementById('empLogin').value=e.login;
    // 登入帳號建立後不可修改（RD 不接受重新綁定 Google 身分）；輸入錯誤時停用此帳號再以正確帳號新建。
    document.getElementById('empLogin').disabled=true;
    document.getElementById('empLoginNote').textContent='※ 登入帳號建立後不可修改；若輸入錯誤，請停用此帳號後以正確的登入帳號新建';
    document.getElementById('empEmail').value=e.email;
    document.getElementById('empNickname').value=e.nickname;
    document.getElementById('empLocale').value=e.locale;
    document.getElementById('empTimezone').value=e.timezone;
    renderOrgRows(e.orgs);
    if(e.permMode==='custom'){document.getElementById('permCustom').checked=true}
    else{document.getElementById('permGroup').checked=true;if(e.permGroup)document.getElementById('permGroupSelect').value=e.permGroup}
    renderPermMatrix(document.getElementById('permCustomMatrix'),e.customGrants||[]);
  }else{
    document.getElementById('permCustom').checked=true;
    renderPermMatrix(document.getElementById('permCustomMatrix'),[]);
    renderOrgRows([]);
  }
  syncPermMode();
  const loginInput=document.getElementById('empLogin');
  loginInput.addEventListener('input',()=>{const emailInput=document.getElementById('empEmail');if(!emailInput.dataset.touched)emailInput.value=loginInput.value});
  document.getElementById('empEmail').addEventListener('input',e=>{e.target.dataset.touched='1'})
}
function saveEmployee(){
  const required=['empName','empCode','empLogin','empEmail','empLocale','empTimezone'];
  if(required.some(id=>!document.getElementById(id).value)){showToast('請完成所有必填欄位');return}
  if(!document.querySelector('#empOrgEditRows [data-org-row]')){showToast('請至少新增一筆帳號對應公司組織');return}
  const orgCompanies=Array.from(document.querySelectorAll('#empOrgEditRows [data-org-row]')).map(r=>r.dataset.company);
  const dupCompany=orgCompanies.find((c,i)=>orgCompanies.indexOf(c)!==i);
  if(dupCompany){showToast(`此帳號在「${dupCompany}」有多個歸屬部門，同一家公司只能有一個歸屬部門`);return}
  const mailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!mailRe.test(document.getElementById('empLogin').value.trim())||!mailRe.test(document.getElementById('empEmail').value.trim())){showToast('請輸入正確的 Email 格式');return}
  const permMode=document.querySelector('input[name=permMode]:checked')?.value;
  if(permMode==='group'&&!document.getElementById('permGroupSelect').value){showToast('請先選擇系統權限群組');return}
  if(permMode==='custom'&&!document.querySelector('#permCustomMatrix input[data-pm-act]:checked')){showToast('請至少勾選一個權限項目');return}
  // 部門主管檢核：帳號若是某公司任一部門的部門主管，儲存時該公司至少要保留一筆歸屬（否則違反「主管須歸屬該公司」）。
  const selfIdForMgr=new URLSearchParams(location.search).get('id');
  const selfEmp=employees.find(x=>x.id===selfIdForMgr);
  if(selfEmp){
    const keptCompanies=new Set(Array.from(document.querySelectorAll('#empOrgEditRows [data-org-row]')).map(r=>r.dataset.company));
    const lost=managedDepartments(selfEmp).filter(d=>!keptCompanies.has(d.company));
    if(lost.length){
      const company=lost[0].company;
      const names=lost.filter(d=>d.company===company).map(d=>d.name);
      showToast(`此帳號是「${company}」的部門主管（${names.slice(0,3).join('、')}${names.length>3?`等 ${names.length} 個部門`:''}），不可移除該公司的全部歸屬，請先到組織管理更換部門主管`);
      return;
    }
    // 簽核資格群組成員檢核：帳號若是某公司簽核資格群組的成員，該公司至少要保留一筆歸屬（群組成員須歸屬該公司）。
    const lostGroups=memberSignoffGroups(selfEmp).filter(g=>!keptCompanies.has(g.company));
    if(lostGroups.length){
      const company=lostGroups[0].company;
      const names=lostGroups.filter(g=>g.company===company).map(g=>g.name);
      showToast(`此帳號是「${company}」的簽核資格群組成員（${names.join('、')}），不可移除該公司的全部歸屬，請先到簽核資格群組管理移除成員`);
      return;
    }
  }
  // 唯一性檢查：登入帳號全系統不可重複（不分大小寫）；員工編號在同一公司內不可重複（依此帳號的每一家對應公司檢查；帳號至少有一筆對應公司組織）。
  // 只比對啟用中的帳號（已停用帳號不占用登入帳號與員工編號），編輯時排除自己。
  const selfId=new URLSearchParams(location.search).get('id');
  const others=employees.filter(x=>x.id!==selfId&&x.status==='啟用');
  const login=document.getElementById('empLogin').value.trim().toLowerCase();
  if(others.some(x=>x.login.toLowerCase()===login)){showToast('登入帳號已被其他帳號使用');return}
  const code=document.getElementById('empCode').value.trim().toLowerCase();
  const myCompanies=new Set(Array.from(document.querySelectorAll('#empOrgEditRows [data-org-row]')).map(r=>r.dataset.company));
  for(const company of myCompanies){
    if(others.some(x=>x.code.toLowerCase()===code&&x.orgs.some(o=>o.company===company))){showToast(`員工編號在「${company}」已被使用`);return}
  }
  showToast('Demo：員工資料已儲存')
}
document.addEventListener('DOMContentLoaded',()=>{
  renderEmployees();
  document.querySelectorAll('[data-close-signoff]').forEach(el=>el.addEventListener('click',closeSignoff));
  document.addEventListener('click',ev=>{if(ev.target.closest&&ev.target.closest('[data-close-deactivate]'))closeDeactivate()});
  document.addEventListener('keydown',ev=>{if(ev.key==='Escape'){if(document.getElementById('signoffModal'))closeSignoff();if(document.getElementById('deactivateModal'))closeDeactivate()}});
  if(document.getElementById('detailTitle'))initDetail();
  document.querySelectorAll('input[name=permMode]').forEach(el=>el.addEventListener('change',syncPermMode));
  const addOrgBtn=document.getElementById('addOrgRow');if(addOrgBtn)addOrgBtn.addEventListener('click',openOrgAddPanel);
  const cancelOrgBtn=document.getElementById('cancelOrgRow');if(cancelOrgBtn)cancelOrgBtn.addEventListener('click',closeOrgAddPanel);
  const confirmOrgBtn=document.getElementById('confirmOrgRow');if(confirmOrgBtn)confirmOrgBtn.addEventListener('click',confirmOrgRow);
  const groupSel=document.getElementById('permGroupSelect');if(groupSel)groupSel.addEventListener('change',renderGroupPreview);
});





