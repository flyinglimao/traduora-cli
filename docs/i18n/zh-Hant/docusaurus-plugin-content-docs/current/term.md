---
id: term
title: Term 指令
---

Term 指令對外使用 **term key**（`term.value`）作為公開識別，而不是 UUID。

## `term add`

```bash
traduora term add <value> [--label <label[,label...]>] [--format <table|json>]
```

在目前專案建立 term key。

## `term list`

```bash
traduora term list [--format <table|json>]
```

列出目前專案中的所有 term。
預設輸出為 `table`，包含 `value`、`context`、`label` 欄位。
腳本用途可使用 `--format json`。

## `term update`

```bash
traduora term update <value> --new-value <value> [--label <label[,label...]>] [--format <table|json>]
```

先用舊 key 找到 term，再更新 key。

## `term delete`

```bash
traduora term delete <value> [--format <table|json>]
```

以 key 找到 term 後刪除。

## 參數與行為

- 專案一律由 state（`currentProjectId`）解析。
- `--label` 會更新 term 的 labels。
- `--format`：預設 `table`，`json` 則提供機器可讀輸出。
- CLI 內部會先做 `value -> termId` 對映後再呼叫 API。

## 範例

```bash
traduora term list
traduora term list --format json
traduora term add form.email.required --label form,validation
traduora term update form.email.required --new-value form.email.missing --label validation
```
