use cht;
-- Select all data from the users table
select * from users;
-- Select all data excluding the users password
select username, first_name, last_name, county from users;
-- Insert statment
INSERT INTO users (username, password, id, admin, first_name, last_name, age, atRisk, city)
VALUES ('KittenMan', 'SneakyKittyPassword', '10010', TRUE, 'Sean', 'Guo', 22, FALSE, 'New York');