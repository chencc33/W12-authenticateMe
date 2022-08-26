const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, Image, sequelize } = require('../../db/models');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//get all the reviews of the current use
router.get('/current', restoreUser, async (req, res, next) => {
    const { user } = req
    const userId = user.toSafeObject().id
    const reviews = await Review.findAll({
        where: { userId: userId },
        include: [
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
            { model: Spot, attributes: { exclude: ['createdAt', 'updatedAt'] } },
            { model: Image, attributes: ['id', 'spotId', 'url'] }
        ]
    })
    // res.json(reviews)

    let arrReviewsResponse = []

    for (let i = 0; i < reviews.length; i++) {
        let arrImages = []
        for (let j = 0; j < reviews[i].Images.length; j++) {
            let image = reviews[i].Images[j]
            image = {
                id: image.id,
                imageableId: image.spotId,
                url: image.url
            }
            arrImages.push(image)
        }
        // res.json(arrImages)
        reviews[i].Images = arrImages
        reviews[i] = {
            id: reviews[i].id,
            userId: reviews[i].userId,
            spotId: reviews[i].spotId,
            review: reviews[i].review,
            stars: reviews[i].stars,
            createdAt: reviews[i].createdAt,
            updatedAt: reviews[i].updatedAt,
            User: reviews[i].User,
            Images: reviews[i].Images
        }
        arrReviewsResponse.push(reviews[i])
    }
    return res.json(arrReviewsResponse)
})

// add Image to a review based on the review id
router.post('/:reviewId/images', restoreUser, async (req, res, next) => {
    const { user } = req
    const userId = user.toSafeObject().id
    const { url, previewImage } = req.body
    const review = await Review.findOne({ where: { id: req.params.reviewId } })
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
    // const image = await Image.findOne({
    //     where: { reviewId: req.params.reviewId }
    // })
    const newImage = await Image.create({
        url: url,
        previewImage: previewImage,
        reviewId: review.id,
        userId: userId
    })
    let newImageResponse = {
        id: newImage.id,
        imageableId: req.params.reviewId,
        url: url
    }
    return res.json(newImageResponse)
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
