# Handoff — Session 5 final

**Project:** `E:\Personal Projects\Analyzing eCommerce Business Performance with SQL`
**Goal:** Portfolio-grade five-page Power BI report on the Olist dataset, built from the existing PBIP.
**Status:** Tasks 0–12 complete. All five pages built, validated (0 errors/0 warnings), screenshotted, reconciled, documented in README and staged. Only the owner’s manual click-through and commit remain.

## Read first in the new session

1. `.superpowers/sdd/2026-11-26-powerbi-revamp/progress.md` — the full execution ledger, every ruling and exact verification value.
2. `_brief/report-spec.md` — canonical design contract.
3. `docs/superpowers/specs/2026-11-26-powerbi-revamp-design.md` — architecture and data-quality rationale.
4. `docs/superpowers/plans/2026-11-26-powerbi-revamp.md` — implementation plan.
5. Load the `powerbi-report-cli` and `powerbi-modeling` skills before touching the report.

Do **not** redo Tasks 0–4. The model is rebuilt; the theme and five pages exist.

## What is done

### Semantic model
- 12 tables, 9 relationships; `Date` marked as date table; auto date/time disabled; 54 measures in `_Measures`.
- Verified: Revenue 15,419,773.75; Delivered Orders 96,478; AOV 159.83; Customers 96,090; lifetime repeat 3.11%; late rate 8.11% full / 9.37% in 2018; credit-card value share 78.37%; installment penetration 66.85%; average review 4.09; MAU 2018 6,670.5.
- Two bidirectional relationships now exist by ruling:
  - `Reviews → Orders` (1:1), required.
  - `Order Items → Orders`, added in Session 4 so Product Category filters reach Orders/Reviews. Without it every category showed the total 52,783 delivered orders and 4.09 review score.
- Report-level Date filter `Date[Date]` between 2016-01-01 and 2018-08-31 is in `report.json`; it makes the 2018 YTD slicer truly Jan–Aug and removes the Sep–Oct 2018 3M-average tail.
- `Payment Value Share` uses `DIVIDE([Payment Value], CALCULATE([Payment Value], REMOVEFILTERS(Payments), VALUES('Date'[Date])))`. It clears the payment table’s fact row filter but keeps the visible date window; the table shows 78.9% / 16.8% / 2.3% / 2.0% / 100.0%.
- The staging `customers_dataset` auto-relationship was removed; the Orders M partition now removes `customer_id` after the merge. The model has exactly 9 relationships.
- `Date` marking is persisted as `dataCategory: Time` in `Date.tmdl` (the fresh open had lost it).
- Revenue and category/state roll-ups still equal 15,419,773.75 after the model changes (verified by DAX).

### Report
- Five pages: Overview, Customers, Products, Payments, Delivery.
- Custom theme `OlistEditorial-012661cd.json` on top of `Fluent2-CY26SU10`; cream background, serif insight titles, white cards, amber/teal/indigo/purple/olive/cyan/red semantics.
- 67 visuals generated from `scripts/pbip`; page IDs and visual IDs are 20 lowercase hex chars.
- Azure Maps is unavailable in this Desktop/tenant (“To display Azure Maps visuals, sign in”), so Overview uses the planned top-10 state bar fallback. The `map` emitter remains in the library but is unused.
- Card display units fixed: Revenue R$15.4M, Delivered Orders 96,478, AOV R$159.83, Customers 96,090, Review 4.09.
- Count-chart data labels now show full counts, not “0K/93K”.
- Products page now shows correct per-category orders, AOV, review and cancel rate; the scatter labels are legible.

## Session 5 completed

1. **Review-score copy fixed.** Delivery (2018 YTD) now says `2.58★ vs 4.30★`; Overview (full period) says `2.57★ vs 4.29★`. The Delivery KPI and chart agree at 2.58 / 4.30.
2. **Payments recaptured.** The payment table shows 78.9% / 16.8% / 2.3% / 2.0% / 100.0% after the `Payment Value Share` fix.
3. **Task 11 complete.** `validate` 0 errors/0 warnings; all five pages captured and reviewed; 67 visuals all have alt text; palette contrast is AA or better; DAX reconciliation matches all Task 3 values plus 2018 YTD and SP slices. Model has 9 relationships, `Date` marked, no auto date tables.
4. **Task 12 complete.** README was fully revamped as a dashboard-first portfolio narrative: at-a-glance metrics, five page sections with embedded screenshots, cross-page findings, recommendations, Mermaid star schema, caveats and reproduction steps. Final screenshots are in `assets/powerbi/01-overview.png` … `05-delivery.png`.
5. Everything is staged; nothing committed.

**Only remaining check:** the owner’s manual click-through of one slicer and the nav/back/reset buttons. This Desktop build does not expose the Report view to UI Automation (the tree reports the Model view), so that interaction could not be automated; the default selections are visibly applied and all button `visualLink` actions validate.

## Commands

```powershell
$root = "E:\Personal Projects\Analyzing eCommerce Business Performance with SQL"
$env:PBI_DESKTOP_PATH = "C:\Program Files\WindowsApps\Microsoft.MicrosoftPowerBIDesktop_2.159.1231.0_x64__8wekyb3d8bbwe\bin\PBIDesktop.exe"

cd $root
node scripts/pbip/build_report.mjs
powerbi-report-author validate "ecommerce_pbi.Report"

$report = "$root\ecommerce_pbi.Report"
powerbi-report-author preview $report --host desktop --status
powerbi-report-author preview $report --host desktop --reload
# If model files changed:
# powerbi-report-author preview $report --host desktop --reload-with-model

# Collapse the Filters pane and park the mouse so tooltips do not render:
pwsh -NoProfile -File scripts/pbip/collapse-filter-pane.ps1

$shots = Join-Path $env:LOCALAPPDATA "Power BI Report Authoring\Screenshots\ecommerce_pbi"
powerbi-report-author preview $report --host desktop --screenshot "$shots\page.png" --page "<page-id>"
```

Page IDs:
- Overview `a1b2c3d4e5f60718293a`
- Customers `b2c3d4e5f60718293a4b`
- Products `c3d4e5f60718293a4b5c`
- Payments `d4e5f60718293a4b5c6d`
- Delivery `e5f60718293a4b5c6d7e`

Modeling MCP: `connection_operations` → `ListLocalInstances` → `Disconnect`/`Connect` to the current `localhost:<port>` after a model reload. DAX tool arguments use a nested `request` object, e.g. `{ request: { operation: "Execute", query: "EVALUATE ..." } }`.

## Owner review prompt

> The Olist Power BI revamp is complete and staged. Open `ecommerce_pbi.pbip` in Power BI Desktop, click through one slicer per page and the nav/back/reset buttons, then review the diff and commit. The source files are authoritative even though Desktop may still show `hasUnsavedChanges: true` from the refresh and filter-pane toggles.
