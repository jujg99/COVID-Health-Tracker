const { Router } = require('express');

class AdminRouter extends Router {
    constructor(database) {
        super();

        this.database = database;

        this.getAllUsers = AdminRouter.getAllUsers.bind(this);
        this.getUserCounts = AdminRouter.getUserCounts.bind(this);
        this.deleteUser = AdminRouter.deleteUser.bind(this);

        this.get('/users', this.getAllUsers);
        this.get('/counts', this.getUserCounts);
        this.post('/delete', this.deleteUser);
    }

    static async getAllUsers(req, res, next) {
        try {
            const users = await this.database.getAllUsers();
            return res.send(users);
        } catch (error) {
            next(error);
        }
    }

    static async getUserCounts(req, res, next) {
        try {
            const counts = await this.database.getUserCounts();
            return res.send(counts);
        } catch (error) {
            next(error);
        }
    }

    static async deleteUser(req, res, next) {
        try {
            const data = req.body;
            const ret = await this.database.deleteUser(data);
            res.send(ret);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AdminRouter;