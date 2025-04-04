# Analyzing eCommerce Business Performance with SQL

![Project Header](https://raw.githubusercontent.com/mcikalmerdeka/Analyzing-eCommerce-Business-Performance-with-SQL/refs/heads/main/Assets/Project%20Header.jpg)

**This project originally came from an assignment after a data science bootcamp program that I attended. Which is why you can see there are several folders of tasks that contain instructions about business questions that must be answered based on data and my presentation file for each of them.**

## Project Description

- In any company, measuring business performance is crucial for tracking, monitoring, and evaluating the success or failure of various business processes. Effective performance measurement helps businesses identify areas for improvement, make data-driven decisions, and allocate resources efficiently. For eCommerce companies specifically, understanding metrics related to customer behavior, product performance, and payment trends is essential to stay competitive in the rapidly evolving digital marketplace. By analyzing these key performance indicators (KPIs), businesses can adapt their strategies, enhance customer experience, and ultimately drive growth and profitability.
- Therefore, this project will analyze the business performance of an eCommerce company, taking into account several business metrics such as customer growth, product quality, and payment methods.
- This dataset was generously provided by Olist, the largest department store in Brazilian marketplaces. The dataset has information of 100k orders from 2016 to 2018 made at multiple marketplaces in Brazil. Its features allows viewing an order from multiple dimensions: from order status, price, payment and freight performance to customer location, product attributes and finally reviews written by customers. We also released a geolocation dataset that relates Brazilian zip codes to lat/lng coordinates.

Here is the initial walkthrough of the task:

- `Task 1` explains the data preparation stage where as a data analyst we are given a collection of raw data (which can be found in the `Dataset` folder) containing 8 tables namely customers, geolocation, order items, order payments, order reviews, orders, products, and sellers. In this stage, I tried to build an ERD and digest the data into a database formed in PostgreSQL for analysis that will be carried out in subsequent stages.
- `Task 2` explains the first analysis which is about annual customer activity growth analysis utilizing the customer and order tables. This analysis compares the average monthly active user (MAU) per year and examines its comparison with total new customers per year. Additionally, analysis is also conducted regarding metrics of repeat orders and average order value per year.
- `Task 3` explains the second analysis which is about annual product category quality analysis utilizing the orders, order items, and products tables. In this analysis, the metrics analyzed are total revenue, cancel orders, and product categories that provide the highest total revenue and product categories that have the highest canceled orders each year.
- `Task 4` explains the third analysis which is about annual payment type usage analysis utilizing the orders and order_payments tables. In this analysis, the metrics analyzed are overall total payment type usage and its breakdown per year.

> For each task, the summary can be accessed in the presentation file and technical details can be accessed in each SQL script. The analysis tasks also provide the query result and tableau graph that I created.

## Analysis and Findings

### Task 1: Data Preparation Analysis

In this initial phase, I structured the database for effective analysis by:

- Building an Entity Relationship Diagram (ERD) to map the connections between the 8 tables in the dataset
- Creating tables with appropriate data types and constraints
- Establishing foreign key relationships to ensure data integrity
- Importing data from CSV files into the PostgreSQL database

The database structure follows a star schema design with the orders table as the central fact table connecting to various dimension tables like customers, products, and sellers. This design optimizes query performance for the analytical tasks that follow.

### Task 2: Annual Customer Activity Growth Analysis

The analysis of customer activity from 2016 to 2018 revealed significant growth patterns but also concerning trends in customer retention:

- **Monthly Active Users (MAU)**: The platform experienced dramatic growth in average MAU, increasing from just 108 users in 2016 to 3,694 in 2017 (3,319% growth), and then to 5,338 in 2018 (44.5% growth).
- **New Customer Acquisition**: New customer acquisition showed similar growth patterns, with 326 new customers in 2016, jumping to 43,708 in 2017, and further increasing to 52,062 in 2018.
- **Repeat Customers**: While new customers increased year over year, the number of repeat customers actually decreased from 1,256 in 2017 to 1,167 in 2018 (a 7.1% decline), which signals potential retention issues.
- **Average Orders per Customer**: The average order frequency remained nearly flat across all three years (1.01 in 2016, 1.03 in 2017, and 1.02 in 2018), indicating customers are primarily one-time shoppers rather than returning buyers.

**Business Implications**:
The data reveals that while the platform was highly successful in acquiring new customers, it struggled with customer retention. The declining repeat customer count in 2018 despite higher overall user numbers suggests customers aren't finding enough value to return after their initial purchase. This presents a critical opportunity to implement retention strategies like personalized recommendations, loyalty programs, and post-purchase engagement to increase the lifetime value of existing customers rather than solely focusing on new acquisitions.

### Task 3: Annual Product Category Quality Analysis

The analysis of product category performance across 2016-2018 revealed valuable insights into revenue drivers and potential problem areas:

- **Total Revenue Growth**: The platform demonstrated strong revenue growth, increasing from $46,653 in 2016 to $6.92 million in 2017, and further to $8.45 million in 2018 (a 22.1% year-over-year increase).
- **Top Revenue-Generating Categories**:

  - 2016: "furniture_decor" dominated with $6,899 in revenue
  - 2017: "bed_bath_table" took the lead with $580,949 in revenue
  - 2018: "health_beauty" emerged as the leader with $866,810 in revenue
- **Order Cancellations**: The number of canceled orders increased year over year, with 26 cancellations in 2016, 265 in 2017, and 334 in 2018, representing a 26% increase from 2017 to 2018.
- **Categories with Highest Cancellations**:

  - 2016: "toys" with 3 canceled orders
  - 2017: "sports_leisure" with 25 canceled orders
  - 2018: "health_beauty" with 27 canceled orders

**Business Implications**:
The analysis reveals that the "health_beauty" category represented both the highest revenue generator and the most frequently canceled category in 2018, suggesting potential issues with product quality, delivery, or customer expectations. The company should investigate the specific reasons for cancellations within this category to protect this important revenue stream. Additionally, the consistent growth in cancellations across all product categories indicates a need for improved quality control, clearer product descriptions, or better delivery processes to reduce cancellation rates.

### Task 4: Annual Payment Type Usage Analysis

The analysis of payment methods from 2016 to 2018 revealed clear customer preferences and changing payment behaviors:

- **Overall Payment Preferences**: Credit cards dominated as the preferred payment method with 76,795 transactions (74.0% of all payments), followed by "boleto" (a popular Brazilian payment method) with 19,784 transactions (19.1%), vouchers with 5,775 transactions (5.6%), and debit cards with only 1,529 transactions (1.5%).
- **Yearly Payment Trends**:

  - Credit card usage increased from 258 transactions in 2016 to 41,969 in 2018
  - Boleto payments grew from 63 transactions in 2016 to 10,213 in 2018
  - Voucher usage increased from 23 transactions in 2016 to 2,725 in 2018, though it declined from 3,027 in 2017
  - Debit card usage showed the most significant proportional growth, from just 2 transactions in 2016 to 1,105 in 2018
- **Emerging Trends**: Debit card usage showed the strongest growth rate between 2017 and 2018 (161.8% increase), indicating an increasing customer comfort with this payment method.

**Business Implications**:
The strong preference for credit cards suggests customers value the flexibility and security they provide for online purchases. The company should ensure its payment system is optimized for credit card processing while maintaining support for alternative methods, particularly boleto which remains important in the Brazilian market. The declining growth rate of voucher usage in 2018 warrants investigation—it may indicate issues with the voucher program or changing customer preferences. The significant growth in debit card transactions suggests potential for expanding this payment option for customers who prefer direct bank payments. Overall, a multi-payment strategy remains essential, with emphasis on credit card optimization and monitoring the growing debit card segment.

## Cross-Task Analysis and Business Recommendations

Integrating insights across all analyses reveals several key patterns and opportunities:

1. **Growth with Retention Challenges**: The business experienced substantial growth in users, revenue, and transactions from 2016 to 2018, but the declining repeat customer metrics indicate a customer retention problem that could limit long-term profitability.
2. **Product Category Evolution**: Customer preferences evolved rapidly over the three-year period, with leadership in revenue shifting from furniture to home goods to health and beauty products. This suggests the need for agile inventory and marketing strategies.
3. **Payment Method Diversification**: While credit cards dominate payments, the growing adoption of debit cards and the consistent use of Brazil-specific payment methods like boleto indicate the importance of payment flexibility in the market.

Recommended Business Strategies:

- **Customer Retention Focus**: Implement a robust customer retention program focused on post-purchase engagement, personalized recommendations, and loyalty incentives to convert one-time buyers into repeat customers.
- **Product Quality Improvement**: Address the increasing cancellation rates, particularly in high-revenue categories like health and beauty, by improving quality control, product descriptions, and setting appropriate customer expectations.
- **Category-Specific Strategies**: Develop targeted strategies for top-performing categories, especially "health_beauty," which represents both the highest revenue potential and the highest cancellation risk.
- **Payment Experience Optimization**: Streamline the credit card payment process while continuing to support alternative payment methods. Consider special promotions tied to underutilized payment methods like debit cards to encourage adoption.
- **Seasonal Inventory Planning**: Align inventory levels with the growth patterns observed in the data, ensuring sufficient stock for peak periods while minimizing excess inventory during slower months.

This comprehensive analysis demonstrates that while the business achieved impressive growth in customers and revenue between 2016-2018, it must now pivot toward retention strategies, quality improvements, and payment optimization to sustain this growth and improve profitability in the coming years.
