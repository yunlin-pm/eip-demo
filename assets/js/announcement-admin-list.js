/* 公告管理列表：列出全部公告（含不發佈、未到發佈日、已過到期日）；發佈狀態＝發佈公告欄位（已發佈／不發佈），排序同同仁端（置頂優先，再依發佈日期新到舊）；每頁 10 筆。 */
(function(){
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],PAGE_SIZE=10;
  const pubStatus=a=>a.published?'已發佈':'不發佈';
  const ymd=v=>String(v||'').replace(/\D/g,'').slice(0,8);
  const rowDate=d=>annFmt(d).replace(/\//g,'');
  let page=1,cond={};
  function readCond(){cond={company:$('#fCompany').value,type:$('#fType').value,status:$('#fStatus').value,kw:$('#fKeyword').value.trim().toLowerCase(),from:ymd($('#fFrom').value),to:ymd($('#fTo').value)}}
  function filtered(){
    return annSortedAll().filter(a=>{
      if(cond.company&&a.companies.indexOf(cond.company)<0)return false;
      if(cond.type&&a.type!==cond.type)return false;
      if(cond.status&&pubStatus(a)!==cond.status)return false;
      if(cond.kw&&!(a.title+a.summary).toLowerCase().includes(cond.kw))return false;
      const d=rowDate(a.date);if(cond.from&&d<cond.from)return false;if(cond.to&&d>cond.to)return false;
      return true;
    });
  }
  const statusTag=a=>`<span class="ann-status ${a.published?'live':'hidden'}">${pubStatus(a)}</span>`;
  const notifyTag=a=>a.notify?'<span class="ann-notify on">要通知</span>':'<span class="ann-notify">不通知</span>';
  const typeTag=a=>`<span class="ann-type ${ANN_TYPES[a.type]}">${annEsc(a.type)}</span>`;
  const companies=a=>a.companies.map(c=>ANN_COMPANY_SHORT[c]).join('、');
  const fullCompanies=a=>a.companies.map(c=>ANN_COMPANIES[c]).join('、');
  const href=a=>`detail.html?mode=edit&id=${encodeURIComponent(a.id)}`;
  function render(){
    const data=filtered(),pages=Math.max(1,Math.ceil(data.length/PAGE_SIZE));if(page>pages)page=pages;
    const rows=data.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
    $('#count').textContent=data.length;
    $('#rows').innerHTML=rows.map(a=>`<tr><td class="col-edit"><a class="ann-edit" href="${href(a)}">編輯</a></td><td class="col-status">${statusTag(a)}</td><td class="col-pin">${a.pinned?'<span class="ann-pin">置頂</span>':'<span class="ann-dash">—</span>'}</td><td class="col-type">${typeTag(a)}</td><td class="col-title"><a href="${href(a)}" title="${annEsc(a.title)}">${annEsc(a.title)}</a></td><td class="col-company" title="${annEsc(fullCompanies(a))}">${annEsc(companies(a))}</td><td class="col-date">${annFmt(a.date)}</td><td class="col-date">${a.expiry?annFmt(a.expiry):'<span class="ann-dash">不到期</span>'}</td><td class="col-notify">${notifyTag(a)}</td><td class="col-user">${annEsc(a.editor)}</td><td class="col-time">${annFmtTime(a.edited)}</td><td class="col-user">${annEsc(a.creator)}</td><td class="col-time">${annFmtTime(a.created)}</td></tr>`).join('');
    $('#cards').innerHTML=rows.map(a=>`<a class="mobile-claim-card ann-card" href="${href(a)}"><div class="ann-card-head">${statusTag(a)}${typeTag(a)}${a.pinned?'<span class="ann-pin">置頂</span>':''}</div><strong>${annEsc(a.title)}</strong><p>${annEsc(companies(a))}</p><time>發佈 ${annFmt(a.date)}　到期 ${a.expiry?annFmt(a.expiry):'不到期'}　Email ${a.notify?'要通知':'不通知'}</time><time class="ann-card-sub">最後編輯：${annEsc(a.editor)} ${annFmtTime(a.edited)}</time></a>`).join('');
    $('#empty').hidden=$('#mobileEmpty').hidden=data.length>0;
    let html=`<button type="button" data-page="${page-1}" ${page<=1?'disabled':''} aria-label="上一頁">‹</button>`;
    for(let i=1;i<=pages;i++)html+=`<button type="button" data-page="${i}" class="${i===page?'current':''}" ${i===page?'aria-current="page"':''}>${i}</button>`;
    html+=`<button type="button" data-page="${page+1}" ${page>=pages?'disabled':''} aria-label="下一頁">›</button><span class="ann-pager-info">第 ${page} / ${pages} 頁</span>`;
    $('#pager').innerHTML=html;
  }
  $('#pager').addEventListener('click',e=>{const b=e.target.closest('button[data-page]');if(!b||b.disabled)return;page=+b.dataset.page;render();window.scrollTo({top:0})});
  $('#search').onclick=()=>{readCond();page=1;render()};
  $('#clear').onclick=()=>{$$('.filters select,.filters input').forEach(x=>x.value='');readCond();page=1;render()};
  $('#fKeyword').addEventListener('keydown',e=>{if(e.key==='Enter')$('#search').click()});
  readCond();render();
})();
