---
id: project
title: Project Commands
---

Project commands manage Traduora projects and default project context.

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
traduora project update <id> [--name <name>] [--description <text>] [--label <label[,label...]>]
```

Updates project fields and optionally ensures labels exist.

## `project remove`

```bash
traduora project remove <id>
```

Deletes a project.

## `project status`

```bash
traduora project status [id]
```

Returns project stats. Uses current project if `id` is omitted.

## `project use`

```bash
traduora project use <id>
```

Sets default project ID in state file.

## Parameters and behavior

- `--label` accepts comma-separated values and can be repeated.
- Missing labels are auto-created by the CLI.
- For commands that need project ID, priority is:
  1. Explicit `--project` or argument ID
  2. `currentProjectId` in state file
