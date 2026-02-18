# SDK（ESM + CommonJS）

此專案可作為 Node.js 套件給腳本使用。

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

## 可用核心匯出

- `createApi`
- `TraduoraApi`
- `TraduoraClient`
- `requestAccessToken`
- `resolveConfig`
- `loadState` / `saveState` / `updateState`
- TypeScript types（`types.ts`）
