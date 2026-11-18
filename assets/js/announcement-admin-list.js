/* 公告管理列表：列出全部公告（含不發佈、未到發佈日、已過到期日）；發佈狀態＝發佈公告欄位（已發佈／不發佈），排序同同仁端（置頂優先，再依發佈日期新到舊）；每頁 10 筆。
   「發送通知信」欄：未發送＝按鈕，開啟「發送通知信」視窗（列出收件公司與信箱，確認後發送）；已發送＝「MMDD已發送」，點擊開啟發送紀錄視窗；每則公告只能發送一次；發佈狀態為「已發佈」且今天在發佈日期～到期日期之間（含到期日當天）才可發送，否則按鈕停用並提示原因。Demo 無後端，發送結果只記在畫面記憶體，重新整理後還原。 */
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
  const p2=n=>String(n).padStart(2,'0');
  const mmdd=d=>p2(d.getMonth()+1)+p2(d.getDate());
  const fmtMin=d=>annFmt(d)+' '+p2(d.getHours())+':'+p2(d.getMinutes());
  // 可發送條件：發佈狀態＝已發佈，且今天在發佈日期～到期日期之間（含到期日當天）＝annStatus 為「顯示中」
  const mailBlock=a=>{const st=annStatus(a);return st==='顯示中'?'':st==='隱藏'?'發佈狀態為「不發佈」':st==='排程中'?`尚未到發佈日期（${annFmt(a.date)}）`:`已過到期日期（${annFmt(a.expiry)}）`};
  const mailCtl=a=>{
    if(a.sentAt)return`<button type="button" class="ann-mail-sent" data-mail="${annEsc(a.id)}" title="檢視通知信發送紀錄">${mmdd(a.sentAt)}已發送</button>`;
    const why=mailBlock(a);
    return why?`<button type="button" class="ann-mail-btn" disabled title="${annEsc(why)}，不可發送通知信">發送通知信</button>`:`<button type="button" class="ann-mail-btn" data-mail="${annEsc(a.id)}">發送通知信</button>`;
  };
  const mailLabel=a=>!a.sentAt&&mailBlock(a)?`<span class="ann-card-mail-why">${annEsc(mailBlock(a))}，不可發送</span>`:'<span>通知信</span>';
  const typeTag=a=>`<span class="ann-type ${ANN_TYPES[a.type]}">${annEsc(a.type)}</span>`;
  const companies=a=>a.companies.map(c=>ANN_COMPANY_SHORT[c]).join('、');
  const fullCompanies=a=>a.companies.map(c=>ANN_COMPANIES[c]).join('、');
  const href=a=>`detail.html?mode=edit&id=${encodeURIComponent(a.id)}`;
  function render(){
    const data=filtered(),pages=Math.max(1,Math.ceil(data.length/PAGE_SIZE));if(page>pages)page=pages;
    const rows=data.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
    $('#count').textContent=data.length;
    $('#rows').innerHTML=rows.map(a=>`<tr><td class="col-edit"><a class="ann-edit" href="${href(a)}">編輯</a></td><td class="col-status">${statusTag(a)}</td><td class="col-pin">${a.pinned?'<span class="ann-pin">置頂</span>':'<span class="ann-dash">—</span>'}</td><td class="col-type">${typeTag(a)}</td><td class="col-title"><a href="${href(a)}" title="${annEsc(a.title)}">${annEsc(a.title)}</a></td><td class="col-company" title="${annEsc(fullCompanies(a))}">${annEsc(companies(a))}</td><td class="col-date">${annFmt(a.date)}</td><td class="col-date">${a.expiry?annFmt(a.expiry):'<span class="ann-dash">不到期</span>'}</td><td class="col-mail">${mailCtl(a)}</td><td class="col-user">${annEsc(a.editor)}</td><td class="col-time">${annFmtTime(a.edited)}</td><td class="col-user">${annEsc(a.creator)}</td><td class="col-time">${annFmtTime(a.created)}</td></tr>`).join('');
    $('#cards').innerHTML=rows.map(a=>`<div class="ann-card-box"><a class="mobile-claim-card ann-card" href="${href(a)}"><div class="ann-card-head">${statusTag(a)}${typeTag(a)}${a.pinned?'<span class="ann-pin">置頂</span>':''}</div><strong>${annEsc(a.title)}</strong><p>${annEsc(companies(a))}</p><time>發佈 ${annFmt(a.date)}　到期 ${a.expiry?annFmt(a.expiry):'不到期'}</time><time class="ann-card-sub">最後編輯：${annEsc(a.editor)} ${annFmtTime(a.edited)}</time></a><div class="ann-card-mail">${mailLabel(a)}${mailCtl(a)}</div></div>`).join('');
    $('#empty').hidden=$('#mobileEmpty').hidden=data.length>0;
    let html=`<button type="button" data-page="${page-1}" ${page<=1?'disabled':''} aria-label="上一頁">‹</button>`;
    for(let i=1;i<=pages;i++)html+=`<button type="button" data-page="${i}" class="${i===page?'current':''}" ${i===page?'aria-current="page"':''}>${i}</button>`;
    html+=`<button type="button" data-page="${page+1}" ${page>=pages?'disabled':''} aria-label="下一頁">›</button><span class="ann-pager-info">第 ${page} / ${pages} 頁</span>`;
    $('#pager').innerHTML=html;
  }
  // 發送通知信視窗
  const modal=$('#mailModal'),subject=a=>`【Bibian EIP】公司公告 — ${a.title}`;
  const rcpt=a=>`<ul class="ann-mail-companies">${a.companies.map(c=>`<li><b>${annEsc(ANN_COMPANIES[c])}</b>${ANN_COMPANY_MAIL[c]?`<span>${annEsc(ANN_COMPANY_MAIL[c])}</span>`:'<span class="ann-mail-none">（信箱尚未設定）</span>'}</li>`).join('')}</ul>`;
  // 通知信內容預覽：只呈現主旨與信件本文（不含寄件者、收件者、Logo 標題列與 Footer）；文字依規格 6.2 範本
  const preview=a=>`<div class="ann-mail-preview"><p class="ann-mail-lead">通知信內容預覽</p><div class="ann-mail-box"><p class="ann-mail-subject"><span>主旨</span><b>${annEsc(subject(a))}</b></p><div class="ann-mail-copy"><p>各位同仁您好：</p><p>Bibian EIP 已發布一則新的公司公告，請撥空查看相關內容。</p><p><strong>公告資訊</strong><br>發布日期：${annFmt(a.date)}<br>公告類型：${annEsc(a.type)}<br>公告標題：${annEsc(a.title)}</p><p><strong>公告摘要</strong><br>${annEsc(a.summary)}</p><p>請點選下方連結，前往 Bibian EIP 查看完整公告內容及相關附件。</p><p><span class="ann-mail-cta">前往查看公告</span></p></div></div></div>`;
  let mailAnn=null,lastFocus=null;
  function closeMail(){modal.hidden=true;if(lastFocus&&lastFocus.isConnected)lastFocus.focus()}
  function openMail(a,trigger){
    mailAnn=a;lastFocus=trigger;
    if(a.sentAt){
      $('#mailTitle').textContent='通知信發送紀錄';
      $('#mailBody').innerHTML=`<dl class="ann-mail-info"><dt>公告標題</dt><dd>${annEsc(a.title)}</dd><dt>發送時間</dt><dd>${fmtMin(a.sentAt)}</dd><dt>發送人員</dt><dd>${annEsc(a.sentBy)}</dd></dl><p class="ann-mail-lead">已通知以下公司全體員工：</p>${rcpt(a)}<p class="ann-mail-note">每則公告只能發送一次，已發送的通知信不可重新發送。</p>`;
      $('#mailActions').innerHTML='<button type="button" class="btn primary" data-close-mail>關閉</button>';
    }else{
      $('#mailTitle').textContent='發送通知信';
      $('#mailBody').innerHTML=`<p class="ann-mail-lead">通知以下公司全體員工：</p>${rcpt(a)}${preview(a)}<p class="ann-mail-note">確認發送後，系統將以 Bibian EIP 名義寄出公司公告通知信。每則公告只能發送一次，發送後無法撤回或重新發送，請先確認公告內容與公告公司無誤。</p>`;
      $('#mailActions').innerHTML='<button type="button" class="btn" data-close-mail>取消</button><button type="button" class="btn primary" id="mailSend">確認發送</button>';
    }
    modal.hidden=false;(modal.querySelector('#mailSend')||modal.querySelector('.btn.primary')).focus();
  }
  let toastTimer;
  function toast(t){const el=$('#annToast');el.textContent=t;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{el.hidden=true},3200)}
  document.addEventListener('click',e=>{
    const m=e.target.closest('[data-mail]');
    if(m&&!m.disabled){const a=ANNOUNCEMENTS.find(x=>x.id===m.dataset.mail);if(a)openMail(a,m);return}
    if(e.target.closest('[data-close-mail]')){closeMail();return}
    if(e.target.closest('#mailSend')&&mailAnn&&!mailAnn.sentAt&&!mailBlock(mailAnn)){
      // 第一次「確認發送」→ 切到二次確認畫面，避免誤發
      $('#mailTitle').textContent='再次確認發送';
      $('#mailBody').innerHTML=`<p class="ann-mail-lead ann-mail-warn">確定要發送這封通知信嗎？</p><dl class="ann-mail-info"><dt>公告標題</dt><dd>${annEsc(mailAnn.title)}</dd></dl><p class="ann-mail-lead">將通知以下公司全體員工：</p>${rcpt(mailAnn)}<p class="ann-mail-note">發送後無法撤回，也無法重新發送。</p>`;
      $('#mailActions').innerHTML='<button type="button" class="btn" id="mailBack">返回</button><button type="button" class="btn primary" id="mailSend2">確定發送</button>';
      $('#mailSend2').focus();return;
    }
    if(e.target.closest('#mailBack')&&mailAnn){openMail(mailAnn,lastFocus);return}
    if(e.target.closest('#mailSend2')&&mailAnn&&!mailAnn.sentAt){
      mailAnn.sentAt=new Date();mailAnn.sentBy='陳庭瑋';const t=mailAnn.title;modal.hidden=true;lastFocus=null;render();toast(`已發送通知信：${t}`);
    }
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeMail()});
  $('#pager').addEventListener('click',e=>{const b=e.target.closest('button[data-page]');if(!b||b.disabled)return;page=+b.dataset.page;render();window.scrollTo({top:0})});
  $('#search').onclick=()=>{readCond();page=1;render()};
  $('#clear').onclick=()=>{$$('.filters select,.filters input').forEach(x=>x.value='');readCond();page=1;render()};
  $('#fKeyword').addEventListener('keydown',e=>{if(e.key==='Enter')$('#search').click()});
  readCond();render();
})();
