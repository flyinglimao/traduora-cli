# Docusaurus Docs

## Local Development

```bash
cd docs
nvm use 22
pnpm install
pnpm start
```

## Build

```bash
pnpm build
```

Build output: `docs/build/`

## Languages

This site supports:

- English (`en`)
- Traditional Chinese (`zh-Hant`)
- Simplified Chinese (`zh-Hans`)
- Japanese (`ja`)

## Regenerate SDK TypeScript Reference

From repository root:

```bash
pnpm docs:api-reference
```
