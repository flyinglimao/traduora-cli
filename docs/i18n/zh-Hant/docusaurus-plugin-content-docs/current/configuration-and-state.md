---
id: configuration-and-state
title: 設定與狀態檔
---

## 設定檔

支援的設定檔名稱：

- `traduora.config.json`
- `traduora.config.ts`
- `traduora.config.js`
- `traduora.config.mjs`
- `traduora.config.cjs`

### JSON 範例

```json
{
  "baseUrl": "https://app.traduora.co",
  "auth": {
    "grantType": "client_credentials",
    "clientId": "your-client-id",
    "clientSecret": "your-client-secret"
  }
}
```

### TypeScript 範例

```ts
export default ({ env }: { env: NodeJS.ProcessEnv }) => ({
  baseUrl: env.TRADUORA_BASE_URL ?? "https://app.traduora.co",
  auth: {
    grantType: "client_credentials",
    clientId: env.TRADUORA_CLIENT_ID,
    clientSecret: env.TRADUORA_CLIENT_SECRET,
  },
});
```

## 環境變數

- `TRADUORA_BASE_URL`
- `TRADUORA_GRANT_TYPE`（`client_credentials` 或 `password`）
- `TRADUORA_CLIENT_ID`
- `TRADUORA_CLIENT_SECRET`
- `TRADUORA_USERNAME`
- `TRADUORA_PASSWORD`
- `TRADUORA_ACCESS_TOKEN`

## 狀態檔

預設狀態檔：`.traduora.state.json`

範例：

```json
{
  "currentProjectId": "0f5d...",
  "currentLocale": "en_GB"
}
```

可透過 `--state <path>` 指定其他狀態檔。

## 為什麼有些指令不用一定傳 `--project` 或 `--locale`

- 已設定 `currentProjectId` 時，可省略 `--project`。
- 已設定 `currentLocale` 時，可省略 `--locale`。

若都沒有設定，CLI 會明確提示缺哪個參數。
