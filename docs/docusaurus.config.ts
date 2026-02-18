import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Traduora CLI Next",
  tagline: "CLI + JS SDK for Traduora",
  favicon: "img/logo.svg",
  url: "https://example.com",
  baseUrl: "/",
  organizationName: "flyinglimao",
  projectName: "traduora-cli",
  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh-Hant", "zh-Hans", "ja"],
    localeConfigs: {
      en: { label: "English" },
      "zh-Hant": { label: "繁體中文" },
      "zh-Hans": { label: "简体中文" },
      ja: { label: "日本語" },
    },
  },
  presets: [
    [
      "classic",
      {
        docs: {
          path: "content",
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
        },
        blog: false,
        pages: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: "Traduora CLI Next",
      logo: {
        alt: "Traduora CLI Next",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Docs",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
        {
          href: "https://github.com/ever-co/ever-traduora",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "/",
            },
            {
              label: "CLI",
              to: "/cli",
            },
            {
              label: "SDK",
              to: "/sdk",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Traduora CLI Next`,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
