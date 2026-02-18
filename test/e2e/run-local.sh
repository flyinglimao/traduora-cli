#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/test/docker-compose.yml"

cleanup() {
  docker compose -f "$COMPOSE_FILE" down -v >/dev/null 2>&1 || true
}
trap cleanup EXIT

cd "$ROOT_DIR"

if command -v pnpm >/dev/null 2>&1; then
  PNPM_CMD=(pnpm)
else
  PNPM_CMD=(corepack pnpm)
fi

echo "[e2e] Building CLI + SDK"
"${PNPM_CMD[@]}" build >/dev/null

echo "[e2e] Starting docker compose test environment"
docker compose -f "$COMPOSE_FILE" up -d

echo "[e2e] Running integration script"
node "$ROOT_DIR/test/e2e/run-traduora-e2e.mjs"

echo "[e2e] Finished successfully"
