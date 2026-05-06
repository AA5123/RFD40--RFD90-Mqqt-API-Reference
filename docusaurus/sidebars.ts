import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";
import * as fs from "node:fs";
import * as path from "node:path";
// ---------------------------------------------------------------------------
// Safe import of the generated API sidebar.
// The file only exists after `npm run gen-api-docs` has been run.
// Before first generation, fall back to a placeholder doc so `npm start` and
// `npm run build` do not crash with a missing-module error.
// ---------------------------------------------------------------------------
const apiSidebarPath = path.join(__dirname, "docs/api/sidebar.ts");
let generatedApiSidebar: any[] = [];
if (fs.existsSync(apiSidebarPath)) {
 // eslint-disable-next-line @typescript-eslint/no-require-imports
 generatedApiSidebar =
   (require("./docs/api/sidebar") as { default?: any[] }).default ?? [];
} else {
 console.warn(
   "[sidebars.ts] docs/api/sidebar.ts not found — run `npm run gen-api-docs` to generate the API reference."
 );
}
// ---------------------------------------------------------------------------
// Sidebar definitions
// ---------------------------------------------------------------------------
const sidebars: SidebarsConfig = {
 mainSidebar: [
   {
     type: "category",
     label: "Overview",
     collapsed: false,
     items: ["intro"],
   },
   {
     type: "category",
     label: "Getting Started",
     collapsed: false,
     items: [
       "get-started",
       "reader-setup-workflow",
       "connection",
       "topics",
       "message-format",
       "authentication",
       "troubleshooting",
     ],
   },
   {
     type: "category",
     label: "API Reference",
     collapsed: false,
     items:
       generatedApiSidebar.length > 0
         ? generatedApiSidebar
         : ["api/placeholder"],
   },
 ],
};
export default sidebars;