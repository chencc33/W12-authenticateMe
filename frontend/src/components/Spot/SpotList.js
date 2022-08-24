import { getAllSpots } from '../../store/spot'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CreateSpotForm from './CreateSpotForm'
import './SpotList.css'

const SpotList = () => {
    const dispatch = useDispatch()
    const spots = useSelector((state) => state.spots)
    const spotsArr = Object.values(spots)
    const [showForm, setShowForm] = useState(false)
    // console.log('spots from useSlector', spots)
    console.log('spotArr in component', spotsArr)

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])
    if (!spotsArr.length) return null
    return (
        <>
            <div className='grid'>
                {spotsArr.map(({ id, address, avgRating, city, state, statedescription, name, previewImage, price }) => (
                    <div className='item' key={id}>
                        <img src={previewImage} alt="PreviewImage" />
                        <div>{state}</div>
                        <Link to={`/spots/${id}`}>
                            {city}{address}
                        </Link>
                    </div>
                ))}
            </div>
            <div className='button' hidden={showForm} onClick={() => setShowForm(true)}>Create a New Spot</div>
            {showForm ? <CreateSpotForm /> : null}
        </>
    )
}

export default SpotList
