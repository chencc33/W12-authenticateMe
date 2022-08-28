import { getAllSpotsByUser } from "../../store/spot";
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Link, useHistory } from "react-router-dom";
import './Style/SpotList.css'

const SpotListByUser = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const spotsByUser = useSelector((state) => state.spots)
    const spotsByUserArr = Object.values(spotsByUser)

    useEffect(() => {
        dispatch(getAllSpotsByUser())
    }, [dispatch])

    return (
        <>
            <div className="main-body-div">
                {spotsByUserArr.map(({ id, address, avgRating, city, name, price, previewImage, state }) => (
                    <div key={id} className="card" onClick={() => { history.push(`/spots/${id}`) }}>
                        <div key={id}>
                            <img className='card-image' src={previewImage} alt="PreviewImage" />
                            <div className='rating-container'>
                                <i className="fa-solid fa-star">{avgRating}</i>
                            </div>
                            <div>{name}</div>
                            <div>{address}</div>
                            <div>{city},{state}</div>
                            <div>${price} night</div>
                        </div>
                    </div>
                ))}
            </div>
            <footer className="footer"> @2022 Sweetbnb, Inc</footer>
        </>
    )
}

export default SpotListByUser
