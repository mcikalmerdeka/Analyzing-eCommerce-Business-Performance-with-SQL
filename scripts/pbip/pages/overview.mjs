import { PAGE_GRID, alignRect, regionToRect } from "../lib/grid.mjs";
import { COLORS, kpiCard, pageTitle } from "../lib/page-kit.mjs";
import {
  barChart,
  button,
  col,
  donutChart,
  lineChart,
  slicer,
  textbox,
} from "../lib/visuals.mjs";

const PAGE_ID = "a1b2c3d4e5f60718293a";
const REGIONS = {
  ...PAGE_GRID,
  trend: [1, 5, 8, 10],
  geography: [8, 5, 13, 10],
  payments: [1, 10, 5, 13],
  categories: [5, 10, 8, 13],
  insights: [8, 10, 11, 13],
  nav: [11, 10, 13, 13],
};

const FILTERS = regionToRect(REGIONS.filters);
const STATE_SLICER = alignRect(FILTERS, {
  width: 216,
  height: 80,
  x: "right",
  y: FILTERS.y,
});
const RESET_BUTTON = alignRect(FILTERS, {
  width: 152,
  height: 44,
  x: FILTERS.x + FILTERS.width - 216 - 24 - 152,
  y: FILTERS.y + 18,
});
const NAV = regionToRect(REGIONS.nav);

const NAV_ITEMS = [
  {
    id: "a1000000000000000010",
    label: "Customers →",
    target: "b2c3d4e5f60718293a4b",
    alt: "Go to the Customers retention page.",
    primary: true,
  },
  {
    id: "a1000000000000000011",
    label: "Products →",
    target: "c3d4e5f60718293a4b5c",
    alt: "Go to the Products category page.",
  },
  {
    id: "a1000000000000000012",
    label: "Payments →",
    target: "d4e5f60718293a4b5c6d",
    alt: "Go to the Payments page.",
  },
  {
    id: "a1000000000000000013",
    label: "Delivery →",
    target: "e5f60718293a4b5c6d7e",
    alt: "Go to the Delivery reliability page.",
  },
];

export function buildOverview() {
  return {
    id: PAGE_ID,
    displayName: "Overview",
    visuals: [
      pageTitle({
        id: "a1000000000000000001",
        title: "R$15.4M in 23 months — growth plateaued at ~R$1M a month",
        subtitle:
          "Olist marketplace · Sep 2016 – Aug 2018 · delivered revenue in BRL",
      }),
      slicer({
        id: "a1000000000000000002",
        rect: STATE_SLICER,
        table: "Geography",
        column: "State",
        header: "State",
        alt: "Filter the page by Brazilian state.",
      }),
      button({
        id: "a1000000000000000003",
        rect: RESET_BUTTON,
        label: "Reset filters",
        action: "ClearAllSlicers",
        alt: "Clear the state filter and return to the full-period view.",
      }),
      kpiCard({
        id: "a1000000000000000004",
        slot: 1,
        measure: "Revenue",
        label: "REVENUE · BRL",
        color: COLORS.amber,
        displayUnits: 1000000,
        precision: 1,
        accent: COLORS.amber,
        alt: "Total delivered revenue is 15.4 million Brazilian reais.",
      }),
      kpiCard({
        id: "a1000000000000000005",
        slot: 2,
        measure: "Delivered Orders",
        label: "DELIVERED ORDERS",
        displayUnits: 1,
        precision: 0,
        alt: "The report covers 96,478 delivered orders.",
      }),
      kpiCard({
        id: "a1000000000000000006",
        slot: 3,
        measure: "AOV",
        label: "AVERAGE ORDER VALUE",
        displayUnits: 1,
        precision: 2,
        alt: "Average order value is 159.83 Brazilian reais.",
      }),
      kpiCard({
        id: "a1000000000000000007",
        slot: 4,
        measure: "Customers",
        label: "UNIQUE BUYERS",
        displayUnits: 1,
        precision: 0,
        alt: "The window contains 96,090 unique buyers.",
      }),
      kpiCard({
        id: "a1000000000000000008",
        slot: 5,
        measure: "Avg Review Score",
        label: "AVG REVIEW SCORE",
        color: COLORS.olive,
        displayUnits: 1,
        precision: 2,
        alt: "The average review score is 4.09 out of 5.",
      }),
      lineChart({
        id: "a1000000000000000009",
        rect: regionToRect(REGIONS.trend),
        category: col("Date", "Year Month"),
        measures: ["Revenue", "Revenue 3M Avg"],
        title: "Monthly revenue — growth plateaued after November 2017",
        subtitle: "Delivered revenue · 3-month rolling average",
        seriesColors: [
          { measure: "Revenue", color: COLORS.amber },
          { measure: "Revenue 3M Avg", color: COLORS.muted, dashed: true },
        ],
        alt: "Line chart of monthly delivered revenue with a three-month rolling average. Revenue rises to a November 2017 peak and then flattens near one million reais a month.",
      }),
      barChart({
        id: "a100000000000000000a",
        rect: regionToRect(REGIONS.geography),
        category: col("Geography", "State"),
        measure: "Revenue",
        title: "Revenue by state — top 10",
        subtitle: "Full period · delivered revenue",
        color: COLORS.amber,
        topN: {
          entityTable: "Geography",
          entityColumn: "State",
          aggregateTable: "Order Items",
          aggregateColumn: "Gross Value",
          n: 10,
        },
        alt: "Horizontal bar chart ranking the ten Brazilian states with the most delivered revenue. São Paulo leads.",
      }),
      donutChart({
        id: "a100000000000000000b",
        rect: regionToRect(REGIONS.payments),
        category: col("Payments", "Payment Type"),
        measure: "Payment Value",
        title: "Payment value mix",
        subtitle: "All statuses · full period",
        alt: "Donut chart of payment value by type. Credit card carries 78 percent of value.",
      }),
      barChart({
        id: "a100000000000000000c",
        rect: regionToRect(REGIONS.categories),
        category: col("Product Category", "Category"),
        measure: "Revenue",
        title: "Top 5 categories",
        subtitle: "Full period · delivered revenue",
        color: COLORS.amber,
        topN: {
          entityTable: "Product Category",
          entityColumn: "Category",
          aggregateTable: "Order Items",
          aggregateColumn: "Gross Value",
          n: 5,
        },
        alt: "Horizontal bar chart of the five product categories with the highest delivered revenue. Health and beauty leads.",
      }),
      textbox({
        id: "a100000000000000000d",
        rect: regionToRect(REGIONS.insights),
        card: true,
        alt: "Insight panel summarising the revenue plateau, weak repeat purchasing and the review penalty for late delivery.",
        blocks: [
          {
            text: "What the data says",
            fontFamily: "Georgia",
            size: 15,
            color: COLORS.ink,
          },
          { text: " ", size: 5, color: COLORS.ink },
          {
            text: "• Revenue plateaued at ~R$1M/month after the Nov 2017 peak.",
            size: 11,
            color: COLORS.ink,
          },
          {
            text: "• 96.9% of buyers never place a second order.",
            size: 11,
            color: COLORS.ink,
          },
          {
            text: "• Late deliveries score 2.57★ vs 4.29★ on time.",
            size: 11,
            color: COLORS.ink,
          },
        ],
      }),
      ...NAV_ITEMS.map((item, i) =>
        button({
          id: item.id,
          rect: {
            x: NAV.x,
            y: NAV.y + i * 56,
            width: NAV.width,
            height: 48,
          },
          label: item.label,
          action: "PageNavigation",
          target: item.target,
          primary: item.primary ?? false,
          alt: item.alt,
        }),
      ),
    ],
  };
}

export const overviewPage = {
  id: PAGE_ID,
  displayName: "Overview",
  build: buildOverview,
};
