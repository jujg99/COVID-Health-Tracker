const { default: axios } = require("axios");
const { Router } = require("express");

class DataRouter extends Router {
  constructor() {
    super();

    this.getContinentData = DataRouter.getContinentData.bind(this);
    this.getStateData = DataRouter.getStateData.bind(this);

    this.get("/continents", this.getContinentData);
    this.get("/states", this.getStateData);
  }

  //gets statistics for each continent
  static async getContinentData(req, res, next) {
    axios
      .get("https://disease.sh/v3/covid-19/continents")
      .then((response) => {
        res.send(response.data);
      })
      .catch(error => next(error));
  }

  //gets statistics for each U.S. state
  static async getStateData(req, res, next) {
    axios
      .get("https://disease.sh/v3/covid-19/states?yesterday=true")
      .then((response) => {
        res.send(response.data);
      })
      .catch(error => next(error));
  }
}

module.exports = DataRouter;
