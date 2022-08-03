const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, Image, sequelize } = require('../../db/models');
const router = express.Router();

// get all spots
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
        ],
        group: ['Spot.id']
    })
    res.json({ Spots: spots })
})

// get all spots by current user
router.get('/current', restoreUser, async (req, res, next) => {
    const { user } = req
    const userId = user.toSafeObject().id
    const spotsByuserId = await Spot.findAll({
        where: { ownerId: parseInt(userId) },
        attributes: {
            include: [
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
                [sequelize.literal("Images.url"), "previewImage"]
            ]
        },
        include: [
            { model: Review, attributes: [] },
            { model: Image, attributes: [] }
        ],
        group: ['Spot.id']
    })
    res.json({ spotsByuserId })
})

//get details of a spot from an id
router.get('/:spotId', async (req, res, next) => {
    const spotById = await Spot.findOne({
        where: { id: parseInt(req.params.spotId) },
        attributes: {
            include: [
                [sequelize.fn('COUNT', sequelize.col('Reviews.spotId')), 'numReviews'],
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgStarRating'],
            ]
        },
        include: [
            { model: Image, attributes: ['id', 'url'] },
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
            { model: Review, attributes: [] }
        ]
    })
    if (!spotById.id) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else {
        let images = spotById.Images
        images[0] = {
            id: images[0].id,
            imageableId: spotById.id,
            url: images[0].url
        }
        let spotResponse = {
            id: spotById.id,
            ownerId: spotById.ownerId,
            address: spotById.address,
            city: spotById.city,
            state: spotById.state,
            country: spotById.country,
            lat: spotById.lat,
            lng: spotById.lng,
            name: spotById.name,
            description: spotById.description,
            price: spotById.price,
            createdAt: spotById.createdAt,
            updatedAt: spotById.updatedAt,
            numReviews: spotById.numReviews,
            avgStarRating: spotById.avgStarRating,
            Images: images,
            Owner: spotById.User
        }
        res.json(spotResponse)
    }

})

module.exports = router;
