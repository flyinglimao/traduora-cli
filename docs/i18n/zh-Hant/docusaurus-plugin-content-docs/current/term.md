---
id: term
title: Term 指令
---

Term 指令對外使用 **term key**（`term.value`）而不是 UUID。

## `term add`

```bash
traduora term add <value> [--project <id>] [--label <label[,label...]>]
```

在目標專案新增詞條 key。

## `term list`

```bash
traduora term list [--project <id>]
```

列出目標專案中的所有詞條。

## `term update`

```bash
traduora term update <value> --new-value <value> [--project <id>] [--label <label[,label...]>]
```

先用舊 key 找到 term，再更新 key。

## `term delete`

```bash
traduora term delete <value> [--project <id>]
```

以 key 查到 term 後刪除。

## 參數與行為

- `--project` 可省略（若已設定預設 project）。
- `--label` 會更新 term 的 labels。
- CLI 內部會自動做 `value -> termId` 對映。

## 範例

```bash
traduora term add form.email.required --label form,validation
traduora term update form.email.required --new-value form.email.missing --label validation
```
