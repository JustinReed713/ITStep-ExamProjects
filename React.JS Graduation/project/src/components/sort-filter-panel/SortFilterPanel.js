import './SortFilterPanel.css';
import React from 'react';
import {
    Badge,
    Checkbox,
    Chip,
    Divider,
    FormControlLabel,
    Grow,
    IconButton,
    InputAdornment,
    Paper,
    Radio,
    RadioGroup,
    Slider,
    TextField,
    Tooltip,
    Typography,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';

import { connect } from 'react-redux';

import { Cart } from '../../components';
import { textCapitalizer } from '../../utils';

import {Clear, ExpandLess, ExpandMore,NoteAdd, Search, ShoppingCart, Tune} from '@material-ui/icons';

import { v4 as keyGenerator } from 'uuid';

class SortFilterPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            settingsEnable: false,
            cartOpen: false
        }
    }

    /* methods for render slider */

    valueText = (value) => `${value}$`;

    /* methods for change components */

    handleSearchInputChange = (event) => this.props.parentStateSortSettingsUpdateCallback({ searchValue: event.target.value });

    handleSearchSettingsChange = (event) => this.props.parentStateSortSettingsUpdateCallback({ searchAttribute: event.target.value });

    handleClearFieldSearchButtonClick = () => {
        this.props.parentStateSortSettingsUpdateCallback({ searchValue: "" });
        document.getElementById('input-search-value').value = "";
    }

    handleShowSettingsPanelToggle = () => this.setState({ settingsEnable: !this.state.settingsEnable });

    handleSliderChange = (event, newValue) => this.props.parentStateSortSettingsUpdateCallback({ priceRange: newValue });

    handleInputPriceChange = (event) => {
        const { initialPriceRange } = this.props;
        let [min, max] = this.props.currentSettings.priceRange;
        if (event.target.value < initialPriceRange[0]) {
            event.target.value = initialPriceRange[0];
        }
        if (event.target.value > initialPriceRange[1]) {
            event.target.value = initialPriceRange[1];
        }
        switch (event.target.id.slice(0, 3)) {
            case 'min':
                min = event.target.value;
                break;
            case 'max':
                max = event.target.value;
                break;
            default:
                break;
        }
        this.props.parentStateSortSettingsUpdateCallback({ priceRange: [min, max] });
    }

    handleFilterSettingsCheckboxChange = (event) => {
        let { cheap, optimal, premium } = this.props.currentSettings.filterAttribute;
        switch (event.target.name) {
            case 'cheap':
                cheap = !cheap
                break;
            case 'optimal':
                optimal = !optimal
                break;
            case 'premium':
                premium = !premium
                break;
            default:
                break;
        }
        this.props.parentStateSortSettingsUpdateCallback({ filterAttribute: { cheap: cheap, optimal: optimal, premium: premium } });
    }

    handleTypeSortingChange = (event) => this.props.parentStateSortSettingsUpdateCallback({ typeSorting: event.target.value });

    handleSortDirectionCheckboxChange = () => {
        const toggledValue = !this.props.currentSettings.directionDescending;
        this.props.parentStateSortSettingsUpdateCallback({ directionDescending: toggledValue });
    }

    handleShowOutOfStockCheckboxChange = () => {
        const toggledValue = !this.props.currentSettings.showOutOfStock;
        this.props.parentStateSortSettingsUpdateCallback({ showOutOfStock: toggledValue });
    }

    /* render method */

    render() {
        const { initialPriceRange, currentSettings } = this.props;
        const sliderMarks = [
            {
                value: initialPriceRange[0],
                label: this.valueText(initialPriceRange[0])
            },
            {
                value: initialPriceRange[1],
                label: this.valueText(initialPriceRange[1])
            }
        ];
        let crampTimer;
        return (
            <>
                <Paper className="container__wrapper" elevation={3}>
                    <div className="filter-container__wrapper">
                        <div
                            className="sort-filter-panel"
                            onMouseLeave={() => {
                                if (this.state.settingsEnable) {
                                    crampTimer = setTimeout(this.handleShowSettingsPanelToggle, 4000);
                                }
                            }}
                            onMouseEnter={() => clearTimeout(crampTimer)}
                        >
                            <div className={`sort-filter-panel__search-product${this.state.settingsEnable ? "" : " sort-filter-panel__search-product_row-displayed"}`}>
                                <div className={`sort-filter-panel-search-product__search-panel${this.state.settingsEnable ? "" : " sort-filter-panel-search-product__search-panel_extended"}`}>
                                    <div className="sort-filter-panel-search-product-search-panel__icon-wrapper">
                                        <Search fontSize='large' style={{ color: 'rgba(0, 0, 0, 0.5)' }} />
                                    </div>
                                    <TextField
                                        id="input-search-value"
                                        placeholder="Enter search value"
                                        defaultValue={this.props.currentSettings.searchValue}
                                        fullWidth={true}
                                        onChange={this.handleSearchInputChange}
                                        InputProps={{
                                            endAdornment:
                                                <Grow in={this.props.currentSettings.searchValue !== ""} timeout={{ appear: 400, enter: 600, exit: 600 }}>
                                                    < InputAdornment position="end" >
                                                        <IconButton
                                                            aria-label="clear field"
                                                            onClick={this.handleClearFieldSearchButtonClick}
                                                            edge="end"
                                                            color='secondary'
                                                        >
                                                            <Clear style={{ color: red }} />
                                                        </IconButton>
                                                    </InputAdornment>
                                                </Grow>
                                        }}
                                    />
                                </div>
                                <div className={`sort-filter-panel-search-product__search-settings-panel${this.state.settingsEnable ? "" : " sort-filter-panel-search-product__search-settings-panel_row-displayed"}`}>
                                    <Typography>Search by</Typography>
                                    <RadioGroup
                                        value={this.props
                                            .currentSettings
                                            .searchAttribute}
                                        onChange={this.handleSearchSettingsChange}
                                    >
                                        <div>
                                            <FormControlLabel value="name" control={<Radio color="primary" size='small' />} label="Name" />
                                            <FormControlLabel value="article" control={<Radio color="primary" size='small' />} label="Article" />
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                            <div className="sort-filter-panel__settings-wrapper">
                                <div className="sort-filter-panel__settings-toggle-button">
                                    <Tooltip title="Expand filter settings" placement="bottom">
                                        <IconButton
                                            aria-label="settings-open"
                                            onClick={this.handleShowSettingsPanelToggle}
                                            color='primary'
                                        >
                                            <Tune />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                {this.state.settingsEnable && (
                                    <>
                                        <div className="sort-filter-panel-price-range panel-left-border">
                                            <div className="sort-filter-panel-price-range__slider-container">
                                                <Typography>Price range</Typography>
                                                <Slider
                                                    value={this.props
                                                        .currentSettings
                                                        .priceRange}
                                                    onChange={this.handleSliderChange}
                                                    valueLabelDisplay="auto"
                                                    aria-labelledby="range-slider"
                                                    getAriaValueText={this.valueText}
                                                    min={initialPriceRange[0]}
                                                    max={initialPriceRange[1]}
                                                    marks={sliderMarks}
                                                />
                                            </div>
                                            <div className="sort-filter-panel-price-range__input-container">
                                                <div className="sort-filter-panel-price-range-input-container__text">From: </div>
                                                <div className="sort-filter-panel-price-range-input-container__input">
                                                    <TextField
                                                        id="minimal-price"
                                                        variant="standard"
                                                        defaultValue={this.props.currentSettings.priceRange[0]}
                                                        onChange={this.handleInputPriceChange}
                                                    />
                                                </div>
                                                <div className="sort-filter-panel-price-range-input-container__text">To: </div>
                                                <div className="sort-filter-panel-price-range-input-container__input">
                                                    <TextField
                                                        id="maximal-price"
                                                        variant="standard"
                                                        defaultValue={this.props.currentSettings.priceRange[1]}
                                                        onChange={this.handleInputPriceChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sort-filter-panel-settings-container panel-left-border">
                                            <div className="sort-filter-panel-settings-container__filter-settings">
                                                <Typography>Filter settings</Typography>
                                                <div className="sort-filter-panel-settings-container-filter-settings__checkbox-container">
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                color="primary"
                                                                checked={this.props.currentSettings.filterAttribute.cheap}
                                                                onChange={this.handleFilterSettingsCheckboxChange}
                                                                name="cheap" />
                                                        }
                                                        label="Cheap"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                color="primary"
                                                                checked={this.props.currentSettings.filterAttribute.optimal}
                                                                onChange={this.handleFilterSettingsCheckboxChange}
                                                                name="optimal" />
                                                        }
                                                        label="Optimal"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                color="primary"
                                                                checked={this.props.currentSettings.filterAttribute.premium}
                                                                onChange={this.handleFilterSettingsCheckboxChange}
                                                                name="premium" />
                                                        }
                                                        label="Premium"
                                                    />
                                                </div>
                                            </div>
                                            <div className="sort-filter-panel-settings-container__sort-settings panel-left-border">
                                                <Typography>Sort settings</Typography>
                                                <div className="sort-filter-panel-settings-container-sort-settings__input-container">
                                                    <RadioGroup
                                                        value={this.props
                                                            .currentSettings
                                                            .typeSorting}
                                                        onChange={this.handleTypeSortingChange}
                                                    >
                                                        <div>
                                                            <FormControlLabel value="name" control={<Radio color="primary" size='small' />} label="Name" labelPlacement="top" />
                                                            <FormControlLabel value="article" control={<Radio color="primary" size='small' />} label="Article" labelPlacement="top" />
                                                            <FormControlLabel value="count" control={<Radio color="primary" size='small' />} label="Count" labelPlacement="top" />
                                                            <FormControlLabel value="price" control={<Radio color="primary" size='small' />} label="Price" labelPlacement="top" />
                                                            <FormControlLabel value="date" control={<Radio color="primary" size='small' />} label="Date" labelPlacement="top" />
                                                        </div>
                                                    </RadioGroup>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                color='primary'
                                                                checked={this.props.currentSettings.directionDescending}
                                                                icon={<ExpandLess fontSize="large" color='primary' />}
                                                                checkedIcon={<ExpandMore fontSize="large" color='primary' />}
                                                                name="sortDirectionToggle"
                                                                onChange={this.handleSortDirectionCheckboxChange} />
                                                        }
                                                        label={this.props.currentSettings.directionDescending ? "Sort descending" : "Sort ascending"}
                                                    />
                                                </div>
                                            </div>
                                            <div className="sort-filter-panel-settings-container__oos-settings panel-left-border">
                                                <Typography>Additional settings</Typography>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            color="primary"
                                                            checked={this.props.currentSettings.showOutOfStock}
                                                            onChange={this.handleShowOutOfStockCheckboxChange}
                                                            name="outOfStockToggle" />
                                                    }
                                                    label="Show out of stock"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div >
                        {this.props.userName === "admin" && (
                            <div className="add-new-product-button">
                                <Tooltip title="Add new product" placement="bottom">
                                    <IconButton
                                        aria-label="add-product"
                                        color='primary'
                                        onClick={this.props.viewNewProductFormToggle}
                                    >
                                        <NoteAdd style={{ fontSize: 28 }} />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        )}
                    </div>
                    <Divider />
                    <div className="chips-container">
                        <div className="chips-container__wrapper">
                            <Typography variant="subtitle1"><span style={{ fontStyle: "italic", marginRight: 10 }}>Active filters:</span></Typography>
                            <Chip
                                key={keyGenerator()}
                                className="chips-container__information-chip"
                                variant="outlined"
                                label={`From: ${currentSettings["priceRange"][0]}$`}
                            />
                            <Chip
                                key={keyGenerator()}
                                className="chips-container__information-chip"
                                variant="outlined"
                                label={`To: ${currentSettings["priceRange"][1]}$`}
                            />
                            {currentSettings.searchValue !== "" && (
                                <Chip
                                    key={keyGenerator()}
                                    className="chips-container__information-chip"
                                    variant="outlined"
                                    label={`Search: ${currentSettings.searchValue} by ${currentSettings.searchAttribute}`}
                                />
                            )}
                            {Object.keys(currentSettings.filterAttribute)
                                .filter((item) => currentSettings.filterAttribute[item] === true)
                                .map((item) => {
                                    return (
                                        <Chip
                                            key={keyGenerator()}
                                            className="chips-container__information-chip"
                                            variant="outlined"
                                            label={textCapitalizer(item)}
                                        />
                                    )
                                })
                            }
                            <Chip
                                key={keyGenerator()}
                                className="chips-container__information-chip"
                                variant="outlined"
                                label={`Sorted by: ${textCapitalizer(currentSettings.typeSorting)} (${
                                    (currentSettings.typeSorting === "name") ?
                                        ((currentSettings.directionDescending) ? "Z - A" : "A - Z") :
                                        ((currentSettings.directionDescending) ? "9 - 0" : "0 - 9")})`}
                            />
                            {currentSettings.showOutOfStock !== false && (
                                <Chip
                                    key={keyGenerator()}
                                    className="chips-container__information-chip"
                                    variant="outlined"
                                    label="Show products out of stock"
                                />
                            )}
                        </div>
                        <div className="cart-call-button">
                            {this.props.userName !== "admin" && (
                                <Tooltip title="Show cart" placement="bottom">
                                    <span>
                                        <IconButton
                                            aria-label="add-product"
                                            color='primary'
                                            onClick={() => this.setState({ cartOpen: true })}
                                            disabled={this.props.cart.length === 0}
                                        >
                                            <Badge badgeContent={this.props.cart.length} color="secondary">
                                                <ShoppingCart style={{ fontSize: 28 }} />
                                            </Badge>
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                </Paper >
                <Cart
                    cartOpen={this.state.cartOpen}
                    handleCloseCart={() => this.setState({ cartOpen: false })}
                    model={this.props.model}
                />
            </>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        userName: state.userName,
        cart: state.cart
    };
}

export default connect(mapStateToProps)(SortFilterPanel);