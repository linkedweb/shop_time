import React from 'react';
import moment from 'moment';
import { add_wishlist_item, get_wishlist_items, get_wishlist_item_total } from '../actions/wishlist';

const productDetailCard = ({ 
    product,
    add_item,
    get_items,
    get_total,
    get_item_total,
    setRedirect,
    isAuthenticated,
    setLoginRedirect,
    add_wishlist_item,
    get_wishlist_items,
    get_wishlist_item_total,
}) => {
    const addToCart = async () => {
        if (product && product !== null && product !== undefined && product.quantity > 0) {
            await add_item(product);
            await get_items();
            await get_total();
            await get_item_total();
            setRedirect(true);
        }
    };

    const addToWishlist = async () => {
        if (!isAuthenticated) {
            setLoginRedirect(true);
        } else if (
            product &&
            product !== null &&
            product !== undefined
        ) {
            await add_wishlist_item(product.id);
            await get_wishlist_items();
            await get_wishlist_item_total();
            await get_items();
            await get_total();
            await get_item_total();
        }
    };

    return (
        <div className='row pt-5'>
            <div className='col-3'>
                <div style={{ width: '80%', marginLeft: '10%', overflow: 'hidden' }}>
                    <img
                        className='mt-5'
                        style={{ width: '100%' }}
                        src={
                            product && 
                            product !== null && 
                            product !== undefined && 
                            product.photo
                        }
                        alt='product details'
                    />
                </div>
            </div>
            <div className='col-6'>
                <h1>
                    {
                        product && 
                        product !== null && 
                        product !== undefined &&
                        product.name
                    }
                </h1>
                <p className='lead mt-3'>
                    {
                        product && 
                        product !== null && 
                        product !== undefined && 
                        product.description
                    }
                </p>
            </div>
            <div className='col-3'>
                <div className='card' style={{ padding: '10px 20px' }}>
                    <p style={{ fontSize: '24px', color: '#b12704' }}>
                        ${
                            product && 
                            product !== null &&
                            product !== undefined &&
                            product.price
                        }
                    </p>
                    <p>
                        {
                            product && 
                            product !== null &&
                            product !== undefined && 
                            product.quantity > 0 ? (
                                <span className='text-success'>
                                    In Stock
                                </span>
                            ) : (
                                <span className='text-danger'>
                                    Out of Stock
                                </span>
                            )
                        }
                    </p>
                    <button 
                        onClick={addToCart}
                        className='btn btn-warning mb-2'
                    >
                        Add to Cart
                    </button>
                    <button 
                        onClick={addToWishlist}
                        className='btn btn-outline-primary mb-2'
                    >
                        Add to Wishlist
                    </button>
                    <p className='card-text text-muted'>
                        Added {
                            product && 
                            product !== null &&
                            product !== undefined && (
                                moment(product.date_created).fromNow()
                            )
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default productDetailCard;
