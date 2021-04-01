import React from 'react';
import Stars from './Stars';
import moment from 'moment';

const reviews = ({ reviews }) => (
    <div>
        {
            reviews &&
            reviews !== null &&
            reviews !== undefined &&
            reviews.map((review, index) => (
                <div key={index} className='card mb-3'>
                    <div className='card-body'>
                        <h3 className='card-title'>
                            {review.user}
                        </h3>
                        <Stars rating={review.rating} />
                        <p className='card-text mt-3'>
                            {review.comment}
                        </p>
                        <p className='card-text'>
                            {moment(review.date_created).fromNow()}
                        </p>
                    </div>
                </div>
            ))
        }
    </div>
);

export default reviews;
