import React from 'react';
import { Backdrop, CircularProgress, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import { Switch, Route } from 'react-router-dom';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import storeApp from '../../data-store/modelStore.js';
import { setModel } from '../../data-store/actions/actionsModelStore.js';

import { App, Header, ProductPage, BackToTop, HeaderMenu, Checkout } from '../../components';
import { Product } from '../../utils';
import { requestURL, testArray } from '../../globals.js';

/* creating global storage */
export const globalStore = createStore(storeApp);

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default class MainFrame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onPending: true,
            successPayment: false
        }
    }

    /* getting data from back-end */

    UNSAFE_componentWillMount() {
        fetch(requestURL, {
            mode: "no-cors"
        })
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(new Error(response.statusText))
                }
                return Promise.resolve(response)
            })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                globalStore.dispatch(setModel(data));
                this.setState({ onPending: !this.state.onPending })
            })
            .catch((error) => {
                console.warn(`Something went wrong. Can't load data from "${requestURL}". Using testing array for continue work.`);
                globalStore.dispatch(setModel(testArray.map((item) => Object.assign(new Product(), item))));
                this.setState({ onPending: !this.state.onPending })
            })
    }

    /* additional methods */

    getObject = () => globalStore.getState().model.filter((item) => item.article === window.location.pathname.slice(9))[0];

    getLocationPath = () => window.location.pathname

    showSnackbarSuccessPayment = () => this.setState({ successPayment: true });

    handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ successPayment: false });
    }

    /* render method */

    render() {
        return (
            <>
                <Header text="Welcome to our shop!">
                    <HeaderMenu path={this.getLocationPath()} />
                </ Header>
                <Switch>
                    <Route exact path="/" render={() => <App onPending={this.state.onPending} />} />
                    <Route exact path="/checkout" render={() => <Checkout showSnackbarSuccessPayment={this.showSnackbarSuccessPayment} />} />
                    <Provider store={globalStore}>
                        <Route path="/product/:article" render={() => <ProductPage object={this.getObject()} />} />
                    </Provider>
                </Switch>
                <div className='on-pending-backdrop'>
                    <Backdrop open={this.state.onPending}>
                        <CircularProgress color="primary" />
                    </Backdrop>
                </div>
                <BackToTop />
                <Snackbar open={this.state.successPayment} autoHideDuration={6000} onClose={this.handleSnackbarClose}>
                    <Alert onClose={this.handleSnackbarClose} severity="success">
                        Your payment was successful!
                    </Alert>
                </Snackbar>
            </>
        )
    }
}