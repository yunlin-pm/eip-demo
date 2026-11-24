// 國外出差申請（HTR）範例資料：國外出差申請管理清單與國外出差請款單（帶入出差申請單號）共用。
// 簽核路線：出差 1～2 日＝直屬主管 → 財務（財務會計部 部長）→ 人事（後勤支援部 部長）；3 日（含）以上再加總經理。
window.TRAVEL_APPS=[
 {no:'CBS-HTR-2026-00012',status:'簽核中',signer:'羅薇琳 (B207)',company:'網家跨境服務股份有限公司',unit:'人事總務課',applicant:'陳庭瑋 (T037)',agent:'王曉明 (T021)',reason:'拜訪日本合作倉儲，確認 2027 年度跨境集運流程與作業 SLA。',place:'日本 東京、大阪',start:'2026/12/07',end:'2026/12/11',advance:'需要（日幣 150,000 元）',apply:'2026/11/20',approved:'—',signedByMe:false},
 {no:'CBS-HTR-2026-00011',status:'已核准',signer:'',company:'網家跨境服務股份有限公司',unit:'人事總務課',applicant:'陳庭瑋 (T037)',agent:'王曉明 (T021)',reason:'參加東京國際電子商務展，蒐集日本跨境電商與物流服務資訊。',place:'日本 東京',start:'2026/10/14',end:'2026/10/18',advance:'不需要',apply:'2026/09/25',approved:'2026/10/02',signedByMe:false},
 {no:'CBS-HTR-2026-00010',status:'已核准',signer:'',company:'網家跨境服務股份有限公司',unit:'人事總務課',applicant:'陳庭瑋 (T037)',agent:'林家筠 (T038)',reason:'與韓國合作夥伴洽談代購服務合作方案。',place:'韓國 首爾',start:'2026/11/03',end:'2026/11/04',advance:'需要（新台幣 10,000 元）',apply:'2026/10/15',approved:'2026/10/21',signedByMe:false},
 {no:'尚未產生單號',status:'草稿',signer:'',company:'網家跨境服務股份有限公司',unit:'人事總務課',applicant:'陳庭瑋 (T037)',agent:'王曉明 (T021)',reason:'新加坡物流業者實地訪查。',place:'新加坡',start:'2027/01/12',end:'2027/01/14',advance:'不需要',apply:'—',approved:'—',signedByMe:false},
 {no:'CBS-HTR-2026-00009',status:'已退回',signer:'',company:'網家跨境服務股份有限公司',unit:'人事總務課',applicant:'陳庭瑋 (T037)',agent:'王曉明 (T021)',reason:'香港供應商年度檢討會議。',place:'香港',start:'2026/12/15',end:'2026/12/16',advance:'需要（新台幣 8,000 元）',apply:'2026/11/12',approved:'—',signedByMe:false},
 {no:'CBS-HTR-2026-00008',status:'簽核中',signer:'陳庭瑋 (T037)',company:'網家跨境服務股份有限公司',unit:'客服部',applicant:'王曉明 (T021)',agent:'林家筠 (T038)',reason:'日本客服中心作業觀摩與教育訓練。',place:'日本 福岡',start:'2026/12/02',end:'2026/12/03',advance:'不需要',apply:'2026/11/18',approved:'—',signedByMe:false},
 {no:'CBS-HTR-2026-00007',status:'申請中',signer:'林家筠 (T038)',company:'網家跨境服務股份有限公司',unit:'人事總務課',applicant:'陳庭瑋 (T037)',agent:'王曉明 (T021)',reason:'泰國曼谷跨境電商論壇。',place:'泰國 曼谷',start:'2026/12/20',end:'2026/12/23',advance:'需要（美金 600 元）',apply:'2026/11/22',approved:'—',signedByMe:false},
 {no:'CBS-HTR-2026-00006',status:'已核准',signer:'',company:'網家跨境服務股份有限公司',unit:'客服部',applicant:'王曉明 (T021)',agent:'林家筠 (T038)',reason:'日本代購商家拜訪。',place:'日本 名古屋',start:'2026/10/06',end:'2026/10/09',advance:'需要（日幣 80,000 元）',apply:'2026/09/18',approved:'2026/09/24',signedByMe:true},
 {no:'CBS-HTR-2026-00004',status:'已核准',signer:'',company:'網家跨境服務股份有限公司',unit:'客服部',applicant:'王曉明 (T021)',agent:'林家筠 (T038)',reason:'日本客服外包廠商季度檢討與流程稽核。',place:'日本 東京',start:'2026/09/08',end:'2026/09/12',advance:'不需要',apply:'2026/08/20',approved:'2026/08/26',signedByMe:true},
 {no:'CBS-HTR-2026-00002',status:'已核准',signer:'',company:'網家跨境服務股份有限公司',unit:'人事總務課',applicant:'陳庭瑋 (T037)',agent:'王曉明 (T021)',reason:'拜訪日本合作倉儲，盤點跨境集運作業流程。',place:'日本 東京',start:'2026/08/17',end:'2026/08/21',advance:'需要（日幣 50,000 元）',apply:'2026/07/28',approved:'2026/08/03',signedByMe:false},
 {no:'CBS-HTR-2026-00005',status:'已作廢',signer:'',company:'網家跨境服務股份有限公司',unit:'人事總務課',applicant:'陳庭瑋 (T037)',agent:'王曉明 (T021)',reason:'越南胡志明市物流夥伴拜訪。',place:'越南 胡志明市',start:'2026/11/10',end:'2026/11/12',advance:'不需要',apply:'2026/10/20',approved:'—',signedByMe:false,voidedFrom:'簽核中',voidReason:'合作夥伴改為線上會議，取消出差。',voidAt:'2026/10/28 15:40'}
];
// 已核准出差申請的詳細內容（請款單輸入出差申請單號時帶入）；申請人、預支費用另取自 TRAVEL_APPS
window.TRAVEL_APP_DETAIL={
 'CBS-HTR-2026-00011':{reason:'參加東京國際電子商務展，蒐集日本跨境電商與物流服務資訊。',place:'日本 東京',start:'2026-10-14',end:'2026-10-18'},
 'CBS-HTR-2026-00010':{reason:'與韓國合作夥伴洽談代購服務合作方案。',place:'韓國 首爾',start:'2026-11-03',end:'2026-11-04'},
 'CBS-HTR-2026-00004':{reason:'日本客服外包廠商季度檢討與流程稽核。',place:'日本 東京',start:'2026-09-08',end:'2026-09-12'},
 'CBS-HTR-2026-00002':{reason:'拜訪日本合作倉儲，盤點跨境集運作業流程。',place:'日本 東京',start:'2026-08-17',end:'2026-08-21'},
 'CBS-HTR-2026-00006':{reason:'日本代購商家拜訪。',place:'日本 名古屋',start:'2026-10-06',end:'2026-10-09'}
};
