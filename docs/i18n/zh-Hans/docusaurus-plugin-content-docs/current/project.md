---
id: project
title: Project 命令
---

Project 命令现在仅保留 project status。

## `project status`

```bash
traduora project status [--format <table|json>]
```

返回当前项目的统计信息。
默认输出为 `table`；机器可读场景请使用 `--format json`。
Table 视图仅显示可直接判断的统计字段（`progress`、`translated`、`total`、`terms`、`locales`）。

## 行为

- 项目 ID 从 state（`currentProjectId`）读取。
- 不支持传入 project ID 参数。
- 若尚未设置项目，请先运行 `traduora init`。
