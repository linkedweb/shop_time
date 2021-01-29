import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { get_categories } from '../actions/categories';

const Shop = ({
    categories,
    get_categories
}) => {
    const [formData, setFormData] = useState({
        category_id: '0',
    });

    const { category_id } = formData;

    useEffect(() => {
        get_categories();
        window.scrollTo(0, 0);
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        window.scrollTo(0, 0);
    };

    return (
        <div className='container'>
            <div className='jumbotron mt-5'>
                <h1 className='display-4'>Shop Page</h1>
                <p className='lead'>
                    Check out our amazing selection of products!
                </p>
            </div>
            <div className='row'>
                <div className='col-2'>
                    <form className='mb-5'>
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

                        <button className='btn btn-success mt-3'>
                            Update
                        </button>
                    </form>
                </div>
                <div className='col-10'>
                    Products
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    categories: state.categories.categories
});

export default connect(mapStateToProps, {
    get_categories
})(Shop);
