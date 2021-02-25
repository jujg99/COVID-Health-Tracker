#!/usr/bin/env node
const Configuration = require('./src/config/Configuration');
const Database = require('./src/external/Database');
const CovidHealthTracker = require('./src/CovidHealthTracker');
const Server = require('./src/config/Server');

// Configuration
const configuration = new Configuration();

// Database
const database = new Database(configuration);

// Application
const app = new CovidHealthTracker(database, configuration);

// Server
(new Server(app, configuration)).run();

