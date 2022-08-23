import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Link } from "react-router-dom";
import { getReviewByUser } from '../../store/review';

const ReviewListByUser = () => {
    const dispatch = useDispatch()
    const reviewObjByUser = useSelector((state) => state.reviews)
    const reviewByUserArr = Object.values(reviewObjByUser)
    // console.log('****reviewObj from component****', reviewByUserArr)

    useEffect(() => {
        dispatch(getReviewByUser())
    }, [dispatch])

    return (
        <>
            <div>
                <h2>All Reviews of Current User</h2>
                {reviewByUserArr.map((review) => (
                    <ul>
                        <li key={review.id}>
                            <div>
                                Spot: {review.spotId}
                            </div>
                            <div>
                                Star: {review.stars}
                            </div>
                            <div>
                                Review: {review.review}
                            </div>
                        </li>
                    </ul>
                ))}
            </div>
        </>
    )
}

export default ReviewListByUser