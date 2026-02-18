---
id: export
title: Export 命令
---

`export` 用于下载指定项目与 locale 的翻译文件。

## 命令

```bash
traduora export [--project <id>] [--locale <code>] [--format <format>] [--output <path>]
```

## 参数

| 参数 | 目的 | 默认 |
|---|---|---|
| `--project` | 指定项目 | 当前默认项目 |
| `--locale` | 指定语言 | 当前默认语言 |
| `--format` | 导出格式 | `jsonnested` |
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
traduora export --project <id> --locale ja --format jsonflat --output ./i18n/ja.json
```
