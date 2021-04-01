import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { 
    get_products, 
    get_filtered_products 
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
import { get_categories } from '../actions/categories';
import Card from '../components/Card';
import ShopForm from '../components/ShopForm';

const Shop = ({
    categories,
    get_categories,
    products,
    get_products,
    filtered_products,
    get_filtered_products,
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
    const [filtered, setFiltered] = useState(false);
    const [formData, setFormData] = useState({
        category_id: '0',
        price_range: 'Any',
        sortBy: 'date_created',
        order: 'desc'
    });

    const { 
        category_id, 
        price_range,
        sortBy,
        order
    } = formData;

    useEffect(() => {
        get_categories();
        get_products();
        window.scrollTo(0, 0);
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        window.scrollTo(0, 0);

        get_filtered_products(category_id, price_range, sortBy, order);
        setFiltered(true);
    };

    const showProducts = () => {
        let results = [];
        let display = [];

        if (
            filtered_products &&
            filtered_products !== null &&
            filtered_products !== undefined &&
            filtered
        ) {
            filtered_products.map((product, index) => {
                return display.push(
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
                );
            });
        } else if (
            !filtered && 
            products &&
            products !== null && 
            products !== undefined
        ) {
            products.map((product, index) => {
                return display.push(
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
                );
            });
        }

        for (let i = 0; i < display.length; i += 3) {
            results.push(
                <div key={i} className='row'>
                    {display[i] ? display[i] : <div className='col-4'></div>}
                    {display[i+1] ? display[i+1] : <div className='col-4'></div>}
                    {display[i+2] ? display[i+2] : <div className='col-4'></div>}
                </div>
            );
        }

        return results;
    };

    if (loginRedirect)
        return <Redirect to='/login' />;
    if (redirect)
        return <Redirect to='/cart-or-continue-shopping' />;

    return (
        <div className='container'>
            <Helmet>
                <meta charSet='utf-8' />
                <meta name='description' content='Helmet application' />
                <title>Shop Time | Shop</title>
                {/* <link rel='canonical' href='http://shoptime.com/activate' /> */}
            </Helmet>
            <div className='jumbotron mt-5'>
                <h1 className='display-4'>Shop Page</h1>
                <p className='lead'>
                    Check out our amazing selection of products!
                </p>
            </div>
            <div className='row'>
                <div className='col-2'>
                    <ShopForm
                        onChange={onChange}
                        onSubmit={onSubmit}
                        categories={categories}
                        sortBy={sortBy}
                        order={order}
                    />
                </div>
                <div className='col-10'>
                    {showProducts()}
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    categories: state.categories.categories,
    products: state.products.products,
    filtered_products: state.products.filtered_products,
    wishlist: state.wishlist.items,
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
    get_categories,
    get_products,
    get_filtered_products,
    add_item,
    get_items,
    get_total,
    get_item_total,
    get_wishlist_items,
    get_wishlist_item_total,
    add_wishlist_item,
    remove_wishlist_item,
})(Shop);