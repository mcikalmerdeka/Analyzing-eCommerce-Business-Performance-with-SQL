// Grid math for the 1920x1080, 12x12 PBIR canvas.
export const CANVAS = {
  width: 1920,
  height: 1080,
  margin: 32,
  gutter: 24,
  snap: 8,
  columns: 12,
  rows: 12,
};

export const snap = (value, step = CANVAS.snap) =>
  Math.round(value / step) * step;

export function regionToRect(region, { slot, of, canvas = CANVAS } = {}) {
  const [c1, r1, c2, r2] = region;
  if (c1 < 1 || r1 < 1 || c2 > canvas.columns + 1 || r2 > canvas.rows + 1) {
    throw new Error(`Region out of bounds: ${JSON.stringify(region)}`);
  }

  const cols = c2 - c1;
  const rows = r2 - r1;
  const cellW =
    (canvas.width - 2 * canvas.margin - (canvas.columns - 1) * canvas.gutter) /
    canvas.columns;
  const cellH =
    (canvas.height - 2 * canvas.margin - (canvas.rows - 1) * canvas.gutter) /
    canvas.rows;

  let x = canvas.margin + (c1 - 1) * (cellW + canvas.gutter);
  let y = canvas.margin + (r1 - 1) * (cellH + canvas.gutter);
  let width = cols * cellW + (cols - 1) * canvas.gutter;
  let height = rows * cellH + (rows - 1) * canvas.gutter;

  if (slot && of) {
    if (slot < 1 || slot > of) throw new Error(`Invalid slot ${slot}/${of}`);
    if (width >= height) {
      const slotW = (width - (of - 1) * canvas.gutter) / of;
      x += (slot - 1) * (slotW + canvas.gutter);
      width = slotW;
    } else {
      const slotH = (height - (of - 1) * canvas.gutter) / of;
      y += (slot - 1) * (slotH + canvas.gutter);
      height = slotH;
    }
  }

  return {
    x: snap(x),
    y: snap(y),
    width: snap(width),
    height: snap(height),
  };
}

export function stackRects(rect, count, gap = 8) {
  const height = (rect.height - (count - 1) * gap) / count;
  return Array.from({ length: count }, (_, i) => ({
    x: rect.x,
    y: snap(rect.y + i * (height + gap)),
    width: rect.width,
    height: snap(height),
  }));
}

// Place a fixed-size child inside a region rect.
export function alignRect(
  rect,
  { width = rect.width, height = rect.height, x = "left", y = "top" } = {},
) {
  const left =
    typeof x === "number" ? x : x === "right" ? rect.x + rect.width - width : x === "center" ? rect.x + (rect.width - width) / 2 : rect.x;
  const top =
    typeof y === "number" ? y : y === "bottom" ? rect.y + rect.height - height : y === "middle" ? rect.y + (rect.height - height) / 2 : rect.y;
  return {
    x: snap(left),
    y: snap(top),
    width: snap(width),
    height: snap(height),
  };
}

export const PAGE_GRID = {
  header: [1, 1, 9, 3],
  filters: [9, 1, 13, 3],
  kpis: [1, 3, 13, 5],
  content: [1, 5, 13, 13],
};
