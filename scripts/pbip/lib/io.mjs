import fs from "node:fs";
import path from "node:path";

export const PAGE_SCHEMA =
  "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/page/2.1.0/schema.json";
export const PAGES_SCHEMA =
  "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/pagesMetadata/1.1.0/schema.json";

export function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function pageJson(page) {
  return {
    $schema: PAGE_SCHEMA,
    name: page.id,
    displayName: page.displayName,
    displayOption: "FitToPage",
    height: 1080,
    width: 1920,
    objects: {
      background: [
        {
          properties: {
            color: {
              solid: {
                color: { expr: { Literal: { Value: "'#FAF7F0'" } } },
              },
            },
            transparency: { expr: { Literal: { Value: "0D" } } },
          },
        },
      ],
    },
  };
}

function cleanVisuals(pageDir, keep) {
  const visualsDir = path.join(pageDir, "visuals");
  if (!fs.existsSync(visualsDir)) return;
  for (const entry of fs.readdirSync(visualsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (!keep.has(entry.name)) {
      fs.rmSync(path.join(visualsDir, entry.name), {
        recursive: true,
        force: true,
      });
    }
  }
}

export function writePage(reportDir, page) {
  const pageDir = path.join(reportDir, "definition", "pages", page.id);
  const keep = new Set(page.visuals.map((v) => v.name));
  cleanVisuals(pageDir, keep);
  writeJson(path.join(pageDir, "page.json"), pageJson(page));
  for (const visual of page.visuals) {
    writeJson(
      path.join(pageDir, "visuals", visual.name, "visual.json"),
      visual,
    );
  }
}

export function writePagesJson(reportDir, pages, activePageId) {
  writeJson(path.join(reportDir, "definition", "pages", "pages.json"), {
    $schema: PAGES_SCHEMA,
    pageOrder: pages.map((p) => p.id),
    activePageName: activePageId,
  });
}
