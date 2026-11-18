// 單據被引用關係（Demo 假資料）：被引用單據 → 引用它的單據清單。
// 規則：被其他單據引用者不可作廢，除非引用它的單據已「已作廢」或「已刪除」。
window.DOC_REFS={
  'CBS-GSI-2026-00001':[{type:'請款單',no:'CBS-FRE-2026-00016',status:'申請中'},{type:'請款單',no:'CBS-FRE-2026-00015',status:'申請中'}],
  'CBS-GSI-2026-00007':[{type:'請款單',no:'CBS-FRE-2026-00099',status:'草稿'}],
  'CBS-GSI-2026-00008':[{type:'請款單',no:'CBS-FRE-2026-00021',status:'已作廢'},{type:'請款單',no:'CBS-FRE-2026-00009',status:'已刪除'}]
};
