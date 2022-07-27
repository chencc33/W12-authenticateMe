const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
// Connect all the routes
//check the environment key in the configuration file to see whether the env is in production
const { environment } = require('./config');
const isProduction = environment === 'production';
// initialize express app
const app = express();
//connect the morgan middleware for logging information about req and res
app.use(morgan('dev'));

app.use(cookieParser()); //add a middleware for parsing cookies
app.use(express.json()); //add a middleware for parsing JSON bodies

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

// Set the _csrf token and create req.csrfToken method
// the csurf middleware will add a _csrf cookie (HTTP-only) to any server response
// and add a method on all requests (req.csrfToken) that will be set to another cookie (XSRF_TOKEN)
// the XSRF-TOKEN cookie value needs to be sent in the header of any request
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);
// it needs to be defined before error handler
const routes = require('./routes');
app.use(routes);

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = ["The requested resource couldn't be found."];
    err.status = 404;
    next(err);
});

const { ValidationError } = require('sequelize');

// Process sequelize errors
app.use((err, _req, _res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
        err.errors = err.errors.map((e) => e.message);
        err.title = 'Validation error';
    }
    next(err);
});

// Error formatter
// format all errors before returning a JSON response
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors, //errors array
        stack: isProduction ? null : err.stack
    });
});

module.exports = app;
