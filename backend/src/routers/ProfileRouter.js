const { Router } = require("express");

class ProfileRouter extends Router {
  constructor(database) {
    super();

    this.database = database;

    this.getSymptoms = ProfileRouter.getSymptoms.bind(this);
    this.submitSymptoms = ProfileRouter.submitSymptoms.bind(this);
    this.submitTestResults = ProfileRouter.submitTestResults.bind(this);
    this.deleteSymptom = ProfileRouter.deleteSymptom.bind(this);
    this.editSymptom = ProfileRouter.editSymptom.bind(this);

    this.post("/symptoms", this.getSymptoms);
    this.post("/submitSymptoms", this.submitSymptoms);
    this.post("/submitTestResults", this.submitTestResults);
    this.post("/deleteSymptom", this.deleteSymptom);
    this.post("/editSymptom", this.editSymptom);
  }

  static async getSymptoms(req, res, next) {
    try {
      const username = req.body.username;
      const symptoms = await this.database.getSymptoms(username);
      res.json({
        symptoms,
      });
    } catch (error) {
      next(error);
    }
  }

  static async submitSymptoms(req, res, next) {
    try {
      const input = req.body;
      const ret = await this.database.insertSymptoms(input);
      res.send(ret);
    } catch (error) {
      next(error);
    }
  }

  static async submitTestResults(req, res, next) {
    try {
      const input = req.body;
      const ret = await this.database.insertTestResults(input);
      res.send(ret);
    } catch (error) {
      next(error);
    }
  }

  static async deleteSymptom(req, res, next) {
    try {
      const input = req.body;
      const ret = await this.database.deleteSymptom(input);
      res.send(ret);
    } catch (error) {
      next(error);
    }
  }

  static async editSymptom(req, res, next) {
    try {
      const input = req.body;
      const ret = await this.database.editSymptom(input);
      res.send(ret);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProfileRouter;
