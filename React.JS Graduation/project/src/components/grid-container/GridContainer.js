import './GridContainer.css';
import React from 'react';
import { Provider } from 'react-redux';

import { ProductCardNormal, SortFilterPanel, globalStore } from '../../components';
import { maxMinPrice } from '../../utils';

export default class GridContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortSettings: {
                priceRange: maxMinPrice(this.props.model),
                searchValue: "",
                searchAttribute: 'name',
                filterAttribute: {
                    cheap: true,
                    optimal: true,
                    premium: true
                },
                typeSorting: 'name',
                directionDescending: false,
                showOutOfStock: true
            }
        }
    }

    stateSearchSettingsUpdate = (object) => this.setState({ sortSettings: Object.assign(this.state.sortSettings, object) });

    /* methods for sorters callback */

    searchProductCallback = (item) => {
        return item[this.state.sortSettings.searchAttribute].toLowerCase().startsWith(this.state.sortSettings.searchValue.toLowerCase());
    }

    inStockSortCallback = (firstItem, secondItem) => {
        if (secondItem.count === 0) return -1;
        if (secondItem.count > 0) return 1;
        return 0;
    }

    priceRangeCallback = (item) => {
        const [min, max] = this.state.sortSettings.priceRange;
        if ((item.price >= min) && (item.price <= max)) return true;
        return false;
    }

    priceSegmentFilterCallback = (item) => {
        const categoryArray = [];
        Object.keys(this.state.sortSettings.filterAttribute).forEach((item) => {
            if (this.state.sortSettings.filterAttribute[item] === true) categoryArray.push(item);
        })
        if (categoryArray.includes(item.priceSegment)) return true;
    }

    typeSortingCallback = (itemFirst, itemSecond) => {
        if (this.state.sortSettings.typeSorting === "price") {
            const isSaleActual = (object) => object.sale.onSale ? (new Date(object.sale.saleEndDate) > new Date()) : false;
            const priceActualize = (object) => isSaleActual(object) ? Number.parseFloat((object.price * (1 - (object.sale.discount / 100))).toFixed(2)) : object.price;
            const firstItemPrice = priceActualize(itemFirst);
            const secondItemPrice = priceActualize(itemSecond);
            if (this.state.sortSettings.directionDescending) {
                if (firstItemPrice > secondItemPrice) { return -1; };
                if (firstItemPrice < secondItemPrice) { return 1; };
                if (firstItemPrice === secondItemPrice) { return 0; };
            } else {
                if (firstItemPrice > secondItemPrice) { return 1; };
                if (firstItemPrice < secondItemPrice) { return -1; };
                if (firstItemPrice === secondItemPrice) { return 0; };
            }
        } else {
            if (this.state.sortSettings.directionDescending) {
                if (itemFirst[this.state.sortSettings.typeSorting] > itemSecond[this.state.sortSettings.typeSorting]) { return -1; };
                if (itemFirst[this.state.sortSettings.typeSorting] < itemSecond[this.state.sortSettings.typeSorting]) { return 1; };
                if (itemFirst[this.state.sortSettings.typeSorting] === itemSecond[this.state.sortSettings.typeSorting]) { return 0; };
            } else {
                if (itemFirst[this.state.sortSettings.typeSorting] > itemSecond[this.state.sortSettings.typeSorting]) { return 1; };
                if (itemFirst[this.state.sortSettings.typeSorting] < itemSecond[this.state.sortSettings.typeSorting]) { return -1; };
                if (itemFirst[this.state.sortSettings.typeSorting] === itemSecond[this.state.sortSettings.typeSorting]) { return 0; };
            }
        }
    }

    outOfStockFilterCallback = (item) => {
        if (this.state.sortSettings.showOutOfStock === false) {
            if (item.count === 0) {
                return false;
            } return true;
        } return true;
    }

    /* render method */

    render() {

        return (
            <>
                <Provider store={globalStore}>
                    <SortFilterPanel
                        model={this.props.model}
                        parentStateSortSettingsUpdateCallback={this.stateSearchSettingsUpdate}
                        viewNewProductFormToggle={this.props.viewNewProductFormToggle}
                        currentSettings={this.state.sortSettings}
                        initialPriceRange={maxMinPrice(this.props.model)}
                        userStatus={{ isAdmin: true }}
                    />
                    <div className="grid-container">
                        <div className="grid-container__wrapper">
                            {this.props.model
                                .sort(this.typeSortingCallback)
                                .filter(this.searchProductCallback)
                                .filter(this.priceSegmentFilterCallback)
                                .filter(this.priceRangeCallback)
                                .sort(this.inStockSortCallback)
                                .filter(this.outOfStockFilterCallback)
                                .map((item, index) => (
                                    <ProductCardNormal key={item.article + "-gridElement"} object={item} />
                                ))}
                        </div>
                    </div>
                </Provider>
            </>
        )
    }
}