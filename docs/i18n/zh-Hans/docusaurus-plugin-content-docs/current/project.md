---
id: project
title: Project 命令
---

Project 命令用于管理项目及切换默认项目。

## `project add`

```bash
traduora project add <name> [--description <text>] [--label <label[,label...]>]
```

创建项目，并可同时确保 labels 存在。

## `project list`

```bash
traduora project list
```

列出你可访问的项目。当前默认项目会被标记。

## `project update`

```bash
traduora project update <id> [--name <name>] [--description <text>] [--label <label[,label...]>]
```

更新项目名称和描述，并可补齐 labels。

## `project remove`

```bash
traduora project remove <id>
```

删除项目。

## `project status`

```bash
traduora project status [id]
```

查看项目统计。未提供 `id` 时使用默认项目。

## `project use`

```bash
traduora project use <id>
```

将项目写入状态文件，作为后续默认项目。

## 参数与行为

- `--label` 可用逗号分隔，也可重复传入。
- 不存在的 label 会被自动创建。
- 需要 project 的命令按顺序使用：
  1. 显式传入的 `--project` / `<id>`
  2. 状态文件中的 `currentProjectId`
