use cht;
-- Select all data from travels
select * from travels;
-- Select all users that travelled to a given county on a given date
select username, date, county from travels
where county = 'Namasu' and date = '2020-10-05';
-- Insert statement
INSERT INTO travels (username, date, county)
VALUES ('KittenMan', '2020-10-05', 'Namasu');