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

  static async getContinentData(req, res, next) {
    try {
      axios
        .get("https://corona.lmao.ninja/v2/continents?yesterday=true&sort")
        .then((response) => {
          res.send(response.data);
        });
    } catch (error) {
      next(error);
    }
  }

  static async getStateData(req, res, next) {
    try {
      axios
        .get("https://corona.lmao.ninja/v2/states?sort&yesterday=true")
        .then((response) => {
            console.log(response.data);
          res.send(response.data);
        });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DataRouter;
