import { getOneSpot } from '../../store/spot'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { deleteOneSpot } from '../../store/spot'
import { useHistory } from 'react-router-dom'
import './SpotDetail.css'

const SpotDetail = () => {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const oneSpot = useSelector((state) => state.spots)
    const targetSpot = oneSpot[spotId]
    console.log('*****from component******', oneSpot[spotId])
    useEffect(() => {
        dispatch(getOneSpot(spotId))
    }, [dispatch, spotId])

    const handleDelete = async (e) => {
        e.preventDefault()
        dispatch(deleteOneSpot(targetSpot))
        history.push('/spots')
    }

    if (!targetSpot) return null
    return (
        <>
            <div>
                <div>
                    <img src={targetSpot.previewImage} alt='Preview Image' />
                </div>
                <div>
                    {targetSpot.name}
                </div>
                <div>
                    Description: {targetSpot.description}
                </div>
                <div>
                    Price: {targetSpot.price}
                </div>
                <div>
                    {targetSpot.avgRating}
                </div>
                <div>
                    {targetSpot.city}, {targetSpot.state}
                </div>
            </div>
            <div onClick={handleDelete} className='button'>Delete</div>
        </>
    )
}

export default SpotDetail
