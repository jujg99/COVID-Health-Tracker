use cht;
-- Select all data from the tests table
select * from tests;
-- Select a test from a specific date for a given user
select username, date, test, result from tests
where username = '' and date = 2020-10-06;