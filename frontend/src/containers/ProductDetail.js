import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { 
    get_product, 
    get_related_products 
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
import Card from '../components/Card';
import ProductDetailCard from '../components/ProductDetailCard';

const ProductDetail = ({ 
    match, 
    product, 
    get_product,
    related_products,
    get_related_products,
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

    useEffect(() => {
        window.scrollTo(0, 0);
        const productId = match.params.id;

        get_product(productId);
        get_related_products(productId);
    }, [match.params.id]);

    const getRelatedProducts = () => {
        if (
            related_products &&
            related_products !== null && 
            related_products !== undefined &&
            related_products.length !== 0
        ) {
            return related_products.map((product, index) => (
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
    };

    if (loginRedirect)
        return <Redirect to='/login' />;
    if (redirect)
        return <Redirect to='/cart-or-continue-shopping' />;

    return (
        <div className='container mt-5'>
            <ProductDetailCard
                product={product}
                add_item={add_item}
                get_items={get_items}
                get_total={get_total}
                get_item_total={get_item_total}
                setRedirect={setRedirect}
                isAuthenticated={isAuthenticated}
                setLoginRedirect={setLoginRedirect}
                add_wishlist_item={add_wishlist_item}
                get_wishlist_items={get_wishlist_items}
                get_wishlist_item_total={get_wishlist_item_total}
            />

            <hr />

            <section className='mt-5'>
                <h2 className='mt-5'>Related Products:</h2>
                <div className='row mt-5 ml-5 mr-5'>
                    {getRelatedProducts()}
                </div>
            </section>
        </div>
    )
};

const mapStateToProps = state => ({
    product: state.products.product,
    related_products: state.products.related_products,
    wishlist: state.wishlist.items,
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
    get_product,
    get_related_products,
    add_item,
    get_items,
    get_total,
    get_item_total,
    get_wishlist_items,
    get_wishlist_item_total,
    add_wishlist_item,
    remove_wishlist_item,
})(ProductDetail);
