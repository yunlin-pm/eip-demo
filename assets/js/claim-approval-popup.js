(function(){
  const modal=document.createElement('div');
  modal.className='approval-action-modal view-only';
  modal.innerHTML='<div class="approval-action-backdrop"></div><section class="approval-action-dialog" role="dialog" aria-modal="true" aria-labelledby="approvalActionTitle"><header><h2 id="approvalActionTitle"></h2><button class="approval-action-close" type="button" aria-label="關閉">×</button></header><div class="approval-action-body"><textarea id="approvalActionComment" rows="4"></textarea><div class="approval-action-error" id="approvalActionError" hidden>請填寫退回原因</div></div><footer><button class="btn approval-action-confirm" type="button"></button><button class="btn approval-action-cancel" type="button">取消</button></footer></section>';
  document.body.appendChild(modal);

  const title=modal.querySelector('#approvalActionTitle');
  const comment=modal.querySelector('#approvalActionComment');
  const error=modal.querySelector('#approvalActionError');
  const confirmButton=modal.querySelector('.approval-action-confirm');
  const settings={
    approve:{title:'核准並批示',placeholder:'可填寫批示意見（選填）；留空則直接核准…',confirm:'確認核准',required:false,tone:'approve'},
    reject:{title:'退回原因',placeholder:'請填寫退回原因（必填）…',confirm:'確認退回',required:true,tone:'reject'},
    current:{title:'退回補正（僅本關重審）',placeholder:'請填寫退回原因（必填）…',confirm:'確認退回',required:true,tone:'reject'}
  };
  let actionType='approve';

  function open(type){
    const setting=settings[type];
    actionType=type;
    title.textContent=setting.title;
    comment.value='';
    comment.placeholder=setting.placeholder;
    error.hidden=true;
    confirmButton.textContent=setting.confirm;
    confirmButton.className='btn approval-action-confirm '+setting.tone;
    modal.classList.remove('view-only');
    setTimeout(()=>comment.focus(),0);
  }
  function close(){modal.classList.add('view-only');comment.value='';error.hidden=true}

  document.addEventListener('click',function(event){
    const button=event.target.closest('button');
    if(!button)return;
    if(modal.contains(button))return;
    if(button.classList.contains('approve')){event.preventDefault();open('approve')}
    else if(button.classList.contains('reject')){event.preventDefault();open('reject')}
    else if(button.classList.contains('return-current')){event.preventDefault();open('current')}
  });
  modal.querySelector('.approval-action-close').addEventListener('click',close);
  modal.querySelector('.approval-action-cancel').addEventListener('click',close);
  modal.querySelector('.approval-action-backdrop').addEventListener('click',close);
  confirmButton.addEventListener('click',function(){
    const setting=settings[actionType];
    const value=comment.value.trim();
    if(setting.required&&!value){error.hidden=false;comment.focus();return}
    error.hidden=true;
    const message=actionType==='approve'?'本關已核准。':actionType==='current'?'已退回申請人補正；重新送出後回到財務關卡重審。':'已退回申請人修改；重新送出後從第一關重新簽核。';
    close();
    alert(message);
  });
})();
