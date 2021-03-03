import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../actions/alert';
import {
    remove_item,
    update_item,
    get_items,
    get_item_total,
    get_total
} from '../actions/cart';
import CartItem from '../components/CartItem';

const Cart = ({
    isAuthenticated,
    items,
    amount,
    compare_amount,
    total_items,
    remove_item,
    update_item,
    get_items,
    get_item_total,
    get_total
}) => {
    const [render, setRender] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);

        get_items();
        get_item_total();
        get_total();
    }, [render]);

    const showItems = () => {
        return (
            <div>
                <h4 className='text-muted mt-3'>
                    Your cart has {total_items} item(s)
                </h4>
                <hr />
                {
                    items && 
                    items !== null && 
                    items !== undefined && 
                    items.length !== 0 && 
                    items.map((item, index) => {
                        let count = item.count;

                        return (
                            <div key={index}>
                                <CartItem
                                    item={item}
                                    count={count}
                                    update_item={update_item}
                                    remove_item={remove_item}
                                    setAlert={setAlert}
                                    render={render}
                                    setRender={setRender}
                                />
                            </div>
                        );
                    })
                }
            </div>
        );
    };

    const checkoutButton = () => {
        if (total_items < 1) {
            return (
                <Link 
                    className='btn btn-warning mt-5'
                    style={{ width: '100%' }}
                    to='/shop'
                >
                    Shop for some Items!
                </Link>
            );
        }
        else if (!isAuthenticated) {
            return (
                <Link 
                    className='btn btn-warning mt-5'
                    style={{ width: '100%' }}
                    to='/login'
                >
                    Login to proceed
                </Link>
            );
        }
        else {
            return (
                <Link 
                    className='btn btn-success mt-5'
                    style={{ width: '100%' }}
                    to='/checkout'
                >
                    Proceed to Checkout
                </Link>
            );
        }
    };

    return (
        <div className='container mt-5'>
            <div className='row'>
                <div className='col-8'>
                    <h2>Your Items:</h2>
                    {showItems()}
                </div>
                <div className='col-4'>
                    <div className='card'>
                        <div className='card-body'>
                            <h2>Your total:</h2>
                            <p style={{ fontSize: '24px' }}>
                                {
                                    compare_amount !== 0 ? (
                                        <span
                                            className='mr-3 text-muted'
                                            style={{
                                                textDecoration: 'line-through'
                                            }}
                                        >
                                            ${compare_amount.toFixed(2)}
                                        </span>
                                    ) : (
                                        <Fragment></Fragment>
                                    )
                                }
                                {
                                    amount !== 0 ? (
                                        <span
                                            style={{
                                                color: '#b12704'
                                            }}
                                        >
                                            ${amount.toFixed(2)}
                                        </span>
                                    ) : (
                                        <Fragment></Fragment>
                                    )
                                }
                                {checkoutButton()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    items: state.cart.items,
    amount: state.cart.amount,
    compare_amount: state.cart.compare_amount,
    total_items: state.cart.total_items
});

export default connect(mapStateToProps, {
    remove_item,
    update_item,
    get_items,
    get_item_total,
    get_total,
    setAlert
})(Cart);
