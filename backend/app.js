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

const routes = require('./routes');
app.use(routes);
module.exports = app;
