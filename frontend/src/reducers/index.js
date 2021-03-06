import { combineReducers } from 'redux';
import auth from './auth';
import alert from './alert';
import cart from './cart';
import categories from './categories';
import payment from './payment';
import products from './products';
import shipping from './shipping';

export default combineReducers({
    auth,
    alert,
    cart,
    categories,
    payment,
    products,
    shipping,
});
