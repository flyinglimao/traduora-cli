---
id: configuration-and-state
title: Configuration and State
---

## Generate files with init

You can generate both config and state files interactively with [`init`](./init).

```bash
traduora init
```

## Configuration file

Supported config files:

- `traduora.config.json`
- `traduora.config.ts`
- `traduora.config.js`
- `traduora.config.mjs`
- `traduora.config.cjs`

### JSON example

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

### TypeScript example

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

## Environment variables

- `TRADUORA_BASE_URL`
- `TRADUORA_GRANT_TYPE` (`client_credentials` or `password`)
- `TRADUORA_CLIENT_ID`
- `TRADUORA_CLIENT_SECRET`
- `TRADUORA_USERNAME`
- `TRADUORA_PASSWORD`
- `TRADUORA_ACCESS_TOKEN`

## State file

Default state file: `.traduora.state.json`

Example:

```json
{
  "currentProjectId": "0f5d...",
  "currentLocale": "en_GB"
}
```

You can override state path per command with `--state <path>`.

## Why commands sometimes do not require `--project` or `--locale`

- `--project` is optional if `currentProjectId` is already set.
- `--locale` is optional if `currentLocale` is already set.

If neither is set, the command will fail and tell you exactly what to provide.
