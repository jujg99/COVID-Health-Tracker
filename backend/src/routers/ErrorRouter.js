const { Router } = require('express');

class ErrorRouter extends Router {

    constructor(configuration) {
        super();

        // State
        this.configuration = configuration;

        // this Bind
        this.handleErrorRoute = ErrorRouter.handleErrorRoute.bind(this);

        // Routes
        this.use(ErrorRouter.errorWrapperRoute);
        this.use(this.handleErrorRoute);
    }

    static errorWrapperRoute(req, res, next) {
        const err = new Error('Not found');
        err.status = 404;
        next(err);
    }

    static handleErrorRoute(err, req, res, next) {

        res.status(err.status || 500);

        if (this.configuration.NODE_ENV === 'development') {
            return res.json({
                message: err.message,
                error: err
            });
        }

        if (err.status === 401) {
            res.send('Unauthorized');
        } else {
            res.send(err.message);
        }

    }

}

module.exports = ErrorRouter;

