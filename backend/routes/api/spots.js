const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, Image, sequelize } = require('../../db/models');
const router = express.Router();

router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll({
        attributes: {
            include: [
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
                [sequelize.literal("Images.url"), "previewImage"]
            ]
        },
        include: [
            {
                model: Review,
                attributes: []
            },
            {
                model: Image,
                attributes: []
            }
        ]
    })
    res.json(spots)
})

module.exports = router;
