---
id: sdk
title: JavaScript SDK
---

Use `traduora-cli-next` directly in Node.js scripts when CLI alone is not enough.

## Quick start

### ESM

```js
import { createApi } from "traduora-cli-next";

const { api } = await createApi({
  overrides: {
    baseUrl: "https://app.traduora.co",
    auth: {
      grantType: "client_credentials",
      clientId: process.env.TRADUORA_CLIENT_ID,
      clientSecret: process.env.TRADUORA_CLIENT_SECRET,
    },
  },
});

const projects = await api.listProjects();
console.log(projects);
```

### CommonJS

```js
const { createApi } = require("traduora-cli-next");

(async () => {
  const { api } = await createApi();
  const projects = await api.listProjects();
  console.log(projects);
})();
```

## `createApi` return value

`createApi(options)` returns:

- `config`: resolved runtime config.
- `client`: low-level authenticated HTTP client (`TraduoraClient`).
- `api`: high-level wrapper (`TraduoraApi`).

## API reference (`TraduoraApi`)

Source of truth: `/Users/flyinglimao/Code/traduora-cli/src/api.ts`

### Project methods

- `listProjects(): Promise<ProjectDTO[]>`
- `getProject(projectId: string): Promise<ProjectDTO>`
- `createProject(input: { name: string; description?: string }): Promise<ProjectDTO>`
- `updateProject(projectId: string, input: { name?: string; description?: string }): Promise<ProjectDTO>`
- `deleteProject(projectId: string): Promise<void>`
- `getProjectStatus(projectId: string): Promise<ProjectStatusDTO>`

### Term methods

- `listTerms(projectId: string): Promise<ProjectTermDTO[]>`
- `addTerm(projectId: string, value: string): Promise<ProjectTermDTO>`
- `updateTerm(projectId: string, termId: string, value: string): Promise<ProjectTermDTO>`
- `deleteTerm(projectId: string, termId: string): Promise<void>`

### Locale and translation methods

- `listProjectLocales(projectId: string): Promise<ProjectLocaleDTO[]>`
- `addProjectLocale(projectId: string, localeCode: string): Promise<ProjectLocaleDTO>`
- `listTranslations(projectId: string, localeCode: string): Promise<TermTranslationDTO[]>`
- `updateTranslation(projectId: string, localeCode: string, termId: string, value: string): Promise<TermTranslationDTO>`
- `deleteLocale(projectId: string, localeCode: string): Promise<void>`
- `listLocales(): Promise<LocaleDTO[]>`

### Label methods

- `listLabels(projectId: string): Promise<ProjectLabelDTO[]>`
- `createLabel(projectId: string, value: string, color?: string): Promise<ProjectLabelDTO>`
- `ensureLabels(projectId: string, values: string[]): Promise<ProjectLabelDTO[]>`
- `setTermLabels(projectId: string, termId: string, currentLabelValues: string[], targetLabelValues: string[]): Promise<void>`
- `setTranslationLabels(projectId: string, localeCode: string, termId: string, currentLabelValues: string[], targetLabelValues: string[]): Promise<void>`

### Project client and export methods

- `createProjectClient(projectId: string, input: { name: string; role: "admin" | "editor" | "viewer" }): Promise<ProjectClientWithSecretDTO>`
- `exportProject(projectId: string, localeCode: string, format: ExportFormat): Promise<Buffer>`

## Important: term key vs term ID

SDK methods for translation currently require `termId` (UUID), not term key.

If your app uses readable keys (recommended), map key to ID first:

```js
const terms = await api.listTerms(projectId);
const term = terms.find((t) => t.value === "form.email.required");
if (!term) throw new Error("term not found");

await api.updateTranslation(projectId, "en_GB", term.id, "E-mail input is required");
```

## Low-level client (`TraduoraClient`)

Use this only when you intentionally need raw HTTP behavior.

- `getToken(): Promise<{ accessToken; expiresAtEpochMs; tokenType }>`
- `request<T>(method: string, path: string, options?): Promise<T>`
- `requestBuffer(method: string, path: string, options?): Promise<Buffer>`

## Main exports

- `createApi`
- `TraduoraApi`
- `TraduoraClient`
- `requestAccessToken`
- `resolveConfig`
- `runInit`
- `loadState` / `saveState` / `updateState`
- TypeScript types
