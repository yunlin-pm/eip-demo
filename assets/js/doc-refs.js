// 單據被引用關係（Demo 假資料）：被引用單據 → 引用它的單據清單。
// 規則：被其他單據引用者不可作廢，除非引用它的單據已「已作廢」或「已刪除」。
window.DOC_REFS={
  'CBS-GSI-2026-00001':[{type:'請款單',no:'CBS-FRE-2026-00016',status:'申請中'},{type:'請款單',no:'CBS-FRE-2026-00015',status:'申請中'}],
  'CBS-GSI-2026-00007':[{type:'請款單',no:'CBS-FRE-2026-00099',status:'草稿'}],
  'CBS-FPU-2026-00105':[{type:'請款單',no:'CBS-FRE-2026-00018',status:'申請中'}],
  'CBS-FPU-2026-00108':[{type:'請款單',no:'CBS-FRE-2026-00022',status:'已作廢'}],
  'CBS-GCN-2026-00002':[{type:'請款單',no:'CBS-FRE-2026-00017',status:'申請中'}],
  'CBS-GCN-2026-00009':[{type:'請款單',no:'CBS-FRE-2026-00024',status:'已作廢'}],
  'CBS-HTR-2026-00004':[{type:'國外出差請款單',no:'CBS-HTE-2026-00004',status:'簽核中'}],
  'CBS-HTR-2026-00002':[{type:'國外出差請款單',no:'CBS-HTE-2026-00006',status:'簽核中'}],
  'CBS-HTR-2026-00010':[{type:'國外出差請款單',no:'CBS-HTE-2026-00003',status:'已核准'}],
  'CBS-HTR-2026-00006':[{type:'國外出差請款單',no:'CBS-HTE-2026-00002',status:'已核准'}],
  'CBS-GSI-2026-00008':[{type:'請款單',no:'CBS-FRE-2026-00021',status:'已作廢'},{type:'請款單',no:'CBS-FRE-2026-00009',status:'已刪除'}]
};
