#!/usr/bin/env node
import { Command, Option } from "commander";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { TraduoraApi } from "./api.js";
import { requestAccessToken } from "./auth.js";
import { TraduoraClient } from "./client.js";
import { resolveConfig } from "./config.js";
import { runInit } from "./init.js";
import { OUTPUT_FORMATS, printJson, printTable, type OutputFormat } from "./output.js";
import { closePromptInterface } from "./prompts.js";
import { loadState, updateState } from "./state.js";
import type {
  CliState,
  ExportFormat,
  ProjectRole,
  ProjectTermDTO,
  ResolvedConfig,
  TermTranslationDTO,
} from "./types.js";

const EXPORT_FORMATS: ExportFormat[] = [
  "androidxml",
  "csv",
  "xliff12",
  "jsonflat",
  "jsonnested",
  "yamlflat",
  "yamlnested",
  "properties",
  "po",
  "strings",
];

const PROJECT_ROLES: ProjectRole[] = ["admin", "editor", "viewer"];

interface GlobalOptions {
  config?: string;
  baseUrl?: string;
  token?: string;
  state?: string;
}

interface LabelOption {
  label?: string[];
}

interface LocaleOption {
  locale?: string;
}

interface FormatOption {
  format?: string;
}

function collect(value: string, previous: string[]): string[] {
  return [...previous, value];
}

function parseLabels(input?: string[]): string[] {
  if (!input || input.length === 0) {
    return [];
  }

  const out = new Set<string>();
  for (const raw of input) {
    for (const label of raw.split(",")) {
      const normalized = label.trim();
      if (normalized) {
        out.add(normalized);
      }
    }
  }

  return [...out];
}

function requireProjectId(state: CliState): string {
  const projectId = state.currentProjectId;
  if (!projectId) {
    throw new Error("Project not set. Run: traduora init");
  }
  return projectId;
}

function requireLocale(localeFromOption: string | undefined, state: CliState): string {
  const locale = localeFromOption ?? state.currentLocale;
  if (!locale) {
    throw new Error("Locale not set. Use --locale <code> or run: traduora translation use <locale_code>");
  }
  return locale;
}

function resolveOverrides(global: GlobalOptions): Partial<ResolvedConfig> {
  const overrides: Partial<ResolvedConfig> = {};
  if (global.baseUrl) {
    overrides.baseUrl = global.baseUrl;
  }
  if (global.token) {
    overrides.accessToken = global.token;
  }
  return overrides;
}

async function loadRuntime(global: GlobalOptions): Promise<{
  config: ResolvedConfig;
  state: CliState;
  api: TraduoraApi;
}> {
  const config = await resolveConfig({
    configPath: global.config,
    overrides: resolveOverrides(global),
  });
  const state = await loadState(global.state);
  const client = new TraduoraClient(config);
  const api = new TraduoraApi(client);
  return { config, state, api };
}

async function findTermByValue(
  api: TraduoraApi,
  projectId: string,
  termValue: string
): Promise<ProjectTermDTO> {
  const terms = await api.listTerms(projectId);
  const term = terms.find((item) => item.value === termValue);
  if (!term) {
    throw new Error(`Term not found in project ${projectId}: ${termValue}`);
  }
  return term;
}

async function ensureLocaleExists(api: TraduoraApi, projectId: string, localeCode: string): Promise<void> {
  const locales = await api.listProjectLocales(projectId);
  const exists = locales.some((item) => item.locale.code === localeCode);
  if (!exists) {
    await api.addProjectLocale(projectId, localeCode);
  }
}

function buildTranslationRows(
  translations: TermTranslationDTO[],
  terms: ProjectTermDTO[]
): Array<{ term: string; value: string; labels: string[] }> {
  const termMap = new Map(terms.map((term) => [term.id, term.value] as const));
  return translations.map((translation) => ({
    term: termMap.get(translation.termId) ?? translation.termId,
    value: translation.value,
    labels: translation.labels,
  }));
}

function resolveOutputFormat(
  requested: string | undefined,
  fallback: OutputFormat
): OutputFormat {
  if (!requested) {
    return fallback;
  }

  if (!OUTPUT_FORMATS.includes(requested as OutputFormat)) {
    throw new Error(`Invalid --format. Allowed: ${OUTPUT_FORMATS.join(", ")}`);
  }

  return requested as OutputFormat;
}

function extractTermContext(term: ProjectTermDTO): string {
  const context = (term as ProjectTermDTO & { context?: unknown }).context;
  if (context === undefined || context === null) {
    return "";
  }
  if (typeof context === "string") {
    return context;
  }
  return JSON.stringify(context);
}

function labelsAsCsv(labels: string[]): string {
  return labels.join(", ");
}

function outputFormatOption(
  flag = "--format <format>",
  description = `output format (one of: ${OUTPUT_FORMATS.join(", ")})`
): Option {
  return new Option(flag, description).choices(OUTPUT_FORMATS).default("table");
}

async function main(): Promise<void> {
  const program = new Command();

  program
    .name("traduora")
    .description("Traduora CLI")
    .showHelpAfterError()
    .showSuggestionAfterError()
    .option("-c, --config <path>", "path to config file")
    .option("--base-url <url>", "override base URL")
    .option("--token <token>", "use pre-generated access token")
    .option("--state <path>", "state file path for current project/locale")
    .addHelpText(
      "after",
      "\nExamples:\n" +
        "  traduora init --help\n" +
        "  traduora project --help\n" +
        "  traduora term --help\n" +
        "  traduora translation --help\n" +
        "  traduora export --help\n"
    );

  program
    .command("init")
    .description("interactive setup: credentials or account login")
    .option("--url <url>", "Traduora base URL")
    .addOption(
      new Option(
        "--role <role>",
        `role used when creating project client (one of: ${PROJECT_ROLES.join(", ")})`
      )
        .choices(PROJECT_ROLES)
        .default("editor")
    )
    .addHelpText(
      "after",
      "\nExamples:\n" +
        "  traduora init\n" +
        "  traduora init --url https://app.traduora.co --role editor\n"
    )
    .action(async (options: { url?: string; role: string }) => {
      const global = program.opts<GlobalOptions>();
      const role = options.role as ProjectRole;

      await runInit({
        url: options.url ?? global.baseUrl,
        role,
        configPath: global.config,
        statePath: global.state,
      });
    });

  program
    .command("token")
    .description("request access token")
    .addOption(outputFormatOption())
    .action(async (options: FormatOption) => {
      const global = program.opts<GlobalOptions>();
      const config = await resolveConfig({
        configPath: global.config,
        overrides: resolveOverrides(global),
      });
      const token = await requestAccessToken(config);
      const payload = {
        access_token: token.accessToken,
        expires_at: new Date(token.expiresAtEpochMs).toISOString(),
        token_type: token.tokenType,
      };

      const format = resolveOutputFormat(options.format, "table");
      if (format === "json") {
        printJson(payload);
        return;
      }

      printTable(
        [
          {
            token_type: payload.token_type,
            expires_at: payload.expires_at,
            access_token: payload.access_token,
          },
        ],
        [
          { key: "token_type", header: "token_type" },
          { key: "expires_at", header: "expires_at" },
          { key: "access_token", header: "access_token" },
        ]
      );
    });

  const project = program.command("project").description("project operations");

  project
    .command("status")
    .description("show status for current project from state/config")
    .addOption(outputFormatOption())
    .action(async (options: FormatOption) => {
      const global = program.opts<GlobalOptions>();
      const { api, state } = await loadRuntime(global);
      const projectId = requireProjectId(state);
      const status = await api.getProjectStatus(projectId);
      const format = resolveOutputFormat(options.format, "table");

      if (format === "json") {
        printJson({ projectId, status });
        return;
      }

      const stats = status.projectStats;
      const rows: Array<{ metric: string; value: string | number }> = [
        { metric: "progress", value: stats.progress },
        { metric: "translated", value: stats.translated },
        { metric: "total", value: stats.total },
        { metric: "terms", value: stats.terms },
        { metric: "locales", value: stats.locales },
      ];

      printTable(rows, [
        { key: "metric", header: "metric" },
        { key: "value", header: "value" },
      ]);
    });

  const term = program.command("term").description("term operations");

  term
    .command("add")
    .argument("<value>", "term key")
    .option("--label <label>", "label (repeatable or comma-separated)", collect, [])
    .addOption(outputFormatOption())
    .action(async (value: string, options: LabelOption & FormatOption) => {
      const global = program.opts<GlobalOptions>();
      const { api, state } = await loadRuntime(global);
      const projectId = requireProjectId(state);

      const created = await api.addTerm(projectId, value);
      const labels = parseLabels(options.label);
      if (labels.length > 0) {
        await api.setTermLabels(projectId, created.id, created.labels, labels);
      }

      const payload = { projectId, term: created, labelsApplied: labels };
      const format = resolveOutputFormat(options.format, "table");
      if (format === "json") {
        printJson(payload);
        return;
      }

      printTable(
        [
          {
            value: created.value,
            context: extractTermContext(created),
            label: labelsAsCsv(labels.length > 0 ? labels : created.labels),
          },
        ],
        [
          { key: "value", header: "value" },
          { key: "context", header: "context" },
          { key: "label", header: "label" },
        ]
      );
    });

  term
    .command("list")
    .addOption(outputFormatOption())
    .action(async (options: FormatOption) => {
      const global = program.opts<GlobalOptions>();
      const { api, state } = await loadRuntime(global);
      const projectId = requireProjectId(state);
      const terms = await api.listTerms(projectId);
      const format = resolveOutputFormat(options.format, "table");

      if (format === "json") {
        printJson({ projectId, terms });
        return;
      }

      const rows = terms.map((termItem) => ({
        value: termItem.value,
        context: extractTermContext(termItem),
        label: labelsAsCsv(termItem.labels),
      }));

      printTable(rows, [
        { key: "value", header: "value" },
        { key: "context", header: "context" },
        { key: "label", header: "label" },
      ]);
    });

  term
    .command("update")
    .argument("<value>", "current term key")
    .requiredOption("--new-value <value>", "new term key")
    .option("--label <label>", "label (repeatable or comma-separated)", collect, [])
    .addOption(outputFormatOption())
    .action(async (value: string, options: { newValue: string } & LabelOption & FormatOption) => {
      const global = program.opts<GlobalOptions>();
      const { api, state } = await loadRuntime(global);
      const projectId = requireProjectId(state);

      const found = await findTermByValue(api, projectId, value);
      const updated = await api.updateTerm(projectId, found.id, options.newValue);

      const labels = parseLabels(options.label);
      if (labels.length > 0) {
        await api.setTermLabels(projectId, updated.id, updated.labels, labels);
      }

      const payload = { projectId, term: updated, labelsApplied: labels };
      const format = resolveOutputFormat(options.format, "table");
      if (format === "json") {
        printJson(payload);
        return;
      }

      printTable(
        [
          {
            value: updated.value,
            context: extractTermContext(updated),
            label: labelsAsCsv(labels.length > 0 ? labels : updated.labels),
          },
        ],
        [
          { key: "value", header: "value" },
          { key: "context", header: "context" },
          { key: "label", header: "label" },
        ]
      );
    });

  term
    .command("delete")
    .argument("<value>", "term key")
    .addOption(outputFormatOption())
    .action(async (value: string, options: FormatOption) => {
      const global = program.opts<GlobalOptions>();
      const { api, state } = await loadRuntime(global);
      const projectId = requireProjectId(state);

      const found = await findTermByValue(api, projectId, value);
      await api.deleteTerm(projectId, found.id);

      const payload = { projectId, removed: value };
      const format = resolveOutputFormat(options.format, "table");
      if (format === "json") {
        printJson(payload);
        return;
      }

      printTable([{ removed: value }], [{ key: "removed", header: "removed" }]);
    });

  const translation = program
    .command("translation")
    .alias("translate")
    .description("translation operations");

  translation
    .command("use")
    .argument("<locale_code>", "locale code, e.g. en_GB")
    .addOption(outputFormatOption())
    .action(async (localeCode: string, options: FormatOption) => {
      const global = program.opts<GlobalOptions>();
      await updateState(
        (current) => ({
          ...current,
          currentLocale: localeCode,
        }),
        global.state
      );

      const payload = { currentLocale: localeCode };
      const format = resolveOutputFormat(options.format, "table");
      if (format === "json") {
        printJson(payload);
        return;
      }

      printTable([{ locale: localeCode }], [{ key: "locale", header: "locale" }]);
    });

  translation
    .command("list")
    .option("--locale <code>", "locale code")
    .addOption(outputFormatOption())
    .action(async (options: LocaleOption & FormatOption) => {
      const global = program.opts<GlobalOptions>();
      const { api, state } = await loadRuntime(global);
      const projectId = requireProjectId(state);
      const locale = requireLocale(options.locale, state);

      const [translations, terms] = await Promise.all([
        api.listTranslations(projectId, locale),
        api.listTerms(projectId),
      ]);
      const format = resolveOutputFormat(options.format, "table");

      if (format === "json") {
        printJson({ projectId, locale, translations, terms });
        return;
      }

      const rows = buildTranslationRows(translations, terms);
      const tableRows = rows.map((row) => ({
        term: row.term,
        value: row.value,
        label: labelsAsCsv(row.labels),
      }));

      printTable(tableRows, [
        { key: "term", header: "term" },
        { key: "value", header: "value" },
        { key: "label", header: "label" },
      ]);
    });

  const upsertTranslation = async (
    mode: "add" | "update",
    options: {
      term: string;
      value: string;
      locale?: string;
      label?: string[];
      format?: string;
    }
  ): Promise<void> => {
    const global = program.opts<GlobalOptions>();
    const { api, state } = await loadRuntime(global);
    const projectId = requireProjectId(state);
    const locale = requireLocale(options.locale, state);

    await ensureLocaleExists(api, projectId, locale);

    const found = await findTermByValue(api, projectId, options.term);
    const updated = await api.updateTranslation(projectId, locale, found.id, options.value);

    const labels = parseLabels(options.label);
    if (labels.length > 0) {
      await api.setTranslationLabels(projectId, locale, found.id, updated.labels, labels);
    }

    const payload = {
      mode,
      projectId,
      locale,
      translation: {
        termId: found.id,
        term: options.term,
        value: updated.value,
        labels: labels.length > 0 ? labels : updated.labels,
      },
    };

    const format = resolveOutputFormat(options.format, "table");
    if (format === "json") {
      printJson(payload);
      return;
    }

    printTable(
      [
        {
          mode,
          locale,
          term: options.term,
          value: updated.value,
          label: labelsAsCsv(labels.length > 0 ? labels : updated.labels),
        },
      ],
      [
        { key: "mode", header: "mode" },
        { key: "locale", header: "locale" },
        { key: "term", header: "term" },
        { key: "value", header: "value" },
        { key: "label", header: "label" },
      ]
    );
  };

  translation
    .command("add")
    .requiredOption("--term <value>", "term key")
    .requiredOption("--value <text>", "translation value")
    .option("--locale <code>", "locale code")
    .option("--label <label>", "label (repeatable or comma-separated)", collect, [])
    .addOption(outputFormatOption())
    .action(async (options: {
      term: string;
      value: string;
      locale?: string;
      label?: string[];
      format?: string;
    }) => {
      await upsertTranslation("add", options);
    });

  translation
    .command("update")
    .requiredOption("--term <value>", "term key")
    .requiredOption("--value <text>", "translation value")
    .option("--locale <code>", "locale code")
    .option("--label <label>", "label (repeatable or comma-separated)", collect, [])
    .addOption(outputFormatOption())
    .action(async (options: {
      term: string;
      value: string;
      locale?: string;
      label?: string[];
      format?: string;
    }) => {
      await upsertTranslation("update", options);
    });

  translation
    .command("delete")
    .requiredOption("--term <value>", "term key")
    .option("--locale <code>", "locale code")
    .addOption(outputFormatOption())
    .action(async (options: { term: string; locale?: string; format?: string }) => {
      const global = program.opts<GlobalOptions>();
      const { api, state } = await loadRuntime(global);
      const projectId = requireProjectId(state);
      const locale = requireLocale(options.locale, state);

      const found = await findTermByValue(api, projectId, options.term);
      await api.updateTranslation(projectId, locale, found.id, "");

      const payload = {
        projectId,
        locale,
        termId: found.id,
        removedTerm: options.term,
      };
      const format = resolveOutputFormat(options.format, "table");
      if (format === "json") {
        printJson(payload);
        return;
      }

      printTable(
        [{ locale, term: options.term }],
        [
          { key: "locale", header: "locale" },
          { key: "term", header: "term" },
        ]
      );
    });

  program
    .command("export")
    .description("export translated terms for a locale")
    .option("--locale <code>", "locale code")
    .addOption(
      new Option(
        "--format <format>",
        `export format (one of: ${EXPORT_FORMATS.join(", ")})`
      )
        .choices(EXPORT_FORMATS)
        .default("jsonnested")
    )
    .addOption(outputFormatOption("--result-format <format>", "result output format (table or json)"))
    .option("--output <path>", "output file path")
    .addHelpText(
      "after",
      "\nExamples:\n" +
        "  traduora export --format jsonnested --output ./i18n/en_GB.json\n" +
        "  traduora export --format csv --locale ja\n"
    )
    .action(async (options: {
      locale?: string;
      format: string;
      resultFormat?: string;
      output?: string;
    }) => {
      const global = program.opts<GlobalOptions>();
      const { api, state } = await loadRuntime(global);
      const projectId = requireProjectId(state);
      const locale = requireLocale(options.locale, state);

      const format = options.format as ExportFormat;
      if (!EXPORT_FORMATS.includes(format)) {
        throw new Error(`Invalid --format. Allowed: ${EXPORT_FORMATS.join(", ")}`);
      }

      const data = await api.exportProject(projectId, locale, format);
      const outputPath = path.resolve(
        options.output ?? `${projectId}.${locale}.${format}`
      );
      await writeFile(outputPath, data);

      const payload = { projectId, locale, format, output: outputPath, bytes: data.byteLength };
      const resultFormat = resolveOutputFormat(options.resultFormat, "table");
      if (resultFormat === "json") {
        printJson(payload);
        return;
      }

      printTable(
        [
          {
            locale,
            export_format: format,
            output: outputPath,
            bytes: data.byteLength,
          },
        ],
        [
          { key: "locale", header: "locale" },
          { key: "export_format", header: "export_format" },
          { key: "output", header: "output" },
          { key: "bytes", header: "bytes" },
        ]
      );
    });

  try {
    await program.parseAsync(process.argv);
  } finally {
    closePromptInterface();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
