import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CliState } from "./types.js";

export const DEFAULT_STATE_PATH = ".traduora.state.json";

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function loadState(statePath = DEFAULT_STATE_PATH): Promise<CliState> {
  const absPath = path.resolve(statePath);
  if (!(await fileExists(absPath))) {
    return {};
  }

  const content = await readFile(absPath, "utf8");
  const parsed = JSON.parse(content) as CliState;
  return {
    currentProjectId: parsed.currentProjectId,
    currentLocale: parsed.currentLocale,
  };
}

export async function saveState(nextState: CliState, statePath = DEFAULT_STATE_PATH): Promise<void> {
  const absPath = path.resolve(statePath);
  await mkdir(path.dirname(absPath), { recursive: true });
  await writeFile(absPath, `${JSON.stringify(nextState, null, 2)}\n`, "utf8");
}

export async function updateState(
  updater: (current: CliState) => CliState,
  statePath = DEFAULT_STATE_PATH
): Promise<CliState> {
  const current = await loadState(statePath);
  const next = updater(current);
  await saveState(next, statePath);
  return next;
}
