CREATE TABLE Productos(name VARCHAR(100), description VARCHAR(512), price VARCHAR(20));

COPY Productos (Name, Description, Price)
FROM '/var/lib/postgresql/data/restaurant-menus-cleaned.csv'
DELIMITER ','
CSV HEADER;