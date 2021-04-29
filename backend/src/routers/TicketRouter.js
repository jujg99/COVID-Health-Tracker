const { Router } = require('express');

class TicketRouter extends Router {

    constructor(database) {
        super();

        // State
        this.database = database;

        // Binds
        this.getTicketsHandler = TicketRouter.getTicketsHandler.bind(this);
        this.putTicketHandler = TicketRouter.putTicketHandler.bind(this);

        // Routes
        this.get('/:username', this.getTicketsHandler);
        this.put('/:username', this.putTicketHandler);
    }

    static async getTicketsHandler(req, res, next) {
        try {
            const { username } = req.params;
            // Return sorted and segmented (answered, pending) tickets
            const tickets = await this.database.getTickets(username);
            const sortedTickets = tickets
                .sort((t1, t2) => t1.date < t2.date)
                .reverse();
            const segmentedTickets = sortedTickets.reduce((ts, t) => {
                if (t.answered) {
                    ts.answered.push(t);
                } else {
                    ts.pending.push(t);
                }
                return ts;
            }, { answered: [], pending: [] });
            res.json({
                tickets: segmentedTickets
            });
        } catch (error) {
            next(error);
        }
    }

    static async putTicketHandler(req, res, next) {
        try {
            const { username } = req.params;
            const { question } = req.body;
            const ticket = await this.database.insertTicket(username, question);
            if (ticket === null) {
                res.status(404);
                res.json({
                    message: `Ticket could not be submitted`
                });
            } else {
                res.json({
                    ticket
                });
            }
        } catch (error) {
            next(error);
        }
    }

}

module.exports = TicketRouter;

