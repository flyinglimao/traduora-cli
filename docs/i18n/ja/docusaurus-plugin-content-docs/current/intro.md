---
id: intro
title: はじめに
slug: /
---

# Traduora CLI Next

`traduora-cli-next` は、実運用を前提にした Traduora 用 CLI と JS SDK です。

## このツールでできること

- ターミナル、CI、スクリプトで Traduora プロジェクトを管理する。
- UUID ではなく **term key**（`term.value`）で翻訳を操作する。
- 複数フォーマットで翻訳ファイルをエクスポートする。
- ESM / CommonJS SDK で Node.js 自動化を構築する。

## 主要コンセプト

### 1) 設定の優先順位

設定は以下の順で適用されます。

1. 環境変数
2. 設定ファイル（`traduora.config.json` / `traduora.config.ts` / `traduora.config.js`）
3. CLI オプション上書き（`--base-url`, `--token` など）

### 2) 状態ファイル

`project use` と `translation use` は `.traduora.state.json` に保存されます。

- `currentProjectId`: 既定プロジェクト
- `currentLocale`: 既定ロケール

### 3) term key マッピング（重要）

CLI は人が読める key（例: `form.email.required`）で操作します。

内部では term 一覧から key を `termId` に変換して API を呼び出します。

## クイックスタート

### Step 1: 認証初期化

```bash
traduora init
```

### Step 2: 既定のプロジェクトとロケールを設定

```bash
traduora project use <projectId>
traduora translation use en_GB
```

### Step 3: 用語と翻訳を追加

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
