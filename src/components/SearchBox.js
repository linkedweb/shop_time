import React from 'react';

const searchBox = ({
    search,
    onChange,
    onSubmit,
    categories
}) => (
    <form className='ml-3 mr-3' onSubmit={e => onSubmit(e)}>
        <span className='input-group-text'>
            <span>
                <div className='input-group'>
                    <div className='input-group-prepend'>
                        <select
                            style={{ 
                                backgroundColor: '#f8f9fa', 
                                borderRadius: '25px' 
                            }}
                            onChange={e => onChange(e)}
                            name='category_id'
                            className='btn mr-l'
                        >
                            <option value={0}>All</option>
                            {
                                categories && 
                                categories !== null &&
                                categories !== undefined &&
                                categories.map((category, index) => (
                                    <option key={index} value={category.id}>
                                        {category.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <input
                        type='search'
                        name='search'
                        style={{ borderRadius: '25px' }}
                        className='form-control ml-2'
                        onChange={e => onChange(e)}
                        value={search}
                        placeholder='Search for proudcts'
                    />
                </div>
            </span>
            <span>
                <button
                    style={{ backgroundColor: '#f8f9fa', border: 'none' }}
                    className='btn input-group-append input-group-text ml-2'
                >
                    Search
                </button>
            </span>
        </span>
    </form>
);

export default searchBox
