import './ProductCard.scss';
import { Stub } from '../../globals.js';
import React from 'react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Collapse,
    Dialog,
    DialogActions,
    DialogTitle,
    Divider,
    IconButton,
    Tooltip,
    Typography
} from '@material-ui/core';
import { Delete, Edit, ExpandLess, ExpandMore } from '@material-ui/icons';
import Rating from '@material-ui/lab/Rating';

import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import { globalStore, MethodContext } from '../../components';
import { setModel, addToCart } from '../../data-store/actions/actionsModelStore.js';
import { dateReverse, isProductInCart, isSaleActual, priceActualize, textCapitalizer } from '../../utils';

class ProductCardNormal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptionEnable: false,
            errorLoadImage: false,
            openDeleteDialog: false
        }
    }

    static contextType = MethodContext;

    /* methods for manage product card with other components */

    handleProductCardLostFocus = () => {
        if (this.state.descriptionEnable) {
            setTimeout(this.handleOpenDescriptionToggleClick, 2000);
        }
    }

    handleOpenEditProductClick = () => {
        const [setProductID, openForm] = this.context;
        setProductID(this.props.object.article);
        openForm();
    }

    handleOpenDescriptionToggleClick = () => this.setState({ descriptionEnable: !this.state.descriptionEnable });

    handleImageError = () => this.setState({ errorLoadImage: true });

    handleDeleteProductClick = () => {
        const indexFind = () => {
            return globalStore
                .getState()
                .model
                .map((item, index) => { if (item.article === this.props.object.article) { return index } return null })
                .filter((item) => item !== null)[0];
        };
        const index = indexFind();
        const newModel = globalStore.getState().model;
        this.context[2]({ object: newModel.splice(index, 1)[0], index: index });
        globalStore.dispatch(setModel(newModel));
        this.handleDialogClose();
    }

    ratingCounter = () => {
        const { object } = this.props;
        const reviewsRating = (object
            .reviews
            .reduce((accumulator, currentValue) => accumulator + currentValue.rate, 0)) / object.reviews.length;
        if ((reviewsRating % 1) >= 0 && (reviewsRating % 1) < 0.25) { return (Math.trunc(reviewsRating)) };
        if ((reviewsRating % 1) >= 0.25 && (reviewsRating % 1) < 0.75) { return (Math.trunc(reviewsRating) + 0.5) };
        if ((reviewsRating % 1) >= 0.75 && (reviewsRating % 1) < 1) { return (Math.trunc(reviewsRating) + 1) };
    }

    handleDialogClickOpen = () => this.setState({ openDeleteDialog: true });

    handleDialogClose = () => this.setState({ openDeleteDialog: false });

    /* render method */

    render() {
        const { object, cart } = this.props;
        const { errorLoadImage, descriptionEnable, openDeleteDialog } = this.state;
        const saleActual = isSaleActual(object);
        const productInCart = isProductInCart(cart, object);

        return (
            <Card
                className={`product-card border-card_${object.priceSegment}${object.count === 0 ? " border-card_out-of-stock" : ""}`}
                raised={true}
                onMouseLeave={this.handleProductCardLostFocus}
            >
                <div className="product-card__wrapper_normal">
                    <CardMedia
                        className="image-preview"
                        style={{
                            backgroundImage: `url(${errorLoadImage ? Stub : object.imageURL})`
                        }}>
                        <img
                            alt="preview"
                            src={object.imageURL}
                            style={{
                                visibility: "hidden"
                            }}
                            onError={this.handleImageError}
                        />
                        {object.count === 1 && (
                            <div className="product-disclaimer product-disclaimer_last-product"> Last product</div>
                        )}
                        {object.count === 0 && (
                            <div className="product-disclaimer product-disclaimer_last-product_out-of-stock"> Out of stock</div>
                        )}
                        <div className="price-container">
                            {object.count > 0 && (
                                <>
                                    {saleActual && (
                                        <>
                                            <div className="price-container__sale-announce">-{object.sale.discount}%OFF</div>
                                            <div className="price-container__product-price price-container__old-price">
                                                {object.price}
                                                <div className="price-container__line-through" />
                                            </div>
                                        </>
                                    )}
                                    <div className="price-container__product-price">{priceActualize(object)}$</div>
                                </>
                            )}
                        </div>
                    </CardMedia>
                    <CardContent className="product-information">
                        <div className="product-information__rating-wrapper">
                            <Rating
                                name="hover-feedback"
                                value={this.ratingCounter()}
                                precision={0.5}
                                size="small"
                                readOnly
                            />
                            <Typography>
                                {object.reviews.length} reviews
                            </Typography>
                        </div>
                        <Divider />
                        {["name", "article", "count"].map((item) => {
                            return (
                                <div key={item + object.article} className="data-row">
                                    <div className="data-row__title"><Typography>{textCapitalizer(item)}:</Typography></div>
                                    <div className="data-row__value"><Typography>{object[item]}{item === "count" ? (object[item] > 1 ? " pcs." : " pc.") : ""}</Typography></div>
                                </div>
                            )
                        })}
                        <Divider />
                        <div id="show-description-button" className="button-description-toggle__wrapper">
                            {object.description !== "" && (
                                <Button
                                    variant="outlined"
                                    color="default"
                                    size='small'
                                    onClick={this.handleOpenDescriptionToggleClick}
                                    endIcon={!descriptionEnable ? <ExpandMore /> : <ExpandLess />}
                                >
                                    {!descriptionEnable ? "Show description" : "Close description"}
                                </Button>
                            )}
                        </div>
                        <Collapse in={descriptionEnable} timeout="auto" unmountOnExit>
                            <Typography>
                                <span className="data-row__value">
                                    {object.description}
                                </span>
                            </Typography>
                        </Collapse>
                    </CardContent>
                </div>
                <div className="product-card-action-footer-wrapper">
                    <div className="product-card-action-wrapper">
                        <CardActions id="card-action" disableSpacing>
                            {this.props.userName === "admin" ? (
                                <div className="product-card__action-buttons-container">
                                    <Tooltip title="Edit product" placement="bottom">
                                        <IconButton aria-label="edit-card" edge="start" onClick={this.handleOpenEditProductClick}>
                                            <Edit fontSize="default" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete product" placement="bottom">
                                        <IconButton aria-label="delete-card" edge="start" onClick={this.handleDialogClickOpen}>
                                            <Delete fontSize="default" />
                                        </IconButton>
                                    </Tooltip>
                                    <Dialog
                                        open={openDeleteDialog}
                                        onClose={this.handleDialogClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle id="alert-dialog-title">{"Do you really want to delete this product?"}</DialogTitle>
                                        <DialogActions>
                                            <Button onClick={this.handleDeleteProductClick} color="primary">
                                                Delete
                                    </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                            ) : (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        disabled={(object.count === 0) || productInCart}
                                        onClick={() => globalStore.dispatch(addToCart({ article: object.article, count: 1 }))}
                                    >
                                        {productInCart === false ? "Add to cart" : "Added to card"}
                                    </Button>
                                )}
                        </CardActions>
                        <Link className="product-card__product-page-link" to={`/product/${this.props.object.article}`}>
                            <Button variant="outlined">Go to product page</Button>
                        </Link>
                    </div>
                    <div className="data-row data-row_footer">
                        <div className="data-row__title data-row__title_footer"><Typography variant="caption">Creation date:</Typography></div>
                        <div className="data-row__value"><Typography variant="caption">{dateReverse(object.creationDate)}</Typography></div>
                    </div>
                </div>
            </Card >
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        userName: state.userName,
        cart: state.cart
    };
}

export default connect(mapStateToProps)(ProductCardNormal);


export function ProductCardSlider(props) {
    const [errorLoadImage, setErrorLoadImage] = React.useState(false);
    const { object } = props;
    const saleActual = isSaleActual(object);

    return (

        <Link to={`/product/${object.article}`} >
            <Card className={`product-card-slider border-card_${object.priceSegment}-slider`} raised={true}>
                <div
                    className="slider-image-preview"
                    style={{
                        backgroundImage: `url(${errorLoadImage ? Stub : object.imageURL})`
                    }}>
                    <img
                        alt="preview"
                        src={object.imageURL}
                        style={{
                            visibility: "hidden"
                        }}
                        onError={() => setErrorLoadImage(true)}
                    />
                    {object.count === 1 && (
                        <div className="product-disclaimer product-disclaimer_last-product product-disclaimer_last-product-slider"> Last product</div>
                    )}
                    <div className="product-disclaimer product-disclaimer_name-product product-disclaimer_name-product-slider">{object.name} (article: {object.article})</div>
                    <div className="price-container">
                        {object.count > 0 && (
                            <>
                                {saleActual && (
                                    <>
                                        <div className="price-container__sale-announce">-{object.sale.discount}%OFF</div>
                                        <div className="price-container__product-price price-container__old-price">
                                            {object.price}
                                            <div className="price-container__line-through" />
                                        </div>
                                    </>
                                )}
                                <div className="price-container__product-price">{priceActualize(object)}$</div>
                            </>
                        )}
                    </div>
                </div>
            </Card>
        </ Link>

    )
}