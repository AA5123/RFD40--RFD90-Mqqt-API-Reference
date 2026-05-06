import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "RFD40 / RFD90 API Reference",
  tagline: "MQTT-based API for Zebra RFD40 / RFD90 RFID readers",

  // Set the production URL of your site here
  url: "https://your-org.github.io",
  // For GitHub Pages: /<repo-name>/
  baseUrl: "/",

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  // ---------------------------------------------------------------------------
  // Plugins
  // ---------------------------------------------------------------------------
  plugins: [
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "rfid-api",
        docsPluginId: "classic", // must match the preset's docs plugin id
        config: {
          rfidApi: {
            // Path to the generated OpenAPI spec (relative to this file)
            specPath: "../docs/openapi_md.json",

            // Output directory for generated MDX (gitignored)
            outputDir: "docs/api",

            // Hide the "Send Request" button – this is an MQTT API, not HTTP
            hideSendButton: true,

            // Custom Mustache template for operation pages
            // Renders x-error-codes as a table in addition to the default layout
            template: "api.mustache",

            // Tell Docusaurus to use the theme's enhanced ApiItem component
            // which adds the Try-It console, schema display, etc.
            // We override it in docusaurus.config to hide the send button.
            sidebarOptions: {
              groupPathsBy: "tagGroup",
              categoryLinkSource: "tag",
            },
          },
        },
      },
    ],
  ],

  // ---------------------------------------------------------------------------
  // Presets
  // ---------------------------------------------------------------------------
  presets: [
    [
      "classic",
      {
        docs: {
          // docs live in docusaurus/docs/
          path: "docs",
          routeBasePath: "docs",
          sidebarPath: "./sidebars.ts",
          docItemComponent: "@theme/ApiItem",
        },
        blog: false, // No blog needed
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  // ---------------------------------------------------------------------------
  // Theme
  // ---------------------------------------------------------------------------
  themeConfig: {
    navbar: {
      title: "RFD40 / RFD90 API",
      items: [
        {
          type: "docSidebar",
          sidebarId: "mainSidebar",
          position: "left",
          label: "Docs",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} Zebra Technologies. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["json", "bash"],
    },
  } satisfies Preset.ThemeConfig,

  // ---------------------------------------------------------------------------
  // Themes
  // ---------------------------------------------------------------------------
  themes: ["docusaurus-theme-openapi-docs"],
};

export default config;
