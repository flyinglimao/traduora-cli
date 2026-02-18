---
id: sdk
title: JavaScript SDK
---

CLI だけで足りない処理は SDK でスクリプト化できます。

## 例 1: API client を初期化する

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
console.log(projects.map((p) => ({ id: p.id, name: p.name })));
```

## 例 2: term key で翻訳を更新する

`updateTranslation` は `termId` が必要なので、先に key -> ID を解決します。

```js
import { createApi } from "traduora-cli-next";

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

## 例 3: ロケールファイルをエクスポートする

```js
import { writeFile } from "node:fs/promises";
import { createApi } from "traduora-cli-next";

const { api } = await createApi();
const projectId = "<project-id>";
const locale = "ja";

const data = await api.exportProject(projectId, locale, "jsonnested");
await writeFile("./i18n/ja.json", data);
console.log("exported ./i18n/ja.json");
```

## 完全 TypeScript reference

全クラス・メソッド・インターフェース・型の詳細は以下を参照してください。

- [SDK TypeScript Reference](./sdk-reference)

ソースコードから reference を再生成するコマンド：

```bash
pnpm docs:api-reference
```
