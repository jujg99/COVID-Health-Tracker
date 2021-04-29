const { Router } = require('express');

class TicketRouter extends Router {

    constructor(database) {
        super();

        // State
        this.database = database;

        // Binds
        this.segmentTickets = TicketRouter.segmentTickets.bind(this);
        this.getTicketsHandler = TicketRouter.getTicketsHandler.bind(this);
        this.putTicketHandler = TicketRouter.putTicketHandler.bind(this);

        // Routes
        this.get('/:username', this.getTicketsHandler);
        this.put('/:username', this.putTicketHandler);
    }

    static segmentTickets(tickets) {
        // Sort Tickets in reverse chronological order
        const sortedTickets = [...tickets]
            .sort((t1, t2) => t1.date < t2.date)
            .reverse();

        // Segment dates into answered and pending
        const segmentedTickets = sortedTickets.reduce((ts, t) => {
            if (t.answered) {
                ts.answered.push(t);
            } else {
                ts.pending.push(t);
            }
            return ts;
        }, { answered: [], pending: [] });

        return segmentedTickets;
    }

    static async getTicketsHandler(req, res, next) {
        try {
            const { username } = req.params;
            const tickets = await this.database.getTickets(username);
            res.json({
                tickets: this.segmentTickets(tickets)
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
            res.json({
                ticket
            });
        } catch (error) {
            next(error);
        }
    }

}

module.exports = TicketRouter;

