---
id: configuration-and-state
title: 配置与状态文件
---

## 可通过 init 生成文件

你可以使用交互式 [`init`](./init) 一次生成 config 和 state 文件。

```bash
traduora init
```

## 配置文件

支持的配置文件名：

- `traduora.config.json`
- `traduora.config.ts`
- `traduora.config.js`
- `traduora.config.mjs`
- `traduora.config.cjs`

### JSON 示例

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

### TypeScript 示例

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

## 环境变量

- `TRADUORA_BASE_URL`
- `TRADUORA_GRANT_TYPE`（`client_credentials` 或 `password`）
- `TRADUORA_CLIENT_ID`
- `TRADUORA_CLIENT_SECRET`
- `TRADUORA_USERNAME`
- `TRADUORA_PASSWORD`
- `TRADUORA_ACCESS_TOKEN`

## 状态文件

默认状态文件：`.traduora.state.json`

示例：

```json
{
  "currentProjectId": "0f5d...",
  "currentLocale": "en_GB"
}
```

可通过 `--state <path>` 指定其他状态文件。

## 为什么有些命令可以省略 `--project` 或 `--locale`

- 设置了 `currentProjectId` 时，可省略 `--project`。
- 设置了 `currentLocale` 时，可省略 `--locale`。

如果都没有设置，CLI 会明确提示缺少的参数。
