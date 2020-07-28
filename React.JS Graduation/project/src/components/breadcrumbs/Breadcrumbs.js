import React from "react";
import { Breadcrumbs as MUIBreadcrumbs, Typography } from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";

function Breadcrumbs(props) {
    const {
        history,
        location: { pathname }
    } = props;
    const pathNames = pathname.split("/").filter(x => x);
    return (
        <MUIBreadcrumbs aria-label="breadcrumb">
            {pathNames.length > 0 ? (
                <Link to="/">Home</Link>
            ) : (
                    <Typography> Home </Typography>
                )}
            {pathNames.map((name, index) => {
                const routeTo = `/${pathNames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathNames.length - 1;
                return ((isLast === true) || (name === 'product')) ? (
                    <Typography key={name}>{name}</Typography>
                ) : (
                        <Link key={name} onClick={() => history.push(routeTo)}>
                            {name}
                        </Link>
                    );
            })}
        </MUIBreadcrumbs>
    );
};

export default withRouter(Breadcrumbs);