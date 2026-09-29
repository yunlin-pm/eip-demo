const delegateCompanies=[
  {key:'cbs',name:'網家跨境服務股份有限公司',employees:['羅弘奕 (B019)','朱驥瑋 (B136)','黃少佑 (B206)']},
  {key:'bb',name:'比比昂株式會社',employees:['李東海 (B125)','曹圭賢 (B126)','金厲旭 (B127)']},
  {key:'air',name:'空中補給股份有限公司',employees:['王曉明 (A123)','張專員 (A089)','陳小華 (A156)']}
];
const delegatePeriods={
  cbs:[
    {id:1,proxy:'羅弘奕 (B019)',start:'2026-09-23',end:'2026-09-30',status:'有效'},
    {id:2,proxy:'朱驥瑋 (B136)',start:'2026-10-05',end:'2026-10-09',status:'排程中'}
  ],
  bb:[{id:3,proxy:'李東海 (B125)',start:'2026-10-12',end:'2026-10-16',status:'排程中'}],
  air:[]
};
let editingContext=null;
function showToast(message){const el=document.getElementById('delegateToast');el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)}
function formatDate(value){return value.replaceAll('-','/')}
function statusTone(status){return status==='有效'?'active':status==='排程中'?'scheduled':'cancelled'}
function companyByKey(key){return delegateCompanies.find(company=>company.key===key)}
function renderCompanies(){
  const root=document.getElementById('delegateCompanyBlocks');
  root.innerHTML=delegateCompanies.map(company=>{
    const rows=delegatePeriods[company.key].length?delegatePeriods[company.key].map(period=>{
      const mutable=period.status!=='取消';
      return `<tr><td><span class="status-badge ${statusTone(period.status)}">${period.status}</span></td><td>${formatDate(period.start)}～${formatDate(period.end)}</td><td>${period.proxy}</td><td><div class="delegate-actions">${mutable?`<button class="btn compact" type="button" onclick="openPeriodModal('${company.key}',${period.id})">修改</button><button class="btn compact" type="button" onclick="removePeriod('${company.key}',${period.id})">${period.status==='有效'?'取消':'刪除'}</button>`:'—'}</div></td></tr>`;
    }).join(''):'<tr><td class="empty" colspan="4">尚無代理簽核期間資料</td></tr>';
    const current=delegatePeriods[company.key].find(period=>period.status==='有效');
    return `<section class="panel delegate-company"><h2><span class="delegate-company-name">${company.name}</span><button class="btn primary" type="button" onclick="openPeriodModal('${company.key}')">＋ 新增期間</button></h2><div class="body"><div class="delegate-current"><span class="label">目前代理簽核者</span><strong>${current?current.proxy:'—'}</strong></div><div class="table-scroll"><table class="delegate-table"><thead><tr><th>狀態</th><th>代理簽核期間</th><th>實際代理簽核者</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table></div></div></section>`;
  }).join('');
}
function openPeriodModal(companyKey,periodId){
  const company=companyByKey(companyKey);const period=delegatePeriods[companyKey].find(item=>item.id===periodId);
  editingContext={companyKey,periodId:periodId||null};
  document.getElementById('periodModalTitle').textContent=period?'修改代理期間':'新增代理期間';
  document.getElementById('periodCompany').textContent=company.name;
  document.getElementById('periodProxy').innerHTML='<option value="">請選擇員工</option>'+company.employees.map(name=>`<option>${name}</option>`).join('');
  document.getElementById('periodProxy').value=period?.proxy||'';
  document.getElementById('periodStart').value=period?.start||'';
  document.getElementById('periodEnd').value=period?.end||'';
  document.getElementById('periodError').hidden=true;
  document.getElementById('periodModal').hidden=false;
}
function closePeriodModal(){document.getElementById('periodModal').hidden=true;editingContext=null}
function confirmPeriod(){
  const proxy=document.getElementById('periodProxy').value;const start=document.getElementById('periodStart').value;const end=document.getElementById('periodEnd').value;const error=document.getElementById('periodError');
  if(!proxy||!start||!end){error.textContent='請完成所有必填欄位';error.hidden=false;return}
  if(end<start){error.textContent='結束日期不可早於開始日期';error.hidden=false;return}
  const periods=delegatePeriods[editingContext.companyKey];
  if(editingContext.periodId){const item=periods.find(period=>period.id===editingContext.periodId);Object.assign(item,{proxy,start,end})}
  else{periods.push({id:Date.now(),proxy,start,end,status:'排程中'})}
  closePeriodModal();renderCompanies();showToast('代理期間已儲存')
}
function removePeriod(companyKey,periodId){
  const periods=delegatePeriods[companyKey];const index=periods.findIndex(period=>period.id===periodId);if(index<0)return;
  if(periods[index].status==='有效'){periods[index].status='取消'}else{periods.splice(index,1)}
  renderCompanies();showToast('代理期間已更新')
}
document.addEventListener('DOMContentLoaded',()=>{renderCompanies();document.getElementById('confirmPeriod').addEventListener('click',confirmPeriod);document.querySelectorAll('[data-close-period]').forEach(el=>el.addEventListener('click',closePeriodModal))});
