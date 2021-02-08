import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { 
    get_products_by_arrival, 
    get_products_by_sold 
} from '../actions/products';
import LandingPage from '../components/LandingPage';

const Home = ({
    products_arrival,
    products_sold,
    get_products_by_arrival,
    get_products_by_sold
}) => {
    useEffect(() => {
        window.scrollTo(0, 0);

        get_products_by_arrival();
        get_products_by_sold();
    }, []);

    return (
        <LandingPage
            products_arrival={products_arrival}
            products_sold={products_sold}
        />
    );
};

const mapStateToProps = state => ({
    products_arrival: state.products.products_arrival,
    products_sold: state.products.products_sold
});

export default connect(mapStateToProps, {
    get_products_by_arrival, 
    get_products_by_sold 
})(Home);;
