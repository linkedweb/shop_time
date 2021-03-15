import React from 'react';

const shippingForm = ({
    full_name,
    address_line_1,
    address_line_2,
    city,
    state_province_region,
    postal_zip_code,
    telephone_number,
    countries,
    onChange,
    buy,
    renderShipping,
    renderPaymentInfo,
    user,
    profile
}) => (
    <form className='mt-5' onSubmit={e => buy(e)}>
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
        {renderPaymentInfo()}
    </form>
);

export default shippingForm;
