import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { reset } from '../actions/payment';

const ThankYou = ({ reset }) => {
    useEffect(() => {
        reset();
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='container mt-5 d-flex flex-column align-items-center'>
            <h1 className='display-2 mt-5'>Thank You</h1>
            <p className='text-muted'>
                Hope you enjoyed your experience shopping at Shop Time!
            </p>
            <Link to='/' className='btn btn-success mt-5'>
                Back to Site
            </Link>
        </div>
    );
};

export default connect(null, { reset })(ThankYou);
