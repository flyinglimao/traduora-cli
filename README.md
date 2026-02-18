# @0xlimao/traduora-cli

A modern CLI and JavaScript SDK for [Traduora](https://docs.traduora.co/) with first-class `client_credentials` support.

- CLI commands for projects, terms, translations, and exports
- Interactive `init` flow to bootstrap credentials and default state
- SDK package for scripting with both ESM and CommonJS
- Docusaurus documentation with English, Traditional Chinese, Simplified Chinese, and Japanese

## Table of Contents

- [Highlights](#highlights)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Usage](#cli-usage)
- [Configuration](#configuration)
- [JavaScript SDK](#javascript-sdk)
- [Documentation Site](#documentation-site)
- [Development](#development)
- [Testing](#testing)
- [Release](#release)
- [Contributing](#contributing)
- [License](#license)

## Highlights

- Uses term `value` as the user-facing key (instead of UUIDs)
- Supports `client_credentials` as the default auth model
- Supports interactive account login to create a project client automatically
- Supports config file logic (`json/js/ts`) and environment variable fallback

## Installation

### From npm

```bash
pnpm add @0xlimao/traduora-cli
```

### Global CLI install

```bash
pnpm add -g @0xlimao/traduora-cli
```

### From source

```bash
git clone https://github.com/flyinglimao/traduora-cli.git
cd traduora-cli
pnpm install
pnpm build
```

## Quick Start

Initialize interactively:

```bash
traduora init
```

Show help:

```bash
traduora --help
traduora project --help
traduora term --help
traduora translation --help
traduora export --help
```

Typical flow:

```bash
traduora project use <projectId>
traduora translation use en_GB
traduora term add form.email.required
traduora translation add --term form.email.required --value "E-mail input is required"
traduora export --format jsonnested --output ./i18n/en_GB.json
```

## CLI Usage

### Init

```bash
traduora init --help
```

`init` supports:

- Input API credentials directly (`client_credentials`)
- Login with account/password, then create a project client (`--role admin|editor|viewer`)

### Project

```bash
traduora project --help
traduora project add --help
traduora project list --help
traduora project update --help
traduora project remove --help
traduora project status --help
traduora project use --help
```

### Term

```bash
traduora term --help
traduora term add --help
traduora term list --help
traduora term update --help
traduora term delete --help
```

### Translation

```bash
traduora translation --help
traduora translation use --help
traduora translation add --help
traduora translation list --help
traduora translation update --help
traduora translation delete --help
```

### Export

```bash
traduora export --help
```

## Configuration

Priority order:

1. Environment variables
2. Config file
3. CLI options

Supported config files:

- `traduora.config.json`
- `traduora.config.ts`
- `traduora.config.js`
- `traduora.config.mjs`
- `traduora.config.cjs`

Supported environment variables:

- `TRADUORA_BASE_URL`
- `TRADUORA_GRANT_TYPE`
- `TRADUORA_CLIENT_ID`
- `TRADUORA_CLIENT_SECRET`
- `TRADUORA_USERNAME`
- `TRADUORA_PASSWORD`
- `TRADUORA_ACCESS_TOKEN`

State (`project use`, `translation use`) is stored in `.traduora.state.json`.

## JavaScript SDK

### ESM

```ts
import { createApi } from "@0xlimao/traduora-cli";

const { api } = await createApi();
const terms = await api.listTerms("<projectId>");
console.log(terms);
```

### CommonJS

```js
const { createApi } = require("@0xlimao/traduora-cli");

(async () => {
  const { api } = await createApi();
  const terms = await api.listTerms("<projectId>");
  console.log(terms);
})();
```

For full method details, see the SDK TypeScript Reference in the docs site.

## Documentation Site

- Production: <https://flyinglimao.github.io/traduora-cli/>
- Source: `docs/`

Run locally:

```bash
cd docs
pnpm install
pnpm start
```

## Development

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm dev -- --help
```

## Testing

Local Docker integration test (CLI + SDK against real Traduora instance):

```bash
pnpm test:e2e:local
```

See test instructions in `test/README.md`.

## Release

- npm publish is handled by GitHub Actions with npm Trusted Publishing (OIDC)
- Docs are deployed to GitHub Pages by GitHub Actions

## Contributing

Issues and pull requests are welcome:

- Issues: <https://github.com/flyinglimao/traduora-cli/issues>
- Repository: <https://github.com/flyinglimao/traduora-cli>

## License

MIT. See `LICENSE`.
