---
id: translation
title: Translation Commands
---

Translation commands operate on one locale and one term key at a time.

## `translation use`

```bash
traduora translation use <locale_code>
```

Stores default locale in state file.

## `translation add`

```bash
traduora translation add --term <key> --value <text> [--locale <code>] [--label <label[,label...]>]
```

Upserts translation value for given term and locale.

## `translation list`

```bash
traduora translation list [--locale <code>]
```

Lists translations and resolves term IDs back to term keys.

## `translation update`

```bash
traduora translation update --term <key> --value <text> [--locale <code>] [--label <label[,label...]>]
```

Updates translation value and optional labels.

## `translation delete`

```bash
traduora translation delete --term <key> [--locale <code>]
```

Clears translation value for the term in that locale.

## Parameters and behavior

- Project is always resolved from current state (`currentProjectId`).
- `--locale`: optional if current locale is set.
- `--term`: required, uses human-readable key.
- `--value`: required for add/update.
- `--label`: translation labels; missing labels are auto-created.

## Example

```bash
traduora translation use en_GB
traduora translation add --term form.email.required --value "E-mail input is required" --label validation
traduora translation update --term form.email.required --value "E-mail is required"
```
