import { csrfFetch } from './csrf';

const GET_REVIEW_BY_USER = 'reviews/getReviewByUser'
const GET_REVIEW_BY_SPOT = 'reviews/getReviewBySpot'
const CREATE_REVIEW = 'review/createReview'
const DELETE_REVIEW = 'review/deleteReview'

export const getReviewByUserAction = (reviews) => ({
    type: GET_REVIEW_BY_USER,
    reviews
})

export const getReviewBySpotAction = (reviews) => ({
    type: GET_REVIEW_BY_SPOT,
    reviews
})

export const createReviewAction = (review) => ({
    type: CREATE_REVIEW,
    review
})

export const deleteReivewAction = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId
})

// Thunk: get all reviews by current user
export const getReviewByUser = () => async dispatch => {
    const response = await csrfFetch(`/api/reviews/current`)
    if (response.ok) {
        const reviews = await response.json()
        // console.log('**** response from thunk***', reviews)
        dispatch(getReviewByUserAction(reviews))
    }
}

//Thunk: get all reviews by spotId
export const getReviewBySpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    if (response.ok) {
        const reviews = await response.json()
        // console.log('**** response from thunk***', reviews)
        dispatch(getReviewBySpotAction(reviews))
    }
}

//Thunk: create a review by SpotId
export const createReview = (data, spotId) => async dispatch => {
    // console.log('****test****')
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    // console.log('****test2****')
    const received = await response.json()
    // console.log('***response from thunk****', received)
    if (!received.message && response.ok) {
        // console.log('***going to reducer***')
        dispatch(createReviewAction(received))
    }
}

//thunk: delete a review
export const deleteReview = (reviewId) => async dispatch => {
    // console.log('***test1***')
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    // console.log('***test2***')
    if (response.ok) {
        const review = await response.json()
        dispatch(deleteReivewAction(reviewId))
    }

}


// Review Reducer
const reviewReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_REVIEW_BY_USER:
            const allReviewsObj = {}
            const allReviewsArr = action.reviews
            // console.log('***review from reducer***', action.reviews)
            allReviewsArr.forEach((review) => {
                allReviewsObj[review.id] = review
            })
            // console.log('***normalized all reviews ***', allReviewsObj)
            return allReviewsObj
        case GET_REVIEW_BY_SPOT:
            const allReviewsBySpotObj = {}
            const allReviewsBySpotArr = action.reviews
            console.log('***review from reducer***', action.reviews)
            allReviewsBySpotArr.forEach((review) => {
                allReviewsBySpotObj[review.id] = review
            })
            return allReviewsBySpotObj
        case CREATE_REVIEW:
            const newState = { ...state }
            newState[action.review.id] = action.review
            return newState
        case DELETE_REVIEW:
            const copyState = { ...state }
            delete copyState[action.reviewId]
            return copyState
        default:
            return state
    }
}

export default reviewReducer
