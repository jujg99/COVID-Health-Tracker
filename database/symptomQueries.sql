use cht;
-- Select all data from symptoms
select * from symptoms;
-- Select symptoms from a given date for a specific user
select date, symptoms from symptoms where username = 'KittenMan' and date = '2020-10-05';
-- Insert statement
INSERT INTO symptoms (username, date, symptoms)
VALUES ('KittenMan', '2020-10-05', 'headache, weak knees');