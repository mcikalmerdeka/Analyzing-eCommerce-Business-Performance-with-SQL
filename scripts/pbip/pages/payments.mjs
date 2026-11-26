import { PAGE_GRID, alignRect, regionToRect } from "../lib/grid.mjs";
import { COLORS, kpiCard, pageTitle } from "../lib/page-kit.mjs";
import {
  barChart,
  button,
  col,
  columnChart,
  donutChart,
  lineChart,
  meas,
  slicer,
  table,
} from "../lib/visuals.mjs";

const PAGE_ID = "d4e5f60718293a4b5c6d";
const REGIONS = {
  ...PAGE_GRID,
  mix: [1, 5, 5, 9],
  trend: [5, 5, 9, 9],
  spend: [9, 5, 13, 9],
  distribution: [1, 9, 6, 13],
  detail: [6, 9, 13, 13],
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
  x: "right",
  y: FILTERS.y,
});

export function buildPayments() {
  return {
    id: PAGE_ID,
    displayName: "Payments",
    visuals: [
      pageTitle({
        id: "d1000000000000000001",
        title:
          "Credit cards carry 78% of value; boleto still owns one in five orders",
        subtitle: "Payment mix · 2018 YTD · all order statuses",
      }),
      button({
        id: "d1000000000000000002",
        rect: BACK_BUTTON,
        label: "← Overview",
        action: "Back",
        alt: "Return to the Overview page.",
      }),
      slicer({
        id: "d1000000000000000003",
        rect: YEAR_SLICER,
        table: "Date",
        column: "Year Label",
        header: "Year",
        selection: "2018 YTD",
        alt: "Filter the page by year. Defaults to 2018 year to date.",
      }),
      kpiCard({
        id: "d1000000000000000004",
        slot: 1,
        measure: "Payment Value",
        label: "PAYMENT VALUE · 2018 YTD",
        color: COLORS.purple,
        displayUnits: 1000000,
        precision: 2,
        accent: COLORS.purple,
        alt: "Total payment value for 2018 year to date.",
      }),
      kpiCard({
        id: "d1000000000000000005",
        slot: 2,
        measure: "Credit Card Value Share",
        label: "CREDIT CARD VALUE SHARE",
        displayUnits: 1,
        precision: 1,
        alt: "Share of payment value carried by credit cards.",
      }),
      kpiCard({
        id: "d1000000000000000006",
        slot: 3,
        measure: "Installment Penetration",
        label: "INSTALLMENT PENETRATION",
        displayUnits: 1,
        precision: 1,
        alt: "Share of credit-card payments that use more than one installment.",
      }),
      kpiCard({
        id: "d1000000000000000007",
        slot: 4,
        measure: "Avg Installments",
        label: "AVG INSTALLMENTS",
        displayUnits: 1,
        precision: 2,
        alt: "Average number of installments on credit-card payments.",
      }),
      kpiCard({
        id: "d1000000000000000008",
        slot: 5,
        measure: "Installment Spend Multiple",
        label: "INSTALLMENT SPEND MULTIPLE",
        displayUnits: 1,
        precision: 2,
        alt: "How much more an installment buyer spends per payment than a single-installment buyer.",
      }),
      donutChart({
        id: "d1000000000000000009",
        rect: regionToRect(REGIONS.mix),
        category: col("Payments", "Payment Type"),
        measure: "Payment Value",
        title: "Payment value mix",
        subtitle: "2018 YTD · all statuses",
        alt: "Donut chart of payment value by type in 2018. Credit card is 78 percent of value.",
      }),
      lineChart({
        id: "d100000000000000000a",
        rect: regionToRect(REGIONS.trend),
        category: col("Date", "Year Month"),
        measures: ["Payment Value"],
        series: col("Payments", "Payment Type"),
        title: "Monthly payment value by type",
        subtitle: "2018 YTD · all statuses",
        markers: false,
        alt: "Line chart of monthly payment value split by payment type. Credit card dominates every month.",
      }),
      barChart({
        id: "d100000000000000000b",
        rect: regionToRect(REGIONS.spend),
        category: col("Payments", "Installment Bucket"),
        measure: "Avg Payment Value",
        title: "Average payment value by installment bucket",
        subtitle: "Do installment buyers spend more per payment?",
        color: COLORS.purple,
        sort: "category_asc",
        alt: "Bar chart of average payment value by installment bucket. Payments with more installments carry a higher average value.",
      }),
      columnChart({
        id: "d100000000000000000c",
        rect: regionToRect(REGIONS.distribution),
        category: col("Payments", "Installment Bucket"),
        measure: "Payment Count",
        title: "Payment count by installment bucket",
        subtitle: "2018 YTD · all statuses",
        color: COLORS.purple,
        sort: "category_asc",
        labelUnits: 1,
        labelPrecision: 0,
        alt: "Column chart of payment count by installment bucket. Single-installment payments are the largest group.",
      }),
      table({
        id: "d100000000000000000d",
        rect: regionToRect(REGIONS.detail),
        fields: [
          col("Payments", "Payment Type"),
          meas("Payment Value"),
          meas("Payment Value Share"),
          meas("Payment Count"),
          meas("Avg Payment Value"),
          meas("Avg Installments"),
        ],
        title: "Payment type detail",
        subtitle: "2018 YTD · value, volume and installment behaviour",
        sortBy: meas("Payment Value"),
        sortDirection: "Descending",
        alt: "Table of payment types with value, value share, payment count, average payment value and average installments.",
      }),
    ],
  };
}

export const paymentsPage = {
  id: PAGE_ID,
  displayName: "Payments",
  build: buildPayments,
};
