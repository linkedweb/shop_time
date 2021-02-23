import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { get_product, get_related_products } from '../actions/products';
import Card from '../components/Card';
import ProductDetailCard from '../components/ProductDetailCard';

const ProductDetail = ({ 
    match, 
    product, 
    get_product,
    related_products,
    get_related_products
}) => {
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
                    />
                </div>
            ))
        }
    };

    return (
        <div className='container mt-5'>
            <ProductDetailCard
                product={product}
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
    related_products: state.products.related_products
});

export default connect(mapStateToProps, {
    get_product,
    get_related_products
})(ProductDetail);