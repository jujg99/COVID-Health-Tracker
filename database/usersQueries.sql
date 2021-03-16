use cht;
-- Select all data from the users table
select * from users;

-- Select data from users younger than 30
select username, first_name, last_name, age, city, state from users where age < 30;

-- Select all users who are admins
select username, first_name, last_name from users where admin = true;

-- Select all users from a certain state
select username, first_name, last_name from users where state = 'NY';

-- Select all users that are at risk
select username, first_name, last_name from users where atRisk = true;
