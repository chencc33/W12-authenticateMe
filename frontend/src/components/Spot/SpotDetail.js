import { getOneSpot } from '../../store/spot'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { deleteOneSpot } from '../../store/spot'
import { useHistory } from 'react-router-dom'
import { createOneSpot } from '../../store/spot'
import './SpotDetail.css'
import EditSpotForm from './EditSpotForm'
import ReviewListBySpot from '../Review/ReviewListBySpot'

const SpotDetail = () => {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const oneSpot = useSelector((state) => state.spots)
    const targetSpot = oneSpot[spotId]
    console.log('***target Spot from component ****', targetSpot)
    const [showEditForm, setShowEditForm] = useState(false)
    console.log('*****from component******', targetSpot.previewImage)
    useEffect(() => {
        dispatch(getOneSpot(spotId))
    }, [dispatch, spotId])

    if (!targetSpot) return null
    return (
        <>
            {!showEditForm && (
                <>
                    <div>
                        <div>
                            <img src={targetSpot.previewImage} alt='Preview Image' />
                        </div>
                        <div>
                            {targetSpot.name}
                        </div>
                        <div>
                            Address: {targetSpot.address}
                        </div>
                        <div>
                            City: {targetSpot.city}
                        </div>
                        <div>
                            State: {targetSpot.state}
                        </div>
                        <div>
                            Country: {targetSpot.country}
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
                </>
            )}
            <div onClick={() => setShowEditForm(true)} className='button'>Edit</div>
            {showEditForm ? <EditSpotForm /> : null}
            <button onClick={async () => {
                await dispatch(deleteOneSpot(spotId))
                history.push('/spots')
            }}>Delete</button>
            <div>
                <h2>Reviews</h2>
                <div>
                    <ReviewListBySpot spotId={spotId} />
                </div>
            </div>
        </>
    )
}

export default SpotDetail
