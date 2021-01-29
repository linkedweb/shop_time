import { combineReducers } from 'redux';
import auth from './auth';
import alert from './alert';
import categories from './categories';

export default combineReducers({
    auth,
    alert,
    categories
});
