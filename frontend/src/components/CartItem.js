import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const CartItem = ({
    item,
    count,
    update_item,
    remove_item,
    setAlert,
    render,
    setRender,
    showViewProduct = true,
    showRemoveProduct = true,
    showUpdateProduct = true,
    showQuantity = false
}) => {
    const [formData, setFormData] = useState({
        item_count: 1
    });

    const { item_count } = formData;

    useEffect(() => {
        if (count)
            setFormData({ ...formData, item_count: count });
    }, [count]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        const fetchData = async () => {
            try {
                if (item.product.quantity >= item_count) {
                    await update_item(item, item_count);
                }
                else {
                    setAlert('Not enough in stock', 'danger');
                }
                setRender(!render);
            } catch(err) {

            }
        };

        fetchData();
    };

    const quantityOrdered = () => {
        if (showQuantity && count) {
            return (
                <p className='mt-3 text-muted'>
                    Quantity Requested: {count}
                </p>
            );
        }
    };

    const showAdjustQuantityButton = () => {
        if (showUpdateProduct) {
            return (
                <form onSubmit={e => onSubmit(e)}>
                    <div className='form-group'>
                        <label htmlFor='item_count'>Adjust Quantity</label>
                        <select 
                            className='form-control' 
                            name='item_count' 
                            onChange={e => onChange(e)}
                            value={item_count}
                        >
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                        </select>
                    </div>
                    <button 
                        className='btn btn-warning mb-3'
                        type='submit'
                    >
                        Update Quantity
                    </button>
                </form>
            );
        }
    };

    const showViewProductButton = () => {
        if (showViewProduct) {
            return (
                <Link to={`/product/${
                    item &&
                    item !== null &&
                    item !== undefined &&
                    item.product &&
                    item.product !== null &&
                    item.product !== undefined ? 
                    item.product.id : 0
                }`}>
                    <button 
                        id={`product_detail_${item.product.id}`} 
                        className='btn btn-outline-primary mt-2 mb-2 mr-2'
                    >
                        View Product
                    </button>
                </Link>
            );
        }
    };

    const removeItemHandler = async () => {
        await remove_item(item);
        setRender(!render);
    };

    const showRemoveProductButton = () => {
        if (showRemoveProduct) {
            return (
                <button
                    className='btn btn-outline-danger mt-2 mb-2'
                    onClick={removeItemHandler}
                >
                    Remove Product
                </button>
            );
        }
    };

    return (
        <div className='card mb-5' style={{ padding: '20px 30px' }}>
            <div className='row'>
                <div className='col-3'>
                    <div style={{ height: '180px', overflow: 'hidden' }}>
                        <img
                            className='card-img-top'
                            alt='Product Visual'
                            src={
                                item &&
                                item !== null &&
                                item !== undefined &&
                                item.product &&
                                item.product !== null &&
                                item.product !== undefined ?
                                item.product.photo : ''
                            }
                        />
                    </div>
                </div>
                <div className='col-6'>
                    <h6 className='card-title'>
                        {
                            item &&
                            item !== null &&
                            item !== undefined &&
                            item.product &&
                            item.product !== null &&
                            item.product !== undefined &&
                            item.product.name
                        }
                    </h6>
                    <p className='card-text mt-3'>
                        {
                            item &&
                            item !== null &&
                            item !== undefined &&
                            item.product &&
                            item.product !== null &&
                            item.product !== undefined &&
                            item.product.description.substring(0, 100)
                        }...
                    </p>
                    {quantityOrdered()}
                    {showAdjustQuantityButton()}
                    {showViewProductButton()}
                    {showRemoveProductButton()}
                </div>
                <div className='col-3'>
                    <p className='card-text text-muted'>
                        Price:
                    </p>
                    <p>
                        <span
                            className='mr-2 text-muted'
                            style={{ textDecoration: 'line-through', fontSize: '16px' }}
                        >
                            ${
                                item &&
                                item !== null &&
                                item !== undefined &&
                                item.product &&
                                item.product !== null &&
                                item.product !== undefined &&
                                item.product.compare_price
                            }
                        </span>
                        <span
                            style={{ fontSize: '18px', color: '#b12704' }}
                        >
                            ${
                                item &&
                                item !== null &&
                                item !== undefined &&
                                item.product &&
                                item.product !== null &&
                                item.product !== undefined &&
                                item.product.price
                            }
                        </span>
                    </p>
                    <p className='card-text text-muted mt-5'>
                        {
                            item &&
                            item !== null &&
                            item !== undefined &&
                            item.product &&
                            item.product !== null &&
                            item.product !== undefined &&
                            item.product.quantity > 0 ? (
                                <span className='text-success'>
                                    In Stock
                                </span>
                            ) : (
                                <span className='text-danger'>
                                    Out of Stock
                                </span>
                            )
                        }
                    </p>
                    <p className='card-text text-muted'>
                        Added {
                            moment(
                                item &&
                                item !== null &&
                                item !== undefined &&
                                item.product &&
                                item.product !== null &&
                                item.product !== undefined ? (
                                    item.product.date_created
                                ) : (
                                    ''
                                )
                            ).fromNow()
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
