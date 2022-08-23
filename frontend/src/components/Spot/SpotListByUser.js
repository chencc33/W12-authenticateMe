import { getAllSpotsByUser } from "../../store/spot";
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Link } from "react-router-dom";
import { deleteOneSpot } from "../../store/spot";

const SpotListByUser = () => {
    const dispatch = useDispatch()
    const spotsByUser = useSelector((state) => state.spots)
    console.log('****spotsByuser***', spotsByUser)
    const spotsByUserArr = Object.values(spotsByUser)

    useEffect(() => {
        dispatch(getAllSpotsByUser())
    }, [dispatch])



    return (
        <div>
            {spotsByUserArr.map((spot) => (
                <ul>
                    <li>
                        <Link key={spot.id} to={`/spots/${spot.id}`}></Link>
                        {spot.country}
                    </li>
                </ul>))}
        </div>
    )
}

export default SpotListByUser
