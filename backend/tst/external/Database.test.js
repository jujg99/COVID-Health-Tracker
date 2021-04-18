const Database = require('../../src/external/Database');

// Mock Dependencies
jest.mock('../../src/config/Configuration');
jest.mock('../../src/util/Encryption');
jest.mock('mysql');

// Import Dependencies
const Configuration = require('../../src/config/Configuration');
const Encryption = require('../../src/util/Encryption');
const mysql = require('mysql');

describe('Database Tests', () => {

    let mockConfig;
    let database;
    let mockConnection = {};
    mockConnection.end = jest.fn();
    mockConnection.connect = jest.fn();
    mockConnection.query = jest.fn();

    beforeAll(() => {
        jest.clearAllMocks();
        mockConfig = new Configuration();
        database = new Database(mockConfig);
    });

    describe('createGetUserQuery() Tests', () => {

        test('createGetUserQuery() should create a SQL query get a user', () => {

            // User
            const user = 'name';

            // Expected Query
            const expectedQuery = `
                SELECT
                    BIN_TO_UUID(id) id,
                    username,
                    password,
                    admin
                FROM users
                WHERE username = '${user}'
            `.split(/[ ]+/);

            // Actual Query
            const actualQuery = database.createGetUserQuery(user).split(/[ ]+/);

            expect(actualQuery).toEqual(expectedQuery);

        });

    });

    describe('createInsertUserQuery() Tests', () => {

        test('createInsertUserQuery() should create a SQL query to insert a user', () => {

            // User
            const username = 'username';

            // Password
            const password = 'password';

            // Body
            const body = {
                first_name: 'first_name',
                last_name: 'last_name',
                age: 1,
                city: 'city',
                state: 'state'
            };

            // Expected Query
            const expectedQuery = `
                INSERT INTO users (
                    username,
                    password,
                    id,
                    admin,
                    first_name,
                    last_name,
                    age,
                    atRisk,
                    city,
                    state
                )
                VALUES (
                    '${username}',
                    '${password}',
                    UUID_TO_BIN(UUID()),
                    FALSE,
                    '${body.first_name}',
                    '${body.last_name}',
                    ${body.age},
                    FALSE,
                    '${body.city}',
                    '${body.state}'
                )
            `.split(/[ ]+/);

            // Actual Query
            const actualQuery = database.createInsertUserQuery(username, password, body)
                .split(/[ ]+/);

            expect(actualQuery).toEqual(expectedQuery);

        });

    });

    describe('getUser() Tests', () => {

        test('getUser() should get an existing user', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Users
            const users = [
                {
                    username: 'username'
                }
            ];

            // Call getUser()
            const promise = database.getUser(users[0].username);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null, users);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual(users[0]);

        });

        test('getUser() should not get a user with a connection error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Users
            const users = [
                {
                    username: 'username'
                }
            ];

            // Connection Error
            const error = new Error('connection');

            // Call getUser()
            const promise = database.getUser(users[0].username);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).not.toHaveBeenCalled();
            await expect(promise).rejects.toEqual(error);

        });

        test('getUser() should not get a user with a query error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Users
            const users = [
                {
                    username: 'username'
                }
            ];

            // Query Error
            const error = new Error('query');

            // Call getUser()
            const promise = database.getUser(users[0].username);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(error, users);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).rejects.toEqual(error);

        });

        test('getUser() should not get a nonexistent user', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Username
            const username = 'username';

            // Users
            const users = [];

            // Call getUser()
            const promise = database.getUser(username);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null, users);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual(null);

        });

    });

    describe('getAllUsers() Tests', () => {

        test('getAllUsers() should get all users', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Users
            const users = [
                {
                    username: 'username1'
                },
                {
                    username: 'username2'
                }
            ];

            // Call getAllUsers()
            const promise = database.getAllUsers();

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null, users);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual(users);

        });

        test('getAllUsers() should not get all users with a connection error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Users
            const users = [
                {
                    username: 'username1'
                },
                {
                    username: 'username2'
                }
            ];

            // Connection Error
            const error = new Error('connection');

            // Call getAllUsers()
            const promise = database.getAllUsers();

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).not.toHaveBeenCalled();
            await expect(promise).rejects.toEqual(error);

        });

        test('getAllUsers() should not get all users with a query error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Users
            const users = [
                {
                    username: 'username1'
                },
                {
                    username: 'username2'
                }
            ];

            // Query Error
            const error = new Error('query');

            // Call getAllUsers()
            const promise = database.getAllUsers();

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(error, users);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).rejects.toEqual(error);

        });

        test('getAllUsers() should not get nonexistent users', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Users
            const users = [];

            // Call getAllUsers()
            const promise = database.getAllUsers();

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null, users);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual(null);

        });

    });

    describe('buildPatchArgs() Tests', () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        test('buildPatchArgs() with changes should not be empty', () => {

            // Previous
            const prev = {
                username: 'username1'
            };

            // Next
            const next = {
                username: 'username2'
            };

            const actualValue = database.buildPatchArgs(prev, next);

            expect(actualValue).toEqual(`username = '${next.username}'`);

        });

        test('buildPatchArgs() with password changes should not be empty', () => {

            // Previous
            const prev = {
                password: 'old password'
            };

            // Next
            const next = {
                password: 'new password'
            };

            // Mock encrypt
            Encryption.encrypt
                .mockReturnValue(next.password);

            const actualValue = database.buildPatchArgs(prev, next);

            expect(actualValue).toEqual(`password = '${next.password}'`);

        });

        test('buildPatchArgs() with equal password changes should be empty', () => {

            // Previous
            const prev = {
                password: 'old password'
            };

            // Next
            const next = {
                password: 'old password'
            };

            // Mock encrypt
            Encryption.encrypt
                .mockReturnValue(next.password);

            const actualValue = database.buildPatchArgs(prev, next);

            expect(actualValue).toEqual('');

        });

        test('buildPatchArgs() with age changes should not be empty', () => {

            // Previous
            const prev = {
                age: 1
            };

            // Next
            const next = {
                age: 2
            };

            const actualValue = database.buildPatchArgs(prev, next);

            expect(actualValue).toEqual(`age = ${next.age}`);

        });

        test('buildPatchArgs() with equal age changes should be empty', () => {

            // Previous
            const prev = {
                age: 1
            };

            // Next
            const next = {
                age: 1
            };

            const actualValue = database.buildPatchArgs(prev, next);

            expect(actualValue).toEqual('');

        });

        test('buildPatchArgs() with atRisk changes should not be empty', () => {

            // Previous
            const prev = {
                atRisk: 1
            };

            // Next
            const next = {
                atRisk: false
            };

            const actualValue = database.buildPatchArgs(prev, next);

            expect(actualValue).toEqual(`atRisk = ${next.atRisk}`);

        });

        test('buildPatchArgs() with equivalent atRisk changes should be empty', () => {

            // Previous
            const prev = {
                atRisk: 1
            };

            // Next
            const next = {
                atRisk: true
            };

            const actualValue = database.buildPatchArgs(prev, next);

            expect(actualValue).toEqual('');

        });

        test('buildPatchArgs() with no changes should be empty', () => {

            // Previous
            const prev = {
                username: 'username'
            };

            // Next
            const next = {};

            const actualValue = database.buildPatchArgs(prev, next);

            expect(actualValue).toEqual('');

        });

        test('buildPatchArgs() with equivalent changes should be empty', () => {

            // Previous
            const prev = {
                username: 'username'
            };

            // Next
            const next = {
                username: 'username'
            };

            const actualValue = database.buildPatchArgs(prev, next);

            expect(actualValue).toEqual('');

        });

        test('buildPatchArgs() with null changes should be empty', () => {

            // Previous
            const prev = {
                username: 'username'
            };

            // Next
            const next = {
                username: null
            };

            const actualValue = database.buildPatchArgs(prev, next);

            expect(actualValue).toEqual('');

        });

        test('buildPatchArgs() with empty changes should be empty', () => {

            // Previous
            const prev = {
                username: 'username'
            };

            // Next
            const next = {
                username: ''
            };

            const actualValue = database.buildPatchArgs(prev, next);

            expect(actualValue).toEqual('');

        });

        test('buildPatchArgs() with admin changes should be empty', () => {

            // Previous
            const prev = {
                admin: true
            };

            // Next
            const next = {
                admin: false
            };

            const actualValue = database.buildPatchArgs(prev, next);

            expect(actualValue).toEqual('');

        });

        test('buildPatchArgs() with id changes should be empty', () => {

            // Previous
            const prev = {
                id: 0
            };

            // Next
            const next = {
                id: 1
            };

            const actualValue = database.buildPatchArgs(prev, next);

            expect(actualValue).toEqual('');

        });

        test('buildPatchArgs() with many changes should not be empty', () => {

            // Previous
            const prev = {
                username: 'username1',
                admin: true,
                id: 0,
                same: true,
                password: 'old password',
                age: 1,
                atRisk: 0,
                random: 'hello 1'
            };

            // Next
            const next = {
                username: 'username2',
                admin: false,
                id: 1,
                same: true,
                password: 'new password',
                age: 2,
                atRisk: true,
                random: 'hello 2'
            };

            // Mock encrypt
            Encryption.encrypt
                .mockReturnValue(next.password);

            const actualValue = database.buildPatchArgs(prev, next);

            expect(actualValue).toEqual([
                `username = '${next.username}'`,
                `password = '${next.password}'`,
                `age = ${next.age}`,
                `atRisk = ${next.atRisk}`,
                `random = '${next.random}'`,
            ].join(', '));

        });

    });

    describe('patchUser() Tests', () => {

        test('patchUser() should patch an existing user', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // User
            const user = {
                username: 'username'
            };

            // Args
            const args = {
                username: 'username2'
            };

            // Call patchUser()
            const promise = database.patchUser(user, args);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual('success');

        });

        test('patchUser() should not patch an existing user given no changes', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // User
            const user = {
                username: 'username'
            };

            // Args
            const args = {
                username: 'username'
            };

            // Call patchUser()
            const promise = database.patchUser(user, args);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(1);
            await expect(promise).resolves.toEqual('no op');

        });

        test('patchUser() should not patch a user with a connection error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // User
            const user = {
                username: 'username'
            };

            // Args
            const args = {
                username: 'username'
            };

            // Connection Error
            const error = new Error('connection');

            // Call patchUser()
            const promise = database.patchUser(user, args);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).not.toHaveBeenCalled();
            await expect(promise).rejects.toEqual(error);

        });

        test('patchUser() should not patch a user with a query error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // User
            const user = {
                username: 'username'
            };

            // Args
            const args = {
                username: 'username1'
            };

            // Query Error
            const error = new Error('query');

            // Call patchUser()
            const promise = database.patchUser(user, args);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).rejects.toEqual(error);

        });

    });

    describe('matchUser() Tests', () => {

        test('matchUser() should match an existing username and password', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Username
            const username = 'username';

            // Password
            const password = 'password';

            // Users
            const users = [
                {
                    username,
                    password
                }
            ];

            // Mock encrypt()
            Encryption.encrypt
                .mockReturnValue(password);

            // Call matchUser()
            const promise = database.matchUser(username, password);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null, users);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual(users[0]);

        });

        test('matchUser() should not match a user with a connection error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Username
            const username = 'username';

            // Password
            const password = 'password';

            // Connection Error
            const error = new Error('connection');

            // Call matchUser()
            const promise = database.matchUser(username, password);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).not.toHaveBeenCalled();
            await expect(promise).rejects.toEqual(error);

        });

        test('matchUser() should not match a user with a query error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Username
            const username = 'username';

            // Password
            const password = 'password';

            // Users
            const users = [
                {
                    username,
                    password
                }
            ];

            // Query Error
            const error = new Error('query');

            // Call matchUser()
            const promise = database.matchUser(username, password);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(error, users);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).rejects.toEqual(error);

        });

        test('matchUser() should not match an existing username and incorrect password', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Username
            const username = 'username';

            // Password
            const password = 'password';

            // Users
            const users = [
                {
                    username,
                    password: 'different password'
                }
            ];

            // Mock encrypt()
            Encryption.encrypt
                .mockReturnValue(password);

            // Call matchUser()
            const promise = database.matchUser(username, password);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null, users);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual(null);

        });

        test('matchUser() should not match a nonexistent username and password', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Username
            const username = 'username';

            // Password
            const password = 'password';

            // Users
            const users = [];

            // Call matchUser()
            const promise = database.matchUser(username, password);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null, users);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual(null);

        });

    });

    describe('insertUser() Tests', () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        test('insertUser() should insert a nonexistent user', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Username
            const username = 'username';

            // Password
            const password = 'password';

            // Body
            const body = {
                id: 1,
                admin: false
            };

            // User
            const user = {
                username,
                password,
                ...body
            };

            // Mock encrypt()
            Encryption.encrypt
                .mockReturnValue(password);

            // Mock getUser()
            database.getUser = jest.fn()
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(user);

            // Call insertUser()
            const promise = database.insertUser(username, password, body);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Await getUser() promise
            await database.getUser.mock.results[0];

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual(user);

        });

        test('insertUser() should not insert an existing user', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Username
            const username = 'username';

            // Password
            const password = 'password';

            // Body
            const body = {
                id: 1,
                admin: false
            };

            // User
            const user = {
                username,
                password,
                ...body
            };

            // Mock encrypt()
            Encryption.encrypt
                .mockReturnValue(password);

            // Mock getUser()
            database.getUser = jest.fn()
                .mockResolvedValueOnce(user);

            // Call insertUser()
            const promise = database.insertUser(username, password, body);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Await getUser() promise
            await database.getUser.mock.results[0];

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).not.toHaveBeenCalled();
            await expect(promise).resolves.toEqual(null);

        });

        test('insertUser() should not insert a user with a connection error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Username
            const username = 'username';

            // Password
            const password = 'password';

            // Body
            const body = {
                id: 1,
                admin: false
            };

            // Connection Error
            const error = new Error('connection');

            // Call insertUser()
            const promise = database.insertUser(username, password, body);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            await expect(promise).rejects.toEqual(error);

        });

        test('insertUser() should not insert a user with a query error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Username
            const username = 'username';

            // Password
            const password = 'password';

            // Body
            const body = {
                id: 1,
                admin: false
            };

            // User
            const user = {
                username,
                password,
                ...body
            };

            // Query Error
            const error = new Error('query');

            // Mock encrypt()
            Encryption.encrypt
                .mockReturnValue(password);

            // Mock getUser()
            database.getUser = jest.fn()
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(user);

            // Call insertUser()
            const promise = database.insertUser(username, password, body);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Await getUser() promise
            await database.getUser.mock.results[0];

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).rejects.toEqual(error);

        });

        test('insertUser() should not insert a user with a DB error on first getUser()', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Username
            const username = 'username';

            // Password
            const password = 'password';

            // Body
            const body = {
                id: 1,
                admin: false
            };

            // error
            const error = new Error('DB');

            // Mock getUser()
            database.getUser = jest.fn()
                .mockRejectedValueOnce(error);

            // Call insertUser()
            const promise = database.insertUser(username, password, body);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            connectCallback(null);

            // Await first getUser() promise
            await database.getUser.mock.results[0];

            await expect(promise).rejects.toEqual(error);
            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).not.toHaveBeenCalled();

        });

        test('insertUser() should not insert a user with a DB error on second getUser()', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Username
            const username = 'username';

            // Password
            const password = 'password';

            // Body
            const body = {
                id: 1,
                admin: false
            };

            // error
            const error = new Error('DB');

            // Mock getUser()
            database.getUser = jest.fn()
                .mockResolvedValueOnce(null)
                .mockRejectedValueOnce(error);

            // Call insertUser()
            const promise = database.insertUser(username, password, body);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            connectCallback(null);

            // Await first getUser() promise
            await database.getUser.mock.results[0];

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null);

            // Await second getUser() promise
            await database.getUser.mock.results[1];

            await expect(promise).rejects.toEqual(error);
            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);

        });

    });

    describe('deleteUser() Tests', () => {

        test('deleteUser() should delete an existing user', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Data
            const data = {
                username: 'username'
            };

            // Call deleteUser()
            const promise = database.deleteUser(data);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][2];

            // Call connect Callback
            queryCallback(null);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual('Delete Successful');

        });

        test('deleteUser() should not delete a user with a connection error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Data
            const data = {
                username: 'username'
            };

            // Connection Error
            const error = new Error('connection');

            // Call deleteUser()
            const promise = database.deleteUser(data);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).not.toHaveBeenCalled();
            await expect(promise).rejects.toEqual(error);

        });

        test('deleteUser() should not delete a user with a query error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Data
            const data = {
                username: 'username'
            };

            // Connection Error
            const error = new Error('query');

            // Call deleteUser()
            const promise = database.deleteUser(data);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][2];

            // Call connect Callback
            queryCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).rejects.toEqual(error);

        });

    });

    describe('getSymptoms() Tests', () => {

        test('getSymptoms() should get the symptoms of an existing user', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Username
            const username = 'username';

            // Symptoms
            const symptoms = [];

            // Call getSymptoms()
            const promise = database.getSymptoms(username);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null, symptoms);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual(symptoms);

        });

        test('getSymptoms() should not get the symptoms of a user with a connection error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Username
            const username = 'username';

            // Connection Error
            const error = new Error('connection');

            // Call getSymptoms()
            const promise = database.getSymptoms(username);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).not.toHaveBeenCalled();
            await expect(promise).rejects.toEqual(error);

        });

        test('getSymptoms() should not get the symptoms of a user with a query error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Username
            const username = 'username';

            // Symptoms
            const symptoms = [];

            // Query Error
            const error = new Error('query');

            // Call getSymptoms()
            const promise = database.getSymptoms(username);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(error, symptoms);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).rejects.toEqual(error);

        });

    });

    describe('insertSymptoms() Tests', () => {

        test('insertSymptoms() should insert symptoms for an existing user', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Symptoms
            const symptoms = {
                username: 'username',
                temperature: 104,
                cough: true,
                shortBreath: false,
                fatigue: true,
                bodyAche: false,
                tasteLoss: true,
                soreThroat: false,
                congestion: true,
                nausea: false,
                other: 'Notes on symptoms'
            };

            // Call insertSymptoms()
            const promise = database.insertSymptoms(symptoms);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null, [symptoms]);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual([symptoms]);

        });

        test('insertSymptoms() should not insert symptoms with a connection error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Symptoms
            const symptoms = {
                username: 'username',
                temperature: 104,
                cough: true,
                shortBreath: false,
                fatigue: true,
                bodyAche: false,
                tasteLoss: true,
                soreThroat: false,
                congestion: true,
                nausea: false,
                other: 'Notes on symptoms'
            };

            // Connection Error
            const error = new Error('connection');

            // Call insertSymptoms()
            const promise = database.insertSymptoms(symptoms);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).not.toHaveBeenCalled();
            await expect(promise).rejects.toEqual(error);

        });

        test('insertSymptoms() should not insert symptoms with a query error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Symptoms
            const symptoms = {
                username: 'username',
                temperature: 104,
                cough: true,
                shortBreath: false,
                fatigue: true,
                bodyAche: false,
                tasteLoss: true,
                soreThroat: false,
                congestion: true,
                nausea: false,
                other: 'Notes on symptoms'
            };

            // Query Error
            const error = new Error('query');

            // Call insertSymptoms()
            const promise = database.insertSymptoms(symptoms);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(error, [symptoms]);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).rejects.toEqual(error);

        });

    });

    describe('deleteSymptom() Tests', () => {

        test('deleteSymptom() should delete an existing symptom', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Data
            const data = {
                id: 0
            };

            // Call deleteSymptom()
            const promise = database.deleteSymptom(data);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual('Delete Successful');

        });

        test('deleteSymptom() should not delete a symptom with a connection error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Data
            const data = {
                id: 0
            };

            // Connection Error
            const error = new Error('connection');

            // Call deleteSymptom()
            const promise = database.deleteSymptom(data);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).not.toHaveBeenCalled();
            await expect(promise).rejects.toEqual(error);

        });

        test('deleteSymptom() should not delete a symptom with a query error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Data
            const data = {
                id: 0
            };

            // Connection Error
            const error = new Error('query');

            // Call deleteSymptom()
            const promise = database.deleteSymptom(data);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).rejects.toEqual(error);

        });

    });

    describe('editSymptom() Tests', () => {

        test('editSymptom() should edit symptoms for an existing user', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Symptoms
            const symptoms = {
                id: 0,
                temperature: 104,
                cough: true,
                shortBreath: false,
                fatigue: true,
                bodyAche: false,
                tasteLoss: true,
                soreThroat: false,
                congestion: true,
                nausea: false,
                other: 'Notes on symptoms'
            };

            // Call editSymptom()
            const promise = database.editSymptom(symptoms);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null, [symptoms]);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual([symptoms]);

        });

        test('editSymptom() should not edit symptoms with a connection error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Symptoms
            const symptoms = {
                id: 0,
                temperature: 104,
                cough: true,
                shortBreath: false,
                fatigue: true,
                bodyAche: false,
                tasteLoss: true,
                soreThroat: false,
                congestion: true,
                nausea: false,
                other: 'Notes on symptoms'
            };

            // Connection Error
            const error = new Error('connection');

            // Call editSymptom()
            const promise = database.editSymptom(symptoms);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).not.toHaveBeenCalled();
            await expect(promise).rejects.toEqual(error);

        });

        test('editSymptom() should not edit symptoms with a query error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Symptoms
            const symptoms = {
                id: 0,
                temperature: 104,
                cough: true,
                shortBreath: false,
                fatigue: true,
                bodyAche: false,
                tasteLoss: true,
                soreThroat: false,
                congestion: true,
                nausea: false,
                other: 'Notes on symptoms'
            };

            // Query Error
            const error = new Error('query');

            // Call editSymptom()
            const promise = database.editSymptom(symptoms);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(error, [symptoms]);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).rejects.toEqual(error);

        });

    });

    describe('getTestResults() Tests', () => {

        test('getTestResults() should get the test results of an existing user', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Username
            const username = 'username';

            // Tests
            const tests = [];

            // Call getTestResults()
            const promise = database.getTestResults(username);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null, tests);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual(tests);

        });

        test('getTestResults() should not get the test results of a user with a connection error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Username
            const username = 'username';

            // Connection Error
            const error = new Error('connection');

            // Call getTestResults()
            const promise = database.getTestResults(username);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).not.toHaveBeenCalled();
            await expect(promise).rejects.toEqual(error);

        });

        test('getTestResults() should not get the test results of a user with a query error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Username
            const username = 'username';

            // Tests
            const tests = [];

            // Query Error
            const error = new Error('query');

            // Call getTestResults()
            const promise = database.getTestResults(username);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(error, tests);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).rejects.toEqual(error);

        });

    });

    describe('insertTestResults() Tests', () => {

        test('insertTestResults() should insert a test result for an existing user', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Test
            const test = {
                username: 'username',
                date: new Date().toDateString(),
                type: 'type',
                result: 'Positive'
            };

            // Call insertTestResults()
            const promise = database.insertTestResults(test);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null, [test]);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual([test]);

        });

        test('insertTestResults() should not insert a test result with a connection error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Test
            const test = {
                username: 'username',
                date: new Date().toDateString(),
                type: 'type',
                result: 'Positive'
            };

            // Connection Error
            const error = new Error('connection');

            // Call insertTestResults()
            const promise = database.insertTestResults(test);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).not.toHaveBeenCalled();
            await expect(promise).rejects.toEqual(error);

        });

        test('insertTestResults() should not insert a test result with a query error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Test
            const test = {
                username: 'username',
                date: new Date().toDateString(),
                type: 'type',
                result: 'Positive'
            };

            // Query Error
            const error = new Error('query');

            // Call insertTestResults()
            const promise = database.insertTestResults(test);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(error, [test]);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).rejects.toEqual(error);

        });

    });

    describe('deleteTestResult() Tests', () => {

        test('deleteTestResult() should delete an existing test result', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Data
            const data = {
                id: 0
            };

            // Call deleteTestResult()
            const promise = database.deleteTestResult(data);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual('Delete Successful');

        });

        test('deleteTestResult() should not delete a test result with a connection error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Data
            const data = {
                id: 0
            };

            // Connection Error
            const error = new Error('connection');

            // Call deleteTestResult()
            const promise = database.deleteTestResult(data);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).not.toHaveBeenCalled();
            await expect(promise).rejects.toEqual(error);

        });

        test('deleteTestResult() should not delete a test result with a query error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Data
            const data = {
                id: 0
            };

            // Connection Error
            const error = new Error('query');

            // Call deleteTestResult()
            const promise = database.deleteTestResult(data);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).rejects.toEqual(error);

        });

    });

    describe('editTestResult() Tests', () => {

        test('editTestResult() should edit a test result for an existing user', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Test
            const test = {
                id: 0,
                date: new Date().toDateString(),
                type: 'type',
                result: 'Positive'
            };

            // Call editTestResult()
            const promise = database.editTestResult(test);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null, [test]);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual([test]);

        });

        test('editTestResult() should not insert a test result with a connection error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Test
            const test = {
                id: 0,
                date: new Date().toDateString(),
                type: 'type',
                result: 'Positive'
            };

            // Connection Error
            const error = new Error('connection');

            // Call editTestResult()
            const promise = database.editTestResult(test);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).not.toHaveBeenCalled();
            await expect(promise).rejects.toEqual(error);

        });

        test('editTestResult() should not insert a test result with a query error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Test
            const test = {
                id: 0,
                date: new Date().toDateString(),
                type: 'type',
                result: 'Positive'
            };

            // Query Error
            const error = new Error('query');

            // Call editTestResult()
            const promise = database.editTestResult(test);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(error, [test]);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).rejects.toEqual(error);

        });

    });

    describe('getAgeAndRisk() Tests', () => {

        test('getAgeAndRisk() should get an existing user age and risk ', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Users
            const users = [
                {
                    username: 'username'
                }
            ];

            // Call getAgeAndRisk()
            const promise = database.getAgeAndRisk(users[0].username);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(null, users);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).resolves.toEqual(users);

        });

        test('getAgeAndRisk() should not get a user age and risk with a connection error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Users
            const users = [
                {
                    username: 'username'
                }
            ];

            // Connection Error
            const error = new Error('connection');

            // Call getAgeAndRisk()
            const promise = database.getAgeAndRisk(users[0].username);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(error);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).not.toHaveBeenCalled();
            await expect(promise).rejects.toEqual(error);

        });

        test('getAgeAndRisk() should not get a user age and risk with a query error', async () => {

            // Mock createConnection()
            mysql.createConnection.mockReturnValue(mockConnection);

            // Users
            const users = [
                {
                    username: 'username'
                }
            ];

            // Query Error
            const error = new Error('query');

            // Call getAgeAndRisk()
            const promise = database.getAgeAndRisk(users[0].username);

            // Extract connect Callback
            const connectCallback = mockConnection.connect.mock.calls[0][0];

            // Call connect Callback
            connectCallback(null);

            // Extract query Callback
            const queryCallback = mockConnection.query.mock.calls[1][1];

            // Call connect Callback
            queryCallback(error, users);

            expect(mysql.createConnection).toHaveBeenCalledTimes(1);
            expect(mockConnection.connect).toHaveBeenCalledTimes(1);
            expect(mockConnection.end).toHaveBeenCalledTimes(1);
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            await expect(promise).rejects.toEqual(error);

        });

    });

});
