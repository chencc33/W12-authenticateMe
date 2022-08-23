import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getReviewBySpot } from '../../store/review'

const ReviewListBySpot = () => {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const reviewsObj = useSelector((state) => state.reviews)
    const reviewsArr = Object.values(reviewsObj)
    console.log('****from component****', reviewsArr)

    useEffect(() => {
        dispatch(getReviewBySpot(spotId))
    }, [dispatch, spotId])
    return (
        <>
            <div>
                <h2>Reviews by Spot</h2>
                {reviewsArr.map((review) => (
                    <>
                        <div>
                            Review: {review.review}
                        </div>
                        <div>
                            stars: {review.stars}
                        </div>
                    </>
                ))}
            </div>
        </>
    )
}

export default ReviewListBySpot
