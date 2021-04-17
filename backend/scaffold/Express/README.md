# Using Express Routers

## Overview

Routers in the [express](https://expressjs.com/) is a way to isolate certain API routes in a modular way, essentially sharing the same methods as the base application to form its own mini application.

## Application Level

Like everything in express, everything is registered as middleware that handles HTTP Requests and Responses in order of the way it is defined.

```javascript
// Because middleware1 was registered first, app will try to match routes in
// middleware1 before middleware2
app.use(middleware1);
app.use(middleware2);
```

A Router is simply a middleware with its own internal routing, entering into the internal system if a request matches at the middleware level.

```javascript
// Matches routes with only /prefix
app.use('/prefix',  router1);
// Matches any route
app.use(router2);
```

In the COVID Health Tracker app, we define middleware, including routers, to be used in the application in `CovidHealthTracker.js`.

```javascript
// ...
const SomethingRouter = require('./routers/SomethingRouter');

class CovidHealthTracker extends express {

  constructor(database, configuration) {
    // ...

    // Routers
    this.use('/auth', new AuthRouter(database, configuration));
    // Put Routers here before matching all routes
    this.use('/something', new SomethingRouter(/* args if necessary */));
    this.use('*', new IndexRouter());
    this.use(new ErrorRouter(configuration));

  }

}
// ...
```

In this case, we define a `SomethingRouter` from another module: `routers/SomethingRouter`. Typically, we name the Router with the prefix related to it (`/something` : `SomethingRouter`) so it is easy to reason about what routes would be defined.

## Router Level

At the Router level, there is not that much that differs than the Application level. We can still register middleware, and we can still define routes. The only difference is that we have to extend the `Router` function provided by the express framework, giving us all of the functionality that we need.

```javascript
const { Router } = require('express');

class SomethingRouter extends Router {

  constructor(/* params */) {
    super();

    // ... State, Binds, Routes
  }

  // ... Handlers

}

module.exports = SomethingRouter;
```

### Object Oriented Programming in JavaScript

Because we are using object-oriented programming (OOP) in JavaScript, there are weird specifics we have to handle, but can be understood one point at a time.

Like in many OOP languages, the class constructor requires a call to the `super` class in the beginning as to initialize the `super` class: self-explanatory.

JavaScript class can have properties to attach state to an instance of the class. However, in JavaScript, there are no implicit references to the `this` object, so assigning and referencing properties must be verbose: `this.PROPERTY`.

So when it comes to state which can be used by the `this` object, the class would look something like this:

```javascript
const { Router } = require('express');

class SomethingRouter extends Router {

  constructor(/* params */) {
    super();

    // State
    this.prop1 = true;
    this.prop2 = 42;

    // ... Binds, Routes
  }

  // ... Handlers

}

module.exports = SomethingRouter;
```

### Routing

In the comments, you may have noticed that there are binds that precede. However, it is hard to see the need for binds without first tackling routes, so we will explore that first.

Routes are just like any route defined in the Application level like mentioned earlier: registering middleware and METHOD requests (GET, PUT, POST, DELETE being the most common) with `/prefix`. However, unlike Application level routing, the Router does not need to match the entire path, but the sub-path after the match with the Router.

For example, if we had a Router that matched on `/something`, and an internal route that wanted to match the path `/something/else`, we would only have to prefix the internal route with `/else` as the Router middleware already handled the `/something` prefix.

```javascript
// Application Level: matches /something
app.use('/something', new SomethingRouter());
// Router Level: matches /something/else
this.use('/else', /* handler */);
// Router Level: matches /something/else GET requests
this.get('/else', /* handler */);
// Router Level: matches /something/else POST requests
this.post('/else', /* handler */);
```

This really shows the isolation design of the Router, as any previously matched prefix at the Application Level is hidden from the Router level unless accessed by the `mountpath` property.

### Handlers

Also similar to the Application level is that for each route defined, there is a handler. A handler is simply a function that is called when a middleware is matched. Typically, the signature looks like `(req, res, next) => undefined` for `(Request, Response, Finish) => Return Nothing`.

The [Request](https://expressjs.com/en/4x/api.html#req) object contains state from the client HTTP request: parameters, body, headers, path, etc. to be used to process business logic. The [Response](https://expressjs.com/en/4x/api.html#res) object contains methods that allow you to modify the HTTP response: status, errors, data, etc. and send back a corresponding response. If you are unfamiliar with HTTP, there are a plethora of guides online.

The Finish can be called anything (as parameter names don't mean much as opposed to the actual value) but is most commonly called the `next` or `done`, meaning that it will exit out of the current handler to move on the next route middleware, or in some cases a specific middleware (though not recommended except for error handling).

It should be noted that a Request won't end to until a Response is given, so make sure to use a method on `res` to send something back (`send`, `json`, `sendFile`) so that the connection won't hang for both the client and the server.

In the Router, we define the routes in the constructor, and handlers as static methods.

```javascript
const { Router } = require('express');

class SomethingRouter extends Router {

  constructor(/* params */) {
    super();

    // State
    this.prop1 = true;
    this.prop2 = 42;

    // ... Binds

    // Routes
    this.get('/else', SomethingRouter.elseHandler);
    this.get('*', SomethingRouter.everythingHandler);
  }

  // Handlers
  static elseHandler(req, res, next) {
    // Get isElse property from the Request Body
    const { isElse } = req.body;

    // Business Logic
    if (!isElse) {
      // Go to next route
      next();
    } else {
      // Send message through response
      res.send('this really is something else');
    }
  }

  static everythingHandler(req, res) {
    // Sending a JSON response
    res.json({
      message: 'come right back to me: ' + this.prop2
    });
  }

}

module.exports = SomethingRouter;
```

Everything seems to be in place right? Unfortunately, no. If you are familiar with the `static` keyword in many OOP languages, many would realize that the `this.prop2` reference in the `everythingHandler` would be invalid since static methods can't access instance values.

A first attempt at a solution would be to simply remove the `static` keyword, but if actually ran, an error would still occur. This is because we are extending an existing function, but the `this` is not correctly bound. None of the actual handlers we defined would appear on the `this` object unless explicitly bound using binds.

A bind simply sets the `this` object of a scope. In this case, we want the `everythingHandler` to use the `this` we instantiated in the constructor, so we redefine the `everythingHandler` to be the `everythingHandler` with a new scope for `this`.

```javascript
class SomethingRouter extends Router {

  constructor(/* params */) {
    super();

    // State
    this.prop1 = true;
    this.prop2 = 42;

    // Binds
    this.everythingHandler = SomethingRouter.everythingHandler.bind(this);

    // Routes
    this.get('/else', SomethingRouter.elseHandler);
    this.get('*', this.everythingHandler);
  }

  // Handlers
  static elseHandler(req, res, next) {
    // Get isElse property from the Request Body
    const { isElse } = req.body;

    // Business Logic
    if (!isElse) {
      // Go to next route
      next();
    } else {
      // Send message through response
      res.send('this really is something else');
    }
  }

  static everythingHandler(req, res) {
    // Sending a JSON response
    res.json({
      message: 'come right back to me: ' + this.prop2
    });
  }

}

module.exports = SomethingRouter;
```

However, you may have noticed that we don't call bind on the `elseHandler`, and that is because there are no references to `this` so it can run without an instance, so it truly fits the static definition.

This pattern may seem weird, but it commonly occurs across different frameworks (most without static due to actually extending a class rather than a function) such as in the React class based Component library.

## Conclusion

As a recap, Routers allow for isolated development in the application while having all of the same functionality abstracted as middleware. In the object-oriented programming approach in the Router level, there are some complications with the `this` instance, but overall is manageable by binding at instantiation. With this overview, exploring the properties and methods on the Request and Response objects in the [API reference](https://expressjs.com/en/4x/api.html) would give more specific details as to what can be accessed and modified when writing handlers.
