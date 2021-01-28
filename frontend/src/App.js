import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Layout from './hocs/Layout';
import Home from './containers/Home';
import Google from './containers/Google';
import Facebook from './containers/Facebook';
import Dashboard from './containers/Dashboard';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Activate from './containers/Activate';
import ResetPassword from './containers/ResetPassword';
import ResetPasswordConfirm from './containers/ResetPasswordConfirm';

import store from './store';

const App = () => (
    <Provider store={store}>
        <Router>
            <Layout>
                <Route exact path='/' component={Home} />
                <Route exact path='/dashboard' component={Dashboard} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/signup' component={Signup} />
                <Route exact path='/google' component={Google} />
                <Route exact path='/facebook' component={Facebook} />
                <Route exact path='/activate/:uid/:token' component={Activate} />
                <Route exact path='/reset_password' component={ResetPassword} />
                <Route exact path='/password/reset/confirm/:uid/:token' component={ResetPasswordConfirm} />
            </Layout>
        </Router>
    </Provider>
);

export default App;
