const { Router } = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

class AuthRouter extends Router {

    constructor(database, configuration) {
        super();

        // State
        this.database = database;
        this.configuration = configuration;

        // this Bind
        this.setupPassport = AuthRouter.setupPassport.bind(this);
        this.handleSignUpRoute = AuthRouter.handleSignUpRoute.bind(this);
        this.handleLoginRoute = AuthRouter.handleLoginRoute.bind(this);

        // Passport
        this.setupPassport();

        // Routes
        this.post('/signup', this.handleSignUpRoute);
        this.post('/login', this.handleLoginRoute);
    }

    static setupPassport() {

        // Serialization
        passport.serializeUser((user, done) => {
            done(null, user.username);
        });
        passport.deserializeUser(async (username, done) => {
            try {
                const user = await this.database.getUser(username);
                done(null, user);
            } catch (error) {
                done(error);
            }
        });

        // Strategies
        passport.use('login', new LocalStrategy(async (username, password, done) => {
            try {
                // If user doesn't exist, return error
                if (!(await this.database.getUser(username))) {
                    return done(null, false, { message: 'Username does not exist.' });
                }
                const user = await this.database.matchUser(username, password);
                // If password doesn't match, return 401
                if (user === null) {
                    const error = new Error('Unauthorized');
                    error.status = 401;
                    throw error;
                }
                // Else, return the user
                else {
                    return done(null, user);
                }
            } catch (error) {
                done(error);
            }
        }));
        passport.use('signup', new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
            try {
                // If the username is already taken, return an error
                if (await this.database.getUser(username)) {
                    return done(null, false, { message: 'Username is already taken.' });
                }
                // Insert then new user
                const newUser = await this.database.insertUser(username, password, req.body);
                return done(null, newUser);
            } catch (error) {
                done(error);
            }
        }));
        passport.use(new JWTstrategy({
            secretOrKey: this.configuration.DB_SECRET,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        }, (token, done) => {
            try {
                if (token.user) {
                    return done(null, token.user);
                } else {
                    throw new Error('Incomplete User Token');
                }
            } catch (error) {
                done(error);
            }
        }));
    }

    static handleSignUpRoute(req, res, next) {
        passport.authenticate('signup', { session: false }, (err, user, info) => {
            // If error, return error
            if (err) {
                return next(err);
            }
            // If user is invalid, return 401
            if (!user ||
                user.id === undefined ||
                user.username === undefined ||
                user.admin === undefined) {
                res.status(401);
                return res.json(info);
            }
            // Return token from user
            const body = { id: user.id, user: user.username, admin: user.admin };
            const token = jwt.sign({ user: body }, this.configuration.DB_SECRET);
            return res.json({ token });
        })(req, res, next);
    }

    static handleLoginRoute(req, res, next) {
        passport.authenticate('login', (err, user, info) => {
            // If error or invalid user, return error
            if (err || !user) {
                if (err) {
                    return next(err);
                } else {
                    const error = new Error('An error occurred.');
                    return next(error);
                }
            }
            req.login(user, { session: false }, error => {
                // If error, return error
                if (error) {
                    return next(error);
                }
                // Return token from user
                const body = { id: user.id, user: user.username, admin: user.admin };
                const token = jwt.sign({ user: body }, this.configuration.DB_SECRET);
                return res.json({ token });
            });
        })(req, res, next);
    }


}

module.exports = AuthRouter;
