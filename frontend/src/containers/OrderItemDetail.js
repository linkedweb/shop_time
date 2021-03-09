import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { get_order_detail } from '../actions/orders';
import moment from 'moment';

const OrderItemDetail = ({
    match,
    get_order_detail,
    order,
}) => {
    useEffect(() => {
        const transaction_id = match.params.transaction_id;

        get_order_detail(transaction_id);
    }, [match.params.transaction_id]);

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

    return (
        <div className='container mt-3'>
            <h1 className='mb-5'>
                Order Details
            </h1>
            <Link 
                className='btn btn-primary mb-5'
                to='/dashboard'
            >
                Back to Dashboard
            </Link>
            <div className='card mb-5'>
                <h3 className='card-header'>
                    Full Order Purchase Details
                </h3>
                <div className='card-body'>
                    {
                        order &&
                        order !== null && 
                        order !== undefined && 
                        (
                            <ul className='list-group mb-3'>
                                <div>
                                    <h3
                                        className='text-muted mb-3'
                                        style={{ fontSize: '18px' }}
                                    >
                                        Order Status: {showStatus(order.status)}
                                    </h3>
                                    <h3
                                        className='text-muted mb-3'
                                        style={{ fontSize: '18px' }}
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
                                        style={{ fontSize: '18px' }}
                                    >
                                        Shipping Address:
                                    </h3>
                                    <ul className='list-group mb-3'>
                                        <li className='list-group-item'>
                                            Address Line 1: {order.address_line_1}
                                        </li>
                                        <li className='list-group-item'>
                                            Address Line 2: {order.address_line_2}
                                        </li>
                                        <li className='list-group-item'>
                                            City: {order.city}
                                        </li>
                                        <li className='list-group-item'>
                                            State/Province/Region: {order.state_province_region}
                                        </li>
                                        <li className='list-group-item'>
                                            Postal/Zip Code: {order.postal_zip_code}
                                        </li>
                                        <li className='list-group-item'>
                                            Country/Region: {order.country_region}
                                        </li>
                                    </ul>
                                    <h3
                                        className='text-muted mb-3'
                                        style={{ fontSize: '18px' }}
                                    >
                                        Additional Info:
                                    </h3>
                                    <ul className='list-group mb-3'>
                                        <li className='list-group-item'>
                                            Shipping Name: {order.shipping_name}
                                        </li>
                                        <li className='list-group-item'>
                                            Shipping Price: ${order.shipping_price.toFixed(2)}
                                        </li>
                                        <li className='list-group-item'>
                                            Estimated Shipping Time: {order.shipping_time}
                                        </li>
                                        <li className='list-group-item'>
                                            Telephone Number: {order.telephone_number}
                                        </li>
                                        <li className='list-group-item'>
                                            Order Created: {moment(order.date_issued).fromNow()}
                                        </li>
                                    </ul>
                                    <h3
                                        style={{ 
                                            color: '#b12704',
                                            fontSize: '18px' 
                                        }}
                                    >
                                        Order Items:
                                    </h3>
                                    {
                                        order.order_items.map((order_item, index) => (
                                            <div key={index}>
                                                <h3
                                                    className='text-muted'
                                                    style={{ fontSize: '18px' }}
                                                >
                                                    Item {index + 1}
                                                </h3>
                                                <ul className='list-group mb-3'>
                                                    <li className='list-group-item'>
                                                        Item Name: {order_item.name}
                                                    </li>
                                                    <li className='list-group-item'>
                                                        Item Price: ${order_item.price.toFixed(2)}
                                                    </li>
                                                    <li className='list-group-item'>
                                                        Item Count: {order_item.count}
                                                    </li>
                                                </ul>
                                            </div>
                                        ))
                                    }
                                </div>
                            </ul>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    order: state.orders.order,
});

export default connect(mapStateToProps, {
    get_order_detail,
})(OrderItemDetail);
