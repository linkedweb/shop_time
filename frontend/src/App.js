import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Layout from './hocs/Layout';
import Home from './containers/Home';
import Cart from './containers/Cart';
import Checkout from './containers/Checkout';
import GoToCart from './containers/GoToCart';
import Shop from './containers/Shop';
import Search from './containers/Search';
import ProductDetail from './containers/ProductDetail';
import Google from './containers/Google';
import Facebook from './containers/Facebook';
import Dashboard from './containers/Dashboard';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Activate from './containers/Activate';
import ResetPassword from './containers/ResetPassword';
import ResetPasswordConfirm from './containers/ResetPasswordConfirm';
import ThankYou from './containers/ThankYou';
import NotFound from './containers/NotFound';

import PrivateRoute from './hocs/PrivateRoute';

import store from './store';

const App = () => (
    <Provider store={store}>
        <Router>
            <Layout>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/shop' component={Shop} />
                    <Route exact path='/cart' component={Cart} />
                    <PrivateRoute exact path='/checkout' component={Checkout} />
                    <Route exact path='/cart-or-continue-shopping' component={GoToCart} />
                    <Route exact path='/search' component={Search} />
                    <Route exact path='/product/:id' component={ProductDetail} />
                    <Route exact path='/dashboard' component={Dashboard} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/signup' component={Signup} />
                    <Route exact path='/google' component={Google} />
                    <Route exact path='/facebook' component={Facebook} />
                    <Route exact path='/activate/:uid/:token' component={Activate} />
                    <Route exact path='/reset_password' component={ResetPassword} />
                    <Route exact path='/password/reset/confirm/:uid/:token' component={ResetPasswordConfirm} />
                    <PrivateRoute exact path='/thankyou' component={ThankYou} />
                    <Route component={NotFound} />
                </Switch>
            </Layout>
        </Router>
    </Provider>
);

export default App;