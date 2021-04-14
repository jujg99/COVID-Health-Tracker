const IndexRouter = require('../../src/routers/IndexRouter');

describe('IndexRouter Tests', () => {

    const indexRouter = new IndexRouter();

    it('should correctly resolve the build file path', () => {
        expect(indexRouter.build).toMatch(/\/backend\/public\/index.html$/);
    });

    test('getDefaultRoute() should send the build file', () => {

        // Mock Response sendFile
        const mockRes = {};
        mockRes.sendFile = jest.fn().mockReturnValue(mockRes);

        // Call getDefaultRoute
        indexRouter.getDefaultRoute({}, mockRes, () => { });

        expect(mockRes.sendFile).toHaveBeenCalledTimes(1);
        expect(mockRes.sendFile).toHaveBeenCalledWith(indexRouter.build);
    });

});
