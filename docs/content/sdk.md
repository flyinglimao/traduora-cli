---
id: sdk
title: JavaScript SDK
---

Use SDK scripts when you need programmable workflows beyond CLI commands.

## Example 1: Initialize API client

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

## Example 2: Update translation by term key

`updateTranslation` needs `termId`, so resolve key -> ID first.

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

## Example 3: Export locale file

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

## Full TypeScript reference

For all classes, methods, interfaces, and types, see:

- [SDK TypeScript Reference](./sdk-reference)

Regenerate reference docs from source:

```bash
pnpm docs:api-reference
```
