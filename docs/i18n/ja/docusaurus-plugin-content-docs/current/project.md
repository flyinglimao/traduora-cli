---
id: project
title: Project コマンド
---

Project コマンドは現在 `project status` のみを提供します。

## `project status`

```bash
traduora project status [--format <table|json>]
```

現在の project の統計情報を返します。
既定出力は `table`、機械可読用途では `--format json` を使用します。
Table 表示では実用的な統計項目（`progress`、`translated`、`total`、`terms`、`locales`）のみ表示します。

## 挙動

- project ID は state（`currentProjectId`）から読み取ります。
- project ID 引数は受け付けません。
- project 未設定の場合は先に `traduora init` を実行してください。
