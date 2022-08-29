import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createOneSpot } from '../../store/spot';
import { updateOneSpot } from '../../store/spot';
import './Style/SpotForm.css'


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
    const [previewImage, setPreviewImage] = useState(spot.previewImage)
    const [validationErrors, setValidationErrors] = useState([])
    const [hasSubmitted, setHasSubmitted] = useState(false)
    // const [showForm, setShowForm] = useState(false)
    const user = useSelector((state) => state.session.user)

    useEffect(() => {
        let errors = []
        if (!address.length) errors.push('Please provide your address')
        if (!city.length) errors.push('Please provide your city')
        if (!state.length) errors.push('Please provide your state')
        if (!country.length) errors.push('Please provide the country')
        if (!lat) errors.push('Please provide a valid latitude')
        if (parseInt(lat) < -91 || parseInt(lat) > 91) errors.push('Please provide a valid latitude')
        if (!lng) errors.push('Please provide a valid longitude')
        if (parseInt(lng) < -180 || parseInt(lng) > 181) errors.push('Please provide a valid longitutde')
        if (!name.length) errors.push('Please provide the spot name')
        if (!description.length) errors.push('Please provide the spot description')
        if (parseInt(price) < 0) errors.push('Please provide a valid price')
        if (parseFloat(price) % 1 !== 0) errors.push('Please provide price as integer')
        if (!Number.isInteger(parseInt(price))) errors.push('Please provide the price as integer')
        if (!previewImage.length) errors.push('Please provide a a valid image url')
        setValidationErrors(errors)
    }, [address, city, state, country, lat, lng, name, description, price, previewImage])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setHasSubmitted(true)
        // console.log('*****spot from spot form *****', spot)
        // console.log('*****from spot form *****', previewImage)
        const data = {
            ...spot, address, city, state, country, lat, lng, name, description, price: parseInt(price), previewImage
        }
        // console.log('*****spot from spot form *****', spot)
        if (formType === 'Create Spot') {
            const newSpot = await dispatch(createOneSpot(data))
            if (newSpot) {
                history.push(`/spots/${newSpot.id}`)
            }
        } else {
            dispatch(updateOneSpot(data))
            history.push(`/spots/${spot.id}`)
        }
    }

    return (
        <section>
            <form className='form'>
                {validationErrors.length > 0 && hasSubmitted && (
                    <ul>
                        {validationErrors.map((error) => (
                            <li key={error}>{error}</li>
                        ))}
                    </ul>
                )}
                <div>
                    <label>
                        Address
                        <input
                            type='text'
                            value={address}
                            placeholder='Address'
                            onChange={(e) => setAddress(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        City
                        <input
                            type='text'
                            value={city}
                            placeholder='City'
                            onChange={(e) => setCity(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        State
                        <input
                            type='text'
                            value={state}
                            placeholder='State'
                            onChange={(e) => setState(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Country
                        <input
                            type='text'
                            value={country}
                            placeholder='Country'
                            onChange={(e) => setCountry(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Latitude
                        <input
                            type='number'
                            value={lat}
                            placeholder='Latitude (-90 to 90)'
                            onChange={(e) => setLat(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Longitude
                        <input
                            type='number'
                            value={lng}
                            placeholder='Longitude (-180 to 180)'
                            onChange={(e) => setLng(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Name
                        <input
                            type='text'
                            value={name}
                            placeholder='Name'
                            onChange={(e) => setName(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Description
                        <input
                            type='text'
                            value={description}
                            placeholder='Description'
                            onChange={(e) => setDescription(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Price
                        <input
                            type='number'
                            value={price}
                            placeholder='Enter a postive integer'
                            onChange={(e) => setPrice(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Image Url
                        <input
                            type='url'
                            value={previewImage}
                            placeholder='Image Url'
                            onChange={(e) => setPreviewImage(e.target.value)} />
                    </label>
                </div>
                <div onClick={handleSubmit} className='button' value={formType}>{formType}</div>

            </form>
        </section>
    )
}

export default SpotForm
