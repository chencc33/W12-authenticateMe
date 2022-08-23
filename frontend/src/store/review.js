import { csrfFetch } from './csrf';

const GET_REVIEW_BY_USER = 'reviews/getReviewByUser'
const GET_REVIEW_BY_SPOT = 'reviews/getReviewBySpot'
const CREATE_REVIEW = 'review/createReview'
const DELETE_REVIEW = 'review/deleteReview'

export const getReviewByUserAction = (reviews) => ({
    type: GET_REVIEW_BY_USER,
    reviews
})

export const getReviewBySpotAction = () => ({
    type: GET_REVIEW_BY_SPOT,
})

export const createReviewAction = (review) => ({
    type: CREATE_REVIEW,
    review
})

export const deleteReivewAction = (review) => ({
    type: DELETE_REVIEW,
    review
})

// Thunk: get all reviews by current user
export const getReviewByUser = () => async dispatch => {
    const response = await csrfFetch(`/api/reviews/current`)
    if (response.ok) {
        const reviews = await response.json()
        console.log('**** response from thunk***', reviews)
        dispatch(getReviewByUserAction(reviews))
    }
}

const reviewReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_REVIEW_BY_USER:
            const allReviewsObj = {}
            const allReviewsArr = action.reviews
            console.log('***review from reducer***', action.reviews)
            allReviewsArr.forEach((review) => {
                allReviewsObj[review.id] = review
            })
            console.log('***normalized all reviews ***', allReviewsObj)
            return allReviewsObj
        default:
            return state
    }
}

export default reviewReducer
