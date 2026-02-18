---
id: sdk
title: JavaScript SDK
---

可直接在 Node.js 腳本中使用此套件。

## ESM

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

## CommonJS

```js
const { createApi } = require("traduora-cli-next");

(async () => {
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
})();
```

## `createApi` 行為

`createApi(options)` 會回傳：

- `config`：解析後的執行設定
- `client`：低階認證 HTTP client
- `api`：高階 Traduora API 包裝

設定優先順序與 CLI 一致。

## 主要匯出

- `createApi`
- `TraduoraApi`
- `TraduoraClient`
- `requestAccessToken`
- `resolveConfig`
- `runInit`
- `loadState` / `saveState` / `updateState`
- TypeScript types
