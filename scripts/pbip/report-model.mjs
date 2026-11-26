import { customersPage } from "./pages/customers.mjs";
import { deliveryPage } from "./pages/delivery.mjs";
import { overviewPage } from "./pages/overview.mjs";
import { paymentsPage } from "./pages/payments.mjs";
import { productsPage } from "./pages/products.mjs";

export const pageOrder = [
  overviewPage,
  customersPage,
  productsPage,
  paymentsPage,
  deliveryPage,
];

export const activePageId = overviewPage.id;
