import { getOneSpot } from '../../store/spot'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const SpotDetail = () => {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const oneSpot = useSelector((state) => state.spots)
    const targetSpot = oneSpot[spotId]
    // console.log('*****from component******', oneSpot[spotId])
    useEffect(() => {
        dispatch(getOneSpot(spotId))
    }, [dispatch, spotId])

    if (!targetSpot) return null
    return (
        <>
            {targetSpot.city}
        </>
    )
}

export default SpotDetail
