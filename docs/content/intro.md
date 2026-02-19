---
id: intro
title: Getting Started
slug: /
---

# Traduora CLI Next

`@0xlimao/traduora-cli` is a practical command-line tool and JS SDK for operating Traduora projects.

## What this tool is for

- Check Traduora project status from terminal scripts and CI pipelines.
- Manage terms and translations by **term key** (`term.value`) instead of UUID.
- Export locale files in multiple formats.
- Integrate with Node.js automation through ESM and CommonJS SDK APIs.

## Core concepts

### 1) Config source priority

Configuration is loaded in this order:

1. Environment variables
2. Config file (`traduora.config.json` / `traduora.config.ts` / `traduora.config.js`)
3. CLI overrides (`--base-url`, `--token`, etc.)

### 2) State file

`init` and `translation use` write defaults into `.traduora.state.json`.

- `currentProjectId`: default project for commands that need a project.
- `currentLocale`: default locale for translation and export commands.

### 3) Term key mapping (important)

You work with human-readable term keys (like `form.email.required`).

The CLI automatically resolves the key to term UUID internally by calling term APIs.

## Quick start

### Step 1: Initialize credentials

```bash
traduora init
```

### Step 2: Select default project and locale

```bash
traduora project status
traduora translation use en_GB
```

### Step 3: Manage terms and translations

```bash
traduora term add form.email.required
traduora translation add --term form.email.required --value "E-mail input is required"
```

### Step 4: Export translations

```bash
traduora export --format jsonnested --output ./i18n/en_GB.json
```

## Next pages

- [Configuration and State](./configuration-and-state)
- [Init Command](./init)
- [Project Commands](./project)
- [Term Commands](./term)
- [Translation Commands](./translation)
- [Export Command](./export)
- [JavaScript SDK](./sdk)
