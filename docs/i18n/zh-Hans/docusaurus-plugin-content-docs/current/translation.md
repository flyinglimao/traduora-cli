---
id: translation
title: Translation 命令
---

Translation 命令在单一 locale 下，对单一 term key 操作翻译内容。

## `translation use`

```bash
traduora translation use <locale_code> [--format <table|json>]
```

把默认 locale 写入 state 文件。

## `translation add`

```bash
traduora translation add --term <key> --value <text> [--locale <code>] [--label <label[,label...]>] [--format <table|json>]
```

为指定 term + locale 新增或覆盖翻译值。

## `translation list`

```bash
traduora translation list [--locale <code>] [--format <table|json>]
```

列出翻译内容，并把 term ID 解析回 term key。
默认输出为 `table`；自动化脚本可使用 `--format json`。

## `translation update`

```bash
traduora translation update --term <key> --value <text> [--locale <code>] [--label <label[,label...]>] [--format <table|json>]
```

更新翻译值和可选 labels。

## `translation delete`

```bash
traduora translation delete --term <key> [--locale <code>] [--format <table|json>]
```

清空该 term 在目标 locale 下的翻译值。

## 参数与行为

- 项目始终从 state（`currentProjectId`）解析。
- `--locale`：若已设置默认 locale 可省略。
- `--term`：必填，使用可读的 term key。
- `--value`：`add` / `update` 必填。
- `--label`：翻译 labels；不存在会自动创建。
- `--format`：默认 `table`，`json` 用于机器可读输出。

## 示例

```bash
traduora translation use en_GB
traduora translation add --term form.email.required --value "E-mail input is required" --label validation
traduora translation update --term form.email.required --value "E-mail is required"
```
