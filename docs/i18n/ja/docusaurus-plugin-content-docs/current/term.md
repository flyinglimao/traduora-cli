---
id: term
title: Term コマンド
---

Term コマンドは公開識別子として **term key**（`term.value`）を使います（UUID ではありません）。

## `term add`

```bash
traduora term add <value> [--label <label[,label...]>] [--format <table|json>]
```

現在の project に term key を作成します。

## `term list`

```bash
traduora term list [--format <table|json>]
```

現在の project の term 一覧を表示します。
既定出力は `table` で、`value` / `context` / `label` 列を表示します。
スクリプト用途では `--format json` を使ってください。

## `term update`

```bash
traduora term update <value> --new-value <value> [--label <label[,label...]>] [--format <table|json>]
```

現在の key で term を特定してから key を更新します。

## `term delete`

```bash
traduora term delete <value> [--format <table|json>]
```

key で term を特定して削除します。

## パラメータと挙動

- project は常に state（`currentProjectId`）から解決されます。
- `--label` は term labels を更新します。
- `--format`：既定は `table`、`json` は機械可読出力向けです。
- CLI は API 呼び出し前に `value -> termId` を内部で解決します。

## 例

```bash
traduora term list
traduora term list --format json
traduora term add form.email.required --label form,validation
traduora term update form.email.required --new-value form.email.missing --label validation
```
