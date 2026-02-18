---
id: sdk
title: JavaScript SDK
---

當 CLI 無法涵蓋你的流程時，可直接使用 `traduora-cli-next` 的 SDK。

## 快速開始

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

## `createApi` 回傳內容

`createApi(options)` 會回傳：

- `config`：解析後的執行設定。
- `client`：低階認證 HTTP client（`TraduoraClient`）。
- `api`：高階封裝（`TraduoraApi`）。

## 完整自動生成 TypeScript Reference

若要查看完整符號級 API（class / interface / type alias / function），請看：

- [SDK TypeScript Reference](./sdk-reference)

此參考文件由 TypeDoc 從原始碼產生：

```bash
pnpm docs:api-reference
```

## API 參考（`TraduoraApi`）

實作來源：`/Users/flyinglimao/Code/traduora-cli/src/api.ts`

### 專案相關

- `listProjects(): Promise<ProjectDTO[]>`
- `getProject(projectId: string): Promise<ProjectDTO>`
- `createProject(input: { name: string; description?: string }): Promise<ProjectDTO>`
- `updateProject(projectId: string, input: { name?: string; description?: string }): Promise<ProjectDTO>`
- `deleteProject(projectId: string): Promise<void>`
- `getProjectStatus(projectId: string): Promise<ProjectStatusDTO>`

### 詞條（Term）相關

- `listTerms(projectId: string): Promise<ProjectTermDTO[]>`
- `addTerm(projectId: string, value: string): Promise<ProjectTermDTO>`
- `updateTerm(projectId: string, termId: string, value: string): Promise<ProjectTermDTO>`
- `deleteTerm(projectId: string, termId: string): Promise<void>`

### 語系與翻譯相關

- `listProjectLocales(projectId: string): Promise<ProjectLocaleDTO[]>`
- `addProjectLocale(projectId: string, localeCode: string): Promise<ProjectLocaleDTO>`
- `listTranslations(projectId: string, localeCode: string): Promise<TermTranslationDTO[]>`
- `updateTranslation(projectId: string, localeCode: string, termId: string, value: string): Promise<TermTranslationDTO>`
- `deleteLocale(projectId: string, localeCode: string): Promise<void>`
- `listLocales(): Promise<LocaleDTO[]>`

### Label 相關

- `listLabels(projectId: string): Promise<ProjectLabelDTO[]>`
- `createLabel(projectId: string, value: string, color?: string): Promise<ProjectLabelDTO>`
- `ensureLabels(projectId: string, values: string[]): Promise<ProjectLabelDTO[]>`
- `setTermLabels(projectId: string, termId: string, currentLabelValues: string[], targetLabelValues: string[]): Promise<void>`
- `setTranslationLabels(projectId: string, localeCode: string, termId: string, currentLabelValues: string[], targetLabelValues: string[]): Promise<void>`

### Project client 與匯出

- `createProjectClient(projectId: string, input: { name: string; role: "admin" | "editor" | "viewer" }): Promise<ProjectClientWithSecretDTO>`
- `exportProject(projectId: string, localeCode: string, format: ExportFormat): Promise<Buffer>`

## 重要：term key 與 term ID

目前 SDK 的 translation method 需要 `termId`（UUID），不是 term key。

若你是用可讀 key（建議），請先做 key 對映：

```js
const terms = await api.listTerms(projectId);
const term = terms.find((t) => t.value === "form.email.required");
if (!term) throw new Error("term not found");

await api.updateTranslation(projectId, "en_GB", term.id, "E-mail input is required");
```

## 低階 client（`TraduoraClient`）

只有在你需要原始 HTTP 行為時才建議直接使用。

- `getToken(): Promise<{ accessToken; expiresAtEpochMs; tokenType }>`
- `request<T>(method: string, path: string, options?): Promise<T>`
- `requestBuffer(method: string, path: string, options?): Promise<Buffer>`

## 主要匯出

- `createApi`
- `TraduoraApi`
- `TraduoraClient`
- `requestAccessToken`
- `resolveConfig`
- `runInit`
- `loadState` / `saveState` / `updateState`
- TypeScript types
