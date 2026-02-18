---
id: sdk
title: JavaScript SDK
---

可以在 Node.js 脚本中直接使用本包。

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

## `createApi` 行为

`createApi(options)` 返回：

- `config`：解析后的运行配置
- `client`：底层认证 HTTP client
- `api`：高层 Traduora API 封装

配置优先级与 CLI 一致。

## 主要导出

- `createApi`
- `TraduoraApi`
- `TraduoraClient`
- `requestAccessToken`
- `resolveConfig`
- `runInit`
- `loadState` / `saveState` / `updateState`
- TypeScript types
