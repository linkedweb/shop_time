import axios from 'axios';
import { setAlert } from './alert';
import { get_item_total } from './cart';
import {
    GET_PAYMENT_TOTAL_SUCCESS,
    GET_PAYMENT_TOTAL_FAIL,
    LOAD_BT_TOKEN_SUCCESS,
    LOAD_BT_TOKEN_FAIL,
    PAYMENT_SUCCESS,
    PAYMENT_FAIL,
    RESET_PAYMENT_INFO,
    SET_PAYMENT_LOADING,
    REMOVE_PAYMENT_LOADING,
    CREATE_STRIPE_PAYMENT_INTENT_SUCCESS,
    CREATE_STRIPE_PAYMENT_INTENT_FAIL,
    MADE_STRIPE_PAYMENT,
} from './types';

export const get_payment_total = (shipping_id, coupon_name) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/payment/get-payment-total?shipping_id=${shipping_id}&coupon_name=${coupon_name}`, config);

        if (res.status === 200 && !res.data.error) {
            dispatch({
                type: GET_PAYMENT_TOTAL_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_PAYMENT_TOTAL_FAIL
            });
        }
    } catch(err) {
        dispatch({
            type: GET_PAYMENT_TOTAL_FAIL
        });
    }
};

export const get_client_token = () => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/payment/get-token`, config);

        if (res.status === 200) {
            dispatch({
                type: LOAD_BT_TOKEN_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: LOAD_BT_TOKEN_FAIL
            });
        }
    } catch(err) {
        dispatch({
            type: LOAD_BT_TOKEN_FAIL
        });
    }
};

export const process_payment = (
    nonce,
    shipping_id,
    coupon_name,
    full_name,
    address_line_1,
    address_line_2,
    city,
    state_province_region,
    postal_zip_code,
    country_region,
    telephone_number
) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    const body = JSON.stringify({
        nonce,
        shipping_id,
        coupon_name,
        full_name,
        address_line_1,
        address_line_2,
        city,
        state_province_region,
        postal_zip_code,
        country_region,
        telephone_number
    });

    dispatch({
        type: SET_PAYMENT_LOADING
    });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/payment/make-payment`, body, config);

        if (res.status === 200 && res.data.success) {
            dispatch({
                type: PAYMENT_SUCCESS
            });
            dispatch(setAlert(res.data.success, 'success'));
            dispatch(get_item_total());
        } else {
            dispatch({
                type: PAYMENT_FAIL
            });
            dispatch(setAlert(res.data.error, 'danger'));
        }
    } catch(err) {
        dispatch({
            type: PAYMENT_FAIL
        });
        dispatch(setAlert('Error processing payment', 'danger'));
    }

    dispatch({
        type: REMOVE_PAYMENT_LOADING
    });
    window.scrollTo(0, 0);
};

export const reset = () => dispatch => {
    dispatch({
        type: RESET_PAYMENT_INFO
    });
};

export const create_stripe_payment_intent = (shipping_id, coupon_name) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    const body = JSON.stringify({
        shipping_id,
        coupon_name
    });

    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/stripe/create-payment-intent`,
            body,
            config
        );

        if (res.status === 200 && !res.data.error) {
            dispatch({
                type: CREATE_STRIPE_PAYMENT_INTENT_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: CREATE_STRIPE_PAYMENT_INTENT_FAIL
            });
        }
    } catch(err) {
        dispatch({
            type: CREATE_STRIPE_PAYMENT_INTENT_FAIL
        });
    }
};

export const made_stripe_payment = () => dispatch => {
    dispatch({
        type: MADE_STRIPE_PAYMENT
    });
};
