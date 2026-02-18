---
id: sdk
title: JavaScript SDK
---

CLI だけでは足りない処理は `traduora-cli-next` SDK を使って実装できます。

## クイックスタート

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

## `createApi` の返り値

`createApi(options)` は以下を返します。

- `config`: 解決済みの実行設定。
- `client`: 低レベル認証 HTTP クライアント（`TraduoraClient`）。
- `api`: 高レベル API ラッパー（`TraduoraApi`）。

## 自動生成される完全 TypeScript Reference

クラス・インターフェース・型エイリアス・関数を含む完全な API リファレンスは以下を参照してください。

- [SDK TypeScript Reference](./sdk-reference)

このリファレンスは TypeDoc でソースコードから生成されます。

```bash
pnpm docs:api-reference
```

## API リファレンス（`TraduoraApi`）

実装ソース：`/Users/flyinglimao/Code/traduora-cli/src/api.ts`

### Project 関連

- `listProjects(): Promise<ProjectDTO[]>`
- `getProject(projectId: string): Promise<ProjectDTO>`
- `createProject(input: { name: string; description?: string }): Promise<ProjectDTO>`
- `updateProject(projectId: string, input: { name?: string; description?: string }): Promise<ProjectDTO>`
- `deleteProject(projectId: string): Promise<void>`
- `getProjectStatus(projectId: string): Promise<ProjectStatusDTO>`

### Term 関連

- `listTerms(projectId: string): Promise<ProjectTermDTO[]>`
- `addTerm(projectId: string, value: string): Promise<ProjectTermDTO>`
- `updateTerm(projectId: string, termId: string, value: string): Promise<ProjectTermDTO>`
- `deleteTerm(projectId: string, termId: string): Promise<void>`

### Locale / Translation 関連

- `listProjectLocales(projectId: string): Promise<ProjectLocaleDTO[]>`
- `addProjectLocale(projectId: string, localeCode: string): Promise<ProjectLocaleDTO>`
- `listTranslations(projectId: string, localeCode: string): Promise<TermTranslationDTO[]>`
- `updateTranslation(projectId: string, localeCode: string, termId: string, value: string): Promise<TermTranslationDTO>`
- `deleteLocale(projectId: string, localeCode: string): Promise<void>`
- `listLocales(): Promise<LocaleDTO[]>`

### Label 関連

- `listLabels(projectId: string): Promise<ProjectLabelDTO[]>`
- `createLabel(projectId: string, value: string, color?: string): Promise<ProjectLabelDTO>`
- `ensureLabels(projectId: string, values: string[]): Promise<ProjectLabelDTO[]>`
- `setTermLabels(projectId: string, termId: string, currentLabelValues: string[], targetLabelValues: string[]): Promise<void>`
- `setTranslationLabels(projectId: string, localeCode: string, termId: string, currentLabelValues: string[], targetLabelValues: string[]): Promise<void>`

### Project client / Export 関連

- `createProjectClient(projectId: string, input: { name: string; role: "admin" | "editor" | "viewer" }): Promise<ProjectClientWithSecretDTO>`
- `exportProject(projectId: string, localeCode: string, format: ExportFormat): Promise<Buffer>`

## 重要: term key と term ID

現状 SDK の translation methods は `termId`（UUID）を必要とします（term key ではない）。

可読 key を使う場合は、先に key を ID に変換してください。

```js
const terms = await api.listTerms(projectId);
const term = terms.find((t) => t.value === "form.email.required");
if (!term) throw new Error("term not found");

await api.updateTranslation(projectId, "en_GB", term.id, "E-mail input is required");
```

## 低レベル client（`TraduoraClient`）

生の HTTP 挙動が必要な場合のみ直接利用してください。

- `getToken(): Promise<{ accessToken; expiresAtEpochMs; tokenType }>`
- `request<T>(method: string, path: string, options?): Promise<T>`
- `requestBuffer(method: string, path: string, options?): Promise<Buffer>`

## 主なエクスポート

- `createApi`
- `TraduoraApi`
- `TraduoraClient`
- `requestAccessToken`
- `resolveConfig`
- `runInit`
- `loadState` / `saveState` / `updateState`
- TypeScript types
