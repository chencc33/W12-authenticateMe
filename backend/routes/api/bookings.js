const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Op } = require("sequelize");
const { User, Spot, Review, Image, Booking, sequelize } = require('../../db/models');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// get all of the current user's bookings
router.get('/current', restoreUser, async (req, res, next) => {
    const { user } = req
    const userId = user.toSafeObject().id

    const bookings = await Booking.findAll({
        include: [
            { model: User, attributes: [] },
            {
                model: Spot, include: { model: Image, attributes: ['url'] }
            }
        ],
        raw: true
    })
    let bookingsArr = []
    for (let booking of bookings) {
        if (booking['Spot.id']) {
            let spotData = {
                id: booking['Spot.id'],
                ownerId: booking['Spot.ownerId'],
                address: booking['Spot.address'],
                city: booking['Spot.city'],
                state: booking['Spot.state'],
                country: booking['Spot.country'],
                lat: booking['Spot.lat'],
                lng: booking['Spot.lng'],
                name: booking['Spot.name'],
                price: booking['Spot.price'],
                previewImage: booking['Spot.Images.url']
            }
            let bookingData = {
                id: booking['id'],
                spotId: booking['spotId'],
                userId: booking['userId'],
                startDate: booking['startDate'],
                endDate: booking['endDate'],
                createdAt: booking['createdAt'],
                updatedAt: booking['updatedAt'],
                Spot: spotData
            }
            bookingsArr.push(bookingData)
        }
    }

    res.json({ Bookings: bookingsArr })
})

// edit a booking
router.put('/:bookingId', restoreUser, async (req, res, next) => {
    const { user } = req
    const userId = user.toSafeObject().id

    const { startDate, endDate } = req.body
    const editBooking = await Booking.findByPk(req.params.bookingId)
    // can not find booking
    if (!editBooking) {
        res.status(404)
        res.json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    }
    // endDate can not before startdate
    let startTime = new Date(startDate)
    let endTime = new Date(endDate)
    if (endTime <= startTime) {
        res.status(400)
        return res.json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "endDate": "endDate cannot be on or before startDate"
            }
        })
    }
    //cant not edit past booking
    const currentDate = new Date()
    if (endTime < currentDate) {
        res.status(403)
        return res.json({
            "message": "Past bookings can't be modified",
            "statusCode": 403
        })
    }

    //cant not overlap the booking date of a spot
    const currentBooking = await Booking.findAll({
        where: {
            spotId: editBooking.spotId,
            [Op.and]: [
                { startDate: { [Op.lt]: endDate } },
                { endDate: { [Op.gt]: startDate } }
            ]
        }
    })

    if (currentBooking.length !== 0) {
        res.status(403)
        return res.json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "statusCode": 403,
            "errors": {
                "startDate": "Start date conflicts with an existing booking",
                "endDate": "End date conflicts with an existing booking"
            }
        })
    }
    // update the booking
    await editBooking.update({
        startDate, endDate
    })
    res.json(editBooking)
})

module.exports = router;
