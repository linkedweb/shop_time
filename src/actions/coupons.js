import axios from 'axios';
import { setAlert } from './alert';
import {
    GET_COUPON_SUCCESS,
    GET_COUPON_FAIL,
} from './types';

export const check_coupon = coupon_name => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/coupon/check-coupon?coupon_name=${coupon_name}`, config);

        if (res.status === 200) {
            dispatch({
                type: GET_COUPON_SUCCESS,
                payload: res.data
            });
            dispatch(setAlert('Coupon applied', 'success'));
        } else {
            dispatch({
                type: GET_COUPON_FAIL
            });
            if (res.data.error) {
                dispatch(setAlert(res.data.error, 'danger'));
            } else {
                dispatch(setAlert('This coupon does not exist', 'danger'));
            }
        }
    } catch(err) {
        dispatch({
            type: GET_COUPON_FAIL
        });
        dispatch(setAlert('This coupon does not exist', 'danger'));
    }

    window.scrollTo(0, 0);
};
