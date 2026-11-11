/* 公告管理內容頁：新增（?mode=new）／編輯（?mode=edit&id=）。只有「返回」「儲存」；Demo 無後端，儲存只做檢核並提示。 */
(function(){
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],params=new URLSearchParams(location.search),mode=$('#mode');
  const iso=d=>d?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';
  const ext=n=>(n.split('.').pop()||'').toUpperCase().slice(0,4);
  function fileCard(f){return`<div class="file-card"><button class="file-preview" type="button" title="預覽附件"><span class="file-thumb">${annEsc(ext(f.name))}</span><span class="file-meta"><b class="file-name">${annEsc(f.name)}</b><small class="file-status">✓ 已上傳・${annEsc(f.size||'')}</small></span></button><button class="file-action file-remove" type="button" title="移除附件">×</button></div>`}
  function setRadio(name,v){$$(`input[name=${name}]`).forEach(x=>x.checked=x.value===v)}
  function fill(a){
    $$('input[name=company]').forEach(x=>x.checked=a?a.companies.includes(x.value):x.value==='CBS');
    setRadio('type',a?a.type:'');$('#title').value=a?a.title:'';$('#summary').value=a?a.summary:'';
    $('#date').value=a?iso(a.date):iso(ANN_TODAY);$('#expiry').value=a?iso(a.expiry):'';
    setRadio('pinned',a&&a.pinned?'1':'0');setRadio('notify',a&&a.notify?'1':'0');syncNotify();setRadio('published',a?(a.published?'1':'0'):'0');
    $('#content').innerHTML=a?a.content:'';
    $$('#files .file-card').forEach(x=>x.remove());(a?a.attachments:[]).forEach(f=>$('#uploadBtn').insertAdjacentHTML('beforebegin',fileCard(f)));
    counts();
  }
  function syncNotify(){$('#notifyNote').hidden=$('input[name=notify]:checked')?.value!=='1'}
  function counts(){$('#titleCount').textContent=$('#title').value.length;$('#summaryCount').textContent=$('#summary').value.length}
  function apply(){
    const m=mode.value,a=m==='edit'?(ANNOUNCEMENTS.find(x=>x.id===params.get('id'))||annSortedAll()[0]):null;
    $('#pageTitle').textContent=a?`編輯公告（${a.id}）`:'新增公告';
    $('#metaInfo').textContent=a?`最後編輯：${a.editor}　${annFmtTime(a.edited)}`:'公告編號：儲存後由系統產生';
    document.title=(a?'編輯公告':'新增公告')+'｜Bibian EIP Demo';
    fill(a);
  }
  function validate(){
    if(!$$('input[name=company]:checked').length)return'請至少勾選一間公告公司。';
    if(!$('input[name=type]:checked'))return'請選擇公告類型。';
    if(!$('input[name=pinned]:checked'))return'請選擇是否置頂。';
    if(!$('#title').value.trim())return'請填寫公告標題。';
    if(!$('#summary').value.trim())return'請填寫公告摘要。';
    if(!$('#date').value)return'請選擇發佈日期。';
    if($('#expiry').value&&$('#expiry').value<$('#date').value)return'到期日期不可早於發佈日期。';
    if(!$('input[name=published]:checked'))return'請選擇是否發佈公告。';
    if(!$('input[name=notify]:checked'))return'請選擇是否發送 Email 通知。';
    if(!$('#content').textContent.trim())return'請填寫公告內容。';
    return'';
  }
  $('#saveBtn').onclick=()=>{const err=validate();if(err){alert(err);return}alert('已儲存公告。')};
  $('#title').oninput=$('#summary').oninput=counts;
  $$('input[name=notify]').forEach(x=>x.onchange=syncNotify);
  // 編輯器（比照簽呈單）
  document.addEventListener('click',e=>{const c=e.target.closest('[data-command]');if(!c)return;let v=null;if(c.dataset.command==='createLink'){v=prompt('請輸入連結網址');if(!v)return}document.execCommand(c.dataset.command,false,v);$('#content').focus()});
  $('#editorSize').onchange=e=>{document.execCommand('fontSize',false,e.target.value);$('#content').focus()};
  $('#editorColor').oninput=e=>{document.execCommand('foreColor',false,e.target.value);$('#content').focus()};
  // 附件
  $('#files').addEventListener('click',e=>{
    if(e.target.closest('.file-remove')){e.target.closest('.file-card').remove();return}
    if(e.target.closest('#uploadBtn')){if($$('#files .file-card').length>=20){alert('最多 20 個檔案。');return}$('#uploadBtn').insertAdjacentHTML('beforebegin',fileCard({name:'公告附件.pdf',size:'480 KB'}))}
    if(e.target.closest('.file-preview'))alert('Demo：預覽附件');
  });
  const start=params.get('mode')==='edit'?'edit':'new';mode.value=start;
  mode.onchange=()=>{const q=mode.value==='edit'?`?mode=edit&id=${params.get('id')||annSortedAll()[0].id}`:'?mode=new';history.replaceState(null,'',q);params.set('mode',mode.value);if(mode.value==='edit'&&!params.get('id'))params.set('id',annSortedAll()[0].id);apply()};
  apply();
})();
