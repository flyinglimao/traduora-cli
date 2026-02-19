import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { requestAccessToken } from "./auth.js";
import { TraduoraApi } from "./api.js";
import { TraduoraClient } from "./client.js";
import { DEFAULT_WRITABLE_CONFIG_PATH, normalizeBaseUrl } from "./config.js";
import { askChoice, askSecret, askSelect, askText } from "./prompts.js";
import { updateState } from "./state.js";
import type { PersistedConfig, ProjectRole } from "./types.js";

export interface InitOptions {
  url?: string;
  role: ProjectRole;
  configPath?: string;
  statePath?: string;
}

async function writeConfigFile(configPath: string, config: PersistedConfig): Promise<string> {
  const absPath = path.resolve(configPath);
  if (path.extname(absPath).toLowerCase() !== ".json") {
    throw new Error("init only writes JSON config. Use --config traduora.config.json.");
  }

  await mkdir(path.dirname(absPath), { recursive: true });
  await writeFile(absPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  return absPath;
}

async function initWithCredentials(baseUrl: string, configPath: string): Promise<string> {
  const clientId = await askText("TRADUORA client id");
  const clientSecret = await askText("TRADUORA client secret");

  await requestAccessToken({
    baseUrl,
    auth: {
      grantType: "client_credentials",
      clientId,
      clientSecret,
    },
  });

  const config: PersistedConfig = {
    baseUrl,
    auth: {
      grantType: "client_credentials",
      clientId,
      clientSecret,
    },
  };

  return writeConfigFile(configPath, config);
}

async function initWithLogin(
  baseUrl: string,
  configPath: string,
  role: ProjectRole,
  statePath?: string
): Promise<{ savedPath: string; projectId: string; defaultProjectId?: string }> {
  const username = await askText("Account email");
  const password = await askSecret("Account password");

  const userToken = await requestAccessToken({
    baseUrl,
    auth: {
      grantType: "password",
      username,
      password,
    },
  });

  const userClient = new TraduoraClient({
    baseUrl,
    accessToken: userToken.accessToken,
  });
  const userApi = new TraduoraApi(userClient);

  let projects = await userApi.listProjects();
  if (projects.length === 0) {
    const name = await askText("No project found. Create project name");
    const description = await askText("Project description", { allowEmpty: true });
    const created = await userApi.createProject({
      name,
      description: description || undefined,
    });
    projects = [created];
  }

  console.log("Available projects:");
  for (const project of projects) {
    console.log(`  ${project.id}  ${project.name}`);
  }

  const projectId = await askSelect(
    "Select project for generated project client",
    projects.map((project) => ({
      value: project.id,
      label: `${project.name} (${project.id})`,
    })),
    projects[0]?.id
  );

  const clientName = await askText("Name for generated project client", {
    defaultValue: `traduora-cli-${os.hostname()}`,
  });

  const createdClient = await userApi.createProjectClient(projectId, {
    name: clientName,
    role,
  });

  await requestAccessToken({
    baseUrl,
    auth: {
      grantType: "client_credentials",
      clientId: createdClient.id,
      clientSecret: createdClient.secret,
    },
  });

  const config: PersistedConfig = {
    baseUrl,
    auth: {
      grantType: "client_credentials",
      clientId: createdClient.id,
      clientSecret: createdClient.secret,
    },
  };

  const savedPath = await writeConfigFile(configPath, config);
  let defaultProjectId: string | undefined;

  const defaultProjectSelection = await askSelect(
    "Select default project for CLI state",
    [
      ...projects.map((project) => ({
        value: project.id,
        label: `${project.name} (${project.id})`,
      })),
      { value: "__skip__", label: "Skip" },
    ],
    projectId
  );

  if (defaultProjectSelection !== "__skip__") {
    await updateState(
      (current) => ({
        ...current,
        currentProjectId: defaultProjectSelection,
      }),
      statePath
    );
    defaultProjectId = defaultProjectSelection;
  }

  return {
    savedPath,
    projectId,
    defaultProjectId,
  };
}

async function pickProjectViaAccountLogin(baseUrl: string): Promise<string | undefined> {
  const username = await askText("Account email");
  const password = await askSecret("Account password");
  const userToken = await requestAccessToken({
    baseUrl,
    auth: {
      grantType: "password",
      username,
      password,
    },
  });

  const userClient = new TraduoraClient({
    baseUrl,
    accessToken: userToken.accessToken,
  });
  const userApi = new TraduoraApi(userClient);
  const projects = await userApi.listProjects();
  if (projects.length === 0) {
    throw new Error("No project found in this account.");
  }

  console.log("Available projects:");
  for (const project of projects) {
    console.log(`  ${project.id}  ${project.name}`);
  }

  const projectSelection = await askSelect(
    "Select default project for CLI state",
    [
      ...projects.map((project) => ({
        value: project.id,
        label: `${project.name} (${project.id})`,
      })),
      { value: "__skip__", label: "Skip" },
    ],
    projects[0]?.id
  );

  if (projectSelection === "__skip__") {
    return undefined;
  }

  return projectSelection;
}

export async function runInit(options: InitOptions): Promise<void> {
  const configPath = options.configPath ?? DEFAULT_WRITABLE_CONFIG_PATH;
  const rawUrl = options.url ?? (await askText("Traduora URL", { defaultValue: "https://app.traduora.co" }));
  const baseUrl = normalizeBaseUrl(rawUrl);

  const mode = await askChoice(
    "Setup mode",
    [
      { key: "1", label: "Input API credentials (client_credentials)" },
      { key: "2", label: "Login account and auto-generate project client" },
    ],
    "1"
  );

  if (mode === "1") {
    const savedPath = await initWithCredentials(baseUrl, configPath);
    console.log(`Config saved: ${savedPath}`);
    const shouldLoginForDefaultProject = await askChoice(
      "Default project setup",
      [
        { key: "1", label: "Login and select default project" },
        { key: "2", label: "Skip for now" },
      ],
      "2"
    );

    if (shouldLoginForDefaultProject === "1") {
      const projectId = await pickProjectViaAccountLogin(baseUrl);
      if (projectId) {
        await updateState(
          (current) => ({
            ...current,
            currentProjectId: projectId,
          }),
          options.statePath
        );
        console.log(`Default project set: ${projectId}`);
      } else {
        console.log("Default project: skipped");
      }
    }
    return;
  }

  const result = await initWithLogin(baseUrl, configPath, options.role, options.statePath);
  console.log(`Config saved: ${result.savedPath}`);
  console.log(`Project selected for generated client: ${result.projectId}`);
  if (result.defaultProjectId) {
    console.log(`Default project set: ${result.defaultProjectId}`);
  } else {
    console.log("Default project: skipped");
  }
}
