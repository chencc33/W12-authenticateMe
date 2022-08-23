import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import SpotForm from './SpotForm';

const EditSpotForm = () => {
    const { spotId } = useParams();
    let spots = useSelector((state) => state.spots);
    const spot = spots[spotId]

    return (
        <SpotForm spot={spot} formType="Update Report" />
    );
}

export default EditSpotForm
