import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { getReviewBySpot } from '../../store/review'
import './Review.css'
import { createReview } from '../../store/review'
import ReviewDetail from './ReviewDetail'

const ReviewListBySpot = () => {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const reviewsObj = useSelector((state) => state.reviews)
    const reviewsArr = Object.values(reviewsObj)
    const logInUserId = useSelector((state) => state.session.user.id)
    console.log('***currentUserId***', logInUserId)

    const [review, setReview] = useState("")
    const [stars, setStars] = useState(5)
    const [showForm, setShowForm] = useState(false)

    // console.log('****from component****', reviewsArr)


    useEffect(() => {
        dispatch(getReviewBySpot(spotId))
    }, [dispatch, spotId])

    let showButton = true
    for (let review of reviewsArr) {
        if (review.userId == logInUserId) { showButton = false }
    }

    const handleSubmit = async (e) => {
        const data = { review, stars }
        await dispatch(createReview(data, spotId))
    }

    return (
        <>
            <div>
                {reviewsArr.map((review) => (
                    <div key={review.id}>
                        <div>
                            Review: {review.review}
                        </div>
                        <div>
                            stars: {review.stars}
                        </div>
                        <NavLink to={`/reviews/${review.id}`}>Go Review {review.id}</NavLink>
                    </div>
                ))}
            </div>
            {showButton && (
                <>
                    <div hidden={showForm} onClick={() => setShowForm(true)} className='button'>create</div>
                    {showForm && (
                        <form>
                            <label>
                                review
                                <input
                                    type='review'
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                />
                            </label>
                            <label>
                                stars
                                <input
                                    type='stars'
                                    value={stars}
                                    onChange={(e) => setStars(e.target.value)}
                                />
                            </label>
                            <div onClick={handleSubmit} className='button'>submit</div>
                        </form>
                    )}
                </>
            )}
        </>
    )
}

export default ReviewListBySpot
