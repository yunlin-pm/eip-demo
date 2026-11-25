/* AI工具帳號管理（Demo）：帳號清冊列表。單一清單（沒有頁籤）；帳號與使用紀錄皆由管理人員手動維護，狀態、目前方案、預計結束日期、最後一次停用日由使用紀錄推算。 */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let view=[];
const accounts=AIA_ACCOUNTS.map(x=>({...x}));
const ymd=v=>(v||'').replace(/\D/g,'').slice(0,8),rd=v=>(v||'').replace(/\D/g,'');
const personName=v=>String(v||'').replace(/\([^)]*\)\s*$/,'').trim();
const personId=v=>{const m=String(v||'').match(/\(([^)]*)\)\s*$/);return m?m[1]:''};
const cur=a=>aiaCurrent(a);
const stateOf=a=>cur(a).stopped?'stopped':'using';
function keywordMatch(a,q){if(!q)return true;const type=$('#keywordType').value;const v={account:a.account,userName:personName(a.user),userId:personId(a.user),dept:a.dept,form:a.records.map(r=>r.formNo).join(' ')};const value=type==='all'?Object.values(v).join(' '):v[type];return String(value||'').toLowerCase().includes(q.toLowerCase())}
function filtered(){const q=$('#keyword').value.trim(),st=$('#fState').value,us=$('#fUsage').value,pl=$('#fPlan').value,ef=ymd($('#expFrom').value),et=ymd($('#expTo').value);
  return accounts.filter(a=>(!st||stateOf(a)===st)&&(!us||a.usage===us)&&(!pl||cur(a).planKey===pl)&&keywordMatch(a,q)&&((!ef&&!et)||(cur(a).end&&(!ef||rd(cur(a).end)>=ef)&&(!et||rd(cur(a).end)<=et))))}
const stText=a=>cur(a).stopped?'已停用':'使用中';
const endCell=a=>cur(a).end?`<span class="acct-expire${aiaIsOverdue(a)?' over':''}">${cur(a).end}</span>${aiaIsOverdue(a)?'<span class="acct-overdue">已逾期</span>':''}`:'—';
function render(){view=filtered();$('#count').textContent=view.length;
  $('#rows').innerHTML=view.map(a=>`<tr><td><span class="acct-status ${stateOf(a)}">${stText(a)}</span></td><td><a class="row-action" href="detail.html?mode=view&id=${a.id}">查看</a>　<a class="row-action" href="detail.html?mode=edit&id=${a.id}">編輯</a></td><td class="col-acct-account">${a.account}</td><td>${a.user}</td><td>${a.dept}</td><td>${a.usage}</td><td>${cur(a).plan||'—'}</td><td>${endCell(a)}</td><td>${cur(a).lastStop||'—'}</td></tr>`).join('');
  $('#mobileCards').innerHTML=view.map(a=>`<a class="mobile-claim-card" href="detail.html?mode=view&id=${a.id}"><div class="mobile-claim-head"><span class="mobile-status ${stateOf(a)}">${stText(a)}</span></div><strong class="mobile-claim-no" style="word-break:break-all">${a.account}</strong><div class="mobile-company">${cur(a).plan||'—'}</div><div class="mobile-claim-meta"><span>使用者：${a.user}</span><span>使用方式：${a.usage}</span><span class="full">部門：${a.dept}</span><span class="full">預計結束日期：${cur(a).end||'—'}${aiaIsOverdue(a)?'（已逾期）':''}</span></div><div class="mobile-claim-foot"><strong>最後一次停用日：${cur(a).lastStop||'—'}</strong><span>查看 <b aria-hidden="true">›</b></span></div></a>`).join('');
  $('#empty').hidden=!!view.length;$('#mobileEmpty').hidden=!!view.length;}
$('#search').onclick=render;$('#keyword').addEventListener('keydown',e=>{if(e.key==='Enter')render()});
$('#clear').onclick=()=>{$$('.filters select,.filters input').forEach(x=>x.value='');$('#keywordType').value='all';render()};
$('#exportBtn').onclick=()=>alert(`匯出 Excel（示意）：依目前查詢條件匯出 ${view.length} 筆。`);
render();
