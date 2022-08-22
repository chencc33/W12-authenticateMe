import { getOneSpot } from '../../store/spot'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const SpotDetail = () => {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const oneSpot = useSelector((state) => state.spots)
    console.log('*****from component******', oneSpot[spotId])
    // console.log('address', address)

    useEffect(() => {
        dispatch(getOneSpot(spotId))
    }, [dispatch, spotId])

    return (
        <>
            {oneSpot[spotId].city}
        </>
    )
}

export default SpotDetail
