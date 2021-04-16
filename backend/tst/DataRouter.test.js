const axios = require('axios');
const DataRouter = require('../src/routers/DataRouter.js');

jest.mock('axios');

describe('DataRouter tests', () =>{
    let dataRouter = null;

    const mockRes = {};
    mockRes.json = jest.fn().mockReturnValue(mockRes);
    mockRes.status = jest.fn().mockReturnValue(mockRes);
    mockRes.send = jest.fn().mockReturnValue(mockRes);
    const mockReq = {};
    const mockNext = jest.fn();

    beforeAll(() => {
        jest.clearAllMocks();
        dataRouter = new DataRouter();
    });

    describe('getContinentData() Tests', () => {
        it('fetches successfully data from an API', async () => {
            axios.get.mockResolvedValue({
                data: [
                  {
                    continent: 'North America',
                    todayCases: 5093,
                    todayDeaths: 429
                  },
                  {
                    continent: 'Asia',
                    todayCases: 9831,
                    todayDeaths: 145
                  },
                ]
              });
           
              await dataRouter.getContinentData(mockReq,mockRes, mockNext);
              expect(axios.get).toHaveBeenCalledWith(
                `https://disease.sh/v3/covid-19/continents`,
              );
              expect(mockRes.status).not.toHaveBeenCalled();
              expect(mockRes.send).toHaveBeenCalledTimes(1);
              expect(mockNext).not.toHaveBeenCalled();
        });
       
        it('fails to fetch data from an API', async () => {
            axios.get.mockRejectedValue(new Error('Network error: Something went wrong'));
            await dataRouter.getContinentData(mockReq,mockRes, mockNext);
            expect(axios.get).toHaveBeenCalledWith(
              `https://disease.sh/v3/covid-19/continents`,
            );
            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.send).not.toHaveBeenCalled();
        });
    });

    describe('getStateData() Tests', () => {
      it('fetches successfully data from an API', async () => {
          axios.get.mockResolvedValue({
              data: [
                {
                  continent: 'New Jersey',
                  todayCases: 152,
                  todayDeaths: 23
                },
                {
                  continent: 'New York',
                  todayCases: 231,
                  todayDeaths: 145
                },
              ]
            });
         
            await dataRouter.getStateData(mockReq,mockRes, mockNext);
            expect(axios.get).toHaveBeenCalledWith(
              `https://disease.sh/v3/covid-19/states?yesterday=true`,
            );
            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledTimes(1);
            expect(mockNext).not.toHaveBeenCalled();
      });
     
      it('fails to fetch data from an API', async () => {
          axios.get.mockRejectedValue(new Error('Network error: Something went wrong'));
          await dataRouter.getStateData(mockReq,mockRes, mockNext);
          expect(axios.get).toHaveBeenCalledWith(
            `https://disease.sh/v3/covid-19/states?yesterday=true`,
          );
          expect(mockRes.status).not.toHaveBeenCalled();
          expect(mockRes.send).not.toHaveBeenCalled();
      });
  });
})