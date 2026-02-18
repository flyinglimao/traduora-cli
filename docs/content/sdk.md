---
id: sdk
title: JavaScript SDK
---

Use the package directly in Node.js scripts.

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

## `createApi` behavior

`createApi(options)` returns:

- `config`: resolved runtime config
- `client`: low-level authenticated HTTP client
- `api`: high-level Traduora API wrapper

It respects the same config priority as CLI.

## Main exports

- `createApi`
- `TraduoraApi`
- `TraduoraClient`
- `requestAccessToken`
- `resolveConfig`
- `runInit`
- `loadState` / `saveState` / `updateState`
- TypeScript types
