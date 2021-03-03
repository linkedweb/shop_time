import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';

const landingPage = ({
    products_arrival,
    products_sold,
    add_item,
    get_items,
    get_total,
    get_item_total,
    setRedirect,
}) => (
    <div className='container'>
        <div className='jumbotron mt-5'>
            <h1 className='display-4'>Welcome to Shop Time!</h1>
            <p className='lead'>We sell all kinds of awesome products!</p>
            <hr className='my-4' />
            <p>Go ahead and check out our shop!</p>
            <Link className='btn btn-primary btn-lg' to='/shop'>Shop</Link>
        </div>

        <section>
            <h2 className='mt-5 mb-5 display-4'>Newest Arrivals</h2>
            <div className='row'>
                {
                    products_arrival && 
                    products_arrival !== null && 
                    products_arrival !== undefined && 
                    products_arrival.map((product, index) => (
                        <div key={index} className='col-4'>
                            <Card
                                product={product}
                                add_item={add_item}
                                get_items={get_items}
                                get_total={get_total}
                                get_item_total={get_item_total}
                                setRedirect={setRedirect}
                            />
                        </div>
                    ))
                }
            </div>
        </section>

        <section>
            <h2 className='mt-5 mb-5 display-4'>Top Selling Products</h2>
            <div className='row'>
                {
                    products_sold && 
                    products_sold !== null && 
                    products_sold !== undefined && 
                    products_sold.map((product, index) => (
                        <div key={index} className='col-4'>
                            <Card
                                product={product}
                                add_item={add_item}
                                get_items={get_items}
                                get_total={get_total}
                                get_item_total={get_item_total}
                                setRedirect={setRedirect}
                            />
                        </div>
                    ))
                }
            </div>
        </section>
    </div>
);

export default landingPage;