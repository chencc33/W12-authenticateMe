import { getAllSpots } from '../../store/spot'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import CreateSpotForm from './CreateSpotForm'
import './Style/SpotList.css'
import { useHistory } from 'react-router-dom'

const SpotList = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const spots = useSelector((state) => state.spots)
    const spotsArr = Object.values(spots)
    const [showForm, setShowForm] = useState(false)
    // console.log('spots from useSlector', spots)
    // console.log('spotArr in component', spotsArr)

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    if (!spotsArr.length) return null

    return (
        <>
            <div className='main-body-div'>
                {spotsArr.map(({ id, avgRating, city, state, previewImage, price }) => (
                    <div className='card' key={id} onClick={() => { history.push(`/spots/${id}`) }}>
                        <img className='card-image' src={previewImage} alt="PreviewImage" />
                        <div className='intro-container'>
                            <div className='city-state'>{city}, {state}</div>
                            <div className='rating-container'>
                                <i className="fa-solid fa-star">{avgRating}</i>
                            </div>
                        </div>
                        <div className='card-price'>${price} night</div>
                    </div>
                ))}
            </div>
            {/* <div className='button' hidden={showForm} onClick={() => setShowForm(true)}>Create a New Spot</div>
            {showForm ? <CreateSpotForm /> : null} */}
        </>
    )
}

export default SpotList
