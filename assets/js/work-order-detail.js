const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],params=new URLSearchParams(location.search),mode=$('#mode');
const DOC_NO='CBS-IWO-2026-00001';
const applicantUnits={T037:'總經理室／後勤支援部／人事總務課',T021:'代標代購事業本部／客服部'};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dash=v=>String(v??'').trim()||'—';
const isRead=()=>mode.value==='view'||mode.value==='approve';

/* 會簽單位選項：取組織管理範例資料（網家跨境服務），路徑去掉最上層「總經理」，以「／」串接 */
const UNITS=(typeof departments!=='undefined'?departments:[]).filter(d=>d.company==='網家跨境服務股份有限公司'&&d.path!=='—').map(d=>{
  const parts=d.path.split(' / ').filter(p=>p&&p!=='總經理');parts.push(d.name);return{value:d.id,text:parts.join('／'),manager:d.manager}});
const unitById=id=>UNITS.find(u=>u.value===id);

/* 範例資料：新增為空白；修改／查看／簽核載入範例；複製（?copy=1）帶入範例內容但不帶單號、簽核資料與附件 */
const SAMPLE={
  benefits:['解決工時','問題排除'],benefitOther:'',
  description:'<p>人事總務課每月需人工彙整各部門已核准的請款單，再整理成付款清單提供財務會計部，每月約耗費 6 小時，且常因手動複製造成金額錯誤。</p><ul><li>希望可由請款單管理直接匯出付款清單</li><li>每月 1 日自動寄送上月清單給財務會計部</li></ul>',
  items:[
    {sys:'EIP／請款單管理－匯出功能',desc:'清單頁新增「依付款日匯出 Excel」，欄位含請款單號、廠商、金額、付款日。',hours:'16',link:'https://docs.google.com/document/d/demo-claim-export',files:['匯出欄位規格.xlsx']},
    {sys:'EIP／通知信',desc:'匯出完成後寄送通知信給財務會計部，信件附下載連結。',hours:'4',link:'',files:[]},
    {sys:'排程服務',desc:'每月 1 日 08:00 自動產生上月付款清單並觸發通知信。',hours:'8',link:'',files:['排程流程說明.pdf']}
  ],
  units:[{id:'26DEP0021',status:'approved'},{id:'26DEP0031',status:'pending'}]
};
const blank=()=>({benefits:[],benefitOther:'',description:'',items:[{sys:'',desc:'',hours:'',link:'',files:[]}],units:[]});

/* ---------- 工單項目與工時 ---------- */
function fileHtml(name){const ext=(name.split('.').pop()||'').toUpperCase().slice(0,4);return`<div class="row-file"><span class="file-thumb">${esc(ext)}</span><b title="${esc(name)}">${esc(name)}</b><button class="row-file-remove" type="button" title="移除附件" aria-label="移除附件">×</button></div>`}
function itemRow(d){
  const row=document.createElement('div');row.className='wo-row';
  row.innerHTML=`<span class="row-no"></span>
<label class="wo-cell c-sys"><span class="wo-cell-label req">需要改動的系統／功能</span><input class="control" data-f="sys" placeholder="例：EIP／請款單管理" value="${esc(d.sys)}"></label>
<label class="wo-cell c-desc"><span class="wo-cell-label req">說明</span><textarea class="control" data-f="desc" rows="3" placeholder="請說明要調整的內容">${esc(d.desc)}</textarea></label>
<label class="wo-cell c-hours"><span class="wo-cell-label req">預估工時</span><span class="hours-input"><input class="control" data-f="hours" type="number" min="0.5" step="0.5" inputmode="decimal" placeholder="0" value="${esc(d.hours)}"><em>小時</em></span></label>
<div class="wo-cell c-att"><span class="wo-cell-label">文件連結／上傳附件</span><div class="row-attach"><input class="control" data-f="link" type="url" placeholder="貼上文件連結（選填）" value="${esc(d.link)}"><a class="doc-link" target="_blank" rel="noopener"></a><div class="row-files">${d.files.map(fileHtml).join('')}</div><button class="upload-btn" type="button">📎 上傳附件</button></div></div>
<button class="link-btn row-del" type="button">刪除</button>`;
  return row;
}
function renderItems(items){const box=$('#itemRows');box.innerHTML='';items.forEach(d=>box.appendChild(itemRow(d)));syncItems()}
function syncItems(){
  const read=isRead();let total=0;
  $$('#itemRows .wo-row').forEach((row,i)=>{
    row.querySelector('.row-no').textContent=i+1;
    const h=Number(row.querySelector('[data-f=hours]').value);if(h>0)total+=h;
    const link=row.querySelector('[data-f=link]'),a=row.querySelector('.doc-link'),url=link.value.trim();
    a.href=url||'#';a.textContent=url||'';a.hidden=!read||!url;link.hidden=read;
    const files=row.querySelectorAll('.row-file').length,empty=row.querySelector('.attach-empty');
    if(read&&!url&&!files){if(!empty)row.querySelector('.row-attach').insertAdjacentHTML('beforeend','<span class="attach-empty">—</span>')}else if(empty)empty.remove();
  });
  $('#hoursTotal').textContent=Math.round(total*10)/10;
}
$('#addItem').onclick=()=>{$('#itemRows').appendChild(itemRow({sys:'',desc:'',hours:'',link:'',files:[]}));syncItems();$('#itemRows .wo-row:last-child [data-f=sys]').focus()};
$('#itemRows').addEventListener('input',syncItems);
$('#itemRows').addEventListener('click',e=>{
  const t=e.target,row=t.closest('.wo-row');if(!row)return;
  if(t.classList.contains('row-del')){if($$('#itemRows .wo-row').length<=1){alert('至少需保留一列工單項目。');return}row.remove();syncItems();return}
  if(t.classList.contains('row-file-remove')){t.closest('.row-file').remove();syncItems();return}
  if(t.classList.contains('upload-btn')){if($$('#itemRows .row-file').length>=20){alert('每張單最多 20 個檔案。');return}row.querySelector('.row-files').insertAdjacentHTML('beforeend',fileHtml('需求說明文件.pdf'));syncItems()}
});

/* ---------- 需求效益 ---------- */
function syncBenefit(){const on=$('#benefitOtherChk').checked;$('#benefitOther').hidden=!on;$('#benefitOther').disabled=!on||isRead();if(!on)$('#benefitOther').value=''}
$('#benefitOtherChk').onchange=syncBenefit;

/* ---------- 說明編輯器（比照簽呈單） ---------- */
document.addEventListener('click',e=>{const c=e.target.closest('[data-command]');if(!c)return;let v=null;if(c.dataset.command==='createLink'){v=prompt('請輸入連結網址');if(!v)return}document.execCommand(c.dataset.command,false,v);$('#description').focus()});
$('#editorSize').onchange=e=>{document.execCommand('fontSize',false,e.target.value);$('#description').focus()};
$('#editorColor').oninput=e=>{document.execCommand('foreColor',false,e.target.value);$('#description').focus()};

/* ---------- 會簽單位：沿用簽呈單的單位選擇元件（末層粗體＋上層路徑灰字、可搜尋） ---------- */
function splitUnit(text){const p=(text||'').split('／');return{leaf:p[p.length-1]||'',parent:p.slice(0,-1).join('／')}}
function unitHtml(text){if(!text)return'<span class="unit-leaf unit-placeholder">請選擇部門單位</span>';const u=splitUnit(text);return`<span class="unit-leaf">${esc(u.leaf)}</span>${u.parent?`<span class="unit-parent">${esc(u.parent)}</span>`:''}`}
function refreshUnit(select){const tr=select.nextElementSibling;if(!tr||!tr.classList.contains('unit-trigger'))return;const o=select.selectedOptions[0],t=select.value&&o?o.text:'';tr.querySelector('.unit-text').innerHTML=unitHtml(t);tr.title=t}
function enhanceUnit(select){if(select.dataset.enhanced)return;select.dataset.enhanced='1';select.classList.add('unit-native');select.tabIndex=-1;const b=document.createElement('button');b.type='button';b.className='unit-trigger';b.setAttribute('aria-haspopup','listbox');b.innerHTML='<span class="unit-text"></span><span class="unit-caret" aria-hidden="true"></span>';select.after(b);refreshUnit(select);b.onclick=()=>openUnitPop(select,b)}
let unitPop=null,unitCtx=null;
function closeUnitPop(){if(!unitPop)return;unitPop.remove();unitPop=null;if(unitCtx)unitCtx.trigger.setAttribute('aria-expanded','false');unitCtx=null}
function openUnitPop(select,trigger){
  if(document.body.classList.contains('readonly'))return;
  const reopen=unitCtx&&unitCtx.trigger===trigger;closeUnitPop();if(reopen)return;
  const options=[...select.options].filter(o=>o.value);
  unitPop=document.createElement('div');unitPop.className='unit-pop';unitPop.setAttribute('role','dialog');
  unitPop.innerHTML='<div class="unit-pop-head"><input type="search" class="unit-search" placeholder="搜尋部門單位" aria-label="搜尋部門單位"><button type="button" class="unit-pop-close" aria-label="關閉">×</button></div><ul class="unit-list" role="listbox"></ul><div class="unit-empty" hidden>找不到符合的部門單位</div>';
  const list=unitPop.querySelector('.unit-list'),search=unitPop.querySelector('.unit-search'),empty=unitPop.querySelector('.unit-empty');
  const render=q=>{const kw=q.trim().toLowerCase(),shown=options.filter(o=>!kw||o.text.toLowerCase().includes(kw));list.innerHTML=shown.map(o=>`<li role="option" tabindex="-1" data-value="${esc(o.value)}" class="${o.value===select.value?'is-selected':''}" aria-selected="${o.value===select.value}">${unitHtml(o.text)}</li>`).join('');empty.hidden=shown.length>0};
  render('');document.body.appendChild(unitPop);trigger.setAttribute('aria-expanded','true');unitCtx={select,trigger};
  const place=()=>{if(!unitPop)return;if(matchMedia('(max-width:700px)').matches){unitPop.classList.add('is-sheet');unitPop.style.cssText='';return}unitPop.classList.remove('is-sheet');const r=trigger.getBoundingClientRect(),w=Math.max(r.width,340),left=Math.min(Math.max(8,r.left),innerWidth-w-8);unitPop.style.width=w+'px';unitPop.style.left=left+'px';const h=unitPop.offsetHeight,below=innerHeight-r.bottom-8;unitPop.style.top=(below>=Math.min(h,260)||r.top<h?r.bottom+4:Math.max(8,r.top-h-4))+'px'};
  place();unitCtx.place=place;
  const pick=li=>{select.value=li.dataset.value;refreshUnit(select);select.dispatchEvent(new Event('change',{bubbles:true}));closeUnitPop();trigger.focus()};
  list.onclick=e=>{const li=e.target.closest('li');if(li)pick(li)};search.oninput=()=>render(search.value);
  unitPop.querySelector('.unit-pop-close').onclick=()=>{closeUnitPop();trigger.focus()};
  unitPop.onkeydown=e=>{const items=[...list.querySelectorAll('li')],i=items.indexOf(document.activeElement);
    if(e.key==='ArrowDown'){e.preventDefault();(items[i+1]||items[0])?.focus()}else if(e.key==='ArrowUp'){e.preventDefault();(i<=0?search:items[i-1]).focus()}
    else if(e.key==='Enter'&&document.activeElement.tagName==='LI'){e.preventDefault();pick(document.activeElement)}else if(e.key==='Enter'&&document.activeElement===search){e.preventDefault();items[0]&&pick(items[0])}
    else if(e.key==='Escape'){e.stopPropagation();closeUnitPop();trigger.focus()}};
  search.focus({preventScroll:true});
}
document.addEventListener('mousedown',e=>{if(unitPop&&!unitPop.contains(e.target)&&!e.target.closest('.unit-trigger'))closeUnitPop()});
addEventListener('resize',()=>unitCtx&&unitCtx.place&&unitCtx.place());
addEventListener('scroll',e=>{if(unitPop&&!unitPop.contains(e.target)&&!unitPop.classList.contains('is-sheet'))closeUnitPop()},true);
const STATUS={approved:['approved','已簽核'],pending:['pending','待簽核'],draft:['pending','尚未送出']};
function addUnit(id,status){
  const tr=document.createElement('tr'),st=STATUS[status||'draft'];tr.className=status==='approved'?'unit-approved':status==='pending'?'unit-pending':'';
  tr.innerHTML=`<td><select class="control department-select"><option value="">請選擇部門單位</option>${UNITS.map(u=>`<option value="${u.value}">${esc(u.text)}</option>`).join('')}</select></td><td class="manager-cell">請選擇部門後帶入</td><td class="approval-only"><span class="stage-status ${st[0]}">${st[1]}</span></td><td><button class="link-btn" type="button">刪除</button></td>`;
  const s=tr.querySelector('select');s.value=id||'';tr.querySelector('.manager-cell').textContent=unitById(s.value)?.manager||'請選擇部門後帶入';
  s.onchange=()=>tr.querySelector('.manager-cell').textContent=unitById(s.value)?.manager||'請選擇部門後帶入';
  tr.querySelector('.link-btn').onclick=()=>tr.remove();
  $('#countersignRows').appendChild(tr);enhanceUnit(s);
}
$('#addUnit').onclick=()=>addUnit('');

/* ---------- 畫面情境 ---------- */
function setForm(d,keepStatus){
  $$('input[name=benefit]').forEach(x=>x.checked=d.benefits.includes(x.value));$('#benefitOther').value=d.benefitOther;
  $('#description').innerHTML=d.description;
  renderItems(d.items.map(x=>({...x,files:keepStatus?x.files:[]})));
  $('#countersignRows').innerHTML='';d.units.forEach(u=>addUnit(u.id,keepStatus?u.status:''));
}
function applyMode(){
  const m=mode.value,read=isRead(),copy=m==='new'&&params.has('copy'),no=params.get('no')||DOC_NO;
  const box={new:'newActions',edit:'editActions',view:'viewActions',approve:'approveActions'}[m];
  $$('#newActions,#editActions,#approveActions,#viewActions').forEach(x=>x.hidden=x.id!==box);
  $('#routePanel').hidden=m==='new';$('#returnAlert').hidden=m!=='edit';$('#opinionSummary').hidden=!read;
  $('#roundBadge').textContent=m==='edit'?'目前送審輪次：2':'目前送審輪次：1';
  if(m!=='new'){$('#routeBody').classList.add('route-collapsed');$('#routeToggle').textContent='查看'}
  document.body.classList.toggle('readonly',read);document.body.classList.toggle('show-approval-details',read);
  $('#pageTitle').textContent=m==='new'?'新增工程派工單（尚未產生單號）':`${{edit:'修改',view:'查看',approve:'簽核'}[m]}工程派工單（${no}）`;
  $('#applyDate').textContent=m==='new'?'申請日期：送出簽核後由系統回寫':'申請日期：2026/11/10';
  setForm(m==='new'&&!copy?blank():SAMPLE,m!=='new');
  $$('.panel input,.panel select,.panel textarea').forEach(el=>el.disabled=read);
  $('#description').contentEditable=String(!read);$('.editor-toolbar').hidden=read;
  syncBenefit();syncItems();$('#applicantUnit').textContent=applicantUnits[$('#applicant').value]||'未設定所屬部門';
}
const start=params.get('mode')||'new';mode.value=start;if(mode.value!==start)mode.value='new';
mode.onchange=()=>{params.delete('copy');history.replaceState(null,'',`?mode=${mode.value}`);applyMode()};
$('#applicant').onchange=e=>{$('#applicantUnit').textContent=applicantUnits[e.target.value]||'未設定所屬部門'};
$('#routeToggle').onclick=()=>{const closed=$('#routeBody').classList.toggle('route-collapsed');$('#routeToggle').textContent=closed?'查看':'收合'};
$('#historyLink').onclick=()=>$('#historyModal').hidden=false;$$('[data-close-history]').forEach(x=>x.onclick=()=>$('#historyModal').hidden=true);

/* ---------- 送出簽核檢核 ---------- */
function validate(){
  if(!$$('input[name=benefit]:checked').length)return'請至少勾選一項需求效益。';
  if($('#benefitOtherChk').checked&&!$('#benefitOther').value.trim())return'請填寫「其他」需求效益說明。';
  if(!$('#description').textContent.trim())return'請填寫工單內容說明。';
  const rows=$$('#itemRows .wo-row');
  for(const [i,row] of rows.entries()){const n=i+1,v=f=>row.querySelector(`[data-f=${f}]`).value.trim();
    if(!v('sys'))return`請填寫第 ${n} 列「需要改動的系統／功能」。`;
    if(!v('desc'))return`請填寫第 ${n} 列「說明」。`;
    const h=Number(v('hours'));if(!(h>0))return`請填寫第 ${n} 列「預估工時」（需大於 0）。`;
    if(Math.round(h*10)!==h*10)return`第 ${n} 列「預估工時」最多填到小數點後 1 位。`;
    const url=v('link');if(url&&!/^https?:\/\//i.test(url))return`第 ${n} 列「文件連結」請以 http:// 或 https:// 開頭。`;}
  if($$('#countersignRows .department-select').some(s=>!s.value))return'請選擇會簽單位，或刪除空白列。';
  const ids=$$('#countersignRows .department-select').map(s=>s.value);if(new Set(ids).size!==ids.length)return'會簽單位不可重複。';
  return'';
}
$$('[data-submit]').forEach(b=>b.onclick=()=>{const err=validate();if(err){alert(err);return}
  const d=new Date(),p=n=>String(n).padStart(2,'0');$('#pageTitle').textContent='工程派工單（CBS-IWO-2026-00002）';$('#applyDate').textContent=`申請日期：${d.getFullYear()}/${p(d.getMonth()+1)}/${p(d.getDate())}`;
  alert('已送出簽核，系統已回寫申請日期與申請單號。')});
$$('[data-draft]').forEach(b=>b.onclick=()=>alert('已儲存草稿。'));

/* ---------- 核准／退回 ---------- */
function openDecision(type){const ok=type==='approve';$('#decisionModal').dataset.type=type;$('#decisionTitle').textContent=ok?'核准本關':'退回（重新簽核）';$('#decisionLabel').classList.toggle('req',!ok);$('#decisionLabel').textContent=ok?'簽核意見':'退回原因';$('#decisionOpinion').placeholder=ok?'可填寫簽核意見（選填），留空可直接核准':'請輸入退回原因（必填）';$('#decisionOpinion').value='';$('#decisionConfirm').textContent=ok?'確認核准':'確認退回';$('#decisionConfirm').className='btn '+(ok?'success':'danger-filled');$('#decisionModal').hidden=false;requestAnimationFrame(()=>$('#decisionOpinion').focus())}
$('#approveBtn').onclick=()=>openDecision('approve');$('#rejectBtn').onclick=()=>openDecision('reject');
$$('[data-close-modal]').forEach(x=>x.onclick=()=>$('#decisionModal').hidden=true);
$('#decisionConfirm').onclick=()=>{const t=$('#decisionModal').dataset.type;if(t==='reject'&&!$('#decisionOpinion').value.trim()){alert('請輸入退回原因');return}$('#decisionModal').hidden=true;alert(t==='reject'?'已退回申請':'本關已核准')};
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;$('#decisionModal').hidden=true;$('#historyModal').hidden=true});

/* ---------- 列印版：依目前畫面資料產生 ---------- */
function buildPrint(){
  const m=mode.value,mm=$('#pageTitle').textContent.match(/（(CBS-[^）]+)）/);
  $('#pCompany').textContent=$('#company').value;$('#pDocNo').textContent=mm?mm[1]:'尚未產生單號';
  $('#pApplicant').textContent=$('#applicant').selectedOptions[0].textContent;$('#pUnit').textContent=dash($('#applicantUnit').textContent);
  $('#pDate').textContent=/回寫/.test($('#applyDate').textContent)?'—':$('#applyDate').textContent.replace('申請日期：','');
  $('#pBenefit').textContent=dash($$('input[name=benefit]:checked').map(x=>x.value==='其他'?'其他：'+dash($('#benefitOther').value):x.value).join('、'));
  $('#pDesc').innerHTML=$('#description').innerHTML||'—';
  const units=$$('#countersignRows tr').map(tr=>{const s=tr.querySelector('.department-select');return`${esc(s.value?s.selectedOptions[0].text:'—')}（${esc(tr.querySelector('.manager-cell').textContent)}）`});
  $('#pUnits').innerHTML=units.join('<br>')||'無';
  let total=0;
  $('#pItems').innerHTML=$$('#itemRows .wo-row').map((row,i)=>{const v=f=>row.querySelector(`[data-f=${f}]`).value.trim(),h=Number(v('hours'))||0;total+=h;
    const att=[v('link'),...[...row.querySelectorAll('.row-file b')].map(b=>b.textContent)].filter(Boolean);
    return`<tr><td>${i+1}</td><td>${esc(dash(v('sys')))}</td><td>${esc(dash(v('desc'))).replace(/\n/g,'<br>')}</td><td>${h?h+' 小時':'—'}</td><td>${att.map(esc).join('<br>')||'—'}</td></tr>`}).join('')+`<tr><th colspan="3">合計預估工時</th><th colspan="2">${Math.round(total*10)/10} 小時</th></tr>`;
  const ops={'部級主管':'同意派工，請技術系統開發部評估排程。'};
  $('#pApproval').innerHTML=m==='new'?'<tr><td colspan="5">尚未送出簽核</td></tr>':$$('.approval-stage').map(st=>{const lv=st.querySelector('.stage-title').textContent.replace(/^[①-⑩]\s*/,''),t=st.querySelector('time').textContent.trim();return`<tr><td>${esc(lv)}</td><td>${esc(st.querySelector('.stage-person').textContent.trim())}</td><td>${esc(st.querySelector('.stage-status').textContent.trim())}</td><td>${esc(t==='—'?'—':t.slice(0,10))}</td><td>${esc(ops[lv]||'—')}</td></tr>`}).join('');
}
addEventListener('beforeprint',buildPrint);
applyMode();
