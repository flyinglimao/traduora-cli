# Integration Tests (Docker)

This folder contains a local end-to-end test environment for the CLI and JavaScript SDK.

## What It Tests

The test boots a real Traduora server and validates:

- Interactive `init` flow (`login -> create project client`)
- CLI commands:
  - `project status`
  - `term add`
  - `translation use`
  - `translation add`
  - `translation list`
  - `export`
- SDK methods:
  - `listTerms`
  - `listTranslations`
  - `exportProject`

## Prerequisites

- Docker + Docker Compose
- Node.js 22+ (recommended: Node 22 via `nvm`)
- `pnpm` (or `corepack pnpm`)

## Quick Start

From repository root:

```bash
pnpm test:e2e:local
```

If `pnpm` is not globally installed:

```bash
corepack pnpm test:e2e:local
```

The script will:

1. Build CLI + SDK
2. Start Docker services from `test/docker-compose.yml`
3. Run `test/e2e/run-traduora-e2e.mjs`
4. Automatically stop and remove containers/volumes

## Run Manually

Start services:

```bash
docker compose -f test/docker-compose.yml up -d
```

Run the integration script:

```bash
node test/e2e/run-traduora-e2e.mjs
```

Stop services:

```bash
docker compose -f test/docker-compose.yml down -v
```

## Test Artifacts

Temporary files are written to `test/tmp/` during execution (config, state, export output).  
They are intentionally ignored by Git via `test/tmp/.gitignore`.

## Troubleshooting

- `fetch failed` / cannot connect:
  - Ensure Docker is running.
  - Verify port `4100` is free.
- `pnpm: command not found`:
  - Use `corepack pnpm ...` or install `pnpm`.
- Apple Silicon warning (`linux/amd64` on `arm64`):
  - This is expected for current Traduora image; test can still run.
