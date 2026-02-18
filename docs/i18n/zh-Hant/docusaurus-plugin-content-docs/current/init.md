---
id: init
title: Init 指令
---

`traduora init` 用互動流程建立可用的認證設定。

## 目的

- 先驗證認證是否有效，再寫入設定檔。
- 產生後續 CLI 可直接使用的 config。
- 視模式可順便設定預設 project。

## 指令

```bash
traduora init [--url <url>] [--role <admin|editor|viewer>] [--config <path>] [--state <path>]
```

## 兩種模式

### 模式 A：直接輸入 API Credentials

你會輸入：

- `clientId`
- `clientSecret`

CLI 會先嘗試拿 token 驗證，成功才寫入設定。

### 模式 B：帳號密碼登入後自動建立 project client

你會輸入帳號與密碼，CLI 會：

1. 以 `password grant` 取得 user token
2. 讓你選擇 project
3. 建立 project client（預設 role 為 `editor`）
4. 驗證新 client credentials
5. 寫入 config 與預設 project 狀態

## 參數說明

| 參數 | 用途 | 預設 |
|---|---|---|
| `--url` | Traduora API base URL | 互動詢問 |
| `--role` | 自動建立 project client 的角色 | `editor` |
| `--config` | 設定檔輸出路徑（僅 JSON） | `traduora.config.json` |
| `--state` | 狀態檔路徑 | `.traduora.state.json` |

## 範例

```bash
traduora init --url https://app.traduora.co --role editor
```
