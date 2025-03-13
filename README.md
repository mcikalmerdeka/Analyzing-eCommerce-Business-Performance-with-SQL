# Analyzing eCommerce Business Performance with SQL

![Project Header](https://raw.githubusercontent.com/mcikalmerdeka/Analyzing-eCommerce-Business-Performance-with-SQL/refs/heads/main/Assets/Project%20Header.jpg)

**This project originally came from an assignment after a data science bootcamp program that I attended. Which is why you can see there are several folders of tasks that contain instructions about business questions that must be answered based on data and my presentation file for each of them.**

## Project Description 

This dataset was generously provided by Olist, the largest department store in Brazilian marketplaces. The dataset has information of 100k orders from 2016 to 2018 made at multiple marketplaces in Brazil. Its features allows viewing an order from multiple dimensions: from order status, price, payment and freight performance to customer location, product attributes and finally reviews written by customers. We also released a geolocation dataset that relates Brazilian zip codes to lat/lng coordinates.

Here is the initial walkthrough of the task:

- `Task 1` explains the data preparation stage where as a data analyst we are given a collection of raw data (which can be found in the `Dataset` folder) containing 8 tables namely customers, geolocation, order items, order payments, order reviews, orders, products, and sellers. In this stage, I tried to build an ERD and digest the data into a database formed in PostgreSQL for analysis that will be carried out in subsequent stages.

- `Task 2` explains the first analysis which is about annual customer activity growth analysis utilizing the customer and order tables. This analysis compares the average monthly active user (MAU) per year and examines its comparison with total new customers per year. Additionally, analysis is also conducted regarding metrics of repeat orders and average order value per year.

- `Task 3` explains the second analysis which is about annual product category quality analysis utilizing the orders, order items, and products tables. In this analysis, the metrics analyzed are total revenue, cancel orders, and product categories that provide the highest total revenue and product categories that have the highest canceled orders each year.

- `Task 4` explains the third analysis which is about annual payment type usage analysis utilizing the orders and order_payments tables. In this analysis, the metrics analyzed are overall total payment type usage and its breakdown per year.

> For each task, the summary can be accessed in the presentation file and technical details can be accessed in each SQL script. The analysis tasks also provide the query result and tableau graph that I created.