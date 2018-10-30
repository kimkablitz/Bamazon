ALTER USER 'root'@'localhost' IDENTIFIED
WITH mysql_native_password BY '';
DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products
(
    item_id INT NOT NULL
    AUTO_INCREMENT,
  product_name VARCHAR
    (100) NOT NULL,
  department_name VARCHAR
    (100),
  stock_quantity INT
    (50) NOT NULL,
  price DECIMAL
    (10,2) NOT NULL DEFAULT 1.00,
  PRIMARY KEY
    (item_id)
);

    INSERT INTO products
        (product_name,department_name,stock_quantity,price)
    VALUES
        ("Coffee table", "Household", "3", 45.75);
    INSERT INTO products
        (product_name,department_name,stock_quantity,price)
    VALUES
        ("SamSung Galaxy S4", "Electronics", "1", 75.21);
    INSERT INTO products
        (product_name,department_name,stock_quantity,price)
    VALUES
        ("Sweater", "Clothing", "2", 40);
    INSERT INTO products
        (product_name,department_name,stock_quantity,price)
    VALUES
        ("pillow", "Home", "4", 8.99);

    INSERT INTO products
        (product_name,department_name,stock_quantity,price)
    VALUES
        ("toilet paper", "Household", "12", 15.99);
    INSERT INTO products
        (product_name,department_name,stock_quantity,price)
    VALUES
        ("coffee", "Food", "100", 15.75);
    INSERT INTO products
        (product_name,department_name,stock_quantity,price)
    VALUES
        ("Towel", "Home", "20", 8.50);
    INSERT INTO products
        (product_name,department_name,stock_quantity,price)
    VALUES
        ("T-Shirt", "Clothing", "40", 9.99);
    INSERT INTO products
        (product_name,department_name,stock_quantity,price)
    VALUES
        ("USB Fast Charger", "Electronics", "10", 12.99);
    INSERT INTO products
        (product_name,department_name,stock_quantity,price)
    VALUES
        ("Cliff Protein Bars", "Food", "12", 4.00);