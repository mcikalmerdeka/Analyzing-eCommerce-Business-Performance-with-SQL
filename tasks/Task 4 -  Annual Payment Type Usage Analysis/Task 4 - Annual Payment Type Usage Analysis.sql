-- TASK 4 : ANNUAL PAYMENT TYPE USAGE ANALYSIS

-- ========== A. Display the total usage of each payment type all time sorted from the most favored ==========

-- Hint: Pay attention to the structure (columns) of the final table you want to obtain

SELECT
	payment_type,
	COUNT(*) AS total_usage
FROM order_payments
GROUP BY 1
ORDER BY 2 DESC;

-- ========== B. Display detailed information on the total usage of each payment type for each year ==========

-- Hint: Pay attention to the structure (columns) of the final table you want to obtain

-- Version 1
SELECT 
	EXTRACT(year FROM order_purchase_timestamp) AS year,
	op.payment_type,
	COUNT(*) AS num_of_usage 
FROM orders o 
JOIN order_payments op 
ON o.order_id = op.order_id
GROUP BY 1,2
ORDER BY 1 ASC;

-- Version 2
SELECT
	payment_type,
	COUNT(CASE WHEN EXTRACT(year FROM order_purchase_timestamp) = '2016' THEN o.order_id END) AS num_usage_2016,
	COUNT(CASE WHEN EXTRACT(year FROM order_purchase_timestamp) = '2017' THEN o.order_id END) AS num_usage_2017,
	COUNT(CASE WHEN EXTRACT(year FROM order_purchase_timestamp) = '2018' THEN o.order_id END) AS num_usage_2018
FROM orders o
JOIN order_payments op 
ON o.order_id = op.order_id 
GROUP BY 1
ORDER BY 4 DESC;

-- ========== C. Combined Table For Visualization ==========

WITH total_usage_table AS(
	SELECT
		payment_type,
		COUNT(*) AS total_usage
	FROM order_payments
	GROUP BY 1
	ORDER BY 2 DESC
),
num_usage_per_year_table AS (
	SELECT
		payment_type,
		COUNT(CASE WHEN EXTRACT(year FROM order_purchase_timestamp) = '2016' THEN o.order_id END) AS num_usage_2016,
		COUNT(CASE WHEN EXTRACT(year FROM order_purchase_timestamp) = '2017' THEN o.order_id END) AS num_usage_2017,
		COUNT(CASE WHEN EXTRACT(year FROM order_purchase_timestamp) = '2018' THEN o.order_id END) AS num_usage_2018
	FROM orders o
	JOIN order_payments op 
	ON o.order_id = op.order_id 
	GROUP BY 1
	ORDER BY 4 DESC
)

SELECT
	tu.payment_type,
	nuy.num_usage_2016,
	nuy.num_usage_2017,
	nuy.num_usage_2018,
	tu.total_usage
FROM total_usage_table tu
JOIN num_usage_per_year_table nuy
ON tu.payment_type = nuy.payment_type;