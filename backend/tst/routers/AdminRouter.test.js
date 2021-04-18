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
            const users = {
                users: ['users']
            };

            // Mock getAllUsers()
            mockDB.getAllUsers = jest.fn().mockResolvedValueOnce(users.users);

            // Mock Request
            const mockReq = {

            };

            // Call getAllUsers()
            await adminRouter.getAllUsers(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockRes.send).toHaveBeenCalledWith(users.users);
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('getAllUsers() should not get the users with a DB error', async () => {

            // DB error
            const dbError = new Error('DB');

            // Mock getSymptoms()
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
});