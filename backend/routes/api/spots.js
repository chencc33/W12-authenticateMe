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
    const spotById = await Spot.findAll({
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

    let spotData = spotById[0]
    let images = spotData.Images
    images[0] = {
        id: images[0].id,
        imageableId: spotData.id,
        url: images[0].url
    }
    let spotResponse = {
        id: spotData.id,
        ownerId: spotData.ownerId,
        address: spotData.address,
        city: spotData.city,
        state: spotData.state,
        country: spotData.country,
        lat: spotData.lat,
        lng: spotData.lng,
        name: spotData.name,
        description: spotData.description,
        price: spotData.price,
        createdAt: spotData.createdAt,
        updatedAt: spotData.updatedAt,
        numReviews: spotData.numReviews,
        avgStarRating: spotData.avgStarRating,
        Images: images,
        Owner: spotData.User
    }
    res.json(spotResponse)
})

module.exports = router;
