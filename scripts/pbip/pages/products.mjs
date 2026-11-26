import { PAGE_GRID, alignRect, regionToRect } from "../lib/grid.mjs";
import { COLORS, kpiCard, pageTitle } from "../lib/page-kit.mjs";
import {
  barChart,
  button,
  col,
  meas,
  scatterChart,
  slicer,
  table,
} from "../lib/visuals.mjs";

const PAGE_ID = "c3d4e5f60718293a4b5c";
const REGIONS = {
  ...PAGE_GRID,
  hero: [1, 5, 8, 9],
  scatter: [8, 5, 13, 9],
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
const CATEGORY_SLICER = alignRect(FILTERS, {
  width: 200,
  height: 80,
  x: FILTERS.x + 360,
  y: FILTERS.y,
});

export function buildProducts() {
  return {
    id: PAGE_ID,
    displayName: "Products",
    visuals: [
      pageTitle({
        id: "c1000000000000000001",
        title:
          "Health & beauty is the R$867K engine — bed & bath drags satisfaction",
        subtitle:
          "Product categories · 2018 YTD · delivered revenue · top 10",
      }),
      button({
        id: "c1000000000000000002",
        rect: BACK_BUTTON,
        label: "← Overview",
        action: "Back",
        alt: "Return to the Overview page.",
      }),
      slicer({
        id: "c1000000000000000003",
        rect: YEAR_SLICER,
        table: "Date",
        column: "Year Label",
        header: "Year",
        selection: "2018 YTD",
        alt: "Filter the page by year. Defaults to 2018 year to date.",
      }),
      slicer({
        id: "c1000000000000000004",
        rect: CATEGORY_SLICER,
        table: "Product Category",
        column: "Category",
        header: "Category",
        alt: "Filter the page by product category.",
      }),
      kpiCard({
        id: "c1000000000000000005",
        slot: 1,
        measure: "Revenue",
        label: "REVENUE · 2018 YTD",
        color: COLORS.amber,
        displayUnits: 1000000,
        precision: 1,
        accent: COLORS.amber,
        alt: "Delivered category revenue for 2018 year to date.",
      }),
      kpiCard({
        id: "c1000000000000000006",
        slot: 2,
        measure: "Top Category",
        label: "TOP CATEGORY",
        alt: "The category with the highest delivered revenue.",
      }),
      kpiCard({
        id: "c1000000000000000007",
        slot: 3,
        measure: "Top 3 Category Share",
        label: "TOP 3 CATEGORY SHARE",
        displayUnits: 1,
        precision: 1,
        alt: "Share of revenue concentrated in the top three categories.",
      }),
      kpiCard({
        id: "c1000000000000000008",
        slot: 4,
        measure: "Avg Review Score",
        label: "AVG REVIEW SCORE",
        color: COLORS.olive,
        displayUnits: 1,
        precision: 2,
        alt: "Average review score across visible categories.",
      }),
      kpiCard({
        id: "c1000000000000000009",
        slot: 5,
        measure: "Cancel Rate",
        label: "CANCEL RATE",
        displayUnits: 1,
        precision: 1,
        alt: "Share of orders that were cancelled.",
      }),
      barChart({
        id: "c100000000000000000a",
        rect: regionToRect(REGIONS.hero),
        category: col("Product Category", "Category"),
        measure: "Revenue",
        title: "Top 10 categories by revenue",
        subtitle: "2018 YTD · delivered revenue",
        color: COLORS.amber,
        topN: {
          entityTable: "Product Category",
          entityColumn: "Category",
          aggregateTable: "Order Items",
          aggregateColumn: "Gross Value",
          n: 10,
        },
        alt: "Ranked bar chart of the ten highest-revenue product categories in 2018. Health and beauty leads.",
      }),
      scatterChart({
        id: "c100000000000000000b",
        rect: regionToRect(REGIONS.scatter),
        category: col("Product Category", "Category"),
        xMeasure: "Avg Review Score",
        yMeasure: "Revenue",
        sizeMeasure: "Delivered Orders",
        title: "Revenue vs satisfaction",
        subtitle: "Bubble size = delivered orders · top 10 categories",
        pointColor: COLORS.indigo,
        topN: {
          entityTable: "Product Category",
          entityColumn: "Category",
          aggregateTable: "Order Items",
          aggregateColumn: "Gross Value",
          n: 10,
        },
        alt: "Scatter chart plotting category revenue against average review score for the top ten categories. Bed and bath sits below the report average review score.",
      }),
      table({
        id: "c100000000000000000c",
        rect: regionToRect(REGIONS.detail),
        fields: [
          col("Product Category", "Category"),
          meas("Revenue"),
          meas("Revenue Share"),
          meas("Delivered Orders"),
          meas("AOV"),
          meas("Avg Review Score"),
          meas("Cancel Rate"),
        ],
        title: "Category quality table",
        subtitle: "2018 YTD · delivered revenue · scroll for all categories",
        sortBy: meas("Revenue"),
        sortDirection: "Descending",
        alt: "Table of product categories with revenue, revenue share, delivered orders, average order value, average review score and cancellation rate.",
      }),
    ],
  };
}

export const productsPage = {
  id: PAGE_ID,
  displayName: "Products",
  build: buildProducts,
};
