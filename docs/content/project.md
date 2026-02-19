---
id: project
title: Project Command
---

Project command now only provides project status.

## `project status`

```bash
traduora project status
```

Returns project stats for the current project.

## Behavior

- Project ID is read from state (`currentProjectId`).
- No project ID argument is accepted.
- If no project is set, run `traduora init` first.
