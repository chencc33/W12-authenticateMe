import './Review.css'

const CreateRviewForm = () => {
    return (
        <form className='form-box'>
            <label>
                review
                <input
                    type='review'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
            </label>
            <label>
                stars
                <input
                    type='number'
                    value={stars}
                    onChange={(e) => setStars(e.target.value)}
                />
            </label>
            <div onClick={handleSubmit} className='button'>submit</div>
        </form>
    )
}

export default CreateRviewForm
