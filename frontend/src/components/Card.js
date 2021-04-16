import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import WishListHeart from './WishListHeart';

const card = ({ 
    product,
    add_item,
    get_items,
    get_total,
    get_item_total,
    wishlist,
    get_wishlist_items,
    get_wishlist_item_total,
    add_wishlist_item,
    remove_wishlist_item,
    setRedirect,
    isAuthenticated,
    setLoginRedirect,
}) => {
    const addToCart = async () => {
        if (
            product && 
            product !== null && 
            product !== undefined && 
            product.quantity > 0
        ) {
            await add_item(product);
            await get_items();
            await get_total();
            await get_item_total();
            await get_wishlist_items();
            await get_wishlist_item_total();
            setRedirect(true);
        }
    };

    const toggleWishlist = async () => {
        if (isAuthenticated) {
            let isPresent = false;

            if (
                wishlist &&
                wishlist !== null &&
                wishlist !== undefined &&
                product &&
                product !== null &&
                product !== undefined
            ) {
                wishlist.map(item => {
                    if (item.product.id.toString() === product.id.toString()) {
                        isPresent = true;
                    }
                });
            }

            if (isPresent) {
                await remove_wishlist_item(product.id);
                await get_wishlist_items();
                await get_wishlist_item_total();
            } else {
                await add_wishlist_item(product.id);
                await get_wishlist_items();
                await get_wishlist_item_total();
                await get_items();
                await get_total();
                await get_item_total();
            }
        } else {
            setLoginRedirect(true);
        }
    };

    return (
        <div className='card mb-5' style={{ position: 'relative' }}>
            <div className='card-body'>
                <h3 className='card-title mr-3'>{product.name}</h3>
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
                    <button id={`product_detail_${product.id}`} className='btn btn-outline-primary mt-2 mb-2 mr-2'>
                        View Product
                    </button>
                </Link>
                <button 
                    id={`cart_item_${product.id}`}
                    onClick={addToCart} 
                    className='btn btn-outline-warning mt-2 mb-2'>
                    Add to Cart
                </button>
            </div>
            <WishListHeart
                product={product}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
            />
        </div>
    );
};

export default card;
