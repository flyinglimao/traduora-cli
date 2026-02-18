# 快速開始

## 安裝

```bash
pnpm install
pnpm build
```

## 初始化

互動式初始化：

```bash
traduora init
```

流程：

1. 輸入 URL（例如 `https://app.traduora.co`）
2. 選擇模式
   - 直接輸入 API credentials
   - 帳號登入並自動建立 project client

初始化後會產生：

- `traduora.config.json`（認證與 URL）
- `.traduora.state.json`（預設 project/locale）

## 常用流程

```bash
traduora project list
traduora project use <projectId>
traduora translation use en_GB
traduora term add form.email.required
traduora translation add --term form.email.required --value "E-mail input is required"
traduora export --format jsonnested --output ./i18n/en_GB.json
```
