import React from 'react';
import { prices } from '../helpers/fixedPrices';

const shopForm = ({
    onChange,
    onSubmit,
    categories,
    sortBy,
    order
}) => (
    <form className='mb-5' onSubmit={e => onSubmit(e)}>
        <h5>Categories:</h5>

        <div className='form-check'>
            <input
                onChange={e => onChange(e)}
                value={'0'}
                name='category_id'
                type='radio'
                className='form-check-input'
                defaultChecked
            />
            <label className='form-check-label'>All</label>
        </div>
        {
            categories &&
            categories !== null &&
            categories !== undefined &&
            categories.map(category => {
                if (category.sub_categories.length === 0) {
                    return (
                        <div key={category.id} className='form-check'>
                            <input
                                onChange={e => onChange(e)}
                                value={category.id.toString()}
                                name='category_id'
                                type='radio'
                                className='form-check-input'
                            />
                            <label className='form-check-label'>
                                {category.name}
                            </label>
                        </div>
                    );
                } else {
                    let result = [];

                    result.push(
                        <div key={category.id} className='form-check'>
                            <input
                                onChange={e => onChange(e)}
                                value={category.id.toString()}
                                name='category_id'
                                type='radio'
                                className='form-check-input'
                            />
                            <label className='form-check-label'>
                                {category.name}
                            </label>
                        </div>
                    );

                    category.sub_categories.map(sub_category => {
                        result.push(
                            <div key={sub_category.id} className='form-check ml-2'>
                                <input
                                    onChange={e => onChange(e)}
                                    value={sub_category.id.toString()}
                                    name='category_id'
                                    type='radio'
                                    className='form-check-input'
                                />
                                <label className='form-check-label'>
                                    {sub_category.name}
                                </label>
                            </div>
                        );
                    });

                    return result;
                }
            })
        }

        <h5 className='mt-3'>Price Range:</h5>
        {
            prices && prices.map((price, index) => {
                if (price.id === 0) {
                    return (
                        <div key={index} className='form-check'>
                            <input
                                onChange={e => onChange(e)}
                                value={price.name}
                                name='price_range'
                                type='radio'
                                className='form-check-input'
                                defaultChecked
                            />
                            <label className='form-check-label'>{price.name}</label>
                        </div>
                    )
                } else {
                    return (
                        <div key={index} className='form-check'>
                            <input
                                onChange={e => onChange(e)}
                                value={price.name}
                                name='price_range'
                                type='radio'
                                className='form-check-input'
                            />
                            <label className='form-check-label'>{price.name}</label>
                        </div>
                    )
                }
            })
        }

        <h5 className='mt-3'>Additional Filters:</h5>
        <div className='form-group'>
            <label htmlFor='sortBy'>Sort By</label>
            <select
                className='form-control'
                id='sortBy'
                name='sortBy'
                onChange={e => onChange(e)}
                value={sortBy}
            >
                <option value='date_created'>Date Created</option>
                <option value='price'>Price</option>
                <option value='sold'>Sold</option>
                <option value='name'>Name</option>
            </select>
        </div>
        <div className='form-group'>
            <label htmlFor='order'>Order</label>
            <select
                className='form-control'
                id='order'
                name='order'
                onChange={e => onChange(e)}
                value={order}
            >
                <option value='desc'>Descending</option>
                <option value='asc'>Ascending</option>
            </select>
        </div>

        <button className='btn btn-success mt-3'>
            Update
        </button>
    </form>
);

export default shopForm;