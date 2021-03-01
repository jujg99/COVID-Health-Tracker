use cht;
-- Select all data from the tests table
select * from tests;
-- Select a test from a specific date for a given user
select test, result from tests
where username = 'KittenMan' and date = '2020-10-05';
-- Insert statement
INSERT INTO tests (username, date, test, result)
VALUES ('KittenMan', '2020-10-05', 'Nose Poker', 'Negative');