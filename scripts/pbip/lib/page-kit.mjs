import { PAGE_GRID, regionToRect } from "./grid.mjs";
import { card, textbox } from "./visuals.mjs";

export const COLORS = {
  ink: "#1F1B16",
  muted: "#6B6257",
  rule: "#E7E1D8",
  paper: "#FAF7F0",
  card: "#FFFFFF",
  amber: "#B45309",
  teal: "#0F766E",
  indigo: "#3730A3",
  purple: "#6B21A8",
  olive: "#4D7C0F",
  cyan: "#0E7490",
  red: "#B91C1C",
  neutral: "#78716C",
};

export function pageTitle({ id, title, subtitle }) {
  return textbox({
    id,
    rect: regionToRect(PAGE_GRID.header),
    title,
    subtitle,
    alt: `${title}. ${subtitle}`,
  });
}

export function kpiCard({
  id,
  slot,
  measure,
  label,
  color = COLORS.ink,
  displayUnits = null,
  precision = null,
  accent = null,
  alt,
}) {
  return card({
    id,
    rect: regionToRect(PAGE_GRID.kpis, { slot, of: 5 }),
    measure,
    label,
    valueColor: color,
    displayUnits,
    precision,
    accent,
    alt,
  });
}
