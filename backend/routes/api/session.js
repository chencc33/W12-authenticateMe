// backend/routes/api/session.js
// hold the resources for the route paths beginning with /api/session
const express = require('express')

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

//the check and handleValidationErrors will be used to validate the body of request
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateLogin1 = [ // this middleware checks to see whether or not req.body.credential and req.body.password are empty.
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Email or username is required"),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage("Password is required"),
    handleValidationErrors
];


// Log in
router.post('/', validateLogin1, async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.login({ credential, password });

    if (!user) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = [{
            "message": "Invalid credentials",
            "statusCode": 401
        }];
        return next(err);
    }

    const token = await setTokenCookie(res, user)
    user.dataValues.token = token
    return res.json(
        user
    )

})

// // Log in
// router.post(
//     '/',
//     async (req, res, next) => {
//         const { credential, password } = req.body;
//         const csrfToken = req.csrfToken();
//         if (!credential || !password) {
//             res.status = 400
//             res.json({
//                 message: "Validation error",
//                 statusCode: 400,
//                 errors: {
//                     credential: "Email or username is required",
//                     password: "Password is required"
//                 }
//             })
//         }
//         const user = await User.login({ credential, password });
//         //if no user returned, create error and invoke next err-handling
//         if (!user) {
//             // const err = new Error('Login failed');
//             res.status = 401;
//             // err.title = 'Login failed';
//             // err.errors = ['Invalid credentials'];
//             //     return next(err);
//             res.json({
//                 message: 'Invalid credentials',
//                 statusCode: 401
//             })
//         }
//         // if user returned, call the setTokenCookie method
//         await setTokenCookie(res, user);

//         return res.json({
//             id: user.id,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             username: user.username,
//             email: user.email,
//             token: csrfToken
//         }
//         );
//     }
// );

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
            return res.json(
                user.toSafeObject()
                //     {
                //     user: user.toSafeObject()
                // }
            );
        }
        // if there is no session, return JSON with an empty obj
        else return res.json(null);
    }
);

// check whether req.body.credential and req.body.password are empty
// if empty, return error as response
const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors
];

// Log in, connect to the validateLogin middleware
router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
        const { credential, password } = req.body;

        const user = await User.login({ credential, password });

        if (!user) {
            const err = new Error('Login failed');
            err.status = 401;
            err.title = 'Login failed';
            err.errors = ['The provided credentials were invalid.'];
            return next(err);
        }

        await setTokenCookie(res, user);

        return res.json({
            user
        });
    }
);


module.exports = router;
