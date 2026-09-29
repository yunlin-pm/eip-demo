/* 員工範例資料：員工管理（employee.js）與組織管理「查看成員」彈窗（organization.js）共用，
   避免兩頁各放一份造成內容不一致。orgs 的 path 為「完整部門路徑」（含部門本身名稱）。 */
const employees=[
 {id:'26EMP0003',status:'啟用',code:'T037',name:'陳庭瑋',nickname:'Winnie',login:'user02@japan-import.com.tw',email:'user02@japan-import.com.tw',locale:'繁體中文',timezone:'Asia /Taipei',permMode:'group',permGroup:'系統管理員',signoffGroups:['CBS-總經理'],orgs:[{company:'網家跨境服務股份有限公司',path:'總經理'}],editor:'洪榆瑄',edited:'2026/09/14 15:32:10',creator:'陳庭瑋',created:'2026/09/01 09:10:00'},
 {id:'26EMP0002',status:'啟用',code:'B136',name:'朱驥瑋',nickname:'Alice',login:'user01@japan-import.com.tw',email:'user01@japan-import.com.tw',locale:'繁體中文',timezone:'Asia /Taipei',permMode:'custom',permGroup:'',customGrants:['forms-admin|proxy','vendor|view','payroll|view'],signoffGroups:['CBS-財務會簽','CBS-印鑑保管組'],orgs:[{company:'網家跨境服務股份有限公司',path:'總經理 / 代標代購事業本部 / 代購部'}],editor:'洪榆瑄',edited:'2026/09/13 11:08:42',creator:'陳庭瑋',created:'2026/09/01 09:13:00'},
 {id:'26EMP0001',status:'停用',code:'B019',name:'羅弘奕',nickname:'Carson',login:'user03@japan-import.com.tw',email:'user03@japan-import.com.tw',locale:'繁體中文',timezone:'Asia /Taipei',permMode:'group',permGroup:'行政人員',signoffGroups:[],orgs:[{company:'網家跨境服務股份有限公司',path:'總經理 / 代標代購事業本部 / 代購部'}],editor:'洪榆瑄',edited:'2026/09/12 16:20:15',creator:'陳庭瑋',created:'2026/09/01 09:17:00'}
];
