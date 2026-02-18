---
id: project
title: Project コマンド
---

Project コマンドはプロジェクト管理と既定プロジェクト切り替えに使います。

## `project add`

```bash
traduora project add <name> [--description <text>] [--label <label[,label...]>]
```

新しい project を作成し、必要なら label も作成します。

## `project list`

```bash
traduora project list
```

アクセス可能な project 一覧を表示します。既定 project はマークされます。

## `project update`

```bash
traduora project update <id> [--name <name>] [--description <text>] [--label <label[,label...]>]
```

project 情報を更新し、必要なら label を補完します。

## `project remove`

```bash
traduora project remove <id>
```

project を削除します。

## `project status`

```bash
traduora project status [id]
```

project 統計を表示します。`id` 省略時は既定 project を使用します。

## `project use`

```bash
traduora project use <id>
```

状態ファイルに既定 project を保存します。

## パラメータと挙動

- `--label` はカンマ区切りと複数指定に対応。
- 不足している label は CLI が自動作成。
- project が必要なコマンドは次の順で project を解決：
  1. 明示された `--project` / `<id>`
  2. `currentProjectId`（状態ファイル）
