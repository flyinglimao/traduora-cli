import { spawnSync } from "node:child_process";
import { mkdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");
const tmpDir = path.resolve(repoRoot, "test/tmp");
const configPath = path.resolve(tmpDir, "traduora.config.json");
const statePath = path.resolve(tmpDir, ".traduora.state.json");
const exportPath = path.resolve(tmpDir, "en_GB.json");
const baseUrl = "http://localhost:4100";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function runNodeCli(args, options = {}) {
  const result = spawnSync(
    "node",
    ["dist/index.js", "--config", configPath, "--state", statePath, ...args],
    {
    cwd: repoRoot,
    encoding: "utf8",
    input: options.input,
    env: {
      ...process.env,
      TRADUORA_BASE_URL: baseUrl,
    },
  }
  );

  if (result.status !== 0) {
    throw new Error(
      `CLI failed: traduora ${args.join(" ")}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`
    );
  }

  return result.stdout.trim();
}

async function waitForApiReady(timeoutMs = 180000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/providers`);
      if (response.ok) {
        return;
      }
    } catch {
      // continue polling
    }

    await sleep(2000);
  }

  throw new Error("Timed out waiting for Traduora API to become ready.");
}

async function signupUser(email, password) {
  const response = await fetch(`${baseUrl}/api/v1/auth/signup`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      name: "CLI E2E User",
      email,
      password,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Signup failed (${response.status}): ${body}`);
  }
}

async function getPasswordGrantToken(email, password) {
  const response = await fetch(`${baseUrl}/api/v1/auth/token`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      grant_type: "password",
      username: email,
      password,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Password grant token failed (${response.status}): ${body}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function createProjectForUser(accessToken, name) {
  const response = await fetch(`${baseUrl}/api/v1/projects`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Create project failed (${response.status}): ${body}`);
  }
}

async function main() {
  await mkdir(tmpDir, { recursive: true });
  await rm(configPath, { force: true });
  await rm(statePath, { force: true });
  await rm(exportPath, { force: true });

  console.log("[e2e] Waiting for Traduora API...");
  await waitForApiReady();

  const stamp = Date.now();
  const email = `e2e_${stamp}@example.com`;
  const password = "Passw0rd!123";

  console.log(`[e2e] Signing up user: ${email}`);
  await signupUser(email, password);
  const userAccessToken = await getPasswordGrantToken(email, password);
  await createProjectForUser(userAccessToken, `e2e-project-${stamp}`);

  // init mode 2 interactive flow (login + create project client)
  const initInput = [
    baseUrl, // URL prompt
    "2", // mode: login and create client
    email,
    password,
    "1", // pick first project from select prompt
    "", // use default generated client name
  ].join("\n");

  console.log("[e2e] Running interactive init...");
  runNodeCli(["init"], { input: initInput });

  const configRaw = await readFile(configPath, "utf8");
  const config = JSON.parse(configRaw);
  const stateRaw = await readFile(statePath, "utf8");
  const state = JSON.parse(stateRaw);

  assert(config?.auth?.grantType === "client_credentials", "init did not save client_credentials config");
  assert(typeof state?.currentProjectId === "string", "init did not set currentProjectId");

  const projectId = state.currentProjectId;

  console.log("[e2e] Running CLI commands...");
  runNodeCli(["project", "status"]);

  const termKey = `e2e.message.${stamp}`;
  runNodeCli(["term", "add", termKey, "--label", "smoke"]);
  const termListTableOutput = runNodeCli(["term", "list"]);
  assert(
    /value\s+\|\s+context\s+\|\s+label/.test(termListTableOutput),
    "term list default output is not table format"
  );
  assert(termListTableOutput.includes(termKey), "term list table output does not include created term");
  const termListJsonOutput = runNodeCli(["term", "list", "--format", "json"]);
  assert(termListJsonOutput.includes('"terms"'), "term list --format json output is invalid");

  runNodeCli(["translation", "use", "en_GB"]);

  const message = "Hello from CLI E2E";
  runNodeCli([
    "translation",
    "add",
    "--term",
    termKey,
    "--value",
    message,
    "--label",
    "smoke",
  ]);

  const listOutput = runNodeCli(["translation", "list"]);
  assert(listOutput.includes(termKey), "translation list does not include created term key");

  runNodeCli([
    "export",
    "--format",
    "jsonnested",
    "--output",
    exportPath,
  ]);

  const exportStats = await stat(exportPath);
  assert(exportStats.size > 0, "export file is empty");

  console.log("[e2e] Running SDK checks...");
  const lib = await import(pathToFileURL(path.resolve(repoRoot, "dist/lib.js")).href);
  const { createApi } = lib;
  const { api } = await createApi({ configPath });

  const terms = await api.listTerms(projectId);
  const term = terms.find((item) => item.value === termKey);
  assert(term, "SDK cannot find term created by CLI");

  const translations = await api.listTranslations(projectId, "en_GB");
  const translation = translations.find((item) => item.termId === term.id);
  assert(translation?.value === message, "SDK translation value mismatch");

  const sdkExport = await api.exportProject(projectId, "en_GB", "jsonnested");
  assert(Buffer.isBuffer(sdkExport) && sdkExport.byteLength > 0, "SDK export buffer is empty");

  console.log("[e2e] ✅ CLI + SDK integration test passed");
}

main().catch((error) => {
  console.error("[e2e] ❌", error.message);
  process.exit(1);
});
