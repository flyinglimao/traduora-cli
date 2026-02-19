---
id: term
title: Term Commands
---

Term commands use **term key** (`term.value`) as the public identifier.

## `term add`

```bash
traduora term add <value> [--label <label[,label...]>] [--format <table|json>]
```

Creates a term key in the current project.

## `term list`

```bash
traduora term list [--format <table|json>]
```

Lists all terms in the current project.
Default output is `table` with `value`, `context`, and `label` columns.
Use `--format json` for scripts.

## `term update`

```bash
traduora term update <value> --new-value <value> [--label <label[,label...]>] [--format <table|json>]
```

Finds term by current key, then updates key value.

## `term delete`

```bash
traduora term delete <value> [--format <table|json>]
```

Finds term by key and deletes it.

## Parameters and behavior

- Project is always resolved from current state (`currentProjectId`).
- `--label` updates labels attached to the term.
- `--format`: `table` by default, `json` for machine-readable output.
- Internally, CLI maps `value -> termId` before calling term APIs.

## Example

```bash
traduora term list
traduora term list --format json
traduora term add form.email.required --label form,validation
traduora term update form.email.required --new-value form.email.missing --label validation
```
