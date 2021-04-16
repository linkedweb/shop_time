import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import '../styles/wishlist_heart.css';

const wishListHeart = ({
    product,
    wishlist,
    toggleWishlist
}) => {
    const renderWishlistHeart = () => {
        let selected = false;
    
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
                    selected = true;
                }
            });
        }

        if (selected) {
            return (
                <div
                    className='mt-2 mb-2'
                    style={{
                        position: 'absolute',
                        top: '1%',
                        right: '5%'
                    }}
                >
                    <FontAwesomeIcon
                        onClick={toggleWishlist}
                        className='wishlist_selected'
                        icon={faHeart}
                        size='lg'
                    />
                </div>
            );
        } else {
            return (
                <div
                    className='mt-2 mb-2'
                    style={{
                        position: 'absolute',
                        top: '1%',
                        right: '5%'
                    }}
                >
                    <FontAwesomeIcon
                        id={`wishlist_item_${product.id}`}
                        onClick={toggleWishlist}
                        className='wishlist_heart'
                        icon={faHeart}
                        size='lg'
                    />
                </div>
            );
        }
    };

    return (
        <Fragment>
            {renderWishlistHeart()}
        </Fragment>
    );
};

export default wishListHeart;
