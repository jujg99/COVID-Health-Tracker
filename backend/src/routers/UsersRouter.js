const { Router } = require('express');

class UsersRouter extends Router {

  constructor() {
    super();

    // Routes
    this.get('/', UsersRouter.getDefaultRoute);
  }

  static getDefaultRoute(req, res, next) {
    res.send('users');
  };

}

module.exports = UsersRouter;
