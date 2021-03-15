import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { 
    check_authenticated, 
    load_user, 
    refresh 
} from '../actions/auth';
import {
    get_items,
    get_total,
    get_item_total
} from '../actions/cart';
import {
    get_user_profile,
} from '../actions/profile';
import Navbar from '../components/Navbar';

const Layout = ({ 
    check_authenticated,
    load_user,
    get_user_profile,
    refresh,
    get_items,
    get_total,
    get_item_total,
    children
}) => {
    const [searchRedirect, setSearchRedirect] = useState(false);

    useEffect(() => {
        refresh();
        check_authenticated();
        load_user();
        get_user_profile();
        get_items();
        get_total();
        get_item_total();
    }, []);

    if (searchRedirect) {
        return (
            <div>
                <Navbar
                    setSearchRedirect={setSearchRedirect}
                />
                <Redirect to='/search' />
            </div>
        );
    }

    return (
        <div>
            <Navbar
                setSearchRedirect={setSearchRedirect}
            />
            {children}
        </div>
    );
}

export default connect(null, {
    check_authenticated,
    load_user,
    get_user_profile,
    refresh,
    get_items,
    get_total,
    get_item_total,
})(Layout);
