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
import { Modal } from '../../context/Modal';

const SpotDetail = () => {
    const { spotId } = useParams()
    // console.log('*****spotId*****', spotId)
    const dispatch = useDispatch()
    const history = useHistory()
    const oneSpot = useSelector((state) => state.spots)
    const reviews = useSelector((state) => state.reviews)
    const currentUser = useSelector((state) => state.session.user)

    const numReviews = Object.keys(reviews).length

    const targetSpot = oneSpot[spotId]

    const [showEditForm, setShowEditForm] = useState(false)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        dispatch(getOneSpot(spotId))
    }, [dispatch, reviews])

    let currentUserId
    if (!targetSpot) return null
    if (currentUser) currentUserId = currentUser.id
    const spotOwner = targetSpot.ownerId

    return (
        <>
            {!showEditForm && (
                <>
                    {/* <hr></hr> */}
                    <div className='spot-container'>
                        <h1 className='spot-title'>
                            {targetSpot.name}
                        </h1>
                        <div className='intro-container'>
                            <div>
                                <i className="fa-solid fa-star"></i>
                                {Number.parseFloat(targetSpot.avgStarRating).toFixed(1)}
                                <span className='dot-seperator'>&ensp;&#183;&ensp;</span>{numReviews} reviews
                                <span>&ensp;&#183;&ensp;</span>{targetSpot.city}, {targetSpot.state}, {targetSpot.country}
                            </div>
                        </div>
                        <div className='detail-card'>
                            <div>
                                <img className="spot-image" src={targetSpot.previewImage} alt='Preview Image' />
                            </div>
                            <div className='card-container'>
                                <div>
                                    ${targetSpot.price} /night
                                </div>
                                <div>
                                    <i className="fa-solid fa-star"></i>
                                    {targetSpot.avgStarRating}
                                </div>
                            </div>
                            <div className='spot-description'>
                                {targetSpot.description}
                            </div>
                        </div>
                    </div>
                </>
            )
            }

            {currentUserId == spotOwner && (
                <div onClick={() => { history.push(`/edit/spots/${spotId}`) }} className='button-edit'>Edit</div>
            )}

            {currentUserId == spotOwner && (
                <div className='delete-button'
                    onClick={async () => {
                        await dispatch(deleteOneSpot(spotId))
                        history.push('/spots')
                    }}>Delete</div>
            )}
            <hr></hr>

            <div className='reviews-container'>
                <ReviewListBySpot spotId={spotId} />
            </div>

        </>
    )
}

export default SpotDetail
