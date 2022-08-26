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
    const logInUser = useSelector((state) => state.session.user)
    if (!review) return null
    const reviewUserId = review.userId
    let logInUserId
    if (logInUser) logInUserId = logInUser.id
    // console.log('****Review From Component****', typeof reviewUserId)
    // console.log('****UserId From Component****', logInUserId)

    return (
        <>
            <div className='singe-review-box'>
                <div className='review-content'>
                    Review:&ensp;{review.review}</div>
            </div>
            <div className='review-stars'>
                <div>Stars: &ensp;{review.stars}</div>
            </div>

            {logInUserId === reviewUserId ? (
                <button className='button' onClick={async () => {
                    await dispatch(deleteReview(reviewId))
                    history.push('/reviews/current')
                }}>Delete</button>

            ) : null}
        </>
    )
}

export default ReviewDetail
