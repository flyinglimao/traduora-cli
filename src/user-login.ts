import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { TraduoraApi } from "./api.js";
import { requestAccessToken } from "./auth.js";
import { TraduoraClient } from "./client.js";
import { askSecret, askText } from "./prompts.js";

export const DEFAULT_USER_LOGIN_PATH = ".traduora.user.json";

interface StoredUserLogin {
  baseUrl: string;
  username: string;
  password: string;
}

export interface UserLoginOptions {
  baseUrl: string;
  username?: string;
  password?: string;
  persistent?: boolean;
  credentialsPath?: string;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureGitignoreContains(entry: string, cwd = process.cwd()): Promise<void> {
  const gitignorePath = path.resolve(cwd, ".gitignore");
  const exists = await fileExists(gitignorePath);
  const normalizedEntry = entry.replace(/\\/g, "/");

  if (!exists) {
    await writeFile(gitignorePath, `${normalizedEntry}\n`, "utf8");
    return;
  }

  const current = await readFile(gitignorePath, "utf8");
  const lines = current.split(/\r?\n/).map((line) => line.trim());
  if (lines.includes(normalizedEntry)) {
    return;
  }

  const suffix = current.endsWith("\n") ? "" : "\n";
  await writeFile(gitignorePath, `${current}${suffix}${normalizedEntry}\n`, "utf8");
}

async function readStoredCredentials(credentialsPath: string): Promise<StoredUserLogin | undefined> {
  if (!(await fileExists(credentialsPath))) {
    return undefined;
  }

  const content = await readFile(credentialsPath, "utf8");
  const parsed = JSON.parse(content) as Partial<StoredUserLogin>;
  if (!parsed.username || !parsed.password) {
    return undefined;
  }

  return {
    baseUrl: parsed.baseUrl ?? "",
    username: parsed.username,
    password: parsed.password,
  };
}

async function writeStoredCredentials(
  credentialsPath: string,
  credentials: StoredUserLogin
): Promise<void> {
  await writeFile(credentialsPath, `${JSON.stringify(credentials, null, 2)}\n`, "utf8");
}

export async function resolveUserLogin(
  options: UserLoginOptions
): Promise<{ username: string; password: string; credentialsPath: string; fromStore: boolean }> {
  const credentialsPath = path.resolve(options.credentialsPath ?? DEFAULT_USER_LOGIN_PATH);
  const stored = await readStoredCredentials(credentialsPath);

  const username =
    options.username ??
    (stored?.baseUrl === options.baseUrl ? stored.username : undefined) ??
    (await askText("Account email"));

  const password =
    options.password ??
    (stored?.baseUrl === options.baseUrl ? stored.password : undefined) ??
    (await askSecret("Account password"));

  if (options.persistent) {
    await writeStoredCredentials(credentialsPath, {
      baseUrl: options.baseUrl,
      username,
      password,
    });
    await ensureGitignoreContains(path.relative(process.cwd(), credentialsPath) || credentialsPath);
  }

  return {
    username,
    password,
    credentialsPath,
    fromStore: Boolean(
      !options.username &&
        !options.password &&
        stored &&
        stored.baseUrl === options.baseUrl &&
        stored.username === username &&
        stored.password === password
    ),
  };
}

export async function createUserApi(options: UserLoginOptions): Promise<TraduoraApi> {
  const login = await resolveUserLogin(options);
  const token = await requestAccessToken({
    baseUrl: options.baseUrl,
    auth: {
      grantType: "password",
      username: login.username,
      password: login.password,
    },
  });

  const client = new TraduoraClient({
    baseUrl: options.baseUrl,
    accessToken: token.accessToken,
  });

  return new TraduoraApi(client);
}
