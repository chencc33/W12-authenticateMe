// backend/routes/index.js
const express = require('express');
const router = express.Router();
// backend/routes/index.js
// ...
const apiRouter = require('./api');

router.use('/api', apiRouter); // all the url in the api router will be prefixed with /api
// ...
// // test router
// router.get('/hello/world', function (req, res) {
//     res.cookie('XSRF-TOKEN', req.csrfToken());
//     res.send('Hello World!');
// });

// allow any developer to re-set the CSRF-token cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken
    });
});

module.exports = router;
