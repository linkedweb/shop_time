import { combineReducers } from 'redux';
import auth from './auth';
import alert from './alert';
import cart from './cart';
import categories from './categories';
import products from './products';
import shipping from './shipping';

export default combineReducers({
    auth,
    alert,
    cart,
    categories,
    products,
    shipping,
});
