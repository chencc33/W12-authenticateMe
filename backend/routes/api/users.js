// backend/routes/api/users.js
// hold the resources for the route paths beginning with /api/users
const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
        const { email, password, username } = req.body;
        const user = await User.signup({ email, username, password });

        await setTokenCookie(res, user);

        return res.json({
            user,
        });
    }
);

module.exports = router;
