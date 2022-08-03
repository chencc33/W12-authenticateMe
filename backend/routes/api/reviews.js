const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, Image, sequelize } = require('../../db/models');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//get all the reviews of the current user
// the imageableId is spotId now
router.get('/current', restoreUser, async (req, res, next) => {
    const { user } = req
    const userId = user.toSafeObject().id
    const reviews = await Review.findAll({
        include: [
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
            { model: Spot, attributes: { exclude: ['createdAt', 'updatedAt'] } },
            { model: Image, attributes: ['id', 'spotId', 'url'] }
        ]
    })
    res.json(reviews)
})

// add Image to a review based on the review id
router.post('/:reviewId/images', restoreUser, async (req, res, next) => {
    const { user } = req
    const userId = user.toSafeObject().id
    const { url, previewImage } = req.body
    const review = await Review.findByPk(req.params.reviewId)
    const image = await Image.findOne({
        where: { reviewId: review.id }
    })
    res.json(review)
})
module.exports = router;
