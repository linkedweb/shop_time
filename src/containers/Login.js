import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { login } from '../actions/auth';
import Loader from 'react-loader-spinner';

const Login = ({ login, isAuthenticated, loading }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    });

    const { 
        email,
        password
    } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        login(email, password);
    };

    const continue_with_google = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?redirect_uri=${process.env.REACT_APP_API_URL}/google`);

            window.location.replace(res.data.authorization_url);
        } catch (err) {

        }
    };

    const continue_with_facebook = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/facebook/?redirect_uri=${process.env.REACT_APP_API_URL}/facebook`);

            window.location.replace(res.data.authorization_url);
        } catch (err) {

        }
    };

    if (isAuthenticated)
        return <Redirect to='/dashboard' />;

    return (
        <div className='container mt-5'>
            <Helmet>
                <meta charSet='utf-8' />
                <meta name='description' content='Helmet application' />
                <title>Shop Time | Login</title>
                {/* <link rel='canonical' href='http://shoptime.com/activate' /> */}
            </Helmet>
            <h1>Sign In</h1>
            <p>Sign into your Account</p>
            <form onSubmit={e => onSubmit(e)}>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='email'
                        placeholder='Email*'
                        name='email'
                        value={email}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='password'
                        placeholder='Password*'
                        name='password'
                        value={password}
                        onChange={e => onChange(e)}
                        minLength='6'
                        required
                    />
                </div>
                {
                    loading ? (
                        <div className='mt-3 d-flex justify-content-center align-items-center'>
                            <Loader
                                type='Oval'
                                color='#424242'
                                height={50}
                                width={50}
                            />
                        </div>
                    ) : (
                        <button className='btn btn-primary' type='submit'>
                            Login
                        </button>
                    )
                }
            </form>
            <button className='btn btn-danger mt-3' onClick={continue_with_google}>
                Continue With Google
            </button>
            <br />
            <button className='btn btn-primary mt-3' onClick={continue_with_facebook}>
                Continue With Facebook
            </button>
            <p className='mt-3'>
                Don't have an account? <Link to='/signup'>Sign Up</Link>
            </p>
            <p className='mt-3'>
                Forgot your Password? <Link to='/reset_password'>Reset Password</Link>
            </p>
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading
});

export default connect(mapStateToProps, { login })(Login);
