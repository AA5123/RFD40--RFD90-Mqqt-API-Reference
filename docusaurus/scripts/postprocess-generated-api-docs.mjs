import fs from "node:fs";
import path from "node:path";

const docsApiDir = path.resolve("docs/api");
const sidebarPath = path.join(docsApiDir, "sidebar.ts");

if (!fs.existsSync(docsApiDir) || !fs.existsSync(sidebarPath)) {
  console.log("[postprocess-generated-api-docs] docs/api not found; skipping.");
  process.exit(0);
}

const tagFiles = fs
  .readdirSync(docsApiDir)
  .filter((fileName) => fileName.endsWith(".tag.mdx"));

const tagSlugs = tagFiles.map((fileName) => fileName.replace(/\.tag\.mdx$/, ""));

for (const fileName of tagFiles) {
  const filePath = path.join(docsApiDir, fileName);
  const slug = fileName.replace(/\.tag\.mdx$/, "");
  const content = fs.readFileSync(filePath, "utf8");
  const updated = content.replace(/^id:\s+(.+)$/m, `id: tag-${slug}`);

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, "utf8");
  }
}

let sidebarContent = fs.readFileSync(sidebarPath, "utf8");

const sidebarLines = sidebarContent.split(/\r?\n/);
let insideLinkBlock = false;

for (let index = 0; index < sidebarLines.length; index += 1) {
  const trimmedLine = sidebarLines[index].trim();

  if (trimmedLine === "link: {") {
    insideLinkBlock = true;
    continue;
  }

  if (insideLinkBlock && trimmedLine === "},") {
    insideLinkBlock = false;
    continue;
  }

  if (!insideLinkBlock) {
    continue;
  }

  const idMatch = trimmedLine.match(/^id: "api\/(.+)",$/);

  if (!idMatch) {
    continue;
  }

  const slug = idMatch[1];

  if (!tagSlugs.includes(slug)) {
    continue;
  }

  sidebarLines[index] = sidebarLines[index].replace(
    `api/${slug}`,
    `api/tag-${slug}`
  );
}

sidebarContent = sidebarLines.join("\n");

fs.writeFileSync(sidebarPath, sidebarContent, "utf8");
console.log(`[postprocess-generated-api-docs] Updated ${tagSlugs.length} tag docs and sidebar links.`);
