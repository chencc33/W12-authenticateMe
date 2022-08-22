import { getAllSpotsByUser } from "../../store/spot";
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

const SpotListByUser = () => {
    const dispatch = useDispatch()
    const spotsByUser = useSelector((state) => state.spots)
    const spotsByUserArr = Object.values(spotsByUser)

    useEffect(() => {
        dispatch(getAllSpotsByUser())
    }, [dispatch])


    return (
        <div>
            {spotsByUserArr.map((spot) => (
                <ul>
                    <li key={spot.id}>{spot.country}</li>
                </ul>))}
        </div>
    )
}

export default SpotListByUser
