---
id: sdk
title: JavaScript SDK
---

当 CLI 不足以覆盖你的流程时，可以直接使用 `traduora-cli-next` SDK。

## 快速开始

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

## `createApi` 返回内容

`createApi(options)` 返回：

- `config`：解析后的运行配置。
- `client`：底层认证 HTTP client（`TraduoraClient`）。
- `api`：高层封装（`TraduoraApi`）。

## 完整自动生成 TypeScript Reference

如果你要查看完整符号级 API（class / interface / type alias / function），请看：

- [SDK TypeScript Reference](./sdk-reference)

该参考文档由 TypeDoc 从源码生成：

```bash
pnpm docs:api-reference
```

## API 参考（`TraduoraApi`）

实现来源：`/Users/flyinglimao/Code/traduora-cli/src/api.ts`

### 项目相关

- `listProjects(): Promise<ProjectDTO[]>`
- `getProject(projectId: string): Promise<ProjectDTO>`
- `createProject(input: { name: string; description?: string }): Promise<ProjectDTO>`
- `updateProject(projectId: string, input: { name?: string; description?: string }): Promise<ProjectDTO>`
- `deleteProject(projectId: string): Promise<void>`
- `getProjectStatus(projectId: string): Promise<ProjectStatusDTO>`

### 词条（Term）相关

- `listTerms(projectId: string): Promise<ProjectTermDTO[]>`
- `addTerm(projectId: string, value: string): Promise<ProjectTermDTO>`
- `updateTerm(projectId: string, termId: string, value: string): Promise<ProjectTermDTO>`
- `deleteTerm(projectId: string, termId: string): Promise<void>`

### 语言与翻译相关

- `listProjectLocales(projectId: string): Promise<ProjectLocaleDTO[]>`
- `addProjectLocale(projectId: string, localeCode: string): Promise<ProjectLocaleDTO>`
- `listTranslations(projectId: string, localeCode: string): Promise<TermTranslationDTO[]>`
- `updateTranslation(projectId: string, localeCode: string, termId: string, value: string): Promise<TermTranslationDTO>`
- `deleteLocale(projectId: string, localeCode: string): Promise<void>`
- `listLocales(): Promise<LocaleDTO[]>`

### Label 相关

- `listLabels(projectId: string): Promise<ProjectLabelDTO[]>`
- `createLabel(projectId: string, value: string, color?: string): Promise<ProjectLabelDTO>`
- `ensureLabels(projectId: string, values: string[]): Promise<ProjectLabelDTO[]>`
- `setTermLabels(projectId: string, termId: string, currentLabelValues: string[], targetLabelValues: string[]): Promise<void>`
- `setTranslationLabels(projectId: string, localeCode: string, termId: string, currentLabelValues: string[], targetLabelValues: string[]): Promise<void>`

### Project client 与导出

- `createProjectClient(projectId: string, input: { name: string; role: "admin" | "editor" | "viewer" }): Promise<ProjectClientWithSecretDTO>`
- `exportProject(projectId: string, localeCode: string, format: ExportFormat): Promise<Buffer>`

## 重要：term key 与 term ID

当前 SDK 的 translation methods 需要 `termId`（UUID），不是 term key。

如果你使用可读 key（推荐），先做 key 映射：

```js
const terms = await api.listTerms(projectId);
const term = terms.find((t) => t.value === "form.email.required");
if (!term) throw new Error("term not found");

await api.updateTranslation(projectId, "en_GB", term.id, "E-mail input is required");
```

## 底层 client（`TraduoraClient`）

仅当你明确需要原始 HTTP 行为时再直接使用。

- `getToken(): Promise<{ accessToken; expiresAtEpochMs; tokenType }>`
- `request<T>(method: string, path: string, options?): Promise<T>`
- `requestBuffer(method: string, path: string, options?): Promise<Buffer>`

## 主要导出

- `createApi`
- `TraduoraApi`
- `TraduoraClient`
- `requestAccessToken`
- `resolveConfig`
- `runInit`
- `loadState` / `saveState` / `updateState`
- TypeScript types
