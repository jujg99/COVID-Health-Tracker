const { default: axios } = require("axios");
const { Router } = require("express");

class LocationRouter extends Router {
  constructor(configuration) {
    super();

    this.configuration = configuration;

    this.handleTestingRoute = LocationRouter.handleTestingRoute.bind(this);

    this.getVaccineLocations = LocationRouter.getVaccineLocations.bind(this);
    this.getDistanceFromLatLonInMiles = LocationRouter.getDistanceFromLatLonInMiles.bind(
      this
    );
    this.deg2rad = LocationRouter.deg2rad.bind(this);

    this.post("/testing", this.handleTestingRoute);
    this.post("/vaccine", this.getVaccineLocations);
  }

  static getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2, dist) {
    var R = 3958.8; // Radius of the earth in miles
    var dLat = this.deg2rad(lat2 - lat1);
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in miles
    return d < dist ? true : false;
  }

  static deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  static getVaccineLocations(req, res, next) {
    const zipCode = req.body.zip;
    const dist = req.body.distance;
    const key = "&key=" + this.configuration.GOOGLE_API;
    const url =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      zipCode +
      key;

    //get state and lat, long
    axios
      .get(url)
      .then((response) => {
        var s = "";
        var found = true;
        response.data.results[0].address_components.forEach(function (item) {
          if (item.types[0] == "administrative_area_level_1") {
            s = item.short_name;
          }
          if (item.types[0] == "postal_code") {
            if (zipCode != item.long_name) {
              found = false;
              return;
            }
          }
        });

        if (!found) {
          res.send("No match");
          return;
        }

        const data = {
          location: response.data.results[0].geometry.location,
          state: s,
        };

        //get state vaccine locations
        axios
          .get(
            "https://www.vaccinespotter.org/api/v0/states/" +
              data.state +
              ".json"
          )
          .then((response) => {
            return response.data.features;
          })
          .then(
            function (response) {
              const validPlaces = [];
              response.forEach(
                function (item, index) {
                  if (
                    this.getDistanceFromLatLonInMiles(
                      item.geometry.coordinates[1],
                      item.geometry.coordinates[0],
                      data.location.lat,
                      data.location.lng,
                      dist
                    )
                  ) {
                    validPlaces.push(item.properties);
                  }
                }.bind(this)
              );
              return validPlaces;
            }.bind(this)
          )
          .then((response) => {
            res.send(response);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static handleTestingRoute(req, res, next) {
    const axios = require("axios");

    const latitude = req.body.lat;
    const longitude = req.body.lng;

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
