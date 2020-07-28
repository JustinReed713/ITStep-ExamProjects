import './App.css';
import React from 'react';
import {
    Backdrop,
    Button,
    Snackbar,
} from '@material-ui/core';

import { EditProductForm, GridContainer, Slider } from '../../components';
import { Alert } from '../../utils';

import { RestorePage } from '@material-ui/icons';

import { globalStore } from '../main-frame/MainFrame.js';
import { setModel } from '../../data-store/actions/actionsModelStore.js';

export const MethodContext = React.createContext(null);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newProductFormEnabled: false,
            editedProductID: null,
            draftedProduct: null
        };
    };

    /* methods for set state fields */

    handleSetStateNewProductForm = () => this.setState({ newProductFormEnabled: !this.state.newProductFormEnabled });

    handleSetStateEditedProductID = (value) => this.setState({ editedProductID: value });

    handleSetDraftedProduct = (object) => this.setState({ draftedProduct: object });

    handleCloseEditProductForm = () => {
        this.handleSetStateNewProductForm();
        this.handleSetStateEditedProductID(null);
    }

    toggleNewProductFormEnabled = () => {
        const toggledValue = !this.state.newProductFormEnabled;
        this.setState({ newProductFormEnabled: toggledValue });
    }

    handleRestoreDraftedProduct = () => {
        const newModel = this.getModel();
        newModel.splice(this.state.draftedProduct.index, 0, this.state.draftedProduct.object);
        globalStore.dispatch(setModel(newModel));
        this.handleSetDraftedProduct(null);
    }

    /* methods for work with global store */

    getModel = () => globalStore.getState().model;

    /* methods for snackbar */

    handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        };
        this.handleSetDraftedProduct(null);
    };

    /* render method */

    render() {

        const { newProductFormEnabled, editedProductID } = this.state;
        const { onPending } = this.props;

        return (
            <div className="App">
                {!onPending && (
                    <>
                        <Slider array={this.getModel().filter((item) => {
                            if ((item.sale.onSale === true) && (item.count >= 1)) {
                                if (new Date(item.sale.saleEndDate) > new Date()) {
                                    return true;
                                }
                                else return false;
                            } else if (item.count === 1) {
                                return true;
                            };
                            return false;
                        }).slice(0, 8)} />
                        <MethodContext.Provider
                            value={
                                [
                                    this.handleSetStateEditedProductID,
                                    this.handleSetStateNewProductForm,
                                    this.handleSetDraftedProduct
                                ]
                            }
                        >
                            <GridContainer
                                model={this.getModel()}
                                viewNewProductFormToggle={this.handleSetStateNewProductForm}
                            />

                        </MethodContext.Provider>
                    </>
                )}
                <div className='new-product-form'>
                    {newProductFormEnabled && (
                        <Backdrop open={newProductFormEnabled}>
                            <EditProductForm
                                handleCloseFormClick={this.handleCloseEditProductForm}
                                model={this.getModel()}
                                productID={editedProductID} />
                        </Backdrop>
                    )}
                </div>
                <Snackbar
                    open={this.state.draftedProduct !== null}
                    autoHideDuration={6000}
                    onClose={this.handleSnackbarClose}
                >
                    <Alert
                        onClose={this.handleSnackbarClose}
                        severity="info"
                    >
                        <span style={{ marginRight: 10 }}>
                            Do you want to restore product?
                        </span>
                        <Button
                            style={{ color: 'rgb(255,255,255)' }}
                            variant='text'
                            size="small"
                            onClick={this.handleRestoreDraftedProduct}
                            endIcon={<RestorePage fontSize="large"/>}
                        >
                            UNDO
                        </Button>
                    </Alert>
                </Snackbar>
            </div >
        );
    }
}

export default App;