import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import './Review.css'
import { deleteReview } from '../../store/review';

const ReviewDetail = () => {
    const { reviewId } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const review = useSelector((state) => state.reviews[reviewId])
    const logInUserId = useSelector((state) => state.session.user.id)
    if (!review) return null
    const reviewUserId = review.userId
    console.log('****Review From Component****', review)
    console.log('****UserId From Component****', logInUserId)

    return (
        <>
            <div>
                <div>Review: {review.review}</div>
            </div>
            <div>
                <div>Stars: {review.stars}</div>
            </div>

            {logInUserId === reviewUserId ? (
                <button onClick={async () => {
                    await dispatch(deleteReview(reviewId))
                    history.push('/reviews/current')
                }}>Delete</button>

            ) : null}
        </>
    )
}

export default ReviewDetail
