---
id: project
title: Project Command
---

Project command now only provides project status.

## `project status`

```bash
traduora project status [--format <table|json>]
```

Returns project stats for the current project.
Default output is `table`; use `--format json` for machine-readable output.

## Behavior

- Project ID is read from state (`currentProjectId`).
- No project ID argument is accepted.
- If no project is set, run `traduora init` first.
