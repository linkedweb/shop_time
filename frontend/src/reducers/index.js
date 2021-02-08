import { combineReducers } from 'redux';
import auth from './auth';
import alert from './alert';
import categories from './categories';
import products from './products';

export default combineReducers({
    auth,
    alert,
    categories,
    products
});
