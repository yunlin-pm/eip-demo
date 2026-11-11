/* 公告內容頁：依 ?id= 顯示公告；「返回列表」帶回列表頁的頁碼（?page=）。上方「範例公告」下拉僅供 Demo 切換。 */
(function(){
  const $=s=>document.querySelector(s),params=new URLSearchParams(location.search);
  const page=parseInt(params.get('page'),10)||1,list=page>1?`list.html?page=${page}`:'list.html';
  $('#backBtn').href=list;$('#crumbList').href=list;
  const sorted=annSorted(),pick=$('#demoPick');
  pick.innerHTML=sorted.map(a=>`<option value="${a.id}">${annEsc(a.title)}</option>`).join('');
  function ext(name){return (name.split('.').pop()||'').toUpperCase().slice(0,4)}
  function show(id){
    const a=ANNOUNCEMENTS.find(x=>x.id===id&&annVisible(x));
    $('#article').hidden=!a;$('#missing').hidden=!!a;if(!a){document.title='公告內容｜Bibian EIP Demo';return}
    pick.value=a.id;document.title=`${a.title}｜公司公告｜Bibian EIP Demo`;
    $('#tags').innerHTML=`<span class="ann-type ${ANN_TYPES[a.type]}">${annEsc(a.type)}</span>${a.pinned?'<span class="ann-pin">置頂</span>':''}`;
    $('#title').textContent=a.title;$('#date').textContent=annFmt(a.date);
    $('#summary').textContent=a.summary;
    $('#content').innerHTML=a.content||'<p class="ann-none">—</p>';
    $('#files').innerHTML=a.attachments.length?a.attachments.map(f=>`<button class="ann-file" type="button" data-name="${annEsc(f.name)}"><span class="file-thumb">${annEsc(ext(f.name))}</span><span class="ann-file-meta"><b>${annEsc(f.name)}</b><small>${annEsc(f.size)}・點擊下載</small></span><span class="ann-file-dl" aria-hidden="true">⇩</span></button>`).join(''):'<p class="ann-none">無附件</p>';
  }
  pick.onchange=()=>{params.set('id',pick.value);history.replaceState(null,'',`?${params}`);show(pick.value);window.scrollTo({top:0})};
  $('#files').addEventListener('click',e=>{const b=e.target.closest('.ann-file');if(b)alert(`Demo：下載「${b.dataset.name}」`)});
  show(params.get('id')||sorted[0].id);
})();
