const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, Image, sequelize } = require('../../db/models');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
// try lazy loading
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

//create a spot
const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
];
router.post('/', validateSpot, async (req, res, next) => {
    const { user } = req
    const userId = user.toSafeObject().id
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const newSpot = await Spot.create({
        ownerId: userId, address, city, state, country, lat, lng, name, description, price
    })
    const newSpotInfo = await Spot.findByPk(newSpot.id)
    res.json(newSpotInfo)
})

//add an Image to a spot based on the spot's id
router.post('/:spotId/images', async (req, res, next) => {
    const { url } = req.body
    const editSpot = await Spot.findOne({
        where: { id: req.params.spotId }
    })
    const newImage = await Image.create({
        url: url,
        spotId: req.params.spotId
    })
    const editImageResponse = {
        id: newImage.id,
        imageableId: newImage.spotId,
        url: newImage.url
    }
    if (!editSpot) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else {
        res.json(editImageResponse)
    }
})

//edit a spot
router.put('/:spotId', restoreUser, validateSpot, async (req, res, next) => {
    const { user } = req
    const userId = user.toSafeObject().id
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const editSpot = await Spot.findByPk(req.params.spotId)
    if (!editSpot) {
        res.status(404)
        res.json(
            {
                "message": "Spot couldn't be found",
                "statusCode": 404
            }
        )
    } else {
        editSpot.update({
            ownerId: userId, address, city, state, country, lat, lng, name, description, price
        })
        res.json(editSpot)
    }
})

//delete an existing spot
router.delete('/:spotId', async (req, res, next) => {
    const deleteSpot = await Spot.findByPk(req.params.spotId)
    if (!deleteSpot) {
        res.status(404)
        res.json(
            {
                "message": "Spot couldn't be found",
                "statusCode": 404
            }
        )
    } else {
        deleteSpot.destroy()
        res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    }
})

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .withMessage('Stars must be an integer from 1 to 5')
]
//create and return a new review for a spot specified by id
router.post('/:spotId/reviews', validateReview, async (req, res, next) => {
    const { user } = req
    const userId = user.toSafeObject().id
    const { review, stars } = req.body
    const spot = await Spot.findByPk(req.params.spotId)
    const newReivew = await Review.create({
        userId: userId,
        spotId: req.params.spotId,
        review: review,
        stars: stars
    })
    if (!spot) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else {
        res.json({ Reviews: newReivew })
    }

})
module.exports = router;
