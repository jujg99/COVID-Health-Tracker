const ErrorRouter = require('../../src/routers/ErrorRouter');

// Mock Dependencies
jest.mock('../../src/config/Configuration');

// Import Dependencies
const Configuration = require('../../src/config/Configuration');

describe('ErrorRouter Tests', () => {

    test('errorWrapperRoute() should create an Error 404', () => {

        // Expected Error
        const expectedError = new Error('Not found');
        expectedError.status = 404;

        // Mock next
        const mockNext = jest.fn();

        // Call errorWrapperRoute()
        ErrorRouter.errorWrapperRoute({}, {}, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(1);
        const actualError = mockNext.mock.calls[0][0];
        expect(actualError).toEqual(expectedError);

    });

    describe('handleErrorRoute() Tests', () => {

        // Mocks
        let mockConfiguration;
        let errorRouter;
        const mockRes = {};
        mockRes.status = jest.fn().mockReturnValue(mockRes);
        mockRes.json = jest.fn().mockReturnValue(mockRes);
        mockRes.send = jest.fn().mockReturnValue(mockRes);

        // Configured Error
        const configuredError = new Error('Not found');
        configuredError.status = 404;

        // Unauthorized Error
        const unauthorizedError = new Error('Unauthorized');
        unauthorizedError.status = 401;

        // Unknown Error
        const unknownError = new Error();

        beforeEach(() => {
            jest.clearAllMocks();
            mockConfiguration = new Configuration();
            errorRouter = new ErrorRouter(mockConfiguration);
        });

        test('handleErrorRoute() should handle a Configured Error in Development', () => {

            // Mock NODE_ENV
            mockConfiguration.NODE_ENV = 'development';

            // Call handleErrorRoute
            errorRouter.handleErrorRoute(configuredError, {}, mockRes, () => { });

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(configuredError.status);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: configuredError.message,
                error: configuredError
            });
            expect(mockRes.send).not.toHaveBeenCalled();

        });

        test('handleErrorRoute() should handle an Unknown Error in Development', () => {

            // Mock NODE_ENV
            mockConfiguration.NODE_ENV = 'development';

            // Call handleErrorRoute
            errorRouter.handleErrorRoute(unknownError, {}, mockRes, () => { });

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: unknownError.message,
                error: unknownError
            });
            expect(mockRes.send).not.toHaveBeenCalled();

        });

        test('handleErrorRoute() should handle a Configured Error', () => {

            // Call handleErrorRoute
            errorRouter.handleErrorRoute(configuredError, {}, mockRes, () => { });

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(configuredError.status);
            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockRes.send).toHaveBeenCalledWith(configuredError.message);

        });

        test('handleErrorRoute() should handle an Unauthorized Error', () => {

            // Call handleErrorRoute
            errorRouter.handleErrorRoute(unauthorizedError, {}, mockRes, () => { });

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(unauthorizedError.status);
            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockRes.send).toHaveBeenCalledWith(unauthorizedError.message);

        });

        test('handleErrorRoute() should handle an Unknown Error', () => {

            // Call handleErrorRoute
            errorRouter.handleErrorRoute(unknownError, {}, mockRes, () => { });

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockRes.send).toHaveBeenCalledWith(unknownError.message);

        });

    });

});
