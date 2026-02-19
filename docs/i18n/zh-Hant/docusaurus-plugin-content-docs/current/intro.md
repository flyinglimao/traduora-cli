---
id: intro
title: 快速開始
slug: /
---

# Traduora CLI Next

`@0xlimao/traduora-cli` 是一個實用的 Traduora CLI 與 JS SDK，可直接用於日常開發流程。

## 這個工具的用途

- 在終端機腳本與 CI pipeline 中檢查 Traduora 專案狀態。
- 以 **term key**（`term.value`）管理 term 與 translation，而不是 UUID。
- 以多種格式輸出語系檔。
- 透過 ESM 與 CommonJS SDK 介面整合 Node.js 自動化。

## 核心概念

### 1) 設定來源優先順序

設定依下列順序載入：

1. 環境變數
2. 設定檔（`traduora.config.json` / `traduora.config.ts` / `traduora.config.js`）
3. CLI 參數覆寫（`--base-url`、`--token` 等）

### 2) 狀態檔

`init` 與 `translation use` 會把預設值寫入 `.traduora.state.json`。

- `currentProjectId`：需要 project 的指令所使用的預設專案。
- `currentLocale`：translation 與 export 指令使用的預設語系。

### 3) Term key 對映（重要）

你會使用人類可讀的 term key（例如 `form.email.required`）。

CLI 內部會自動呼叫 term API，把 key 解析成對應的 UUID。

## 快速開始

### 第一步：初始化認證

```bash
traduora init
```

### 第二步：確認預設專案與語系

```bash
traduora project status
traduora translation use en_GB
```

### 第三步：管理詞條與翻譯

```bash
traduora term add form.email.required
traduora translation add --term form.email.required --value "E-mail input is required"
```

### 第四步：輸出翻譯

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
