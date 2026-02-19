---
id: intro
title: はじめに
slug: /
---

# Traduora CLI Next

`@0xlimao/traduora-cli` は、実運用に使える Traduora CLI と JS SDK です。

## このツールの用途

- ターミナルスクリプトや CI パイプラインで Traduora project 状態を確認する。
- UUID ではなく **term key**（`term.value`）で term と translation を管理する。
- locale ファイルを複数形式でエクスポートする。
- ESM / CommonJS SDK API を使って Node.js 自動化に統合する。

## 主要コンセプト

### 1) 設定ソースの優先順位

設定は次の順で読み込まれます。

1. 環境変数
2. 設定ファイル（`traduora.config.json` / `traduora.config.ts` / `traduora.config.js`）
3. CLI オーバーライド（`--base-url`、`--token` など）

### 2) 状態ファイル

`init` と `translation use` は既定値を `.traduora.state.json` に保存します。

- `currentProjectId`：project が必要なコマンドで使う既定 project。
- `currentLocale`：translation / export コマンドで使う既定 locale。

### 3) Term key マッピング（重要）

利用者は人間可読な term key（例: `form.email.required`）を使います。

CLI は内部で term API を呼び出し、key を UUID に解決します。

## クイックスタート

### Step 1: 認証を初期化

```bash
traduora init
```

### Step 2: 既定 project / locale を確認・設定

```bash
traduora project status
traduora translation use en_GB
```

### Step 3: term と translation を管理

```bash
traduora term add form.email.required
traduora translation add --term form.email.required --value "E-mail input is required"
```

### Step 4: 翻訳をエクスポート

```bash
traduora export --format jsonnested --output ./i18n/en_GB.json
```

## 次に読むページ

- [設定と状態ファイル](./configuration-and-state)
- [Init コマンド](./init)
- [Project コマンド](./project)
- [Term コマンド](./term)
- [Translation コマンド](./translation)
- [Export コマンド](./export)
- [JavaScript SDK](./sdk)
