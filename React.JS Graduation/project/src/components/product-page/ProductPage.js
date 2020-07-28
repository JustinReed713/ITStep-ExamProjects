
import './ProductPage.css';
import { Stub } from '../../globals.js';
import React from 'react';
import {
    Box,
    Button,
    Divider,
    Tab, Tabs,
    TextField,
    Typography
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { connect } from 'react-redux';

import { globalStore } from '../../components';
import { setModel, addToCart } from '../../data-store/actions/actionsModelStore.js';
import { isProductInCart, isSaleActual, priceActualize } from '../../utils';

const labels = {
    0: 'Useless-',
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
};

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function Review(props) {
    const { object } = props;
    return (
        <div className="product-review-card">
            <div className="product-review-card__review-information">
                <div className="product-review-card-review-information__user-information">
                    <AccountCircleIcon /><Typography><span style={{ marginLeft: 20 }}>{object.user === "" ? "User" : object.user}</span></Typography>
                </div>
                <Typography variant="subtitle2">{object.date}</Typography>
            </div>
            <Rating
                name="hover-feedback"
                value={object.rate}
                precision={0.5}
                readOnly
            />
            <Divider />
            <div className="product-review-card__review-description">
                <Typography><span style={{ fontStyle: "italic" }}>"{object.description}"</span></Typography>
            </div>
        </div>
    )
}



function ProductPage(props) {
    const [hover, setHover] = React.useState(-1);
    const [errorLoadImage, setErrorLoadImage] = React.useState(false);
    const [reviewDescription, setReviewDescription] = React.useState("");
    const [reviewRate, setReviewRate] = React.useState(2.5);
    const [tabNumber, setTabNumber] = React.useState(0);

    const ratingCounter = () => {
        const { object } = props;
        const reviewsRating = (object
            .reviews
            .reduce((accumulator, currentValue) => accumulator + currentValue.rate, 0)) / object.reviews.length;
        if ((reviewsRating % 1) >= 0 && (reviewsRating % 1) < 0.25) { return (Math.trunc(reviewsRating)) };
        if ((reviewsRating % 1) >= 0.25 && (reviewsRating % 1) < 0.75) { return (Math.trunc(reviewsRating) + 0.5) };
        if ((reviewsRating % 1) >= 0.75 && (reviewsRating % 1) < 1) { return (Math.trunc(reviewsRating) + 1) };
    }

    const handleAddReview = () => {
        const { object } = props;
        const indexFind = () => {
            return globalStore
                .getState()
                .model
                .map((item, index) => { if (item.article === props.object.article) { return index } return null })
                .filter((item) => item !== null)[0];
        };
        const index = indexFind();
        const newObject = Object.assign(object, {
            reviews: [...object.reviews, {
                user: globalStore.getState().userName,
                date: new Date().toLocaleString(),
                description: reviewDescription,
                rate: reviewRate
            }]
        });
        const newModel = globalStore
            .getState()
            .model;
        newModel.splice(index, 1, newObject);
        globalStore.dispatch(setModel(newModel));
        setReviewDescription("");
        document.getElementById("review-input").value = "";
        setReviewRate(2.5);
        setHover(-1);
    }

    const { object, cart } = props;
    const productInCart = isProductInCart(cart, object);

    return (
        <div className="product-page">
            {object !== undefined && (
                <>
                    <div className="product-page__main-information">
                        <div className="product-page-main-information__image-wrapper">
                            <div className="product-page-main-information__image-preview"
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
                            </div>
                        </div>
                        <div className="product-page-main-information__information-panel">
                            <div className="product-page-main-information-information-panel__name-article-title">
                                <Typography variant="h5">
                                    <span style={{ fontStyle: "italic", marginRight: 30 }}>Name:</span>{object.name}
                                </Typography>
                                <Typography variant="body1">
                                    (article: {object.article})
                                    </Typography>
                            </div>
                            <Divider />
                            <div className="product-page-main-information-information-panel__product-rating">
                                <div className="product-page-main-information-information-panel-product-rating__wrapper">
                                    <Rating
                                        name="hover-feedback"
                                        value={ratingCounter()}
                                        precision={0.5}
                                        readOnly
                                    />
                                    <Box ml={2}><span style={{ fontStyle: "italic" }}>{labels[ratingCounter()]}</span></Box>
                                </div>
                                <Typography>
                                    based on {object.reviews.length} reviews {(object.reviews.length === 1 ? " review" : " reviews")}
                                </Typography>
                            </div>
                            <Divider />
                            <div className="product-page-main-information-information-panel__price-quantity-container">
                                <Typography>
                                    Left on stock: {object.count} {(object.count > 1 ? " pcs." : " pc.")}
                                </Typography>
                                <div className="product-page-main-information-information-panel-price-quantity-container__price-wrapper">
                                    {isSaleActual(object) && (
                                        <>
                                            <Typography>
                                                Was: {object.price}$
                                            </Typography>
                                            <Typography>
                                                You save: {(object.price * (object.sale.discount / 100)).toFixed(2)}$    ({object.sale.discount} %off)
                                            </Typography>
                                        </>
                                    )}
                                    <Typography>
                                        Price:     {priceActualize(object)}$
                                    </Typography>
                                </div>
                            </div>
                            <div className="product-page-main-information-information-panel__button-container">
                                {props.userName !== "admin" && (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        disabled={(object.count === 0) || productInCart}
                                        onClick={() => globalStore.dispatch(addToCart({ article: object.article, count: 1 }))}
                                    >
                                        {productInCart === false ? "Add to cart" : "Added to card"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="product-page__additional-information">
                        <Tabs value={tabNumber} onChange={(event, newValue) => setTabNumber(newValue)}>
                            <Tab label="Description" />
                            <Tab label={`Reviews (${object.reviews.length})`} />
                        </Tabs>
                        <TabPanel value={tabNumber} index={0}>
                            <Typography>{object.description}</Typography>
                        </TabPanel>
                        <TabPanel value={tabNumber} index={1}>
                            <div className="product-page-additional-information__review-add-form">
                                <div className="product-page-additional-information-review-add-form__rating-wrapper">
                                    <Rating
                                        name="hover-feedback"
                                        value={reviewRate}
                                        precision={0.5}
                                        onChange={(event, newValue) => {
                                            setReviewRate(newValue);
                                        }}
                                        onChangeActive={(event, newHover) => {
                                            setHover(newHover);
                                        }}
                                    />
                                    <Box ml={2}><span style={{ fontStyle: "italic" }}>{labels[hover !== -1 ? hover : reviewRate]}</span></Box>
                                </div>
                                <Divider />
                                <div className="product-page-additional-information-review-add-form__input-wrapper">
                                    <TextField
                                        id="review-input"
                                        variant="outlined"
                                        placeholder="Type your review here"
                                        rows={5}
                                        multiline={true}
                                        fullWidth={true}
                                        defaultValue={reviewDescription}
                                        onChange={(event) => setReviewDescription(event.target.value)}
                                    />
                                </div>
                                <Button variant="outlined" onClick={handleAddReview} disabled={reviewDescription === ""}>Add review</Button>
                            </div>
                            {object.reviews.length > 0 && (
                                <>
                                    {object.reviews.map((item, index) => (
                                        <Review object={item} index={index} key={object.article + "review" + index} />
                                    ))}
                                </>
                            )}
                        </TabPanel>
                    </div>
                </>
            )}
        </div >
    )
}

function mapStateToProps(state, ownProps) {
    return {
        userName: state.userName,
        cart: state.cart
    };
}

export default connect(mapStateToProps)(ProductPage);