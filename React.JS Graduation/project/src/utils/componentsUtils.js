import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';

export function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const isSaleActual = (object) => object.sale.onSale ? (new Date(object.sale.saleEndDate) > new Date()) : false;

export const priceActualize = (object) => isSaleActual(object) ? Number.parseFloat((object.price * (1 - (object.sale.discount / 100))).toFixed(2)) : object.price;

export const priceSum = (object) => object.cart.map((productInCart) => {
    const product = object.model.filter((item) => item.article === productInCart.article)[0];
    return priceActualize(product) * productInCart.count;
}).reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);

export const isProductInCart = (array, object) => array.map((item) => item.article).includes(object.article);

