// Import module to test
const __REPLACE__ = require('./__REPLACE__');

// Overarching Test Suite
describe('__REPLACE__ Tests', () => {

    let instance = null;

    // Code that runs before each Test
    beforeAll(() => {
        instance = new __REPLACE__();
    });

    // Nested Test Suite
    describe('__REPLACE__ Method 1 Tests', () => {
        // Test with test
        test('__REPLACE__ Method 1 with no input should return null', () => {
            // Actual Test Code
            const value = instance.method1();
            expect(value).toEqual(null);
        });
    });

    // Test with it
    it('should have default property meaning with value 42', () => {
        // Actual Test Code
        expect(instance.meaning).toEqual(42);
    });

});
