---
id: export
title: Export 指令
---

`export` 用於下載指定專案與語系的翻譯檔案。

## 指令

```bash
traduora export [--locale <code>] [--format <format>] [--result-format <table|json>] [--output <path>]
```

## 參數

| 參數 | 目的 | 預設 |
|---|---|---|
| project | 由 state 解析目前專案 | `currentProjectId` |
| `--locale` | 目標語系 | 目前 locale |
| `--format` | 匯出檔案格式 | `jsonnested` |
| `--result-format` | CLI 結果輸出格式 | `table` |
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
traduora export --locale ja --format jsonflat --output ./i18n/ja.json
```
