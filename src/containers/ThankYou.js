import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
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
            <Helmet>
                <meta charSet='utf-8' />
                <meta name='description' content='Helmet application' />
                <title>Shop Time | Thank You</title>
                {/* <link rel='canonical' href='http://shoptime.com/activate' /> */}
            </Helmet>
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
