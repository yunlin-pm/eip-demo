/* 系統權限「勾選矩陣」共用元件：系統權限群組管理（權限內容）與員工管理（系統權限）共用同一份
   功能目錄、群組權限範例資料與畫面，避免兩頁各自維護導致內容不一致。
   版面：L1 功能分類為藍色標題列，其下每個功能一列（左側只顯示名稱，不放勾選框），
   右側依功能提供可勾選的操作權限（查看編輯、可代他人申請）。
   「所有內部帳號預設具有」的權限（locked）畫面上一律打勾並鎖定、不可取消，對應 RD 的內部使用者基本群組。 */
const PERM_ACTIONS=[{key:'view',label:'查看編輯'},{key:'proxy',label:'可代他人申請'}];
// 第二個操作欄位預設是「可代他人申請」；功能若提供 member（僅可異動成員，例如簽核資格群組管理），則第二欄改放它。
const PERM_MEMBER_ACTION={key:'member',label:'僅可異動成員'};
// L1＝系統一級功能分類；funcs＝其下的功能列（label＝L2，sub＝L3，顯示時以「－」連接，例如「行政相關表單－所有表單」）。
// actions＝該功能提供的操作；locked＝所有內部帳號預設具有、不可取消的操作。
const PERM_CATALOG=[
  {id:'forms',label:'表單申請／簽核',funcs:[
    {id:'forms-admin',label:'行政相關表單',sub:'所有表單',actions:['view','proxy'],locked:['view']},
    {id:'forms-info',label:'資訊相關表單',sub:'所有表單',actions:['view','proxy'],locked:['view']},
    {id:'delegate-mine',label:'代理人設定',sub:'我的代理人',actions:['view'],locked:['view']},
    {id:'delegate-admin',label:'代理人設定',sub:'人員代理設定',actions:['view'],locked:[]}
  ]},
  {id:'remittance',label:'匯款資料維護',funcs:[
    {id:'vendor',label:'廠商匯款資料',actions:['view'],locked:[]},
    {id:'payroll',label:'員工帳戶資料',actions:['view'],locked:[]}
  ]},
  {id:'organization',label:'組織／員工',funcs:[
    {id:'organization',label:'組織管理',actions:['view'],locked:[]},
    {id:'employees',label:'員工管理',actions:['view'],locked:[]},
    {id:'permission-groups',label:'系統權限群組管理',actions:['view'],locked:[]},
    {id:'signoff-groups',label:'簽核資格群組管理',actions:['view','member'],locked:[]}
  ]},
  // 暫存區：尚未歸入正式模組的功能，僅列幾項示意；RD 若有未列在矩陣的功能，可先歸在此 L1 下，日後模組完成再移到對應 L1。
  {id:'temp',label:'非正式功能（暫存）',note:'示意用；RD 有未列到的功能可先歸在此處',funcs:[
    {id:'temp-approval-overview',label:'簽核總覽檢視',actions:['view'],locked:[]},
    {id:'temp-approval-log',label:'簽核紀錄檢視',actions:['view'],locked:[]},
    {id:'temp-fixed-assets',label:'固定資產管理',actions:['view'],locked:[]},
    {id:'temp-recurring-claims',label:'週期請款管理',actions:['view'],locked:[]},
    {id:'temp-audit-trail',label:'留痕檢視',actions:['view'],locked:[]}
  ]}
];
// 權限以「功能代碼|操作代碼」字串表示，例如 forms-admin|proxy。鎖定（所有人預設）的操作不需列在這裡。
const PERM_GROUP_GRANTS={
  '行政人員':['forms-admin|proxy'],
  '部門主管':['forms-admin|proxy','forms-info|proxy'],
  '系統管理員':['delegate-admin|view','organization|view','employees|view','permission-groups|view','signoff-groups|view','signoff-groups|member']
};
function permActionLabel(key){return ([...PERM_ACTIONS,PERM_MEMBER_ACTION].find(a=>a.key===key)||{}).label||key}
function permEscape(v){return String(v).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;')}
function permIsLocked(f,key){return (f.locked||[]).includes(key)}
/* 繪製權限矩陣。
   container：放置矩陣的元素；grants：已授予的權限字串陣列；
   options.readonly：唯讀（勾選框停用）；options.onlyGranted：唯讀預覽時只列出已有授權的功能。 */
function renderPermMatrix(container,grants,options){
  options=options||{};
  const granted=new Set(grants||[]);
  const readonly=!!options.readonly;
  const isOn=(f,a)=>permIsLocked(f,a)||granted.has(f.id+'|'+a);
  let html='';
  PERM_CATALOG.forEach(l1=>{
    const funcs=l1.funcs.filter(f=>!options.onlyGranted||f.actions.some(a=>isOn(f,a)));
    if(!funcs.length)return;
    html+=`<div class="pm-group" data-l1="${l1.id}"><div class="pm-band"><span>${permEscape(l1.label)}</span>${l1.note?`<small class="pm-bandnote">${permEscape(l1.note)}</small>`:''}</div>`;
    funcs.forEach(f=>{
      const name=`<span>${permEscape(f.sub?f.label+'－'+f.sub:f.label)}</span>`;
      html+=`<div class="pm-row" data-fn="${f.id}"><div class="pm-fn">${name}</div><div class="pm-acts">`;
      [PERM_ACTIONS[0],f.actions.includes('member')?PERM_MEMBER_ACTION:PERM_ACTIONS[1]].forEach(a=>{
        if(!f.actions.includes(a.key)){html+='<span class="pm-act pm-act-empty"></span>';return}
        const locked=permIsLocked(f,a.key);
        html+=`<label class="pm-act${locked?' pm-locked':''}"${locked?' title="所有內部帳號預設具有，不可取消"':''}><input type="checkbox" data-pm-act="${f.id}|${a.key}"${locked?' data-pm-locked':''}${isOn(f,a.key)?' checked':''}${readonly||locked?' disabled':''}> <span>${a.label}</span></label>`;
      });
      html+='</div></div>';
    });
    html+='</div>';
  });
  container.innerHTML=html||'<p class="pm-empty">尚未設定任何權限</p>';
  container.classList.add('pm');
  container.classList.toggle('pm-readonly',readonly);
}
function collectPermMatrix(container){return [...container.querySelectorAll('[data-pm-act]:checked')].filter(c=>!c.hasAttribute('data-pm-locked')).map(c=>c.dataset.pmAct)}
