-- TASK 2 : ANNUAL CUSTOMER ACTIVITY GROWTH ANALYSIS

-- ========== A. Display the average monthly active user count for each year ==========

-- Hint: Pay attention to the consistency of the date format.

SELECT
	year,
	FLOOR(AVG(customer_total)) AS avg_monthly_active_user
FROM (
    SELECT
        EXTRACT(year FROM o.order_purchase_timestamp) AS year,
        EXTRACT(month FROM o.order_purchase_timestamp) AS month,
        COUNT(DISTINCT c.customer_unique_id) AS customer_total
    FROM orders o
    JOIN customers c
	ON o.customer_id = c.customer_id
    GROUP BY 1, 2
) AS monthly
GROUP BY 1
ORDER BY 1;

-- (Additional) Same result but using CTE instead of subquery
WITH monthly AS (
	SELECT
		EXTRACT(year FROM o.order_purchase_timestamp) AS year,
		EXTRACT(month FROM o.order_purchase_timestamp) AS month,
		COUNT(DISTINCT c.customer_unique_id) AS customer_total
	FROM orders o
	JOIN customers c
	ON o.customer_id = c.customer_id
	GROUP BY 1,2
)

SELECT
	year,
	FLOOR(AVG(customer_total)) AS avg_monthly_active_user
FROM monthly
GROUP BY 1
ORDER BY 1;


-- ========== B. Display the number of new customers for each year ==========

-- Hint: New customers are those who place their first order.

SELECT
	EXTRACT(year FROM first_order_date) AS year,
	COUNT(customer_unique_id) AS total_new_customer
FROM(
	SELECT
		c.customer_unique_id,
		MIN(o.order_purchase_timestamp) AS first_order_date
	FROM orders o
	JOIN customers c
	ON o.customer_id = c.customer_id
	GROUP BY 1
) AS yearly_first_order
GROUP BY 1
ORDER BY 1;

-- ========== C. Display the number of customers who made more than one purchase (repeat orders) for each year ==========

-- Hint: Repeat customers are those who place more than 1 order.

SELECT
	year,
	COUNT(DISTINCT customer_unique_id) AS total_repeat_customer
FROM(
	SELECT
		EXTRACT(year FROM o.order_purchase_timestamp) AS year,	
		c.customer_unique_id,
		COUNT(c.customer_unique_id) AS total_customer,
		COUNT(o.order_id) AS total_order
	FROM orders o
	JOIN customers c
	ON o.customer_id = c.customer_id
	GROUP BY 1,2
	HAVING COUNT(o.order_id) > 1
) AS yearly_repeat_order
GROUP BY 1
ORDER BY 1;

-- ========== D. Display the average number of orders made by customers for each year ==========

-- Hint: Calculate the order frequency (how many times they ordered) for each customer first.

SELECT
	year,
	ROUND(AVG(order_freq), 2) AS average_order
FROM(
	SELECT
		EXTRACT(year FROM o.order_purchase_timestamp) AS year,	
		c.customer_unique_id,
		COUNT(c.customer_unique_id) AS total_customer,
		COUNT(o.order_id) AS order_freq
	FROM orders o
	JOIN customers c
	ON o.customer_id = c.customer_id
	GROUP BY 1,2
) AS yearly_avg_order
GROUP BY 1
ORDER BY 1;

-- ========== E. Combine the three successfully displayed metrics into a single table view ==========

WITH cte_mau AS (
	SELECT
		year,
		FLOOR(AVG(customer_total)) AS avg_monthly_active_user
	FROM (
		SELECT
			EXTRACT(year FROM o.order_purchase_timestamp) AS year,
			EXTRACT(month FROM o.order_purchase_timestamp) AS month,
			COUNT(DISTINCT c.customer_unique_id) AS customer_total
		FROM orders o
		JOIN customers c
		ON o.customer_id = c.customer_id
		GROUP BY 1, 2
	) AS monthly
	GROUP BY 1
	ORDER BY 1
),

cte_new_cust AS (
	SELECT
		EXTRACT(year FROM first_order_date) AS year,
		COUNT(customer_unique_id) AS total_new_customer
	FROM(
		SELECT
			c.customer_unique_id,
			MIN(o.order_purchase_timestamp) AS first_order_date
		FROM orders o
		JOIN customers c
		ON o.customer_id = c.customer_id
		GROUP BY 1
	) AS yearly_first_order
	GROUP BY 1
	ORDER BY 1
),

cte_repeat_order AS (
	SELECT
		year,
		COUNT(DISTINCT customer_unique_id) AS total_repeat_customer
	FROM(
		SELECT
			EXTRACT(year FROM o.order_purchase_timestamp) AS year,	
			c.customer_unique_id,
			COUNT(c.customer_unique_id) AS total_customer,
			COUNT(o.order_id) AS total_order
		FROM orders o
		JOIN customers c
		ON o.customer_id = c.customer_id
		GROUP BY 1,2
		HAVING COUNT(o.order_id) > 1
	) AS yearly_repeat_order
	GROUP BY 1
	ORDER BY 1
),

cte_avg_order AS (
	SELECT
		year,
		ROUND(AVG(order_freq), 2) AS average_order
	FROM(
		SELECT
			EXTRACT(year FROM o.order_purchase_timestamp) AS year,	
			c.customer_unique_id,
			COUNT(c.customer_unique_id) AS total_customer,
			COUNT(o.order_id) AS order_freq
		FROM orders o
		JOIN customers c
		ON o.customer_id = c.customer_id
		GROUP BY 1,2
	) AS yearly_avg_order
	GROUP BY 1
	ORDER BY 1
)

SELECT
	mau.year AS year,
	mau.avg_monthly_active_user,
	nc.total_new_customer,
	ro.total_repeat_customer,
	ao.average_order

FROM cte_mau mau
JOIN cte_new_cust nc
ON mau.year = nc.year
JOIN cte_repeat_order ro
ON nc.year = ro.year
JOIN cte_avg_order ao
ON ro.year = ao.year

GROUP BY 1,2,3,4,5
ORDER BY 1;