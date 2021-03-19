const { Router } = require('express');

class AdminRouter extends Router {
    constructor(database) {
        super();

        this.database = database;

        this.getAllUsers = AdminRouter.getAllUsers.bind(this);

        this.get('/', this.getAllUsers);
    }

    static async getAllUsers(req, res, next) {
        try {
            const users = await this.database.getAllUsers();
            return res.send(users);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AdminRouter;