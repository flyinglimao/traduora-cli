---
id: intro
title: 快速開始
slug: /
---

# Traduora CLI Next

`traduora-cli-next` 是一個可實際落地在開發流程中的 Traduora CLI 與 JS SDK。

## 這個工具可以解決什麼

- 在終端機、CI、腳本中管理 Traduora 專案。
- 以 **term key**（`term.value`）操作，不需要記 UUID。
- 輸出多種語言檔格式。
- 透過 ESM / CommonJS SDK 寫自動化腳本。

## 核心概念

### 1) 設定來源優先順序

設定讀取順序為：

1. 環境變數
2. 設定檔（`traduora.config.json` / `traduora.config.ts` / `traduora.config.js`）
3. CLI 參數覆寫（如 `--base-url`, `--token`）

### 2) 狀態檔

`project use` 與 `translation use` 會寫入 `.traduora.state.json`：

- `currentProjectId`：預設專案
- `currentLocale`：預設語系

### 3) term key 對映（重要）

CLI 對外都用人類可讀的 key（例如 `form.email.required`）。

內部會先查 term 清單，把 key 對映到 `termId` 後再呼叫 API。

## 快速流程

### 第一步：初始化認證

```bash
traduora init
```

### 第二步：設定預設專案與語系

```bash
traduora project use <projectId>
traduora translation use en_GB
```

### 第三步：建立詞條與翻譯

```bash
traduora term add form.email.required
traduora translation add --term form.email.required --value "E-mail input is required"
```

### 第四步：輸出翻譯檔

```bash
traduora export --format jsonnested --output ./i18n/en_GB.json
```

## 下一步

- [設定與狀態檔](./configuration-and-state)
- [Init 指令](./init)
- [Project 指令](./project)
- [Term 指令](./term)
- [Translation 指令](./translation)
- [Export 指令](./export)
- [JavaScript SDK](./sdk)
