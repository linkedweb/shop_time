import React, { Fragment, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { 
    get_products_by_arrival, 
    get_products_by_sold 
} from '../actions/products';
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
import LandingPage from '../components/LandingPage';

const Home = ({
    products_arrival,
    products_sold,
    get_products_by_arrival,
    get_products_by_sold,
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
    const [redirect, setRedirect] = useState(false);
    const [loginRedirect, setLoginRedirect] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);

        get_products_by_arrival();
        get_products_by_sold();
    }, []);

    if (loginRedirect)
        return <Redirect to='/login' />;
    if (redirect)
        return <Redirect to='/cart-or-continue-shopping' />;

    return (
        <Fragment>
            <Helmet>
                <meta charSet='utf-8' />
                <meta name='description' content='Helmet application' />
                <title>Shop Time | Home</title>
                {/* <link rel='canonical' href='http://shoptime.com/activate' /> */}
            </Helmet>
            <LandingPage
                products_arrival={products_arrival}
                products_sold={products_sold}
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
        </Fragment>
    );
};

const mapStateToProps = state => ({
    products_arrival: state.products.products_arrival,
    products_sold: state.products.products_sold,
    wishlist: state.wishlist.items,
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
    get_products_by_arrival, 
    get_products_by_sold,
    add_item,
    get_items,
    get_total,
    get_item_total,
    get_wishlist_items,
    get_wishlist_item_total,
    add_wishlist_item,
    remove_wishlist_item,
})(Home);;
