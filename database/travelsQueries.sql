use cht;
-- Select all data from travels
select * from travels;
-- Select all users that travelled to a given county on a given date
select username, date, county from travels
where county = '' and date = 2020-10-06;