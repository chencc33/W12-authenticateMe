import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createOneSpot } from '../../store/spot';
import { updateOneSpot } from '../../store/spot';


const SpotForm = ({ spot, formType }) => {
    // console.log('***SPOTFORM from component****', spot.Images.url)
    const dispatch = useDispatch()
    const history = useHistory()
    const [address, setAddress] = useState(spot.address)
    const [city, setCity] = useState(spot.city)
    const [state, setState] = useState(spot.state)
    const [country, setCountry] = useState(spot.country)
    const [lat, setLat] = useState(spot.lat)
    const [lng, setLng] = useState(spot.lng)
    const [name, setName] = useState(spot.name)
    const [description, setDescription] = useState(spot.description)
    const [price, setPrice] = useState(spot.price)
    // const [showForm, setShowForm] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = { ...spot, address, city, state, country, lat, lng, name, description, price }
        console.log('***data***', data)
        if (formType === 'Create Spot') {
            await dispatch(createOneSpot(data))
        } else {
            await dispatch(updateOneSpot(data))
        }
        //// still have errors in with redirect
        // const newSpot = await dispatch(createOneSpot(data))
        // if (newSpot) {
        //     history.push(`/spots/${newSpot.id}`)
        // }
    }

    return (
        <section>
            <form>
                <label>
                    Address
                    <input
                        type='address'
                        value={address}
                        placeholder='Address'
                        onChange={(e) => setAddress(e.target.value)} />
                </label>
                <label>
                    City
                    <input
                        type='city'
                        value={city}
                        placeholder='City'
                        onChange={(e) => setCity(e.target.value)} />
                </label>
                <label>
                    State
                    <input
                        type='state'
                        value={state}
                        placeholder='State'
                        onChange={(e) => setState(e.target.value)} />
                </label>
                <label>
                    Country
                    <input
                        type='country'
                        value={country}
                        placeholder='Country'
                        onChange={(e) => setCountry(e.target.value)} />
                </label>
                <label>
                    Latitude
                    <input
                        type='lat'
                        value={lat}
                        placeholder='Latitude'
                        onChange={(e) => setLat(e.target.value)} />
                </label>
                <label>
                    Longitude
                    <input
                        type='lng'
                        value={lng}
                        placeholder='Longitude'
                        onChange={(e) => setLng(e.target.value)} />
                </label>
                <label>
                    Name
                    <input
                        type='name'
                        value={name}
                        placeholder='Name'
                        onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    Description
                    <input
                        type='description'
                        value={description}
                        placeholder='Description'
                        onChange={(e) => setDescription(e.target.value)} />
                </label>
                <label>
                    <input
                        type='price'
                        value={price}
                        placeholder='Price'
                        onChange={(e) => setPrice(e.target.value)} />
                </label>
            </form>
            <div onClick={handleSubmit} className='button' value={formType}>{formType}</div>
        </section>
    )
}

export default SpotForm
