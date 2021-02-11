const { Router } = require('express');

class IndexRouter extends Router {

  constructor() {
    super();

    // Routes
    this.get('/', IndexRouter.getDefaultRoute);
  }

  static getDefaultRoute(req, res, next) {
    res.send('index');
  };

}

module.exports = IndexRouter;
