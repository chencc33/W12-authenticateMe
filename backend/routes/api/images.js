const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, Image, Booking, sequelize } = require('../../db/models');
const router = express.Router();

router.delete('/:reviewImageId', async (req, res, next) => {
    const deleteImage = await Image.findByPk(req.params.imageId)
    if (!deleteImage) {
        res.status(404)
        res.json({
            "message": "Image couldn't be found",
            "statusCode": 404
        })
    } else {
        await deleteImage.destroy()
        res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    }
})


module.exports = router;
