// Demo 權限預覽：網址帶 perm=member 代表僅具「僅可異動成員」權限（人資／管理人員），否則為「查看編輯」（RD／PM）。
// 實際系統依登入帳號在權限矩陣的勾選決定；Demo 以網址參數模擬。
const sgMemberOnly=new URLSearchParams(location.search).get('perm')==='member';
function sgQ(prefix){return sgMemberOnly?prefix+'perm=member':''}
// 右上角 Demo 列的「畫面情境」下拉：切換兩種權限並保留其他網址參數（比照簽呈單內容頁的畫面情境）。
function initPermSelect(){
  const sel=document.getElementById('sgPermSelect');if(!sel)return;
  sel.value=sgMemberOnly?'member':'full';
  sel.addEventListener('change',()=>{
    const params=new URLSearchParams(location.search);
    if(sel.value==='member')params.set('perm','member');else params.delete('perm');
    const q=params.toString();
    location.href=location.pathname+(q?'?'+q:'')
  })
}
function showToast(message){const el=document.getElementById('sgToast');if(!el)return;el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)}
function descShort(v){return v.length>15?v.slice(0,15)+'...':v}
function renderGroups(){
  const body=document.getElementById('sgRows');if(!body)return;
  const key=document.getElementById('keyword').value.trim().toLowerCase();
  const company=document.getElementById('companyFilter').value;
  const rows=signoffGroups.filter(g=>{
    const companyOk=!company||g.company===company;
    if(!key)return companyOk;
    const field=document.getElementById('keywordField').value;
    const target=field==='name'?g.name:field==='desc'?g.desc:field==='id'?g.id:`${g.id} ${g.name} ${g.desc}`;
    return companyOk&&target.toLowerCase().includes(key)
  });
  document.getElementById('resultCount').textContent=rows.length;
  body.innerHTML=rows.length?rows.map(g=>`<tr><td>${g.id}</td><td>${g.company}</td><td>${g.name}</td><td>${g.members.length}</td><td${g.desc.length>15?` title="${g.desc}"`:''}>${descShort(g.desc)}</td><td><a href="detail.html?id=${g.id}${sgQ('&')}">${sgMemberOnly?'維護成員':'編輯'}</a></td><td>${g.editor}</td><td>${g.edited}</td><td>${g.creator}</td><td>${g.created}</td><td>${sgMemberOnly?'—':`<a href="#" onclick="deleteGroup('${g.id}');return false">刪除</a>`}</td></tr>`).join(''):`<tr><td colspan="11" class="empty">查無符合條件的群組</td></tr>`
}
function clearFilters(){document.getElementById('keywordField').value='all';document.getElementById('keyword').value='';document.getElementById('companyFilter').value='';renderGroups()}
function deleteGroup(id){showToast(`Demo：${id} 刪除前須先確認無帳號使用此群組`)}
// 成員以「輸入姓名或員編」搜尋後加入；成員列顯示帳號姓名、帳號暱稱、員工編號、部門（該群組適用公司下的完整部門路徑）。
function sgEmpByCode(code,company){return employees.find(e=>e.code===code&&(!company||e.orgs.some(o=>o.company===company)))||employees.find(e=>e.code===code)}
function sgDeptOf(e,company){const o=e.orgs.find(x=>x.company===company);return o?o.path:'—'}
function sgLabelCode(label){const m=/\(([^)]+)\)\s*$/.exec(label);return m?m[1]:label}
function sgMemberCodes(){return Array.from(document.querySelectorAll('#sgMemberRows tr')).map(tr=>tr.dataset.code)}
function memberRowHtml(e,company){
  return `<tr data-code="${escapeHtml(e.code)}"><td>${escapeHtml(e.name)}</td><td>${escapeHtml(e.nickname||'—')}</td><td>${escapeHtml(e.code)}</td><td>${escapeHtml(sgDeptOf(e,company))}</td><td><button class="link-button" type="button" onclick="this.closest('tr').remove()">移除</button></td></tr>`
}
function escapeHtml(v){return String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')}
// 候選人：啟用中、帳號對應公司組織包含群組適用公司、尚未在群組內，且姓名／暱稱／員編符合輸入。
function sgCandidates(company,q){
  const key=q.trim().toLowerCase();
  const used=sgMemberCodes();
  return employees.filter(e=>e.status==='啟用'&&e.orgs.some(o=>o.company===company)&&!used.includes(e.code)
    &&(!key||[e.name,e.nickname||'',e.code].some(v=>v.toLowerCase().includes(key))))
}
// 選單點選只是「選定」（填入輸入框），按「新增」才真正加入成員列（比照員工管理「帳號對應公司組織」先選再確認新增）。
let sgPicked=null;
function sgPick(e){
  sgPicked=e;
  document.getElementById('sgMemberSearch').value=`${e.name} (${e.code})`;sgCloseSuggest()
}
function sgAddPicked(){
  const company=document.getElementById('sgCompany').value;
  if(!company){showToast('請先選擇適用公司');return}
  const input=document.getElementById('sgMemberSearch');
  let e=sgPicked;
  // 未從選單點選時，若輸入內容剛好只對到一位候選人，視同已選定。
  if(!e||input.value!==`${e.name} (${e.code})`){
    const c=sgCandidates(company,input.value);
    e=(input.value.trim()&&c.length===1)?c[0]:null;
  }
  if(!e){showToast('請先從選單選擇要新增的員工');return}
  document.getElementById('sgMemberRows').insertAdjacentHTML('beforeend',memberRowHtml(e,company));
  sgPicked=null;input.value='';sgCloseSuggest()
}
function sgCloseSuggest(){const ul=document.getElementById('sgSuggest');ul.hidden=true;ul.innerHTML=''}
function sgShowSuggest(){
  const input=document.getElementById('sgMemberSearch'),ul=document.getElementById('sgSuggest');
  const company=document.getElementById('sgCompany').value;
  if(!company){sgCloseSuggest();showToast('請先選擇適用公司');return}
  const list=sgCandidates(company,input.value);
  window.__sgSuggest=list;
  ul.innerHTML=list.length?list.map((e,i)=>`<li data-i="${i}">${escapeHtml(e.name)} (${escapeHtml(e.code)})<small>${escapeHtml(e.nickname||'—')}　${escapeHtml(sgDeptOf(e,company))}</small></li>`).join(''):'<li class="none">查無可加入的員工</li>';
  const r=input.getBoundingClientRect();ul.style.left=r.left+'px';ul.style.top=r.bottom+'px';ul.style.width=r.width+'px';
  ul.hidden=false
}
function initMemberSearch(){
  const input=document.getElementById('sgMemberSearch'),ul=document.getElementById('sgSuggest');if(!input)return;
  input.addEventListener('focus',sgShowSuggest);
  input.addEventListener('click',sgShowSuggest);
  input.addEventListener('input',()=>{sgPicked=null;sgShowSuggest()});
  document.getElementById('sgAddMemberBtn').addEventListener('click',sgAddPicked);
  input.addEventListener('keydown',ev=>{
    if(ev.key==='Escape'){sgCloseSuggest();return}
    if(ev.key==='Enter'){ev.preventDefault();const list=window.__sgSuggest||[];if(!ul.hidden&&list.length)sgPick(list[0]);else if(sgPicked)sgAddPicked()}
  });
  ul.addEventListener('mousedown',ev=>{const li=ev.target.closest('li[data-i]');if(!li)return;ev.preventDefault();sgPick(window.__sgSuggest[+li.dataset.i])});
  document.addEventListener('click',ev=>{if(!ev.target.closest('.sg-search'))sgCloseSuggest()});
  window.addEventListener('scroll',ev=>{if(ev.target!==ul)sgCloseSuggest()},true);window.addEventListener('resize',sgCloseSuggest)
}
// 變更適用公司：已選成員中，不屬於新公司（帳號對應公司組織不含該公司）的成員自動移除並提示；其餘成員的部門改顯示新公司下的部門。
function onCompanyChange(){
  const company=document.getElementById('sgCompany').value;
  let removed=0;
  Array.from(document.querySelectorAll('#sgMemberRows tr')).forEach(tr=>{
    const e=sgEmpByCode(tr.dataset.code,company);
    if(e&&e.orgs.some(o=>o.company===company)){tr.outerHTML=memberRowHtml(e,company)}
    else{tr.remove();removed++}
  });
  if(removed)showToast(`已移除 ${removed} 位不屬於此公司的成員`)
}
// 「查看編輯」可新增／編輯群組；「僅可異動成員」只能進入既有群組維護成員（基本資料唯讀、不可新增群組）。
function initDetail(){
  const params=new URLSearchParams(location.search);
  const editing=params.has('id');
  if(sgMemberOnly&&!editing){location.replace('list.html?perm=member');return}
  const g=editing?(signoffGroups.find(x=>x.id===params.get('id'))||signoffGroups[0]):null;
  document.getElementById('detailTitle').textContent=!editing?'新增群組':sgMemberOnly?'維護成員':'編輯群組';
  if(g){
    document.getElementById('sgIdView').textContent=g.id;
    document.getElementById('sgName').value=g.name;
    document.getElementById('sgCompany').value=g.company;
    document.getElementById('sgDesc').value=g.desc;
    document.getElementById('sgMemberRows').innerHTML=g.members.map(m=>sgEmpByCode(sgLabelCode(m),g.company)).filter(Boolean).map(e=>memberRowHtml(e,g.company)).join('');
  }else{
    document.getElementById('sgMemberRows').innerHTML='';
  }
  if(sgMemberOnly)['sgName','sgCompany','sgDesc'].forEach(id=>document.getElementById(id).disabled=true);
  document.getElementById('sgCompany').addEventListener('change',onCompanyChange);
  initMemberSearch();
}
function saveGroup(){
  if(!sgMemberOnly){
    const required=['sgName','sgCompany'];
    if(required.some(id=>!document.getElementById(id).value)){showToast('請完成所有必填欄位');return}
    // 同一適用公司下群組名稱不可重複（修改時排除自己）；不同公司可有同名群組。
    const editId=new URLSearchParams(location.search).get('id');
    const name=document.getElementById('sgName').value.trim();
    const company=document.getElementById('sgCompany').value;
    if(signoffGroups.some(x=>x.name===name&&x.company===company&&x.id!==editId)){showToast('此適用公司下已有相同名稱的群組');return}
  }
  showToast(sgMemberOnly?'Demo：群組成員已儲存':'Demo：群組資料已儲存')
}
document.addEventListener('DOMContentLoaded',()=>{
  initPermSelect();
  const addBtn=document.getElementById('addGroupBtn');if(addBtn&&sgMemberOnly)addBtn.hidden=true;
  if(document.getElementById('sgRows'))renderGroups();
  if(document.getElementById('detailTitle'))initDetail();
});
