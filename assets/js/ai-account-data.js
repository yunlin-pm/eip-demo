/* AI工具帳號管理（Demo）共用範例資料：管理列表與內容頁共用。Demo 不保存異動，重新整理即還原。
   資料結構：帳號主檔（帳號、使用者、部門、使用方式、備註）＋使用紀錄 records（多筆，每筆：類型、方案、起日、迄日、來源申請單號、備註）。
   狀態、目前使用方案、預計結束日期、最後一次停用日皆由 records 推算，不另外存。停用紀錄的 start 為停用日期。 */
const AIA_TODAY='2026/11/24';
const AIA_EMPLOYEES=[
  {code:'T037',name:'陳庭瑋',dept:'人事總務課',depts:['人事總務課','代購部']},
  {code:'T038',name:'林家筠',dept:'資訊部／SRE',depts:['資訊部／SRE']},
  {code:'T021',name:'王曉明',dept:'客戶服務部',depts:['客戶服務部']},
  {code:'B136',name:'朱驥瑋',dept:'代購部',depts:['代購部']}
];
const AIA_PLANS=['ChatGPT Business－Standard seat','ChatGPT Business－Premium seat','其他'];
/* 申請單範例（對應 AI 工具使用申請管理）：供「輸入單號帶入」查詢使用 */
const AIA_FORMS=[
  {no:'CBS-IAI-2026-00001',item:'續用',account:'xiaoming.wang@japan-import.com.tw',shared:false,plan:'ChatGPT Business－Standard seat',applicant:'王曉明(T021)',dept:'客戶服務部',months:12,approved:'2026/09/03',completed:'2026/09/16',status:'已核准',execution:'已執行'},
  {no:'CBS-IAI-2026-00003',item:'首次使用',account:'xiaoming.wang@japan-import.com.tw',shared:false,plan:'ChatGPT Business－Standard seat',applicant:'王曉明(T021)',dept:'客戶服務部',months:3,approved:'2026/08/08',completed:'2026/08/10',status:'已核准',execution:'已執行'},
  {no:'CBS-IAI-2026-00010',item:'停用',account:'jiayun.lin@japan-import.com.tw',shared:false,plan:'ChatGPT Business－Standard seat',applicant:'林家筠(T038)',dept:'資訊部／SRE',months:0,approved:'2026/11/04',completed:'2026/11/05',status:'已核准',execution:'已執行'},
  {no:'CBS-IAI-2026-00011',item:'首次使用',account:'tingwei.chen@japan-import.com.tw',shared:false,plan:'ChatGPT Business－Premium seat',applicant:'陳庭瑋(T037)',dept:'代購部',months:3,approved:'2026/11/12',completed:'2026/11/16',status:'已核准',execution:'已執行'},
  {no:'CBS-IAI-2026-00012',item:'首次使用',account:'jiwei.zhu@japan-import.com.tw',shared:false,plan:'ChatGPT Business－Standard seat',applicant:'朱驥瑋(B136)',dept:'代購部',months:3,approved:'2026/11/18',completed:'2026/11/20',status:'已核准',execution:'已執行'},
  {no:'CBS-IAI-2026-00013',item:'升級',account:'xiaoming.wang@japan-import.com.tw',shared:false,plan:'ChatGPT Business－Premium seat',applicant:'王曉明(T021)',dept:'客戶服務部',months:6,approved:'2026/11/18',completed:'2026/11/20',status:'已核准',execution:'已執行'},
  {no:'CBS-IAI-2026-00014',item:'停用',account:'ops-claude@japan-import.com.tw',shared:false,plan:'其他',applicant:'林家筠(T038)',dept:'資訊部／SRE',months:0,approved:'2026/11/20',completed:'2026/11/21',status:'已核准',execution:'已執行'},
  {no:'CBS-IAI-2026-00005',item:'升級',account:'jiayun.lin@japan-import.com.tw',shared:false,plan:'ChatGPT Business－Premium seat',applicant:'林家筠(T038)',dept:'資訊部／SRE',months:12,approved:'2026/09/12',completed:'',status:'已核准',execution:'尚未執行'},
  {no:'CBS-IAI-2026-00008',item:'續用',account:'tingwei.chen@japan-import.com.tw',shared:false,plan:'ChatGPT Business－Standard seat',applicant:'陳庭瑋(T037)',dept:'人事總務課',months:12,approved:'2026/09/24',completed:'',status:'已核准',execution:'尚未執行'},
  {no:'CBS-IAI-2026-00006',item:'首次使用',account:'tingwei.chen@japan-import.com.tw',shared:false,plan:'ChatGPT Business－Standard seat',applicant:'陳庭瑋(T037)',dept:'人事總務課',months:3,approved:'',completed:'',status:'申請中',execution:'尚未執行'},
  {no:'CBS-IAI-2026-00009',item:'升級',account:'xiaoming.wang@japan-import.com.tw',shared:false,plan:'ChatGPT Business－Premium seat',applicant:'王曉明(T021)',dept:'客戶服務部',months:6,approved:'2026/09/14',completed:'',status:'已作廢',execution:'—'}
];
/* 帳號清冊範例（records 為使用紀錄；type：首次使用／續用／升級／停用） */
const AIA_ACCOUNTS=[
  {id:'A001',account:'xiaoming.wang@japan-import.com.tw',user:'王曉明(T021)',dept:'客戶服務部',usage:'個人使用',remark:'',records:[
    {type:'首次使用',plan:'ChatGPT Business－Standard seat',planNote:'',start:'2026/08/10',end:'2026/11/10',formNo:'CBS-IAI-2026-00003',note:''},
    {type:'續用',plan:'ChatGPT Business－Standard seat',planNote:'',start:'2026/11/10',end:'2027/11/10',formNo:'CBS-IAI-2026-00001',note:'接續上一期，自 11/10 起算 12 個月'}]},
  {id:'A002',account:'jiayun.lin@japan-import.com.tw',user:'林家筠(T038)',dept:'資訊部／SRE',usage:'個人使用',remark:'2026/11 已改用公司其他方案',records:[
    {type:'首次使用',plan:'ChatGPT Business－Standard seat',planNote:'',start:'2026/03/10',end:'2026/12/10',formNo:'',note:'上線前已開通，由 RD 匯入'},
    {type:'停用',plan:'',planNote:'',start:'2026/11/05',end:'',formNo:'CBS-IAI-2026-00010',note:''}]},
  {id:'A003',account:'ai-service@japan-import.com.tw',user:'朱驥瑋(B136)',dept:'代購部',usage:'多人共用',remark:'代購部共用帳號，負責人為朱驥瑋',records:[
    {type:'首次使用',plan:'ChatGPT Business－Premium seat',planNote:'',start:'2026/06/01',end:'2026/11/10',formNo:'',note:''}]},
  {id:'A004',account:'ops-claude@japan-import.com.tw',user:'林家筠(T038)',dept:'資訊部／SRE',usage:'個人使用',remark:'',records:[
    {type:'首次使用',plan:'其他',planNote:'Claude Team',start:'2026/10/01',end:'',formNo:'',note:''}]},
  {id:'A005',account:'tingwei.chen@japan-import.com.tw',user:'陳庭瑋(T037)',dept:'代購部',usage:'個人使用',remark:'',records:[
    {type:'首次使用',plan:'ChatGPT Business－Standard seat',planNote:'',start:'2026/02/16',end:'2026/05/16',formNo:'',note:''},
    {type:'停用',plan:'',planNote:'',start:'2026/05/20',end:'',formNo:'',note:'專案結束'},
    {type:'首次使用',plan:'ChatGPT Business－Premium seat',planNote:'',start:'2026/11/16',end:'2027/02/16',formNo:'CBS-IAI-2026-00011',note:'重新啟用'}]}
];
const AIA_TYPES=['首次使用','續用','升級','停用'];
const aiaFormByNo=no=>AIA_FORMS.find(x=>x.no===no);
const aiaFormOwner=no=>AIA_ACCOUNTS.find(a=>a.records.some(r=>r.formNo===no));
const aiaRecPlan=r=>r.plan==='其他'?'其他（'+(r.planNote||'未填寫')+'）':r.plan;
/* 依起日排序（同日維持輸入順序） */
const aiaSorted=recs=>recs.map((r,i)=>({r,i})).sort((x,y)=>(x.r.start||'9999').localeCompare(y.r.start||'9999')||x.i-y.i).map(x=>x.r);
/* 現況：狀態、目前使用方案、預計結束日期、最後一次停用日（皆由使用紀錄推算） */
function aiaCurrent(a){const s=aiaSorted(a.records),last=s[s.length-1],stopped=!!last&&last.type==='停用',active=[...s].reverse().find(r=>r.type!=='停用'),stops=s.filter(r=>r.type==='停用');
  return{has:s.length>0,stopped,planKey:stopped||!active?'':active.plan,plan:stopped||!active?'':aiaRecPlan(active),end:stopped||!active?'':active.end,lastStop:stops.length?stops[stops.length-1].start:''}}
const aiaIsOverdue=a=>{const c=aiaCurrent(a);return c.has&&!c.stopped&&!!c.end&&c.end<AIA_TODAY};
/* 使用紀錄順序檢查：回傳錯誤訊息，無誤回傳空字串 */
function aiaCheckRecords(recs){const s=aiaSorted(recs);
  for(let i=0;i<s.length;i++){const t=s[i].type,prev=s[i-1];
    if(i===0&&t==='停用')return'第一筆使用紀錄不能是「停用」。';
    if(t==='首次使用'&&prev&&prev.type!=='停用')return'「首次使用」只能是第一筆，或接在「停用」之後（重新啟用）。';
    if((t==='續用'||t==='升級'||t==='停用')&&prev&&prev.type==='停用')return'「停用」之後只能新增「首次使用」（重新啟用）。'}
  return''}
