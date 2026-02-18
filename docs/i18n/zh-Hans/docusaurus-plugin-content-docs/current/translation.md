---
id: translation
title: Translation 命令
---

Translation 命令在指定 locale 下，针对指定 term key 管理翻译文本。

## `translation use`

```bash
traduora translation use <locale_code>
```

把默认 locale 写入状态文件。

## `translation add`

```bash
traduora translation add --term <key> --value <text> [--project <id>] [--locale <code>] [--label <label[,label...]>]
```

为该 term + locale 新增或覆盖翻译值。

## `translation list`

```bash
traduora translation list [--project <id>] [--locale <code>]
```

列出翻译，并将 termId 还原显示为 term key。

## `translation update`

```bash
traduora translation update --term <key> --value <text> [--project <id>] [--locale <code>] [--label <label[,label...]>]
```

更新翻译值和可选 labels。

## `translation delete`

```bash
traduora translation delete --term <key> [--project <id>] [--locale <code>]
```

清空该 term 在目标 locale 的翻译值。

## 参数与行为

- `--project`：若有默认 project 可省略。
- `--locale`：若有默认 locale 可省略。
- `--term`：必填，使用可读 key。
- `--value`：add/update 必填。
- `--label`：翻译 labels，不存在会自动创建。

## 示例

```bash
traduora translation use en_GB
traduora translation add --term form.email.required --value "E-mail input is required" --label validation
traduora translation update --term form.email.required --value "E-mail is required"
```
