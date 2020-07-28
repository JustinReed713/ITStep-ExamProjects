import './LogInDialog.css';
import React from 'react';
import {
    AppBar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Menu,
    MenuItem,
    Slide,
    TextField,
    Toolbar,
} from '@material-ui/core';

import { Breadcrumbs, globalStore } from '../../components.js';
import { setUser, setCart } from '../../data-store/actions/actionsModelStore.js';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function HeaderMenu(props) {
    const [openDialog, setOpenDialog] = React.useState(false);
    const [userName, setUserName] = React.useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClickDialogOpen = () => setOpenDialog(true);

    const handleDialogClose = () => setOpenDialog(false);

    const logInConfirm = () => {
        globalStore.dispatch(setUser(userName));
        if (globalStore.getState().userName === "admin") {
            globalStore.dispatch(setCart([]));
        }
        handleDialogClose();
    }

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);

    const handleMenuClose = () => setAnchorEl(null);

    const handleLogOutClick = () => {
        globalStore.dispatch(setUser(""));
        handleMenuClose();
    }

    return (
        <>
            <AppBar position="static" color="transparent">
                <Toolbar variant='dense' className="header-menu__toolbar">
                    <Breadcrumbs />
                    {globalStore.getState().userName === "" ? (
                        <Button color="inherit" onClick={handleClickDialogOpen}>Login</Button>
                    ) : (
                            <>
                                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleMenuOpen}>
                                    {globalStore.getState().userName}
                                </Button>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={handleLogOutClick}>LogOut</MenuItem>
                                </Menu>
                            </>
                        )}
                </Toolbar>
            </AppBar >
            <Dialog
                open={openDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"LOG IN"}</DialogTitle>
                <div className="log-in-dialog__inputs-wrapper">
                    <TextField
                        margin='normal'
                        id="login-input"
                        label="Login"
                        defaultValue={userName}
                        onChange={(event) => setUserName(event.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        margin='normal'
                        id="password-input"
                        label="Password"
                        fullWidth
                        required
                    />
                </div>
                <DialogContent>
                    <DialogContentText>For entering as administrator use template</DialogContentText>
                    <DialogContentText>admin/admin</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={logInConfirm} color="primary" variant='outlined'>
                        LOG IN NOW
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}