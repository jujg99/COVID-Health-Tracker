const path = require('path');

const { Router } = require('express');

class IndexRouter extends Router {

    constructor() {
        super();

        // State
        this.build = path.resolve(__dirname, '..', '..', 'public', 'index.html');

        // this Bind
        this.getDefaultRoute = IndexRouter.getDefaultRoute.bind(this);

        // Routes
        this.get('/', this.getDefaultRoute);
    }

    static getDefaultRoute(req, res, next) {
        res.sendFile(this.build);
    }

}

module.exports = IndexRouter;
