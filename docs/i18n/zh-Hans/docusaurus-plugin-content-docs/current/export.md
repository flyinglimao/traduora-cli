---
id: export
title: Export 命令
---

`export` 用于下载指定项目和 locale 的翻译文件。

## 命令

```bash
traduora export [--locale <code>] [--format <format>] [--result-format <table|json>] [--output <path>]
```

## 参数

| 参数 | 目的 | 默认 |
|---|---|---|
| project | 从 state 解析当前项目 | `currentProjectId` |
| `--locale` | 目标语言 | 当前 locale |
| `--format` | 导出文件格式 | `jsonnested` |
| `--result-format` | CLI 结果输出格式 | `table` |
| `--output` | 输出文件路径 | `<project>.<locale>.<format>` |

## 支持格式

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

## 示例

```bash
traduora export --format jsonnested --output ./i18n/en_GB.json
traduora export --locale ja --format jsonflat --output ./i18n/ja.json
```
