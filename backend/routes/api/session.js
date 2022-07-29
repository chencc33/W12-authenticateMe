// backend/routes/api/session.js
// hold the resources for the route paths beginning with /api/session
const express = require('express')

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Log in
router.post(
    '/',
    async (req, res, next) => {
        const { credential, password } = req.body;

        const user = await User.login({ credential, password });
        //if no user returned, create error and invoke next err-handling
        if (!user) {
            const err = new Error('Login failed');
            err.status = 401;
            err.title = 'Login failed';
            err.errors = ['The provided credentials were invalid.'];
            return next(err);
        }
        // if user returned, call the setTokenCookie method
        await setTokenCookie(res, user);

        return res.json({
            user
        });
    }
);

// Log out  remove the token cookie from the response and return a JSON success message
router.delete(
    '/',
    (_req, res) => {
        res.clearCookie('token');
        return res.json({ message: 'success' });
    }
);

// Restore session user
router.get(
    '/',
    restoreUser, // to get the session user, connect the restoreUser middleware,
    (req, res) => {
        const { user } = req;
        //return the session user as JSON under the key of user
        if (user) {
            return res.json({
                user: user.toSafeObject()
            });
        }
        // if there is no session, return JSON with an empty obj
        else return res.json({});
    }
);

module.exports = router;
