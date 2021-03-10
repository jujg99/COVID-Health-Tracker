use cht;
-- Select all data from symptoms
select * from symptoms;

-- Select symptoms from a given date for a specific user
select date, symptoms from symptoms where username = 'KittenMan' and date = '2020-10-05';

-- Select all users with certain symptoms
select * from symptoms where cough = true;
select * from symptoms where cough = true and nausea = true;

-- Select users with cough within a certain date range
select * from symptoms where cough = true and date > '2019-12-25' and date < '2020-12-25';


