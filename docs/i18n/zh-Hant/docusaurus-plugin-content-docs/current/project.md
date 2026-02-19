---
id: project
title: Project 指令
---

Project 指令目前只保留 project status。

## `project status`

```bash
traduora project status [--format <table|json>]
```

回傳目前專案的統計資訊。
預設輸出為 `table`；機器可讀需求可使用 `--format json`。
Table 視圖僅顯示可直接判讀的統計欄位（`progress`、`translated`、`total`、`terms`、`locales`）。

## 行為

- 專案 ID 由 state（`currentProjectId`）讀取。
- 不支援傳入 project ID 參數。
- 若尚未設定專案，請先執行 `traduora init`。
