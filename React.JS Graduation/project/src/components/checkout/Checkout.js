import './Checkout.css';
import React from 'react';
import { Button, Divider, TextField, Typography } from '@material-ui/core';

import { Link } from 'react-router-dom';

import { globalStore } from '../../components.js';
import { setCart } from '../../data-store/actions/actionsModelStore.js';

import { priceActualize, priceSum } from '../../utils';

function Checkout(props) {

    const totalPrice = priceSum(globalStore.getState());

    const handlePaymentConfirm = () => {
        globalStore.getState().cart.map((productInCart) => {
            const product = globalStore.getState().model.filter((item) => item.article === productInCart.article)[0];
            return Object.assign(product, { count: product.count - productInCart.count })
        })
        globalStore.dispatch(setCart([]));
        props.showSnackbarSuccessPayment();
    }

    return (
        <div className="checkout-container">
            <fieldset className="checkout-container__information-panel checkout-container__information-panel_order-information">
                <legend className="legend-style">
                    <Typography style={{ fontStyle: 'italic' }}>Order</Typography>
                </legend>
                <div className="checkout-container-information-panel__grid">
                    <div className="checkout-container-information-panel-grid__row">
                        <div className="checkout-container-information-panel-grid-row__name">
                            <Typography>Name</Typography>
                        </div>
                        <div className="checkout-container-information-panel-grid-row__description">
                            <Typography>Description</Typography>
                        </div>
                        <div className="checkout-container-information-panel-grid-row__count">
                            <Typography>Count</Typography>
                        </div>
                        <div className="checkout-container-information-panel-grid-row__price">
                            <Typography>Price</Typography>
                        </div>
                    </div>
                    {globalStore.getState().cart.filter((item) => item.count !== 0).map((productInCart) => {
                        const product = globalStore.getState().model.filter((item) => item.article === productInCart.article)[0];
                        return (
                            <div key={product.article + "CheckoutList"} className="checkout-container-information-panel-grid__row">
                                <div className="checkout-container-information-panel-grid-row__name">
                                    <Typography>{product.name}</Typography>
                                </div>
                                <div className="checkout-container-information-panel-grid-row__description">
                                    <Typography>{product.description}</Typography>
                                </div>
                                <div className="checkout-container-information-panel-grid-row__count">
                                    <Typography>{productInCart.count}</Typography>
                                </div>
                                <div className="checkout-container-information-panel-grid-row__price">
                                    <Typography>{(priceActualize(product) * productInCart.count).toFixed(2)}</Typography>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="checkout-container-information-panel__total">
                    <Divider />
                    <Typography>
                        <span style={{ fontStyle: "italic" }}>
                            Total: {totalPrice}$
                                        </span>
                    </Typography>
                </div>
            </fieldset>
            <fieldset className="checkout-container__information-panel checkout-container__payment-information">
                <legend className="legend-style">
                    <Typography style={{ fontStyle: 'italic' }}>Payment information</Typography>
                </legend>
                <div className="checkout-container-payment-information__user-data">
                    <TextField
                        size="small"
                        variant="outlined"
                        margin='normal'
                        label="First name"
                        required
                        fullWidth
                    />
                    <TextField
                        size="small"
                        variant="outlined"
                        margin='normal'
                        label="Surname"
                        required
                        fullWidth
                    />
                    <TextField
                        size="small"
                        variant="outlined"
                        margin='normal'
                        label="Middle name"
                        fullWidth
                    />
                </div>
                <Divider />
                <div className="checkout-container-payment-information__user-address">
                    <div className="checkout-container-payment-information-user-address__row">
                        <TextField
                            size="small"
                            variant="outlined"
                            margin='normal'
                            label="Country"
                            required
                            fullWidth
                        />
                        <TextField
                            size="small"
                            variant="outlined"
                            margin='normal'
                            label="District"
                            fullWidth
                        />
                    </div>
                    <div className="checkout-container-payment-information-user-address__row">
                        <TextField
                            size="small"
                            variant="outlined"
                            margin='normal'
                            label="City/Town"
                            required
                            fullWidth
                        />
                        <TextField
                            size="small"
                            variant="outlined"
                            margin='normal'
                            label="ZIP/POST code"
                            required
                            fullWidth
                        />

                    </div>
                    <TextField
                        size="small"
                        variant="outlined"
                        margin='normal'
                        label="Address line"
                        required
                        fullWidth
                    />
                </div>
                <Divider />
                <div className="checkout-container-payment-information__card-information">
                    <div className="checkout-container-payment-information-card-information__row">
                        <TextField
                            size="small"
                            variant="outlined"
                            margin='normal'
                            label="Card number"
                            required
                            fullWidth
                        />
                        <TextField
                            size="small"
                            variant="outlined"
                            margin='normal'
                            label="Cardholder"
                            required
                            fullWidth
                        />
                    </div>
                    <div className="checkout-container-payment-information-card-information__row">
                        <TextField
                            size="small"
                            variant="outlined"
                            margin='normal'
                            label="Exp. date"
                            required
                            fullWidth
                        />
                        <TextField
                            size="small"
                            variant="outlined"
                            margin='normal'
                            label="CVC code"
                            required
                            fullWidth
                        />
                    </div>
                </div>
                <Divider />
                <div className="checkout-container-payment-information__payment-manage">
                    < Link to="/" className="checkout-container-payment-information-payment-manage__button-link">
                        <Button variant="outlined" color="secondary">
                            Back
                        </Button>
                    </Link>
                    < Link to="/" className="checkout-container-payment-information-payment-manage__button-link">
                        <Button variant="outlined" color="primary" onClick={handlePaymentConfirm}>
                            Confirm
                        </Button>
                    </Link>
                </div>
            </fieldset>
        </div>
    )
}

export default Checkout;
