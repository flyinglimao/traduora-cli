---
id: export
title: Export 指令
---

`export` 用於下載指定專案與語系的翻譯檔。

## 指令

```bash
traduora export [--project <id>] [--locale <code>] [--format <format>] [--output <path>]
```

## 參數

| 參數 | 目的 | 預設 |
|---|---|---|
| `--project` | 指定專案 | 目前預設專案 |
| `--locale` | 指定語系 | 目前預設語系 |
| `--format` | 匯出格式 | `jsonnested` |
| `--output` | 輸出檔案路徑 | `<project>.<locale>.<format>` |

## 支援格式

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

## 範例

```bash
traduora export --format jsonnested --output ./i18n/en_GB.json
traduora export --project <id> --locale ja --format jsonflat --output ./i18n/ja.json
```
