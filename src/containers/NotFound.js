import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const notFound = () => (
    <div className='container mt-5 d-flex flex-column align-items-center'>
        <Helmet>
            <meta charSet='utf-8' />
            <meta name='description' content='Helmet application' />
            <title>Shop Time | 404 Not Found</title>
            {/* <link rel='canonical' href='http://shoptime.com/activate' /> */}
        </Helmet>
        <h1 className='display-3 mt-5'>404 Not Found</h1>
        <p className='text-muted'>
            The link you requested cannot be found on our site.
        </p>
        <Link to='/' className='btn btn-success mt-5'>
            Back to Site
        </Link>
    </div>
);

export default notFound;
