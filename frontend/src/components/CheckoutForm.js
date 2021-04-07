import React, { useState, useEffect } from 'react';
import {
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import Loader from 'react-loader-spinner';

const CheckoutForm = ({
    shipping_id,
    full_name,
    address_line_1,
    address_line_2,
    city,
    state_province_region,
    postal_zip_code,
    country_region,
    telephone_number,
    countries,
    onChange,
    renderShipping,
    user,
    profile,
    create_order,
    clientSecret,
    loading,
}) => {
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState('');
    const [disabled, setDisabled] = useState(true);
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        if (succeeded && !processing) {
            create_order(
                shipping_id,
                full_name,
                address_line_1,
                address_line_2,
                city,
                state_province_region,
                postal_zip_code,
                country_region,
                telephone_number,
            );
        }
    }, [succeeded]);

    const cardStyle = {
        style: {
        base: {
            color: '#32325d',
            fontFamily: 'Arial, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
            color: '#32325d'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
        }
    };

    const handleChange = async (event) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : '');
    };

    const handleSubmit = async ev => {
        ev.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        });

        if (payload.error) {
            setError(`Payment failed ${payload.error.message}`);
            setProcessing(false);
        } else {
            setError(null);
            setProcessing(false);
            setSucceeded(true);
        }
    };

    return (
        <form id='payment-form' onSubmit={handleSubmit}>
            <h4 className='text-muted mb-3'>
                Select Shipping Option:
            </h4>
            {renderShipping()}
            <h5>Shipping Address:</h5>
            <div className='form-group'>
                <label htmlFor='full_name'>Full Name*</label>
                <input
                    className='form-control'
                    type='text'
                    name='full_name'
                    placeholder={`${user.first_name} ${user.last_name}`}
                    onChange={e => onChange(e)}
                    value={full_name}
                    required
                />
            </div>
            <div className='form-group'>
                <label htmlFor='address_line_1'>Address Line 1*</label>
                <input
                    className='form-control'
                    type='text'
                    name='address_line_1'
                    placeholder={`${profile.address_line_1}`}
                    onChange={e => onChange(e)}
                    value={address_line_1}
                    required
                />
            </div>
            <div className='form-group'>
                <label htmlFor='address_line_2'>Address Line 2</label>
                <input
                    className='form-control'
                    type='text'
                    name='address_line_2'
                    placeholder={`${profile.address_line_2}`}
                    onChange={e => onChange(e)}
                    value={address_line_2}
                />
            </div>
            <div className='form-group'>
                <label htmlFor='city'>City*</label>
                <input
                    className='form-control'
                    type='text'
                    name='city'
                    placeholder={`${profile.city}`}
                    onChange={e => onChange(e)}
                    value={city}
                    required
                />
            </div>
            <div className='form-group'>
                <label htmlFor='state_province_region'>State/Province/Region*</label>
                <input
                    className='form-control'
                    type='text'
                    name='state_province_region'
                    placeholder={`${profile.state_province_region}`}
                    onChange={e => onChange(e)}
                    value={state_province_region}
                    required
                />
            </div>
            <div className='form-group'>
                <label htmlFor='postal_zip_code'>Postal/Zip Code*</label>
                <input
                    className='form-control'
                    type='text'
                    name='postal_zip_code'
                    placeholder={`${profile.zipcode}`}
                    onChange={e => onChange(e)}
                    value={postal_zip_code}
                    required
                />
            </div>
            <div className='form-group'>
                <label htmlFor='country_region'>Country/Region*</label>
                <select
                    className='form-control'
                    id='country_region'
                    name='country_region'
                    onChange={e => onChange(e)}
                >
                    <option value={`${profile.country_region}`}>{profile.country_region}</option>
                    {
                        countries && 
                        countries !== null &&
                        countries !== undefined &&
                        countries.map((country, index) => (
                            <option key={index} value={country.name}>
                                {country.name}
                            </option>
                        ))
                    }
                </select>
            </div>
            <div className='form-group'>
                <label htmlFor='telephone_number'>Phone Number*</label>
                <input
                    className='form-control'
                    type='tel'
                    name='telephone_number'
                    placeholder={`${profile.phone}`}
                    onChange={e => onChange(e)}
                    value={telephone_number}
                    required
                />
            </div>
            <div className='card mt-5 mb-3'>
                <div className='card-body'>
                    <CardElement 
                        id='card-element' 
                        options={cardStyle} 
                        onChange={handleChange} 
                    />
                </div>
            </div>
            {
                processing || loading ? (
                    <div className='d-flex justify-content-center align-items-center'>
                        <Loader
                            type='Oval'
                            color='#424242'
                            height={50}
                            width={50}
                        />
                    </div>
                ) : (
                    <button
                        className='btn btn-success mt-3'
                        disabled={processing || disabled || succeeded}
                        id='submit'
                    >
                        <span id='button-text'>
                            Place Order
                        </span>
                    </button>
                )
            }
            
            {/* Show any error that happens when processing the payment */}
            {
                error && (
                    <div className='card-error' role='alert'>
                        {error}
                    </div>
                )
            }
        </form>
    );
};

export default CheckoutForm;
