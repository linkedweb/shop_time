import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { check_authenticated, load_user, refresh } from '../actions/auth';
import Navbar from '../components/Navbar';

const Layout = ({ 
    check_authenticated,
    load_user,
    refresh,
    children
}) => {
    const [searchRedirect, setSearchRedirect] = useState(false);

    useEffect(() => {
        refresh();
        check_authenticated();
        load_user();
    }, []);

    if (searchRedirect) {
        return (
            <div>
                <Navbar
                    searchRedirect={searchRedirect}
                    setSearchRedirect={setSearchRedirect}
                />
                <Redirect to='/search' />
            </div>
        );
    }

    return (
        <div>
            <Navbar
                searchRedirect={searchRedirect}
                setSearchRedirect={setSearchRedirect}
            />
            {children}
        </div>
    );
}

export default connect(null, {
    check_authenticated,
    load_user,
    refresh
})(Layout);