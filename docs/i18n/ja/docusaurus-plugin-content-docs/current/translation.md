---
id: translation
title: Translation コマンド
---

Translation コマンドは locale 単位で term key の翻訳を操作します。

## `translation use`

```bash
traduora translation use <locale_code>
```

既定 locale を状態ファイルに保存します。

## `translation add`

```bash
traduora translation add --term <key> --value <text> [--project <id>] [--locale <code>] [--label <label[,label...]>]
```

指定 term + locale の翻訳値を追加（または上書き）します。

## `translation list`

```bash
traduora translation list [--project <id>] [--locale <code>]
```

翻訳一覧を表示し、termId を term key に戻して出力します。

## `translation update`

```bash
traduora translation update --term <key> --value <text> [--project <id>] [--locale <code>] [--label <label[,label...]>]
```

翻訳値と任意の label を更新します。

## `translation delete`

```bash
traduora translation delete --term <key> [--project <id>] [--locale <code>]
```

対象 locale の翻訳値をクリアします。

## パラメータと挙動

- `--project`：既定 project があれば省略可。
- `--locale`：既定 locale があれば省略可。
- `--term`：必須。可読 key を指定。
- `--value`：add/update で必須。
- `--label`：翻訳 label。存在しない label は自動作成。

## 例

```bash
traduora translation use en_GB
traduora translation add --term form.email.required --value "E-mail input is required" --label validation
traduora translation update --term form.email.required --value "E-mail is required"
```
