USE `cht`;

CREATE TABLE `users` (
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `county` varchar(50) NOT NULL,
  PRIMARY KEY (`username`)
);

CREATE TABLE `travels` (
  `username` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `county` varchar(50) NOT NULL,
  KEY `usernameTravels_idx` (`username`),
  CONSTRAINT `usernameTravels` FOREIGN KEY (`username`) REFERENCES `users` (`username`)
);

CREATE TABLE `tests` (
  `username` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `test` varchar(50) NOT NULL,
  `result` varchar(50) NOT NULL,
  KEY `usernameTests_idx` (`username`),
  CONSTRAINT `usernameTests` FOREIGN KEY (`username`) REFERENCES `users` (`username`)
);

CREATE TABLE `symptoms` (
  `username` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `symptoms` varchar(200) NOT NULL,
  KEY `usernameSymptoms_idx` (`username`),
  CONSTRAINT `usernameSymptoms` FOREIGN KEY (`username`) REFERENCES `users` (`username`)
);
