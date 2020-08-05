import './LogInDialog.css';
import './HeaderMenu.scss';
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
    Switch,
    TextField,
    Toolbar,
    Typography
} from '@material-ui/core';

import { Breadcrumbs, globalStore } from '../../components';
import { setUser, setCart } from '../../data-store/actions/actionsModelStore.js';
import { textCapitalizer } from '../../utils';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function HeaderMenu(props) {
    const [openDialog, setOpenDialog] = React.useState(false);
    const [userName, setUserName] = React.useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [themeSelect, setThemeSelect] = React.useState(false);

    const handleClickDialogOpen = () => setOpenDialog(true);

    const handleThemeSelect = (event) => {
        setThemeSelect(event.target.checked);
        document.getElementsByTagName("html")[0].setAttribute("data-theme", themeSelect === false ? "dark" : "light")
    }

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
                    <div className="header-menu-toolbar__control-block">
                        <div className="header-menu-toolbar-control-block__theme-toggle">
                            <Typography>
                                {textCapitalizer(document.getElementsByTagName("html")[0].getAttribute("data-theme"))}
                            </Typography>
                            <Switch
                                checked={themeSelect}
                                onChange={handleThemeSelect}
                                color="primary"
                                name="checkedB"
                            />
                        </div>
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
                    </div>
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