const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
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


module.exports = router;
