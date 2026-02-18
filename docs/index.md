# Traduora CLI Next

`traduora-cli-next` 是一個重寫版 Traduora 工具，提供：

- 高階 CLI（project/term/translation/export）
- JavaScript/TypeScript SDK（ESM + CommonJS）

## 文件

- [快速開始](./getting-started.md)
- [CLI 指令](./cli.md)
- [SDK 使用方式](./sdk.md)

## 目標

- 支援 `client_credentials` 作為標準認證模式
- 對外使用 `term.value`，避免手動處理 UUID
- 可在 CI/CD 或 script 中穩定執行
