# Bibian EIP Demo

從 `index.html` 開啟所有 Demo。

## 已納入

- 工作總覽
- 表單申請／簽核列表
- 請款單內容頁（優化 v2）
- 全部已簽核表單
- 廠商匯款資料
- 員工薪資帳戶
- 我的代理人
- 人員代理設定
- 個人資料維護

## 過渡架構

請款單已拆出獨立 CSS／JavaScript。其他既有 BPM 頁面先由 `legacy/BPM_Demo_runtime.html` 提供完整互動，各自透過獨立入口頁載入。後續再逐功能抽出正式共用元件，避免一次重構破壞既有操作。

來源 `BPM_Demo.html` 與請款單優化 v2 均保留原位。
