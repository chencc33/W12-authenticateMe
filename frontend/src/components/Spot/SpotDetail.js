import { getOneSpot } from '../../store/spot'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { deleteOneSpot } from '../../store/spot'
import { useHistory } from 'react-router-dom'
import { createOneSpot } from '../../store/spot'
import './Style/SpotDetail.css'
import EditSpotForm from './EditSpotForm'
import ReviewListBySpot from '../Review/ReviewListBySpot'

const SpotDetail = () => {
    const { spotId } = useParams()
    // console.log('*****spotId*****', spotId)
    const dispatch = useDispatch()
    const history = useHistory()
    const oneSpot = useSelector((state) => state.spots)
    // console.log('****One spot****', oneSpot)
    const targetSpot = oneSpot[spotId]
    // console.log('****target spot****', targetSpot)

    const [showEditForm, setShowEditForm] = useState(false)

    useEffect(() => {
        dispatch(getOneSpot(spotId))
    }, [dispatch])

    if (!targetSpot) return null
    return (
        <>
            {!showEditForm && (
                <>
                    <hr></hr>
                    <div>
                        <h1 className='spot-title'>
                            {targetSpot.name}
                        </h1>
                        <div className='intro-container'>
                            <div>
                                <i className="fa-solid fa-star"></i>
                                {targetSpot.avgStarRating}
                            </div>
                            <div>
                                {targetSpot.city}, {targetSpot.state}, {targetSpot.country}
                            </div>
                        </div>
                        <div className='detail-card'>
                            <div>
                                <img src={targetSpot.previewImage} alt='Preview Image' />
                            </div>
                            <div className='card-container'>
                                <div>
                                    ${targetSpot.price} night
                                </div>
                                <div>
                                    <i className="fa-solid fa-star"></i>
                                    {targetSpot.avgStarRating}
                                </div>
                            </div>
                            <div>
                                {targetSpot.description}
                            </div>
                        </div>
                    </div>
                </>
            )
            }
            <div onClick={() => setShowEditForm(true)} className='button'>Edit</div>
            {showEditForm ? <EditSpotForm /> : null}
            <button onClick={async () => {
                await dispatch(deleteOneSpot(spotId))
                history.push('/spots')
            }}>Delete</button>
            <hr></hr>
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
