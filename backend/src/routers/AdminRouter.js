const { Router } = require('express');

class AdminRouter extends Router {
    constructor(database) {
        super();

        this.database = database;

        this.getAllUsers = AdminRouter.getAllUsers.bind(this);
        this.getUserCounts = AdminRouter.getUserCounts.bind(this);
        this.deleteUser = AdminRouter.deleteUser.bind(this);
        this.getPendingTickets = AdminRouter.getPendingTickets.bind(this);
        this.getAnsweredTickets = AdminRouter.getAnsweredTickets.bind(this);
        this.updateTicket = AdminRouter.updateTicket.bind(this);

        this.get('/users', this.getAllUsers);
        this.get('/counts', this.getUserCounts);
        this.post('/delete', this.deleteUser);
        this.get('/tickets/pending', this.getPendingTickets);
        this.get('/tickets/answered', this.getAnsweredTickets);
        this.post('/tickets/update', this.updateTicket);
    }

    // Retrieves all user data from database
    static async getAllUsers(req, res, next) {
        try {
            const users = await this.database.getAllUsers();
            return res.send(users);
        } catch (error) {
            next(error);
        }
    }

    // Retrieves counts (# of users, # of admins, # of atRisk users) from database
    static async getUserCounts(req, res, next) {
        try {
            const counts = await this.database.getUserCounts();
            return res.send(counts);
        } catch (error) {
            next(error);
        }
    }

    // Deletes specified user from database
    static async deleteUser(req, res, next) {
        try {
            const data = req.body;
            const ret = await this.database.deleteUser(data);
            res.send(ret);
        } catch (error) {
            next(error);
        }
    }

    // Retrieves all unanswered tickets from database
    static async getPendingTickets(req, res, next) {
        try {
            const pending = await this.database.getPendingTickets();
            return res.send(pending);
        } catch (error) {
            next(error);
        }
    }

    // Retrieves all answered Tickets from database
    static async getAnsweredTickets(req, res, next) {
        try {
            const answered = await this.database.getAnsweredTickets();
            return res.send(answered);
        } catch (error) {
            next(error);
        }
    }

    // Updates specified ticket from unanswered to answered
    static async updateTicket(req, res, next) {
        try {
            const data = req.body;
            const ret = await this.database.updateTicket(data);
            res.send(ret);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AdminRouter;