import React from 'react';
import { Link } from 'react-router-dom';

const notFound = () => (
    <div className='container mt-5 d-flex flex-column align-items-center'>
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
