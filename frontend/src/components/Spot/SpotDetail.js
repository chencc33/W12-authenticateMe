import { getOneSpot } from '../../store/spot'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { deleteOneSpot } from '../../store/spot'
import { useHistory } from 'react-router-dom'
import { createOneSpot } from '../../store/spot'
import './SpotDetail.css'
import EditSpotForm from './EditSpotForm'

const SpotDetail = () => {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const oneSpot = useSelector((state) => state.spots)
    const targetSpot = oneSpot[spotId]
    // console.log('***target Spot from component ****', targetSpot)
    const [showEditForm, setShowEditForm] = useState(false)
    // console.log('*****from component******', oneSpot[spotId])
    useEffect(() => {
        dispatch(getOneSpot(spotId))
    }, [dispatch, spotId])

    // const handleDelete = (e) => {
    //     dispatch(deleteOneSpot(spotId))
    //     // history.push('/spots')
    // }

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
            {/* {!showEditForm && (
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
                </>
            )} */}
            <div onClick={() => setShowEditForm(true)} className='button'>Edit</div>
            {showEditForm ? <EditSpotForm /> : null}
            <button onClick={() => {
                dispatch(deleteOneSpot(spotId))
                history.push('/spots')
            }}>Delete</button>
        </>
    )
}

export default SpotDetail
