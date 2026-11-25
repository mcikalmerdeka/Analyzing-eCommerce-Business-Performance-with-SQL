-- TASK 3 : ANNUAL PRODUCT CATEGORY QUALITY ANALYSIS

DROP TABLE IF EXISTS total_revenue_yearly; 
DROP TABLE IF EXISTS total_cancel_orders_yearly;
DROP TABLE IF EXISTS top_product_category_revenue_yearly; 
DROP TABLE IF EXISTS top_product_category_canceled_yearly; 

-- ========== A. Create table that contains total revenue for each year ==========

-- Hint: Revenue consists of the price of goods as well as shipping costs.
-- Also, ensure to filter out the appropriate order statuses to calculate revenue.

CREATE TABLE IF NOT EXISTS total_revenue_yearly AS
SELECT
	EXTRACT(year FROM o.order_purchase_timestamp) AS year,
    ROUND(SUM(oi.price + oi.freight_value)::numeric,2) AS total_revenue
FROM orders o
JOIN order_items oi
ON o.order_id = oi.order_id
WHERE o.order_status = 'delivered'
GROUP by 1
ORDER BY 1;

-- ========== B. Create table that contains total cancel order for each year ==========

-- Hint: Pay attention to filtering out the appropriate order status to calculate the number of canceled orders.

CREATE TABLE IF NOT EXISTS total_cancel_orders_yearly AS
SELECT
	EXTRACT(year FROM order_purchase_timestamp) AS year,
    COUNT(order_id) AS total_cancel_order
FROM orders
WHERE order_status = 'canceled'
GROUP by 1
ORDER BY 1;

-- ========== C. Create table containing the names of product categories that provide the highest total revenue for each year ==========

-- Hint: Hint: Pay attention to the use of window functions and also the applied filtering

CREATE TABLE top_product_category_revenue_yearly AS 
WITH revenue_category_orders AS (
	SELECT
		EXTRACT(year FROM order_purchase_timestamp) AS year,
		p.product_category_name,
		ROUND(SUM(oi.price + oi.freight_value)::numeric,2) AS total_revenue,
		RANK() OVER(
			PARTITION BY EXTRACT(year FROM order_purchase_timestamp)
			ORDER BY SUM(oi.price + oi.freight_value) DESC
		) AS ranking
	FROM orders o
	JOIN order_items oi
	ON o.order_id = oi.order_id
	JOIN products p
	ON oi.product_id = p.product_id
	WHERE o.order_status = 'delivered'
	GROUP BY 1,2
)

SELECT
	year,
	product_category_name,
	total_revenue
FROM revenue_category_orders
WHERE ranking = 1;

-- ========== D. Create table containing the names of product categories that have the highest number of canceled orders for each year.= ==========

-- Hint: Hint: Pay attention to the use of window functions and the applied filtering

CREATE TABLE top_product_category_canceled_yearly AS 
WITH product_category_canceled_orders AS (
	SELECT
		EXTRACT(year FROM order_purchase_timestamp) AS year,
		p.product_category_name,
    	COUNT(o.order_id) AS total_cancel_order,
		RANK() OVER(
			PARTITION BY EXTRACT(year FROM order_purchase_timestamp)
			ORDER BY COUNT(o.order_id) DESC
		) AS ranking
	FROM orders o
	JOIN order_items oi
	ON o.order_id = oi.order_id
	JOIN products p
	ON oi.product_id = p.product_id
	WHERE o.order_status = 'canceled'
	GROUP BY 1,2
	ORDER BY 1
)

SELECT
	year,
	product_category_name,
	total_cancel_order
FROM product_category_canceled_orders
WHERE ranking = 1;


-- ========== E. Combining the obtained information into a single table view ==========

-- Hint: Pay attention to the join technique applied and the selected columns

SELECT
	tpr.year, 
	try.total_revenue AS total_revenue_yearly,
	tpr.product_category_name AS top_product_category_revenue_name, 
	tpr.total_revenue AS top_product_category_revenue,
	tcy.total_cancel_order AS total_cancel_orders_yearly,
	tpc.product_category_name AS top_product_category_cancel_name,
	tpc.total_cancel_order AS top_product_category_cancel
	
FROM top_product_category_revenue_yearly tpr
JOIN total_revenue_yearly try 
ON tpr.year = try.year
JOIN top_product_category_canceled_yearly tpc
ON try.year = tpc.year
JOIN total_cancel_orders_yearly tcy
ON tpc.year = tcy.year;