use cht;
-- Select all data from symptoms
select * from symptoms;
-- Select symptoms from a given date for a specific user
select date, symptoms from symptoms where username = 'KittenMan' and date = '2020-10-05';
-- Insert statement
INSERT INTO symptoms (username, date, temperature, cough, shortBreath, fatigue,
bodyAche, tasteLoss, soreThroat, congest, nausea, other)
VALUES ('KittenMan', '2020-10-05', 102, true, true, false, true,
 false, false, false, true, 'Cannot stop dancing, skinny hands');