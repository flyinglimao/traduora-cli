---
id: term
title: Term Commands
---

Term commands use **term key** (`term.value`) as the public identifier.

## `term add`

```bash
traduora term add <value> [--label <label[,label...]>]
```

Creates a term key in the current project.

## `term list`

```bash
traduora term list
```

Lists all terms in the current project.

## `term update`

```bash
traduora term update <value> --new-value <value> [--label <label[,label...]>]
```

Finds term by current key, then updates key value.

## `term delete`

```bash
traduora term delete <value>
```

Finds term by key and deletes it.

## Parameters and behavior

- Project is always resolved from current state (`currentProjectId`).
- `--label` updates labels attached to the term.
- Internally, CLI maps `value -> termId` before calling term APIs.

## Example

```bash
traduora term add form.email.required --label form,validation
traduora term update form.email.required --new-value form.email.missing --label validation
```
