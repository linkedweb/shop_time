import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { logout } from '../actions/auth';
import { Link, NavLink } from 'react-router-dom';
import Alert from './Alert';

const Navbar = ({
    isAuthenticated,
    logout
}) => {
    const [redirect, setRedirect] = useState(false);

    const logoutHandler = () => {
        logout();
        setRedirect(true);
    };

    const authLinks = (
        <li className='nav-item'>
            <a 
                className='nav-link' 
                onClick={logoutHandler}
                href='#!'
            >
                Logout
            </a>
        </li>
    );

    const guestLinks = (
        <Fragment>
            <li className='nav-item'>
                <NavLink 
                    className='nav-link' 
                    to='/login'
                >
                    Login
                </NavLink>
            </li>
            <li className='nav-item'>
                <NavLink 
                    className='nav-link' 
                    to='/signup'
                >
                    Sign Up
                </NavLink>
            </li>
        </Fragment>
    );

    const getNavbar = () => (
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
            <Link className='navbar-brand' to='/'>Shop Time</Link>
            <button 
                className='navbar-toggler' 
                type='button' 
                data-toggle='collapse' 
                data-target='#navbarNav' 
                aria-controls='navbarNav' 
                aria-expanded='false' 
                aria-label='Toggle navigation'
            >
                <span className='navbar-toggler-icon'></span>
            </button>
            <div className='collapse navbar-collapse' id='navbarNav'>
                <ul className='navbar-nav'>
                    <li className='nav-item'>
                        <NavLink 
                            className='nav-link' 
                            exact
                            to='/'
                        >
                            Home
                        </NavLink>
                    </li>
                    <li className='nav-item'>
                        <NavLink 
                            className='nav-link' 
                            to='/shop'
                        >
                            Shop
                        </NavLink>
                    </li>
                    {
                        isAuthenticated ? authLinks : guestLinks
                    }
                </ul>
            </div>
        </nav>
    );

    const renderNavbar = () => {
        if (redirect) {
            return (
                <Fragment>
                    {getNavbar()}
                    <Alert />
                    <Redirect to='/' />
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    {getNavbar()}
                    <Alert />
                </Fragment>
            );
        }
    };

    return (
        <Fragment>
            {renderNavbar()}
        </Fragment>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {
    logout
})(Navbar);
