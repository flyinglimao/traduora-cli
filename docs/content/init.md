---
id: init
title: Init Command
---

`traduora init` sets up credentials interactively.

## Purpose

- Validate your credentials before saving.
- Generate config file for future commands.
- Optionally set default project in state file.

## Command

```bash
traduora init [--url <url>] [--role <admin|editor|viewer>] [--config <path>] [--state <path>]
```

## Modes

### Mode A: Input API credentials

You provide client credentials directly:

- `clientId`
- `clientSecret`

The command validates them via token request, then writes config.

### Mode B: Login account and auto-create project client

You provide account email/password:

1. CLI requests user token (`grant_type=password`).
2. CLI asks which project to use (interactive project picker, arrow keys).
3. CLI creates project client with role (`editor` by default).
4. CLI validates generated client credentials.
5. CLI writes config.
6. CLI asks for default project in state via project picker (last option is `Skip`).

## Default project setup prompt

After config is saved, `init` asks for default project setup.

- Project selection is interactive (arrow keys + Enter).
- The last option is `Skip`.
- Password input is hidden in interactive login prompts.
- If you select a project, it is written to state (`.traduora.state.json` by default).

## Parameters

| Option | Description | Default |
|---|---|---|
| `--url` | Traduora base URL | asked interactively |
| `--role` | role for auto-created project client | `editor` |
| `--config` | config output path (JSON only) | `traduora.config.json` |
| `--state` | state file output path | `.traduora.state.json` |

## Typical usage

```bash
traduora init --url https://app.traduora.co --role editor
```
