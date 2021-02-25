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
        this.handleLoginRoute = AuthRouter.handleLoginRoute.bind(this);

        // Passport
        this.setupPassport();

        // Routes
        this.post('/signup', ...AuthRouter.handleSignUpRoute());
        this.post('/login', this.handleLoginRoute);
    }

    static setupPassport() {

        // Serialization
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });
        passport.deserializeUser(async (id, done) => {
            try {
                const user = await this.database.getUser();
                done(null, user);
            } catch (error) {
                done(err);
            }
        });

        // Strategies
        passport.use('login', new LocalStrategy(async (username, password, done) => {
            try {
                if (!(await this.database.getUser(username))) {
                    return done(null, false, { message: 'Username does not exist.' });
                }
                const user = await this.database.matchUser(username, password);
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }));
        passport.use('signup', new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
            try {
                if (await this.database.getUser(username)) {
                    return done(null, false, { message: 'Username is already taken.' });
                }
                const newUser = await this.database.insertUser(username, password);
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
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }));
    }

    static handleSignUpRoute() {
        return [
            passport.authenticate('signup', { session: false }),
            (req, res, next) => {
                res.json({
                    message: 'Signup successful',
                    user: req.user
                });
            }
        ];
    }

    static handleLoginRoute(req, res, next) {
        passport.authenticate('login', (err, user, info) => {
            try {
                if (err || !user) {
                    const error = new Error('An error occurred.');
                    return next(error);
                }
                req.login(user, { session: false }, error => {
                    if (error) {
                        return next(error);
                    }
                    const body = { id: user.id, user: user.username };
                    const token = jwt.sign({ user: body }, this.configuration.DB_SECRET);
                    return res.json({ token });
                });
            } catch (error) {
                return next(error);
            }
        })(req, res, next);
    }


}

module.exports = AuthRouter;
