const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],params=new URLSearchParams(location.search),mode=$('#mode');
const DEPTS={'法務部':'李東海 (B125)','財務部':'周怡君 (F002)','代標代購事業本部 / 代購部':'羅弘奕 (B019)','代標代購事業本部 / 代購部 / 訂單服務課':'黃少佑 (B136)'};
const applicantUnits={T037:'總經理室／後勤支援部／人事總務課',T021:'代標代購事業本部／客服部'};
const DOC_NO='CBS-GCN-2026-00005';
// 範例資料：新增為空白；修改／查看／簽核載入範例；複製（?copy=1）帶入範例但清除單號與簽核資料
const SAMPLE={item:'審閱',partner:'雲端物流股份有限公司',biz:['物流','系統'],bizOther:'',
 summary:'與雲端物流公司簽訂 2027 年度跨境物流服務合約，約定服務範圍、計價方式與服務水準（SLA）。',
 clauses:{'付款條件':'第 5 條：每月結算，次月 25 日前以匯款支付，月結 30 天。','合約期限':'第 3 條：2027/01/01～2027/12/31，共 1 年。','解約條件':'第 11 條：任一方得於 30 日前書面通知終止；重大違約得立即終止。','續約條件':'第 12 條：期滿前 60 日未提出異議者，自動續約 1 年。','特殊條款':'第 9 條：服務水準未達 98% 時，按月費 5% 計罰；違約金上限為年度費用 20%。','其他':''},
 docs:{'合約送審申請表':'1','合約':'12','報價單':'2','協議書':'','其他':''},docOther:'',
 units:['法務部','財務部']};
function setForm(d){
  $$('input[name=item]').forEach(x=>x.checked=x.value===d.item);
  $('#partner').value=d.partner;$('#summary').value=d.summary;
  $$('input[name=biz]').forEach(x=>x.checked=d.biz.includes(x.value));$('#bizOther').value=d.bizOther;
  $$('[data-clause]').forEach(x=>x.value=d.clauses[x.dataset.clause]||'');
  $$('#docCount .doc-count-row').forEach(r=>{const box=r.querySelector('[data-doc]'),name=box.dataset.doc,n=r.querySelector('input[type=number]'),v=d.docs[name]||'';box.checked=!!v;n.value=v});
  $('#docOtherName').value=d.docOther;
  $('#countersignRows').innerHTML='';d.units.forEach(u=>addUnit(u));
  syncBiz();syncDocs();
}
function blankForm(){return{item:'',partner:'',biz:[],bizOther:'',summary:'',clauses:{},docs:{'合約送審申請表':'1'},docOther:'',units:[]}}
function syncBiz(){const on=$('#bizOtherChk').checked,ro=mode.value!=='new'&&mode.value!=='edit';$('#bizOther').hidden=!on;$('#bizOther').disabled=!on||ro;if(!on)$('#bizOther').value=''}
function syncDocs(){
  const ro=mode.value!=='new'&&mode.value!=='edit';let total=0,any=false;
  $$('#docCount .doc-count-row').forEach(r=>{const box=r.querySelector('[data-doc]'),n=r.querySelector('input[type=number]');n.disabled=ro||!box.checked;if(!box.checked)n.value='';[...r.children].forEach(x=>{if(x.matches('input.control,em'))x.hidden=!box.checked});if(box.checked){any=true;total+=Number(n.value)||0}});
  $('#docOtherName').disabled=ro||!$('#docOtherChk').checked;if(!$('#docOtherChk').checked)$('#docOtherName').value='';
  $('#docTotal').textContent=any?total:'—';
}
function addUnit(sel){
  const tr=document.createElement('tr');
  tr.innerHTML='<td><select class="control department-select"><option value="">請選擇單位</option>'+Object.keys(DEPTS).map(d=>`<option>${d}</option>`).join('')+'</select></td><td class="manager-cell">—</td><td><button class="link-btn" type="button">刪除</button></td>';
  const s=tr.querySelector('select'),m=tr.querySelector('.manager-cell');s.value=sel||'';m.textContent=DEPTS[s.value]||'—';
  s.onchange=()=>m.textContent=DEPTS[s.value]||'—';tr.querySelector('.link-btn').onclick=()=>tr.remove();
  $('#countersignRows').appendChild(tr);
}
$('.add-unit').onclick=()=>addUnit('');
function applyMode(){
  const m=mode.value,read=m==='view'||m==='approve'||m==='viewOwn'||m==='voided',no=params.get('no')||DOC_NO,copy=!!params.get('copy');
  const box={new:'newActions',edit:'editActions',view:'viewActions',viewOwn:'viewActions',voided:'viewActions',approve:'approveActions'}[m];
  $$('#newActions,#editActions,#approveActions,#viewActions').forEach(x=>x.hidden=x.id!==box);
  $('#routePanel').hidden=m==='new';$('#returnAlert').hidden=m!=='edit';$('#opinionSummary').hidden=!read;
  document.body.classList.toggle('readonly',read);document.body.classList.toggle('show-approval-details',read);
  $('#pageTitle').textContent=m==='new'?'新增合約送審申請書（尚未產生單號）':`${m==='approve'?'簽核':m==='edit'?'編輯':'查看'}合約送審申請書（${no}）`;
  $('#applyDate').textContent=m==='new'?'申請日期：送出簽核後由系統回寫':'申請日期：2026/09/24';
  setForm(m==='new'&&!copy?blankForm():SAMPLE);
  $$('input,select,textarea,button.link-btn').forEach(el=>{if(el===mode||el.closest('#decisionModal,.cv-modal'))return;if(el.matches('button'))return;el.disabled=read});
  $('#sampleFile').hidden=m==='new';
  syncBiz();syncDocs();$('#applicantUnit').textContent=applicantUnits[$('#applicant').value]||'';
}
mode.value=params.get('mode')||'new';if(!mode.value)mode.value='new';
mode.onchange=()=>{history.replaceState(null,'',`?mode=${mode.value}`);params.delete('copy');applyMode()};
$('#applicant').onchange=e=>{$('#applicantUnit').textContent=applicantUnits[e.target.value]||'未設定所屬部門'};
$('#bizOtherChk').onchange=syncBiz;$('#docCount').addEventListener('input',syncDocs);$('#docCount').addEventListener('change',syncDocs);
$('#routeToggle').onclick=()=>{const open=$('#routeBody').classList.toggle('route-collapsed');$('#routeToggle').textContent=open?'查看':'收合'};
$('#historyLink').onclick=()=>$('#historyModal').hidden=false;$$('[data-close-history]').forEach(x=>x.onclick=()=>$('#historyModal').hidden=true);
function openDecision(type){$('#decisionTitle').textContent=type==='approve'?'核准並批示':'退回原因';$('#decisionOpinion').placeholder=type==='approve'?'可填寫簽核意見（選填），留空可直接核准':'請輸入退回原因（必填）';$('#decisionOpinion').value='';$('#decisionModal').dataset.type=type;$('#decisionModal').hidden=false}
$('#approveBtn').onclick=()=>openDecision('approve');$('#rejectBtn').onclick=()=>openDecision('reject');$$('[data-close-modal]').forEach(x=>x.onclick=()=>$('#decisionModal').hidden=true);
$('#decisionConfirm').onclick=()=>{const t=$('#decisionModal').dataset.type;if(t==='reject'&&!$('#decisionOpinion').value.trim()){alert('請輸入退回原因');return}alert(t==='reject'?'已退回申請':'本關已核准');$('#decisionModal').hidden=true};
// 送出簽核驗證
function validate(){
  if(!$('input[name=item]:checked'))return'請選擇申請項目。';
  if(!$('#partner').value.trim())return'請填寫簽約公司名稱。';
  if(!$$('input[name=biz]:checked').length)return'請至少勾選一項業務類型。';
  if($('#bizOtherChk').checked&&!$('#bizOther').value.trim())return'請填寫其他業務類型說明。';
  if(!$('#summary').value.trim())return'請填寫合約說明（簡述）。';
  for(const el of $$('[data-clause][data-req]'))if(!el.value.trim())return`請填寫「${el.dataset.clause}」的條文位置說明。`;
  const checked=$$('#docCount [data-doc]:checked');if(!checked.length)return'請至少勾選一項文件並填寫張數。';
  for(const box of checked){const n=box.closest('.doc-count-row').querySelector('input[type=number]');if(box.dataset.doc==='其他'&&!$('#docOtherName').value.trim())return'請填寫其他文件項目名稱。';if(!(Number(n.value)>=1))return`請填寫「${box.dataset.doc}」的張數。`}
  if($$('#countersignRows .department-select').some(s=>!s.value))return'請選擇會簽單位，或刪除空白列。';
  return'';
}
function submit(){const err=validate();if(err){alert(err);return}
  $('#pageTitle').textContent='合約送審申請書（CBS-GCN-2026-00011）';$('#applyDate').textContent='申請日期：'+new Date().toLocaleDateString('zh-TW',{year:'numeric',month:'2-digit',day:'2-digit'});
  alert('已送出簽核，系統已回寫申請日期與申請單號。')}
['#submitBtn','#submitBtn2'].forEach(s=>$(s).onclick=submit);['#saveDraft','#saveDraft2'].forEach(s=>$(s).onclick=()=>alert('已儲存草稿。'));
// 列印版：依目前畫面資料產生
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dash=v=>String(v||'').trim()||'—';
function buildPrint(){
  const m=mode.value,title=$('#pageTitle').textContent,mm=title.match(/（(CBS-[^）]+)）/);
  $('#pCompany').textContent=$('#company').value;$('#pDocNo').textContent=mm?mm[1]:'—';
  $('#pApplicant').textContent=$('#applicant').selectedOptions[0].textContent;$('#pUnit').textContent=dash($('#applicantUnit').textContent);
  $('#pDate').textContent=m==='new'||/回寫/.test($('#applyDate').textContent)?'—':$('#applyDate').textContent.replace('申請日期：','');
  $('#pItem').textContent=dash($('input[name=item]:checked')?.value?'合約'+$('input[name=item]:checked').value:'');
  $('#pPartner').textContent=dash($('#partner').value);
  $('#pBiz').textContent=dash($$('input[name=biz]:checked').map(x=>x.value==='其他'?'其他：'+($('#bizOther').value||'—'):x.value).join('、'));
  $('#pSummary').textContent=dash($('#summary').value);
  $('#pAttach').textContent=$('#sampleFile').hidden?'未附附件':'已附 1 份：'+$('#sampleFile .file-name').textContent;
  $('#pClause').innerHTML=$$('[data-clause]').map(el=>`<tr><th>${esc(el.dataset.clause)}</th><td>${esc(dash(el.value)).replace(/\n/g,'<br>')}</td></tr>`).join('');
  let total=0;const rows=$$('#docCount .doc-count-row').filter(r=>r.querySelector('[data-doc]').checked).map(r=>{const name=r.querySelector('[data-doc]').dataset.doc,n=Number(r.querySelector('input[type=number]').value)||0;total+=n;return`<tr><td>${esc(name==='其他'?'其他：'+dash($('#docOtherName').value):name)}</td><td>${n||'—'}</td></tr>`});
  $('#pDocs').innerHTML=(rows.join('')||'<tr><td colspan="2">—</td></tr>')+`<tr><th>合計</th><th>${rows.length?total+' 張':'—'}</th></tr>`;
  const ops={'部級主管':'同意送審，請法務確認解約條款。','會簽單位':'建議補充違約金上限，已於合約中確認。'};
  $('#pApproval').innerHTML=m==='new'?'<tr><td colspan="5">尚未送出簽核</td></tr>':$$('.approval-stage').map(st=>{const lv=st.querySelector('.stage-title').textContent.replace(/^[①-⑩]\s*/,''),t=st.querySelector('time').textContent.trim();return`<tr><td>${esc(lv)}</td><td>${esc(st.querySelector('.stage-person').textContent.trim())}</td><td>${esc(st.querySelector('.stage-status').textContent.trim())}</td><td>${esc(t==='—'?'—':t.slice(0,10))}</td><td>${esc(ops[lv]||'—')}</td></tr>`}).join('');
}
window.addEventListener('beforeprint',buildPrint);
applyMode();
// 作廢（比照請款單、簽呈單、採購請購單）：申請人可在「申請中、簽核中、已退回、已核准」作廢；被其他單據（請款單）引用者不可作廢。
(function(){
  if(!window.ClaimVoid)return;
  const ME='陳庭瑋 (T037)',viewBox=$('#viewActions'),editBox=$('#editActions'),titleEl=$('#pageTitle'),routeHead=$('#routePanel .round-badge');
  const NO_DEFAULT={'申請中':'CBS-GCN-2026-00005','簽核中':'CBS-GCN-2026-00005','已核准':'CBS-GCN-2026-00009'};
  const st=()=>params.get('st')||'簽核中',docNo=()=>params.get('no')||NO_DEFAULT[st()]||DOC_NO;
  const mk=()=>{const b=document.createElement('button');b.type='button';b.className='btn tool-action void-action';b.hidden=true;b.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>作廢';return b};
  const btn=mk(),btn2=mk();viewBox.appendChild(btn);editBox.appendChild(btn2);
  const copyLink=viewBox.querySelector('a.tool-action');
  const routeOrig=[...document.querySelectorAll('#routeBody .approval-stage')].map(el=>[el,el.className,el.innerHTML]);
  let info=null;
  const nowTxt=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return d.getFullYear()+'/'+p(d.getMonth()+1)+'/'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes())};
  function sync(){
    const v=mode.value,voided=v==='voided',own=v==='viewOwn';
    routeOrig.forEach(([el,c,h])=>{el.className=c;el.innerHTML=h});routeHead.textContent='目前送審輪次：1';
    $('#voidAlert').hidden=!voided;
    btn.hidden=!own;btn2.hidden=!(v==='edit'&&params.get('st')!=='草稿');
    if(copyLink)copyLink.hidden=voided&&params.get('copy')==='0';
    if(own)titleEl.textContent='查看合約送審申請書（'+docNo()+'）';
    if(!voided)return;
    const i=info||{reason:params.get('reason')||'簽約對象異動，作廢後重新送審。',time:params.get('at')||'2026/09/25 11:20',by:ME,from:params.get('from')||'簽核中'};
    titleEl.textContent='查看合約送審申請書（'+docNo()+'）';titleEl.insertAdjacentHTML('beforeend','<span class="void-badge">已作廢</span>');
    $('#voidReasonText').textContent=i.reason;$('#voidWhoText').textContent=i.by+'　'+i.time;
    routeHead.textContent='狀態：已作廢';
    const stages=[...document.querySelectorAll('#routeBody .approval-stage')];
    // 作廢前已核准：④法務單位、⑤總經理亦為已核准；其餘待簽核關卡標示已作廢
    if(i.from==='已核准')stages.slice(3).forEach((el,k)=>{el.className='approval-stage approved';const s=el.querySelector('.stage-status');s.className='stage-status approved';s.textContent='已核准';el.querySelector('time').textContent=k?'2026/09/25 10:00':'2026/09/24 16:30'});
    stages.forEach(el=>{if(!el.classList.contains('pending'))return;el.className='approval-stage voided';
      const s=el.querySelector('.stage-status');s.className='stage-status voided';s.textContent='已作廢';
      el.querySelector('.stage-person').textContent='申請人已作廢，流程終止';el.querySelector('time').textContent=i.time});
    $('#routePanel').hidden=false;
  }
  function openVoid(){
    const s=mode.value==='edit'?'已退回':st(),no=docNo();
    ClaimVoid.open({no,status:s,label:'合約送審申請書',blockers:ClaimVoid.blockersOf(no),
      warn:'此單已核准，作廢前請先確認尚未據此提出公司印鑑申請、用印或簽約。',
      onConfirm(reason){
        info={reason,time:nowTxt(),by:ME,from:s};
        params.set('no',no);mode.value='voided';history.replaceState(null,'','?mode=voided&no='+encodeURIComponent(no));
        applyMode();sync();ClaimVoid.toast('合約送審申請書已作廢。');
      }});
  }
  btn.addEventListener('click',openVoid);btn2.addEventListener('click',openVoid);
  mode.addEventListener('change',()=>{info=null;sync()});
  sync();
})();
