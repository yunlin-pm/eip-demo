(function(){
  const modules={
    overview:{label:'總覽',href:'pages/overview.html'},
    forms:{label:'表單申請／簽核',href:'pages/approvals/list.html',sections:[
      {id:'admin',label:'行政相關表單',items:[{id:'claims',label:'請款單管理',href:'pages/approvals/list.html'},{id:'purchases',label:'採購請購單管理',href:'pages/purchases/list.html'},{id:'memos',label:'簽呈單管理',href:'pages/memos/list.html'}]},
      {id:'info',label:'資訊相關表單',items:[{id:'cloud',label:'雲端服務與資源申請管理',href:'pages/cloud-resources/list.html'},{id:'cloud-permission',label:'雲端權限申請管理',href:'pages/cloud-permissions/list.html'}]},
      {id:'delegate',label:'代理人設定',items:[{id:'delegate-settings',label:'人員代理設定',href:'pages/delegates/settings.html'},{id:'my-delegate',label:'我的代理人',href:'pages/delegates/my-delegate.html'}]}
    ]},
    remittance:{label:'匯款資料維護',href:'pages/remittance/vendor-list.html',sections:[
      {id:'vendor',label:'廠商匯款資料',href:'pages/remittance/vendor-list.html'},
      {id:'payroll',label:'員工薪資帳戶資料',href:'pages/remittance/payroll-list.html'}
    ]},
    organization:{label:'組織／員工',href:'pages/organization/list.html',sections:[
      {id:'organization',label:'組織管理',href:'pages/organization/list.html'}
    ]}
  };
  const root=(document.body.dataset.eipRoot||'').replace(/\\/g,'/');
  const href=path=>root+path;
  const moduleId=document.body.dataset.eipModule||'overview';
  const activeL2=document.body.dataset.eipL2||'';
  const activeL3=document.body.dataset.eipL3||'';
  const allowed=(document.body.dataset.eipSections||'').split(',').map(x=>x.trim()).filter(Boolean);
  const user=document.body.dataset.eipUser||'陳庭瑋 (T037)';
  const current=modules[moduleId]||modules.overview;
  const grid='<span class="eip-app-grid-icon" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>';
  const l1=Object.entries(modules).map(([id,m])=>'<a class="'+(id===moduleId?'current':'')+'" href="'+href(m.href)+'">'+m.label+'</a>').join('');
  const sections=(current.sections||[]).filter(s=>!allowed.length||allowed.includes(s.id)).map(s=>{
    if(!s.items||!s.items.length){return '<a class="eip-app-nav-link" '+(s.id===activeL2?'aria-current="page" ':'')+'href="'+href(s.href)+'">'+s.label+'</a>';}
    const items=s.items.map(i=>'<a class="'+(i.id===activeL3?'current':'')+'" href="'+href(i.href)+'">'+i.label+'</a>').join('');
    return '<div class="eip-app-nav-item"><button class="eip-app-nav-trigger" type="button">'+s.label+' <span class="eip-app-caret">▼</span></button><div class="eip-app-dropdown">'+items+'</div></div>';
  }).join('');
  const header=document.getElementById('eipAppHeader');
  if(header){header.className='eip-app-header';header.innerHTML='<div class="eip-app-topbar"><div class="eip-app-menu"><button class="eip-app-grid" type="button" aria-label="L1 系統選單">'+grid+'</button><div class="eip-app-dropdown">'+l1+'</div></div><div class="eip-app-module">'+current.label+'</div><nav class="eip-app-sections" aria-label="功能選單">'+sections+'</nav><div class="eip-app-profile"><button class="eip-app-profile-trigger" type="button">Hi '+user+' <span class="eip-app-caret">▼</span></button><div class="eip-app-dropdown align-right"><a href="'+href('pages/settings/profile.html')+'">個人資料</a><a href="'+href('pages/login.html')+'">登出</a></div></div></div><div class="eip-app-brandbar"><img class="eip-app-brand-logo" src="'+href('assets/img/bibian-logo.svg')+'" alt="Bibian"><strong class="eip-app-brand-name">Bibian EIP 比比昂企業資訊入口平台</strong></div>'}
  const footer=document.getElementById('eipAppFooter');
  if(footer){footer.className='eip-app-footer';footer.textContent='Copyright © PChome Bibian Inc. All Rights Reserved.'}
  document.addEventListener('click',e=>{const trigger=e.target.closest('.eip-app-grid,.eip-app-nav-trigger,.eip-app-profile-trigger');document.querySelectorAll('.eip-app-menu.open,.eip-app-nav-item.open,.eip-app-profile.open').forEach(x=>{if(!trigger||x!==trigger.parentElement)x.classList.remove('open')});if(trigger){trigger.parentElement.classList.toggle('open');e.stopPropagation();}});
})();
