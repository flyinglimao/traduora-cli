---
id: init
title: Init コマンド
---

`traduora init` は対話式で認証設定を作成します。

## 目的

- 保存前に認証を検証する。
- 継続利用できる設定ファイルを生成する。
- 必要に応じて既定プロジェクトを状態ファイルに保存する。

## コマンド

```bash
traduora init [--url <url>] [--role <admin|editor|viewer>] [--config <path>] [--state <path>]
```

## モード

### モード A: API Credentials を直接入力

入力する値：

- `clientId`
- `clientSecret`

CLI は token API で検証後、設定を書き込みます。

### モード B: アカウントでログインして project client を自動作成

入力後、CLI は以下を実行します。

1. `password grant` で user token 取得
2. project を選択
3. 指定 role（既定 `editor`）で project client を作成
4. 新しい credentials を検証
5. config と既定 project を保存

## オプション

| オプション | 目的 | 既定値 |
|---|---|---|
| `--url` | Traduora API base URL | 対話入力 |
| `--role` | 自動作成する project client の role | `editor` |
| `--config` | 設定ファイル出力先（JSON のみ） | `traduora.config.json` |
| `--state` | 状態ファイル出力先 | `.traduora.state.json` |

## 例

```bash
traduora init --url https://app.traduora.co --role editor
```
