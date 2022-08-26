import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams, NavLink, useHistory } from 'react-router-dom'
import { getReviewBySpot } from '../../store/review'
import './Review.css'
import { createReview } from '../../store/review'
import ReviewDetail from './ReviewDetail'

const ReviewListBySpot = () => {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const reviewsObj = useSelector((state) => state.reviews)
    const reviewsArr = Object.values(reviewsObj)
    const logInUser = useSelector((state) => state.session.user)
    let logInUserId
    if (logInUser) { logInUserId = logInUser.id }

    const [review, setReview] = useState("")
    const [stars, setStars] = useState(0)
    const [showForm, setShowForm] = useState(false)

    // console.log('****from component****', reviewsArr)

    useEffect(() => {
        dispatch(getReviewBySpot(spotId))
    }, [dispatch, spotId])

    let showButton = true
    if (!reviewsArr.length) showButton = true
    if (reviewsArr.length) {
        if (!logInUserId) showButton = false
        for (let review of reviewsArr) {
            if (review.userId == logInUserId) { showButton = false }
        }
    }
    // console.log('******showButton******', showButton)
    const handleSubmit = async (e) => {
        const data = { review, stars }
        await dispatch(createReview(data, spotId))
    }

    return (
        <>
            <div>
                {reviewsArr.length && (
                    <div>
                        {reviewsArr.map((review) => (
                            <div key={review.id} className='singe-review-box' onClick={() => { history.push(`/reviews/${review.id}`) }}>
                                <div>
                                    <i className="fa-solid fa-circle-user"></i>
                                </div>
                                <div>
                                    {review.review}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div>
                {showButton && !reviewsArr.length && (
                    <>
                        <div>
                            There is no review yet. Want to create one?
                        </div>
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
                                        type='number'
                                        value={stars}
                                        onChange={(e) => setStars(e.target.value)}
                                    />
                                </label>
                                <div onClick={handleSubmit} className='button'>submit</div>
                            </form>
                        )}
                    </>
                )}
            </div>
            <div>

                {showButton && reviewsArr.length && (
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
                                        type='number'
                                        value={stars}
                                        onChange={(e) => setStars(e.target.value)}
                                    />
                                </label>
                                <div onClick={handleSubmit} className='button'>submit</div>
                            </form>
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export default ReviewListBySpot
