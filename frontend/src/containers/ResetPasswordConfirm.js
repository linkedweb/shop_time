import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { reset_password_confirm } from '../actions/auth';
import Loader from 'react-loader-spinner';

const ResetPasswordConfirm = ({ match, loading, reset_password_confirm }) => {
    const [requestSent, setRequestSent] = useState(false);
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    });

    const { new_password, re_new_password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        const uid = match.params.uid;
        const token = match.params.token;

        reset_password_confirm(uid, token, new_password, re_new_password);
        if (new_password === re_new_password)
            setRequestSent(true);
    };

    if (requestSent && !loading)
        return <Redirect to='/' />;

    return (
        <div className='container mt-5'>
            <h1 className='mb-5'>Reset Your Password:</h1>
            <form onSubmit={e => onSubmit(e)}>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='password'
                        placeholder='New Password'
                        name='new_password'
                        value={new_password}
                        onChange={e => onChange(e)}
                        minLength='6'
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='password'
                        placeholder='Confirm New Password'
                        name='re_new_password'
                        value={re_new_password}
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
                            Reset Password
                        </button>
                    )
                }
            </form>
        </div>
    );
};

const mapStateToProps = state => ({
    loading: state.auth.loading
});

export default connect(mapStateToProps, { reset_password_confirm })(ResetPasswordConfirm);
