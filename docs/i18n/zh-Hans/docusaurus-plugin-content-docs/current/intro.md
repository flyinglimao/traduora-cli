---
id: intro
title: 快速开始
slug: /
---

# Traduora CLI Next

`traduora-cli-next` 是一个可用于真实开发流程的 Traduora CLI 与 JS SDK。

## 这个工具能解决什么

- 在终端、CI、脚本中管理 Traduora 项目。
- 用 **term key**（`term.value`）操作，而不是记 UUID。
- 导出多种翻译文件格式。
- 用 ESM / CommonJS SDK 编写自动化脚本。

## 核心概念

### 1) 配置来源优先级

配置加载顺序：

1. 环境变量
2. 配置文件（`traduora.config.json` / `traduora.config.ts` / `traduora.config.js`）
3. CLI 参数覆盖（例如 `--base-url`, `--token`）

### 2) 状态文件

`project use` 和 `translation use` 会写入 `.traduora.state.json`：

- `currentProjectId`：默认项目
- `currentLocale`：默认语言

### 3) term key 映射（重要）

CLI 对外统一使用可读 key（例如 `form.email.required`）。

内部会先查询 term 列表，将 key 映射到 `termId` 再调用 API。

## 快速流程

### 第一步：初始化认证

```bash
traduora init
```

### 第二步：设置默认项目与语言

```bash
traduora project use <projectId>
traduora translation use en_GB
```

### 第三步：创建词条和翻译

```bash
traduora term add form.email.required
traduora translation add --term form.email.required --value "E-mail input is required"
```

### 第四步：导出翻译文件

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
