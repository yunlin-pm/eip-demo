/* 申請單位選擇（各表單共用，2026-11-18）
   申請人在所選公司只有 1 個歸屬部門：維持各表單原本的文字顯示；有 2 個以上：於申請人欄位旁出現「申請單位」下拉
   （預設第一個＝部門系統編號較小者，可改選；簽核依所選單位的主管）。查看／簽核等唯讀情境（申請人欄位停用）只顯示文字。
   做法：各表單原本的 #applicantUnit 文字視為「預設（第一個）單位」，本檔把其他歸屬部門加在後面；所選單位會寫回 #applicantUnit，
   讓各表單的列印版、摘要沿用。Demo 以申請人陳庭瑋（T037）示範：網家跨境另有「代標代購事業本部／代購部」。 */
(function(){
  const applicant=document.getElementById('applicant'),unitEl=document.getElementById('applicantUnit');
  if(!applicant||!unitEl)return;
  const EXTRA={T037:{'網家跨境服務股份有限公司':['代標代購事業本部／代購部']}};
  const companyEl=document.getElementById('company')||document.getElementById('companySelect')||[...(applicant.closest('section,.panel')||document).querySelectorAll('select')].find(s=>s!==applicant);
  const css=document.createElement('style');
  css.textContent='.au-field[hidden]{display:none!important}@media(min-width:1200px){.au-row{grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1.5fr)!important;max-width:none!important}}.au-field .control{width:100%}.au-hint{display:block;margin-top:4px;color:#667085;font-size:12px;font-weight:400;line-height:1.4}';
  document.head.appendChild(css);
  const host=applicant.closest('label')||applicant.parentElement;
  const field=document.createElement('label');field.className='au-field';field.hidden=true;
  field.innerHTML='<span class="label req">申請單位</span><select class="control" id="applicantUnitSel"></select><small class="au-hint">您在此公司有多個歸屬單位，請選擇本單的申請單位；簽核將依所選單位的主管進行。</small>';
  host.insertAdjacentElement('afterend',field);
  const sel=field.querySelector('select');
  // 桌機：公司、申請人、申請單位排成同一列（表頭原本只有 2 個欄位時；已有第 3 個欄位的表單維持原排版，申請單位換到下一列）
  const grid=host.parentElement;
  const rowLayout=on=>{if(!grid)return;const n=[...grid.children].filter(e=>e.tagName==='LABEL'&&!e.hidden&&e!==field&&!e.classList.contains('full')&&!e.classList.contains('reason-field')&&!e.classList.contains('head-row')).length;grid.classList.toggle('au-row',on&&n<=2)};
  let base=unitEl.textContent.trim(),writing=false;const chosen={};
  // 申請人代碼：option 的 value（如 T037）或文字中的員工編號（如「陳庭瑋 (T037)」）
  const code=()=>{const m=(applicant.value+' '+(applicant.selectedOptions[0]?applicant.selectedOptions[0].textContent:'')).match(/[A-Z]\d{3}/);return m?m[0]:''};
  const key=()=>code()+'|'+(companyEl?companyEl.value:'');
  function units(){
    const extra=((EXTRA[code()]||{})[companyEl?companyEl.value:'網家跨境服務股份有限公司'])||[];
    return base&&base!=='未設定所屬部門'?[base,...extra]:[...extra];
  }
  function write(text){writing=true;unitEl.textContent=text;setTimeout(()=>{writing=false},0)}
  function sync(){
    const list=units(),k=key();
    if(list.length<2||applicant.disabled){
      field.hidden=true;unitEl.hidden=false;rowLayout(false);
      if(list.length>1)write(chosen[k]&&list.includes(chosen[k])?chosen[k]:list[0]);
      return;
    }
    if(!(k in chosen)||!list.includes(chosen[k]))chosen[k]=list[0];
    sel.innerHTML=list.map(u=>`<option${u===chosen[k]?' selected':''}>${u}</option>`).join('');
    field.hidden=false;unitEl.hidden=true;write(chosen[k]);rowLayout(true);
  }
  // 各表單自己改 #applicantUnit（換申請人、載入範例）時，視為新的預設單位並重算
  new MutationObserver(()=>{if(writing)return;base=unitEl.textContent.trim();sync()}).observe(unitEl,{childList:true,characterData:true,subtree:true});
  // 查看／簽核等情境會停用申請人欄位：改為純文字
  new MutationObserver(sync).observe(applicant,{attributes:true,attributeFilter:['disabled']});
  sel.addEventListener('change',()=>{chosen[key()]=sel.value;write(sel.value)});
  applicant.addEventListener('change',()=>setTimeout(sync,0));
  if(companyEl)companyEl.addEventListener('change',()=>setTimeout(sync,0));
  sync();
})();
