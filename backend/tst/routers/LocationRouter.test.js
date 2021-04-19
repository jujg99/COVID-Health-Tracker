const axios = require("axios");
const LocationRouter = require("../../src/routers/LocationRouter.js");

jest.mock("axios");
jest.mock("../../src/config/Configuration.js");

const Configuration = require("../../src/config/Configuration");

describe("LocationRouter tests", () => {
  let dataRouter = null;
  let mockConfig;

  const mockRes = {};
  mockRes.json = jest.fn().mockReturnValue(mockRes);
  mockRes.status = jest.fn().mockReturnValue(mockRes);
  mockRes.send = jest.fn().mockReturnValue(mockRes);

  const mockNext = jest.fn();

  beforeAll(() => {
    jest.clearAllMocks();
    mockConfig = new Configuration();
    locationRouter = new LocationRouter(mockConfig);
  });

  describe("deg2rad() Tests", () => {
      it("converts degree to radical", () => {
          expect(locationRouter.deg2rad(60)).toBeCloseTo(1.0472);
          expect(locationRouter.deg2rad(0)).toBeCloseTo(0);
          expect(locationRouter.deg2rad(180)).toBeCloseTo(3.14159);
      })
  })

  describe("getDistanceFromLatLonInMiles() Tests", () => {
      it("return true/false if distance is between two points is less than specified distance", () => {
        expect(
            locationRouter.getDistanceFromLatLonInMiles(40.73061, -73.935242, 40.83061, -73.935242, 10)
        ).toEqual(true);
        expect(
          locationRouter.getDistanceFromLatLonInMiles(40.73061, -73.935242, 41.73061, -74.935242, 10)
        ).toEqual(false);
      });
      
  })

  describe("getVaccineLocations() Tests", () => {
    it("should get nearby vaccine locations", async () => {
      const mockReq = {
        body: {
          zip: '08901',
          dist: 10,
        },
      };
      axios.get.mockResolvedValue({
        data: [
          {
            name: "CVS",
            location: "123 Cherry St. Blue Town, NY",
          },
          {
            name: "Orange Hospital",
            location: "987 Blue St. Red Town, NJ",
          },
        ],
      });
      await locationRouter.getVaccineLocations(mockReq, mockRes, mockNext);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("handleTestingRoute() Tests", () => {
    it("should get nearby testing locations", async () => {
      const mockReq = {
        body: {
          lat: 40.73061,
          lng: -73.935242,
        },
      };

      const latitude = mockReq.body.lat;
      const longitude = mockReq.body.lng;
      const location = latitude + "," + longitude;
      const query = "covid+testing";
      const key = mockConfig.GOOGLE_API;
      const url =
        "https://maps.googleapis.com/maps/api/place/textsearch/json?location=" +
        location +
        "&radius=10000" +
        "&query=" +
        query +
        "&key=" +
        key;

      axios.get.mockResolvedValue({
        data: [
          {
            name: "CVS",
            location: "123 Cherry St. Blue Town, NY",
          },
          {
            name: "Orange Hospital",
            location: "987 Blue St. Red Town, NJ",
          },
        ],
      });

      await locationRouter.handleTestingRoute(mockReq, mockRes, mockNext);
      expect(axios.get).toHaveBeenCalledWith(url);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.send).toHaveBeenCalledTimes(1);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("fails to fetch data from an API", async () => {
      const mockReq = {
        body: {
          lat: 40.73061,
          lng: -73.935242,
        },
      };
      axios.get.mockRejectedValue(
        new Error("Network error: Something went wrong")
      );
      await locationRouter.handleTestingRoute(mockReq, mockRes, mockNext);

      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.send).not.toHaveBeenCalled();
    });
  });
});
