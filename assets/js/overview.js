function goToOverviewFiltered(kind){window.location.href='overview/list.html?status='+encodeURIComponent(kind)}
function goToPage(page){var routes={overview:'overview.html','admin-form-list':'approvals/list.html','remit-vendor-list':'remittance/vendor-list.html','remit-payroll-list':'remittance/payroll-list.html','my-delegate':'delegates/my-delegate.html','delegate-settings':'delegates/settings.html',profile:'settings/profile.html'};if(routes[page])window.location.href=routes[page]}
function showLoginScreen(){window.location.href='login.html'}
function toggleDropdown(id){var el=document.getElementById(id);if(el)el.classList.toggle('open')}
/* 公司公告：資料與排序規則見 announcement-data.js；總覽最多顯示 5 則，點公告開公告內容頁，「更多公告」開公告列表頁。 */
(function(){
  var list=document.getElementById('annList');if(!list||typeof ANNOUNCEMENTS==='undefined')return;
  var rows=annSorted().slice(0,5);
  list.innerHTML=rows.map(function(r){
    return '<a class="ann-item'+(r.pinned?' is-pinned':'')+'" href="announcements/detail.html?id='+encodeURIComponent(r.id)+'"><time>'+annFmt(r.date)+'</time><div class="ann-body"><div class="ann-line"><span class="ann-type '+ANN_TYPES[r.type]+'">'+annEsc(r.type)+'</span><strong>'+annEsc(r.title)+'</strong></div><small title="'+annEsc(r.summary)+'">'+annEsc(r.summary)+'</small></div><span class="ann-badges">'+(r.pinned?'<span class="ann-pin">置頂</span>':'')+'</span></a>';
  }).join('');
  document.getElementById('annEmpty').hidden=rows.length>0;
})();
/* 我的待辦：要處理的卡片（待我簽核、退回待處理）數字大於 0 時加強顯示，為 0 時改為灰色並顯示「目前沒有待辦」 */
document.querySelectorAll('.task-action').forEach(function(c){var n=parseInt(c.querySelector('.card-number').textContent,10)||0;c.classList.toggle('has-items',n>0);c.classList.toggle('is-zero',n===0);c.querySelector('.task-hint').textContent=n>0?'':'目前沒有待辦'});
