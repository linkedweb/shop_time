import {
    GET_ORDERS_SUCCESS,
    GET_ORDERS_FAIL,
    GET_ORDER_DETAIL_SUCCESS,
    GET_ORDER_DETAIL_FAIL,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAIL,
    SET_ORDERS_LOADING,
    REMOVE_ORDERS_LOADING,
} from '../actions/types';

const initialState = {
    orders: null,
    order: null,
    loading: false
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case GET_ORDERS_SUCCESS:
            return {
                ...state,
                orders: payload.orders
            }
        case GET_ORDERS_FAIL:
            return {
                ...state,
                orders: []
            }
        case GET_ORDER_DETAIL_SUCCESS:
            return {
                ...state,
                order: payload.order
            }
        case GET_ORDER_DETAIL_FAIL:
            return {
                ...state,
                order: {}
            }
        case CREATE_ORDER_SUCCESS:
        case CREATE_ORDER_FAIL:
            return {
                ...state
            }
        case SET_ORDERS_LOADING:
            return {
                ...state,
                loading: true
            }
        case REMOVE_ORDERS_LOADING:
            return {
                ...state,
                loading: false
            }
        default:
            return state;
    }
};
