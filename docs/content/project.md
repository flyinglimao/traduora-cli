---
id: project
title: Project Commands
---

Project commands manage Traduora projects and default project context.

## Authentication behavior

`project status` uses API client credentials from your config.

All other `project` commands use account login flow (`grant_type=password`):

- Interactive login (email/password prompt), or
- Non-interactive flags: `--user <email> --password <password>`
- Password input is hidden in interactive mode.

You can persist account credentials with:

```bash
traduora project list --persistent
```

When `--persistent` is used, credentials are stored in `.traduora.user.json` and the file is added to `.gitignore` automatically.

## `project add`

```bash
traduora project add <name> [--description <text>] [--label <label[,label...]>]
```

Creates a project, optionally ensures labels exist.

## `project list`

```bash
traduora project list
```

Lists accessible projects. The active project (from state) is marked.

## `project update`

```bash
traduora project update [id] [--name <name>] [--description <text>] [--label <label[,label...]>]
```

Updates project fields and optionally ensures labels exist.
If `id` is omitted, CLI opens an interactive project picker (arrow keys + Enter), with `Skip` as the last option.

## `project remove`

```bash
traduora project remove [id]
```

Deletes a project.
If `id` is omitted, CLI opens an interactive project picker (arrow keys + Enter), with `Skip` as the last option.

## `project status`

```bash
traduora project status [id]
```

Returns project stats. Uses current project if `id` is omitted.

## `project use`

```bash
traduora project use [id]
```

Sets default project ID in state file.
If `id` is omitted, CLI opens an interactive project picker (arrow keys + Enter), with `Skip` as the last option.

## Parameters and behavior

- `--label` accepts comma-separated values and can be repeated.
- Missing labels are auto-created by the CLI.
- `--persistent` stores account credentials in `.traduora.user.json`.
- `--user` and `--password` can skip interactive login prompts.
