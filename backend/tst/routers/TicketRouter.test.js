const TicketRouter = require('../../src/routers/TicketRouter');

// Mock Dependencies
jest.mock('../../src/external/Database');

// Import Dependencies
const Database = require('../../src/external/Database');

describe('TicketRouter Tests', () => {

    let mockDB;
    let ticketRouter;
    const mockRes = {};
    mockRes.json = jest.fn().mockReturnValue(mockRes);
    const mockNext = jest.fn();

    beforeAll(() => {
        jest.clearAllMocks();
        mockDB = new Database();
        ticketRouter = new TicketRouter(mockDB);
    });

    describe('segmentTickets() Tests', () => {

        test('segmentTickets() should sort tickets in reverse chronological order', () => {

            const tickets = [
                {
                    date: 1,
                    answered: false
                },

                {
                    date: 2,
                    answered: false
                },
                {
                    date: 3,
                    answered: false
                }
            ];

            const actualValue = ticketRouter.segmentTickets(tickets);

            expect(actualValue.pending).toEqual(tickets.reverse());

        });

        test('segmentTickets() should segment tickets into answered and pending', () => {

            const tickets = [
                {
                    date: 1,
                    answered: true
                },

                {
                    date: 1,
                    answered: false
                }
            ];

            const actualValue = ticketRouter.segmentTickets(tickets);

            expect(actualValue).toEqual({ answered: [tickets[0]], pending: [tickets[1]] });

        });

        test('segmentTickets() should sort and segment tickets', () => {

            const tickets = [
                {
                    date: 1,
                    answered: false
                },

                {
                    date: 2,
                    answered: false
                },
                {
                    date: 1,
                    answered: true
                },

                {
                    date: 2,
                    answered: true
                }
            ];

            const actualValue = ticketRouter.segmentTickets(tickets);

            expect(actualValue).toEqual({
                answered: [tickets[3], tickets[2]],
                pending: [tickets[1], tickets[0]],
            });

        });

    });

    describe('getTicketsHandler() Tests', () => {

        test('getTicketsHandler() should get the tickets of a user', async () => {

            // Tickets
            const tickets = [];

            // Segmented Tickets
            const segmentedTickets = {
                answered: [],
                pending: []
            };

            // Mock getTickets()
            mockDB.getTickets = jest.fn().mockResolvedValueOnce(tickets);

            // Mock Request
            const mockReq = {
                params: {
                    username: 'username'
                }
            };

            // Call getTicketsHandler()
            await ticketRouter.getTicketsHandler(mockReq, mockRes, mockNext);

            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ tickets: segmentedTickets });
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('getTicketsHandler() should not get the tickets with a DB error', async () => {

            // DB error
            const dbError = new Error('DB');

            // Mock getTickets()
            mockDB.getTickets = jest.fn().mockRejectedValueOnce(dbError);

            // Mock Request
            const mockReq = {
                params: {
                    username: 'username'
                }
            };

            // Call getTicketsHandler()
            await ticketRouter.getTicketsHandler(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);

        });

    });

    describe('putTicketHandler() Tests', () => {

        test('putTicketHandler() should insert a ticket of a user', async () => {

            // Ticket
            const ticket = {};

            // Mock insertTicket()
            mockDB.insertTicket = jest.fn().mockResolvedValueOnce(ticket);

            // Mock Request
            const mockReq = {
                params: {
                    username: 'username'
                },
                body: {
                    question: 'question'
                }
            };

            // Call putTicketHandler()
            await ticketRouter.putTicketHandler(mockReq, mockRes, mockNext);

            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ ticket });
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('putTicketHandler() should not insert a ticket with a DB error', async () => {

            // Ticket
            const ticket = {};

            // DB error
            const dbError = new Error('DB');

            // Mock insertTicket()
            mockDB.insertTicket = jest.fn().mockRejectedValueOnce(dbError);

            // Mock Request
            const mockReq = {
                params: {
                    username: 'username'
                },
                body: {
                    question: 'question'
                }
            };

            // Call putTicketHandler()
            await ticketRouter.putTicketHandler(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);

        });

    });

});
