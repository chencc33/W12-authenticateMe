import { csrfFetch } from './csrf';

const LOAD_SPOT = 'spots/getSpots'
const LOAD_SPOT_USER = 'spots/getSpotsByUser'
const LOAD_ONE_SPOT = 'spot/getOneSpot'
const ADD_ONE = 'spots/addOneSpot'
const UPDATE_ONE = 'spot/updateOneSpot'
const ADD_IMAGE = 'spot/addImageToSpot'
const DELTE_ONE = 'spot/deleteOneSpot'

const loadSpotsAction = spots => ({
    type: LOAD_SPOT,
    spots
})

const loadSpotsByUserAction = spots => ({
    type: LOAD_SPOT_USER,
    spots
})

const loadOneSpotAction = spot => ({
    type: LOAD_ONE_SPOT,
    spot
})

const addSpotAction = spot => ({
    type: ADD_ONE,
    spot
})

const updateSpotAction = spot => ({
    type: UPDATE_ONE,
    spot
})

const addImageAction = spot => ({
    type: ADD_IMAGE,
    spot
})

const deleteSpotAction = spotId => ({
    type: DELTE_ONE,
    spotId
})

//Get All Spots Thunk
export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch(`/api/spots`)

    if (response.ok) {
        const spots = await response.json()
        dispatch(loadSpotsAction(spots))
        return spots
    }
}

//Get All Spots By Current User Thunk
export const getAllSpotsByUser = () => async dispatch => {
    const response = await csrfFetch(`/api/spots/current`)
    if (response.ok) {
        const spots = await response.json()
        dispatch(loadSpotsByUserAction(spots))
        return spots
    }
}

//Get One Spot by Spot Id
export const getOneSpot = (spotId) => async dispatch => {
    // console.log('***spotId***', spotId)
    const response = await csrfFetch(`/api/spots/${spotId}`)
    if (response.ok) {
        const spot = await response.json()
        // console.log('*****Spot From thunk****', spot)
        dispatch(loadOneSpotAction(spot))
        return spot
    }
}

// Create One spot
export const createOneSpot = (data) => async dispatch => {
    const response = await csrfFetch(`/api/spots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (response.ok) {
        const spot = await response.json()
        // console.log('***from thunk***', spot)
        dispatch(addSpotAction(spot))
        return spot
    }
}

//Update Spot
export const updateOneSpot = (data) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (response.ok) {
        const spot = await response.json()
        // console.log('***from thunk***', spot)
        dispatch(updateSpotAction(spot))
        return spot
    }
}

// Delete one Spot
export const deleteOneSpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
    if (response.ok) {
        const spot = await response.json()
        dispatch(deleteSpotAction(spotId))
    }
}

//Add Image Thunk
export const addImageToSpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
    if (response.ok) {
        const spot = await response.json()
        dispatch(addImageAction(spot))
    }
}

const initialState = {}

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOT:
            const allSpotsObj = {}
            const spotsArr = action.spots['Spots']
            // console.log('spotsArr', spotsArr)
            spotsArr.forEach((spot) => {
                allSpotsObj[spot.id] = spot
            })
            // console.log('allSpotsObj', allSpotsObj)
            return { ...allSpotsObj }
        case LOAD_SPOT_USER:
            const allSpotByUserObj = {}
            const spotsByUserArr = action.spots
            spotsByUserArr.forEach((spot) => {
                allSpotByUserObj[spot.id] = spot
            })
            // console.log('***spotObjByUser from reducer***', allSpotByUserObj)
            return { ...allSpotByUserObj }
        case LOAD_ONE_SPOT:
            const spotObj = {}
            const spotArr = action.spot
            spotObj[spotArr.id] = spotArr
            return { ...spotObj }
        // console.log('****oneSpot in Reducer*****', spotObj)
        case ADD_ONE:
            let newState = { ...state }
            newState[action.spot.id] = action.spot
            // const newState = { ...state, [action.spot.id]: action.spot }
            console.log('**add one from reducer**', newState)
            return newState
        case UPDATE_ONE:
            let updateState = { ...state }
            updateState[action.spot.id] = action.spot
            return updateState
        case DELTE_ONE:
            let copyState = { ...state }
            delete copyState[action.spotId]
            return copyState
        case ADD_IMAGE:
            let addImageState = { ...state }
            console.log('***addImageState from reducer***', addImageState)
        default:
            return state
    }
}

export default spotReducer
