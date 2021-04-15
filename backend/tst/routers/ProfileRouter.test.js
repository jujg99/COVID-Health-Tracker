const ProfileRouter = require('../../src/routers/ProfileRouter');

// Mock Dependencies
jest.mock('../../src/external/Database');

// Import Dependencies
const Database = require('../../src/external/Database');

describe('ProfileRouter Tests', () => {

    let mockDB;
    let profileRouter;
    const mockRes = {};
    mockRes.json = jest.fn().mockReturnValue(mockRes);
    mockRes.send = jest.fn().mockReturnValue(mockRes);
    const mockNext = jest.fn();

    beforeAll(() => {
        jest.clearAllMocks();
        mockDB = new Database();
        profileRouter = new ProfileRouter(mockDB);
    });

    describe('getSymptoms() Tests', () => {

        test('getSymptoms() should get the symptoms of a user', async () => {

            // Symptoms
            const symptoms = {
                symptoms: ['symptoms']
            };

            // Mock getSymptoms()
            mockDB.getSymptoms = jest.fn().mockResolvedValueOnce(symptoms.symptoms);

            // Mock Request
            const mockReq = {
                body: {
                    username: 'username'
                }
            };

            // Call getSymptoms()
            await profileRouter.getSymptoms(mockReq, mockRes, mockNext);

            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith(symptoms);
            expect(mockRes.send).not.toHaveBeenCalled();
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('getSymptoms() should not get the symptoms with a DB error', async () => {

            // DB error
            const dbError = new Error('DB');

            // Mock getSymptoms()
            mockDB.getSymptoms = jest.fn().mockRejectedValueOnce(dbError);

            // Mock Request
            const mockReq = {
                body: {
                    username: 'username'
                }
            };

            // Call getSymptoms()
            await profileRouter.getSymptoms(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);

        });

    });

    describe('submitSymptoms() Tests', () => {

        test('submitSymptoms() should insert symptoms of a user', async () => {

            // Input
            const input = {};

            // Mock insertSymptoms()
            mockDB.insertSymptoms = jest.fn().mockResolvedValueOnce(input);

            // Mock Request
            const mockReq = {
                body: input
            };

            // Call submitSymptoms()
            await profileRouter.submitSymptoms(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockRes.send).toHaveBeenCalledWith(input);
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('submitSymptoms() should not insert the symptoms with a DB error', async () => {

            // Input
            const input = {};

            // DB error
            const dbError = new Error('DB');

            // Mock insertSymptoms()
            mockDB.insertSymptoms = jest.fn().mockRejectedValueOnce(dbError);

            // Mock Request
            const mockReq = {
                body: input
            };

            // Call submitSymptoms()
            await profileRouter.submitSymptoms(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);

        });

    });

    describe('deleteSymptom() Tests', () => {

        test('deleteSymptom() should delete symptoms of a user', async () => {

            // Input
            const input = {};

            // Mock deleteSymptom()
            mockDB.deleteSymptom = jest.fn().mockResolvedValueOnce(input);

            // Mock Request
            const mockReq = {
                body: input
            };

            // Call deleteSymptom()
            await profileRouter.deleteSymptom(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockRes.send).toHaveBeenCalledWith(input);
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('deleteSymptom() should not delete the symptoms with a DB error', async () => {

            // Input
            const input = {};

            // DB error
            const dbError = new Error('DB');

            // Mock deleteSymptom()
            mockDB.deleteSymptom = jest.fn().mockRejectedValueOnce(dbError);

            // Mock Request
            const mockReq = {
                body: input
            };

            // Call deleteSymptom()
            await profileRouter.deleteSymptom(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);

        });

    });

    describe('editSymptom() Tests', () => {

        test('editSymptom() should edit symptoms of a user', async () => {

            // Input
            const input = {};

            // Mock editSymptom()
            mockDB.editSymptom = jest.fn().mockResolvedValueOnce(input);

            // Mock Request
            const mockReq = {
                body: input
            };

            // Call editSymptom()
            await profileRouter.editSymptom(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockRes.send).toHaveBeenCalledWith(input);
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('editSymptom() should not edit the symptoms with a DB error', async () => {

            // Input
            const input = {};

            // DB error
            const dbError = new Error('DB');

            // Mock editSymptom()
            mockDB.editSymptom = jest.fn().mockRejectedValueOnce(dbError);

            // Mock Request
            const mockReq = {
                body: input
            };

            // Call editSymptom()
            await profileRouter.editSymptom(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);

        });

    });

    describe('getTestResults() Tests', () => {

        test('getTestResults() should get the test results of a user', async () => {

            // Test Results
            const testResults = {
                tests: ['testResults']
            };

            // Mock getTestResults()
            mockDB.getTestResults = jest.fn().mockResolvedValueOnce(testResults.tests);

            // Mock Request
            const mockReq = {
                body: {
                    username: 'username'
                }
            };

            // Call getTestResults()
            await profileRouter.getTestResults(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockRes.send).toHaveBeenCalledWith(testResults);
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('getTestResults() should not get the test results with a DB error', async () => {

            // DB error
            const dbError = new Error('DB');

            // Mock getTestResults()
            mockDB.getTestResults = jest.fn().mockRejectedValueOnce(dbError);

            // Mock Request
            const mockReq = {
                body: {
                    username: 'username'
                }
            };

            // Call getTestResults()
            await profileRouter.getTestResults(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);

        });

    });

    describe('submitTestResults() Tests', () => {

        test('submitTestResults() should insert test results of a user', async () => {

            // Input
            const input = {};

            // Mock insertTestResults()
            mockDB.insertTestResults = jest.fn().mockResolvedValueOnce(input);

            // Mock Request
            const mockReq = {
                body: input
            };

            // Call submitTestResults()
            await profileRouter.submitTestResults(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockRes.send).toHaveBeenCalledWith(input);
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('submitTestResults() should not insert the test results with a DB error', async () => {

            // Input
            const input = {};

            // DB error
            const dbError = new Error('DB');

            // Mock insertTestResults()
            mockDB.insertTestResults = jest.fn().mockRejectedValueOnce(dbError);

            // Mock Request
            const mockReq = {
                body: input
            };

            // Call submitTestResults()
            await profileRouter.submitTestResults(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);

        });

    });

    describe('deleteTestResult() Tests', () => {

        test('deleteTestResult() should delete test results of a user', async () => {

            // Input
            const input = {};

            // Mock deleteTestResult()
            mockDB.deleteTestResult = jest.fn().mockResolvedValueOnce(input);

            // Mock Request
            const mockReq = {
                body: input
            };

            // Call deleteTestResult()
            await profileRouter.deleteTestResult(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockRes.send).toHaveBeenCalledWith(input);
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('deleteTestResult() should not delete the test results with a DB error', async () => {

            // Input
            const input = {};

            // DB error
            const dbError = new Error('DB');

            // Mock deleteTestResult()
            mockDB.deleteTestResult = jest.fn().mockRejectedValueOnce(dbError);

            // Mock Request
            const mockReq = {
                body: input
            };

            // Call deleteTestResult()
            await profileRouter.deleteTestResult(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);

        });

    });

    describe('editTestResult() Tests', () => {

        test('editTestResult() should edit a test result of a user', async () => {

            // Input
            const input = {};

            // Mock editTestResult()
            mockDB.editTestResult = jest.fn().mockResolvedValueOnce(input);

            // Mock Request
            const mockReq = {
                body: input
            };

            // Call editTestResult()
            await profileRouter.editTestResult(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockRes.send).toHaveBeenCalledWith(input);
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('editTestResult() should not edit a test result with a DB error', async () => {

            // Input
            const input = {};

            // DB error
            const dbError = new Error('DB');

            // Mock editTestResult()
            mockDB.editTestResult = jest.fn().mockRejectedValueOnce(dbError);

            // Mock Request
            const mockReq = {
                body: input
            };

            // Call editTestResult()
            await profileRouter.editTestResult(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);

        });

    });

    describe('getAgeAndRisk() Tests', () => {

        test('getAgeAndRisk() should get the age and risk of a user', async () => {

            // Age and Risk
            const ageRisk = {
                age: 1,
                risk: 'high'
            }

            // Mock getAgeAndRisk()
            mockDB.getAgeAndRisk = jest.fn().mockResolvedValueOnce(ageRisk);

            // Mock Request
            const mockReq = {
                body: {
                    username: 'username'
                }
            };

            // Call getAgeAndRisk()
            await profileRouter.getAgeAndRisk(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockRes.send).toHaveBeenCalledWith(ageRisk);
            expect(mockNext).not.toHaveBeenCalled();

        });

        test('getAgeAndRisk() should not get the age and risk with a DB error', async () => {

            // DB error
            const dbError = new Error('DB');

            // Mock getAgeAndRisk()
            mockDB.getAgeAndRisk = jest.fn().mockRejectedValueOnce(dbError);

            // Mock Request
            const mockReq = {
                body: {
                    username: 'username'
                }
            };

            // Call getAgeAndRisk()
            await profileRouter.getAgeAndRisk(mockReq, mockRes, mockNext);

            expect(mockRes.json).not.toHaveBeenCalled();
            expect(mockRes.send).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(dbError);

        });

    });

});
