/* 公告列表頁：資料與排序見 announcement-data.js；每頁 10 筆，頁碼記在網址 ?page=，從內容頁返回時回到同一頁。 */
(function(){
  const $=s=>document.querySelector(s),PAGE_SIZE=10,params=new URLSearchParams(location.search);
  const data=annSorted(),pages=Math.max(1,Math.ceil(data.length/PAGE_SIZE));
  let page=Math.min(Math.max(parseInt(params.get('page'),10)||1,1),pages);
  const typeTag=r=>`<span class="ann-type ${ANN_TYPES[r.type]}">${annEsc(r.type)}</span>`;
  const pinTag=r=>r.pinned?'<span class="ann-pin">置頂</span>':'<span class="ann-dash">—</span>';
  const href=r=>`detail.html?id=${encodeURIComponent(r.id)}&page=${page}`;
  function render(){
    const rows=data.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
    $('#count').textContent=data.length;
    $('#rows').innerHTML=rows.map(r=>`<tr class="${r.pinned?'is-pinned':''}"><td class="col-date">${annFmt(r.date)}</td><td class="col-pin">${pinTag(r)}</td><td class="col-type">${typeTag(r)}</td><td class="col-title"><a href="${href(r)}">${annEsc(r.title)}</a></td><td class="col-summary" title="${annEsc(r.summary)}">${annEsc(r.summary)}</td></tr>`).join('');
    $('#cards').innerHTML=rows.map(r=>`<a class="mobile-claim-card ann-card${r.pinned?' is-pinned':''}" href="${href(r)}"><div class="ann-card-head">${typeTag(r)}${r.pinned?'<span class="ann-pin">置頂</span>':''}</div><strong>${annEsc(r.title)}</strong><p>${annEsc(r.summary)}</p><time>${annFmt(r.date)}</time></a>`).join('');
    $('#empty').hidden=$('#mobileEmpty').hidden=data.length>0;
    // 分頁：上一頁｜頁碼｜下一頁；只有一頁時仍顯示，按鈕停用
    let html=`<button type="button" data-page="${page-1}" ${page<=1?'disabled':''} aria-label="上一頁">‹</button>`;
    for(let i=1;i<=pages;i++)html+=`<button type="button" data-page="${i}" class="${i===page?'current':''}" ${i===page?'aria-current="page"':''}>${i}</button>`;
    html+=`<button type="button" data-page="${page+1}" ${page>=pages?'disabled':''} aria-label="下一頁">›</button><span class="ann-pager-info">第 ${page} / ${pages} 頁</span>`;
    $('#pager').innerHTML=html;
  }
  $('#pager').addEventListener('click',e=>{const b=e.target.closest('button[data-page]');if(!b||b.disabled)return;page=+b.dataset.page;history.replaceState(null,'',`?page=${page}`);render();window.scrollTo({top:0})});
  render();
})();
