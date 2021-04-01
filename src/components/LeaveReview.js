import React, { Fragment } from 'react';
import ReactStars from 'react-rating-stars-component';
import Stars from './Stars';

const leaveReview = ({
    review,
    rating,
    setRating,
    onSubmit,
    onChange,
    comment,
    deleteReview,
}) => (
    <Fragment>
        {
            review &&
            review !== null &&
            review !== undefined &&
            review.rating && 
            review.rating !== null &&
            review.rating !== undefined &&
            Object.keys(review).length !== 0 &&
            (
                <div className='mb-3'>
                    <p>
                        Previous Rating: <Stars rating={review.rating} />
                    </p>
                </div>
            )
        }
        <div className='mb-3'>
            <p>
                <strong>Set Rating:</strong>
                <ReactStars
                    count={5}
                    onChange={setRating}
                    size={24}
                    value={rating}
                    isHalf
                    emptyIcon={<i className='far fa-star'></i>}
                    halfIcon={<i className='fa fa-star-half-alt'></i>}
                    fullIcon={<i className='fa fa-star'></i>}
                    activeColor='#ffd700'
                />
            </p>
        </div>
        <form className='mt-3' onSubmit={e => onSubmit(e)}>
            <div className='form-group'>
                <textarea
                    className='form-control'
                    name='comment'
                    cols='30'
                    rows='10'
                    placeholder={
                        review &&
                        review !== null &&
                        review !== undefined &&
                        review.comment &&
                        review.comment !== null &&
                        review.comment !== undefined ?
                        `${review.comment}` : 'Leave a Comment'
                    }
                    onChange={e => onChange(e)}
                    value={comment}
                />
            </div>
            {
                review &&
                review !== null &&
                review !== undefined &&
                Object.keys(review).length !== 0 ? (
                    <button className='btn btn-primary' type='submit'>
                        Update Review
                    </button>
                ) : (
                    <button className='btn btn-success' type='submit'>
                        Leave a Review
                    </button>
                )
            }
        </form>
        {
            review &&
            review !== null &&
            review !== undefined &&
            Object.keys(review).length !== 0 &&
            deleteReview &&
            deleteReview !== null &&
            deleteReview !== undefined && (
                <button 
                    className='btn btn-danger mt-3'
                    onClick={deleteReview}
                >
                    Delete Review
                </button>
            )
        }
    </Fragment>
);

export default leaveReview;
