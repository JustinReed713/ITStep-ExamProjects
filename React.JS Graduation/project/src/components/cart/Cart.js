import './Cart.css';
import React from 'react';
import {
    Button,
    Divider,
    Drawer,
    IconButton,
    TextField,
    Typography
} from '@material-ui/core';
import { Add, Remove, ShoppingCart } from '@material-ui/icons';

import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import { globalStore } from '../../components';
import { setCart } from '../../data-store/actions/actionsModelStore.js';

import { priceActualize, priceSum } from '../../utils';

class Cart extends React.Component {

    /* additional methods */

    setCountProductInCart = (value, article) => {
        const index = this.props.cart.map((item, index) => item.article === article ? index : null).filter((item) => item !== null)[0];
        const newObject = Object.assign(this.props.cart[index], { count: this.props.cart[index].count + value });
        const newCart = this.props.cart;
        newCart.splice(index, 1, newObject);
        globalStore.dispatch(setCart(newCart));
        this.forceUpdate();
    }

    /* render method */

    render() {
        
        const totalPrice = priceSum(this.props);

        return (
            <div className="cart-container" >
                <Drawer anchor="right" open={this.props.cartOpen} onClose={this.props.handleCloseCart}>
                    <div className="cart-container__wrapper">
                        <div>
                            <div className="cart-container__header">
                                <div className="cart-container-header__title">
                                    <ShoppingCart fontSize="large" /><Typography variant="h5">Cart</Typography>
                                </div>
                                <Divider />
                            </div>
                            <div className="cart-container__product-list">
                                {this.props.cart.map((productInCart) => {
                                    const product = this.props.model.filter((item) => item.article === productInCart.article)[0];
                                    return (
                                        <div key={`productInCart${product.article}`} className="cart-container-product-list__row">
                                            <div className="cart-container-product-list-row__product-name">
                                                <Typography variant="h6"><span style={{ fontStyle: "italic", fontWeight: 600 }}>{product.name}</span></Typography>
                                            </div>
                                            <div className="cart-container-product-list-row__product-price-wrapper">
                                                <div className="cart-container-product-list-row__product-counter">
                                                    <IconButton
                                                        aria-label="add-product"
                                                        color='primary'
                                                        onClick={() => this.setCountProductInCart(-1, product.article)}
                                                        disabled={productInCart.count === 0}
                                                    >
                                                        <Remove />
                                                    </IconButton>
                                                    <div className="cart-container-product-list-row-product-counter__count">
                                                        <TextField
                                                            variant="outlined"
                                                            size="small"
                                                            value={productInCart.count}
                                                            disabled
                                                            fullWidth
                                                        />
                                                    </div>
                                                    <IconButton
                                                        aria-label="add-product"
                                                        color='primary'
                                                        onClick={() => this.setCountProductInCart(1, product.article)}
                                                        disabled={product.count === productInCart.count}
                                                    >
                                                        <Add />
                                                    </IconButton>
                                                </div>
                                                <div className="cart-container-product-list-row__product-price-summary">
                                                    <Typography variant="h6">
                                                        <span style={{ fontStyle: "italic", fontWeight: 600 }}>
                                                            {productInCart.count === 0 ? 0 : (priceActualize(product) * productInCart.count).toFixed(2)}$
                                                            </span>
                                                    </Typography>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="cart-container__footer">
                            <Divider />
                            <div className="cart-container-footer__total-price">
                                <Typography>
                                    <span style={{ fontStyle: "italic" }}>
                                        Total price: {totalPrice}$
                                        </span>
                                </Typography>
                            </div>
                            <Divider />
                            <div className="cart-container-footer__continue-button">
                                {totalPrice === "0.00" ? (
                                    <Button variant="outlined" color="primary" disabled >
                                        Continue
                                    </Button>
                                ) : (
                                        < Link to="/checkout" className="cart-container-footer-continue-button__link">
                                            <Button variant="outlined" color="primary" >
                                                Continue
                                            </Button>
                                        </Link>
                                    )}
                            </div>
                        </div>
                    </div>
                </Drawer>
            </div >
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        cart: state.cart
    };
}

export default connect(mapStateToProps)(Cart);
