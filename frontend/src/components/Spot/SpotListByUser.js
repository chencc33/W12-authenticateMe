import { getAllSpotsByUser } from "../../store/spot";
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Link } from "react-router-dom";
import './SpotList.css'

const SpotListByUser = () => {
    const dispatch = useDispatch()
    const spotsByUser = useSelector((state) => state.spots)
    // console.log('****spotsByuser from component***', spotsByUser)
    const spotsByUserArr = Object.values(spotsByUser)
    // console.log('****spotsArrByuser from component***', spotsByUserArr)

    useEffect(() => {
        dispatch(getAllSpotsByUser())
    }, [dispatch])

    return (
        <div className="grid">
            {spotsByUserArr.map(({ id, address, avgRating, city, name, price, previewImage, state }) => (
                <ul>
                    <li className="item">
                        <div key={id}>
                            <img src={previewImage} alt="PreviewImage" />
                            <div>{state}</div>
                            <Link to={`/spots/${id}`}>
                                {city}{address}
                            </Link>
                        </div>
                    </li>
                </ul>))}
        </div>
    )
}

export default SpotListByUser
