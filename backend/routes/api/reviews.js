const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, Image, sequelize } = require('../../db/models');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//get all the reviews of the current user
router.get('/current', restoreUser, async (req, res, next) => {
    const { user } = req
    const userId = user.toSafeObject().id
    const reviews = await Review.findAll({
        include: [
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
            { model: Spot, attributes: { exclude: ['createdAt', 'updatedAt'] } },
            { model: Image, attributes: ['id', 'spotId', 'url'] }
        ]
        // raw: true
    })
    // for (let review of reviews) {
    //     const images = await review.getImages({ attributes: ['id', 'spotId', 'url'] })
    //     review.Images = images
    // }
    // console.log(reviews)
    let arrReviewsResponse = []
    let arrImages = []
    for (let review of reviews) {
        for (let image of review.Images) {
            image = {
                id: image.id,
                imageableId: image.spotId,
                url: image.url
            }
            arrImages.push(image)
        }
        review.Images = arrImages
        arrReviewsResponse.push(review)
    }
    return res.json(arrReviewsResponse)
})

// add Image to a review based on the review id
router.post('/:reviewId/images', restoreUser, async (req, res, next) => {
    const { user } = req
    const userId = user.toSafeObject().id
    const { url, previewImage } = req.body
    const review = await Review.findByPk(req.params.reviewId)
    if (!review) {
        res.status(404)
        return res.json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }
    const numImage = await Image.count({ where: { reviewId: review.id } })
    if (numImage >= 10) {
        res.status(403)
        return res.json({
            message: "Maximum number of images for this resource was reached",
            statusCode: 403
        })
    }
    const image = await Image.findOne({
        where: { reviewId: review.id }
    })
    const newImage = await image.update({
        url: url,
        previewImage: previewImage,
    })
    let newImageResponse = {
        id: newImage.id,
        imageableId: review.id,
        url: url
    }
    res.json(newImageResponse)
})

// edit a review
const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .withMessage('Stars must be an integer from 1 to 5')
]
router.put('/:reviewId', restoreUser, validateReview, async (req, res, next) => {
    const { user } = req
    const userId = user.toSafeObject().id

    const { review, stars } = req.body
    const editReview = await Review.findByPk(req.params.reviewId)
    if (!editReview) {
        res.status(404)
        res.json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    } else {
        await editReview.update({
            userId: userId,
            review,
            stars
        })
        res.json(editReview)
    }
})

//delete a review
router.delete('/:reviewId', async (req, res, next) => {
    const deleteReview = await Review.findByPk(req.params.reviewId)
    if (!deleteReview) {
        res.status(404)
        res.json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    } else {
        await deleteReview.destroy()
        res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    }
})

module.exports = router;
