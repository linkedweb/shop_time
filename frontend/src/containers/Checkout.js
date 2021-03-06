import React, { Fragment, useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    refresh
} from '../actions/auth';
import {
    get_shipping_options
} from '../actions/shipping';
import {
    get_payment_total,
    get_client_token,
    process_payment
} from '../actions/payment';
import DropIn from 'braintree-web-drop-in-react';
import Loader from 'react-loader-spinner';
import CartItem from '../components/CartItem';
import ShippingForm from '../components/ShippingForm';
import { countries } from '../helpers/fixedCountries';

const Checkout = ({
    items,
    total_items,
    refresh,
    get_shipping_options,
    shipping,
    get_payment_total,
    get_client_token,
    process_payment,
    isAuthenticated,
    user,
    clientToken,
    made_payment,
    loading,
    original_price,
    total_amount,
    total_compare_amount,
    estimated_tax,
    shipping_cost
}) => {
    const [formData, setFormData] = useState({
        full_name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state_province_region: '',
        postal_zip_code: '',
        country_region: 'Canada',
        telephone_number: '',
        shipping_id: 0,
    });

    const [data, setData] = useState({
        instance: {}
    });

    const { 
        full_name,
        address_line_1,
        address_line_2,
        city,
        state_province_region,
        postal_zip_code,
        country_region,
        telephone_number,
        shipping_id,
    } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const buy = async e => {
        e.preventDefault();

        let nonce = await data.instance.requestPaymentMethod();

        process_payment(
            nonce,
            shipping_id,
            full_name,
            address_line_1,
            address_line_2,
            city,
            state_province_region,
            postal_zip_code,
            country_region,
            telephone_number
        );
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        refresh();
        get_shipping_options();
    }, []);

    useEffect(() => {
        get_client_token();
    }, [user]);

    useEffect(() => {
        get_payment_total(shipping_id);
    }, [shipping_id]);

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
                                    showViewProduct={false}
                                    showRemoveProduct={false}
                                    showUpdateProduct={false}
                                    showQuantity
                                />
                            </div>
                        );
                    })
                }
            </div>
        );
    };

    const renderShipping = () => {
        if (shipping && shipping !== null && shipping !== undefined) {
            return (
                <div className='mb-5'>
                    {
                        shipping.map((shipping_option, index) => (
                            <div key={index} className='form-check'>
                                <input
                                    className='form-check-input'
                                    onChange={e => onChange(e)}
                                    value={shipping_option.id}
                                    name='shipping_id'
                                    type='radio'
                                    required
                                />
                                <label className='form-check-label'>
                                    {shipping_option.name} - ${shipping_option.price} ({shipping_option.time_to_delivery})
                                </label>
                            </div>
                        ))
                    }
                </div>
            );
        }
    };

    const displayTotal = () => {
        let result = [];

        result.push(
            <Fragment>
                <span className='text-muted mr-3'>Items:</span>
                <span
                    className='mr-3 text-muted'
                    style={{
                        textDecoration: 'line-through'
                    }}
                >
                    ${total_compare_amount}
                </span>
            </Fragment>
        );

        // COUPONS

        result.push(
            <Fragment>
                <span
                    style={{
                        color: '#b12704'
                    }}
                >
                    ${original_price}
                </span>
            </Fragment>
        );

        // Display Shipping & Handling
        if (shipping && shipping_id !== 0) {
            result.push(
                <div className='mt-3'>
                    <span className='text-muted mr-3'>
                        Shipping &amp; Handling:
                    </span>
                    <span style={{ color: '#b12704' }}>
                        ${shipping_cost}
                    </span>
                </div>
            );
        } else {
            result.push(
                <div className='mt-3'>
                    <span className='text-muted mr-3'>
                        Shipping &amp; Handling:
                    </span>
                    <span style={{ color: '#b12704' }}>
                        (Please select shipping option)
                    </span>
                </div>
            );
        }

        // Display Estimated Tax
        result.push(
            <div className='mt-3'>
                <span className='text-muted mr-3'>
                    Estimated HST:
                </span>
                <span style={{ color: '#b12704' }}>
                    ${estimated_tax}
                </span>
            </div>
        );

        // Display the Total Cost
        result.push(
            <div className='mt-3' style={{ color: '#b12704' }}>
                <span className='text-muted mr-3'>
                    Order Total:
                </span>
                <span>${total_amount}</span>
            </div>
        );

        return result;
    };

    const renderPaymentInfo = () => {
        if (!clientToken) {
            if (!isAuthenticated) {
                return (
                    <Link
                        className='btn btn-warning mt-5'
                        style={{ width: '100%' }}
                        to='/login'
                    >
                        Login to Proceed
                    </Link>
                );
            } else {
                return (
                    <div className='mt-5 d-flex justify-content-center align-items-center'>
                        <Loader
                            type='Oval'
                            color='#424242'
                            height={50}
                            width={50}
                        />
                    </div>
                );
            }
        } else {
            return (
                <Fragment>
                    <DropIn
                        options={{
                            authorization: clientToken,
                            paypal: {
                                flow: 'vault'
                            }
                        }}
                        onInstance={instance => (data.instance = instance)}
                    />
                    {
                        loading ? (
                            <div className='d-flex justify-content-center align-items-center'>
                                <Loader
                                    type='Oval'
                                    color='#424242'
                                    height={50}
                                    widht={50}
                                />
                            </div>
                        ) : (
                            <button
                                className='btn btn-success'
                                style={{
                                    width: '100%'
                                }}
                                type='submit'
                            >
                                Place Order
                            </button>
                        )
                    }
                </Fragment>
            );
        }
    };

    if (made_payment)
        return <Redirect to='/thankyou' />;

    return (
        <div className='container mt-5 mb-5'>
            <div className='row'>
                <div className='col-7'>
                    {showItems()}
                </div>
                <div className='col-5'>
                    <h2 className='mb-3'>Order Summary</h2>
                    <div style={{ fontSize: '18px' }}>
                        {displayTotal()}
                    </div>
                    <ShippingForm
                        full_name={full_name}
                        address_line_1={address_line_1}
                        address_line_2={address_line_2}
                        city={city}
                        state_province_region={state_province_region}
                        postal_zip_code={postal_zip_code}
                        country_region={country_region}
                        telephone_number={telephone_number}
                        countries={countries}
                        onChange={onChange}
                        buy={buy}
                        renderShipping={renderShipping}
                        renderPaymentInfo={renderPaymentInfo}
                    />
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    items: state.cart.items,
    total_items: state.cart.total_items,
    shipping: state.shipping.shipping,
    clientToken: state.payment.clientToken,
    made_payment: state.payment.made_payment,
    loading: state.payment.loading,
    original_price: state.payment.original_price,
    total_amount: state.payment.total_amount,
    total_compare_amount: state.payment.total_compare_amount,
    estimated_tax: state.payment.estimated_tax,
    shipping_cost: state.payment.shipping_cost
});

export default connect(mapStateToProps, {
    refresh,
    get_shipping_options,
    get_payment_total,
    get_client_token,
    process_payment
})(Checkout);
