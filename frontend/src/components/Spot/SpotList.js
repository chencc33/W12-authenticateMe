import { getAllSpots } from '../../store/spot'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import CreateSpotForm from './CreateSpotForm'
import './SpotList.css'
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
            <div className='grid'>
                {spotsArr.map(({ id, address, avgRating, city, state, statedescription, name, previewImage, price }) => (
                    <div className='item card' key={id} onClick={() => { history.push(`/spots/${id}`) }}>
                        <img src={previewImage} alt="PreviewImage" />
                        <div className='card-container'>
                            <div className='intro-container'>
                                <div>{city}, {state}</div>
                                <div className='rating-container'>
                                    <i className="fa-solid fa-star">{avgRating}</i>
                                </div>
                            </div>
                            <div>${price} night</div>
                        </div>
                    </div>
                ))}
            </div>
            {/* <div className='button' hidden={showForm} onClick={() => setShowForm(true)}>Create a New Spot</div>
            {showForm ? <CreateSpotForm /> : null} */}
        </>
    )
}

export default SpotList
