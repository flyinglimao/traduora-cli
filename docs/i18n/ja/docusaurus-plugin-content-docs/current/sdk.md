---
id: sdk
title: JavaScript SDK
---

Node.js スクリプトから直接パッケージを利用できます。

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

## `createApi` の挙動

`createApi(options)` の返り値：

- `config`: 解決済み設定
- `client`: 低レベル認証 HTTP クライアント
- `api`: 高レベル Traduora API ラッパー

設定優先順位は CLI と同じです。

## 主なエクスポート

- `createApi`
- `TraduoraApi`
- `TraduoraClient`
- `requestAccessToken`
- `resolveConfig`
- `runInit`
- `loadState` / `saveState` / `updateState`
- TypeScript types
