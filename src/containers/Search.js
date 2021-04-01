import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import {
    add_item,
    get_items,
    get_total,
    get_item_total,
} from '../actions/cart';
import {
    get_wishlist_items,
    get_wishlist_item_total,
    add_wishlist_item,
    remove_wishlist_item,
} from '../actions/wishlist';
import { connect } from 'react-redux';
import Card from '../components/Card';

const Search = ({
    search_products,
    add_item,
    get_items,
    get_total,
    get_item_total,
    wishlist,
    get_wishlist_items,
    get_wishlist_item_total,
    add_wishlist_item,
    remove_wishlist_item,
    isAuthenticated,
}) => {
    const [loginRedirect, setLoginRedirect] = useState(false);
    const [redirect, setRedirect] = useState(false);

    if (loginRedirect)
        return <Redirect to='/login' />;
    if (redirect)
        return <Redirect to='/cart-or-continue-shopping' />;

    return (
        <div className='container mt-5'>
            <Helmet>
                <meta charSet='utf-8' />
                <meta name='description' content='Helmet application' />
                <title>Shop Time | Search</title>
                {/* <link rel='canonical' href='http://shoptime.com/activate' /> */}
            </Helmet>
            <h2 className='text-muted mb-5'>
            Found {
                search_products &&
                search_products !== null &&
                search_products !== undefined &&
                search_products.length
            } proudct(s) for you!
            </h2>
            <div className='row'>
                {
                    search_products && 
                    search_products !== null &&
                    search_products !== undefined &&
                    search_products.map((product, index) => (
                        <div key={index} className='col-4'>
                            <Card
                                product={product}
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
    search_products: state.products.search_products,
    wishlist: state.wishlist.items,
    isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, {
    add_item,
    get_items,
    get_total,
    get_item_total,
    get_wishlist_items,
    get_wishlist_item_total,
    add_wishlist_item,
    remove_wishlist_item,
})(Search);