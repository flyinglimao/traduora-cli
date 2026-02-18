---
id: translation
title: Translation 指令
---

Translation 指令會在指定語系下，對指定 term key 操作翻譯內容。

## `translation use`

```bash
traduora translation use <locale_code>
```

把預設語系寫入 state。

## `translation add`

```bash
traduora translation add --term <key> --value <text> [--project <id>] [--locale <code>] [--label <label[,label...]>]
```

對該 term + locale 新增或覆蓋翻譯值。

## `translation list`

```bash
traduora translation list [--project <id>] [--locale <code>]
```

列出翻譯內容，並把 termId 轉回 term key 顯示。

## `translation update`

```bash
traduora translation update --term <key> --value <text> [--project <id>] [--locale <code>] [--label <label[,label...]>]
```

更新翻譯內容與可選 labels。

## `translation delete`

```bash
traduora translation delete --term <key> [--project <id>] [--locale <code>]
```

清空該 term 在指定 locale 的翻譯值。

## 參數與行為

- `--project`：可省略（若有預設 project）。
- `--locale`：可省略（若有預設 locale）。
- `--term`：必要，使用人類可讀 key。
- `--value`：add/update 必填。
- `--label`：翻譯 label；不存在會自動建立。

## 範例

```bash
traduora translation use en_GB
traduora translation add --term form.email.required --value "E-mail input is required" --label validation
traduora translation update --term form.email.required --value "E-mail is required"
```
