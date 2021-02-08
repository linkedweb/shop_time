import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const card = ({ product }) => (
    <div className='card mb-5'>
        <div className='card-body'>
            <h3 className='card-title'>{product.name}</h3>
            <div 
                className='mt-5 mb-3' 
                style={{ 
                    height: '240px', 
                    width: '90%', 
                    marginLeft: '5%',
                    overflow: 'hidden' 
                }}
            >
                <img className='card-img-top' alt='Product Visual' src={product.photo} />
            </div>
            <p className='card-text mt-3' style={{ height: '140px' }}>
                {product.description.substring(0, 100)}...
            </p>
            <p className='card-text text-muted'>
                <span className='mr-2'>
                    Price: 
                </span>
                <span
                    className='mr-3'
                    style={{ textDecoration: 'line-through' }}
                >
                    ${product.compare_price}
                </span>
                <span style={{ color: '#b12704', fontSize: '20px' }}>
                    ${product.price}
                </span>
            </p>
            <p className='card-text text-muted'>
                {
                    product.quantity > 0 ? (
                        <span className='text-success'>In Stock</span>
                    ) : (
                        <span className='text-danger'>Out of Stock</span>
                    )
                }
            </p>
            <p className='card-text text-muted'>Added {moment(product.date_created).fromNow()}</p>
            <Link to={`/product/${product.id}`}>
                <button className='btn btn-outline-primary mt-2 mb-2 mr-2'>
                    View Product
                </button>
            </Link>
        </div>
    </div>
);

export default card;
