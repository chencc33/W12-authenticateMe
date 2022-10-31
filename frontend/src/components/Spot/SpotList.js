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
    console.log('******from component*******', spots)
    const spotsArr = Object.values(spots)
    const [showForm, setShowForm] = useState(false)
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
                                <i className="fa-solid fa-star">{Number.parseFloat(avgRating).toFixed(1)}</i>
                            </div>
                        </div>
                        <div className='card-price'>${price} night</div>
                    </div>
                ))}
            </div>

            <div className='mainpage-footer'>
                <div className='developer-container'>
                    <div>Chen Chen</div>
                    <div className='developer-links-container'>
                        <div className='developer-link'>
                            <a href='https://www.linkedin.com/in/chencc33/' target="_blank">
                                <i className="fa-brands fa-linkedin"></i>
                            </a>
                        </div>
                        <div className='developer-link'>
                            <a href='https://github.com/chencc33' target="_blank">
                                <i className="fa-brands fa-github"></i>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default SpotList
