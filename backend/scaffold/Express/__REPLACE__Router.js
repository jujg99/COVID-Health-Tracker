/**
 * API Documentation for Router: https://expressjs.com/en/4x/api.html#router
 */
const { Router } = require('express');

class __REPLACE__Router extends Router {

    constructor(arg1, arg2, ...args) {
        /**
         * Call super() due to extending Router
         */
        super();

        /**
         * Set State
         */
        this.property1 = arg1;

        /**
         * Bind any this to handlers that require access to the this object
         */
        this.method = this.method.bind(this);

        /**
         * Define Routes using Handlers
         */
        // Handlers with no this bind
        this.METHOD(__REPLACE__Router.handler);
        // Handlers with this bind
        this.METHOD(this.handler);
    }

    /**
     * Example Handler: Request, Response, Next
     * @param {*} req Incoming HTTP request: sent by client
     * @param {*} res Current HTTP Response: managed by server
     * @param {*} next Moves onto next middleware unless passed an Error
     */
    static handler(req, res, next) {
        /**
         * Get Request Body parameters
         */
        const { body1, body2 } = req.body;

        /**
         * Change Response HTTP Status Code
         */
        res.status(404);

        /**
         * End Response
         */
        // Send a JSON object
        res.json({
            prop1: body1,
            prop2: body2
        });
        // Send text
        res.send('message from server');

        /**
         * Send to Error Route
         */
        // Create new Error Object
        const error = new Error('error message');
        // Set Error Status appropriately
        error.status = 404;
        // Pass to next()
        next(error);

    }

}

module.exports = __REPLACE__Router;

