---
id: export
title: Export コマンド
---

`export` は project と locale を指定して翻訳ファイルを取得します。

## コマンド

```bash
traduora export [--locale <code>] [--format <format>] [--result-format <table|json>] [--output <path>]
```

## オプション

| オプション | 目的 | 既定値 |
|---|---|---|
| project | state から現在 project を解決 | `currentProjectId` |
| `--locale` | 対象 locale | 現在 locale |
| `--format` | エクスポートファイル形式 | `jsonnested` |
| `--result-format` | CLI 結果の出力形式 | `table` |
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
traduora export --locale ja --format jsonflat --output ./i18n/ja.json
```
