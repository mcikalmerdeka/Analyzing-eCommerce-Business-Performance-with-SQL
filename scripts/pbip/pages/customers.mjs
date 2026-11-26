import { PAGE_GRID, alignRect, regionToRect } from "../lib/grid.mjs";
import { COLORS, kpiCard, pageTitle } from "../lib/page-kit.mjs";
import {
  barChart,
  button,
  col,
  comboChart,
  meas,
  slicer,
  table,
} from "../lib/visuals.mjs";

const PAGE_ID = "b2c3d4e5f60718293a4b";
const REGIONS = {
  ...PAGE_GRID,
  trend: [1, 5, 7, 9],
  frequency: [7, 5, 13, 9],
  detail: [1, 9, 13, 13],
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

export function buildCustomers() {
  return {
    id: PAGE_ID,
    displayName: "Customers",
    visuals: [
      pageTitle({
        id: "b1000000000000000001",
        title: "96.9% of buyers never place a second order",
        subtitle:
          "Customer activity · full period · unique buyers · 2016 is partial",
      }),
      button({
        id: "b1000000000000000002",
        rect: BACK_BUTTON,
        label: "← Overview",
        action: "Back",
        alt: "Return to the Overview page.",
      }),
      slicer({
        id: "b1000000000000000003",
        rect: YEAR_SLICER,
        table: "Date",
        column: "Year Label",
        header: "Year",
        alt: "Filter the page by year. All years are shown by default.",
      }),
      slicer({
        id: "b1000000000000000004",
        rect: STATE_SLICER,
        table: "Geography",
        column: "State",
        header: "State",
        alt: "Filter the page by Brazilian state.",
      }),
      kpiCard({
        id: "b1000000000000000005",
        slot: 1,
        measure: "MAU",
        label: "MONTHLY ACTIVE BUYERS",
        color: COLORS.indigo,
        displayUnits: 1,
        precision: 0,
        accent: COLORS.indigo,
        alt: "Average monthly active buyers across the visible period.",
      }),
      kpiCard({
        id: "b1000000000000000006",
        slot: 2,
        measure: "Customers",
        label: "UNIQUE BUYERS",
        displayUnits: 1,
        precision: 0,
        alt: "Unique buyers in the visible period.",
      }),
      kpiCard({
        id: "b1000000000000000007",
        slot: 3,
        measure: "Lifetime Repeat Customers",
        label: "REPEAT BUYERS",
        displayUnits: 1,
        precision: 0,
        alt: "Buyers who ever placed more than one order.",
      }),
      kpiCard({
        id: "b1000000000000000008",
        slot: 4,
        measure: "Lifetime Repeat Rate",
        label: "LIFETIME REPEAT RATE",
        displayUnits: 1,
        precision: 1,
        alt: "Share of buyers who ever place a second order.",
      }),
      kpiCard({
        id: "b1000000000000000009",
        slot: 5,
        measure: "Avg Orders per Customer",
        label: "AVG ORDERS PER BUYER",
        displayUnits: 1,
        precision: 2,
        alt: "Average number of orders per buyer.",
      }),
      comboChart({
        id: "b100000000000000000a",
        rect: regionToRect(REGIONS.trend),
        category: col("Date", "Year Month"),
        columns: ["New Customers"],
        lines: ["Customers"],
        title: "Active buyers vs new buyers",
        subtitle: "Monthly · columns = first-time buyers, line = active buyers",
        columnColor: COLORS.teal,
        lineColor: COLORS.indigo,
        alt: "Combo chart of monthly first-time buyers as columns and active buyers as a line. Acquisition grows while active buyers track it closely.",
      }),
      barChart({
        id: "b100000000000000000b",
        rect: regionToRect(REGIONS.frequency),
        category: col("Customers", "Order Frequency"),
        measure: "Customer Count",
        title: "Lifetime order frequency",
        subtitle: "Buyers by number of lifetime orders",
        color: COLORS.indigo,
        sort: "category_asc",
        labelUnits: 1,
        labelPrecision: 0,
        alt: "Bar chart of buyers grouped by lifetime order count. One order dominates; repeat buyers are a small tail.",
      }),
      table({
        id: "b100000000000000000c",
        rect: regionToRect(REGIONS.detail),
        fields: [
          col("Date", "Year Label"),
          meas("MAU"),
          meas("New Customers"),
          meas("Returning Customers"),
          meas("Customer Retention %"),
          meas("Avg Orders per Customer"),
        ],
        title: "Year-by-year customer activity",
        subtitle: "Within-year repeat rate; 2016 is a partial year",
        sortBy: col("Date", "Year Label"),
        sortDirection: "Ascending",
        alt: "Table of monthly active buyers, new buyers, returning buyers, within-year retention and average orders per buyer for 2016, 2017 and 2018.",
      }),
    ],
  };
}

export const customersPage = {
  id: PAGE_ID,
  displayName: "Customers",
  build: buildCustomers,
};
