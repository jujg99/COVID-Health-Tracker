const Encryption = require('../../src/util/Encryption');

/**
 * All expected values are calculated from the online tool:
 * https://www.browserling.com/tools/scrypt
 */

describe('Encryption Tests', () => {

    it('should encrypt an Empty Password with an Empty Salt', () => {
        const password = '';
        const salt = '';
        const expectedValue =
            'd72c87d0f077c7766f2985dfab30e8955c373a13a1e93d315203939f542ff86e';
        expect(Encryption.encrypt(password, salt)).toEqual(expectedValue);
    });

    it('should encrypt a Password with an Empty Salt', () => {
        const password = 'password';
        const salt = '';
        const expectedValue =
            'f87d3cc032ff13dd4edccc776c76283fb2eaa2a4c8f87f013c637cba0703c85f';
        expect(Encryption.encrypt(password, salt)).toEqual(expectedValue);
    });

    it('should encrypt a Password with a Salt', () => {
        const password = 'password';
        const salt = 'salt';
        const expectedValue =
            '745731af4484f323968969eda289aeee005b5903ac561e64a5aca121797bf773';
        expect(Encryption.encrypt(password, salt)).toEqual(expectedValue);
    });

});
