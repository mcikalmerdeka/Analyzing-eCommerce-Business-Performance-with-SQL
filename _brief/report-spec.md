# Report Spec

## Report identity
- Report name: Olist Commerce Performance
- Semantic model: `ecommerce_pbi.SemanticModel` (local PBIP)
- Audience: Portfolio showcase — recruiters, hiring managers, data community
- Primary purpose: Demonstrate end-to-end BI work (data repair, star schema, DAX, editorial report design) through one coherent business story
- Delivery target: Local PBIP only; no Fabric publish

## Semantic model binding
- Entry mode: Local Model
- Workspace name: n/a
- Workspace ID: n/a
- Model name: `ecommerce_pbi.SemanticModel`
- Model ID: n/a
- connectionString: `byPath ../ecommerce_pbi.SemanticModel`

## User decisions and constraints
- Scope: Rebuild the semantic model and build a five-page portfolio dashboard covering the original four tasks plus delivery performance
- Page count: 5
- Interactivity: `buttons`; four destination buttons on Overview; `← Overview` on every analysis page; built-in page tabs remain; reset-filters button on Overview
- Design direction: Editorial Newsroom; cream paper, serif headlines, burnt-amber accent, oversized KPI numerals
- Publishing: None
- Tooling: Power BI Desktop (Store build), `powerbi-modeling-mcp`, `powerbi-report-author` 0.5.0, Node.js generator
- Model edit permissions: Full local rewrite approved by this spec
- Accessibility: WCAG AA contrast; alt text on every visual; no color-only encoding; labelled slicers
- Data caveats: 2016 is partial (starts 4 Sep); analysis window ends 31 Aug 2018; revenue is delivered-only, price + freight, BRL; payments include all statuses; reviews deduped to one per order

## Narrative
- Core story: Olist scaled revenue and acquisition from 2016 to 2018, but retention never followed. Revenue plateaued at ~R$1M/month; 96.9% of buyers never return. Late deliveries are the strongest driver of bad reviews. Credit cards dominate payment value, and installments are the spend lever. Product revenue is concentrated in health & beauty, while bed & bath and computers lag on satisfaction.
- Audience promise: In five pages, understand where growth came from, why it stalled, and which levers — retention, delivery reliability, category quality, installment payments — matter most.
- Key questions answered: How big is the business? Is it still growing? Who buys, and do they return? What do they buy? How do they pay? How well do we deliver?

## Design identity
- Tone: Editorial Newsroom — warm cream paper, display serif headlines, one burnt-amber accent, hairline rules, generous whitespace
- Signature: Display serif page titles with a two-line insight lockup; oversized sans KPI numerals over tracked uppercase labels; white cards on cream paper
- Brownfield delta: indistinct (single empty page) → Editorial Newsroom

## Page plan

1. **R$15.4M in 23 months — growth plateaued at ~R$1M a month**
   - Archetype: Executive Summary
   - Layout variant: A — full-period KPI strip, trend hero, geography and mix context
   - Purpose: Land the business scale and the plateau in one screen
   - Visuals: 5 KPI cards; monthly revenue + 3-month average line; Brazil state revenue map (fallback: top-10 state bar); payment value mix donut; top-5 categories bar; insight panel; 4 navigation buttons
   - Fields/measures: Revenue, Delivered Orders, AOV, Customers, Avg Review Score; Date[Year Month]; Geography[State]; Payment Value; Product Category[Category]
   - Slicers/interactions: State dropdown; Reset filters button; navigation to the four analysis pages

2. **96.9% of buyers never place a second order**
   - Archetype: Analytical Canvas
   - Layout variant: A — trend + distribution + longitudinal table
   - Purpose: Prove that acquisition scaled while retention did not
   - Visuals: 5 KPI cards; monthly active buyers vs new buyers combo; lifetime order-frequency distribution; year-by-year retention table
   - Fields/measures: MAU, Customers, Lifetime Repeat Customers, Lifetime Repeat Rate, Avg Orders per Customer; New Customers; Returning Customers; Customer Retention %
   - Slicers/interactions: Year (all, default), State; Back to Overview

3. **Health & beauty is the R$867K engine — bed & bath drags satisfaction**
   - Archetype: Analytical Canvas
   - Layout variant: B — ranked revenue hero + revenue-vs-satisfaction scatter + quality table
   - Purpose: Show where revenue is concentrated and which high-revenue categories underperform on satisfaction
   - Visuals: 5 KPI cards; top-10 category revenue bar; revenue vs review scatter; category quality table
   - Fields/measures: Revenue, Top Category, Top 3 Category Share, Avg Review Score, Cancel Rate; Revenue Share; Delivered Orders; AOV
   - Slicers/interactions: Year (2018 YTD default), Category (search); Back to Overview

4. **Credit cards carry 78% of value; boleto still owns one in five orders**
   - Archetype: Comparative Benchmark
   - Layout variant: A — composition + trend + installment economics
   - Purpose: Explain the payment mix and the economics of installments
   - Visuals: 5 KPI cards; payment value mix donut; monthly payment value by type; installment spend comparison; installment distribution; payment-type table
   - Fields/measures: Payment Value, Credit Card Value Share, Installment Penetration, Avg Installments, Installment Spend Multiple; Payment Count; Avg Payment Value; Payment Value Share
   - Slicers/interactions: Year (2018 YTD default); Back to Overview

5. **Late deliveries rose to 9.4% — and they score 2.57★ vs 4.29★**
   - Archetype: Operational Monitor
   - Layout variant: A — monthly reliability trend + geographic exception + outcome evidence
   - Purpose: Show that delivery reliability worsened and that lateness is the review killer
   - Visuals: 5 KPI cards; monthly late rate + avg delivery days combo; late rate by state; delivery-time distribution; review score by lateness
   - Fields/measures: On-Time Rate, Avg Delivery Days, Late Orders, Avg Delay Days, Late Review Score; Late Rate; Delivered with Date; On-Time Review Score
   - Slicers/interactions: Year (2018 YTD default), State; Back to Overview

## Design system summary
- Theme: `Olist Editorial` custom overlay on Fluent2-CY26SU10; page `#FAF7F0`, visual `#FFFFFF`, ink `#1F1B16`, secondary `#6B6257`, accent `#B45309`
- Color semantics: Revenue amber `#B45309`; orders teal `#0F766E`; customers indigo `#3730A3`; payments purple `#6B21A8`; reviews olive `#4D7C0F`; delivery cyan `#0E7490`; risk red `#B91C1C`
- Typography: Georgia page titles 24pt; Segoe UI body/labels 9–11pt; Segoe UI Semibold KPI values 30–32pt
- Layout: 1920×1080; 32px margin; 24px gutter; 12×12 grid; 8px snap; 2-row header, 2-row KPI strip, 8-row content
- Accessibility commitments: AA contrast, alt text, labelled slicers, no red/green-only encoding, review scores always shown as numbers as well as color

## Model requirements

### Existing measures
None.

### New measures
- **Revenue & Orders:** Revenue, Product Revenue, Freight Revenue, Delivered Orders, Orders, AOV, Items Sold, Avg Items per Order, Canceled Orders, Cancel Rate, Revenue LY, Revenue YoY %, Orders LY, Orders YoY %, AOV LY, AOV YoY %, Revenue per Customer, Revenue 3M Avg
- **Customers:** Customers, New Customers, Returning Customers, Customer Retention %, Lifetime Repeat Customers, Lifetime Repeat Rate, Avg Orders per Customer, MAU, Customer Count, Customers LY, Customers YoY %
- **Products:** Top Category, Top 3 Category Share, Revenue Share, Avg Review Score, Review Count, Positive Review %, Negative Review %
- **Payments:** Payment Value, Payment Count, Payment Orders, Payment Value Share, Avg Payment Value, Avg Installments, Credit Card Value Share, Installment Penetration, Installment Spend Multiple
- **Delivery:** Delivered with Date, Late Orders, Late Rate, On-Time Rate, Avg Delivery Days, Avg Delay Days, Late Review Score, On-Time Review Score
- **Utility:** Data Through

### New calculated columns
- **Orders:** Customer Unique ID (merge), Status, Delivery Days, Delivery Days Bucket, Delivery Days Bucket Sort, Is Late, Late Label
- **Order Items:** Gross Value
- **Payments:** Payment Type (label), Payment Type Sort, Installment Bucket, Installment Bucket Sort
- **Reviews:** Sentiment, Sentiment Sort
- **Customers:** First Purchase Date, First Purchase Year, Lifetime Orders, Customer Type, Order Frequency, Order Frequency Sort
- **Products:** Category Key
- **Date:** Year, Year Label, Quarter, Month Number, Month, Month Short, Year Month, Year Month Sort, Weekday, Weekday Sort, Is Weekend, Day of Month
- **Product Category:** Category, Category Sort

### Relationship and sort requirements
- Date[Date] marked as the model date table; auto date/time disabled; all `LocalDateTable_*` and `DateTableTemplate_*` tables removed.
- All relationships single-direction: Orders→Date, Orders→Customers, Order Items→Orders, Payments→Orders, Reviews→Orders (1:1), Order Items→Products, Order Items→Sellers, Products→Product Category, Customers→Geography.
- Sort-by columns: Month→Month Number, Year Month→Year Month Sort, Quarter→Quarter Number, Weekday→Weekday Sort, Year Label→Year, Order Status→Status Sort, Payment Type→Payment Type Sort, Installment Bucket→Installment Bucket Sort, Sentiment→Sentiment Sort, Order Frequency→Order Frequency Sort, Delivery Days Bucket→Delivery Days Bucket Sort, Category→Category Sort.
- Geolocation table removed; `customers_dataset` retained as hidden staging lookup.

## Canonical design contract

```yaml
Design Brief:
  generated_by: powerbi-report-cli
  contract_version: 1
  mode: greenfield
  design_identity:
    tone: "Editorial Newsroom — warm cream paper, display serif headlines, one burnt-amber accent, hairline rules, generous whitespace"
    signature: "Display serif page titles with a two-line insight lockup; oversized sans KPI numerals over tracked uppercase labels; white cards on cream paper"
    current_tone: "indistinct (single empty page)"
    current_signature: "none"
  archetype: Executive Summary
  navigation_model: buttons
  color_map:
    - measure: "Revenue"
      color: "#B45309"
      tint: "#FDF0E1"
    - measure: "Delivered Orders"
      color: "#0F766E"
      tint: "#E6F4F1"
    - measure: "Customers"
      color: "#3730A3"
      tint: "#ECEBF9"
    - measure: "Payment Value"
      color: "#6B21A8"
      tint: "#F4EAFB"
    - measure: "Avg Review Score"
      color: "#4D7C0F"
      tint: "#EFF5E4"
    - measure: "Late Rate"
      color: "#B91C1C"
      tint: "#FBEAEA"
    - measure: "Avg Delivery Days"
      color: "#0E7490"
      tint: "#E5F3F7"
  pages:
    - name: "R$15.4M in 23 months — growth plateaued at ~R$1M a month"
      role: landing
      archetype: Executive
      layout_variant: A
      variant_rationale: "The full-period revenue story needs a trend hero plus geographic and payment-mix context."
      navigation:
        - element: button
          action: PageNavigation
          target: "96.9% of buyers never place a second order"
          label: "Customers →"
        - element: button
          action: PageNavigation
          target: "Health & beauty is the R$867K engine — bed & bath drags satisfaction"
          label: "Products →"
        - element: button
          action: PageNavigation
          target: "Credit cards carry 78% of value; boleto still owns one in five orders"
          label: "Payments →"
        - element: button
          action: PageNavigation
          target: "Late deliveries rose to 9.4% — and they score 2.57★ vs 4.29★"
          label: "Delivery →"
      page_background: "#FAF7F0"
      layout_summary: "Two-row insight header; five KPI cards; revenue trend and Brazil map share the middle band; payment mix, category spotlight, insight panel and navigation fill the bottom."
      layout_contract:
        canvas:
          width: 1920
          height: 1080
          margin: 32
          gutter: 24
          snap: 8
        grid:
          columns: 12
          rows: 12
          regions:
            header:    [1, 1, 9, 3]
            filters:   [9, 1, 13, 3]
            kpis:      [1, 3, 13, 5]
            trend:     [1, 5, 8, 10]
            map:       [8, 5, 13, 10]
            payments:  [1, 10, 5, 13]
            categories: [5, 10, 8, 13]
            insights:  [8, 10, 11, 13]
            nav:       [11, 10, 13, 13]
        placements:
          - id: page_title
            region: header
            kind: textbox
            text: "R$15.4M in 23 months — growth plateaued at ~R$1M a month\nOlist marketplace · Sep 2016 – Aug 2018 · delivered revenue in BRL"
            purpose: "State the headline before any chart."
          - id: state_slicer
            region: filters
            kind: slicer
            field_bindings: "Geography[State]"
            slicer_type: dropdown
            slot: 1
            of: 2
          - id: reset_button
            region: filters
            kind: actionButton
            purpose: "Clear all page filters and return to the full-period view."
            slot: 2
            of: 2
          - id: kpi_revenue
            region: kpis
            kind: cardVisual
            purpose: "What is total delivered revenue?"
            field_bindings: "Revenue"
            color_strategy: measure_match
            slot: 1
            of: 5
          - id: kpi_orders
            region: kpis
            kind: cardVisual
            purpose: "How many orders were delivered?"
            field_bindings: "Delivered Orders"
            color_strategy: none
            slot: 2
            of: 5
          - id: kpi_aov
            region: kpis
            kind: cardVisual
            purpose: "What is the average order value?"
            field_bindings: "AOV"
            color_strategy: none
            slot: 3
            of: 5
          - id: kpi_customers
            region: kpis
            kind: cardVisual
            purpose: "How many unique buyers are in the data?"
            field_bindings: "Customers"
            color_strategy: none
            slot: 4
            of: 5
          - id: kpi_review
            region: kpis
            kind: cardVisual
            purpose: "What is the average review score?"
            field_bindings: "Avg Review Score"
            color_strategy: none
            slot: 5
            of: 5
          - id: revenue_trend
            region: trend
            kind: lineChart
            purpose: "How did monthly revenue evolve, and did it plateau?"
            field_bindings: { Category: "Date[Year Month]", Values: ["Revenue", "Revenue 3M Avg"] }
            sort_policy: natural_order
            color_strategy: measure_match
          - id: state_map
            region: map
            kind: azureMap
            purpose: "Which states concentrate revenue?"
            field_bindings: { Location: "Geography[State]", Size: "Revenue", Tooltips: "Delivered Orders" }
            color_strategy: gradient
          - id: payment_mix
            region: payments
            kind: donutChart
            purpose: "How is payment value split by type?"
            field_bindings: { Legend: "Payments[Payment Type]", Values: "Payment Value" }
            color_strategy: unique
          - id: top_categories
            region: categories
            kind: barChart
            purpose: "Which five categories drive the most revenue?"
            field_bindings: { Category: "Product Category[Category]", Y: "Revenue" }
            sort_policy: value_desc
            color_strategy: gradient
          - id: insight_panel
            region: insights
            kind: textbox
            text: "What the data says\n• Revenue plateaued at ~R$1M/month after the Nov 2017 peak.\n• 96.9% of buyers never place a second order.\n• Late deliveries score 2.57★ vs 4.29★ on time."
            purpose: "Carry the three cross-page findings."
            insight_basis: "Derived from Revenue 3M Avg, Lifetime Repeat Rate and Late vs On-Time Review Score."
          - id: nav_customers
            region: nav
            kind: actionButton
            purpose: "Navigate to customer retention."
            slot: 1
            of: 4
          - id: nav_products
            region: nav
            kind: actionButton
            purpose: "Navigate to category performance."
            slot: 2
            of: 4
          - id: nav_payments
            region: nav
            kind: actionButton
            purpose: "Navigate to payment mix."
            slot: 3
            of: 4
          - id: nav_delivery
            region: nav
            kind: actionButton
            purpose: "Navigate to delivery reliability."
            slot: 4
            of: 4
        space_audit:
          content_cell_count: 120
          placed_cell_count: 120
          empty_cell_pct: 0
          unplaced_regions: []
          largest_region:
            name: trend
            pct_of_content: 29
          balance_rationale: "The revenue trend earns the largest share; the map, payment mix, category spotlight and insight/nav band each answer a distinct question with no dead footer."

    - name: "96.9% of buyers never place a second order"
      role: detail
      archetype: Analytical
      layout_variant: A
      variant_rationale: "Retention is a longitudinal story: a monthly trend, a lifetime frequency distribution and a year-by-year table."
      navigation:
        - element: button
          action: Back
          label: "← Overview"
      page_background: "#FAF7F0"
      layout_summary: "Five KPI cards; monthly active-vs-new buyers on the left; lifetime order-frequency distribution on the right; a full-width year-by-year retention table below."
      layout_contract:
        canvas:
          width: 1920
          height: 1080
          margin: 32
          gutter: 24
          snap: 8
        grid:
          columns: 12
          rows: 12
          regions:
            header:    [1, 1, 9, 3]
            filters:   [9, 1, 13, 3]
            kpis:      [1, 3, 13, 5]
            trend:     [1, 5, 7, 9]
            frequency: [7, 5, 13, 9]
            detail:    [1, 9, 13, 13]
        placements:
          - id: page_title
            region: header
            kind: textbox
            text: "96.9% of buyers never place a second order\nCustomer activity · full period · unique buyers"
            purpose: "State the retention headline."
          - id: back_button
            region: filters
            kind: actionButton
            purpose: "Return to Overview."
            slot: 1
            of: 3
          - id: year_slicer
            region: filters
            kind: slicer
            field_bindings: "Date[Year Label]"
            slicer_type: dropdown
            slot: 2
            of: 3
          - id: state_slicer
            region: filters
            kind: slicer
            field_bindings: "Geography[State]"
            slicer_type: dropdown
            slot: 3
            of: 3
          - id: kpi_mau
            region: kpis
            kind: cardVisual
            purpose: "What is the average monthly active buyer count?"
            field_bindings: "MAU"
            color_strategy: measure_match
            slot: 1
            of: 5
          - id: kpi_customers
            region: kpis
            kind: cardVisual
            purpose: "How many unique buyers are in the visible period?"
            field_bindings: "Customers"
            color_strategy: none
            slot: 2
            of: 5
          - id: kpi_repeat_customers
            region: kpis
            kind: cardVisual
            purpose: "How many buyers have ever placed more than one order?"
            field_bindings: "Lifetime Repeat Customers"
            color_strategy: none
            slot: 3
            of: 5
          - id: kpi_repeat_rate
            region: kpis
            kind: cardVisual
            purpose: "What share of buyers ever repeat?"
            field_bindings: "Lifetime Repeat Rate"
            color_strategy: none
            slot: 4
            of: 5
          - id: kpi_orders_per_customer
            region: kpis
            kind: cardVisual
            purpose: "How many orders does the average buyer place?"
            field_bindings: "Avg Orders per Customer"
            color_strategy: none
            slot: 5
            of: 5
          - id: active_vs_new
            region: trend
            kind: lineClusteredColumnComboChart
            purpose: "Do active buyers grow because of new buyers or returning buyers?"
            field_bindings: { Category: "Date[Year Month]", ColumnY: ["New Customers"], LineY: ["Customers"] }
            sort_policy: natural_order
            color_strategy: measure_match
          - id: order_frequency
            region: frequency
            kind: barChart
            purpose: "How many buyers ever order again?"
            field_bindings: { Category: "Customers[Order Frequency]", Y: "Customer Count" }
            sort_policy: category_asc
            color_strategy: unique
          - id: year_table
            region: detail
            kind: tableEx
            purpose: "How do MAU, new buyers, returning buyers and order frequency evolve by year?"
            field_bindings: ["Date[Year Label]", "MAU", "New Customers", "Returning Customers", "Customer Retention %", "Avg Orders per Customer"]
            sort_policy: natural_order
        space_audit:
          content_cell_count: 120
          placed_cell_count: 120
          empty_cell_pct: 0
          unplaced_regions: []
          largest_region:
            name: detail
            pct_of_content: 40
          balance_rationale: "The year table is the proof and earns the bottom band; the two charts split the middle evenly; KPI strip gives the headline numbers."

    - name: "Health & beauty is the R$867K engine — bed & bath drags satisfaction"
      role: detail
      archetype: Analytical
      layout_variant: B
      variant_rationale: "Revenue concentration needs a ranked hero; satisfaction needs a second axis and a table to expose the mismatch."
      navigation:
        - element: button
          action: Back
          label: "← Overview"
      page_background: "#FAF7F0"
      layout_summary: "Five KPI cards; top-10 category revenue bar on the left; revenue-vs-review scatter on the right; full-width category quality table below."
      layout_contract:
        canvas:
          width: 1920
          height: 1080
          margin: 32
          gutter: 24
          snap: 8
        grid:
          columns: 12
          rows: 12
          regions:
            header:    [1, 1, 9, 3]
            filters:   [9, 1, 13, 3]
            kpis:      [1, 3, 13, 5]
            hero:      [1, 5, 8, 9]
            scatter:   [8, 5, 13, 9]
            detail:    [1, 9, 13, 13]
        placements:
          - id: page_title
            region: header
            kind: textbox
            text: "Health & beauty is the R$867K engine — bed & bath drags satisfaction\nProduct categories · 2018 YTD · delivered revenue · top 10"
            purpose: "State the category revenue and satisfaction headline."
          - id: back_button
            region: filters
            kind: actionButton
            purpose: "Return to Overview."
            slot: 1
            of: 3
          - id: year_slicer
            region: filters
            kind: slicer
            field_bindings: "Date[Year Label]"
            slicer_type: dropdown
            slot: 2
            of: 3
          - id: category_slicer
            region: filters
            kind: slicer
            field_bindings: "Product Category[Category]"
            slicer_type: dropdown
            slot: 3
            of: 3
          - id: kpi_category_revenue
            region: kpis
            kind: cardVisual
            purpose: "What is delivered category revenue?"
            field_bindings: "Revenue"
            color_strategy: measure_match
            slot: 1
            of: 5
          - id: kpi_top_category
            region: kpis
            kind: cardVisual
            purpose: "Which category leads revenue?"
            field_bindings: "Top Category"
            color_strategy: none
            slot: 2
            of: 5
          - id: kpi_top3_share
            region: kpis
            kind: cardVisual
            purpose: "How concentrated is revenue in the top three categories?"
            field_bindings: "Top 3 Category Share"
            color_strategy: none
            slot: 3
            of: 5
          - id: kpi_avg_review
            region: kpis
            kind: cardVisual
            purpose: "What is the average review score?"
            field_bindings: "Avg Review Score"
            color_strategy: none
            slot: 4
            of: 5
          - id: kpi_cancel_rate
            region: kpis
            kind: cardVisual
            purpose: "What is the cancellation rate?"
            field_bindings: "Cancel Rate"
            color_strategy: none
            slot: 5
            of: 5
          - id: category_revenue
            region: hero
            kind: barChart
            purpose: "Which categories drive the most revenue?"
            field_bindings: { Category: "Product Category[Category]", Y: "Revenue" }
            sort_policy: value_desc
            color_strategy: gradient
          - id: revenue_vs_review
            region: scatter
            kind: scatterChart
            purpose: "Which high-revenue categories underperform on satisfaction?"
            field_bindings: { Category: "Product Category[Category]", X: "Avg Review Score", Y: "Revenue", Size: "Delivered Orders" }
            color_strategy: unique
            comparison_basis: "Report average review score 4.09 and category median revenue."
          - id: category_table
            region: detail
            kind: tableEx
            purpose: "Which categories combine revenue, order value and satisfaction?"
            field_bindings: ["Product Category[Category]", "Revenue", "Revenue Share", "Delivered Orders", "AOV", "Avg Review Score", "Cancel Rate"]
            sort_policy: value_desc
        space_audit:
          content_cell_count: 120
          placed_cell_count: 120
          empty_cell_pct: 0
          unplaced_regions: []
          largest_region:
            name: detail
            pct_of_content: 40
          balance_rationale: "The quality table earns the bottom band because it carries the evidence; the ranked bar and scatter split the middle evenly."

    - name: "Credit cards carry 78% of value; boleto still owns one in five orders"
      role: detail
      archetype: Comparative
      layout_variant: A
      variant_rationale: "Payment analysis needs composition, trend, installment economics and detail; four equal panels keep it balanced."
      navigation:
        - element: button
          action: Back
          label: "← Overview"
      page_background: "#FAF7F0"
      layout_summary: "Five KPI cards; payment mix, monthly trend and installment spend in a three-panel band; installment distribution and payment-type table below."
      layout_contract:
        canvas:
          width: 1920
          height: 1080
          margin: 32
          gutter: 24
          snap: 8
        grid:
          columns: 12
          rows: 12
          regions:
            header:       [1, 1, 9, 3]
            filters:      [9, 1, 13, 3]
            kpis:         [1, 3, 13, 5]
            mix:          [1, 5, 5, 9]
            trend:        [5, 5, 9, 9]
            spend:        [9, 5, 13, 9]
            distribution: [1, 9, 6, 13]
            detail:       [6, 9, 13, 13]
        placements:
          - id: page_title
            region: header
            kind: textbox
            text: "Credit cards carry 78% of value; boleto still owns one in five orders\nPayment mix · 2018 YTD · all order statuses"
            purpose: "State the payment mix headline."
          - id: back_button
            region: filters
            kind: actionButton
            purpose: "Return to Overview."
            slot: 1
            of: 2
          - id: year_slicer
            region: filters
            kind: slicer
            field_bindings: "Date[Year Label]"
            slicer_type: dropdown
            slot: 2
            of: 2
          - id: kpi_payment_value
            region: kpis
            kind: cardVisual
            purpose: "What is total payment value?"
            field_bindings: "Payment Value"
            color_strategy: measure_match
            slot: 1
            of: 5
          - id: kpi_cc_share
            region: kpis
            kind: cardVisual
            purpose: "What share of value is credit card?"
            field_bindings: "Credit Card Value Share"
            color_strategy: none
            slot: 2
            of: 5
          - id: kpi_installment_penetration
            region: kpis
            kind: cardVisual
            purpose: "What share of credit-card payments use installments?"
            field_bindings: "Installment Penetration"
            color_strategy: none
            slot: 3
            of: 5
          - id: kpi_avg_installments
            region: kpis
            kind: cardVisual
            purpose: "What is the average installment count?"
            field_bindings: "Avg Installments"
            color_strategy: none
            slot: 4
            of: 5
          - id: kpi_spend_multiple
            region: kpis
            kind: cardVisual
            purpose: "How much more do installment buyers spend?"
            field_bindings: "Installment Spend Multiple"
            color_strategy: none
            slot: 5
            of: 5
          - id: payment_mix
            region: mix
            kind: donutChart
            purpose: "How is payment value composed?"
            field_bindings: { Legend: "Payments[Payment Type]", Values: "Payment Value" }
            color_strategy: unique
          - id: payment_trend
            region: trend
            kind: lineChart
            purpose: "How does payment value by type evolve?"
            field_bindings: { Category: "Date[Year Month]", Values: "Payment Value", Legend: "Payments[Payment Type]" }
            sort_policy: natural_order
            color_strategy: unique
          - id: installment_spend
            region: spend
            kind: clusteredBarChart
            purpose: "Do installment buyers spend more per payment?"
            field_bindings: { Category: "Payments[Installment Bucket]", Y: "Avg Payment Value" }
            sort_policy: category_asc
            color_strategy: measure_match
          - id: installment_distribution
            region: distribution
            kind: columnChart
            purpose: "How are payments distributed across installment buckets?"
            field_bindings: { Category: "Payments[Installment Bucket]", Y: "Payment Count" }
            sort_policy: category_asc
            color_strategy: gradient
          - id: payment_table
            region: detail
            kind: tableEx
            purpose: "Which payment types carry value, volume and installment behavior?"
            field_bindings: ["Payments[Payment Type]", "Payment Value", "Payment Value Share", "Payment Count", "Avg Payment Value", "Avg Installments"]
            sort_policy: value_desc
        space_audit:
          content_cell_count: 120
          placed_cell_count: 120
          empty_cell_pct: 0
          unplaced_regions: []
          largest_region:
            name: detail
            pct_of_content: 23
          balance_rationale: "Three equal analytical panels plus a wider evidence table; no panel dominates and each answers a distinct payment question."

    - name: "Late deliveries rose to 9.4% — and they score 2.57★ vs 4.29★"
      role: detail
      archetype: Operational
      layout_variant: A
      variant_rationale: "Reliability needs a time trend, a geographic exception view and outcome evidence from reviews."
      navigation:
        - element: button
          action: Back
          label: "← Overview"
      page_background: "#FAF7F0"
      layout_summary: "Five KPI cards; monthly late-rate and delivery-days combo; late rate by state; delivery-time distribution; review score by lateness."
      layout_contract:
        canvas:
          width: 1920
          height: 1080
          margin: 32
          gutter: 24
          snap: 8
        grid:
          columns: 12
          rows: 12
          regions:
            header:       [1, 1, 9, 3]
            filters:      [9, 1, 13, 3]
            kpis:         [1, 3, 13, 5]
            trend:        [1, 5, 8, 9]
            states:       [8, 5, 13, 9]
            distribution: [1, 9, 7, 13]
            reviews:      [7, 9, 13, 13]
        placements:
          - id: page_title
            region: header
            kind: textbox
            text: "Late deliveries rose to 9.4% — and they score 2.57★ vs 4.29★\nDelivery performance · 2018 YTD · delivered orders"
            purpose: "State the reliability headline and its review consequence."
          - id: back_button
            region: filters
            kind: actionButton
            purpose: "Return to Overview."
            slot: 1
            of: 3
          - id: year_slicer
            region: filters
            kind: slicer
            field_bindings: "Date[Year Label]"
            slicer_type: dropdown
            slot: 2
            of: 3
          - id: state_slicer
            region: filters
            kind: slicer
            field_bindings: "Geography[State]"
            slicer_type: dropdown
            slot: 3
            of: 3
          - id: kpi_on_time
            region: kpis
            kind: cardVisual
            purpose: "What share of deliveries arrive on or before the promise?"
            field_bindings: "On-Time Rate"
            color_strategy: measure_match
            slot: 1
            of: 5
          - id: kpi_avg_days
            region: kpis
            kind: cardVisual
            purpose: "How long does delivery take on average?"
            field_bindings: "Avg Delivery Days"
            color_strategy: none
            slot: 2
            of: 5
          - id: kpi_late_orders
            region: kpis
            kind: cardVisual
            purpose: "How many orders arrived late?"
            field_bindings: "Late Orders"
            color_strategy: none
            slot: 3
            of: 5
          - id: kpi_avg_delay
            region: kpis
            kind: cardVisual
            purpose: "How late are late deliveries on average?"
            field_bindings: "Avg Delay Days"
            color_strategy: none
            slot: 4
            of: 5
          - id: kpi_late_review
            region: kpis
            kind: cardVisual
            purpose: "What review score do late deliveries receive?"
            field_bindings: "Late Review Score"
            color_strategy: none
            slot: 5
            of: 5
          - id: delivery_trend
            region: trend
            kind: lineClusteredColumnComboChart
            purpose: "Did late rate and delivery time improve or worsen over time?"
            field_bindings: { Category: "Date[Year Month]", ColumnY: ["Late Rate"], LineY: ["Avg Delivery Days"] }
            sort_policy: natural_order
            color_strategy: semantic
          - id: state_late
            region: states
            kind: barChart
            purpose: "Which states have the worst late-delivery rate?"
            field_bindings: { Category: "Geography[State]", Y: "Late Rate" }
            sort_policy: value_desc
            color_strategy: semantic
          - id: days_distribution
            region: distribution
            kind: columnChart
            purpose: "How long do deliveries actually take?"
            field_bindings: { Category: "Orders[Delivery Days Bucket]", Y: "Delivered with Date" }
            sort_policy: natural_order
            color_strategy: gradient
          - id: review_by_lateness
            region: reviews
            kind: clusteredBarChart
            purpose: "What is the review penalty for a late delivery?"
            field_bindings: { Category: "Orders[Late Label]", Y: "Avg Review Score" }
            sort_policy: category_asc
            color_strategy: semantic
            comparison_basis: "On-time average review score 4.29 vs late 2.57."
        space_audit:
          content_cell_count: 120
          placed_cell_count: 120
          empty_cell_pct: 0
          unplaced_regions: []
          largest_region:
            name: trend
            pct_of_content: 23
          balance_rationale: "The time trend earns the top-left hero; the state exception, delivery distribution and review evidence fill the remaining space with no dead band."
  interaction_pattern:
    drill_targets: []
    cross_filter_rules: "Default highlight on all visuals; no custom interactions in v1."
  accessibility:
    alt_text_strategy: "Headline + structure for every visual; KPI cards state metric and period; charts state the question and the encoding."
    contrast_notes: "Palette checked against #FAF7F0 and #FFFFFF. Amber #B45309 is 4.9:1 on white and reserved for large values/labels; muted #6B6257 is 5.6:1; red #B91C1C is 6.0:1. No red/green-only encoding."
  theme:
    base: "Fluent2-CY26SU10 plus custom overlay Olist Editorial"
    user_overrides: "Preserve the existing Fluent2 base theme resource and the 1920×1080 canvas; do not replace the base theme file."
```

> **Session 5 implementation note:** The Delivery page defaults to 2018 YTD, so its headline uses the 2018 values **2.58★ vs 4.30★**. The full-period values are 2.57★ vs 4.29★; the Overview insight keeps the full-period comparison.

## Implementation notes

- Model changes: Rebuild TMDL into a star schema; fix `en-US` parsing; disable auto date/time; add Date, Customers, Product Category, Geography and Measures; remove geolocation. Reconcile revenue to R$15,419,773.75 before any visual work.
- PBIR/report authoring: Use a deterministic Node.js generator (`scripts/pbip/build_report.mjs`) to emit page and visual JSON from the grid contract, then validate each page batch with `powerbi-report-author validate`.
- Validation: DAX checks for revenue, price, customers, repeat rate, late rate and payment share; Desktop reload; screenshots of all five pages; screenshot review loop.
- Desktop screenshot verification: required for every page after the final edit; fix visible issues and repeat.
- Publishing boundary: local only; do not call Fabric write APIs.
- Risks: TMDL reload errors, Azure Maps unavailable (fallback top-10 state bar), PBIR role/format mismatches, Desktop unsaved state, time to author 30+ visuals.
