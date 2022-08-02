// backend/routes/api/users.js
// hold the resources for the route paths beginning with /api/users
const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
        const { firstName, lastName, email, username, password } = req.body;
        if (!firstName || !lastName || !username) {
            res.status(400)
            res.json({

                message: "Validation error",
                statusCode: 400,
                errors: {
                    email: "Invalid email",
                    username: "Username is required",
                    firstName: "First Name is required",
                    lastName: "Last Name is required"
                }
            })
        }
        const userEmail = await User.findOne({ where: { email: email } })
        if (userEmail) {
            res.status(403)
            res.json(
                {
                    message: "User already exists",
                    statusCode: 403,
                    errors: {
                        email: "User with that email already exists"
                    }
                }
            )
        }
        const userName = await User.findOne({ where: { username: username } })
        if (userName) {
            res.status(403)
            res.json({
                message: "User already exists",
                statusCode: 403,
                errors: {
                    username: "User with that username already exists"
                }
            })
        }

        const user = await User.signup({ firstName, lastName, email, username, password });

        await setTokenCookie(res, user);

        return res.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            token: ""
        });
    }
);

module.exports = router;
