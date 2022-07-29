// backend/routes/api/users.js
// hold the resources for the route paths beginning with /api/users
const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();

// Sign up
router.post(
    '/',
    async (req, res) => {
        const { email, password, username } = req.body;
        // call the signup static method on the User model
        const user = await User.signup({ email, username, password });
        // if the user is successfully created, call setToken Cookie
        await setTokenCookie(res, user);
        // return a JSON response with the user information
        return res.json({
            user
        });
    }
);

module.exports = router;
