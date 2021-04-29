const AdminRouter = require('../../src/routers/AdminRouter');

// Mock Dependencies
jest.mock('../../src/external/Database');

// Import Dependencies
const Database = require('../../src/external/Database');

describe('AdminRouter Tests', () => {

    let mockDB;
    let adminRouter;
    const mockRes = {};
    mockRes.json = jest.fn().mockReturnValue(mockRes);
    mockRes.send = jest.fn().mockReturnValue(mockRes);
    const mockNext = jest.fn();

    beforeAll(() => {
        jest.clearAllMocks();
        mockDB = new Database();
        adminRouter = new AdminRouter(mockDB);
    });

    describe('getAllUsers() Tests', () => {

        test('getAllUsers() should get all users from database', async () => {

            // Users
            const data = {
                users: ['users']
            };

            // Mock getAllUsers()
            mockDB.getAllUsers = jest.fn().mockResolvedValueOnce(data.users);

            // Mock Request
            const mockReq = { };

            // Call getAllUsers()
            await adminRouter.getAllUsers(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockRes.send).toHaveBeenCalledWith(data.users);
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('getAllUsers() should not get the users with a DB error', async () => {

            // DB error
            const dbError = new Error('DB');

            // Mock getAllUsers()
            mockDB.getAllUsers = jest.fn().mockRejectedValueOnce(dbError);

            // Mock Request
            const mockReq = {

            };

            //Call getAllUsers()
            await adminRouter.getAllUsers(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);
        })

    });

    describe('getUserCounts() Tests', () => {

        test('getUserCounts() should get the number of users, admins, and at risk users', async () => {

            // Counts
            const data = {
                counts: ['counts']
            };

            // Mock getUserCounts()
            mockDB.getUserCounts = jest.fn().mockResolvedValueOnce(data.counts);

            // Mock Request
            const mockReq = { };

            // Call getUserCounts()
            await adminRouter.getUserCounts(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockRes.send).toHaveBeenCalledWith(data.counts);
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('getUserCounts() should not retrieve counts with a DB error', async () => {

            // Input
            const data = {};

            // DB error
            const dbError = new Error('DB');

            // Mock deleteUser()
            mockDB.getUserCounts = jest.fn().mockRejectedValueOnce(dbError);

            // Mock Request
            const mockReq = {
                body: data
            };

            // Call deleteUser()
            await adminRouter.getUserCounts(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);

        });

    });

    describe('deleteUser() Tests', () => {

        test('deleteUser() should delete user from DB', async () => {

            // Data
            const data = {}

            // Mock deleteUser()
            mockDB.deleteUser = jest.fn().mockResolvedValueOnce(data);

            // Mock Request
            const mockReq = {
                body: data
            };

            // Call deleteUser()
            await adminRouter.deleteUser(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockRes.send).toHaveBeenCalledWith(data);
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('deleteUser() should not delete the user with a DB error', async () => {

            // Input
            const data = {};

            // DB error
            const dbError = new Error('DB');

            // Mock deleteUser()
            mockDB.deleteUser = jest.fn().mockRejectedValueOnce(dbError);

            // Mock Request
            const mockReq = {
                body: data
            };

            // Call deleteUser()
            await adminRouter.deleteUser(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);

        });

    });

    describe('getPendingTickets() Tests', () => {

        test('getPendingTickets() should get all unanswered tickets from database', async () => {

            // Data
            const data = {
                tickets: ['tickets']
            };

            // Mock getPendingTickets()
            mockDB.getPendingTickets = jest.fn().mockResolvedValueOnce(data.tickets);

            // Mock Request
            const mockReq = { };

            // Call getPendingTickets()
            await adminRouter.getPendingTickets(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockRes.send).toHaveBeenCalledWith(data.tickets);
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('getPendingTickets() should not get pending tickets with a DB error', async () => {

            // DB error
            const dbError = new Error('DB');

            // Mock getPendingTickets()
            mockDB.getPendingTickets = jest.fn().mockRejectedValueOnce(dbError);

            // Mock Request
            const mockReq = {

            };

            //Call getPendingTickets()
            await adminRouter.getPendingTickets(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);
        })

    });

    describe('getAnsweredTickets() Tests', () => {

        test('getAnsweredTickets() should get all answered tickets from database', async () => {

            // Data
            const data = {
                tickets: ['tickets']
            };

            // Mock getAnsweredTickets()
            mockDB.getAnsweredTickets = jest.fn().mockResolvedValueOnce(data.tickets);

            // Mock Request
            const mockReq = { };

            // Call getAnsweredTickets()
            await adminRouter.getAnsweredTickets(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockRes.send).toHaveBeenCalledWith(data.tickets);
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('getAnsweredTickets() should not get answered tickets with a DB error', async () => {

            // DB error
            const dbError = new Error('DB');

            // Mock getAnsweredTickets()
            mockDB.getAnsweredTickets = jest.fn().mockRejectedValueOnce(dbError);

            // Mock Request
            const mockReq = {

            };

            //Call getAnsweredTickets()
            await adminRouter.getAnsweredTickets(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);
        })

    });

    describe('updateTicket() Tests', () => {

        test('updateTicket() should update the ticket from DB', async () => {

            // Data
            const data = {}

            // Mock updateTicket()
            mockDB.updateTicket = jest.fn().mockResolvedValueOnce(data);

            // Mock Request
            const mockReq = {
                body: data
            };

            // Call updateTicket()
            await adminRouter.updateTicket(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockRes.send).toHaveBeenCalledWith(data);
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('updateTicket() should not update the ticket with a DB error', async () => {

            // Input
            const data = {};

            // DB error
            const dbError = new Error('DB');

            // Mock updateTicket()
            mockDB.updateTicket = jest.fn().mockRejectedValueOnce(dbError);

            // Mock Request
            const mockReq = {
                body: data
            };

            // Call updateTicket()
            await adminRouter.updateTicket(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);

        });

    });
});