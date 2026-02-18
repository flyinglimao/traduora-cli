---
id: configuration-and-state
title: 設定と状態ファイル
---

## init でファイルを生成する

対話式の [`init`](./init) を使うと、config と state の両方を生成できます。

```bash
traduora init
```

## 設定ファイル

対応するファイル名：

- `traduora.config.json`
- `traduora.config.ts`
- `traduora.config.js`
- `traduora.config.mjs`
- `traduora.config.cjs`

### JSON 例

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

### TypeScript 例

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

## 環境変数

- `TRADUORA_BASE_URL`
- `TRADUORA_GRANT_TYPE`（`client_credentials` または `password`）
- `TRADUORA_CLIENT_ID`
- `TRADUORA_CLIENT_SECRET`
- `TRADUORA_USERNAME`
- `TRADUORA_PASSWORD`
- `TRADUORA_ACCESS_TOKEN`

## 状態ファイル

既定の状態ファイル：`.traduora.state.json`

例：

```json
{
  "currentProjectId": "0f5d...",
  "currentLocale": "en_GB"
}
```

`--state <path>` で状態ファイルを切り替えられます。

## `--project` / `--locale` を省略できる理由

- `currentProjectId` がある場合は `--project` を省略可能。
- `currentLocale` がある場合は `--locale` を省略可能。

どちらも未設定なら CLI が不足パラメータを明示します。
