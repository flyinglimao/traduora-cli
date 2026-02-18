---
id: init
title: Init 命令
---

`traduora init` 用交互流程生成可用认证配置。

## 目的

- 先验证认证是否有效，再写入配置文件。
- 生成后续 CLI 可直接使用的配置。
- 按模式可同时设置默认 project。

## 命令

```bash
traduora init [--url <url>] [--role <admin|editor|viewer>] [--config <path>] [--state <path>]
```

## 两种模式

### 模式 A：直接输入 API Credentials

你需要输入：

- `clientId`
- `clientSecret`

CLI 会先请求 token 验证，成功后才写入配置。

### 模式 B：账号密码登录并自动创建 project client

你输入账号和密码后，CLI 会：

1. 用 `password grant` 获取 user token
2. 让你选择 project
3. 创建 project client（默认 `editor`）
4. 验证新 client credentials
5. 写入 config 和默认 project 状态

## 参数说明

| 参数 | 用途 | 默认 |
|---|---|---|
| `--url` | Traduora API base URL | 交互询问 |
| `--role` | 自动创建 project client 的角色 | `editor` |
| `--config` | 配置输出路径（仅 JSON） | `traduora.config.json` |
| `--state` | 状态文件路径 | `.traduora.state.json` |

## 示例

```bash
traduora init --url https://app.traduora.co --role editor
```
