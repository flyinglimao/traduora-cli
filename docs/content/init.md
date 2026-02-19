---
id: init
title: Init Command
---

`traduora init` sets up credentials interactively.

## Purpose

- Validate your credentials before saving.
- Generate config file for future commands.
- Set default project in state file.

## Command

```bash
traduora init [--url <url>] [--role <admin|editor|viewer>] [--config <path>] [--state <path>]
```

## Modes

### Mode A: Input API credentials

You provide client credentials directly:

- `clientId`
- `clientSecret`

The command validates them via token request, then asks for `projectId`.

- Prompt includes hint: find ID from web URL  
  `https://<domain>/projects/<id>/translations`
- The entered `projectId` is saved as default project in state.

### Mode B: Login account and auto-create project client

You provide account email/password:

1. CLI asks account email/password (password input is hidden).
2. CLI requests user token (`grant_type=password`).
3. CLI fetches project list.
4. CLI asks which project to use (interactive picker, arrow keys).
5. CLI creates project client with role (`editor` by default).
6. CLI validates generated client credentials.
7. CLI writes config.
8. CLI writes selected project as default project in state.

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
