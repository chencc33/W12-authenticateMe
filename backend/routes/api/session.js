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

module.exports = router;
