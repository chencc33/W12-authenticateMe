import { getAllSpots } from '../../store/spot'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const SpotList = () => {
    const dispatch = useDispatch()
    const spots = useSelector((state) => state.spots)
    const spotsArr = Object.values(spots)
    // console.log('spots from useSlector', spots)
    // console.log('spotArr in component', spotsArr)
    // spotsArr.map(({ id, address }) => (console.log('address', address)))

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])
    if (!spotsArr.length) return null
    return (
        <div>
            {spotsArr.map(({ id, address }) => (<Link key={id} to='/spots/id'>{address}</Link>))}
        </div>
    )
}

export default SpotList
