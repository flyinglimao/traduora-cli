import { config as loadDotenv } from "dotenv";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import {
  type AuthConfig,
  type GrantType,
  type ResolvedConfig,
  type UserConfigFactory,
  type UserConfigInput,
} from "./types.js";
import { loadRuntimeModule } from "./module-loader.js";

const DEFAULT_BASE_URL = "https://app.traduora.co";
export const DEFAULT_CONFIG_CANDIDATES = [
  "traduora.config.json",
  "traduora.config.ts",
  "traduora.config.js",
  "traduora.config.mjs",
  "traduora.config.cjs",
];
export const DEFAULT_WRITABLE_CONFIG_PATH = "traduora.config.json";

export interface ResolveConfigOptions {
  configPath?: string;
  cwd?: string;
  overrides?: Partial<ResolvedConfig>;
}

function toGrantType(value?: string): GrantType | undefined {
  if (value === "client_credentials" || value === "password") {
    return value;
  }

  return undefined;
}

export function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

function normalizeAuth(raw: UserConfigInput): AuthConfig | undefined {
  const authRaw = raw.auth;
  const explicitGrantType =
    toGrantType(authRaw?.grantType) ??
    toGrantType(authRaw?.grant_type) ??
    toGrantType(raw.grantType) ??
    toGrantType(raw.grant_type);

  const clientId = authRaw?.clientId ?? authRaw?.client_id ?? raw.clientId ?? raw.client_id;
  const clientSecret =
    authRaw?.clientSecret ?? authRaw?.client_secret ?? raw.clientSecret ?? raw.client_secret;
  const username = authRaw?.username ?? raw.username;
  const password = authRaw?.password ?? raw.password;

  const implicitGrantType: GrantType | undefined =
    clientId || clientSecret
      ? "client_credentials"
      : username || password
        ? "password"
        : undefined;

  const candidate: AuthConfig = {
    grantType: explicitGrantType ?? implicitGrantType ?? "client_credentials",
    clientId,
    clientSecret,
    username,
    password,
  };

  if (!candidate.clientId && !candidate.clientSecret && !candidate.username && !candidate.password) {
    return undefined;
  }

  return candidate;
}

function normalizeConfig(raw: UserConfigInput): Partial<ResolvedConfig> {
  const auth = normalizeAuth(raw);
  const baseUrl = raw.baseUrl?.trim();

  return {
    baseUrl: baseUrl && baseUrl.length > 0 ? normalizeBaseUrl(baseUrl) : undefined,
    accessToken: raw.accessToken,
    defaultHeaders: raw.defaultHeaders,
    auth,
  };
}

function fromEnv(env: NodeJS.ProcessEnv): Partial<ResolvedConfig> {
  const explicitGrantType = toGrantType(env.TRADUORA_GRANT_TYPE);
  const implicitGrantType: GrantType | undefined =
    env.TRADUORA_CLIENT_ID || env.TRADUORA_CLIENT_SECRET
      ? "client_credentials"
      : env.TRADUORA_USERNAME || env.TRADUORA_PASSWORD
        ? "password"
        : undefined;
  const grantType = explicitGrantType ?? implicitGrantType ?? "client_credentials";
  const auth: AuthConfig | undefined =
    env.TRADUORA_CLIENT_ID ||
      env.TRADUORA_CLIENT_SECRET ||
      env.TRADUORA_USERNAME ||
      env.TRADUORA_PASSWORD
      ? {
        grantType: grantType ?? "client_credentials",
        clientId: env.TRADUORA_CLIENT_ID,
        clientSecret: env.TRADUORA_CLIENT_SECRET,
        username: env.TRADUORA_USERNAME,
        password: env.TRADUORA_PASSWORD,
      }
      : undefined;

  return {
    baseUrl: env.TRADUORA_BASE_URL ? normalizeBaseUrl(env.TRADUORA_BASE_URL) : undefined,
    accessToken: env.TRADUORA_ACCESS_TOKEN,
    auth,
  };
}

function mergeConfig(
  base: Partial<ResolvedConfig>,
  override: Partial<ResolvedConfig>
): Partial<ResolvedConfig> {
  const mergedAuth =
    base.auth || override.auth
      ? {
        grantType: "client_credentials" as const,
        ...(base.auth ?? {}),
        ...(override.auth ?? {}),
      }
      : undefined;

  return {
    ...base,
    ...override,
    auth: mergedAuth,
    defaultHeaders: {
      ...(base.defaultHeaders ?? {}),
      ...(override.defaultHeaders ?? {}),
    },
  };
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findConfigPath(cwd: string): Promise<string | undefined> {
  for (const candidate of DEFAULT_CONFIG_CANDIDATES) {
    const fullPath = path.resolve(cwd, candidate);
    if (await fileExists(fullPath)) {
      return fullPath;
    }
  }

  return undefined;
}

async function readUserConfig(configPath: string, cwd: string): Promise<UserConfigInput> {
  const ext = path.extname(configPath).toLowerCase();
  if (ext === ".json") {
    const content = await readFile(configPath, "utf8");
    return JSON.parse(content) as UserConfigInput;
  }

  const mod = await loadRuntimeModule(configPath);
  const configExport = (mod as { default?: unknown }).default ?? mod;

  if (typeof configExport === "function") {
    return (await (configExport as UserConfigFactory)({ env: process.env, cwd })) as UserConfigInput;
  }

  if (typeof configExport !== "object" || configExport === null) {
    throw new Error(`Config file must export an object or function: ${configPath}`);
  }

  return configExport as UserConfigInput;
}

function ensureValidConfig(config: ResolvedConfig): void {
  if (config.accessToken) {
    return;
  }

  if (!config.auth) {
    throw new Error(
      "Missing auth config. Provide client credentials/password in config file or env vars."
    );
  }

  if (config.auth.grantType === "client_credentials") {
    if (!config.auth.clientId || !config.auth.clientSecret) {
      throw new Error(
        "client_credentials mode requires clientId and clientSecret (or TRADUORA_CLIENT_ID / TRADUORA_CLIENT_SECRET)."
      );
    }
    return;
  }

  if (!config.auth.username || !config.auth.password) {
    throw new Error(
      "password mode requires username and password (or TRADUORA_USERNAME / TRADUORA_PASSWORD)."
    );
  }
}

export async function resolveConfig(options: ResolveConfigOptions = {}): Promise<ResolvedConfig> {
  loadDotenv({ quiet: true });

  const cwd = options.cwd ?? process.cwd();
  const discoveredPath = options.configPath
    ? path.resolve(cwd, options.configPath)
    : await findConfigPath(cwd);

  const envConfig = fromEnv(process.env);
  const fileConfig = discoveredPath
    ? normalizeConfig(await readUserConfig(discoveredPath, cwd))
    : ({} as Partial<ResolvedConfig>);
  const overrideConfig = options.overrides ?? {};

  const merged = mergeConfig(mergeConfig(envConfig, fileConfig), overrideConfig);

  const resolved: ResolvedConfig = {
    baseUrl: normalizeBaseUrl(merged.baseUrl ?? DEFAULT_BASE_URL),
    accessToken: merged.accessToken,
    auth: merged.auth,
    defaultHeaders: merged.defaultHeaders,
  };

  ensureValidConfig(resolved);
  return resolved;
}
