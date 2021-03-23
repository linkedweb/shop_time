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
import {
    get_reviews,
    get_review,
    create_review,
    update_review,
    delete_review,
    filter_reviews
} from '../actions/reviews';
import Card from '../components/Card';
import ProductDetailCard from '../components/ProductDetailCard';
import LeaveReview from '../components/LeaveReview';
import Reviews from '../components/Reviews';
import Stars from '../components/Stars';

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
    review,
    reviews,
    get_reviews,
    get_review,
    create_review,
    update_review,
    delete_review,
    filter_reviews
}) => {
    const [loginRedirect, setLoginRedirect] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const [formData, setFormData] = useState({
        comment: ''
    });
    const [rating, setRating] = useState(5.0);

    const { comment } = formData;

    useEffect(() => {
        if (
            isAuthenticated !== null &&
            isAuthenticated !== undefined
        ) {
            if (
                isAuthenticated &&
                review &&
                review !== null &&
                review !== undefined &&
                review.comment &&
                review.comment !== null &&
                review.comment !== undefined
            ) {
                setFormData({
                    comment: review.comment
                });
            } else {
                setFormData({
                    comment: ''
                });
            }
        }
    }, [review, isAuthenticated]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const productId = match.params.id;

        get_product(productId);
        get_related_products(productId);
    }, [match.params.id]);

    useEffect(() => {
        const productId = match.params.id;

        get_reviews(productId);
    }, [match.params.id]);

    useEffect(() => {
        const productId = match.params.id;

        get_review(productId);
    }, [match.params.id, isAuthenticated]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const requireLogin = e => {
        e.preventDefault();

        setLoginRedirect(true);
    }

    const leaveReview = e => {
        e.preventDefault();

        const productId = match.params.id;

        if (rating !== null)
            create_review(productId, rating, comment);
    };

    const updateReview = e => {
        e.preventDefault();

        const productId = match.params.id;

        if (rating !== null)
            update_review(productId, rating, comment);
    };

    const deleteReview = () => {
        const productId = match.params.id;

        const fetchData = async () => {
            await delete_review(productId);
            await get_review(productId);
            setRating(5.0);
            setFormData({
                comment: ''
            });
        };

        fetchData();
    };

    const filterReviews = numStars => {
        const productId = match.params.id;

        filter_reviews(productId, numStars);
    };

    const getReviews = () => {
        const productId = match.params.id;

        get_reviews(productId);
    };

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

    const getLeaveReviewComponent = () => {
        if (isAuthenticated) {
            if (
                review &&
                review !== null &&
                review !== undefined &&
                Object.keys(review).length === 0
            ) {
                return (
                    <LeaveReview
                        review={review}
                        rating={rating}
                        setRating={setRating}
                        onSubmit={leaveReview}
                        onChange={onChange}
                        comment={comment}
                    />
                );
            }
            else if (
                review &&
                review !== null &&
                review !== undefined &&
                Object.keys(review).length !== 0
            ) {
                return (
                    <LeaveReview
                        review={review}
                        rating={rating}
                        setRating={setRating}
                        onSubmit={updateReview}
                        onChange={onChange}
                        comment={comment}
                        deleteReview={deleteReview}
                    />
                );
            }
        } else {
            return (
                <button
                    className='btn btn-warning'
                    onClick={requireLogin}
                >
                    Login to Leave a Review
                </button>
            );
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

            <section className='mt-5 mb-5'>
                <div className='row'>
                    <div className='col-3'>
                        <h2 className='mb-3'>Filter Reviews</h2>
                        <button
                            className='btn btn-primary btn-sm mb-3'
                            onClick={getReviews}
                        >
                            All
                        </button>
                        <div
                            className='mb-1'
                            style={{ cursor: 'pointer' }}
                            onClick={() => filterReviews(5)}
                        >
                            <Stars rating={5.0} />
                        </div>
                        <div
                            className='mb-1'
                            style={{ cursor: 'pointer' }}
                            onClick={() => filterReviews(4)}
                        >
                            <Stars rating={4.0} />
                        </div>
                        <div
                            className='mb-1'
                            style={{ cursor: 'pointer' }}
                            onClick={() => filterReviews(3)}
                        >
                            <Stars rating={3.0} />
                        </div>
                        <div
                            className='mb-1'
                            style={{ cursor: 'pointer' }}
                            onClick={() => filterReviews(2)}
                        >
                            <Stars rating={2.0} />
                        </div>
                        <div
                            className='mb-3'
                            style={{ cursor: 'pointer' }}
                            onClick={() => filterReviews(1)}
                        >
                            <Stars rating={1.0} />
                        </div>

                        <h2>Leave a Review:</h2>
                        <p className='mb-3'>
                            Share your thoughts with other customers
                        </p>
                        {getLeaveReviewComponent()}
                    </div>
                    <div className='col-7 offset-2'>
                        <h2 className='mb-5'>Customer Reviews</h2>
                        <Reviews reviews={reviews} />
                    </div>
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
    review: state.reviews.review,
    reviews: state.reviews.reviews
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
    get_reviews,
    get_review,
    create_review,
    update_review,
    delete_review,
    filter_reviews
})(ProductDetail);
