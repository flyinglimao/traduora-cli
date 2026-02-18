import { TraduoraApi } from "./api.js";
import { TraduoraClient } from "./client.js";
import { resolveConfig, type ResolveConfigOptions } from "./config.js";
import type { ResolvedConfig } from "./types.js";

export { TraduoraApi } from "./api.js";
export { requestAccessToken } from "./auth.js";
export { TraduoraClient } from "./client.js";
export {
  DEFAULT_CONFIG_CANDIDATES,
  DEFAULT_WRITABLE_CONFIG_PATH,
  normalizeBaseUrl,
  resolveConfig,
  type ResolveConfigOptions,
} from "./config.js";
export { runInit, type InitOptions } from "./init.js";
export { DEFAULT_STATE_PATH, loadState, saveState, updateState } from "./state.js";
export type * from "./types.js";

export interface CreateApiResult {
  config: ResolvedConfig;
  client: TraduoraClient;
  api: TraduoraApi;
}

export async function createApi(options: ResolveConfigOptions = {}): Promise<CreateApiResult> {
  const config = await resolveConfig(options);
  const client = new TraduoraClient(config);
  const api = new TraduoraApi(client);

  return {
    config,
    client,
    api,
  };
}
