use cht;
-- Select all data from the tests table
select * from tests;
-- Select a test from a specific date for a given user
select test, result from tests
where username = 'KittenMan' and date = '2020-10-05';