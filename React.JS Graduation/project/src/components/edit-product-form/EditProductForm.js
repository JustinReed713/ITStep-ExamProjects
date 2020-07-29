import './EditProductForm.css';
import { Stub } from '../../globals.js';
import React from 'react';
import {
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Radio,
    RadioGroup,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core';
import { red, grey, green, yellow } from '@material-ui/core/colors';
import { Clear, Save } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';

import { globalStore } from '../../components';
import { addItem, setModel } from '../../data-store/actions/actionsModelStore.js';

import { dateTranslate, Product } from '../../utils';

const GreenRadio = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

const GrayRadio = withStyles({
    root: {
        color: grey[400],
        '&$checked': {
            color: grey[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

const GoldRadio = withStyles({
    root: {
        color: yellow[400],
        '&$checked': {
            color: yellow[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

export default class EditProductForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {
                name: "",
                article: "",
                count: 1,
                price: 0,
                creationDate: dateTranslate(new Date().toLocaleDateString()),
                priceSegment: "cheap",
                sale: {
                    onSale: false,
                    discount: 0,
                    saleEndDate: dateTranslate(new Date().toLocaleDateString())
                },
                imageURL: "",
                description: "",
                lastUpdateTime: ""
            },
            errorFlags: {
                nameError: false,
                articleExistError: false,
                articleInputError: false,
                countError: false,
                priceError: false,
                imageError: false
            }
        }
    }

    /* life cycle methods */

    UNSAFE_componentWillMount() {
        if (this.props.productID !== null) {
            return { object: Object.assign(this.state.object, this.props.model.filter((item) => item.article === this.props.productID)[0]) };
        }
    }

    /* additional methods */

    availableSaveButton = () => {
        const { nameError, articleExistError, articleInputError, countError, priceError } = this.state.errorFlags;
        const { name, article, price } = this.state.object;
        return nameError || articleExistError || articleInputError || countError || priceError || (name === "") || (article === "") || (price === 0);
    }

    articleErrorHelperText = () => {
        const { articleExistError, articleInputError } = this.state.errorFlags;
        if (articleExistError) {
            return "Product with this article already exist";
        }
        if (articleInputError) {
            return "Article must start with upper case letter and include two or more numbers";
        }
        return "";
    }

    /* methods for handle valid input field change */

    handleSetStateValidInput = (object) => this.setState({ validInput: Object.assign(this.state.validInput, object) });

    /* methods for handle error flags field change */

    handleSetStateErrorFlags = (object) => this.setState({ errorFlags: Object.assign(this.state.errorFlags, object) });

    /* methods for handle object field change */

    handleSetStateObjectInfo = (object) => this.setState({ object: Object.assign(this.state.object, object) });

    handleNameChange = (event) => {
        if (/^\D{5}/.test(event.target.value)) {
            this.handleSetStateErrorFlags({ nameError: false });
        } else {
            this.handleSetStateErrorFlags({ nameError: true });
        }
        this.handleSetStateObjectInfo({ name: event.target.value });
    }

    handleArticleChange = (event) => {
        if (/^[A-Z]\d{2}/.test(event.target.value)) {
            this.handleSetStateErrorFlags({ articleInputError: false });
        } else {
            this.handleSetStateErrorFlags({ articleInputError: true });
        }
        if (this.props.model.map(item => { return item.article }).includes(event.target.value)) {
            this.handleSetStateErrorFlags({ articleExistError: true });
        } else {
            this.handleSetStateErrorFlags({ articleExistError: false });
        }
        this.handleSetStateObjectInfo({ article: event.target.value });
    }

    handleCountChange = (event) => this.handleSetStateObjectInfo({ count: +event.target.value });

    handlePriceChange = (event) => {
        if (/^\d{1,100}\.*\d{0,2}$/.test(+event.target.value)) {
            this.handleSetStateErrorFlags({ priceError: false });
        } else {
            this.handleSetStateErrorFlags({ priceError: true });
        }
        this.handleSetStateObjectInfo({ price: +event.target.value });
    }

    handleCreationDateChange = (date) => this.handleSetStateObjectInfo({ creationDate: dateTranslate(date.toLocaleDateString()) });

    handlePriceSegmentChange = (event) => this.handleSetStateObjectInfo({ priceSegment: event.target.value });

    handleImageURLChange = (event) => this.handleSetStateObjectInfo({ imageURL: event.target.value });

    handleImageError = () => this.handleSetStateErrorFlags({ imageError: true });

    handleImageLoad = () => this.handleSetStateErrorFlags({ imageError: false });

    handleDescriptionChange = (event) => this.handleSetStateObjectInfo({ description: event.target.value });

    handleSetLastUpdateTime = () => this.handleSetStateObjectInfo({ lastUpdateTime: new Date().toLocaleString() })

    /* methods for handle sale object field change */

    handleSetStateObjectSale = (object) => this.setState({ object: Object.assign(this.state.object, { sale: Object.assign(this.state.object.sale, object) }) });

    handleOnSaleToggle = () => {
        const toggledValue = !this.state.object.sale.onSale;
        this.handleSetStateObjectSale({ onSale: toggledValue });
    }

    handleSaleDiscountChange = (event) => this.handleSetStateObjectSale({ discount: +event.target.value });

    handleSaleEndDateChange = (date) => this.handleSetStateObjectSale({ saleEndDate: dateTranslate(date.toLocaleDateString()) });

    handleSaveButtonClick = () => {
        this.handleSetLastUpdateTime();
        const { object } = this.state;
        const { productID, handleCloseFormClick } = this.props;
        if (productID === null) {
            globalStore.dispatch(addItem(Object.assign(new Product(), object)));
        } else {
            const indexFind = () => {
                return globalStore
                    .getState()
                    .model
                    .map((item, index) => { if (item.article === this.props.productID) { return index } return null })
                    .filter((item) => item !== null)[0];
            };
            const newModel = globalStore.getState().model;
            newModel.splice(indexFind(), 1, object);
            globalStore.dispatch(setModel(newModel));
        };
        handleCloseFormClick();
    }

    /* render method */

    render() {
        const { productID, handleCloseFormClick } = this.props;
        const { object, errorFlags } = this.state;

        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <form className="edit-product-form">
                    <div className="edit-product-form__header-panel">
                        <div className="edit-product-form-header-panel__title">
                            <Typography style={{ fontSize: 22, fontStyle: 'italic' }}>
                                {productID === null ? 'New product create' : 'Edit product'}
                            </Typography>
                        </div>
                        <div className="edit-product-form-header-panel__close-form-button">
                            <Tooltip title="Close" aria-label="close">
                                <IconButton
                                    aria-label="close form"
                                    onClick={handleCloseFormClick}
                                    color='secondary'
                                >
                                    <Clear style={{ color: red }} />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="edit-product-form__product-data-input-panel">
                        <div className="product-information__first-line">
                            <fieldset className="edit-product-form-product-data-input-panel__image-data fieldset-style">
                                <legend className="legend-style">
                                    <Typography style={{ fontStyle: 'italic' }}>Product image</Typography>
                                </legend>
                                <div
                                    className="edit-product-form-product-data-input-panel-image-data__image-preview"
                                    style={{
                                        backgroundImage: `url(${errorFlags.imageError ? Stub : object.imageURL})`
                                    }}
                                >
                                    <img
                                        alt="preview"
                                        src={object.imageURL}
                                        style={{
                                            visibility: "hidden"
                                        }}
                                        onLoad={this.handleImageLoad}
                                        onError={this.handleImageError}
                                    />
                                </div>
                                <TextField
                                    margin='normal'
                                    id="image-url-input"
                                    label="Image URL"
                                    defaultValue={object.imageURL}
                                    onChange={this.handleImageURLChange}
                                    helperText={(errorFlags.imageError && object.imageURL !== "") ? "Error on load resources from this URL" : ""}
                                    error={errorFlags.imageError && object.imageURL !== ""}
                                    fullWidth
                                />
                            </fieldset>
                            <fieldset className="edit-product-form-product-data-input-panel__main-information fieldset-style">
                                <legend className="legend-style">
                                    <Typography style={{ fontStyle: 'italic' }}>Main product information</Typography>
                                </legend>
                                <TextField
                                    margin='normal'
                                    id="name-input"
                                    label="Name"
                                    defaultValue={object.name}
                                    onChange={this.handleNameChange}
                                    helperText={errorFlags.nameError ? "Entering text must be more then five letters" : ""}
                                    error={errorFlags.nameError}
                                    required
                                />
                                <TextField
                                    margin='normal'
                                    id="article-input"
                                    label="Article"
                                    defaultValue={object.article}
                                    onChange={this.handleArticleChange}
                                    helperText={this.articleErrorHelperText()}
                                    error={errorFlags.articleExistError || errorFlags.articleInputError}
                                    required
                                />
                                <TextField
                                    margin='normal'
                                    id="price-input"
                                    label="Price"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="end"><span style={{ marginRight: 10 }}>$</span></InputAdornment>,
                                    }}
                                    defaultValue={object.price}
                                    onChange={this.handlePriceChange}
                                    helperText={errorFlags.priceError ? "Price must be an integer and have no more then two numbers after dot" : ""}
                                    error={errorFlags.priceError}
                                    required
                                />
                                <TextField
                                    margin='normal'
                                    id="count-input"
                                    label="Count"
                                    defaultValue={object.count}
                                    onChange={this.handleCountChange}
                                    inputProps={{ type: 'number', min: (this.props.productID === null) ? 1 : 0 }}
                                    required
                                />
                                <KeyboardDatePicker
                                    disableFuture
                                    margin="normal"
                                    id="creation-date-picker-dialog"
                                    label="Creation date"
                                    format="dd/MM/yyyy"
                                    value={new Date(object.creationDate)}
                                    onChange={this.handleCreationDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    disabled={productID !== null}
                                    required
                                />
                            </fieldset>
                        </div>
                        <div className="product-information__second-line">
                            <div className="product-information-second-line__column">
                                <fieldset className="edit-product-form-product-data-input-panel__main-information fieldset-style">
                                    <legend className="legend-style">
                                        <Typography style={{ fontStyle: 'italic' }}>Main product information</Typography>
                                    </legend>
                                    <RadioGroup
                                        value={object.priceSegment}
                                        onChange={this.handlePriceSegmentChange}
                                    >
                                        <div className="radio-group__wrapper">
                                            <div className="radio-group-wrapper__radio-button radio-group-wrapper__radio-button_cheap">
                                                <FormControlLabel value="cheap" control={<GrayRadio color="primary" size='small' />} label="Cheap" labelPlacement="end" />
                                            </div>
                                            <div className="radio-group-wrapper__radio-button radio-group-wrapper__radio-button_optimal">
                                                <FormControlLabel value="optimal" control={<GreenRadio /*color="primary"*/ size='small' />} label="Optimal" labelPlacement="end" />
                                            </div>
                                            <div className="radio-group-wrapper__radio-button radio-group-wrapper__radio-button_premium">
                                                <FormControlLabel value="premium" control={<GoldRadio color="primary" size='small' />} label="Premium" labelPlacement="end" />
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </fieldset>
                                <fieldset className="edit-product-form-product-data-input-panel__main-information fieldset-style fieldset-style_without-borders">
                                    <TextField
                                        multiline={true}
                                        rows='4'
                                        variant="outlined"
                                        margin='normal'
                                        id="description-input"
                                        label="Product description"
                                        defaultValue={object.description}
                                        onChange={this.handleDescriptionChange}
                                    />
                                </fieldset>
                            </div>
                            <fieldset className="edit-product-form-product-data-input-panel__main-information fieldset-style">
                                <legend className="legend-style">
                                    <Typography style={{ fontStyle: 'italic' }}>Sale information</Typography>
                                </legend>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={object.sale.onSale}
                                            onChange={this.handleOnSaleToggle}
                                            name="onSale"
                                            color="primary"
                                        />
                                    }
                                    label="On sale"
                                />
                                <TextField
                                    margin='normal'
                                    id="discount-input"
                                    label="Discount size"
                                    defaultValue={object.sale.discount}
                                    onChange={this.handleSaleDiscountChange}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="end"><span style={{ marginRight: 10 }}>%</span></InputAdornment>,
                                    }}
                                    disabled={!object.sale.onSale}
                                />
                                <KeyboardDatePicker
                                    disablePast
                                    margin="normal"
                                    id="sale-end-date-picker-dialog"
                                    label="Sale end date"
                                    format="dd/MM/yyyy"
                                    value={new Date(object.sale.saleEndDate)}
                                    onChange={this.handleSaleEndDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    disabled={!object.sale.onSale}
                                />
                            </fieldset>
                        </div>
                    </div>
                    <div className="edit-product-form__control-panel">
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Save fontSize='large' />}
                            disabled={this.availableSaveButton()}
                            onClick={this.handleSaveButtonClick}
                        >
                            Save
                        </Button>
                        {this.props.productID !== null && (
                            <Typography style={{ fontStyle: 'italic' }}>Last update: {object.lastUpdateTime}</Typography>
                        )}
                    </div>
                </form>
            </MuiPickersUtilsProvider >
        )
    }
}

