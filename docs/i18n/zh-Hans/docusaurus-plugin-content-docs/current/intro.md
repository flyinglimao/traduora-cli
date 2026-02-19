---
id: intro
title: 快速开始
slug: /
---

# Traduora CLI Next

`@0xlimao/traduora-cli` 是一个实用的 Traduora CLI 和 JS SDK，可直接用于日常开发流程。

## 这个工具的用途

- 在终端脚本和 CI pipeline 中检查 Traduora 项目状态。
- 用 **term key**（`term.value`）管理 term 和 translation，而不是 UUID。
- 以多种格式导出 locale 文件。
- 通过 ESM 与 CommonJS SDK 接口集成 Node.js 自动化。

## 核心概念

### 1) 配置来源优先级

配置按以下顺序加载：

1. 环境变量
2. 配置文件（`traduora.config.json` / `traduora.config.ts` / `traduora.config.js`）
3. CLI 参数覆盖（`--base-url`、`--token` 等）

### 2) 状态文件

`init` 和 `translation use` 会把默认值写入 `.traduora.state.json`。

- `currentProjectId`：需要 project 的命令使用的默认项目。
- `currentLocale`：translation 与 export 命令使用的默认语言。

### 3) Term key 映射（重要）

你使用的是人类可读的 term key（例如 `form.email.required`）。

CLI 内部会自动调用 term API，把 key 解析为对应 UUID。

## 快速开始

### 第一步：初始化认证

```bash
traduora init
```

### 第二步：确认默认项目与语言

```bash
traduora project status
traduora translation use en_GB
```

### 第三步：管理词条和翻译

```bash
traduora term add form.email.required
traduora translation add --term form.email.required --value "E-mail input is required"
```

### 第四步：导出翻译

```bash
traduora export --format jsonnested --output ./i18n/en_GB.json
```

## 下一步

- [配置与状态文件](./configuration-and-state)
- [Init 命令](./init)
- [Project 命令](./project)
- [Term 命令](./term)
- [Translation 命令](./translation)
- [Export 命令](./export)
- [JavaScript SDK](./sdk)
