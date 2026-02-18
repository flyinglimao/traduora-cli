# traduora-cli-next

重寫版 Traduora CLI（TypeScript + pnpm）。

這個版本以「可直接操作翻譯資料」為主，不提供通用 `request` 指令。

同時也提供 JS SDK，可用於 Node.js 腳本（ESM + CommonJS）。

## 安裝

```bash
pnpm install
pnpm build
```

開發模式：

```bash
pnpm dev -- --help
```

## 作為套件使用（ESM + CJS）

### ESM

```js
import { createApi } from "traduora-cli-next";

const { api } = await createApi();
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

## 文件站（GitHub Pages）

專案已提供 `/docs` 文件資料夾，可直接設定為 GitHub Pages 來源。

- 首頁：`/Users/flyinglimao/Code/traduora-cli/docs/index.md`
- 快速開始：`/Users/flyinglimao/Code/traduora-cli/docs/getting-started.md`
- CLI：`/Users/flyinglimao/Code/traduora-cli/docs/cli.md`
- SDK：`/Users/flyinglimao/Code/traduora-cli/docs/sdk.md`

## 設定來源

優先順序：`env` < `config file` < CLI options

可用設定來源：

1. `traduora.config.json`
2. `traduora.config.ts/js/mjs/cjs`（可帶邏輯）
3. 環境變數 fallback

支援的環境變數：

- `TRADUORA_BASE_URL`
- `TRADUORA_GRANT_TYPE` (`client_credentials` 或 `password`)
- `TRADUORA_CLIENT_ID`
- `TRADUORA_CLIENT_SECRET`
- `TRADUORA_USERNAME`
- `TRADUORA_PASSWORD`
- `TRADUORA_ACCESS_TOKEN`

`project use` / `translation use` 會寫入 `.traduora.state.json`。

## init（互動式）

```bash
pnpm dev -- init
```

`init` 會詢問：

1. URL
2. 模式：
   - 輸入 API credentials（client_credentials）
   - 帳號密碼登入（password）並建立 project client（預設 role=editor）

帳號登入模式會：

1. 用帳密拿 user token
2. 選 project
3. 建立 project client
4. 驗證 client_credentials
5. 寫入 `traduora.config.json`
6. 寫入預設 project 到 `.traduora.state.json`

可用參數：

- `--url <url>`
- `--role <admin|editor|viewer>`
- `--config <path>`（僅支援寫入 `.json`）

## 指令

### project

```bash
traduora project add my-project --description "demo" --label platform,app
traduora project list
traduora project update <projectId> --name new-name --label product
traduora project remove <projectId>
traduora project status <projectId>
traduora project use <projectId>
```

> `project add/update --label` 會確保對應 label 存在於該 project。

### term

```bash
traduora term add email_required_validation_error
traduora term list
traduora term update email_required_validation_error --new-value form.email.required
traduora term delete form.email.required
```

可加：

- `--project <id>`
- `--label <a,b>`（可重複）

## translation

```bash
traduora translation use en_GB
traduora translation add --term form.email.required --value "E-mail input is required"
traduora translation list
traduora translation update --term form.email.required --value "E-mail is required" --label validation
traduora translation delete --term form.email.required
```

可加：

- `--project <id>`
- `--locale <code>`
- `--label <a,b>`（add/update）

## export

```bash
traduora export --format jsonnested --output ./i18n/en_GB.json
```

可加：

- `--project <id>`
- `--locale <code>`
- `--format <androidxml|csv|xliff12|jsonflat|jsonnested|yamlflat|yamlnested|properties|po|strings>`

## 關於 term key 與 translation

本 CLI 對外一律使用 `term.value` 作為 key（例如 `form.email.required`），不讓使用者記 UUID。

例如：

```bash
traduora term add form.email.required
traduora translation add --term form.email.required --value "E-mail input is required"
```

內部會自動透過 term list 建立 `value -> termId` mapping 後呼叫 translation API。

## 設定檔範例

### JSON

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

### TS

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

## 參考

- <https://docs.traduora.co/docs/tools/cli>
- <https://docs.traduora.co/docs/api/v1/swagger#/>
- <https://docs.traduora.co/docs/api/v1/swagger.json>
