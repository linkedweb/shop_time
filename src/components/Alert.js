import React, { Fragment } from 'react';
import { connect } from 'react-redux';

const Alert = ({ alert }) => {
    const displayAlert = () => {
        if (alert !== null) {
            return (
                <div
                    className={`btn btn-${alert.alertType}`}
                    style={{ width: '95%', margin: '5px 2.5%' }}
                >
                    {alert.msg}
                </div>
            );
        } else {
            return (
                <Fragment></Fragment>
            );
        }
    };

    return (
        <Fragment>
            {displayAlert()}
        </Fragment>
    );
};

const mapStateToProps = state => ({
    alert: state.alert.alert
});

export default connect(mapStateToProps)(Alert);
