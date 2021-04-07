import axios from 'axios';
import { made_stripe_payment } from './payment';
import { setAlert } from './alert';
import {
    GET_ORDERS_SUCCESS,
    GET_ORDERS_FAIL,
    GET_ORDER_DETAIL_SUCCESS,
    GET_ORDER_DETAIL_FAIL,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAIL,
    SET_ORDERS_LOADING,
    REMOVE_ORDERS_LOADING,
} from './types';

export const list_orders = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/order/get-orders`, config);

            if (res.status === 200) {
                dispatch({
                    type: GET_ORDERS_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: GET_ORDERS_FAIL
                });
            }
        } catch(err) {
            dispatch({
                type: GET_ORDERS_FAIL
            });
        }
    }
};

export const get_order_detail = transactionId => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/order/get-order/${transactionId}`, config);

            if (res.status === 200) {
                dispatch({
                    type: GET_ORDER_DETAIL_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: GET_ORDER_DETAIL_FAIL
                });
            }
        } catch(err) {
            dispatch({
                type: GET_ORDER_DETAIL_FAIL
            });
        }
    }
};

export const create_order = (
    shipping_id,
    full_name,
    address_line_1,
    address_line_2,
    city,
    state_province_region,
    postal_zip_code,
    country_region,
    telephone_number,
) => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };

        const body = JSON.stringify({
            shipping_id,
            full_name,
            address_line_1,
            address_line_2,
            city,
            state_province_region,
            postal_zip_code,
            country_region,
            telephone_number,
        });

        dispatch({
            type: SET_ORDERS_LOADING
        });

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/order/create-order`,
                body,
                config    
            );

            if (res.status === 200) {
                dispatch({
                    type: CREATE_ORDER_SUCCESS
                });
                dispatch(made_stripe_payment());
                dispatch(setAlert(res.data.success, 'success'));
            } else {
                dispatch({
                    type: CREATE_ORDER_FAIL
                });
                dispatch(setAlert(res.data.error, 'danger'));
            }
        } catch(err) {
            dispatch({
                type: CREATE_ORDER_FAIL
            });
            dispatch(setAlert('Failed to create order', 'danger'));
        }

        dispatch({
            type: REMOVE_ORDERS_LOADING
        });

        window.scrollTo(0, 0);
    }
};
