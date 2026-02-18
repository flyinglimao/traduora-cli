---
id: export
title: Export Command
---

`export` downloads translated resources for a project and locale.

## Command

```bash
traduora export [--project <id>] [--locale <code>] [--format <format>] [--output <path>]
```

## Options

| Option | Purpose | Default |
|---|---|---|
| `--project` | target project | current project |
| `--locale` | target locale | current locale |
| `--format` | output format | `jsonnested` |
| `--output` | output file path | `<project>.<locale>.<format>` |

## Supported formats

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

## Examples

```bash
traduora export --format jsonnested --output ./i18n/en_GB.json
traduora export --project <id> --locale ja --format jsonflat --output ./i18n/ja.json
```
