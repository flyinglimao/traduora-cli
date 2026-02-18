---
id: project
title: Project 指令
---

Project 指令用來管理專案，與切換預設專案。

## `project add`

```bash
traduora project add <name> [--description <text>] [--label <label[,label...]>]
```

建立新專案，並可同時確保 labels 存在。

## `project list`

```bash
traduora project list
```

列出你可存取的專案。當前預設專案會被標記。

## `project update`

```bash
traduora project update <id> [--name <name>] [--description <text>] [--label <label[,label...]>]
```

更新專案名稱與描述，並可補齊 labels。

## `project remove`

```bash
traduora project remove <id>
```

刪除專案。

## `project status`

```bash
traduora project status [id]
```

查看專案統計。若未提供 `id`，使用目前預設專案。

## `project use`

```bash
traduora project use <id>
```

把指定專案寫入 state，作為後續預設專案。

## 參數與行為

- `--label` 可傳逗號分隔，也可重複多次。
- 不存在的 label 會由 CLI 自動建立。
- 需要 project 的指令會依序使用：
  1. 明確提供的 `--project` / `<id>`
  2. 狀態檔中的 `currentProjectId`
