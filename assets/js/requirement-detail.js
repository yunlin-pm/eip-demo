/* 系統需求申請單 內容頁（Demo）
   情境：new 新增／edit 修改（已退回）／view 查看／approve 一般關卡簽核／approve-pm 產品課課長簽核；沒有執行管理、沒有討論窗口（PM）
   簽核路線：申請人 → 申請人課長 → 申請人部長 → 會簽單位 → 產品課課長 → 產品規劃部長 → 技術副部長 → 技術部長 → 副總經理 → 總經理 */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],params=new URLSearchParams(location.search),mode=$('#mode');
const DOC_NO='CBS-ISR-2026-00001';
const applicantUnits={T037:'總經理室／後勤支援部／人事總務課',T021:'代標代購事業本部／客服部'};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dash=v=>String(v??'').trim()||'—';
const isRead=()=>!['new','edit'].includes(mode.value);
const UNITS=(typeof departments!=='undefined'?departments:[]).filter(d=>d.company==='網家跨境服務股份有限公司'&&d.path!=='—').map(d=>{
  const parts=d.path.split(' / ').filter(p=>p&&p!=='總經理');parts.push(d.name);return{value:d.id,text:parts.join('／'),manager:d.manager}});
const unitById=id=>UNITS.find(u=>u.value===id);
const unitByName=n=>UNITS.find(u=>u.text.endsWith('／'+n)||u.text===n);
const SAMPLE={expect:'2026-12-15',title:'行銷活動抽獎功能',type:'新功能開發',typeOther:'',systems:['185','EIP'],systemOther:'',
  background:'雙 11、週年慶等活動目前以人工抽獎，需匯出訂單後在 Excel 篩選，耗時且容易出錯。\n希望系統可依活動條件自動抽出得獎者並保留紀錄。',
  benefits:['節省作業工時','降低作業風險'],benefitOther:'',effort:'estimate',effortHours:'40',
  detail:'<p>需求內容：</p><ul><li>活動後台可設定抽獎條件（活動期間、消費門檻、名額）</li><li>系統依條件自動抽出得獎名單，可匯出 Excel</li><li>抽獎結果保留紀錄，供客服查詢</li></ul>',
  files:['抽獎活動流程說明.pdf'],
  countersign:[{name:'代購部',status:'approved'}],notify:[{name:'代購部／訂單服務課'},{name:'代購部／活動企劃課'}]};
const blank=()=>({expect:'',title:'',type:'',typeOther:'',systems:[],systemOther:'',background:'',benefits:[],benefitOther:'',effort:'',effortHours:'',detail:'',files:[],countersign:[],notify:[]});
/* 路線：依情境決定目前停在哪一關 */
const STAGES=[['申請人課長','林家筠 (T038)'],['申請人部長','羅弘奕 (B019)'],['會簽單位','依設定逐一簽核'],['產品課課長','陳志豪 (B188)'],['產品規劃部長','黃少佑 (B206)'],['技術副部長','王俊凱 (B204)'],['技術部長','陳贊元 (B201)'],['副總經理','尤耀慶 (M003)'],['總經理','曾啟浩 (M001)']];
function stageDone(){const m=mode.value;if(m==='viewOwn'||m==='voided'){const s=m==='voided'?voidFrom():(params.get('st')||'簽核中');return /已核准/.test(s)?9:s==='申請中'?0:2}return{approve:2,'approve-pm':3,view:9,edit:0,new:0}[m]}
const voidFrom=()=>(window.__voidInfo&&window.__voidInfo.from)||params.get('from')||'簽核中';

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
function addUnit(box,id,status){
  const counter=box==='countersignRows',tr=document.createElement('tr'),st=STATUS[status||'draft'];
  tr.innerHTML=`<td><select class="control department-select"><option value="">請選擇部門單位</option>${UNITS.map(u=>`<option value="${u.value}">${esc(u.text)}</option>`).join('')}</select></td><td class="manager-cell">請選擇部門後帶入</td>${counter?`<td class="approval-only"><span class="stage-status ${st[0]}">${st[1]}</span></td>`:''}<td><button class="link-btn" type="button">刪除</button></td>`;
  const s=tr.querySelector('select');s.value=id||'';const sync=()=>tr.querySelector('.manager-cell').textContent=unitById(s.value)?.manager||'請選擇部門後帶入';sync();s.onchange=sync;
  tr.querySelector('.link-btn').onclick=()=>tr.remove();
  $('#'+box).appendChild(tr);enhanceUnit(s);
}
$$('[data-add]').forEach(b=>b.onclick=()=>addUnit(b.dataset.add,''));

/* 其他選項 */
function syncOther(){
  const t=$('input[name=type]:checked')?.value==='其他';$('#typeOther').hidden=!t;if(!t)$('#typeOther').value='';
  const so=$('input[name=system][value=其他]').checked;$('#systemOther').hidden=!so;if(!so)$('#systemOther').value='';
  const bo=$('input[name=benefit][value=其他]').checked;$('#benefitOther').hidden=!bo;if(!bo)$('#benefitOther').value='';
}
$$('input[name=type],input[name=system],input[name=benefit]').forEach(x=>x.addEventListener('change',syncOther));
/* 預期工時：選「預估工時」才可輸入小時；選「無法預估」清空 */
function syncEffort(){const e=$('input[name=effort]:checked'),on=!!e&&e.value==='estimate';$('#effortHours').disabled=!on||document.body.classList.contains('readonly');if(!on)$('#effortHours').value=''}
$$('input[name=effort]').forEach(x=>x.addEventListener('change',syncEffort));

/* 編輯器 */
document.addEventListener('click',e=>{const c=e.target.closest('[data-command]');if(!c)return;let v=null;if(c.dataset.command==='createLink'){v=prompt('請輸入連結網址');if(!v)return}document.execCommand(c.dataset.command,false,v);$('#detailText').focus()});
$('#editorSize').onchange=e=>{document.execCommand('fontSize',false,e.target.value);$('#detailText').focus()};
$('#editorColor').oninput=e=>{document.execCommand('foreColor',false,e.target.value);$('#detailText').focus()};

/* 附件 */
const ext=n=>(n.split('.').pop()||'').toUpperCase().slice(0,4);
function fileCard(n){return`<div class="file-card"><button class="file-preview" type="button"><span class="file-thumb">${esc(ext(n))}</span><span class="file-meta"><b class="file-name">${esc(n)}</b><small class="file-status">✓ 已上傳</small></span></button><button class="file-action file-remove" type="button" title="移除附件">×</button></div>`}
$('#files').addEventListener('click',e=>{if(e.target.closest('.file-remove')){e.target.closest('.file-card').remove();return}if(e.target.closest('#uploadBtn')){if($$('#files .file-card').length>=20){alert('最多 20 個檔案。');return}$('#uploadBtn').insertAdjacentHTML('beforebegin',fileCard('需求說明.pdf'))}});

/* 路線 */
function renderRoute(){
  const done=stageDone();
  $('#routeBody').innerHTML=STAGES.map((s,i)=>{const st=i<done?'approved':i===done?'pending':'waiting',label={approved:'已核准',pending:'待簽核',waiting:'未開始'}[st];return`<div class="approval-stage ${st==='waiting'?'':st}"><div class="stage-title">${'①②③④⑤⑥⑦⑧⑨'[i]} ${s[0]}</div><span class="stage-status ${st==='waiting'?'':st}">${label}</span><div class="stage-person">${s[1]}</div><time>${i<done?'2026/11/0'+(3+Math.min(i,5))+' 10:00':'—'}</time></div>`}).join('');
}

/* 畫面情境 */
function setForm(d,keepStatus){
  $('#expectDate').value=d.expect;$('#title').value=d.title;
  $$('input[name=type]').forEach(x=>x.checked=x.value===d.type);$('#typeOther').value=d.typeOther;
  $$('input[name=system]').forEach(x=>x.checked=d.systems.includes(x.value));$('#systemOther').value=d.systemOther;
  $('#background').value=d.background;$$('input[name=benefit]').forEach(x=>x.checked=d.benefits.includes(x.value));$('#benefitOther').value=d.benefitOther;$$('input[name=effort]').forEach(x=>x.checked=x.value===d.effort);$('#effortHours').value=d.effortHours;syncEffort();
  $('#detailText').innerHTML=d.detail;
  $$('#files .file-card').forEach(x=>x.remove());(keepStatus?d.files:[]).forEach(n=>$('#uploadBtn').insertAdjacentHTML('beforebegin',fileCard(n)));
  $('#countersignRows').innerHTML='';d.countersign.forEach(u=>addUnit('countersignRows',unitByName(u.name)?.value,keepStatus?u.status:''));
  $('#notifyRows').innerHTML='';d.notify.forEach(u=>addUnit('notifyRows',unitByName(u.name)?.value));
}
function applyMode(){
  const m=mode.value,read=isRead(),copy=m==='new'&&params.has('copy'),no=params.get('no')||DOC_NO;
  const box={new:'newActions',edit:'editActions',view:'viewActions',viewOwn:'viewActions',voided:'viewActions',approve:'approveActions','approve-pm':'approveActions'}[m];
  $$('#newActions,#editActions,#approveActions,#viewActions').forEach(x=>x.hidden=x.id!==box);
  $('#routePanel').hidden=m==='new';$('#returnAlert').hidden=m!=='edit';$('#opinionSummary').hidden=!read;
  $('#roundBadge').textContent=m==='edit'?'目前送審輪次：2':'目前送審輪次：1';
  document.body.classList.toggle('readonly',read);document.body.classList.toggle('show-approval-details',read);
  $('#pageTitle').textContent=m==='new'?'系統需求申請單（尚未產生單號）':`系統需求申請單（${no}）`;
  $('#crumbLast').textContent=m==='new'?'新增系統需求單':'系統需求單內容';
  $('#applyDate').textContent=m==='new'?'申請日期：送出簽核後由系統回寫':'申請日期：2026/11/03';
  const d=m==='new'&&!copy?blank():{...SAMPLE};
  setForm(d,m!=='new');
  $$('.panel input,.panel select,.panel textarea').forEach(el=>el.disabled=read);syncEffort();
  $('#detailText').contentEditable=String(!read);$('.editor-toolbar').hidden=read;
  renderRoute();syncOther();$('#applicantUnit').textContent=applicantUnits[$('#applicant').value]||'未設定所屬部門';
}
const start=params.get('mode')||'new';mode.value=start;if(mode.value!==start)mode.value='new';
mode.onchange=()=>{params.delete('copy');history.replaceState(null,'',`?mode=${mode.value}`);applyMode()};
$('#applicant').onchange=e=>$('#applicantUnit').textContent=applicantUnits[e.target.value]||'未設定所屬部門';
$('#routeToggle').onclick=()=>{const c=$('#routeBody').classList.toggle('route-collapsed');$('#routeToggle').textContent=c?'查看':'收合'};
$('#historyLink').onclick=()=>$('#historyModal').hidden=false;$$('[data-close-history]').forEach(x=>x.onclick=()=>$('#historyModal').hidden=true);

/* 送出檢核 */
function validate(){
  if(!$('#title').value.trim())return'請填寫需求標題。';
  const t=$('input[name=type]:checked');if(!t)return'請選擇需求類型。';if(t.value==='其他'&&!$('#typeOther').value.trim())return'請填寫需求類型「其他」說明。';
  if(!$$('input[name=system]:checked').length)return'請至少勾選一個影響系統／網站。';if($('input[name=system][value=其他]').checked&&!$('#systemOther').value.trim())return'請填寫影響系統／網站「其他」說明。';
  if(!$('#background').value.trim())return'請填寫需求背景與目的。';
  if(!$$('input[name=benefit]:checked').length)return'請至少勾選一項預期效益。';if($('input[name=benefit][value=其他]').checked&&!$('#benefitOther').value.trim())return'請填寫預期效益「其他」說明。';
  const ef=$('input[name=effort]:checked');if(!ef)return'請選擇預期工時（預估工時或無法預估）。';if(ef.value==='estimate'){const hv=Number($('#effortHours').value);if(!$('#effortHours').value.trim()||!(hv>0))return'請填寫預估工時（小時），需大於 0。'}
  if(!$('#detailText').textContent.trim())return'請填寫需求詳述。';
  for(const id of ['countersignRows','notifyRows']){const v=$$(`#${id} .department-select`).map(s=>s.value);if(v.some(x=>!x))return`請選擇${id==='countersignRows'?'會簽':'知會'}單位，或刪除空白列。`;if(new Set(v).size!==v.length)return`${id==='countersignRows'?'會簽':'知會'}單位不可重複。`}
  return'';
}
$$('[data-submit]').forEach(b=>b.onclick=()=>{const e=validate();if(e){alert(e);return}alert('已送出簽核，系統已回寫申請日期與申請單號。')});
$$('[data-draft]').forEach(b=>b.onclick=()=>alert('已儲存草稿。'));

/* 核准／退回 */
function openDecision(type){const ok=type==='approve';$('#decisionModal').dataset.type=type;$('#decisionTitle').textContent=ok?'核准本關':'退回（重新簽核）';$('#decisionLabel').classList.toggle('req',!ok);$('#decisionLabel').textContent=ok?'簽核意見':'退回原因';$('#decisionOpinion').placeholder=ok?'可填寫簽核意見（選填）':'請輸入退回原因（必填）';$('#decisionOpinion').value='';$('#decisionConfirm').textContent=ok?'確認核准':'確認退回';$('#decisionConfirm').className='btn '+(ok?'success':'danger-filled');$('#decisionModal').hidden=false}
$('#approveBtn').onclick=()=>openDecision('approve');
$('#rejectBtn').onclick=()=>openDecision('reject');
$$('[data-close-modal]').forEach(x=>x.onclick=()=>$('#decisionModal').hidden=true);
$('#decisionConfirm').onclick=()=>{const t=$('#decisionModal').dataset.type;if(t==='reject'&&!$('#decisionOpinion').value.trim()){alert('請輸入退回原因');return}$('#decisionModal').hidden=true;alert(t==='reject'?'已退回申請':'本關已核准')};
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;['decisionModal','historyModal'].forEach(id=>$('#'+id).hidden=true)});

/* 列印 */
function units(id){return $$(`#${id} tr`).map(tr=>{const s=tr.querySelector('.department-select');return s.value?`${esc(s.selectedOptions[0].text)}（${esc(tr.querySelector('.manager-cell').textContent)}）`:''}).filter(Boolean).join('<br>')||'—'}
function checked(name,other){return $$(`input[name=${name}]:checked`).map(x=>x.value==='其他'?'其他：'+dash($(other).value):x.value).join('、')||'—'}
addEventListener('beforeprint',()=>{
  const m=$('#pageTitle').textContent.match(/（(CBS-[^）]+)）/);$('#pDocNo').textContent=m?m[1]:'尚未產生單號';
  $('#pApplicant').textContent=$('#applicant').selectedOptions[0].textContent;$('#pUnit').textContent=$('#applicantUnit').textContent;
  $('#pDate').textContent=/回寫/.test($('#applyDate').textContent)?'—':$('#applyDate').textContent.replace('申請日期：','');$('#pExpect').textContent=$('#expectDate').value?$('#expectDate').value.replace(/-/g,'/'):'—';
  $('#pTitle').textContent=dash($('#title').value);$('#pType').textContent=$('input[name=type]:checked')?($('input[name=type]:checked').value==='其他'?'其他：'+dash($('#typeOther').value):$('input[name=type]:checked').value):'—';
  $('#pSystem').textContent=checked('system','#systemOther');$('#pBackground').textContent=dash($('#background').value);$('#pBenefit').textContent=checked('benefit','#benefitOther');{const ef=$('input[name=effort]:checked');$('#pEffort').textContent=!ef?'—':ef.value==='unknown'?'無法預估':'預估工時：'+($('#effortHours').value||'—')+' 小時'}
  $('#pDetail').innerHTML=$('#detailText').innerHTML||'—';$('#pCountersign').innerHTML=units('countersignRows');$('#pNotify').innerHTML=units('notifyRows');
  $('#pApproval').innerHTML=mode.value==='new'?'<tr><td colspan="4">尚未送出簽核</td></tr>':$$('.approval-stage').map(s=>`<tr><td>${esc(s.querySelector('.stage-title').textContent.slice(2))}</td><td>${esc(s.querySelector('.stage-person').textContent)}</td><td>${esc(s.querySelector('.stage-status').textContent)}</td><td>${esc(s.querySelector('time').textContent.slice(0,10))}</td></tr>`).join('');
});
applyMode();
// 作廢（Demo，規則尚未寫入規格）：申請人可在「申請中、簽核中、已退回、已核准」時作廢（沒有執行階段，已核准也可作廢）。
(function(){
  if(!window.ClaimVoid)return;
  const ME='陳庭瑋 (T037)',viewBox=$('#viewActions'),editBox=$('#editActions'),titleEl=$('#pageTitle');
  const st=()=>params.get('st')||'簽核中',docNo=()=>params.get('no')||DOC_NO;
  const mkBtn=()=>{const b=document.createElement('button');b.type='button';b.className='btn tool-action void-action';b.hidden=true;b.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>作廢';return b};
  const btn=mkBtn(),btn2=mkBtn();viewBox.appendChild(btn);editBox.appendChild(btn2);
  const copyLink=viewBox.querySelector('a.tool-action');
  const nowTxt=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return d.getFullYear()+'/'+p(d.getMonth()+1)+'/'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes())};
  function sync(){
    const v=mode.value,voided=v==='voided',own=v==='viewOwn';
    $('#voidAlert').hidden=!voided;
    btn.hidden=!own;btn2.hidden=!(v==='edit'&&params.get('st')!=='草稿');
    if(copyLink)copyLink.hidden=voided&&params.get('copy')==='0';
    document.querySelectorAll('.void-badge').forEach(x=>x.remove());
    if(!voided)return;
    const i=window.__voidInfo||{reason:params.get('reason')||'改由其他方式處理，不需要此需求。',time:params.get('at')||'2026/11/13 11:20',by:ME,from:params.get('from')||'簽核中'};
    titleEl.insertAdjacentHTML('beforeend','<span class="void-badge">已作廢</span>');
    $('#voidReasonText').textContent=i.reason;$('#voidWhoText').textContent=i.by+'　'+i.time;
    $('#roundBadge').textContent='狀態：已作廢';
    // 未完成的關卡標示已作廢（renderRoute 依 stageDone 已把作廢前已核准的關卡標為已核准）
    $$('#routeBody .approval-stage').forEach(el=>{if(el.classList.contains('approved'))return;el.className='approval-stage voided';
      const s=el.querySelector('.stage-status');s.className='stage-status voided';s.textContent='已作廢';
      el.querySelector('.stage-person').textContent='申請人已作廢，流程終止';const t=el.querySelector('time');if(t)t.textContent=i.time});
    $('#routePanel').hidden=false;
  }
  function openVoid(){
    const raw=mode.value==='edit'?'已退回':st(),no=docNo(),approved=raw==='已核准';
    const s=approved?'已核准':raw;
    ClaimVoid.open({no,status:s,statusText:s,label:'系統需求單',blockers:ClaimVoid.blockersOf(no),
      warn:'此單已核准，作廢前請先確認尚未開始評估或排程。',
      onConfirm(reason){
        window.__voidInfo={reason,time:nowTxt(),by:ME,from:s};
        params.set('no',no);mode.value='voided';history.replaceState(null,'','?mode=voided&no='+encodeURIComponent(no));
        applyMode();sync();ClaimVoid.toast('系統需求單 '+no+' 已作廢。');
      }});
  }
  btn.addEventListener('click',openVoid);btn2.addEventListener('click',openVoid);
  mode.onchange=()=>{window.__voidInfo=null;['reason','at','from','st','copy'].forEach(k=>params.delete(k));history.replaceState(null,'',`?mode=${mode.value}`);applyMode();sync()};
  sync();
})();
