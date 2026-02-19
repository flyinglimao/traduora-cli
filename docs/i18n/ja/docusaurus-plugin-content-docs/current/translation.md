---
id: translation
title: Translation コマンド
---

Translation コマンドは 1 つの locale と 1 つの term key を対象に翻訳を操作します。

## `translation use`

```bash
traduora translation use <locale_code> [--format <table|json>]
```

既定 locale を state ファイルに保存します。

## `translation add`

```bash
traduora translation add --term <key> --value <text> [--locale <code>] [--label <label[,label...]>] [--format <table|json>]
```

指定した term + locale の翻訳値を追加（または上書き）します。

## `translation list`

```bash
traduora translation list [--locale <code>] [--format <table|json>]
```

翻訳一覧を表示し、term ID を term key に解決して表示します。
既定出力は `table` です。自動化スクリプトでは `--format json` を使ってください。

## `translation update`

```bash
traduora translation update --term <key> --value <text> [--locale <code>] [--label <label[,label...]>] [--format <table|json>]
```

翻訳値と任意の labels を更新します。

## `translation delete`

```bash
traduora translation delete --term <key> [--locale <code>] [--format <table|json>]
```

対象 locale の翻訳値をクリアします。

## パラメータと挙動

- project は常に state（`currentProjectId`）から解決されます。
- `--locale`：既定 locale が設定済みなら省略可能。
- `--term`：必須。可読な term key を指定します。
- `--value`：`add` / `update` で必須です。
- `--label`：翻訳 labels。存在しない label は自動作成されます。
- `--format`：既定は `table`、`json` は機械可読出力向けです。

## 例

```bash
traduora translation use en_GB
traduora translation add --term form.email.required --value "E-mail input is required" --label validation
traduora translation update --term form.email.required --value "E-mail is required"
```
