const { default: axios } = require("axios");
const { Router } = require("express");

class LocationRouter extends Router {
  constructor(configuration) {
    super();

    this.configuration = configuration;

    this.handleTestingRoute = LocationRouter.handleTestingRoute.bind(this);
    this.handleVaccineRoute = LocationRouter.handleVaccineRoute.bind(this);

    this.post("/testing", this.handleTestingRoute);
    this.post("/vaccine", this.handleVaccineRoute);
  }

  static handleVaccineRoute(req, res, next) {
    axios
      .get("https://www.vaccinespotter.org/api/v0/stores/TX/cvs.json")
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static handleTestingRoute(req, res, next) {
    const axios = require("axios");

    var latitude = req.body.lat;
    var longitude = req.body.lng;

    const location = latitude + "," + longitude;
    const query = "covid+testing";
    const key = this.configuration.GOOGLE_API;
    axios
      .get(
        "https://maps.googleapis.com/maps/api/place/textsearch/json?location=" +
          location +
          "&radius=10000" +
          "&query=" +
          query +
          "&key=" +
          key
      )
      .then((response) => {
        console.log(response.data);
        res.send(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
module.exports = LocationRouter;
