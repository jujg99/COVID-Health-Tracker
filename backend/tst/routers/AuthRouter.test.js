const AuthRouter = require('../../src/routers/AuthRouter');

// Mock Dependencies
jest.mock('../../src/external/Database');
jest.mock('../../src/config/Configuration');
jest.mock('passport');
jest.mock('passport-local');
jest.mock('passport-jwt');

// Import Dependencies
const Database = require('../../src/external/Database');
const Configuration = require('../../src/config/Configuration');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportJWT = require('passport-jwt');

describe('AuthRouter Tests', () => {

    let mockDB;
    let mockConfig;
    let mockDone;

    beforeAll(() => {
        jest.clearAllMocks();
        mockDB = new Database();
        mockConfig = new Configuration();
        mockConfig.DB_SECRET = 'secret';
        mockDone = jest.fn();
        passport.use = jest.fn();
    });

    describe('setUpPassport() Tests', () => {

        test('setUpPassport() should serialize user', () => {

            // Mock serializeUser()
            passport.serializeUser = jest.fn();

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Extract Callback Function
            const callBack = passport.serializeUser.mock.calls[0][0];

            // User
            const user = {
                username: 'username'
            };

            // Call Callback
            callBack(user, mockDone);

            expect(passport.serializeUser).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledWith(null, user.username);

        });

        test('setUpPassport() should deserialize user', async () => {

            // Mock deserializeUser()
            passport.deserializeUser = jest.fn();

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Extract Callback Function
            const callBack = passport.deserializeUser.mock.calls[0][0];

            // User
            const user = {
                username: 'username'
            };

            // Mock DB getUser
            mockDB.getUser = jest.fn().mockResolvedValue(user);

            // Call Callback
            await callBack(user.username, mockDone);

            expect(passport.deserializeUser).toHaveBeenCalledTimes(1);
            expect(mockDB.getUser).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledWith(null, user);

        });

        test('setUpPassport() should not deserialize user with DB error', async () => {

            // Mock deserializeUser()
            passport.deserializeUser = jest.fn();

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Extract Callback Function
            const callBack = passport.deserializeUser.mock.calls[0][0];

            // User
            const user = {
                username: 'username'
            };

            // DB Error
            const dbError = new Error('DB');

            // Mock DB getUser
            mockDB.getUser = jest.fn().mockRejectedValue(dbError);

            // Call Callback
            await callBack(user.username, mockDone);

            expect(passport.deserializeUser).toHaveBeenCalledTimes(1);
            expect(mockDB.getUser).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledWith(dbError);

        });

        test('setUpPassport() should use login strategy with existing authorized user', async () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Extract Callback Function
            const callBack = passportLocal.Strategy.mock.calls[0][0];

            // User
            const user = {
                username: 'username',
                password: 'password'
            };

            // Mock DB getUser
            mockDB.getUser = jest.fn().mockResolvedValue(user);

            // Mock DB matchUser
            mockDB.matchUser = jest.fn().mockResolvedValue(user);

            // Call Callback
            await callBack(user.username, user.password, mockDone);

            expect(passport.use).toHaveBeenCalledTimes(3);
            expect(mockDB.getUser).toHaveBeenCalledTimes(1);
            expect(mockDB.matchUser).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledWith(null, user);

        });

        test('setUpPassport() should not use login strategy with nonexistent user', async () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Extract Callback Function
            const callBack = passportLocal.Strategy.mock.calls[0][0];

            // User
            const user = {
                username: 'username',
                password: 'password'
            };

            // Mock DB getUser
            mockDB.getUser = jest.fn().mockResolvedValue(null);

            // Call Callback
            await callBack(user.username, user.password, mockDone);

            expect(passport.use).toHaveBeenCalledTimes(3);
            expect(mockDB.getUser).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledWith(null, false, { message: 'Username does not exist.' });

        });

        test('setUpPassport() should not use login strategy with existing unauthorized user', async () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Extract Callback Function
            const callBack = passportLocal.Strategy.mock.calls[0][0];

            // User
            const user = {
                username: 'username',
                password: 'password'
            };

            // Unauthorized Error
            const unauthorizedError = new Error('Unauthorized');
            unauthorizedError.status = 401;

            // Mock DB getUser
            mockDB.getUser = jest.fn().mockResolvedValue(user);

            // Mock DB matchUser
            mockDB.matchUser = jest.fn().mockResolvedValue(null);

            // Call Callback
            await callBack(user.username, user.password, mockDone);

            expect(passport.use).toHaveBeenCalledTimes(3);
            expect(mockDB.getUser).toHaveBeenCalledTimes(1);
            expect(mockDB.matchUser).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledWith(unauthorizedError);

        });

        test('setUpPassport() should not use login strategy with DB error', async () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Extract Callback Function
            const callBack = passportLocal.Strategy.mock.calls[0][0];

            // User
            const user = {
                username: 'username',
                password: 'password'
            };

            // DB Error
            const dbError = new Error('DB');

            // Mock DB getUser
            mockDB.getUser = jest.fn().mockRejectedValue(dbError);

            // Call Callback
            await callBack(user.username, user.password, mockDone);

            expect(passport.use).toHaveBeenCalledTimes(3);
            expect(mockDB.getUser).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledWith(dbError);

        });

        test('setUpPassport() should use signup strategy with available user', async () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Extract Callback Function
            const callBack = passportLocal.Strategy.mock.calls[1][1];

            // User
            const user = {
                username: 'username',
                password: 'password'
            };

            // Mock DB getUser
            mockDB.getUser = jest.fn().mockResolvedValue(null);

            // Mock DB insertUser
            mockDB.insertUser = jest.fn().mockResolvedValue(user);

            // Call Callback
            await callBack({}, user.username, user.password, mockDone);

            expect(passport.use).toHaveBeenCalledTimes(3);
            expect(mockDB.getUser).toHaveBeenCalledTimes(1);
            expect(mockDB.insertUser).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledWith(null, user);

        });

        test('setUpPassport() should not use signup strategy with existing user', async () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Extract Callback Function
            const callBack = passportLocal.Strategy.mock.calls[1][1];

            // User
            const user = {
                username: 'username',
                password: 'password'
            };

            // Mock DB getUser
            mockDB.getUser = jest.fn().mockResolvedValue(user);

            // Call Callback
            await callBack({}, user.username, user.password, mockDone);

            expect(passport.use).toHaveBeenCalledTimes(3);
            expect(mockDB.getUser).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledWith(null, false, { message: 'Username is already taken.' });

        });

        test('setUpPassport() should not use signup strategy with DB error', async () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Extract Callback Function
            const callBack = passportLocal.Strategy.mock.calls[1][1];

            // User
            const user = {
                username: 'username',
                password: 'password'
            };

            // DB Error
            const dbError = new Error('DB');

            // Mock DB getUser
            mockDB.getUser = jest.fn().mockRejectedValue(dbError);

            // Call Callback
            await callBack({}, user.username, user.password, mockDone);

            expect(passport.use).toHaveBeenCalledTimes(3);
            expect(mockDB.getUser).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledWith(dbError);

        });

        test('setUpPassport() should use JWT strategy with complete token', () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Extract Callback Function
            const callBack = passportJWT.Strategy.mock.calls[0][1];

            // User
            const token = {
                user: 'user'
            };

            // Call Callback
            callBack(token, mockDone);

            expect(passport.use).toHaveBeenCalledTimes(3);
            expect(mockDone).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledWith(null, token.user);

        });

        test('setUpPassport() should not use JWT strategy with incomplete token', () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Extract Callback Function
            const callBack = passportJWT.Strategy.mock.calls[0][1];

            // Error
            const error = new Error('Incomplete User Token');

            // Call Callback
            callBack({}, mockDone);

            expect(passport.use).toHaveBeenCalledTimes(3);
            expect(mockDone).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledWith(error);

        });

    });

    describe('handleSignUpRoute() Tests', () => {

        const mockRes = {};
        mockRes.status = jest.fn().mockReturnValue(mockRes);
        mockRes.json = jest.fn().mockReturnValue(mockRes);

        passport.authenticate = jest.fn(() => jest.fn());

        beforeEach(() => {
            jest.clearAllMocks();
        });

        test('handleSignUpRoute() should return a JWT token for an authorized user', () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Call handleSignUpRoute()
            authRouter.handleSignUpRoute({}, mockRes, mockDone);

            // Extract Callback Function
            const callback = passport.authenticate.mock.calls[0][2];

            // User
            const user = {
                id: 0,
                username: 'username',
                admin: true
            };

            // Call Callback
            callback(null, user, null);

            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).not.toHaveBeenCalledWith(null);
            expect(mockDone).not.toHaveBeenCalled();

        });

        test('handleSignUpRoute() should not return a JWT token for an error', () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Call handleSignUpRoute()
            authRouter.handleSignUpRoute({}, mockRes, mockDone);

            // Extract Callback Function
            const callback = passport.authenticate.mock.calls[0][2];

            // Error
            const error = new Error();

            // Call Callback
            callback(error, {}, null);

            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockDone).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledWith(error);

        });

        test('handleSignUpRoute() should not return a JWT token for a null user', () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Call handleSignUpRoute()
            authRouter.handleSignUpRoute({}, mockRes, mockDone);

            // Extract Callback Function
            const callback = passport.authenticate.mock.calls[0][2];

            // User
            const user = null;

            // Info
            const info = 'info';

            // Call Callback
            callback(null, user, info);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith(info);
            expect(mockDone).not.toHaveBeenCalled();

        });

        test('handleSignUpRoute() should not return a JWT token for an incomplete user id', () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Call handleSignUpRoute()
            authRouter.handleSignUpRoute({}, mockRes, mockDone);

            // Extract Callback Function
            const callback = passport.authenticate.mock.calls[0][2];

            // User
            const user = {};

            // Info
            const info = 'info';

            // Call Callback
            callback(null, user, info);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith(info);
            expect(mockDone).not.toHaveBeenCalled();

        });

        test('handleSignUpRoute() should not return a JWT token for an incomplete user username', () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Call handleSignUpRoute()
            authRouter.handleSignUpRoute({}, mockRes, mockDone);

            // Extract Callback Function
            const callback = passport.authenticate.mock.calls[0][2];

            // User
            const user = {
                id: 0
            };

            // Info
            const info = 'info';

            // Call Callback
            callback(null, user, info);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith(info);
            expect(mockDone).not.toHaveBeenCalled();

        });

        test('handleSignUpRoute() should not return a JWT token for an incomplete user admin', () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Call handleSignUpRoute()
            authRouter.handleSignUpRoute({}, mockRes, mockDone);

            // Extract Callback Function
            const callback = passport.authenticate.mock.calls[0][2];

            // User
            const user = {
                id: 0,
                username: 'username'
            };

            // Info
            const info = 'info';

            // Call Callback
            callback(null, user, info);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith(info);
            expect(mockDone).not.toHaveBeenCalled();

        });

    });

    describe('handleLoginRoute() Tests', () => {

        const mockReq = {};
        mockReq.login = jest.fn();

        const mockRes = {};
        mockRes.status = jest.fn().mockReturnValue(mockRes);
        mockRes.json = jest.fn().mockReturnValue(mockRes);

        passport.authenticate = jest.fn(() => jest.fn());

        beforeEach(() => {
            jest.clearAllMocks();
        });

        test('handleLoginRoute() should return a JWT token for an authorized user', () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Call handleSignUpRoute()
            authRouter.handleLoginRoute(mockReq, mockRes, mockDone);

            // Extract Callback Function
            const callback = passport.authenticate.mock.calls[0][1];

            // User
            const user = {
                id: 0,
                username: 'username',
                admin: true
            };

            // Call Callback
            callback(null, user, null);

            // Extract Inner Callback Function
            const innerCallback = mockReq.login.mock.calls[0][2];

            // Call Inner Callback
            innerCallback(null);

            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).not.toHaveBeenCalledWith(null);
            expect(mockDone).not.toHaveBeenCalled();

        });

        test('handleLoginRoute() should not return a JWT token for an error', () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Call handleSignUpRoute()
            authRouter.handleLoginRoute(mockReq, mockRes, mockDone);

            // Extract Callback Function
            const callback = passport.authenticate.mock.calls[0][1];

            // Error
            const error = new Error('error');

            // Call Callback
            callback(error, {}, null);

            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockDone).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledWith(error);

        });

        test('handleLoginRoute() should not return a JWT token for a null user', () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Call handleSignUpRoute()
            authRouter.handleLoginRoute(mockReq, mockRes, mockDone);

            // Extract Callback Function
            const callback = passport.authenticate.mock.calls[0][1];

            // User
            const user = null;

            // Call Callback
            callback(null, user, null);

            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockDone).toHaveBeenCalledTimes(1);
            expect(mockDone.mock.calls[0][0].message).toEqual('An error occurred.');

        });

        test('handleLoginRoute() should not return a JWT token for an error in login', () => {

            authRouter = new AuthRouter(mockDB, mockConfig);

            // Call handleSignUpRoute()
            authRouter.handleLoginRoute(mockReq, mockRes, mockDone);

            // Extract Callback Function
            const callback = passport.authenticate.mock.calls[0][1];

            // User
            const user = {
                id: 0,
                username: 'username',
                admin: true
            };

            // Call Callback
            callback(null, user, null);

            // Extract Inner Callback Function
            const innerCallback = mockReq.login.mock.calls[0][2];

            // Error
            const error = new Error('error');

            // Call Inner Callback
            innerCallback(error);

            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockDone).toHaveBeenCalledTimes(1);
            expect(mockDone).toHaveBeenCalledWith(error);

        });

    });

});
