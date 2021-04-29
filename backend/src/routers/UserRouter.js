const { Router } = require('express');

class UserRouter extends Router {

    constructor(database) {
        super();

        // State
        this.database = database;

        // Binds
        this.getProfileHandler = UserRouter.getProfileHandler.bind(this);
        this.patchProfileHandler = UserRouter.patchProfileHandler.bind(this);

        // Routes
        this.get('/profile/:username', this.getProfileHandler);
        this.patch('/profile/:username', this.patchProfileHandler);
    }

    static async getProfileHandler(req, res, next) {
        try {
            const { username } = req.params;
            const user = await this.database.getUser(username);
            // If user doesn't exist, 404
            if (user === null) {
                res.status(404);
                res.json({
                    message: `User ${username} not found`
                });
                // Otherwise, return user with modified sensitive data
            } else {
                delete user.id;
                delete user.password;
                user.atRisk = user.atRisk === 1;
                res.json({
                    user
                });
            }
        } catch (error) {
            next(error);
        }
    }

    static async patchProfileHandler(req, res, next) {
        try {
            const { username } = req.params;
            const user = await this.database.getUser(username);
            // If user doesn't exist, 404
            if (user === null) {
                res.status(404);
                return res.json({
                    message: `User ${username} not found`
                });
            }
            // If user is trying to change to an existing name, 401
            if (req.body.username !== username) {
                if (await this.database.getUser(req.body.username)) {
                    res.status(401);
                    return res.json({
                        message: `User ${req.body.username} already exists`
                    });
                }
            }
            // Patch User
            await this.database.patchUser(user, req.body);
            // Return patched user with modified sensitive data
            const patchedUser = await this.database.getUser(req.body.username);
            delete patchedUser.id;
            delete patchedUser.password;
            patchedUser.atRisk = patchedUser.atRisk === 1;
            res.json({
                user: patchedUser
            });
        } catch (error) {
            next(error);
        }
    }

}

module.exports = UserRouter;

