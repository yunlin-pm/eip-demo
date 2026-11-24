// 表單作廢：共用視窗。用法 ClaimVoid.open({no,status,label,onConfirm(reason)})；ClaimVoid.toast(text)
// 選用參數：warn（已核准時的警語，預設為財務警語）、extraNote（附加說明）、blockMessage（自訂不可作廢原因，如已執行完成）。
// 規則：作廢原因必填（500 字內）；按「確認作廢」後再跳「再次確認作廢」（顯眼提示作廢後不可復原），按「確定作廢」才執行；已核准加財務警語；被其他單據引用者不可作廢（blockers）；確認後由呼叫端更新狀態。
// 被引用資料來自 window.DOC_REFS（見 doc-refs.js）：引用它的單據只要不是「已作廢」「已刪除」就算引用中。
(function(){
  const MAX=500;
  const el=document.createElement('div');
  el.className='cv-modal';el.hidden=true;
  el.innerHTML='<div class="cv-backdrop"></div><section class="cv-dialog" role="dialog" aria-modal="true" aria-labelledby="cvTitle"><header><h2 id="cvTitle"></h2><button class="cv-x" type="button" aria-label="關閉">×</button></header><div class="cv-body"><div class="cv-info"><span>單號</span><b id="cvNo"></b><span>目前狀態</span><b id="cvStatus"></b></div><p class="cv-note" id="cvNote"></p><div class="cv-warn" id="cvWarn" hidden></div><div class="cv-block" id="cvBlock" hidden></div><label class="cv-label" for="cvReason">作廢原因</label><textarea id="cvReason" maxlength="'+MAX+'" placeholder="請填寫作廢原因（必填）…"></textarea><div class="cv-count"><span id="cvCount">0</span> / '+MAX+' 字</div><div class="cv-error" id="cvError" hidden>請填寫作廢原因。</div></div><footer><button class="cv-btn cv-cancel" type="button">取消</button><button class="cv-btn danger cv-ok" type="button">確認作廢</button></footer></section>';
  document.body.appendChild(el);
  // 第二層：再次確認（作廢後不可復原）
  const el2=document.createElement('div');
  el2.className='cv-modal cv-modal2';el2.hidden=true;
  el2.innerHTML='<div class="cv-backdrop"></div><section class="cv-dialog cv-dialog2" role="alertdialog" aria-modal="true" aria-labelledby="cvTitle2"><header><h2 id="cvTitle2">再次確認作廢</h2><button class="cv-x" type="button" aria-label="返回">×</button></header><div class="cv-body"><div class="cv-irrev"><span class="cv-irrev-icon" aria-hidden="true">!</span><div><b>作廢後無法復原</b><p id="cvIrrevText"></p></div></div><div class="cv-info"><span>單號</span><b id="cvNo2"></b><span>作廢原因</span><b id="cvReason2" class="cv-reason-text"></b></div></div><footer><button class="cv-btn cv-back" type="button">返回</button><button class="cv-btn danger cv-final" type="button">確定作廢</button></footer></section>';
  document.body.appendChild(el2);
  const q2=s=>el2.querySelector(s);
  const q=s=>el.querySelector(s),reason=q('#cvReason'),err=q('#cvError');
  let cfg=null,last=null;
  function close2(){el2.hidden=true}
  function close(){el2.hidden=true;el.hidden=true;reason.value='';err.hidden=true;if(last&&last.focus)last.focus()}
  function open(c){
    cfg=c;last=document.activeElement;
    const label=c.label||'請款單';
    q('#cvTitle').textContent='作廢'+label;
    q('#cvNo').textContent=c.no||'—';q('#cvStatus').textContent=c.statusText||c.status||'—';
    let note='作廢後，這張'+label+'將無法復原、無法再送審，簽核流程會立即停止。如需重新申請，請使用「複製」另開新單。';
    if(c.status==='申請中'||c.status==='簽核中')note+='目前待簽核者的待辦將一併移除。';
    if(c.extraNote)note+=c.extraNote;
    q('#cvNote').textContent=note;
    const warn=q('#cvWarn');
    if(c.status==='已核准'){warn.hidden=false;warn.textContent=c.warn||'此單已核准，作廢前請先與財務確認款項尚未支付。'}else warn.hidden=true;
    // 被引用：不可作廢，提示單據類型與單號
    const blockers=c.blockers||[],blk=q('#cvBlock'),blocked=blockers.length>0||!!c.blockMessage;
    if(blocked){
      const lines=[];if(c.blockMessage)lines.push(c.blockMessage);
      if(blockers.length){
      const byType={};blockers.forEach(b=>{(byType[b.type]=byType[b.type]||[]).push(b.no)});
      const parts=Object.keys(byType).map(t=>{const nos=byType[t],shown=nos.slice(0,3).join('、');return t+' '+shown+(nos.length>3?'等共 '+nos.length+' 張':'')});
      lines.push(label+' '+(c.no||'')+' 已被 '+parts.join('、')+' 引用，無法作廢。請先作廢或刪除引用它的單據。');}
      blk.textContent=lines.join('\n');blk.style.whiteSpace='pre-line';
      blk.hidden=false;warn.hidden=true;
    }else blk.hidden=true;
    q('#cvNote').hidden=blocked;q('.cv-label').hidden=blocked;reason.hidden=blocked;q('.cv-count').hidden=blocked;
    q('.cv-ok').hidden=blocked;q('.cv-cancel').textContent=blocked?'關閉':'取消';
    reason.value='';q('#cvCount').textContent='0';err.hidden=true;
    el.hidden=false;setTimeout(()=>reason.focus(),0);
  }
  reason.addEventListener('input',()=>{q('#cvCount').textContent=String(reason.value.length);if(reason.value.trim())err.hidden=true});
  q('.cv-x').onclick=close;q('.cv-cancel').onclick=close;q('.cv-backdrop').onclick=close;
  // Esc：第二層先返回第一層（保留已填原因），再按 Esc 才關閉整個視窗
  document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!el2.hidden){close2();q('#cvReason').focus()}else if(!el.hidden)close()});
  // 第一層「確認作廢」：檢查原因後進入再次確認，尚不執行
  q('.cv-ok').onclick=function(){
    const v=reason.value.trim();
    if(!v){err.hidden=false;reason.focus();return}
    q2('#cvNo2').textContent=(cfg&&cfg.no)||'—';
    q2('#cvReason2').textContent=v;
    q2('#cvIrrevText').textContent='確定要作廢這張'+((cfg&&cfg.label)||'請款單')+'嗎？作廢後無法復原、無法再送審，簽核流程將立即停止。';
    el2.hidden=false;setTimeout(()=>q2('.cv-back').focus(),0);
  };
  q2('.cv-x').onclick=q2('.cv-back').onclick=q2('.cv-backdrop').onclick=()=>{close2();reason.focus()};
  // 第二層「確定作廢」：才真正執行
  q2('.cv-final').onclick=function(){
    const v=reason.value.trim(),fn=cfg&&cfg.onConfirm;cfg=null;close();
    if(fn)fn(v);
  };
  function toast(text){
    const t=document.createElement('div');t.className='cv-toast';t.setAttribute('role','status');t.textContent=/已作廢。$/.test(text)?text+'已通知申請人與目前待簽核者（如有）。':text;
    document.body.appendChild(t);setTimeout(()=>t.remove(),4600);
  }
  // 取得「仍在引用中」的單據（引用它的單據已作廢／已刪除者不算）
  function blockersOf(no){return ((window.DOC_REFS||{})[no]||[]).filter(r=>r.status!=='已作廢'&&r.status!=='已刪除')}
  window.ClaimVoid={open,toast,blockersOf};
})();
