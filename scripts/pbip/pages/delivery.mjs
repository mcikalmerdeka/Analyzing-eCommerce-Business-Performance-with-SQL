import { PAGE_GRID, alignRect, regionToRect } from "../lib/grid.mjs";
import { COLORS, kpiCard, pageTitle } from "../lib/page-kit.mjs";
import {
  barChart,
  button,
  col,
  columnChart,
  comboChart,
  slicer,
} from "../lib/visuals.mjs";

const PAGE_ID = "e5f60718293a4b5c6d7e";
const REGIONS = {
  ...PAGE_GRID,
  trend: [1, 5, 8, 9],
  states: [8, 5, 13, 9],
  distribution: [1, 9, 7, 13],
  reviews: [7, 9, 13, 13],
};

const FILTERS = regionToRect(REGIONS.filters);
const BACK_BUTTON = alignRect(FILTERS, {
  width: 128,
  height: 44,
  x: FILTERS.x,
  y: FILTERS.y + 18,
});
const YEAR_SLICER = alignRect(FILTERS, {
  width: 200,
  height: 80,
  x: FILTERS.x + 144,
  y: FILTERS.y,
});
const STATE_SLICER = alignRect(FILTERS, {
  width: 200,
  height: 80,
  x: FILTERS.x + 360,
  y: FILTERS.y,
});

export function buildDelivery() {
  return {
    id: PAGE_ID,
    displayName: "Delivery",
    visuals: [
      pageTitle({
        id: "e1000000000000000001",
        title:
          "Late deliveries rose to 9.4% — and they score 2.58★ vs 4.30★",
        subtitle: "Delivery performance · 2018 YTD · delivered orders",
      }),
      button({
        id: "e1000000000000000002",
        rect: BACK_BUTTON,
        label: "← Overview",
        action: "Back",
        alt: "Return to the Overview page.",
      }),
      slicer({
        id: "e1000000000000000003",
        rect: YEAR_SLICER,
        table: "Date",
        column: "Year Label",
        header: "Year",
        selection: "2018 YTD",
        alt: "Filter the page by year. Defaults to 2018 year to date.",
      }),
      slicer({
        id: "e1000000000000000004",
        rect: STATE_SLICER,
        table: "Geography",
        column: "State",
        header: "State",
        alt: "Filter the page by Brazilian state.",
      }),
      kpiCard({
        id: "e1000000000000000005",
        slot: 1,
        measure: "On-Time Rate",
        label: "ON-TIME RATE",
        color: COLORS.cyan,
        displayUnits: 1,
        precision: 1,
        accent: COLORS.cyan,
        alt: "Share of delivered orders that arrived on or before the promised date.",
      }),
      kpiCard({
        id: "e1000000000000000006",
        slot: 2,
        measure: "Avg Delivery Days",
        label: "AVG DELIVERY DAYS",
        displayUnits: 1,
        precision: 1,
        alt: "Average days from purchase to delivery.",
      }),
      kpiCard({
        id: "e1000000000000000007",
        slot: 3,
        measure: "Late Orders",
        label: "LATE ORDERS",
        displayUnits: 1,
        precision: 0,
        alt: "Number of delivered orders that arrived after the promised date.",
      }),
      kpiCard({
        id: "e1000000000000000008",
        slot: 4,
        measure: "Avg Delay Days",
        label: "AVG DELAY DAYS",
        displayUnits: 1,
        precision: 1,
        alt: "Average number of days a late order is overdue.",
      }),
      kpiCard({
        id: "e1000000000000000009",
        slot: 5,
        measure: "Late Review Score",
        label: "LATE REVIEW SCORE",
        color: COLORS.red,
        displayUnits: 1,
        precision: 2,
        alt: "Average review score for late deliveries, 2.58 out of 5.",
      }),
      comboChart({
        id: "e100000000000000000a",
        rect: regionToRect(REGIONS.trend),
        category: col("Date", "Year Month"),
        columns: ["Late Rate"],
        lines: ["Avg Delivery Days"],
        title: "Late rate and delivery time by month",
        subtitle: "2018 YTD · delivered orders",
        columnColor: COLORS.red,
        lineColor: COLORS.cyan,
        alt: "Combo chart of monthly late-delivery rate as columns and average delivery days as a line. Late rate rises through 2018.",
      }),
      barChart({
        id: "e100000000000000000b",
        rect: regionToRect(REGIONS.states),
        category: col("Geography", "State"),
        measure: "Late Rate",
        title: "Late rate by state — top 10",
        subtitle: "2018 YTD · worst late-delivery rates",
        color: COLORS.red,
        topN: {
          entityTable: "Geography",
          entityColumn: "State",
          aggregateTable: "Orders",
          aggregateColumn: "Is Late",
          aggregateFunction: 1,
          n: 10,
        },
        alt: "Bar chart ranking the ten states with the worst late-delivery rates. North-eastern states lead.",
      }),
      columnChart({
        id: "e100000000000000000c",
        rect: regionToRect(REGIONS.distribution),
        category: col("Orders", "Delivery Days Bucket"),
        measure: "Delivered with Date",
        title: "Delivery time distribution",
        subtitle: "Delivered orders · days from purchase",
        color: COLORS.cyan,
        sort: "category_asc",
        labelUnits: 1,
        labelPrecision: 0,
        alt: "Column chart of delivered orders by delivery-time bucket. Most orders arrive within fourteen days.",
      }),
      barChart({
        id: "e100000000000000000d",
        rect: regionToRect(REGIONS.reviews),
        category: col("Orders", "Late Label"),
        measure: "Avg Review Score",
        title: "Review score by lateness",
        subtitle: "Late 2.58★ vs on-time 4.30★",
        color: COLORS.olive,
        sort: "category_asc",
        labelUnits: 1,
        labelPrecision: 2,
        alt: "Bar chart comparing average review scores for late and on-time deliveries. Late orders score 2.58 versus 4.30 for on-time orders.",
      }),
    ],
  };
}

export const deliveryPage = {
  id: PAGE_ID,
  displayName: "Delivery",
  build: buildDelivery,
};
