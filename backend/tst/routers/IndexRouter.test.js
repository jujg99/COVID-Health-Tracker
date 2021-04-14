const IndexRouter = require('../../src/routers/IndexRouter');

describe('IndexRouter Tests', () => {

    const indexRouter = new IndexRouter();

    test('IndexRouter should resolve correct path for a build file', () => {
        expect(indexRouter.build).toMatch(/\/backend\/public\/index.html$/);
    });

    test('IndexRouter should send build file in getDefaultRoute', () => {

        // Mock Response sendFile
        const mockRes = {};
        mockRes.sendFile = jest.fn().mockReturnValue(mockRes);

        // Call getDefaultRoute
        indexRouter.getDefaultRoute({}, mockRes, () => { });

        expect(mockRes.sendFile).toHaveBeenCalledTimes(1);
        expect(mockRes.sendFile).toHaveBeenCalledWith(indexRouter.build);
    });

});
