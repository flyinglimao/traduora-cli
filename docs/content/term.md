---
id: term
title: Term Commands
---

Term commands use **term key** (`term.value`) as the public identifier.

## `term add`

```bash
traduora term add <value> [--project <id>] [--label <label[,label...]>]
```

Creates a term key in the target project.

## `term list`

```bash
traduora term list [--project <id>]
```

Lists all terms in the target project.

## `term update`

```bash
traduora term update <value> --new-value <value> [--project <id>] [--label <label[,label...]>]
```

Finds term by current key, then updates key value.

## `term delete`

```bash
traduora term delete <value> [--project <id>]
```

Finds term by key and deletes it.

## Parameters and behavior

- `--project` is optional if default project is set.
- `--label` updates labels attached to the term.
- Internally, CLI maps `value -> termId` before calling term APIs.

## Example

```bash
traduora term add form.email.required --label form,validation
traduora term update form.email.required --new-value form.email.missing --label validation
```
