-- User Database Inserts
#1 Password is 'SneakyKittyGuy'
INSERT INTO users (username, password, id, admin, first_name, last_name, age, atRisk, city, state)
VALUES ('KittenMan', 'ae54cd65486f129e2f673bea22c3cc542302a2e7194ffda09bb8876c4bc3080b',
 '10010', TRUE, 'Sean', 'Guo', 22, FALSE, 'New York', 'NY');
#2 Password is 'B'
INSERT INTO users (username, password, id, admin, first_name, last_name, age, atRisk, city, state)
VALUES ('A', '4859a8c7c37fac9b1235eaff6681b50b880ead928169b884f8a85ca858df204f',
uuid_to_bin(uuid()), FALSE, 'Bob', 'Marley', 58, TRUE, 'Frankfurt', 'BL');
#3 Password is 'OMGsoSneaky'
INSERT INTO users (username, password, id, admin, first_name, last_name, age, atRisk, city, state)
VALUES ('16yoEdgelord', 'e20367867e1d8da2ccb8dfac05dacda9e9a7bd7fec907ae18551a3e106a209b2',
uuid_to_bin(uuid()), FALSE, 'Echo', 'Noir', 16, FALSE, 'Boston', 'MA');
#4 Password is 'ABCD1234'
INSERT INTO users (username, password, id, admin, first_name, last_name, age, atRisk, city, state)
VALUES ('SimpleSadMan', 'fd596f666aa5b60134deed40065f90944f497b8ada7e18879e52a47b5a311695',
uuid_to_bin(uuid()), FALSE, 'Craig', 'Caruso', 45, TRUE, 'New York', 'NY');
#5 Password is 'HulaHula12'
INSERT INTO users (username, password, id, admin, first_name, last_name, age, atRisk, city, state)
VALUES ('Bailamos', 'fc58a9224878c5e62bf999c6761f64b11f5bb5cd66f8b0d2f9cec56f862d3c81',
uuid_to_bin(uuid()), TRUE, 'Enrique', 'Ramos', 33, FALSE, 'Tampa Bay', 'FL');
#6 Password is 'NM23'
INSERT INTO users (username, password, id, admin, first_name, last_name, age, atRisk, city, state)
VALUES ('NotMacho11', 'ec14490ca945f3bc554b0c178f1c106e96401e0d55537d634cb750aaf948a56a',
uuid_to_bin(uuid()), FALSE, 'Sammy', 'Kramer', 12, TRUE, 'Boston', 'MA');
#7 Password is 'H1Z1'
INSERT INTO users (username, password, id, admin, first_name, last_name, age, atRisk, city, state)
VALUES ('AbbyA', '1d10c53472e77166158fed02850da5ff4251fe4d9c01ed790519a89201d6c28b',
uuid_to_bin(uuid()), FALSE, 'Abby', 'Agumon', 24, FALSE, 'Toledo', 'CA');
#8 Password is 'password'
INSERT INTO users (username, password, id, admin, first_name, last_name, age, atRisk, city, state)
VALUES ('Uther', '246d71a7f3bb3be00a99c38d122a19cf883d3f79b79e706a2c1643ea55252008',
uuid_to_bin(uuid()), FALSE, 'Uther', 'Uthergurd', 56, FALSE, 'Tyre', 'FL');
#9 Password is 'SY19'
INSERT INTO users (username, password, id, admin, first_name, last_name, age, atRisk, city, state)
VALUES ('syall', '2e39489c22e79a5a683254f3d8b999666be52cd75f98ffb88cc816024eb74d7d',
uuid_to_bin(uuid()), TRUE, 'Steven', 'Yuan', 82, TRUE, 'Jersey City', 'NJ');
#10 Password is 'sg001'
INSERT INTO users (username, password, id, admin, first_name, last_name, age, atRisk, city, state)
VALUES ('KittenFeeFee', '7ce9fa5800994bf871e0d800a5ab97f92d63855c8ba38f88b5bb9f37a1d18904',
uuid_to_bin(uuid()), TRUE, 'Shawn', 'Gwoah', 25, FALSE, 'Highland Park', 'NJ');


-- Tests Database Inserts
#1
INSERT INTO tests (username, date, test, result)
VALUES ('KittenMan', '2020-10-05', 'Nose Poker', 'Negative');
#2
INSERT INTO tests (username, date, test, result)
VALUES ('A', '2019-06-25', 'Spit Swab', 'Positive');
#3
INSERT INTO tests (username, date, test, result)
VALUES ('16yoEdgelord', '2020-02-05', 'Nose Poker', 'Negative');
#4
INSERT INTO tests (username, date, test, result)
VALUES ('SimpleSadMan', '2019-07-27', 'Spit Swab', 'Negative');
#5
INSERT INTO tests (username, date, test, result)
VALUES ('Bailamos', '2020-03-23', 'Mask on Mask off', 'Negative');
#6
INSERT INTO tests (username, date, test, result)
VALUES ('NotMacho11', '2021-02-12', 'Spit Swab', 'Positive');
#7 
INSERT INTO tests (username, date, test, result)
VALUES ('AbbyA', '2020-07-14', 'Nose Poker', 'Positive');
#8
INSERT INTO tests (username, date, test, result)
VALUES ('Uther', '2020-11-29', 'Spit Swab', 'Negative');
#9
INSERT INTO tests (username, date, test, result)
VALUES ('syall', '2020-05-30', 'Nose Poker', 'Negative');
#10
INSERT INTO tests (username, date, test, result)
VALUES ('KittenFeeFee', '2020-05-30', 'Mask on Mask off', 'Positive');

-- Symptoms Database Inserts
#1 
INSERT INTO symptoms (username, date, temperature, cough, shortBreath, fatigue,
bodyAche, tasteLoss, soreThroat, congest, nausea, other)
VALUES ('KittenMan', '2020-10-05', 102, true, true, false, true,
 false, false, false, true, 'Cannot stop dancing, skinny hands');
#2
INSERT INTO symptoms (username, date, temperature, cough, shortBreath, fatigue,
bodyAche, tasteLoss, soreThroat, congest, nausea, other)
VALUES ('A', '2020-10-05', 76, false, true, true, false,
 false, true, false, true, 'Inability to jam to music');
#3
INSERT INTO symptoms (username, date, temperature, cough, shortBreath, fatigue,
bodyAche, tasteLoss, soreThroat, congest, nausea, other)
VALUES ('16yoEdgelord', '2020-01-17', 98, true, false, true, true,
 true, false, false, false, 'Sings about his ex');
#4
INSERT INTO symptoms (username, date, temperature, cough, shortBreath, fatigue,
bodyAche, tasteLoss, soreThroat, congest, nausea, other)
VALUES ('SimpleSadMan', '2019-08-18', 100, false, true, true, false,
 true, false, false, true, 'Shaky hands');
#5
INSERT INTO symptoms (username, date, temperature, cough, shortBreath, fatigue,
bodyAche, tasteLoss, soreThroat, congest, nausea, other)
VALUES ('Bailamos', '2020-05-16', 95, false, false, false, false,
 false, false, false, false, 'Has been taken over by the rhythm');
#6
INSERT INTO symptoms (username, date, temperature, cough, shortBreath, fatigue,
bodyAche, tasteLoss, soreThroat, congest, nausea, other)
VALUES ('NotMacho11', '2021-01-02', 105, true, true, true,
true, false, true, true, false, 'Weak wimpy arms, So wimpy, So weak');
#7
INSERT INTO symptoms (username, date, temperature, cough, shortBreath, fatigue,
bodyAche, tasteLoss, soreThroat, congest, nausea, other)
VALUES ('AbbyA', '2020-07-14', 99, false, false, false,
false, false, false, false, false, 'Mild headache');
#8
INSERT INTO symptoms (username, date, temperature, cough, shortBreath, fatigue,
bodyAche, tasteLoss, soreThroat, congest, nausea, other)
VALUES ('Uther', '2020-10-23', 150, false, false, false,
false, false, false, false, false, 'Abnormally muscular for his age');
#9
INSERT INTO symptoms (username, date, temperature, cough, shortBreath, fatigue,
bodyAche, tasteLoss, soreThroat, congest, nausea, other)
VALUES ('syall', '2020-08-21', 98, false, false, true,
true, false, false, false, false, 'Only walks never runs');
#10
INSERT INTO symptoms (username, date, temperature, cough, shortBreath, fatigue,
bodyAche, tasteLoss, soreThroat, congest, nausea, other)
VALUES ('KittenFeeFee', '2020-11-02', 98, false, false, true,
true, false, true, true, false, 'So handsome, such a beautiful man');

-- Travels Database Inserts
#1 
INSERT INTO travels (username, date, city, state)
VALUES ('KittenMan', '2020-10-05', 'Philedelphia', 'PA');
#2
INSERT INTO travels (username, date, city, state)
VALUES ('A', '2019-04-24', 'Trenton', 'NJ');
#3
INSERT INTO travels (username, date, city, state)
VALUES ('16yoEdgelord', '2020-03-13', 'Cancun', 'MX');
#4
INSERT INTO travels (username, date, city, state)
VALUES ('SimpleSadMan', '2020-09-03', 'Las Vegas', 'NV');
#5
INSERT INTO travels (username, date, city, state)
VALUES ('Bailamos', '2020-04-16', 'Los Santos', 'CA');
#6
INSERT INTO travels (username, date, city, state)
VALUES ('NotMacho11', '2020-02-11', 'Cambridge', 'MA');
#7
INSERT INTO travels (username, date, city, state)
VALUES ('AbbyA', '2020-06-20', 'Cairo', 'EG');
#8
INSERT INTO travels (username, date, city, state)
VALUES ('Uther', '2020-09-15', 'Sovesty', 'RU');
#9
INSERT INTO travels (username, date, city, state)
VALUES ('syall', '2020-02-05', 'Piscataway', 'NJ');
#10
INSERT INTO travels (username, date, city, state)
VALUES ('KittenFeeFee', '2020-02-05', 'Piscataway', 'NJ');