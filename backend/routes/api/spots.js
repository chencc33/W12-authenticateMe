const express = require('express')
const { Op } = require("sequelize");
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, Booking, Image, sequelize } = require('../../db/models');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// get all spots
router.get('/', async (req, res, next) => {
    let { page, size } = req.query
    page = parseInt(page)
    size = parseInt(size)
    if (!page) page = 1
    if (!size) size = 20
    const spots = await Spot.findAll({
        attributes: {
            include: [
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating']
            ]
        },
        include: [
            {
                model: Review, attributes: []
            },
            { model: Image, attributes: ['url'] }
        ],
        group: ['Spot.id'],
        limit: size,
        offset: size * (page - 1)
    })
    // res.json(spots)
    let arrSpotResponse = []
    for (let spot of spots) {
        let spotResponse = {
            spot: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: spot.dataValues.avgRating,
            previewImage: spot.Images[0].url
        }
        arrSpotResponse.push(spotResponse)
        // return res.json(spotResponse)
    }

    res.json({
        Spots: arrSpotResponse
    })
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
    const spot = await Spot.findOne({
        where: { id: req.params.spotId }
    })
    // if spotId not found
    if (!spot) {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    const images = await spot.getImages({ attributes: ['id', 'url'] })
    const sumRating = await Review.sum('stars', { where: { spotId: req.params.spotId } })
    const numReviews = await Review.count({ where: { spotId: req.params.spotId } })
    const avgStarRating = sumRating / numReviews
    let owners = await User.findOne({ where: spot.ownerId, attributes: ['id', 'firstName', 'lastName'] })
    let imageData = images
    imageData = {
        id: images[0].id,
        imageableId: spot.id,
        url: images[0].url
    }
    let spotResponse = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews: numReviews,
        avgStarRating: avgStarRating,
        Images: imageData,
        Owner: owners
    }
    return res.json(spotResponse)
    // const spotById = await Spot.findOne({
    //     where: { id: parseInt(req.params.spotId) },
    //     attributes: {
    //         include: [
    //             [sequelize.fn('COUNT', sequelize.col('Reviews.spotId')), 'numReviews'],
    //             [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgStarRating'],
    //         ]
    //     },
    //     include: [
    //         { model: Image, attributes: ['id', 'url'] },
    //         { model: User, attributes: ['id', 'firstName', 'lastName'] },
    //         { model: Review, attributes: [] }
    //     ]
    // })
    // if (!spotById.id) {
    //     res.status(404)
    //     res.json({
    //         "message": "Spot couldn't be found",
    //         "statusCode": 404
    //     })
    // } else {
    //     let images = spotById.Images
    //     images[0] = {
    //         id: images[0].id,
    //         imageableId: spotById.id,
    //         url: images[0].url
    //     }
    //     let spotResponse = {
    //         id: spotById.id,
    //         ownerId: spotById.ownerId,
    //         address: spotById.address,
    //         city: spotById.city,
    //         state: spotById.state,
    //         country: spotById.country,
    //         lat: spotById.lat,
    //         lng: spotById.lng,
    //         name: spotById.name,
    //         description: spotById.description,
    //         price: spotById.price,
    //         createdAt: spotById.createdAt,
    //         updatedAt: spotById.updatedAt,
    //         numReviews: spotById.dataValues.numReviews,
    //         avgStarRating: spotById.dataValues.avgStarRating,
    //         Images: images,
    //         Owner: spotById.User
    //     }
    //     res.json(spotResponse)
    // }

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

//get all the reviews by a spot id
router.get('/:spotId/reviews', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    if (!spot) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else {
        const reviews = await Review.findAll({
            where: { spotId: req.params.spotId },
            include: [
                { model: User, attributes: ['id', 'firstName', 'lastName'] },
                { model: Image, attributes: ['id', 'spotId', 'url'] }
            ]
        })
        res.json(reviews)
    }
})

//create and return a new review for a spot specified by id
router.post('/:spotId/reviews', validateReview, async (req, res, next) => {
    const { user } = req
    const userId = user.toSafeObject().id
    const { review, stars } = req.body
    const reviews = await Review.findAll({ where: { spotId: req.params.spotId } })
    const spot = await Spot.findByPk(req.params.spotId)
    const newReivew = await Review.create({
        userId: userId,
        spotId: req.params.spotId,
        review: review,
        stars: stars
    })
    for (let review of reviews) {
        if (review.userId === userId) {
            res.status(403)
            res.json({
                "message": "User already has a review for this spot",
                "statusCode": 403
            })
        }
    }
    if (!spot) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else {
        res.json(newReivew)
    }
})

//get all bookings of a spot
router.get('/:spotId/bookings', restoreUser, async (req, res, next) => {
    const { user } = req
    const userId = user.toSafeObject().id
    const spot = await Spot.findByPk(req.params.spotId)
    if (!spot) return res.json({
        "message": "Spot couldn't be found",
        "statusCode": 404
    })
    const bookings = await Booking.findAll({
        where: { spotId: req.params.spotId },
        include: { model: User, attributes: ['id', 'firstName', 'lastName'] }
    })

    let arrNormalUserResponse = []
    for (let booking of bookings) {
        let normalUserResponse = {
            spotId: booking.spotId,
            startDate: booking.startDate,
            endDate: booking.endDate
        }
        arrNormalUserResponse.push(normalUserResponse)
    }

    if (userId === bookings[0].userId) {
        res.json({ Bookings: bookings })
    } else {
        res.json({ Booking: arrNormalUserResponse })
    }
})

//create a booking for a spotId
router.post('/:spotId/bookings', restoreUser, async (req, res, next) => {
    const { user } = req
    const userId = user.toSafeObject().id
    const spot = await Spot.findByPk(req.params.spotId)
    const { startDate, endDate } = req.body

    if (!spot) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    // endTime can not early than starttime
    let startTime = new Date(startDate)
    let endTime = new Date(endDate)
    if (endTime <= startTime) {
        res.status(400)
        res.json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "endDate": "endDate cannot be on or before startDate"
            }
        })
    }
    //check if the spot is available
    const currentBooking = await Booking.findAll({
        where: {
            spotId: req.params.spotId,
            [Op.and]: [
                { startDate: { [Op.lt]: endDate } },
                { endDate: { [Op.gt]: startDate } }
            ]
        }
    })

    if (currentBooking.length !== 0) {
        res.status(403)
        res.json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "statusCode": 403,
            "errors": {
                "startDate": "Start date conflicts with an existing booking",
                "endDate": "End date conflicts with an existing booking"
            }
        })
    } else {
        // create a new booking
        const newBooking = await Booking.create({
            spotId: req.params.spotId,
            userId,
            startDate,
            endDate
        })
        res.json(newBooking)
    }
})


module.exports = router;
