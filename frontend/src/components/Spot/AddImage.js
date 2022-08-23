import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './SpotDetail.css'
import { addImageToSpot } from '../../store/spot'

const AddImage = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const oneSpot = useSelector((state => state.spots))
    const targetSpot = oneSpot[spotId]
    console.log('***add Image ***', oneSpot.Images)

    const [url, setUrl] = useState('')
    const [previewImage, setPreviewImage] = useState(false)

    const handleUpload = async (e) => {
        e.preventDefault()
        dispatch(addImageToSpot(targetSpot))
    }
    return (
        <div>
            <form>
                <label>
                    Image Url
                    <input
                        type='url'
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </label>
                <label>
                    Preview Image
                    <input
                        type='previewImage'
                        value={previewImage}
                        onChange={(e) => setPreviewImage(e.target.value)}
                    />
                </label>
                <div className='button' onClick={handleUpload}>Add Image</div>
            </form>
        </div>
    )
}

export default AddImage
