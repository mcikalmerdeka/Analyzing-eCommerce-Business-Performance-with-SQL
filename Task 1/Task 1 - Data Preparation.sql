-- TASK 1 : DATA PREPARATION

-- ========== A. Create Database ==========

CREATE DATABASE ecommerce_rakamin_miniproject;

-- ========== B. Create Tables ==========

-- Create Table Customers
CREATE TABLE IF NOT EXISTS customers(
	customer_id VARCHAR(50) NOT NULL,
	customer_unique_id VARCHAR(50) NULL,
	customer_zip_code_prefix VARCHAR(50) NULL,
	customer_city VARCHAR(50) NULL,
	customer_state VARCHAR(50) NULL,
	CONSTRAINT customers_pk PRIMARY KEY (customer_id)
);

/*
	CONSTRAINT customers_pk PRIMARY KEY (customer_id): This line adds a primary key constraint to the "customer_id" column.
	It ensures that each value in the "customer_id" column is unique and not NULL, essentially making it the primary key for the table.
*/

-- Create Table Geolocation
CREATE TABLE IF NOT EXISTS geolocations_original(
	geolocation_zip_code_prefix VARCHAR(50) NULL,
	geolocation_lat FLOAT8 NULL,
	geolocation_lng FLOAT8 NULL,
	geolocation_city VARCHAR(50) NULL,
	geolocation_state VARCHAR(50) NULL
);

-- Create Table Order Items
CREATE TABLE IF NOT EXISTS order_items(
	order_id VARCHAR(50) NULL,
	order_item_id INT8 NULL,
	product_id VARCHAR(50) NULL,
	seller_id VARCHAR(50) NULL,
	shipping_limit_date TIMESTAMP NULL,
	price FLOAT8 NULL,
	freight_value FLOAT8 NULL
);

-- Create Table Order Payments
CREATE TABLE IF NOT EXISTS order_payments(
	order_id VARCHAR(50) NULL,
	payment_sequential INT8 NULL,
	payment_type VARCHAR(50) NULL,
	payment_installments INT8 NULL,
	payment_value FLOAT8 NULL
);

-- Create Table Order Reviews
CREATE TABLE IF NOT EXISTS order_reviews(
	review_id VARCHAR(100) NULL,
	order_id VARCHAR(100) NULL,
	review_score INT8 NULL,
	review_comment_title VARCHAR(1000) NULL,
	review_comment_message VARCHAR(1200) NULL,
	review_creation_date TIMESTAMP NULL,
	review_answer_timestamp TIMESTAMP NULL
);

-- Create Table Orders
CREATE TABLE IF NOT EXISTS orders(
	order_id VARCHAR(50) NOT NULL,
	customer_id VARCHAR(50) NULL,
	order_status VARCHAR(50) NULL,
	order_purchase_timestamp TIMESTAMP NULL,
	order_approved_at TIMESTAMP NULL,
	order_delivered_carrier_date TIMESTAMP NULL,
	order_delivered_customer_date TIMESTAMP NULL,
	order_estimated_delivery_date TIMESTAMP NULL,
	CONSTRAINT orders_pk PRIMARY KEY (order_id)
);

-- Create Table Products
CREATE TABLE IF NOT EXISTS products(
	column_1 INT8 NULL,
	product_id VARCHAR(50) NOT NULL,
	product_category_name VARCHAR(50) NULL,
	product_name_lenght FLOAT8 NULL,
	product_description_lenght FLOAT8 NULL,
	product_photos_qty FLOAT8 NULL,
	product_weight_g FLOAT8 NULL,
	product_length_cm FLOAT8 NULL,
	product_height_cm FLOAT8 NULL,
	product_width_cm FLOAT8 NULL,
	CONSTRAINT products_pk PRIMARY KEY (product_id)
);

-- Create Table Sellers
CREATE TABLE IF NOT EXISTS sellers(
	seller_id VARCHAR(50) NOT NULL,
	seller_zip_code_prefix VARCHAR(50) NULL,
	seller_city VARCHAR(50) NULL,
	seller_state VARCHAR(50) NULL,
	CONSTRAINT sellers_pk PRIMARY KEY (seller_id)
);

-- ========== C. Import Data ==========

-- Import Data Customers
COPY customers(
	customer_id,
	customer_unique_id,
	customer_zip_code_prefix,
	customer_city,
	customer_state
)
FROM 'E:\Rakamin Academy\JAP Program\Mini Project 1 - Analyzing eCommerce Business Performance with SQL\Dataset\customers_dataset.csv'
DELIMITER ','
CSV HEADER;

-- Import Data Geolocation
COPY geolocations_original(
	geolocation_zip_code_prefix,
	geolocation_lat,
	geolocation_lng,
	geolocation_city,
	geolocation_state
)
FROM 'E:\Rakamin Academy\JAP Program\Mini Project 1 - Analyzing eCommerce Business Performance with SQL\Dataset\geolocation_dataset.csv'
DELIMITER ','
CSV HEADER;

-- Import Data Order Items
COPY order_items(
	order_id,
	order_item_id,
	product_id,
	seller_id,
	shipping_limit_date,
	price,
	freight_value
)
FROM 'E:\Rakamin Academy\JAP Program\Mini Project 1 - Analyzing eCommerce Business Performance with SQL\Dataset\order_items_dataset.csv'
DELIMITER ','
CSV HEADER;

-- Import Data Order Payments
COPY order_payments(
	order_id,
	payment_sequential,
	payment_type,
	payment_installments,
	payment_value
)
FROM 'E:\Rakamin Academy\JAP Program\Mini Project 1 - Analyzing eCommerce Business Performance with SQL\Dataset\order_payments_dataset.csv'
DELIMITER ','
CSV HEADER;

-- Import Data Order Reviews
COPY order_reviews(
	review_id,
	order_id,
	review_score,
	review_comment_title,
	review_comment_message,
	review_creation_date,
	review_answer_timestamp
)
FROM 'E:\Rakamin Academy\JAP Program\Mini Project 1 - Analyzing eCommerce Business Performance with SQL\Dataset\order_reviews_dataset.csv'
DELIMITER ','
CSV HEADER;
	
-- Import Data Orders
COPY orders(
	order_id,
	customer_id,
	order_status,
	order_purchase_timestamp,
	order_approved_at,
	order_delivered_carrier_date,
	order_delivered_customer_date,
	order_estimated_delivery_date
)
FROM 'E:\Rakamin Academy\JAP Program\Mini Project 1 - Analyzing eCommerce Business Performance with SQL\Dataset\orders_dataset.csv'
DELIMITER ','
CSV HEADER;

-- Import Data Products
COPY products(
	column_1,
	product_id,
	product_category_name,
	product_name_lenght,
	product_description_lenght,
	product_photos_qty,
	product_weight_g,
	product_length_cm,
	product_height_cm,
	product_width_cm
)
FROM 'E:\Rakamin Academy\JAP Program\Mini Project 1 - Analyzing eCommerce Business Performance with SQL\Dataset\product_dataset.csv'
DELIMITER ','
CSV HEADER;

-- Import Data Sellers
COPY sellers(
	seller_id,
	seller_zip_code_prefix,
	seller_city,
	seller_state
)
FROM 'E:\Rakamin Academy\JAP Program\Mini Project 1 - Analyzing eCommerce Business Performance with SQL\Dataset\sellers_dataset.csv'
DELIMITER ','
CSV HEADER;


-- ========== D. Extra Pre-Processing For Geolocations Table ==========

CREATE TABLE geolocations_cleaned_city_state AS
SELECT geolocation_zip_code_prefix, geolocation_lat, geolocation_lng, 
REPLACE(REPLACE(REPLACE(
TRANSLATE(TRANSLATE(TRANSLATE(TRANSLATE(
TRANSLATE(TRANSLATE(TRANSLATE(TRANSLATE(
    geolocation_city, '£,³,´,.', ''), '`', ''''), 
    'é,ê', 'e,e'), 'á,â,ã', 'a,a,a'), 'ô,ó,õ', 'o,o,o'),
	'ç', 'c'), 'ú,ü', 'u,u'), 'í', 'i'), 
	'4o', '4º'), '* ', ''), '%26apos%3b', ''''
) AS geolocation_city, geolocation_state
from geolocations_original;

CREATE TABLE geolocations AS
WITH geolocations_cleaned_filtered AS (
	SELECT geolocation_zip_code_prefix,
	geolocation_lat,
	geolocation_lng,
	geolocation_city,
	geolocation_state FROM (
		SELECT *,
			ROW_NUMBER() OVER (
				PARTITION BY geolocation_zip_code_prefix
			) AS ROW_NUMBER
		FROM geolocations_cleaned_city_state
	) TEMP
	WHERE ROW_NUMBER = 1
),
customer_geolocations AS (
	SELECT customer_zip_code_prefix,
	geolocation_lat,
	geolocation_lng,
	customer_city,
	customer_state
	FROM (
		SELECT *,
			ROW_NUMBER() OVER (
				PARTITION BY customer_zip_code_prefix
			) AS ROW_NUMBER
		FROM (
			SELECT customer_zip_code_prefix,
				geolocation_lat, 
				geolocation_lng,
				customer_city,
				customer_state
			FROM customers
			LEFT JOIN geolocations_original 
			ON customer_city = geolocation_city
			AND customer_state = geolocation_state
			WHERE customer_zip_code_prefix NOT IN (
				SELECT geolocation_zip_code_prefix
				FROM geolocations_original 
			)
		) geo
	) TEMP
	WHERE ROW_NUMBER = 1
),
seller_geolocations AS (
	SELECT seller_zip_code_prefix,
		geolocation_lat, 
		geolocation_lng,
		seller_city,
		seller_state 
	FROM (
		SELECT *,
			ROW_NUMBER() OVER (
				PARTITION BY seller_zip_code_prefix
			) AS ROW_NUMBER
		FROM (
			SELECT seller_zip_code_prefix,
				geolocation_lat, 
				geolocation_lng,
				seller_city,
				seller_state
			FROM sellers cd 
			LEFT JOIN geolocations_original 
			ON seller_city = geolocation_city
			AND seller_state = geolocation_state
			WHERE seller_zip_code_prefix NOT IN (
				SELECT geolocation_zip_code_prefix
				FROM geolocations_original 
				UNION
				SELECT customer_zip_code_prefix
				FROM seller_geolocations  
			)
		) geo
	) TEMP
	WHERE ROW_NUMBER = 1
)
SELECT * 
FROM geolocations_cleaned_filtered
UNION
SELECT * 
FROM customer_geolocations
UNION
SELECT * 
FROM seller_geolocations;

ALTER TABLE geolocations ADD CONSTRAINT geolocation_pk PRIMARY KEY (geolocation_zip_code_prefix);

-- ========== E. Adding Foreign Key ==========

ALTER TABLE orders
ADD CONSTRAINT orders_fk
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE order_payments
ADD CONSTRAINT order_payments_fk
FOREIGN KEY (order_id) REFERENCES orders(order_id)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE order_reviews
ADD CONSTRAINT order_reviews_fk
FOREIGN KEY (order_id) REFERENCES orders(order_id)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE order_items
ADD CONSTRAINT order_items_fk_orders
FOREIGN KEY (order_id) REFERENCES orders(order_id)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE order_items
ADD CONSTRAINT order_items_fk_products
FOREIGN KEY (product_id) REFERENCES products(product_id)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE order_items
ADD CONSTRAINT order_items_fk_sellers
FOREIGN KEY (seller_id) REFERENCES sellers(seller_id)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE customers
ADD CONSTRAINT customers_fk
FOREIGN KEY (customer_zip_code_prefix) REFERENCES geolocations(geolocation_zip_code_prefix)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE sellers
ADD CONSTRAINT sellers_fk
FOREIGN KEY (seller_zip_code_prefix) REFERENCES geolocations(geolocation_zip_code_prefix)
ON DELETE CASCADE ON UPDATE CASCADE;
