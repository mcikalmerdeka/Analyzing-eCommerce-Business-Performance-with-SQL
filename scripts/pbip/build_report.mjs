import path from "node:path";
import { fileURLToPath } from "node:url";
import { writePage, writePagesJson } from "./lib/io.mjs";
import { activePageId, pageOrder } from "./report-model.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const reportDir = path.join(root, "ecommerce_pbi.Report");

let built = 0;
for (const page of pageOrder) {
  if (typeof page.build !== "function") continue;
  const definition = page.build();
  writePage(reportDir, definition);
  built += 1;
}

writePagesJson(
  reportDir,
  pageOrder.map((page) => ({ id: page.id })),
  activePageId,
);

console.log(`Generated ${built} page(s) from ${pageOrder.length} page slots.`);
