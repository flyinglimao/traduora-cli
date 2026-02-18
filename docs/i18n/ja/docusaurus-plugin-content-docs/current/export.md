---
id: export
title: Export コマンド
---

`export` は project と locale を指定して翻訳ファイルを取得します。

## コマンド

```bash
traduora export [--project <id>] [--locale <code>] [--format <format>] [--output <path>]
```

## オプション

| オプション | 目的 | 既定値 |
|---|---|---|
| `--project` | 対象 project | 既定 project |
| `--locale` | 対象 locale | 既定 locale |
| `--format` | 出力フォーマット | `jsonnested` |
| `--output` | 出力ファイルパス | `<project>.<locale>.<format>` |

## 対応フォーマット

- `androidxml`
- `csv`
- `xliff12`
- `jsonflat`
- `jsonnested`
- `yamlflat`
- `yamlnested`
- `properties`
- `po`
- `strings`

## 例

```bash
traduora export --format jsonnested --output ./i18n/en_GB.json
traduora export --project <id> --locale ja --format jsonflat --output ./i18n/ja.json
```
