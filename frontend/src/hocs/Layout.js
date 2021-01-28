import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { check_authenticated, load_user, refresh } from '../actions/auth';
import Navbar from '../components/Navbar';

const Layout = ({ 
    check_authenticated,
    load_user,
    refresh,
    children
}) => {
    useEffect(() => {
        refresh();
        check_authenticated();
        load_user();
    }, []);

    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
}

export default connect(null, {
    check_authenticated,
    load_user,
    refresh
})(Layout);
