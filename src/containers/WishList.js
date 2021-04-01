import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    add_item,
    get_items,
    get_total,
    get_item_total
} from '../actions/cart';
import {
    get_wishlist_items,
    get_wishlist_item_total,
    add_wishlist_item,
    remove_wishlist_item,
} from '../actions/wishlist';
import Card from '../components/Card';

const WishList = ({
    wishlist,
    total_items,
    add_item,
    get_items,
    get_total,
    get_item_total,
    get_wishlist_items,
    get_wishlist_item_total,
    add_wishlist_item,
    remove_wishlist_item,
    isAuthenticated,
}) => {
    const [loginRedirect, setLoginRedirect] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);

        get_wishlist_items();
        get_wishlist_item_total();
    }, []);

    if (loginRedirect)
        return <Redirect to='/login' />;
    if (redirect)
        return <Redirect to='/cart-or-continue-shopping' />;

    return (
        <div className='container mt-5'>
            <Helmet>
                <meta charSet='utf-8' />
                <meta name='description' content='Helmet application' />
                <title>Shop Time | Wishlist</title>
                {/* <link rel='canonical' href='http://shoptime.com/activate' /> */}
            </Helmet>
            <h2>Your Items:</h2>
            <h4 className='text-muted mt-3'>
                Your wishlist has {total_items} item(s)
            </h4>
            <hr />
            <div className='row'>
                {
                    wishlist &&
                    wishlist !== null && 
                    wishlist !== undefined &&
                    wishlist.map((item, index) => (
                        <div key={index} className='col-4'>
                            <Card
                                product={item.product}
                                add_item={add_item}
                                get_items={get_items}
                                get_total={get_total}
                                get_item_total={get_item_total}
                                wishlist={wishlist}
                                get_wishlist_items={get_wishlist_items}
                                get_wishlist_item_total={get_wishlist_item_total}
                                add_wishlist_item={add_wishlist_item}
                                remove_wishlist_item={remove_wishlist_item}
                                isAuthenticated={isAuthenticated}
                                setLoginRedirect={setLoginRedirect}
                                setRedirect={setRedirect}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    wishlist: state.wishlist.items,
    total_items: state.wishlist.total_items,
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
    add_item,
    get_items,
    get_total,
    get_item_total,
    get_wishlist_items,
    get_wishlist_item_total,
    add_wishlist_item,
    remove_wishlist_item,
})(WishList);
