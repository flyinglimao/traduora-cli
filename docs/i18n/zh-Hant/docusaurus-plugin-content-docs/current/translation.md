---
id: translation
title: Translation 指令
---

Translation 指令會在單一語系下，針對單一 term key 操作翻譯內容。

## `translation use`

```bash
traduora translation use <locale_code> [--format <table|json>]
```

把預設語系寫入 state 檔。

## `translation add`

```bash
traduora translation add --term <key> --value <text> [--locale <code>] [--label <label[,label...]>] [--format <table|json>]
```

對指定 term + locale 新增或覆蓋翻譯值。

## `translation list`

```bash
traduora translation list [--locale <code>] [--format <table|json>]
```

列出翻譯內容，並把 term ID 解析回 term key。
預設輸出為 `table`；自動化腳本可使用 `--format json`。

## `translation update`

```bash
traduora translation update --term <key> --value <text> [--locale <code>] [--label <label[,label...]>] [--format <table|json>]
```

更新翻譯值與可選 labels。

## `translation delete`

```bash
traduora translation delete --term <key> [--locale <code>] [--format <table|json>]
```

清空該 term 在目標 locale 的翻譯值。

## 參數與行為

- 專案一律由 state（`currentProjectId`）解析。
- `--locale`：若已設定預設 locale 可省略。
- `--term`：必填，使用可讀的 term key。
- `--value`：`add` / `update` 必填。
- `--label`：翻譯 labels；不存在的 label 會自動建立。
- `--format`：預設 `table`，`json` 則提供機器可讀輸出。

## 範例

```bash
traduora translation use en_GB
traduora translation add --term form.email.required --value "E-mail input is required" --label validation
traduora translation update --term form.email.required --value "E-mail is required"
```
