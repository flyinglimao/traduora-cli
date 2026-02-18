---
id: term
title: Term 命令
---

Term 命令对外使用 **term key**（`term.value`），不要求用户记 UUID。

## `term add`

```bash
traduora term add <value> [--project <id>] [--label <label[,label...]>]
```

在目标项目新增词条 key。

## `term list`

```bash
traduora term list [--project <id>]
```

列出目标项目全部词条。

## `term update`

```bash
traduora term update <value> --new-value <value> [--project <id>] [--label <label[,label...]>]
```

先按旧 key 查找 term，再更新 key。

## `term delete`

```bash
traduora term delete <value> [--project <id>]
```

按 key 查找并删除 term。

## 参数与行为

- `--project` 可省略（如果已有默认 project）。
- `--label` 用于更新 term labels。
- CLI 内部会自动执行 `value -> termId` 映射。

## 示例

```bash
traduora term add form.email.required --label form,validation
traduora term update form.email.required --new-value form.email.missing --label validation
```
