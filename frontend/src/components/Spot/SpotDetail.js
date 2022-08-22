import { getOneSpot } from '../../store/spot'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

const SpotDetail = (spotId) => {
    const dispatch = useDispatch()
    const oneSpot = useSelector((state) => state.spots)
    console.log('*****oneSpot from component******', oneSpot)

    useEffect(() => {
        dispatch(getOneSpot(oneSpot))
    }, [dispatch])
    return (
        <>
            Haaaa
        </>
    )
}

export default SpotDetail
