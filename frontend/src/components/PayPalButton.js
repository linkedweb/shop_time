import React, { useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import scriptLoader from 'react-async-script-loader';
import Loader from 'react-loader-spinner';

const CLIENT = {
    sandbox: 'AVzuK9kdVOEHLy4m8_XhG77b1DjemFgQEsYCvDLHX8PVY3RZOA6JNLZ3Qs-FxwvQYbaxrOTJZre7r-mL',
    production: 'your_production_key'
};

const CLIENT_ID = process.env.REACT_APP_PAYPAL_ENVIRONMENT === 'production' ? CLIENT.production : CLIENT.sandbox;

let PaypalButton = null;

const PayPalButton = ({
    isScriptLoaded,
    isScriptLoadSucceed,
    shipping_id,
    coupon_name,
    full_name,
    address_line_1,
    address_line_2,
    city,
    state_province_region,
    postal_zip_code,
    country_region,
    telephone_number,
    made_paypal_payment,
    setAlert,
}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isScriptLoaded && isScriptLoadSucceed && shipping_id !== 0) {
            PaypalButton = window.paypal.Buttons.driver('react', { React, ReactDOM });
            setLoading(false);
        }
    }, [isScriptLoaded, isScriptLoadSucceed, shipping_id]);

    const createOrder = async (data, actions) =>{
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };

        const body = JSON.stringify({
            shipping_id,
            coupon_name,
        });

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/paypal/create-order`,
                body,
                config
            );

            if (res.status === 200 && !res.data.error) {
                return res.data.paymentId;
            }
        } catch(err) {

        }
    };

    const onApprove = async (data, actions) => {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };

        const approve_order_id = data.orderID;

        const body = JSON.stringify({
            approve_order_id,
            shipping_id,
            coupon_name,
            full_name,
            address_line_1,
            address_line_2,
            city,
            state_province_region,
            postal_zip_code,
            country_region,
            telephone_number,
        });

        setLoading(true);

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/paypal/approve-order`,
                body,
                config
            );

            if (res.status === 200 && !res.data.error) {
                made_paypal_payment();
                setAlert(res.data.success, 'success');
            } else {
                setAlert(res.data.error, 'danger');
            }
        } catch(err) {
            setAlert('Failed to make PayPal transaction', 'danger');
        }

        setLoading(false);

        window.scrollTo(0, 0);
    };

    return (
        <div>
            {
                loading ? (
                    <div className='d-flex justify-content-center align-items-center'>
                        <Loader
                            type='Oval'
                            color='#424242'
                            height={50}
                            width={50}
                        />
                    </div>
                ) : (
                    <PaypalButton
                        createOrder={(data, actions) => createOrder(data, actions)}
                        onApprove={(data, actions) => onApprove(data, actions)}
                    />
                )
            }
        </div>
    );
};

export default scriptLoader(`https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=CAD`)(PayPalButton);
