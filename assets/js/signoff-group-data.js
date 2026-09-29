/* 簽核資格群組範例資料：簽核資格群組管理（signoff-group.js）與員工管理（employee.js）共用。
   每個群組都屬於單一公司（沒有共用群組），成員只能是帳號對應公司組織包含該公司的員工。
   成員與員工範例資料（employee-data.js）的「簽核資格」保持一致。 */
const signoffGroups=[
 {id:'26SQG0001',name:'CBS-總經理',company:'網家跨境服務股份有限公司',desc:'公司層級最終決行，對應各表單的總經理／代表關卡。',members:['陳庭瑋 (T037)'],editor:'陳庭瑋',edited:'2026/09/20 10:00:00',creator:'陳庭瑋',created:'2026/09/01 09:00:00'},
 {id:'26SQG0002',name:'CBS-財務會簽',company:'網家跨境服務股份有限公司',desc:'請購單、請款單等單據勾選會簽時的財務關卡。',members:['朱驥瑋 (B136)'],editor:'陳庭瑋',edited:'2026/09/19 16:20:00',creator:'陳庭瑋',created:'2026/09/01 09:00:00'},
 {id:'26SQG0003',name:'CBS-印鑑保管組',company:'網家跨境服務股份有限公司',desc:'公司印鑑申請單的保管人核決關卡。',members:['朱驥瑋 (B136)'],editor:'陳庭瑋',edited:'2026/09/17 11:00:00',creator:'陳庭瑋',created:'2026/09/01 09:00:00'}
];
