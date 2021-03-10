use cht;
-- Select all data from travels
select * from travels;

-- Select all travel data that occured before 5/02/2020
select * from travels where date < '2020-05-02';

-- Select all travel data that occured between 5/02/2020 and 12/30/2019
select * from travels where date < '2020-05-02' and date > '2019-12-30';