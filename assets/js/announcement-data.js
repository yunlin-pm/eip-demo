/* 公司公告 Demo 資料：總覽「公司公告」區塊、公告列表頁、公告內容頁共用。
   發佈日期以「今天」往回推算（days），讓排序示範不會隨時間失效。
   公告管理欄位：companies（公告公司代碼）、expiryDays（到期日＝今天往回推的天數，負數＝未來；null＝不到期）、published（發佈公告：true 顯示／false 隱藏）、notify（發送 Email 通知公告公司全體員工）。
   同仁端（總覽、公告列表、公告內容）只顯示：發佈公告＝是、發佈日期≦今天、未過到期日、公告公司含登入者公司（Demo 為網家跨境 CBS）。
   排序規則：置頂旗標＝true 的排最前面（置頂之間依發佈日期新到舊），其餘依發佈日期新到舊。 */
var ANN_COMPANIES={CBS:'網家跨境服務股份有限公司',BBN:'比比昂株式會社',ASL:'空中補給股份有限公司'};
var ANN_COMPANY_SHORT={CBS:'網家跨境',BBN:'比比昂',ASL:'空中補給'};
var ANN_TYPES={'一般公告':'general','人事公告':'hr','資訊公告':'it','活動公告':'event'};
var ANNOUNCEMENTS=[
  {id:'ANN-2026-0014',type:'人事公告',pinned:true,days:2,title:'2026 年度年終考核作業時程公告',summary:'12/01 起開放年度考核自評，請各單位主管於 12/15 前完成部屬評核。',
   content:'<p>各位同仁好：</p><p>2026 年度年終考核作業即將開始，相關時程如下，請同仁與各單位主管依時程完成。</p><ul><li><b>12/01～12/07</b>：同仁於 EIP 完成自評</li><li><b>12/08～12/15</b>：單位主管完成部屬評核與面談</li><li><b>12/16～12/20</b>：部級主管覆核</li></ul><p>評核表與填寫說明請見附件。如有疑問，請洽人事總務課。</p>',
   attachments:[{name:'2026年度考核作業說明.pdf',size:'1.2 MB'},{name:'考核評核表.xlsx',size:'86 KB'}]},
  {id:'ANN-2026-0013',type:'資訊公告',pinned:false,days:4,title:'EIP 表單申請功能第二階段上線',summary:'新增工程派工單、AI 工具使用申請等表單，操作方式請參閱 Bibian EIP 操作手冊。',
   content:'<p>EIP 第二階段功能已於今日上線，本次新增以下表單：</p><ul><li>工程派工單</li><li>AI 工具使用申請</li><li>系統連線申請</li></ul><p>操作方式請參閱「Bibian EIP 操作手冊」。使用上如有問題，請至「Bibian EIP 問題回報」登記，資訊系統部將儘速處理。</p>',
   attachments:[{name:'EIP第二階段功能說明.pdf',size:'2.4 MB'}]},
  {id:'ANN-2026-0012',type:'活動公告',pinned:false,days:9,title:'雙 11 購物節員工限定優惠活動',summary:'活動期間員工使用公司帳號下單享免運費及額外折扣，詳細活動辦法與兌換方式請見附件說明。',
   content:'<p>為感謝同仁的辛勞，雙 11 購物節期間推出員工限定優惠：</p><ul><li>活動期間：11/05～11/15</li><li>使用公司帳號下單享免運費</li><li>指定商品再享 95 折</li></ul><p>兌換方式與注意事項請見附件。</p>',
   attachments:[{name:'雙11員工優惠活動辦法.pdf',size:'640 KB'}]},
  {id:'ANN-2026-0011',type:'一般公告',pinned:false,days:12,title:'辦公室設備維護通知',summary:'本週六 09:00～18:00 進行辦公室空調與電力設備維護，當日進辦公室的同仁請提前登記。',
   content:'<p>本週六 09:00～18:00 將進行辦公室空調與電力設備維護，維護期間部分區域將暫停供電。</p><p>當日需進辦公室的同仁，請於週五 17:00 前向人事總務課登記。</p>',attachments:[]},
  {id:'ANN-2026-0010',type:'資訊公告',pinned:true,days:20,title:'公司 VPN 連線方式調整',summary:'即日起遠端連線改用新版 VPN 用戶端，舊版將於月底停用，請盡早依說明完成安裝與設定。',
   content:'<p>為提升遠端連線安全性，即日起改用新版 VPN 用戶端，舊版將於本月底停用。</p><ol><li>下載附件中的安裝程式</li><li>依安裝說明完成設定</li><li>以公司帳號登入並完成雙重驗證</li></ol><p>安裝過程如有問題，請洽資訊系統部。</p>',
   attachments:[{name:'VPN安裝與設定說明.pdf',size:'1.8 MB'},{name:'VPN用戶端安裝程式.zip',size:'24.6 MB'}]},
  {id:'ANN-2026-0009',type:'人事公告',pinned:false,days:24,title:'11 月份新進同仁介紹',summary:'歡迎本月加入的 5 位新同仁，分別服務於技術系統開發部、顧客關係維護部及財務會計部。',
   content:'<p>歡迎本月加入的新同仁，請大家多多關照：</p><ul><li>技術系統開發部：2 位</li><li>顧客關係維護部：2 位</li><li>財務會計部：1 位</li></ul>',attachments:[]},
  {id:'ANN-2026-0008',type:'活動公告',pinned:false,days:30,title:'年末尾牙活動報名開始',summary:'今年尾牙訂於 1 月中旬舉辦，請於 12/10 前完成報名並填寫用餐需求。',
   content:'<p>今年尾牙訂於 1 月中旬舉辦，地點與流程將另行公告。</p><p>請於 12/10 前完成報名，並填寫用餐需求（葷／素）。</p>',attachments:[{name:'尾牙報名表.xlsx',size:'42 KB'}]},
  {id:'ANN-2026-0007',type:'一般公告',pinned:false,days:35,title:'員工停車位抽籤結果公告',summary:'下半年度停車位抽籤已完成，名單已寄送至各中籤同仁信箱。',
   content:'<p>下半年度停車位抽籤已完成，名單已寄送至各中籤同仁信箱，請於下週一起依編號停放。</p>',attachments:[]},
  {id:'ANN-2026-0006',type:'資訊公告',pinned:false,days:41,title:'電子郵件系統例行維護',summary:'週日凌晨 02:00～05:00 進行電子郵件系統維護，期間將無法收發信件。',
   content:'<p>週日凌晨 02:00～05:00 進行電子郵件系統例行維護，期間將無法收發信件，造成不便敬請見諒。</p>',attachments:[]},
  {id:'ANN-2026-0005',type:'人事公告',pinned:false,days:48,title:'2027 年度行事曆公告',summary:'2027 年度行事曆已公告，國定假日與補班日請參閱附件。',
   content:'<p>2027 年度行事曆已確定，國定假日、彈性放假與補班日請參閱附件。</p>',attachments:[{name:'2027年度行事曆.pdf',size:'320 KB'}]},
  {id:'ANN-2026-0004',type:'一般公告',pinned:false,days:55,title:'辦公室資源回收分類說明',summary:'自下月起落實資源回收分類，各樓層回收區將增設分類標示。',
   content:'<p>自下月起落實資源回收分類，各樓層回收區將增設分類標示，請同仁依標示分類丟棄。</p>',attachments:[]},
  {id:'ANN-2026-0003',type:'活動公告',pinned:false,days:63,title:'中秋節禮盒發放通知',summary:'中秋節禮盒將於 9/20 發放，請同仁至人事總務課簽收領取。',
   content:'<p>中秋節禮盒將於 9/20 10:00 起發放，請同仁至人事總務課簽收領取。</p>',attachments:[]},
  {id:'ANN-2026-0002',type:'資訊公告',pinned:false,days:70,title:'密碼原則調整公告',summary:'公司帳號密碼長度調整為至少 12 碼，並需每 90 天更新一次。',
   content:'<p>為加強資訊安全，公司帳號密碼原則調整如下：</p><ul><li>長度至少 12 碼</li><li>需包含大小寫英文、數字與符號</li><li>每 90 天更新一次</li></ul>',attachments:[]},
  {id:'ANN-2026-0001',type:'一般公告',pinned:false,days:80,title:'2026 年中秋連假及出勤提醒',summary:'中秋連假期間辦公室暫停開放，如需加班請事先提出申請。',
   content:'<p>中秋連假期間辦公室暫停開放，如需加班請事先於 EIP 提出申請並經主管核准。</p>',attachments:[]}
  ,{id:'ANN-2026-0017',type:'活動公告',pinned:false,days:-5,expiryDays:-20,companies:['CBS','BBN'],published:true,title:'2027 春酒活動預告',summary:'2027 春酒預計於 2 月舉辦，詳細時間地點將於近期公告。',
   content:'<p>2027 春酒預計於 2 月舉辦，詳細時間地點將於近期公告，敬請期待。</p>',attachments:[]},
  {id:'ANN-2026-0016',type:'人事公告',pinned:false,days:6,expiryDays:null,companies:['CBS'],published:false,title:'組織調整說明（草稿）',summary:'因應業務發展，部分單位將於明年初進行調整，詳細內容待確認後公告。',
   content:'<p>因應業務發展，部分單位將於明年初進行調整，詳細內容待確認後公告。</p>',attachments:[]},
  {id:'ANN-2026-0015',type:'一般公告',pinned:false,days:40,expiryDays:10,companies:['CBS','BBN','ASL'],published:true,title:'颱風停班停課應變說明',summary:'颱風期間如經政府宣布停班，同仁免出勤，請留意人事總務課通知。',
   content:'<p>颱風期間如經政府宣布停班，同仁免出勤；遠端作業安排請依各單位主管指示。</p>',attachments:[]}
];
var ANN_TODAY=(function(){var t=new Date();t.setHours(0,0,0,0);return t})();
(function(){
  var DEF={'ANN-2026-0014':{expiryDays:-30,companies:['CBS','BBN','ASL']},'ANN-2026-0013':{companies:['CBS','BBN','ASL']},'ANN-2026-0012':{expiryDays:-4,companies:['CBS']},'ANN-2026-0010':{expiryDays:-10,companies:['CBS','BBN']}};
  ANNOUNCEMENTS.forEach(function(a){var e=DEF[a.id]||{};
    if(!a.companies)a.companies=e.companies||['CBS'];
    if(a.expiryDays===undefined)a.expiryDays=e.expiryDays===undefined?null:e.expiryDays;
    if(a.published===undefined)a.published=true;
    if(a.notify===undefined)a.notify=a.pinned||a.type==='人事公告';
    var d=new Date(ANN_TODAY);d.setDate(d.getDate()-a.days);a.date=d;
    if(a.expiryDays===null){a.expiry=null}else{var x=new Date(ANN_TODAY);x.setDate(x.getDate()-a.expiryDays);a.expiry=x}
    // 新增者／最後編輯者（Demo）：新增於發佈日前 2 天，最後編輯於發佈日前 1 天（不晚於今天）
    var i=parseInt(a.id.slice(-2),10),c=new Date(a.date);c.setDate(c.getDate()-2);c.setHours(9+i%8,(i*7)%60,(i*13)%60);
    var e=new Date(a.date);e.setDate(e.getDate()-1);if(e>ANN_TODAY)e=new Date(ANN_TODAY);e.setHours(10+i%7,(i*11)%60,(i*17)%60);
    a.creator=a.creator||(i%2?'陳庭瑋':'洪榆瑄');a.created=c;a.editor=a.editor||(i%3?'陳庭瑋':'洪榆瑄');a.edited=e;
  });
})();
/* 狀態（公告管理用）：隱藏／排程中（未到發佈日）／已到期／顯示中 */
function annStatus(a){if(!a.published)return'隱藏';if(a.date>ANN_TODAY)return'排程中';if(a.expiry&&a.expiry<ANN_TODAY)return'已到期';return'顯示中'}
function annVisible(a,company){return annStatus(a)==='顯示中'&&a.companies.indexOf(company||'CBS')>=0}
function annFmt(d){var p=function(n){return String(n).padStart(2,'0')};return d.getFullYear()+'/'+p(d.getMonth()+1)+'/'+p(d.getDate())}
function annFmtTime(d){var p=function(n){return String(n).padStart(2,'0')};return annFmt(d)+' '+p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds())}
function annSortRule(a,b){return (b.pinned-a.pinned)||(b.date-a.date)}
/* 同仁端用：只回傳目前可見的公告 */
function annSorted(){return ANNOUNCEMENTS.filter(function(a){return annVisible(a)}).sort(annSortRule)}
/* 公告管理用：全部公告 */
function annSortedAll(){return ANNOUNCEMENTS.slice().sort(annSortRule)}
function annEsc(t){return String(t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
