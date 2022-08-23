import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createOneSpot } from '../../store/spot';
import SpotForm from './SpotForm';


const CreateSpotForm = () => {
    const spot = {
        address: '',
        city: '',
        state: '',
        country: '',
        lat: '',
        lng: '',
        name: '',
        description: '',
        price: ''
    }
    return (
        <SpotForm spot={spot} formType='Create Spot' />
    )
}

export default CreateSpotForm
