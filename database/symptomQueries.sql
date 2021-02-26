use cht;
-- Select all data from symptoms
select * from symptoms;
-- Select symptoms from a given date for a specific unit
select date, symptoms from symptoms where username = '' and date = 2020-10-06;