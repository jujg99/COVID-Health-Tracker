const UserRouter = require('../../src/routers/UserRouter');

// Mock Dependencies
jest.mock('../../src/external/Database');

// Import Dependencies
const Database = require('../../src/external/Database');

describe('UserRouter Tests', () => {

    let mockDB;
    let userRouter;
    const mockRes = {};
    mockRes.status = jest.fn().mockReturnValue(mockRes);
    mockRes.json = jest.fn().mockReturnValue(mockRes);
    mockRes.send = jest.fn().mockReturnValue(mockRes);
    const mockNext = jest.fn();

    beforeAll(() => {
        jest.clearAllMocks();
        mockDB = new Database();
        userRouter = new UserRouter(mockDB);
    });

    describe('getProfileHandler() Tests', () => {

        test('getProfileHandler() should return user with existing user', async () => {

            // Test User
            const testUser = {
                id: '0',
                password: 'password',
                atRisk: 1
            };

            // Mock Database getUser
            mockDB.getUser = jest.fn().mockImplementation(async () => {
                return testUser;
            });

            // Mock Request
            const mockReq = {
                params: {
                    username: 'username'
                }
            };

            // Call getProfileHandler
            await userRouter.getProfileHandler(mockReq, mockRes, mockNext);

            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ user: testUser });
            const actualValue = mockRes.json.mock.calls[0][0].user;
            expect(actualValue.id).toBeUndefined();
            expect(actualValue.password).toBeUndefined();
            expect(actualValue.atRisk).toEqual(true);
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('getProfileHandler() should error message with nonexistent user', async () => {

            // Mock Database getUser
            mockDB.getUser = jest.fn().mockImplementation(async () => {
                return null;
            });

            // Mock Request
            const mockReq = {
                params: {
                    username: 'username'
                }
            };

            // Call getProfileHandler
            await userRouter.getProfileHandler(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: `User ${mockReq.params.username} not found`
            });
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('getProfileHandler() should send to ErrorRouter with DB error', async () => {

            // DB Error
            const dbError = new Error('DB');

            // Mock Database getUser
            mockDB.getUser = jest.fn().mockImplementation(async () => {
                throw dbError;
            });

            // Mock Request
            const mockReq = {
                params: {
                    username: 'username'
                }
            };

            // Call getProfileHandler
            await userRouter.getProfileHandler(mockReq, mockRes, mockNext);

            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);

        });

    });

    describe('patchProfileHandler() Tests', () => {

        test('patchProfileHandler() should return patched user with existing user and changing to available username', async () => {

            // Test User
            const testUser = {
                id: '0',
                password: 'password',
                atRisk: 1
            };

            // Mock Database getUser
            mockDB.getUser = jest.fn()
                .mockResolvedValueOnce(testUser)
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(testUser);

            // Mock Database patchUser
            mockDB.patchUser = jest.fn();

            // Mock Request
            const mockReq = {
                params: {
                    username: 'username'
                },
                body: {
                    username: 'new_username'
                }
            };

            // Call getProfileHandler
            await userRouter.patchProfileHandler(mockReq, mockRes, mockNext);

            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ user: testUser });
            const actualValue = mockRes.json.mock.calls[0][0].user;
            expect(actualValue.id).toBeUndefined();
            expect(actualValue.password).toBeUndefined();
            expect(actualValue.atRisk).toEqual(true);
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('patchProfileHandler() should return error message with nonexistent user', async () => {

            // Test User
            const testUser = {
                id: '0',
                password: 'password',
                atRisk: 1
            };

            // Mock Database getUser
            mockDB.getUser = jest.fn()
                .mockResolvedValueOnce(null);

            // Mock Request
            const mockReq = {
                params: {
                    username: 'username'
                }
            };

            // Call getProfileHandler
            await userRouter.patchProfileHandler(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: `User ${mockReq.params.username} not found`
            });
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('patchProfileHandler() should return error message with changing to unavailable username', async () => {

            // Test User
            const testUser = {
                id: '0',
                password: 'password',
                atRisk: 1
            };

            // Mock Database getUser
            mockDB.getUser = jest.fn()
                .mockResolvedValueOnce(testUser)
                .mockResolvedValueOnce(testUser);

            // Mock Database patchUser
            mockDB.patchUser = jest.fn();

            // Mock Request
            const mockReq = {
                params: {
                    username: 'username'
                },
                body: {
                    username: 'new_username'
                }
            };

            // Call getProfileHandler
            await userRouter.patchProfileHandler(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: `User ${mockReq.body.username} already exists`
            });
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('patchProfileHandler() should return patched user with existing user and not changing username', async () => {

            // Test User
            const testUser = {
                id: '0',
                password: 'password',
                atRisk: 1
            };

            // Mock Database getUser
            mockDB.getUser = jest.fn()
                .mockResolvedValueOnce(testUser)
                .mockResolvedValueOnce(testUser);

            // Mock Database patchUser
            mockDB.patchUser = jest.fn();

            // Mock Request
            const mockReq = {
                params: {
                    username: 'username'
                },
                body: {
                    username: 'username'
                }
            };

            // Call getProfileHandler
            await userRouter.patchProfileHandler(mockReq, mockRes, mockNext);

            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ user: testUser });
            const actualValue = mockRes.json.mock.calls[0][0].user;
            expect(actualValue.id).toBeUndefined();
            expect(actualValue.password).toBeUndefined();
            expect(actualValue.atRisk).toEqual(true);
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('patchProfileHandler() should should send to ErrorRouter with DB error', async () => {

            // DB Error
            const dbError = new Error('DB');

            // Mock Database getUser
            mockDB.getUser = jest.fn()
                .mockRejectedValue(dbError);

            // Mock Database patchUser
            mockDB.patchUser = jest.fn();

            // Mock Request
            const mockReq = {
                params: {
                    username: 'username'
                },
                body: {
                    username: 'new_username'
                }
            };

            // Call getProfileHandler
            await userRouter.patchProfileHandler(mockReq, mockRes, mockNext);

            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);

        });

    });

});
