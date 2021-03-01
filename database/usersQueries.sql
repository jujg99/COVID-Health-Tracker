use cht;
-- Select all data from the users table
select * from users;
-- Select all data excluding the users password
select username, first_name, last_name, county from users;
-- Insert statment
INSERT INTO users (username, password, first_name, last_name, county)
VALUES ('KittenMan', 'meowmeow100', 'Bob', 'Frank', 'Boris');