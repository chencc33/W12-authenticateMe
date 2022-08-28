import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useHistory } from "react-router-dom";
import { getReviewByUser } from '../../store/review';
import { NavLink } from 'react-router-dom';

const ReviewListByUser = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const reviewObjByUser = useSelector((state) => state.reviews)
    const reviewByUserArr = Object.values(reviewObjByUser)
    // console.log('****reviewObj from component****', reviewByUserArr)

    useEffect(() => {
        dispatch(getReviewByUser())
    }, [dispatch])

    return (
        <>
            <div className='main-body-div'>
                <h2>All Reviews of Current User</h2>
                {reviewByUserArr.map((review) => (
                    <div className='singe-review-box' key={review.id} onClick={() => { history.push(`/reviews/${review.id}`) }}>
                        <div>
                            Spot: {review.spotId}
                        </div>
                        <div>
                            Star: {review.stars}
                        </div>
                        <div>
                            Review: {review.review}
                        </div>
                        <hr></hr>
                    </div>
                ))}
            </div>
            <footer className='footer'>
                <hr></hr>
                @2022, Inc
            </footer>
        </>
    )
}

export default ReviewListByUser
