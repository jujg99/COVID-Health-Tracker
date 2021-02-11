const path = require('path');

const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const IndexRouter = require('./routers/IndexRouter');
const UsersRouter = require('./routers/UsersRouter');

class CovidHealthTracker extends express {

    constructor() {
        super();

        // Middlewares
        this.use(logger('dev'));
        this.use(express.json());
        this.use(express.urlencoded({ extended: false }));
        this.use(cookieParser());
        this.use(express.static(path.join(__dirname, '..', 'public')));

        // Routers
        this.use('/', new IndexRouter());
        this.use('/users', new UsersRouter());
    }

}

module.exports = CovidHealthTracker;
