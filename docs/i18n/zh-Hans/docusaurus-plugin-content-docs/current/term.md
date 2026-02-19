---
id: term
title: Term 命令
---

Term 命令使用 **term key**（`term.value`）作为公开标识，而不是 UUID。

## `term add`

```bash
traduora term add <value> [--label <label[,label...]>] [--format <table|json>]
```

在当前项目中创建 term key。

## `term list`

```bash
traduora term list [--format <table|json>]
```

列出当前项目中的所有 term。
默认输出为 `table`，包含 `value`、`context`、`label` 列。
脚本场景可使用 `--format json`。

## `term update`

```bash
traduora term update <value> --new-value <value> [--label <label[,label...]>] [--format <table|json>]
```

先按旧 key 找到 term，再更新 key。

## `term delete`

```bash
traduora term delete <value> [--format <table|json>]
```

按 key 找到 term 后删除。

## 参数与行为

- 项目始终从 state（`currentProjectId`）解析。
- `--label` 会更新 term 的 labels。
- `--format`：默认 `table`，`json` 用于机器可读输出。
- CLI 内部会先做 `value -> termId` 映射再调用 API。

## 示例

```bash
traduora term list
traduora term list --format json
traduora term add form.email.required --label form,validation
traduora term update form.email.required --new-value form.email.missing --label validation
```
