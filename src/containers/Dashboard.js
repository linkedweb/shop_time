import React, { Fragment, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    get_items,
    get_total,
    get_item_total,
} from '../actions/cart';
import { list_orders } from '../actions/orders';
import {
    get_user_profile,
    update_user_profile,
} from '../actions/profile';
import moment from 'moment';
import UserProfileForm from '../components/UserProfileForm';

const Dashboard = ({
    get_items,
    get_total,
    get_item_total,
    list_orders,
    orders,
    user,
    profile,
    get_user_profile,
    update_user_profile,
}) => {
    const [display, setDisplay] = useState('user_info');
    const [formData, setFormData] = useState({
        address_line_1: '',
        address_line_2: '',
        city: '',
        state_province_region: '',
        zipcode: '',
        phone: '',
        country_region: 'Canada'
    });

    const {
        address_line_1,
        address_line_2,
        city,
        state_province_region,
        zipcode,
        phone,
        country_region
    } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        update_user_profile(
            address_line_1,
            address_line_2,
            city,
            state_province_region,
            zipcode,
            phone,
            country_region
        );

        window.scrollTo(0, 0);
    };

    useEffect(() => {
        get_user_profile();
    }, []);

    useEffect(() => {
        if (user) {
            get_items();
            get_total();
            get_item_total();
            list_orders();
        }
    }, [user]);

    useEffect(() => {
        if (profile && profile !== null && profile !== undefined) {
            setFormData({
                address_line_1: profile.address_line_1,
                address_line_2: profile.address_line_2,
                city: profile.city,
                state_province_region: profile.state_province_region,
                zipcode: profile.zipcode,
                phone: profile.phone,
                country_region: profile.country_region
            });
        }
    }, [profile]);

    const showStatus = (status) => {
        if (status === 'not_processed') {
            return 'Not Processed';
        }
        else if (status === 'processed') {
            return 'Processed';
        }
        else if (status === 'shipping') {
            return 'Shipping';
        }
        else if (status === 'delivered') {
            return 'Delivered';
        }
        else if (status === 'cancelled') {
            return 'Cancelled';
        }
    };  

    const userInfo = () => {
        return (
            <div className='card mb-5'>
                <h3 className='card-header'>User Information</h3>
                <ul className='list-group'>
                    <li className='list-group-item'>
                        <strong>First Name: </strong>
                        {
                            user && 
                            user !== null &&
                            user !== undefined ?
                            user.first_name : <Fragment></Fragment>
                        }
                    </li>
                    <li className='list-group-item'>
                        <strong>Last Name: </strong>
                        {
                            user && 
                            user !== null &&
                            user !== undefined ?
                            user.last_name : <Fragment></Fragment>
                        }
                    </li>
                    <li className='list-group-item'>
                        <strong>Email: </strong>
                        {
                            user && 
                            user !== null &&
                            user !== undefined ?
                            user.email : <Fragment></Fragment>
                        }
                    </li>
                </ul>
            </div>
        );
    };

    const purchaseHistory = () => {
        return (
            <div className='card mb-5'>
                <h3 className='card-header'>
                    Purchase History
                </h3>
                <div className='card-body'>
                    {
                        orders &&
                        orders !== null && 
                        orders !== undefined &&
                        orders.map((order, index) => (
                            <div key={index}>
                                <h3
                                    className='mb-3'
                                    style={{
                                        color: '#b12704',
                                        fontSize: '24px'
                                    }}
                                >
                                    Order {index + 1}
                                </h3>
                                <ul className='list-group mb-3'>
                                    <li className='list-group-item'>
                                        <div>
                                            <h3
                                                className='text-muted mb-3'
                                                style={{
                                                    fontSize: '18px'
                                                }}
                                            >
                                                Order Status: {showStatus(order.status)}
                                            </h3>
                                            <h3
                                                className='text-muted mb-3'
                                                style={{
                                                    fontSize: '18px'
                                                }}
                                            >
                                                Order Details:
                                            </h3>
                                            <ul className='list-group mb-3'>
                                                <li className='list-group-item'>
                                                    Transaction ID: {order.transaction_id}
                                                </li>
                                                <li className='list-group-item'>
                                                    Total Cost of Order: ${order.amount.toFixed(2)}
                                                </li>
                                            </ul>
                                            <h3
                                                className='text-muted mb-3'
                                                style={{
                                                    fontSize: '18px'
                                                }}
                                            >
                                                Additional Info:
                                            </h3>
                                            <ul className='list-group mb-3'>
                                                <li className='list-group-item'>
                                                    Shipping Price: ${order.shipping_price.toFixed(2)}
                                                </li>
                                                <li className='list-group-item'>
                                                    Order Created: {moment(order.date_issued).fromNow()}
                                                </li>
                                            </ul>
                                        </div>
                                        <Link
                                            className='btn btn-info'
                                            to={`/dashboard/order-detail/${order.transaction_id}`}
                                        >
                                            Order Details
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    };

    const userProfile = () => {
        if (profile && profile !== null && profile !== undefined) {
            return (
                <UserProfileForm
                    address_line_1={address_line_1}
                    address_line_2={address_line_2}
                    city={city}
                    state_province_region={state_province_region}
                    zipcode={zipcode}
                    phone={phone}
                    country_region={country_region}
                    onChange={onChange}
                    onSubmit={onSubmit}
                    profile={profile}
                />
            );
        } else {
            return (
                <Fragment></Fragment>
            );
        }
    };

    const renderData = () => {
        if (display === 'user_info') {
            return (
                <Fragment>
                    {userInfo()}
                </Fragment>
            );
        }
        else if (display === 'profile_info') {
            return (
                <Fragment>
                    {userProfile()}
                </Fragment>
            )
        }
        else if (display === 'purchase_history') {
            return (
                <Fragment>
                    {purchaseHistory()}
                </Fragment>
            );
        }
    };

    return (
        <div className='container mt-5'>
            <Helmet>
                <meta charSet='utf-8' />
                <meta name='description' content='Helmet application' />
                <title>Shop Time | Dashboard</title>
                {/* <link rel='canonical' href='http://shoptime.com/activate' /> */}
            </Helmet>
            <div className='row'>
                <div className='col-3'>
                    <div className='card'>
                        <h3 className='card-header'>
                            Dashboard Links
                        </h3>
                        <ul className='list-group'>
                            <li 
                                className='list-group-item'
                                style={{ cursor: 'pointer' }}
                                onClick={() => setDisplay('user_info')}
                            >
                                {
                                    display === 'user_info' ? (
                                        <strong>User Info</strong>
                                    ) : (
                                        <Fragment>User Info</Fragment>
                                    )
                                }
                            </li>
                            <li 
                                className='list-group-item'
                                style={{ cursor: 'pointer' }}
                                onClick={() => setDisplay('profile_info')}
                            >
                                {
                                    display === 'profile_info' ? (
                                        <strong>User Profile</strong>
                                    ) : (
                                        <Fragment>User Profile</Fragment>
                                    )
                                }
                            </li>
                            <li 
                                className='list-group-item'
                                style={{ cursor: 'pointer' }}
                                onClick={() => setDisplay('purchase_history')}
                            >
                                {
                                    display === 'purchase_history' ? (
                                        <strong>Purchase History</strong>
                                    ) : (
                                        <Fragment>Purchase History</Fragment>
                                    )
                                }
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='col-9'>
                    {renderData()}
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    orders: state.orders.orders,
    user: state.auth.user,
    profile: state.profile.profile,
});

export default connect(mapStateToProps, {
    get_items,
    get_total,
    get_item_total,
    list_orders,
    get_user_profile,
    update_user_profile,
})(Dashboard);
