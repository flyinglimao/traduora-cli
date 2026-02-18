---
id: sdk
title: JavaScript SDK
---

當你需要可程式化流程（不只 CLI 命令）時，建議使用 SDK。

## 範例 1：初始化 API client

```js
import { createApi } from "@0xlimao/traduora-cli";

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
console.log(projects.map((p) => ({ id: p.id, name: p.name })));
```

## 範例 2：用 term key 更新翻譯

`updateTranslation` 需要 `termId`，所以先做 key -> ID 對映。

```js
import { createApi } from "@0xlimao/traduora-cli";

const { api } = await createApi();
const projectId = "<project-id>";
const locale = "en_GB";
const termKey = "form.email.required";
const message = "E-mail input is required";

const terms = await api.listTerms(projectId);
const term = terms.find((t) => t.value === termKey);
if (!term) throw new Error(`Term not found: ${termKey}`);

await api.updateTranslation(projectId, locale, term.id, message);
console.log("translation updated");
```

## 範例 3：匯出語系檔

```js
import { writeFile } from "node:fs/promises";
import { createApi } from "@0xlimao/traduora-cli";

const { api } = await createApi();
const projectId = "<project-id>";
const locale = "ja";

const data = await api.exportProject(projectId, locale, "jsonnested");
await writeFile("./i18n/ja.json", data);
console.log("exported ./i18n/ja.json");
```

## 完整 TypeScript reference

完整 class / method / interface / type 請看：

- [SDK TypeScript Reference](./sdk-reference)

由原始碼重新產生 reference：

```bash
pnpm docs:api-reference
```
