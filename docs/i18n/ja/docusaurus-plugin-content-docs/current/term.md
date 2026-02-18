---
id: term
title: Term コマンド
---

Term コマンドは公開識別子として **term key**（`term.value`）を使います。

## `term add`

```bash
traduora term add <value> [--project <id>] [--label <label[,label...]>]
```

対象 project に term key を追加します。

## `term list`

```bash
traduora term list [--project <id>]
```

対象 project の term 一覧を表示します。

## `term update`

```bash
traduora term update <value> --new-value <value> [--project <id>] [--label <label[,label...]>]
```

現在の key で term を特定してから key を更新します。

## `term delete`

```bash
traduora term delete <value> [--project <id>]
```

key で term を特定して削除します。

## パラメータと挙動

- `--project` は既定 project があれば省略可能。
- `--label` は term label を更新。
- 内部的には `value -> termId` 変換を行って API を呼び出します。

## 例

```bash
traduora term add form.email.required --label form,validation
traduora term update form.email.required --new-value form.email.missing --label validation
```
