const { Router } = require("express");

class ProfileRouter extends Router {
  constructor(database) {
    super();

    this.database = database;

    this.getSymptoms = ProfileRouter.getSymptoms.bind(this);
    this.submitSymptoms = ProfileRouter.submitSymptoms.bind(this);
    this.deleteSymptom = ProfileRouter.deleteSymptom.bind(this);
    this.editSymptom = ProfileRouter.editSymptom.bind(this);
    this.getTestResults = ProfileRouter.getTestResults.bind(this);
    this.submitTestResults = ProfileRouter.submitTestResults.bind(this);
    this.deleteTestResult = ProfileRouter.deleteTestResult.bind(this);
    this.editTestResult = ProfileRouter.editTestResult.bind(this);
    this.getAgeAndRisk = ProfileRouter.getAgeAndRisk.bind(this);

    this.post("/symptoms", this.getSymptoms);
    this.post("/submitSymptoms", this.submitSymptoms);
    this.post("/deleteSymptom", this.deleteSymptom);
    this.post("/editSymptom", this.editSymptom);
    this.post("/tests", this.getTestResults);
    this.post("/submitTestResults", this.submitTestResults);
    this.post("/deleteTest", this.deleteTestResult);
    this.post("/editTest", this.editTestResult);
    this.post("/ageAndRisk", this.getAgeAndRisk);
  }

  //gets all symptoms of specified user
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

  //insert new symptom for user
  static async submitSymptoms(req, res, next) {
    try {
      const input = req.body;
      const ret = await this.database.insertSymptoms(input);
      res.send(ret);
    } catch (error) {
      next(error);
    }
  }

  //delete specified symptom of user
  static async deleteSymptom(req, res, next) {
    try {
      const input = req.body;
      const ret = await this.database.deleteSymptom(input);
      res.send(ret);
    } catch (error) {
      next(error);
    }
  }

  //edit specified symptom of user
  static async editSymptom(req, res, next) {
    try {
      const input = req.body;
      const ret = await this.database.editSymptom(input);
      res.send(ret);
    } catch (error) {
      next(error);
    }
  }

  //gets test results of specified user
  static async getTestResults(req, res, next) {
    try {
      const input = req.body.username;
      const tests = await this.database.getTestResults(input);
      res.send({
        tests
      });
    } catch (error) {
      next(error);
    }
  }

  //insert new test result for user
  static async submitTestResults(req, res, next) {
    try {
      const input = req.body;
      const ret = await this.database.insertTestResults(input);
      res.send(ret);
    } catch (error) {
      next(error);
    }
  }

  //delete specified test result of a user
  static async deleteTestResult(req, res, next) {
    try {
      const input = req.body;
      const ret = await this.database.deleteTestResult(input);
      res.send(ret);
    } catch (error) {
      next(error);
    }
  }

  //edit specified test result of user
  static async editTestResult(req, res, next) {
    try {
      const input = req.body;
      const ret = await this.database.editTestResult(input);
      res.send(ret);
    } catch (error) {
      next(error);
    }
  }

  //gets the age and atRisk of user
  static async getAgeAndRisk(req, res, next){
    try {
      const username = req.body.username;
      const ret = await this.database.getAgeAndRisk(username);
      res.send(ret);
    } catch (error) {
      next(error);
    }
  }

}

module.exports = ProfileRouter;
