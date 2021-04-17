# Using the Jest Framework

## Overview

[Jest](https://jestjs.io/) is a testing framework that provides useful features such as matchers, mocking, and code coverage.

## Usage

Jest is used through the command line in `package.json` scripts, installed using `npm i jest`. There are many options that can be configured in via command line arguments or a `jest.config.js` generated with `jest --init`, which will prompt you with possible options.

For our project, there are two main use cases:

- `jest`: the default runner on all tests, usually used in CI/CD pipelines. In `package.json`, the command is in the `test` script.
- `jest --watch`: the runner will continuously watch all source files for changes, running tests that would be affected by the changes with immediate feedback. In `package.json`, the command is in the `west` script (I don't know if the industry creates a separate script for `--watch` option, but I find it pretty useful).

## File Structure

For our project, the best approach for unit testing is testing by module. For each module file name `src/path/to/__REPLACE__.js`, a corresponding `tst/path/to/__REPLACE__.test.js` is created. The module in `__REPLACE__.js` is imported into `__REPLACE__.test.js` to be tested using the jest API.

## Test Structure

For the `__REPLACE__.test.js` file itself, the structure of the tests can be thought of as test suites with tests.

First, `describe` describes a test suite, encapsulating nested test suites and tests. The parameters for `describe` is a description string and a callback function with the test suite code. For each `__REPLACE__` module, the top level test suite usually is `__REPLACE__ Tests` as an overarching encapsulation. Further separation can be denoted with nested test suites.

```javascript
describe('__REPLACE__ Tests', () => {

  // Overarching Test Suite
  describe('__REPLACE__ Method 1 Tests', () => {
    // Nested Test Suite
  });

});
```

However, test suites are not actually tests! To write an actual test, there are two different aliases: `test` and `it`. The only differences between `test` and `it` is readability of the test code itself and slightly different messages when the test is run; otherwise, they are semantically the same. The structure of both of these functions are similar to `describe`, in that the first parameter is a description string and the second is a callback. However, tests are not allowed to be nested. Usually, these tests are the actual unit tests themselves. Unfortunately, the tests will still fail as jest will not know whether a test passed with no test code inside. Thus, matchers in the next section are used.

```javascript
describe('__REPLACE__ Tests', () => {

  // Overarching Test Suite
  describe('__REPLACE__ Method 1 Tests', () => {
    // Nested Test Suite
    test('__REPLACE__ Method 1 with no input should return null', () => {
      // Actual Test Code
    });
  });

  it('should have default property meaning with value 42', () => {
    // Actual Test Code
  })

});
```

## Matchers

Matchers are used inside of tests to tell the jest framework whether an value fulfills a certain condition. In essence, a test should run test code with an input to produce a side effect, and the matchers check the side effect against expected values.

For now, we should introduce an example `__REPLACE__` module with code that we can actually test against:

```javascript
class __REPLACE__ {

  constructor() {
    this.meaning = 42;
  }

  method1(input) {
    if (input === undefined) {
      return null;
    }
    return `Got input: ${input}`;
  }

}

module.exports = __REPLACE__;
```

And import that module:

```javascript
const __REPLACE__ = require('./__REPLACE__');

describe('__REPLACE__ Tests', () => {
 // ...
});
```

Now that we have a module to import, we can write some test code!

Starting with the first test `__REPLACE__ Method 1 with no input should return null`, we can first run the method by instantiating the module class and running `method1`. Then, to actually verify the value, we can use an `expect` function to check the value against the expected value `null`. In the example below, the `expect` function simply wraps the value, then calls an assertion method `toEqual` with an expected value. The jest API is made such that the assertions are very readable.

```javascript
test('__REPLACE__ Method 1 with no input should return null', () => {
  const instance = new __REPLACE__();
  const value = instance.method1();
  expect(value).toEqual(null);
});
```

So, if the test passes, which it will, then when the `test` script is run, there should be our first passing test!

The second test also follows a similar pattern:

```javascript
it('should have default property meaning with value 42', () => {
  const instance = new __REPLACE__();
  expect(instance.meaning).toEqual(42);
})
```

The full list of `expect` functions can be found in the [reference documentation](https://jestjs.io/docs/expect), essentially having a function for any native javascript assertion. Several useful ones can be found in the [guide](https://jestjs.io/docs/using-matchers):

- `toBe`: identity equality
- `toEqual`: value equality
- `toBeNull`: matches only null
- `toBeUndefined`: matches only undefined
- `toBeDefined`: is the opposite of toBeUndefined
- `toBeTruthy`: matches truthy values
- `toBeFalsy`: matches falsy values
- `not`: before assertions to flip the assertion
- `toBeGreaterThan`: greater than for numbers
- `toBeGreaterThanOrEqual`: greater than or equal to for numbers
- `toBeLessThan`: less than for numbers
- `toBeLessThanOrEqual`: less than or equal to for numbers
- `toBeCloseTo`: for floating point number equality
- `toMatch`: matching a regular expression on a string
- `toContain`: checking if an item is in an iterable (e.g. array)
- `toThrow`: checking for exceptions, requiring wrapping the throwing code in a lambda: `expect(() => errorCode()).toThrow('Error Message')`

## Setup and Teardown

Now you may have noticed that for each of our two test cases, there is a repeated line. Right now it is manageable, but if there were an arbitrarily large number of test cases, then there would be a lot of repeated code. Jest also provides functions regarding setup and teardown before and after each test.

Using `beforeAll`, we can set instance to a new instance of `__REPLACE__` before each test run, keeping a single source of truth. `afterAll` would run whatever function is passed in after each test is done. It should be noted that the `before` and `after` functions suffixed with `All` are run even on tests in nested test suites, but `before` and `after` functions suffixed with `Each` are only run for tests in its current scope. A better use case for these functions an be found in the [reference documentation](https://jestjs.io/docs/setup-teardown).

```javascript
const __REPLACE__ = require('./__REPLACE__');

describe('__REPLACE__ Tests', () => {

  let instance = null;

  beforeAll(() => {
    instance = new __REPLACE__();
  });

  describe('__REPLACE__ Method 1 Tests', () => {
    test('__REPLACE__ Method 1 with no input should return null', () => {
      const value = instance.method1();
      expect(value).toEqual(null);
    });
  });

  it('should have default property meaning with value 42', () => {
    expect(instance.meaning).toEqual(42);
  })

});
```

## Asynchronous Tests

For asynchronous methods involving promises, the easiest way is probably to have an `async` callback function in the `test` and `it` tests so that you can use `async/await` keywords in javascript. To be honest, this aspect is not hard, as it simply is like any other javascript. One trivia fact is that any function marked as `async` always returns a promise. To see more methods, you can read the [guide](https://jestjs.io/docs/asynchronous).

## Mocking

For mocking, there are essentially different levels. However, I don't think I can cover all of the mocking succinctly, so I have listed them below:

- [Mocking individual function calls and functions](https://jestjs.io/docs/mock-functions)
- [Mocking Entire Class Modules](https://jestjs.io/docs/es6-class-mocks)
- [Mocking Entire Class Modules except Specific Methods](https://jestjs.io/docs/bypassing-module-mocks)

Mocking allows two main functionalities:

- Checking how many times a function has been called
- Modifying a function's implementation and return values

This is useful in the project since we pass in dependencies through the constructor for our ES6 classes (dependency injection). Using mocking, we can essentially pass in a complete custom dependency object where we control the behavior of its states and functions completely.

```javascript
// UserRouter.js
class UserRouter extends Router {

  constructor(database) {
    // ...
  }

}

// UserRouter.test.js
const UserRouter = require('./src/routers/UserRouter');

// Mock Dependencies
jest.mock('./src/external/Database');

// Import Dependencies
const Database = require('./src/external/Database');

describe('UserRouter Tests', () => {

  // Set up Mocks before each Test
  beforeAll(() => {

    // Mock implementation of Database
    Database.mockImplementation(() => {
      return {
        // Object with fields and mocked functions we want
        SALT: 'salt',
        getSymptoms: jest.fn().mockImplementation(() => {
          return [
            {
              name: 'mocked row 1'
            },
            {
              name: 'mocked row 2'
            }
          ]
        })
        // ...
      };
    });

  });

  test('Generic Example of Mocking', () => {

    // Create mocked instances
    const mockDB = new Database();

    // Can change each mocked instance per test
    mockDB.getSymptoms = jest.fn().mockImplementation(() => {
      throw new Error('MySQL bad');
    });

    // Create instance to test
    const instance = new UserRouter(mockDB);

    // Some Test Code...

  });

});
```

Another use case of mocking in our project is in the Express Router Request and Response Objects. Other ways of organizing mocking request and response objects can be found in this [blog post](https://codewithhugo.com/express-request-response-mocking/), where he creates functions that create these mock objects dynamically (probably can be called in `beforeAll`).

```javascript
// UserRouter.js
class UserRouter extends Router {

  static async getProfileHandler(req, res, next) {
    // ...
  }

}

// UserRouter.test.js
const UserRouter = require('./src/routers/UserRouter');

// Mock Dependencies
jest.mock('./src/external/Database');

// Import Dependencies
const Database = require('./src/external/Database');

describe('UserRouter Tests', () => {

  // Set up Mocks before each Test
  beforeAll(() => {

    // Mock implementation of Database
    // ...

  });

  test('Generic Example of Mocking', () => {

    // Create mocked instances
    const mockDB = new Database();

    // Test Data for mockDB
    const testUser = {
      id: '0',
      password: 'password',
      atRisk: 1
    }

    // For get user, modify implementation
    mockDB.getUser = jest.fn().mockImplementation(() => {
      return test
    });

    // Create instance to test
    const instance = new UserRouter(mockDB);

    // Create Mock Request
    const mockReq = {
      params: {
        username: 'testName'
      }
    };

    // Create Mock Response
    const mockRes = {};
    mockRes.status = jest.fn().mockReturnValue(mockRes);
    mockRes.json = jest.fn().mockReturnValue(mockRes);

    // Create Mock Next
    const mockNext = jest.fn();

    // Test get profile with username param
    instance.getProfileHandler(mockReq, mockRes, mockNext);

    // res.status should not be called
    expect(mockRes.status).not.toHaveBeenCalled();
    // res.status should have been called with the user object mocked in mockDB
    expect(mockRes.json).toHaveBeenCalledWith({ testUser });
    // Check that testUser has no id, password, and modified atRisk
    expect(testUser.id).toBeUndefined();
    expect(testUser.password).toBeUndefined();
    expect(testUser.atRisk).toEqual(true);
    // next should not be called
    expect(mockNext).not.toHaveBeenCalled();

  });

});
```

## Code Coverage

Code coverage is the concept of covering as many lines of source code with tests as possible. Every line per module is accounted for during the tests, including different branch logics, and is displayed in the test runner.

A good set of tests will cover at least 90% code coverage, and usually companies set coverage thresholds that commits have to reach in order to be merged into the source code.

As useful as code coverage seems, code coverage is not a metric of correctness. Any test can run through lines of code, but use arbitrary matchers to make the test pass. Finding edge equivalence classes is probably the highest value code coverage provides besides peace of mind.

For looking at the code coverage results outside of the test runner, coverage files in multiple formats can be found in the `coverage/` directory. In my opinion, the most useful format is the `html` format under `coverage/lcov-report/` which can be opened in a local browser.
